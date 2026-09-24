// Скролл-видео демо сценария для превью на /scenarios: живой курсор,
// честный скролл колесом с ускорением/торможением, без бейджа отладчика и
// без прыжков — Playwright в проекте не стоит, путь к пакету и chromium
// через PLAYWRIGHT_MODULE / PLAYWRIGHT_CHROMIUM (как в scenario-covers.mjs),
// браузер отдельный от MCP-расширения.
//
// Запуск: node scripts/scenario-video.mjs <slug> [baseUrl] [--out путь.mp4]
// Хореография для конкретного сценария — в SCENARIOS ниже; для остальных
// slug'ов работает generic-сценарий: подождать первый экран, проскроллить
// секции по id.

import { mkdir, readdir, rename } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { pathToFileURL } from "node:url"

const root = process.cwd()
const args = process.argv.slice(2)
const slug = args[0]
if (!slug) {
  console.error("Usage: node scripts/scenario-video.mjs <slug> [baseUrl] [--out путь.mp4]")
  process.exit(1)
}
const rest = args.slice(1)
const outIdx = rest.indexOf("--out")
const outFile = outIdx >= 0 ? rest[outIdx + 1] : null
const base = rest.find((value, index) => value !== "--out" && index !== outIdx + 1) ?? "https://vibeui.ru"
const rawDir = path.join(root, ".playwright-mcp/video-raw", `${slug}-${Date.now()}`)
await mkdir(rawDir, { recursive: true })

const modulePath = process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
  : createRequire(import.meta.url).resolve("playwright")
const playwright = await import(modulePath)
const { chromium } = playwright.default ?? playwright

// Курсор — реальный DOM-узел, следует за подлинными mousemove от Playwright
// (page.mouse.move с steps их и рассылает). Полоса прокрутки скрыта только
// на время записи. scroll-behavior:smooth страницы отключаем: скроллим сами
// колесом с собственным ускорением, встроенный smooth будет мешать, не помогать.
const INIT_SCRIPT = `
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn()
    else document.addEventListener("DOMContentLoaded", fn)
  }
  ready(function () {
    var style = document.createElement("style")
    style.textContent =
      'html{scrollbar-width:none!important;scroll-behavior:auto!important}' +
      '::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}'
    document.head.appendChild(style)
    var el = document.createElement("div")
    el.id = "__rec_cursor"
    el.style.cssText =
      "position:fixed;z-index:2147483647;left:0;top:0;width:22px;height:22px;" +
      "margin:-3px 0 0 -3px;pointer-events:none;will-change:transform;" +
      "background:radial-gradient(circle at 30% 30%,#fff,#d8d8d8 55%,#8f8f8f 100%);" +
      "border:1.5px solid rgba(0,0,0,.55);border-radius:50% 50% 50% 3px;" +
      "transform:translate(-100px,-100px) rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,.45)"
    document.body.appendChild(el)
    window.addEventListener(
      "mousemove",
      function (event) {
        el.style.transform = "translate(" + event.clientX + "px," + event.clientY + "px) rotate(-45deg)"
      },
      { passive: true },
    )
  })
})()
`

async function moveTo(page, x, y, steps = 26) {
  await page.mouse.move(Math.round(x), Math.round(y), { steps })
}

async function moveToCenter(page, locator, steps = 26) {
  const box = await locator.boundingBox()
  if (!box) return null
  await moveTo(page, box.x + box.width / 2, box.y + box.height / 2, steps)
  return box
}

/** Скроллит колесом с разгоном/торможением до Y элемента — не прыжок, а ход руки. */
async function humanScrollToSelector(page, selector, offset = -70) {
  const targetY = await page.evaluate(
    ({ selector, offset }) => {
      const el = document.querySelector(selector)
      if (!el) return null
      const rect = el.getBoundingClientRect()
      return Math.max(0, window.scrollY + rect.top + offset)
    },
    { selector, offset },
  )
  if (targetY === null) return
  const steps = 22
  for (let pass = 0; pass < 3; pass++) {
    const current = await page.evaluate(() => window.scrollY)
    const total = targetY - current
    if (Math.abs(total) < 3) break
    for (let i = 0; i < steps; i++) {
      const t = (i + 0.5) / steps
      const weight = Math.sin(Math.PI * t) // медленно-быстро-медленно, как рука на колесе
      await page.mouse.wheel(0, (total * weight) / (steps * 0.64))
      await page.waitForTimeout(24 + Math.random() * 26)
      if (i > 0 && i % 7 === 0) await page.waitForTimeout(90 + Math.random() * 140)
    }
  }
}

async function waitFor(page, ms) {
  await page.waitForTimeout(ms)
}

const t0 = Date.now()
function mark(label) {
  console.error(`${((Date.now() - t0) / 1000).toFixed(1)}s  ${label}`)
}

// Хореография по сценариям. auto прописан подробно; остальные — общий проход.
const SCENARIOS = {
  auto: async (page, cdp) => {
    // Throttлим только сам заход на страницу и загрузку ролика — тахометр
    // успевает мести стрелку по дуге; как только фаза ушла из "loading",
    // сеть возвращаем в норму, иначе заезд и вся остальная страница тоже
    // тащатся на 2 Мбит/с.
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: 3_500_000,
      uploadThroughput: 3_500_000,
      latency: 20,
    })
    mark("goto")
    await page.goto(`${base}/scenarios/${slug}/demo`, { waitUntil: "domcontentloaded" })
    mark("dom-loaded")
    await moveTo(page, 640, 430, 8)
    await page.waitForSelector('[data-vibeui-block="hero-046"]:not([data-phase="loading"])', { timeout: 20000 })
    mark("tacho-done")
    await cdp.send("Network.emulateNetworkConditions", { offline: false, downloadThroughput: -1, uploadThroughput: -1, latency: 0 })
    await page.waitForSelector('[data-vibeui-block="hero-046"][data-phase="parked"]', { timeout: 20000 })
    mark("parked")
    await waitFor(page, 350)

    // Зона на машине — курсор реально едет к чипу, страница при этом не скроллит.
    const chips = page.locator('[data-vibeui-block="hero-046"] [data-part="chip"]')
    const chipCount = await chips.count()
    for (const index of [2, 4, 0].filter((i) => i < chipCount)) {
      await moveToCenter(page, chips.nth(index), 34)
      await waitFor(page, 700)
    }
    await waitFor(page, 400)
    mark("chips-done")

    await humanScrollToSelector(page, "#services")
    mark("scroll-services")
    await waitFor(page, 400)
    const cards = page.locator('[data-vibeui-block="auto-001"] [data-part="card"]')
    await moveToCenter(page, cards.nth(1), 30)
    await page.mouse.down()
    await page.mouse.up()
    await waitFor(page, 450)
    await moveToCenter(page, cards.nth(2), 24)
    await page.mouse.down()
    await page.mouse.up()
    await waitFor(page, 900)
    mark("services-done")

    await humanScrollToSelector(page, "#results")
    mark("scroll-results")
    await waitFor(page, 500)
    const compare = page.locator('[data-vibeui-block="auto-002"] [data-part="compare"]').first()
    const box = await moveToCenter(page, compare, 20)
    if (box) {
      const y = box.y + box.height / 2
      await page.mouse.down()
      await moveTo(page, box.x + box.width * 0.16, y, 22)
      await waitFor(page, 280)
      await moveTo(page, box.x + box.width * 0.86, y, 30)
      await waitFor(page, 280)
      await page.mouse.up()
    }
    await waitFor(page, 500)
    mark("results-done")

    await humanScrollToSelector(page, "#process")
    mark("scroll-process")
    await waitFor(page, 1100)

    await humanScrollToSelector(page, "#team")
    mark("scroll-team")
    await waitFor(page, 1000)

    await humanScrollToSelector(page, "#reviews")
    mark("scroll-reviews")
    await waitFor(page, 1600)

    await humanScrollToSelector(page, "#booking")
    mark("scroll-booking")
    await waitFor(page, 350)
    const slot = page
      .locator('[data-vibeui-block="auto-004"] button[data-part="slot"]:not([aria-disabled="true"])')
      .first()
    if (await slot.count()) {
      await moveToCenter(page, slot, 22)
      await page.mouse.down()
      await page.mouse.up()
      await waitFor(page, 800)
    }

    mark("booking-done")
    await humanScrollToSelector(page, 'footer, [data-vibeui-block^="footer"]', -20)
    mark("scroll-footer")
    await waitFor(page, 1200)
    mark("end")
  },
  default: async (page, cdp) => {
    await page.goto(`${base}/scenarios/${slug}/demo`, { waitUntil: "load" })
    await waitFor(page, 2000)
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll("[id]")).map((el) => `#${el.id}`))
    for (const selector of ids.slice(0, 10)) {
      await humanScrollToSelector(page, selector)
      await waitFor(page, 1200)
    }
  },
}

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM })
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  recordVideo: { dir: rawDir, size: { width: 1280, height: 900 } },
})
await context.addInitScript(INIT_SCRIPT)
const page = await context.newPage()
const cdp = await context.newCDPSession(page)

const run = SCENARIOS[slug] ?? SCENARIOS.default
await run(page, cdp)

await context.close()
await browser.close()

const [file] = (await readdir(rawDir)).filter((name) => name.endsWith(".webm"))
const finalPath = outFile ?? path.join(rawDir, `${slug}.webm`)
if (file) await rename(path.join(rawDir, file), finalPath)
console.log(`✓ ${slug}: ${finalPath}`)
