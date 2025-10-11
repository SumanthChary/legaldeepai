# Manual E-Signature QA Checklist

Use this guide whenever you need to verify the LegalDeep AI e-signature flow end to end. It assumes you already cloned the repository and have the Supabase project `nhmhqhhxlcmhufxxifbn` linked.

---

## 1. Environment preparation

1. **Install dependencies** (one time per machine):
   ```bash
   npm install
   ```
2. **Copy the baseline env file** (skip if already configured):
   ```bash
   cp .env .env.local
   ```
3. **Populate the following variables** in `.env.local` (or your deployment provider):

   | Variable | Purpose |
   | --- | --- |
   | `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` | Already provided in `.env`; ensure they match your Supabase project. |
   | `RESEND_API_KEY` | Required so signers receive the OTP email. A Resend sandbox key works for testing. |
   | `ESIGN_EMAIL_FROM` | e.g. `LegalDeep AI <noreply@resend.dev>`. |
   | `ESIGN_SESSION_SECRET` | Any 32+ character string (used for signer JWTs). |
   | `FRONTEND_URL` | Base URL for links sent in email. For local testing use `http://localhost:8080`. |

4. **Authenticate the Supabase CLI** (if you plan to re-run deployments):
   ```bash
   npx supabase@latest login --token <your_supabase_access_token>
   npx supabase@latest link --project-ref nhmhqhhxlcmhufxxifbn --password "<current_postgres_password>"
   ```

The migrations and edge functions are already deployed, so no further CLI actions are required just to test locally.

---

## 2. Launch the local app

```bash
npm run dev
```

Visit `http://localhost:8080` in your browser. Use an existing account or create a new one via the auth flow. After signing in, open the **E-Signatures** page from the dashboard.

---

## 3. Owner flow – create a signing request

1. Prepare a small PDF for testing (even a one-page placeholder works).
2. On `/esignatures`, fill out **Signer Email** with an inbox you can access (Gmail, etc.).
3. Upload the PDF and click **Create Signature Request**.
4. Expected outcomes:
   - Toast pops up confirming the invite was sent.
   - A new card appears under “My Signature Requests” with status `in progress`.
   - In Supabase → Storage bucket `esignatures`, the raw PDF is uploaded.
   - Supabase tables:
     - `signature_requests`: new row, status `in_progress`.
     - `signature_fields`: new row tied to the request.
     - `signing_sessions`: new row with hashed token + OTP (OTP is hashed; original is only in the email).
     - `signature_events`: `session_created` event logged.

> **Tip:** If emails are not arriving, double-check the Resend API key and `ESIGN_EMAIL_FROM`. Resend’s event log is helpful for diagnosing delivery issues.

---

## 4. Signer flow – verify identity & sign

1. Open the invite email from Resend. It contains:
   - A **Review & Sign** button (link format `https://<FRONTEND_URL>/sign/<sessionToken>`).
   - The **6-digit OTP**.
2. Click the link (or copy/paste into the browser).
3. On the signing page:
   - Enter the OTP code and click **Verify code**. You should see a success toast.
   - Type your name in “Printed name”.
   - Draw a signature in the pad.
   - Click **Sign document** and wait for the confirmation toast.
4. Expected database/storage updates:
   - `signature_requests`: status flips to `completed`, `completed_document_path`/`document_hash` filled in.
   - `signing_sessions`: `otp_verified_at`, `signed_at`, and `audit_trail` get updated.
   - `signature_events`: entries for `otp_verified`, `document_signed`, etc.
   - Storage bucket `esignatures`: a stamped PDF appears alongside the original (filename ends in `-signed.pdf`).

---

## 5. Owner confirmation & download

Back on `/esignatures` (refresh if needed):

- The card now shows status `completed` and displays the document hash.
- Click **Download** to fetch the signed PDF. Confirm the signature image, name, timestamp, and audit page are embedded.

---

## 6. Negative/edge case checks

1. **Invalid OTP** – enter an incorrect code first; the toast should report “Verification failed”.
2. **Expired OTP** – wait 15 minutes (or temporarily shorten the expiry in the function) and reattempt; you should see an expiry error.
3. **Repeat signing attempt** – reload the `/sign/<token>` page after completion; it should show the completed state and block further signing.
4. **Owner deletion** – back on `/esignatures`, use the **Delete** button to remove a request. Verify the row and storage objects are deleted.

---

## 7. Cleaning up

- Remove any test records from the Supabase tables via the dashboard or SQL if you don’t want them persisted.
- Delete test PDFs from the `esignatures` storage bucket.

Following the checklist above ensures the full e-signature experience (owner invite, email delivery, OTP verification, signing, document stamping, and audit logging) continues to operate end to end.
