import { access } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

async function run() {
  const [inputPath] = process.argv.slice(2);
  if (!inputPath) {
    console.error("Usage: npm run validate:firefox-package -- <path-to-zip>");
    process.exit(1);
    return;
  }

  const absolutePath = path.resolve(process.cwd(), inputPath);

  try {
    await access(absolutePath);
  } catch (error) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(1);
    return;
  }

  let listing;
  try {
    const { stdout } = await execFileAsync("unzip", ["-Z1", absolutePath]);
    listing = stdout
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    console.error("Failed to parse ZIP file. Ensure 'unzip' is installed.");
    console.error(error.message);
    process.exit(1);
    return;
  }

  const hasDirectManifest = listing.includes("manifest.json");
  const nestedManifest = listing.some((entry) => entry.endsWith("manifest.json") && entry !== "manifest.json");

  if (!hasDirectManifest || nestedManifest) {
    console.error("✗ Validation failed. 'manifest.json' must live at the ZIP root.");
    if (nestedManifest) {
      const nestedPath = listing.find((entry) => entry.endsWith("manifest.json") && entry !== "manifest.json");
      console.error(`Found nested manifest at: ${nestedPath}`);
    }
    process.exit(1);
    return;
  }

  console.log("✓ Package looks good. 'manifest.json' is at the root.");
}

run();
