import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDirectory = path.join(root, "public/demo/devices/raw");
const outputDirectory = path.join(root, "public/demo/devices");
const names = [
  "laptop-front",
  "laptop-angle",
  "phone-front",
  "tablet-portrait",
  "tablet-landscape",
  "monitor-front",
  "watch-front",
];

const round = (value) => Math.round(value * 100) / 100;
const clamp = (value) => Math.max(0, Math.min(1, value));
const magentaStrength = (r, g, b) => clamp(Math.min(
  (Math.min(r, b) - 150) / 50,
  (Math.min(r, b) - g - 45) / 55,
));
const greenStrength = (r, g, b) => clamp(Math.min(
  (g - 150) / 50,
  (g - Math.max(r, b) - 45) / 55,
));
const isBackground = (r, g, b) => magentaStrength(r, g, b) >= 0.55;
const isScreen = (r, g, b) => greenStrength(r, g, b) >= 0.55;

function erodeOpaqueEdge(chroma, width, height) {
  const expanded = new Float32Array(chroma.length);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    let strength = chroma[y * width + x];
    for (let dy = -2; dy <= 2; dy += 1) for (let dx = -2; dx <= 2; dx += 1) {
      const sourceX = x + dx; const sourceY = y + dy;
      if (sourceX < 0 || sourceY < 0 || sourceX >= width || sourceY >= height) continue;
      const distance = Math.hypot(dx, dy);
      if (distance > 2.25) continue;
      const penalty = distance <= 1.5 ? 0 : 0.5;
      strength = Math.max(strength, chroma[sourceY * width + sourceX] - penalty);
    }
    expanded[y * width + x] = clamp(strength);
  }
  return expanded;
}

function findBounds(mask, width, height) {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    if (!mask[y * width + x]) continue;
    left = Math.min(left, x); top = Math.min(top, y);
    right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  if (right < 0) throw new Error("Chroma-key region not found");
  return { left, top, right, bottom };
}

function symmetryError(alpha, width, height) {
  let compared = 0;
  let mismatched = 0;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < Math.floor(width / 2); x += 1) {
    compared += 1;
    if (Math.abs(alpha[y * width + x] - alpha[y * width + width - 1 - x]) > 64) mismatched += 1;
  }
  return round((mismatched / compared) * 100);
}

await mkdir(outputDirectory, { recursive: true });
const manifest = {};
const report = [];

for (const name of names) {
  const input = await readFile(path.join(sourceDirectory, `${name}.png`));
  const decoded = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = decoded.info;
  const pixels = decoded.data;
  const background = new Uint8Array(width * height);
  const screen = new Uint8Array(width * height);
  const chroma = new Float32Array(width * height);

  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 4;
    const r = pixels[offset]; const g = pixels[offset + 1]; const b = pixels[offset + 2];
    background[index] = isBackground(r, g, b) ? 1 : 0;
    screen[index] = isScreen(r, g, b) ? 1 : 0;
    chroma[index] = Math.max(magentaStrength(r, g, b), greenStrength(r, g, b));
  }

  const erodedChroma = erodeOpaqueEdge(chroma, width, height);
  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 4;
    const r = pixels[offset]; const g = pixels[offset + 1]; const b = pixels[offset + 2];
    const alpha = Math.round((1 - erodedChroma[index]) * 255);
    pixels[offset + 3] = alpha;
    if (alpha > 0 && alpha < 255) {
      const luminance = Math.round(r * 0.2126 + g * 0.7152 + b * 0.0722);
      pixels[offset] = luminance; pixels[offset + 1] = luminance; pixels[offset + 2] = luminance;
    }
  }

  const opaqueMask = background.map((value, index) => value || screen[index] ? 0 : 1);
  const deviceBounds = findBounds(opaqueMask, width, height);
  const padding = Math.round(Math.max(deviceBounds.right - deviceBounds.left, deviceBounds.bottom - deviceBounds.top) * 0.02);
  const crop = {
    left: Math.max(0, deviceBounds.left - padding),
    top: Math.max(0, deviceBounds.top - padding),
    width: Math.min(width - Math.max(0, deviceBounds.left - padding), deviceBounds.right - deviceBounds.left + 1 + padding * 2),
    height: Math.min(height - Math.max(0, deviceBounds.top - padding), deviceBounds.bottom - deviceBounds.top + 1 + padding * 2),
  };
  const screenBounds = findBounds(screen, width, height);
  const percentX = (x) => round(((x - crop.left) / crop.width) * 100);
  const percentY = (y) => round(((y - crop.top) / crop.height) * 100);
  const entry = { file: `${name}.webp`, width: crop.width, height: crop.height };

  if (name === "laptop-angle") {
    const points = [];
    for (let y = screenBounds.top; y <= screenBounds.bottom; y += 1) for (let x = screenBounds.left; x <= screenBounds.right; x += 1) {
      if (screen[y * width + x]) points.push([x, y]);
    }
    const pick = (score, compare) => points.reduce((best, point) => compare(score(point), score(best)) ? point : best);
    const topLeft = pick(([x, y]) => x + y, (a, b) => a < b);
    const topRight = pick(([x, y]) => x - y, (a, b) => a > b);
    const bottomRight = pick(([x, y]) => x + y, (a, b) => a > b);
    const bottomLeft = pick(([x, y]) => x - y, (a, b) => a < b);
    entry.quad = [topLeft, topRight, bottomRight, bottomLeft].map(([x, y]) => [percentX(x), percentY(y)]);
  } else {
    entry.screen = {
      left: percentX(screenBounds.left), top: percentY(screenBounds.top),
      width: round(((screenBounds.right - screenBounds.left + 1) / crop.width) * 100),
      height: round(((screenBounds.bottom - screenBounds.top + 1) / crop.height) * 100),
    };
  }

  const croppedPixels = await sharp(pixels, { raw: { width, height, channels: 4 } }).extract(crop).png().toBuffer();
  await writeFile(path.join(outputDirectory, `${name}.png`), croppedPixels);
  await sharp(croppedPixels).webp({ quality: 85, alphaQuality: 100, effort: 6 }).toFile(path.join(outputDirectory, `${name}.webp`));
  const alpha = await sharp(croppedPixels).ensureAlpha().extractChannel(3).raw().toBuffer();
  const symmetry = name === "laptop-angle" ? null : symmetryError(alpha, crop.width, crop.height);
  manifest[name] = entry;
  report.push({ name, attempt: 1, symmetryPercent: symmetry });
}

await writeFile(path.join(outputDirectory, "devices.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.table(report);
