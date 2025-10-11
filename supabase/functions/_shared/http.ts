// @ts-nocheck
/* eslint-disable */

const defaultCorsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export const corsHeaders = defaultCorsHeaders;

export const respond = (status, body) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json", ...defaultCorsHeaders },
	});

export const handleOptions = () =>
	new Response("ok", {
		status: 200,
		headers: defaultCorsHeaders,
	});
