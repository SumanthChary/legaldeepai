# LegalDeepAI E-Signature Architecture

## Objectives
- Deliver end-to-end e-sign flow comparable to commercial platforms without paid dependencies.
- Ensure signer identity verification, consent capture, tamper evidence, and auditability.
- Preserve compatibility with Vite/Supabase stack.

## Domain Model
- `signature_requests`: owner metadata, status, storage paths, document hash.
- `signature_fields`: typed placements per signer (signature, initials, date, text).
- `signing_sessions`: per-signer link + OTP credentials, lifecycle timestamps.
- `signatures`: captured signature artefacts (image + metadata).
- `signature_events`: append-only audit log (session_id, event_type, payload, timestamp, actor).

## Workflow Overview
1. **Request creation**
   - Owner uploads PDF to `esignatures/original/<uuid>.pdf` via Supabase Storage.
   - Owner specifies signer email(s) + optional role/sequence.
   - Edge function `create-signing-session` creates signing_sessions rows (token + OTP hash, expiry) and queues invite email.
   - Request status transitions to `in_progress`.

2. **Signer invitation & verification**
   - Email contains deep link `${FRONTEND_URL}/sign/${token}`.
   - Signer opens link, edge function `get-signing-session` verifies token, returns sanitized payload (document preview URL, consent copy, requires OTP).
   - Signer enters OTP received via same email; edge function `verify-signing-otp` matches hash, increments attempt counter, records event, sets `otp_verified_at`.

3. **Signing UI**
   - React page fetches field placements, renders PDF-first page using pdfjs-dist + overlay.
   - SignaturePad captures ink data; typed signature fallback renders in selected font.
   - Signer confirms adoption + consent.

4. **Finalisation**
   - Edge function `complete-signature` performs server-side PDF stamping:
     - Downloads original PDF, embeds signature image per field (pdf-lib), writes final document to `esignatures/completed/<request_id>.pdf`.
     - Computes SHA-256 hash, stores on signature_requests.
     - Appends audit page summarising signer metadata + event chronology.
     - Updates signatures/signing_sessions tables and flips request status to `completed` when all required fields signed.

5. **Distribution & storage**
   - Request owner notified via email.
   - Completed PDF accessible via short-lived signed URLs only.
   - Audit events queryable for compliance.

## Security & Compliance
- OTP: 6-digit numeric, hashed with SHA-256 + salt, expires in 15 minutes, rate-limited (max 5 attempts).
- Tokens: 32-byte random hex, stored hashed, transmitted once via email.
- Emails: Resend API (existing integration) with transactional template.
- Storage: Files encrypted at rest by Supabase; optional AES-256 envelope encryption to be added.
- Audit: Every state change recorded in `signature_events`.
- Tamper evidence: Final PDF hash stored in DB and audit page; future enhancement to add self-signed X.509 signature.

## Frontend Pages & Components
- `ESignatures` (owner dashboard): displays request lifecycle, resend invites, view audit trail, download completed docs.
- `SignDocument` (public route): OTP verification, consent, signature capture, review page.
- Shared UI components: `SignaturePadCanvas`, `OtpInput`, `AuditTimeline`.

## Edge Functions
- `create-signing-session`: POST owner-auth, expects request_id, signer list.
- `get-signing-session`: POST public, expects token, returns session metadata, masked email, doc preview URL, status.
- `resend-signing-otp`: POST owner or signer, regenerates OTP, rate-limited.
- `verify-signing-otp`: POST public, token + otp, returns signed JWT for subsequent calls (exp 30 min).
- `complete-signature`: POST public, token + signature payload + optional fields; validates OTP JWT, performs stamping, returns download URL.
- Utility modules for Supabase Admin client, Resend mailer, pdf-lib stamping, audit logging.

## Testing Strategy
- Unit: OTP hashing/validation, token creation utilities.
- Integration: Edge function flows using Supabase test harness.
- E2E: Playwright/Cypress scenario covering invite → OTP → sign → download, using mock Resend (local send).
- PDF validation: hash consistency + pdf-lib coordinate smoke tests.

## Deployment Considerations
- Env vars: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `FRONTEND_URL`, `ESIGN_EMAIL_FROM`.
- Apply new SQL migration for added columns/tables.
- Ensure Edge functions listed in `supabase/config.toml` for deploy.

## Roadmap Enhancements
- Multi-signer sequencing, reminder cron, SMS OTP integration, digital certificate signing, SOC2 audit exports.
