// @ts-nocheck
/* eslint-disable */

import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { PDFDocument, StandardFonts } from "npm:pdf-lib@1.17.1";
import { supabaseAdmin } from "../_shared/supabaseAdminClient.ts";
import { respond, handleOptions, corsHeaders } from "../_shared/http.ts";
import { hashValue, verifySignedJwt } from "../_shared/crypto.ts";

const sessionSecret = (globalThis as any).Deno?.env.get("ESIGN_SESSION_SECRET") || (globalThis as any).process?.env?.ESIGN_SESSION_SECRET;

const bucket = "esignatures";

const decodeBase64DataUrl = (dataUrl: string) => {
	if (!dataUrl?.startsWith("data:")) {
		throw new Error("Invalid signature payload");
	}
	const [meta, data] = dataUrl.split(",");
	const mime = meta.substring(5, meta.indexOf(";"));
	const binary = atob(data);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return { bytes, mime };
};

const handler = async (req: Request): Promise<Response> => {
	if (req.method === "OPTIONS") {
		return handleOptions();
	}

	if (req.method !== "POST") {
		return respond(405, { error: "Method not allowed" });
	}

	let payload;
	try {
		payload = await req.json();
	} catch (_err) {
		return respond(400, { error: "Invalid JSON payload" });
	}

	const forwardedIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	const userAgentHeader = req.headers.get("user-agent") || undefined;

	const { token, accessToken, signatureData, signerName, ipAddress, userAgent, consentAccepted } = payload;

	if (!token || !signatureData || !signerName) {
		return respond(400, { error: "token, signatureData, and signerName are required" });
	}

	if (!consentAccepted) {
		return respond(400, { error: "Consent must be accepted before signing" });
	}

	if (sessionSecret && !accessToken) {
		return respond(401, { error: "Missing accessToken" });
	}

	const tokenHash = await hashValue(token);

	if (sessionSecret && accessToken) {
		const verified = await verifySignedJwt({ token: accessToken, secret: sessionSecret });
		if (!verified || verified.tokenHash !== tokenHash) {
			return respond(401, { error: "Invalid access token" });
		}
	}

	const { data: session, error: sessionError } = await supabaseAdmin
		.from("signing_sessions")
		.select(`
			id,
			signer_email,
			signed,
			signed_at,
			otp_verified_at,
			audit_trail,
			expires_at,
			field:signature_fields!signing_sessions_field_id_fkey (
				id,
				field_type,
				position,
				assigned_signer_email,
				request:signature_requests (
					id,
					user_id,
					document_name,
					document_path,
					completed_document_path,
					document_hash,
					status
				)
			)
		`)
		.eq("session_token", tokenHash)
		.single();

	if (sessionError || !session) {
		return respond(404, { error: "Session not found" });
	}

	if (!session.otp_verified_at) {
		return respond(401, { error: "Verification required before signing" });
	}

	if (session.signed) {
		return respond(409, { error: "This session has already been completed" });
	}

	const now = new Date();
	if (session.expires_at && new Date(session.expires_at) < now) {
		return respond(410, { error: "Signing session expired" });
	}

	if (!session.field?.request) {
		return respond(500, { error: "Session is missing request linkage" });
	}

	const originalPath = session.field.request.document_path;
	const signedPath = `completed/${session.field.request.id}.pdf`;

	const { data: file, error: downloadError } = await supabaseAdmin.storage.from(bucket).download(originalPath);
	if (downloadError || !file) {
		return respond(500, { error: "Unable to download document", details: downloadError?.message });
	}
	const originalBytes = new Uint8Array(await file.arrayBuffer());

	const pdfDoc = await PDFDocument.load(originalBytes);
	const pages = pdfDoc.getPages();

	const position = session.field.position || { page: 1, x: 100, y: 200, width: 200, height: 60 };
	const targetPage = pages[(position.page ?? 1) - 1] || pages[0];

	const { bytes: signatureBytes, mime } = decodeBase64DataUrl(signatureData);
	let signatureImage;
	if (mime === "image/png") {
		signatureImage = await pdfDoc.embedPng(signatureBytes);
	} else {
		signatureImage = await pdfDoc.embedJpg(signatureBytes);
	}

	const pageHeight = targetPage.getHeight();
	const y = pageHeight - (position.y ?? 0) - (position.height ?? signatureImage.height);

	targetPage.drawImage(signatureImage, {
		x: position.x ?? 0,
		y,
		width: position.width ?? signatureImage.width,
		height: position.height ?? signatureImage.height,
	});

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const auditPage = pdfDoc.addPage();
	auditPage.drawText("LegalDeep AI Signature Certificate", { x: 40, y: auditPage.getHeight() - 60, size: 18, font });
	auditPage.drawText(`Document: ${session.field.request.document_name}`, { x: 40, y: auditPage.getHeight() - 100, size: 12, font });
	auditPage.drawText(`Signed by: ${signerName} <${session.signer_email}>`, { x: 40, y: auditPage.getHeight() - 120, size: 12, font });
	auditPage.drawText(`Signed at: ${now.toISOString()}`, { x: 40, y: auditPage.getHeight() - 140, size: 12, font });
	if (resolvedIp) {
		auditPage.drawText(`IP Address: ${resolvedIp}`, { x: 40, y: auditPage.getHeight() - 160, size: 12, font });
	}
	if (resolvedAgent) {
		auditPage.drawText(`User Agent: ${resolvedAgent.substring(0, 80)}`, { x: 40, y: auditPage.getHeight() - 180, size: 12, font });
	}

	const finalBytes = await pdfDoc.save();
	const documentHash = await hashValue(finalBytes);

	const uploadResult = await supabaseAdmin.storage
		.from(bucket)
		.upload(signedPath, new Blob([finalBytes], { type: "application/pdf" }), { upsert: true, cacheControl: "3600" });

	if (uploadResult.error) {
		return respond(500, { error: "Failed to upload signed document", details: uploadResult.error.message });
	}

	const resolvedIp = forwardedIp || ipAddress;
	const resolvedAgent = userAgent || userAgentHeader;

	await supabaseAdmin
		.from("signatures")
		.insert({
			field_id: session.field.id,
			signer_email: session.signer_email,
			signature_image: signatureData,
			signed_at: now.toISOString(),
			ip_address: resolvedIp,
			user_agent: resolvedAgent,
		});

	const updatedTrail = [...(session.audit_trail || []), { event: "document_signed", at: now.toISOString() }];

	await supabaseAdmin
		.from("signing_sessions")
		.update({
			signed: true,
			signed_at: now.toISOString(),
			audit_trail: updatedTrail,
		})
		.eq("id", session.id);

	const { data: fieldIdRows } = await supabaseAdmin
		.from("signature_fields")
		.select("id")
		.eq("request_id", session.field.request.id);

	let nextStatus = "completed";
	if (fieldIdRows && fieldIdRows.length > 0) {
		const fieldIds = fieldIdRows.map((row) => row.id);
		const { data: remaining } = await supabaseAdmin
			.from("signing_sessions")
			.select("id")
			.in("field_id", fieldIds)
			.eq("signed", false);
		if (remaining && remaining.length > 0) {
			nextStatus = "in_progress";
		}
	}

	await supabaseAdmin
		.from("signature_requests")
		.update({
			status: nextStatus,
			completed_document_path: signedPath,
			document_hash: documentHash,
		})
		.eq("id", session.field.request.id);

	await supabaseAdmin
		.from("signature_events")
		.insert({
			request_id: session.field.request.id,
			session_id: session.id,
			event_type: "document_signed",
			actor_type: "signer",
			actor_email: session.signer_email,
			payload: { signerName, ip: resolvedIp },
		});

	return new Response(
		JSON.stringify({
			success: true,
			documentHash,
			downloadPath: signedPath,
		}),
		{ status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
	);
};

serve(handler);
