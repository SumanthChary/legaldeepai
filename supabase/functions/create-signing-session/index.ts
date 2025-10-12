// @ts-nocheck
/* eslint-disable */

import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { Resend } from "npm:resend@2.1.0";
import { supabaseAdmin } from "../_shared/supabaseAdminClient.ts";
import { respond, handleOptions, corsHeaders } from "../_shared/http.ts";
import { randomToken, randomOtp, hashValue } from "../_shared/crypto.ts";

const resendApiKey = (globalThis as any).Deno?.env.get("RESEND_API_KEY") || (globalThis as any).process?.env?.RESEND_API_KEY;
const frontendUrl =
	(globalThis as any).Deno?.env.get("FRONTEND_URL") ||
	(globalThis as any).process?.env?.FRONTEND_URL ||
	"https://legaldeepai.lovable.app";
const fromEmail = (globalThis as any).Deno?.env.get("ESIGN_EMAIL_FROM") || "LegalDeep AI <noreply@resend.dev>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const handler = async (req: Request): Promise<Response> => {
	if (req.method === "OPTIONS") {
		return handleOptions();
	}

	if (req.method !== "POST") {
		return respond(405, { error: "Method not allowed" });
	}

	const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
	if (!authHeader) {
		return respond(401, { error: "Missing authorization header" });
	}

	const jwt = authHeader.replace("Bearer ", "").trim();
	const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(jwt);

	if (userError || !userData?.user) {
		return respond(401, { error: "Invalid or expired token" });
	}

	let payload;
	try {
		payload = await req.json();
	} catch (_err) {
		return respond(400, { error: "Invalid JSON payload" });
	}

	const { requestId, signerEmail, signerName } = payload;
	if (!requestId || !signerEmail) {
		return respond(400, { error: "requestId and signerEmail are required" });
	}

	const normalizedEmail = signerEmail.trim().toLowerCase();

	const { data: request, error: requestError } = await supabaseAdmin
		.from("signature_requests")
		.select("id, user_id, document_name, document_path, status")
		.eq("id", requestId)
		.single();

	if (requestError || !request) {
		return respond(404, { error: "Signature request not found" });
	}

	if (request.user_id !== userData.user.id) {
		return respond(403, { error: "You do not have permission to invite signers for this request" });
	}

	const sessionToken = randomToken(32);
	const sessionTokenHash = await hashValue(sessionToken);
	const otpCode = randomOtp();
	const otpHash = await hashValue(`${sessionToken}:${otpCode}`);
	const now = new Date();
	const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
	const otpExpiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes

	const { data: field, error: fieldError } = await supabaseAdmin
		.from("signature_fields")
		.select("id")
		.eq("request_id", requestId)
		.eq("assigned_signer_email", normalizedEmail)
		.single();

	if (fieldError || !field) {
		return respond(400, { error: "No signature field assigned to this signer" });
	}

	const { data: sessionInsert, error: sessionError } = await supabaseAdmin
		.from("signing_sessions")
		.insert({
			field_id: field.id,
			signer_email: normalizedEmail,
			session_token: sessionTokenHash,
			expires_at: expiresAt.toISOString(),
			otp_code_hash: otpHash,
			otp_code_expires_at: otpExpiresAt.toISOString(),
			audit_trail: [
				{
					event: "session_created",
					at: now.toISOString(),
					actor: "owner",
					email: userData.user.email,
				},
			],
			last_email_at: now.toISOString(),
		})
		.select()
		.single();

	if (sessionError || !sessionInsert) {
		return respond(500, { error: "Failed to create signing session", details: sessionError?.message });
	}

	await supabaseAdmin
		.from("signature_events")
		.insert({
			request_id: requestId,
			session_id: sessionInsert.id,
			event_type: "session_created",
			actor_type: "owner",
			actor_email: userData.user.email,
			payload: { signerEmail: normalizedEmail },
		});

	await supabaseAdmin
		.from("signature_requests")
		.update({ status: "in_progress" })
		.eq("id", requestId);

	if (resend) {
		const link = `${frontendUrl.replace(/\/$/, "")}/sign/${sessionToken}`;
		const subject = `Action required: Sign "${request.document_name}"`;
		const html = `
			<h2>Hello${signerName ? ` ${signerName}` : ""},</h2>
			<p>You have been invited to sign <strong>${request.document_name}</strong> on LegalDeep AI.</p>
			<p>Your one-time verification code is:</p>
			<h1 style="font-size: 32px; letter-spacing: 6px;">${otpCode}</h1>
			<p>This code expires in 15 minutes.</p>
			<p>Use the secure link below to review and sign the document:</p>
			<p><a href="${link}" style="display:inline-block;padding:12px 18px;background:#5b21b6;color:#fff;border-radius:8px;text-decoration:none;">Review & Sign Document</a></p>
			<p>If the button above does not work, copy and paste this URL into your browser:</p>
			<p>${link}</p>
			<p>Thank you,<br/>LegalDeep AI</p>
		`;

		try {
			await resend.emails.send({
				from: fromEmail,
				to: [normalizedEmail],
				subject,
				html,
			});
		} catch (emailError) {
			console.error("Failed to send signing invite", emailError);
			await supabaseAdmin
				.from("signature_events")
				.insert({
					request_id: requestId,
					session_id: sessionInsert.id,
					event_type: "email_send_failed",
					actor_type: "system",
					payload: { error: emailError?.message },
				});
		}
	}

	return new Response(
		JSON.stringify({
			sessionToken,
			requestId,
			signerEmail: normalizedEmail,
			expiresAt: expiresAt.toISOString(),
		}),
		{ status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
	);
};

serve(handler);
