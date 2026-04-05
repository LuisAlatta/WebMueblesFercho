import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("public/icons", { recursive: true });

const BRAND_PRIMARY = "#1C1C1E";
const BRAND_ACCENT = "#C9A96E";
const BRAND_BG = "#FAF9F7";

function createIconSvg(size, maskable = false) {
  const padding = maskable ? size * 0.2 : size * 0.1;
  const fontSize = (size - padding * 2) * 0.45;
  const cx = size / 2;
  const cy = size / 2;

  return Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${BRAND_PRIMARY}" rx="${maskable ? 0 : size * 0.15}"/>
      <text
        x="${cx}"
        y="${cy}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="${BRAND_ACCENT}"
        text-anchor="middle"
        dominant-baseline="central"
        letter-spacing="${fontSize * 0.05}"
      >MF</text>
    </svg>
  `);
}

const icons = [
  { name: "icon-192x192.png", size: 192, maskable: false },
  { name: "icon-512x512.png", size: 512, maskable: false },
  { name: "icon-maskable-192x192.png", size: 192, maskable: true },
  { name: "icon-maskable-512x512.png", size: 512, maskable: true },
  { name: "apple-touch-icon.png", size: 180, maskable: false },
];

for (const icon of icons) {
  const svg = createIconSvg(icon.size, icon.maskable);
  await sharp(svg).png().toFile(`public/icons/${icon.name}`);
  console.log(`Generated: public/icons/${icon.name}`);
}

console.log("All PWA icons generated!");
