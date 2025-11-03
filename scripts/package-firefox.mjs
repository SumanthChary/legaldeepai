import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cmd } from "web-ext";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "extension", "firefox");
const artifactsDir = path.join(rootDir, "extension", "dist");
const manifestPath = path.join(sourceDir, "manifest.json");

async function packageFirefox() {
  const rawManifest = await fs.readFile(manifestPath, "utf8");
  const manifest = JSON.parse(rawManifest);
  const version = manifest.version || "dev";
  const fileName = `legaldeep-ai-firefox-v${version}.zip`;
  const legacyFileName = `legaldeep_ai_risk_inspector-${version}.zip`;
  const legacyOutputName = `legaldeep-ai-${version}.zip`;

  await fs.mkdir(artifactsDir, { recursive: true });

  try {
    await fs.rm(path.join(artifactsDir, legacyFileName));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  await cmd.build(
    {
      sourceDir,
      artifactsDir,
      overwriteDest: true,
      filename: fileName,
    },
    {
      shouldExitProgram: false,
    },
  );

  console.log("\nFirefox extension packaged successfully.");
  console.log(`Artifact: ${path.join("extension", "dist", fileName)}`);

  const distFilePath = path.join(artifactsDir, fileName);
  const legacyOutputPath = path.join(rootDir, "extension", legacyOutputName);

  await fs.copyFile(distFilePath, legacyOutputPath);
  console.log(`Legacy-compatible copy: ${path.join("extension", legacyOutputName)}`);
}

packageFirefox().catch((error) => {
  console.error("Failed to package Firefox extension:", error);
  process.exitCode = 1;
});
