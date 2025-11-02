# Firefox Extension Upload Guide

Follow these steps to generate a submission-ready archive for Mozilla Add-ons (AMO).

1. **Package the extension**
   
   From the project root run:
   
   ```bash
   npm run package:firefox
   ```
   
   This uses `web-ext` to create a ZIP with `manifest.json` at the root, stored in `extension/dist/`.

2. **Locate the artifact**
   
   After the command finishes you will find a file similar to:
   
   ```
   extension/dist/legaldeep-ai-firefox-v1.3.0.zip
   ```
   
   That archive is what you should upload to AMO. Do **not** re-zip the repository or the `firefox/` directory manually; doing so reintroduces the "manifest.json was not found" error. Likewise, avoid using GitHub's "Download ZIP" for commits—that bundle is the entire repo and will fail validation.

3. **Upload to AMO**
   
   Visit the [Add-on Developer Hub](https://addons.mozilla.org/developers/addons) and upload the artifact from step 2. Validation should now succeed because the manifest sits at the archive root.

   _If you want to double-check before uploading, run `unzip -l extension/dist/legaldeep-ai-firefox-v1.3.0.zip` and confirm you see `manifest.json` listed without any leading directories._

4. **Repeat for new releases**
   
   Whenever you change the extension, rerun `npm run package:firefox` to regenerate the artifact before uploading.
