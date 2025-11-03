# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/23c234e7-6ce5-45ea-922e-e53a2fe9f5fe

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/23c234e7-6ce5-45ea-922e-e53a2fe9f5fe) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Firefox "LegalDeep AI Risk Inspector" extension

The repository also ships a standalone Firefox browser extension that lets Legal, Sales, and RevOps teams highlight contract language and instantly surface risk signals.

- **Source location:** `extension/firefox/`
- **Key files:**
	- `manifest.json` – WebExtension manifest (Firefox, Manifest V2)
	- `background.js` – registers the "Analyze with LegalDeep AI" context-menu action
	- `riskAnalyzer.js` – shared heuristic engine for scoring risk indicators
	- `contentScript.js` – gathers selected text or full-page content and stores results
	- `popup.html` / `popup.js` / `popup.css` – in-browser dashboard for results and custom text checks

### Install for local testing (temporary load)

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and choose any file inside `extension/firefox/` (for example `manifest.json`).
3. Visit any page, select contract language, right-click, and choose **Analyze with LegalDeep AI**. The popup updates with the latest score and flagged issues.
4. Use the popup buttons to rerun selection scans, analyze the full page, or paste custom text.

### Package for distribution

```bash
npm run package:firefox
```

The script emits `extension/dist/legaldeep-ai-firefox-v<version>.zip` and a backwards-compatible copy at `extension/legaldeep-ai-<version>.zip`. Upload either file directly through the [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)—do **not** re-zip the repository or the `firefox/` folder, otherwise AMO won’t find `manifest.json`. See [`docs/firefox-extension-upload.md`](docs/firefox-extension-upload.md) if you need a refresher.

### Troubleshooting tips

- If the popup shows "Analysis engine unavailable", ensure both `riskAnalyzer.js` and `contentScript.js` are loaded (Firefox logs appear under **about:debugging → Inspect**).
- Large documents are truncated to the first 50k characters for performance; the popup will note when truncation occurs.
- To clear highlighted spans from a previous scan, rerun an analysis or refresh the page.

## E-signature quickstart

The e-signature workflow now mirrors commercial tools while remaining self-hosted. To test it locally:

1. Set the following environment variables (in `.env` or your hosting provider):
	- `RESEND_API_KEY` – transactional email provider for OTP delivery.
	- `ESIGN_EMAIL_FROM` – from address, e.g. `LegalDeep AI <noreply@yourdomain.com>`.
	- `ESIGN_SESSION_SECRET` – 32+ character secret for signer access tokens.
	- `FRONTEND_URL` – base URL for deep links (e.g. `https://legaldeep.ai`).
2. Deploy the new Supabase Edge Functions: `create-signing-session`, `get-signing-session`, `verify-signing-otp`, `complete-signature`.
	```bash
	supabase login                               # once per machine; provide your access token
	supabase link --project-ref <project-ref>    # e.g. nhmhqhhxlcmhufxxifbn
	supabase db push                             # applies migrations, including e-sign upgrades
	supabase functions deploy create-signing-session
	supabase functions deploy get-signing-session
	supabase functions deploy verify-signing-otp
	supabase functions deploy complete-signature
	```
3. Create a signature request from `/esignatures`, add a signer email, and Supabase will email a secure link.
4. Signers visit `/sign/:token`, verify with OTP, draw a signature, and the stamped PDF plus audit trail is stored in the `esignatures` bucket.

👉 Looking for a detailed QA script? Follow [`docs/esignature-manual-testing.md`](docs/esignature-manual-testing.md) for a step-by-step checklist covering owner actions, signer actions, and edge cases.

More detail and architecture notes live in `docs/esignature-architecture.md`.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/23c234e7-6ce5-45ea-922e-e53a2fe9f5fe) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
