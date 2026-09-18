// Постеры обложек сценариев: скриншот демо-страницы в 1440×900, ужатый до
// 960px в webp. Витрина /scenarios показывает постер, а живой iframe с демо
// поднимает только по наведению — девять полных страниц в iframes весили
// 14 МБ и грузились минутами.
//
// Запуск: node scripts/scenario-covers.mjs [https://vibeui.ru] [slug ...]
// Playwright в проекте не стоит: путь к пакету — через PLAYWRIGHT_MODULE,
// иначе берётся глобальный `playwright`.

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { pathToFileURL } from "node:url"
import sharp from "sharp"

const root = process.cwd()
const base = process.argv[2] ?? "https://vibeui.ru"
const only = process.argv.slice(3)
const outputDirectory = path.join(root, "public/demo/scenarios")

const source = await readFile(path.join(root, "registry/scenarios.ts"), "utf8")
const slugs = [...source.matchAll(/demo: "\/scenarios\/([a-z0-9-]+)\/demo"/g)]
  .map((match) => match[1])
  .filter((slug) => only.length === 0 || only.includes(slug))

const modulePath = process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
  : createRequire(import.meta.url).resolve("playwright")
const { chromium } = await import(modulePath)

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM,
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await mkdir(outputDirectory, { recursive: true })

for (const slug of slugs) {
  const url = `${base}/scenarios/${slug}/demo`
  await page.goto(url, { waitUntil: "load", timeout: 120000 })
  // Анимации появления первого экрана должны отыграть, иначе на постере
  // пустые места вместо блоков.
  await page.waitForTimeout(5000)
  const png = await page.screenshot({ type: "png" })
  const webp = await sharp(png).resize({ width: 960 }).webp({ quality: 80 }).toBuffer()
  const file = path.join(outputDirectory, `${slug}.webp`)
  await writeFile(file, webp)
  console.log(`✓ ${slug}: ${Math.round(webp.length / 1024)} КБ`)
}

await browser.close()
