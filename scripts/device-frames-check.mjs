import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const directory = path.join(root, "public/demo/devices");
const checkDirectory = path.join(directory, "check");
const manifest = JSON.parse(await readFile(path.join(directory, "devices.json"), "utf8"));
await mkdir(checkDirectory, { recursive: true });

function solveLinear(matrix, values) {
  for (let pivot = 0; pivot < values.length; pivot += 1) {
    let best = pivot;
    for (let row = pivot + 1; row < values.length; row += 1) if (Math.abs(matrix[row][pivot]) > Math.abs(matrix[best][pivot])) best = row;
    [matrix[pivot], matrix[best]] = [matrix[best], matrix[pivot]];
    [values[pivot], values[best]] = [values[best], values[pivot]];
    const divisor = matrix[pivot][pivot];
    for (let column = pivot; column < values.length; column += 1) matrix[pivot][column] /= divisor;
    values[pivot] /= divisor;
    for (let row = 0; row < values.length; row += 1) {
      if (row === pivot) continue;
      const factor = matrix[row][pivot];
      for (let column = pivot; column < values.length; column += 1) matrix[row][column] -= factor * matrix[pivot][column];
      values[row] -= factor * values[pivot];
    }
  }
  return values;
}

function homography(destination, source) {
  const matrix = []; const values = [];
  for (let index = 0; index < 4; index += 1) {
    const [x, y] = destination[index]; const [u, v] = source[index];
    matrix.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); values.push(u);
    matrix.push([0, 0, 0, x, y, 1, -v * x, -v * y]); values.push(v);
  }
  return solveLinear(matrix, values);
}

async function perspectiveLayer(screenshot, outputWidth, outputHeight, points) {
  const sourceWidth = 1200; const sourceHeight = 800;
  const decoded = await sharp(screenshot).resize(sourceWidth, sourceHeight, { fit: "cover" }).ensureAlpha().raw().toBuffer();
  const transform = homography(points, [[0, 0], [sourceWidth - 1, 0], [sourceWidth - 1, sourceHeight - 1], [0, sourceHeight - 1]]);
  const output = Buffer.alloc(outputWidth * outputHeight * 4);
  const [a, b, c, d, e, f, g, h] = transform;
  for (let y = 0; y < outputHeight; y += 1) for (let x = 0; x < outputWidth; x += 1) {
    const divisor = g * x + h * y + 1;
    const u = (a * x + b * y + c) / divisor; const v = (d * x + e * y + f) / divisor;
    if (u < 0 || v < 0 || u >= sourceWidth || v >= sourceHeight) continue;
    const sourceOffset = (Math.min(sourceHeight - 1, Math.round(v)) * sourceWidth + Math.min(sourceWidth - 1, Math.round(u))) * 4;
    const targetOffset = (y * outputWidth + x) * 4;
    decoded.copy(output, targetOffset, sourceOffset, sourceOffset + 4);
  }
  return sharp(output, { raw: { width: outputWidth, height: outputHeight, channels: 4 } }).png().toBuffer();
}

for (const [name, device] of Object.entries(manifest)) {
  const frame = await sharp(path.join(directory, `${name}.png`)).ensureAlpha().toBuffer();
  const vertical = device.height > device.width;
  const screenshot = path.join(root, "public/demo/screens", vertical ? "screen-01.webp" : "desktop-01.webp");
  let underlay;

  if (device.screen) {
    const left = Math.round(device.width * device.screen.left / 100);
    const top = Math.round(device.height * device.screen.top / 100);
    const width = Math.round(device.width * device.screen.width / 100);
    const height = Math.round(device.height * device.screen.height / 100);
    const image = await sharp(screenshot).resize(width, height, { fit: "cover" }).toBuffer();
    underlay = await sharp({ create: { width: device.width, height: device.height, channels: 4, background: { r: 238, g: 238, b: 238, alpha: 1 } } })
      .composite([{ input: image, left, top }, { input: frame, left: 0, top: 0 }]).png().toBuffer();
  } else {
    const points = device.quad.map(([x, y]) => [x * device.width / 100, y * device.height / 100]);
    const image = await perspectiveLayer(screenshot, device.width, device.height, points);
    underlay = await sharp({ create: { width: device.width, height: device.height, channels: 4, background: { r: 238, g: 238, b: 238, alpha: 1 } } })
      .composite([{ input: image, left: 0, top: 0 }, { input: frame, left: 0, top: 0 }]).png().toBuffer();
  }

  await sharp(underlay).toFile(path.join(checkDirectory, `${name}.png`));
}

console.log(`Created ${Object.keys(manifest).length} check images in ${checkDirectory}`);
