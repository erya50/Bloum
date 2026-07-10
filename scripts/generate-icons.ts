/**
 * Regenerates app icons (favicon, apple-touch-icon, PWA manifest icons) from
 * public/logo.png. Run again whenever the logo is replaced.
 *
 * Usage: npx tsx scripts/generate-icons.ts
 */
import sharp from "sharp";
import path from "path";

const SOURCE = path.join(__dirname, "..", "public", "logo.png");
const CREAM = "#fbf6ef";

async function squareOnBackground(size: number, background: string, padding: number) {
  const inner = Math.round(size * (1 - padding * 2));
  const logo = await sharp(SOURCE)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();
}

async function main() {
  const appDir = path.join(__dirname, "..", "app");
  const iconsDir = path.join(__dirname, "..", "public", "icons");

  await sharp(await squareOnBackground(512, CREAM, 0.08)).toFile(
    path.join(appDir, "icon.png")
  );
  await sharp(await squareOnBackground(180, CREAM, 0.08)).toFile(
    path.join(appDir, "apple-icon.png")
  );

  await sharp(await squareOnBackground(192, CREAM, 0.08)).toFile(
    path.join(iconsDir, "icon-192.png")
  );
  await sharp(await squareOnBackground(512, CREAM, 0.08)).toFile(
    path.join(iconsDir, "icon-512.png")
  );
  // Maskable icons need extra safe-zone padding since OSes crop them to shapes.
  await sharp(await squareOnBackground(512, CREAM, 0.2)).toFile(
    path.join(iconsDir, "icon-maskable-512.png")
  );

  console.log("Icons generated in app/ and public/icons/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
