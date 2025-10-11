// @ts-nocheck
/* eslint-disable */

import { encode as encodeToBase64Url } from "https://deno.land/std@0.201.0/encoding/base64url.ts";

const textEncoder = new TextEncoder();

export const randomToken = (size = 32) => {
	const bytes = crypto.getRandomValues(new Uint8Array(size));
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

export const randomOtp = () => {
	return ("" + Math.floor(100000 + Math.random() * 900000));
};

export const hashValue = async (input) => {
	const data = typeof input === "string" ? textEncoder.encode(input) : input;
	const digest = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
};

export const createSignedJwt = async ({ payload, secret, expiresInSeconds }) => {
	const header = { alg: "HS256", typ: "JWT" };
	const issuedAt = Math.floor(Date.now() / 1000);
	const exp = issuedAt + expiresInSeconds;
	const fullPayload = { ...payload, iat: issuedAt, exp };

	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);

	const partial = `${encodeToBase64Url(JSON.stringify(header))}.${encodeToBase64Url(JSON.stringify(fullPayload))}`;
	const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(partial));
	return `${partial}.${encodeToBase64Url(new Uint8Array(signature))}`;
};

export const verifySignedJwt = async ({ token, secret }) => {
	const encoder = new TextEncoder();
	const parts = token.split(".");
	if (parts.length !== 3) return null;

	const [headerEncoded, payloadEncoded, signatureEncoded] = parts;

	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["verify"]
	);

	const data = `${headerEncoded}.${payloadEncoded}`;
	const signature = Uint8Array.from(atob(signatureEncoded.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

	const valid = await crypto.subtle.verify("HMAC", key, signature, encoder.encode(data));
	if (!valid) return null;

	const payloadJson = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payloadEncoded.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))));

	if (payloadJson.exp && payloadJson.exp < Math.floor(Date.now() / 1000)) {
		return null;
	}

	return payloadJson;
};
