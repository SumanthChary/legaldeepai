// @ts-nocheck
/* eslint-disable */

import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { supabaseAdmin } from "../_shared/supabaseAdminClient.ts";
import { respond, handleOptions, corsHeaders } from "../_shared/http.ts";
import { hashValue, createSignedJwt } from "../_shared/crypto.ts";

const sessionSecret = (globalThis as any).Deno?.env.get("ESIGN_SESSION_SECRET") || (globalThis as any).process?.env?.ESIGN_SESSION_SECRET;

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

	const { token, code } = payload;
	if (!token || !code) {
		return respond(400, { error: "token and code are required" });
	}

	const tokenHash = await hashValue(token);

	const { data: session, error: sessionError } = await supabaseAdmin
		.from("signing_sessions")
		.select(`
			id,
			signer_email,
			otp_code_hash,
			otp_code_expires_at,
			otp_attempts,
			audit_trail,
			otp_verified_at,
			expires_at,
			field:signature_fields!signing_sessions_field_id_fkey (
				id,
				request_id,
				request:signature_requests (
					id,
					document_name
				)
			)
		`)
		.eq("session_token", tokenHash)
		.single();

	if (sessionError || !session) {
		return respond(404, { error: "Session not found" });
	}

	if (session.otp_verified_at) {
		return respond(200, { success: true, message: "OTP already verified" });
	}

	const now = new Date();
	if (session.expires_at && new Date(session.expires_at) < now) {
		return respond(410, { error: "Signing session expired" });
	}

	if (session.otp_code_expires_at && new Date(session.otp_code_expires_at) < now) {
		await supabaseAdmin
			.from("signature_events")
			.insert({
				request_id: session.field.request.id,
				session_id: session.id,
				event_type: "otp_expired",
				actor_type: "signer",
				actor_email: session.signer_email,
			});
		return respond(410, { error: "OTP expired" });
	}

	if (session.otp_attempts >= 5) {
		return respond(429, { error: "Too many attempts. Please request a new code." });
	}

	const attemptedHash = await hashValue(`${token}:${code}`);

	if (attemptedHash !== session.otp_code_hash) {
		const updatedTrail = [...(session.audit_trail || []), { event: "otp_failed", at: now.toISOString() }];
		await supabaseAdmin
			.from("signing_sessions")
			.update({ otp_attempts: session.otp_attempts + 1, audit_trail: updatedTrail })
			.eq("id", session.id);

		await supabaseAdmin
			.from("signature_events")
			.insert({
				request_id: session.field.request.id,
				session_id: session.id,
				event_type: "otp_failed",
				actor_type: "signer",
				actor_email: session.signer_email,
				payload: { attempts: session.otp_attempts + 1 },
			});

		return respond(401, { error: "Invalid verification code" });
	}

	const updatedTrail = [...(session.audit_trail || []), { event: "otp_verified", at: now.toISOString() }];

	await supabaseAdmin
		.from("signing_sessions")
		.update({
			otp_attempts: session.otp_attempts,
			otp_verified_at: now.toISOString(),
			audit_trail: updatedTrail,
		})
		.eq("id", session.id);

	await supabaseAdmin
		.from("signature_events")
		.insert({
			request_id: session.field.request.id,
			session_id: session.id,
			event_type: "otp_verified",
			actor_type: "signer",
			actor_email: session.signer_email,
		});

	if (!sessionSecret) {
		return respond(200, { success: true, warning: "Missing session secret. Subsequent calls must re-verify." });
	}

	const jwt = await createSignedJwt({
		payload: {
			sessionId: session.id,
			tokenHash,
			signerEmail: session.signer_email,
			reqId: session.field.request.id,
		},
		secret: sessionSecret,
		expiresInSeconds: 30 * 60,
	});

	return new Response(
		JSON.stringify({
			success: true,
			accessToken: jwt,
			expiresIn: 30 * 60,
		}),
		{ status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
	);
};

serve(handler);
