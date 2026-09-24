// Постеры обложек сценариев: скриншот демо-страницы в 1440×900, ужатый до
// 960px в webp. Витрина /scenarios показывает постер, а живой iframe с демо
// поднимает только по наведению — девять полных страниц в iframes весили
// 14 МБ и грузились минутами.
//
// Интро-заставки (конверт, билет, свеча у свадеб) на постере не нужны:
// человек должен видеть сам сайт. Заставка раскрывается кликом по её
// кнопке, постер снимается уже с первого экрана.
//
// Запуск: node scripts/scenario-covers.mjs [https://vibeui.ru] [--en] [slug ...]
// С `--en` снимаются английские демо (`/en/scenarios/<slug>/demo`) — только
// те, у кого в registry есть `sourceEn`, — в `public/demo/scenarios/en/`.
// Playwright в проекте не стоит: путь к пакету — через PLAYWRIGHT_MODULE,
// иначе берётся глобальный `playwright`.

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { pathToFileURL } from "node:url"
import sharp from "sharp"

const root = process.cwd()
const english = process.argv.includes("--en")
const rest = process.argv.slice(2).filter((argument) => argument !== "--en")
const base = rest[0] ?? "https://vibeui.ru"
const only = rest.slice(1)
const outputDirectory = path.join(root, "public/demo/scenarios", english ? "en" : "")

const source = await readFile(path.join(root, "registry/scenarios.ts"), "utf8")
const pattern = english
  ? /sourceEn: "app\/en\/scenarios\/([a-z0-9-]+)\/demo\/page\.tsx"/g
  : /demo: "\/scenarios\/([a-z0-9-]+)\/demo"/g
const slugs = [...source.matchAll(pattern)]
  .map((match) => match[1])
  .filter((slug) => only.length === 0 || only.includes(slug))

const modulePath = process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
  : createRequire(import.meta.url).resolve("playwright")
const playwright = await import(modulePath)
const { chromium } = playwright.default ?? playwright

// Кнопки заставок: печать конверта (hero-025), корешок билета (hero-026),
// фитиль свечи (hero-027).
const GATE_BUTTONS = '[data-vibeui-block="hero-025"] [data-part="seal"], [data-vibeui-block="hero-026"] [data-part="tear"], [data-vibeui-block="hero-027"] [data-part="candle"]'

// Первые экраны со сценой по шагам: ждём нужный шаг, иначе на постере
// пустая панель. У SaaS — четвёртая реплика в субтитрах созвона.
const READY_SELECTOR = { saas: '[data-vibeui-block="hero-033"] [data-part="line"]:nth-child(4)' }

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM,
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await mkdir(outputDirectory, { recursive: true })

for (const slug of slugs) {
  const url = `${base}${english ? "/en" : ""}/scenarios/${slug}/demo`
  await page.goto(url, { waitUntil: "load", timeout: 120000 })
  // Анимации появления первого экрана должны отыграть, иначе на постере
  // пустые места вместо блоков.
  await page.waitForTimeout(5000)
  const gate = page.locator(GATE_BUTTONS).first()
  if (await gate.count()) {
    // Кнопка заставки всё время покачивается — стабильности Playwright не дождётся.
    await gate.click({ force: true })
    // Заставка уходит с задержкой до ~5 с, потом первый экран отыгрывает
    // своё появление.
    await page.waitForTimeout(8000)
  }
  // Видео-хиро (hero-046/047/048): ждём старта ролика и жмём «Пропустить» —
  // постер снимается со стоп-кадра, когда текст и шапка уже проявились.
  const VIDEO_HEROES = ["hero-046", "hero-047", "hero-048"].map((name) => `[data-vibeui-block="${name}"]`)
  const intro = page.locator(VIDEO_HEROES.join(", ")).first()
  if (await intro.count()) {
    await page.waitForSelector(VIDEO_HEROES.map((selector) => `${selector}:not([data-phase="loading"])`).join(", "), { timeout: 60000 })
    const skip = intro.locator('[data-part="replay"]')
    if ((await intro.getAttribute("data-phase")) === "playing") await skip.click({ force: true })
    await page.waitForTimeout(3500)
  }
  if (READY_SELECTOR[slug]) {
    await page.waitForSelector(READY_SELECTOR[slug], { timeout: 30000 })
    await page.waitForTimeout(1400)
  }
  // Плавающая кнопка экстренной помощи (vet-001) сама раскрывает панель —
  // на постере она закрывает первый экран.
  const panelClose = page.locator('[data-vibeui-block="vet-001"] [data-part="close"]')
  if ((await panelClose.count()) && (await panelClose.isVisible())) {
    await panelClose.click({ force: true })
    await page.waitForTimeout(700)
  }
  const png = await page.screenshot({ type: "png" })
  const webp = await sharp(png).resize({ width: 960 }).webp({ quality: 80 }).toBuffer()
  const file = path.join(outputDirectory, `${slug}.webp`)
  await writeFile(file, webp)
  console.log(`✓ ${slug}: ${Math.round(webp.length / 1024)} КБ`)
}

await browser.close()
