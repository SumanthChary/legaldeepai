// @ts-nocheck
/* eslint-disable */

import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { supabaseAdmin } from "../_shared/supabaseAdminClient.ts";
import { respond, handleOptions, corsHeaders } from "../_shared/http.ts";
import { hashValue } from "../_shared/crypto.ts";

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

	const { token } = payload;
	if (!token) {
		return respond(400, { error: "token is required" });
	}

	const tokenHash = await hashValue(token);

	const { data: session, error: sessionError } = await supabaseAdmin
		.from("signing_sessions")
		.select(`
			id,
			signer_email,
			expires_at,
			otp_verified_at,
			signed,
			signed_at,
			audit_trail,
			field:signature_fields!signing_sessions_field_id_fkey (
				id,
				request_id,
				request:signature_requests (
					id,
					document_name,
					document_path,
					status
				)
			)
		`)
		.eq("session_token", tokenHash)
		.single();

	if (sessionError || !session) {
		return respond(404, { error: "Session not found" });
	}

	const now = new Date();
	if (session.expires_at && new Date(session.expires_at) < now) {
		return respond(410, { error: "Signing session expired" });
	}

	const signerMasked = session.signer_email.replace(/(.{2}).+(@.+)/, (_, prefix, domain) => `${prefix}***${domain}`);

	await supabaseAdmin
		.from("signature_events")
		.insert({
			request_id: session.field.request.id,
			session_id: session.id,
			event_type: "session_viewed",
			actor_type: "signer",
			payload: { maskedEmail: signerMasked },
		});

	return new Response(
		JSON.stringify({
			requestId: session.field.request.id,
			documentName: session.field.request.document_name,
			documentPath: session.field.request.document_path,
			signer: signerMasked,
			status: session.field.request.status,
			expiresAt: session.expires_at,
			signedAt: session.signed_at,
			otpVerified: Boolean(session.otp_verified_at),
			completed: Boolean(session.signed_at),
			auditTrailLength: Array.isArray(session.audit_trail) ? session.audit_trail.length : 0,
		}),
		{ status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
	);
};

serve(handler);
