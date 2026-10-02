/**
 * Render the production demo frame by frame with one clock and one scroll path.
 * Tools live outside application dependencies. Set MOTION_TOOLS to a directory
 * containing playwright, sharp and the ffmpeg/ffprobe installer packages.
 * npm install --prefix .playwright-mcp/motion-tools --no-save --no-package-lock
 *   playwright @ffmpeg-installer/ffmpeg @ffprobe-installer/ffprobe sharp
 * Install Chromium for that Playwright version before rendering.
 * node scripts/render-scenario-motion.mjs saas --frames 120 (short verification)
 * node scripts/render-scenario-motion.mjs all
 * node scripts/render-scenario-motion.mjs --missing --locale both
 * Outputs, WebP posters and audits: .playwright-mcp/scenario-motion/<slug>/.
 * MOTION_BASE overrides the site URL; MOTION_AUDIT overrides the output folder.
 */
import { createRequire } from "node:module"
import { mkdir, writeFile, readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { spawn, execFileSync } from "node:child_process"
import { once } from "node:events"
import { setTimeout as delay } from "node:timers/promises"
import path from "node:path"

const root = process.cwd()
const toolsDirectory = process.env.MOTION_TOOLS ?? path.join(root, ".playwright-mcp/motion-tools")
const require = createRequire(path.join(toolsDirectory, "entry.cjs"))
const { chromium } = require("playwright")
const sharp = require("sharp")
const ffmpeg = require("@ffmpeg-installer/ffmpeg").path
const ffprobe = require("@ffprobe-installer/ffprobe").path
const scenarioSource = await readFile(path.join(root, "registry/scenarios.ts"), "utf8")
const slugs = [...scenarioSource.matchAll(/^\s+slug: "([a-z0-9-]+)"/gm)].map(match => match[1])
const args = process.argv.slice(2)
const missingOnly = args.includes("--missing")
const selected = args[0] === "all" || missingOnly ? slugs : args.filter(arg => slugs.includes(arg))
const localeOption = args.includes("--locale") ? args[args.indexOf("--locale") + 1] : "en"
if (!["ru", "en", "both"].includes(localeOption)) throw new Error("Use --locale ru, en or both")
const locales = localeOption === "both" ? ["ru", "en"] : [localeOption]
let jobs = locales.flatMap(locale => selected.map(slug => ({ slug, locale }))).filter(({ slug, locale }) =>
  !missingOnly || !existsSync(path.join(root, "public/demo/scenarios", locale === "en" ? "en" : "", `${slug}.mp4`)))
const frameLimit = args.includes("--frames") ? Number(args[args.indexOf("--frames") + 1]) : Infinity
const FPS = 60
const WIDTH = 1280
const HEIGHT = 800
const auditRoot = process.env.MOTION_AUDIT ?? path.join(root, ".playwright-mcp/scenario-motion")
if (args.includes("--resume")) {
  const pending = []
  for (const job of jobs) {
    const directory = path.join(auditRoot, ...(args.includes("--locale") ? [job.locale] : []), job.slug)
    try {
      const audit = JSON.parse(await readFile(path.join(directory, "audit.json"), "utf8"))
      const interactionsComplete = audit.checkpoints[0]?.scroll < 100 &&
        (job.slug !== "course" || audit.actions.some(action => action.selector === '#who [data-part="tab"]' && action.before !== action.after)) &&
        (job.slug !== "podcast" || audit.actions.some(action => action.result === "player-open")) &&
        (job.slug !== "wedding-winter" || !audit.checkpoints.some(point => /data-motion-scene="[12]"/.test(point.name)))
      if (interactionsComplete && audit.seconds > 10 && audit.checkpoints.length >= 5 && existsSync(path.join(directory, `${job.slug}.mp4`))) continue
    } catch { /* Missing or incomplete output must be rendered again. */ }
    pending.push(job)
  }
  jobs = pending
}
const baseFor = locale => process.env.MOTION_BASE ?? (locale === "ru" ? "https://vibeui.ru" : "https://vibeui.club")

const ease = value => value ** 3 * (value * (value * 6 - 15) + 10)
const cursorScript = () => {
  const style = document.createElement("style")
  // Explicit instant scroll is essential: the demo's smooth scroll otherwise
  // starts a new browser interpolation for every single requested frame.
  style.textContent = "html{scroll-behavior:auto!important;scrollbar-width:none!important}::-webkit-scrollbar{display:none!important}"
  document.head.append(style)
  const cursor = document.createElement("div")
  cursor.id = "__motion_cursor"
  cursor.style.cssText = "position:fixed;z-index:2147483647;left:0;top:0;pointer-events:none;width:26px;height:30px;transform:translate(1050px,720px);filter:drop-shadow(0 1px 2px #0008)"
  cursor.innerHTML = '<svg viewBox="0 0 24 28" width="26" height="30"><path d="M3 2v21l5-5 4 8 4-2-4-8h8z" fill="white" stroke="#181818" stroke-width="1.4" stroke-linejoin="round"/></svg>'
  document.body.append(cursor)
  document.addEventListener("mousemove", event => {
    cursor.style.transform = `translate(${event.clientX}px,${event.clientY}px)`
  }, { passive: true })
  document.addEventListener("mousedown", () => { cursor.style.scale = ".9" }, { passive: true })
  document.addEventListener("mouseup", () => { cursor.style.scale = "1" }, { passive: true })
  window.__motionAnimations = new WeakMap()
  window.__motionFinished = new WeakSet()
  window.__motionMedia = new WeakMap()
}

class Director {
  constructor(page, cdp, encoder, directory, slug) {
    Object.assign(this, { page, cdp, encoder, directory, slug })
    this.frame = 0
    this.pointer = { x: 1050, y: 720 }
    this.checkpoints = []
    this.scrolls = []
    this.actions = []
  }

  async compositorFrame(options) {
    let timer
    try {
      return await Promise.race([
        this.cdp.send("HeadlessExperimental.beginFrame", options),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Compositor frame timed out")), 20000) }),
      ])
    } finally { clearTimeout(timer) }
  }

  async mouse(method, ...args) {
    const changed = await this.page.evaluate(({ method, args }) => {
      const pointer = window.__motionPointer ?? { x: 1050, y: 720 }
      if (method === 'move') { pointer.x = args[0]; pointer.y = args[1] }
      window.__motionPointer = pointer
      const hit = document.elementFromPoint(pointer.x, pointer.y)
      if (!hit) return false
      const options = { bubbles: true, cancelable: true, clientX: pointer.x, clientY: pointer.y, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: method === 'down' ? 1 : 0 }
      const previous = window.__motionHit
      const changed = previous !== hit
      if (method === 'move') {
        if (changed) {
          previous?.dispatchEvent(new MouseEvent('mouseout', { ...options, relatedTarget: hit }))
          previous?.dispatchEvent(new PointerEvent('pointerout', { ...options, relatedTarget: hit }))
          hit.dispatchEvent(new MouseEvent('mouseover', { ...options, relatedTarget: previous }))
          hit.dispatchEvent(new PointerEvent('pointerover', { ...options, relatedTarget: previous }))
          document.querySelectorAll('[data-motion-hover]').forEach(el => el.removeAttribute('data-motion-hover'))
          for (let el = hit; el; el = el.parentElement) el.setAttribute('data-motion-hover', '')
          window.__motionHit = hit
        }
        hit.dispatchEvent(new PointerEvent('pointermove', options))
        hit.dispatchEvent(new MouseEvent('mousemove', options))
      } else {
        hit.dispatchEvent(new PointerEvent(method === 'down' ? 'pointerdown' : 'pointerup', options))
        hit.dispatchEvent(new MouseEvent(method === 'down' ? 'mousedown' : 'mouseup', options))
        if (method === 'down') {
          window.__motionPressed = hit
          hit.closest('input,textarea,button,summary')?.focus({ preventScroll: true })
        } else {
          const pressed = window.__motionPressed
          const interactive = 'button,input,summary,[role="button"],[role="tab"]'
          const common = pressed?.closest(interactive)
          const target = pressed === hit ? hit : common && common === hit.closest(interactive) ? common : null
          // Hover/focus may replace an icon between down and up. Native clicks
          // still belong to their shared button, not the replaced SVG leaf.
          if (target && typeof target.click === 'function') target.click()
          else if (target) target.dispatchEvent(new MouseEvent('click', options))
          window.__motionPressed = null
        }
      }
      return changed
    }, { method, args })
    if (method === 'move' && changed) {
      // Keep the site's real CSS hover rules while avoiding OS input ACKs,
      // which stall editable controls when the browser clock is frozen.
      for (const nodeId of this.hoverNodes ?? []) await this.cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] }).catch(() => {})
      const { nodeIds } = await this.cdp.send('DOM.querySelectorAll', { nodeId: this.documentNode, selector: '[data-motion-hover]' })
      for (const nodeId of nodeIds) await this.cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['hover'] })
      this.hoverNodes = nodeIds
    }
  }

  async frameAt(scroll, pointer) {
    if (this.frame >= frameLimit) throw new Error("FRAME_LIMIT")
    if (scroll !== undefined) await this.page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), scroll)
    if (pointer) {
      await this.mouse("move", pointer.x, pointer.y)
      this.pointer = pointer
    }
    // Advance the installed Playwright clock only in the main document. The
    // public context-wide runFor also appends a replay script on every frame;
    // thousands of those stall third-party map frames when they navigate.
    await this.page.evaluate(milliseconds => window.__pwClock.controller.runFor(milliseconds), 1000 / FPS)
    const mediaUpdate = this.page.evaluate(async time => {
      for (const animation of document.getAnimations()) {
        if (animation.timeline !== document.timeline) continue
        if (window.__motionFinished.has(animation)) continue
        if (animation.currentTime !== null && typeof animation.currentTime !== "number") continue
        let start = window.__motionAnimations.get(animation)
        if (start === undefined) {
          start = time - Number(animation.currentTime ?? 0)
          window.__motionAnimations.set(animation, start)
          animation.pause()
        }
        const current = Math.max(0, time - start)
        const end = animation.effect?.getComputedTiming().endTime
        if (typeof end === 'number' && Number.isFinite(end) && current >= end) {
          window.__motionFinished.add(animation)
          // Setting currentTime on a paused animation does not fire onfinish.
          // Native cleanup (e.g. a dish flying into the cart) must still run.
          animation.finish()
        } else animation.currentTime = current
      }
      const seeks = []
      for (const video of document.querySelectorAll("video")) {
        if (!Number.isFinite(video.duration) || !video.duration || video.readyState < 2) continue
        let media = window.__motionMedia.get(video)
        if (!media) {
          media = { start: time, initial: video.currentTime, ended: false }
          window.__motionMedia.set(video, media)
        }
        video.pause()
        const rect = video.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > innerHeight) continue
        let position = media.initial + (time - media.start) / 1000
        if (video.loop) position %= video.duration
        else if (position >= video.duration - .035) {
          position = video.duration - .035
          if (!media.ended) { media.ended = true; video.dispatchEvent(new Event("ended")) }
        }
        // The source films are 24–30 fps; seeking for every UI frame only
        // decodes the same source image twice without adding visible detail.
        position = Math.floor(position * 30 + 1e-6) / 30
        if (Math.abs(video.currentTime - position) > .005) {
          seeks.push(new Promise(resolve => {
            video.addEventListener("seeked", resolve, { once: true })
            video.currentTime = position
          }))
        }
      }
      await Promise.all(seeks)
    }, this.frame * 1000 / FPS)
    // Flush the compositor while media seeks settle. Waiting for seeked first
    // can deadlock a video whose decoder is waiting for this explicit frame.
    if (this.captureMode === "compositor") await this.compositorFrame({
      frameTimeTicks: this.nativeStart + this.frame * 1000 / FPS,
      interval: 1000 / FPS,
    })
    await Promise.race([mediaUpdate, delay(10000, undefined, { ref: false }).then(() => { throw new Error("Video seek timed out") })])
    let screenshotData
    for (let attempt = 0; this.captureMode === "compositor" && attempt < 5 && !screenshotData; attempt++) {
      if (attempt) {
        // A new compositor surface may not offer a screenshot on its first
        // frame. Invalidate only the added cursor and retry the same clock time.
        await this.page.evaluate(attempt => { document.getElementById('__motion_cursor').style.opacity = attempt % 2 ? '.999' : '1' }, attempt)
        await delay(20)
      }
      ;({ screenshotData } = await this.compositorFrame({
        frameTimeTicks: this.nativeStart + this.frame * 1000 / FPS + attempt * .1,
        interval: 1000 / FPS,
        screenshot: { format: "jpeg", quality: 94, optimizeForSpeed: true },
      }))
    }
    if (this.captureMode === "compositor" && !screenshotData) throw new Error("Browser did not return a rendered frame")
    const buffer = this.captureMode === "compositor" ? Buffer.from(screenshotData, "base64") :
      await this.page.screenshot({ type: "jpeg", quality: 94, caret: "initial", timeout: 20000 })
    if (!this.encoder.stdin.write(buffer)) await once(this.encoder.stdin, "drain")
    this.lastFrame = buffer
    this.frame++
    if (this.frame % 120 === 0) console.log(`${this.slug}: ${(this.frame / FPS).toFixed(1)}s rendered`)
  }

  async hold(seconds) {
    for (let i = 0; i < Math.round(seconds * FPS); i++) await this.frameAt()
  }

  async checkpoint(name) {
    const file = `${String(this.checkpoints.length).padStart(2, "0")}-${name.replace(/[^a-z0-9-]/gi, "-")}.jpg`
    await writeFile(path.join(this.directory, file), this.lastFrame)
    this.checkpoints.push({ name, frame: this.frame, file, scroll: await this.page.evaluate(() => scrollY) })
  }

  async scrollTo(selector, { lower = false, duration } = {}) {
    console.log(`${this.slug}: scene ${selector}${lower ? ' (lower)' : ''}`)
    const geometry = await this.page.evaluate(({ selector, lower }) => {
      const el = document.querySelector(selector)
      if (!el) return null
      const rect = el.getBoundingClientRect()
      const max = document.documentElement.scrollHeight - innerHeight
      return { from: scrollY, to: Math.max(0, Math.min(max, scrollY + rect.top - 90 + (lower ? Math.max(0, rect.height - innerHeight + 170) : 0))) }
    }, { selector, lower })
    if (!geometry) throw new Error(`Missing scene: ${selector}`)
    await this.pan(geometry, selector, duration)
  }

  async pan(geometry, selector, duration) {
    const distance = geometry.to - geometry.from
    if (Math.abs(distance) < 2) return
    const seconds = duration ?? Math.max(1.3, Math.abs(distance) / 650)
    const frames = Math.round(seconds * FPS)
    const trace = { selector, from: geometry.from, to: geometry.to, start: this.frame, samples: [] }
    // Quintic easing has zero velocity AND acceleration at each end.
    for (let i = 1; i <= frames; i++) {
      const y = geometry.from + distance * ease(i / frames)
      await this.frameAt(y)
      trace.samples.push(await this.page.evaluate(() => scrollY))
    }
    const backwards = trace.samples.slice(1).some((y, i) => distance > 0 ? y < trace.samples[i] - 1 : y > trace.samples[i] + 1)
    if (backwards || Math.abs(trace.samples.at(-1) - geometry.to) > 2) throw new Error(`Scroll discontinuity: ${selector}`)
    this.scrolls.push(trace)
  }

  async moveTo(locator, seconds = .45) {
    let box = await locator.boundingBox()
    if (box && (box.y < 70 || box.y + box.height > HEIGHT - 15) && box.height < HEIGHT - 150) {
      const geometry = await this.page.evaluate(({ y, height }) => ({
        from: scrollY,
        to: Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, scrollY + y + height / 2 - innerHeight * .62)),
      }), { y: box.y, height: box.height })
      await this.pan(geometry, 'interactive-control')
      await this.hold(.35)
      box = await locator.boundingBox()
    }
    if (!box || box.y < 70 || box.y + box.height > HEIGHT - 15 || box.x >= WIDTH - 8 || box.x + box.width <= 8) return false
    const from = this.pointer
    const to = { x: Math.max(8, Math.min(WIDTH - 8, box.x + box.width / 2)), y: box.y + box.height / 2 }
    const frames = Math.round(seconds * FPS)
    for (let i = 1; i <= frames; i++) {
      const p = i / frames, e = ease(p)
      await this.frameAt(undefined, { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e - Math.sin(Math.PI * p) * 18 })
    }
    return true
  }

  async click(selector, index = 0, linger = .65) {
    console.log(`${this.slug}: click ${selector} [${index}]`)
    const locator = this.page.locator(selector).nth(index)
    if (!await locator.count() || !await locator.isVisible() || await locator.isDisabled()) return false
    if (!await this.moveTo(locator)) return false
    for (let attempt = 0; attempt < 2; attempt++) {
      const onTarget = await locator.evaluate((element, pointer) => element.contains(document.elementFromPoint(pointer.x, pointer.y)), this.pointer)
      if (onTarget) break
      if (!await this.moveTo(locator, .2)) return false
    }
    if (!await locator.evaluate((element, pointer) => element.contains(document.elementFromPoint(pointer.x, pointer.y)), this.pointer)) return false
    const before = await locator.getAttribute("aria-pressed") ?? await locator.getAttribute("aria-selected") ?? await locator.getAttribute("aria-expanded")
    await this.mouse("down")
    await this.hold(.08)
    await this.mouse("up")
    await this.hold(linger)
    this.actions.push({ selector, index, frame: this.frame, before, after: await locator.getAttribute("aria-pressed") ?? await locator.getAttribute("aria-selected") ?? await locator.getAttribute("aria-expanded") })
    return true
  }

  async slider(selector, fraction = .78) {
    const locator = this.page.locator(selector).first()
    if (!await locator.count() || !await this.moveTo(locator)) return false
    const box = await locator.boundingBox()
    const from = this.pointer
    const initial = Number(await locator.inputValue())
    const bounds = await locator.evaluate(input => ({ min: Number(input.min || 0), max: Number(input.max || 100), step: Number(input.step || 1) }))
    await this.page.evaluate(() => { document.getElementById('__motion_cursor').style.scale = '.9' })
    for (let i = 1; i <= 48; i++) {
      const e = ease(i / 48)
      // Drive the original input and its React handler without OS range capture:
      // native range input waits for wall-clock paints, incompatible with a
      // frozen frame clock. Values follow the same visible cursor trajectory.
      const target = bounds.min + (bounds.max - bounds.min) * fraction
      const value = Math.round((initial + (target - initial) * e) / bounds.step) * bounds.step
      await locator.evaluate((input, value) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, String(value))
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }, value)
      await this.frameAt(undefined, { x: from.x + (box.x + box.width * fraction - from.x) * e, y: from.y })
    }
    await this.page.evaluate(() => { document.getElementById('__motion_cursor').style.scale = '1' })
    await this.hold(.75)
    this.actions.push({ selector, action: "drag", value: await locator.inputValue().catch(() => null), frame: this.frame })
    return true
  }

  async type(selector, value) {
    console.log(`${this.slug}: type ${selector}`)
    const locator = this.page.locator(selector).first()
    if (!await locator.count() || !await this.moveTo(locator)) return false
    await this.mouse("down")
    await this.mouse("up")
    let typed = ''
    for (const char of value) {
      typed += char
      await locator.evaluate((input, text) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, text)
        input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text.at(-1) }))
      }, typed)
      await this.hold(.10)
    }
    await this.hold(.45)
    this.actions.push({ selector, action: "type", frame: this.frame })
    return true
  }
}

const interactions = {
  api: {
    "#sandbox": async d => { await d.click('#sandbox [data-part="suggestion"]', 1, 1.8) },
    "#pricing": async d => { await d.slider('#pricing input[type="range"]', .65) },
  },
  app: {
    "#results": async d => { await d.slider('#results input[type="range"]', .25); await d.slider('#results input[type="range"]', .78) },
    "#faq": async d => { await d.click('#faq [data-part="q"], #faq summary', 1, .9) },
  },
  bakery: {
    "#shelf": async d => { await d.click('#shelf [data-part="add"]', 0, .9) },
    "#coffee": async d => { await d.slider('#coffee input[type="range"]', .75) },
    "#box": async d => { await d.click('#box [data-part="picker"] button', 1, .65); await d.click('#box [data-part="picker"] button', 3, .8) },
  },
  charity: {
    "#impact": async d => { await d.click('#impact [data-part="chip"]', 2, 1) },
    "#stories": async d => { await d.click('#stories [data-part="env"]', 0, 3); await d.click('#stories [data-part="close"]', 0, .8) },
  },
  course: {
    "#who": async d => { await d.click('#who [data-part="tab"]', 1, 1) },
    "#program": async d => { await d.click('#program [data-part="week-head"]', 1, 1); await d.click('#program [data-part="week-head"]', 2, 1) },
    "#faq": async d => { await d.click('#faq summary, #faq [data-part="q"]', 1, .9) },
  },
  festival: {
    "#schedule": async d => { await d.click('#schedule [data-part="day"]', 1, 1); await d.click('#schedule [data-part="filter"]', 1, .8) },
    "#faq": async d => { await d.click('#faq summary, #faq [data-part="q"]', 1, .9) },
  },
  fintech: {
    "#dashboard": async d => { await d.click('#dashboard [data-part="period"]', 1, 1.1) },
    "#calc": async d => { await d.slider('#calc input[type="range"]', .7) },
    "#faq": async d => { await d.click('#faq [data-part="q"], #faq summary', 1, .9) },
  },
  gadget: {
    "#inside": async d => { await d.slider('#inside input[type="range"]', .8) },
    "#preorder": async d => { await d.click('#preorder [data-part="swatch"]', 1, 1) },
    "#faq": async d => { await d.click('#faq [data-part="q"], #faq summary', 1, .9) },
  },
  market: {
    "#catalog": async d => { await d.click('#catalog [data-part="chip"]', 1, .8); await d.click('#catalog [data-part="chip"]', 0, .8); await d.click('#catalog [data-part="quick"]', 0, 1) },
    "#bundle": async d => { await d.click('#bundle [data-part="toggle"]', 0, .65); await d.click('#bundle [data-part="toggle"]', 1, .8) },
    "#faq": async d => { await d.click('#faq [data-part="q"], #faq summary', 1, .9) },
  },
  opensource: {
    "#playground": async d => { await d.click('#playground [data-part="toggle"]', 0, 1); await d.click('#playground [data-part="toggle"]', 2, 1) },
  },
  podcast: {
    "#episodes": async d => {
      if (await d.page.locator('[data-vibeui-block="podcast-007"]').getAttribute('data-open') === 'true') {
        await d.moveTo(d.page.locator('#episodes [data-part="row"]').first(), .5)
        await d.hold(1.2)
        d.actions.push({ selector: '#episodes [data-part="row"]', action: "hover", result: "player-open", frame: d.frame })
      } else if (!await d.click('#episodes [data-part="play"]', 0, 1.4)) throw new Error("Podcast play button is unreachable")
      if (await d.page.locator('[data-vibeui-block="podcast-007"]').getAttribute('data-open') !== 'true') throw new Error("Podcast player did not open")
      d.actions.at(-1).result = "player-open"
    },
  },
  portfolio: {
    "#contact": async d => { await d.type('#contact input[type="text"]', d.locale === "ru" ? 'Алекс' : 'Alex') },
  },
  realty: {
    "#objects": async d => { await d.click('#objects [data-part="chip"]', 1, .9); await d.click('#objects [data-part="chip"]', 0, .8) },
    "#mortgage": async d => { await d.slider('#mortgage input[type="range"]', .55) },
    "#faq": async d => { await d.click('#faq summary, #faq [data-part="q"]', 1, .9) },
  },
  renovation: {
    "#calc": async d => { await d.slider('#calc input[type="range"]', .55); await d.click('#calc [data-part="type"]', 1, .8) },
    "#works": async d => { await d.click('#works [data-part="tab"]', 1, .8); await d.slider('#works input[type="range"]', .8) },
  },
  writer: {
    "#book": async d => { await d.click('#book [data-part="book"]', 0, 1.1); await d.click('#book [data-part="formats"] button', 1, .8) },
    "#texts": async d => { await d.click('#texts [data-part="row"]', 0, 1.2); await d.click('#texts [data-part="row"]', 0, .6) },
  },
  auto: {
    "#services": async d => { await d.click('#services [data-part="card"]', 1); await d.click('#services [data-part="class"]', 2) },
    "#results": async d => { await d.slider('#results input[type="range"]', .2); await d.slider('#results input[type="range"]', .8) },
    "#booking": async d => { await d.click('#booking [data-part="slot"]:not(:disabled):not([aria-disabled="true"])'); await d.type('#booking input[type="text"]', 'Alex') },
  },
  saas: {
    "#sandbox": async d => {
      await d.click('#sandbox [data-part="run"]', 0, 1)
      for (let i = 0; i < 32 && await d.page.locator('#sandbox [data-part="run"]').isDisabled(); i++) await d.hold(.25)
      await d.hold(.9)
    },
    "#pricing": async d => { await d.slider('#pricing input[type="range"]', .4) },
    "#security": async d => { await d.click('#security [data-part="q"]', 1, 1.0) },
  },
  "wedding-winter": {
    "#rsvp": async d => { await d.type('#rsvp input[type="text"]', d.locale === "ru" ? 'Алекс' : 'Alex'); await d.click('#rsvp [data-part="choice"]'); await d.click('#rsvp [data-part="nav"] button:not(:disabled)', 0, .9) },
    "#faq": async d => { await d.click('#faq summary', 0, .8) },
  },
  photographer: {
    "#works": async d => { await d.click('#works [data-part="chip"]', 2, .85); await d.click('#works [data-part="chip"]', 0, .7) },
    "#book": async d => { await d.type('#book input[type="text"]', 'Alex') },
  },
  "wedding-cuba": {
    "#days": async d => { await d.click('#days [data-part="tab"]', 1, 1.0) },
    "#travel": async d => { await d.click('#travel [data-part="check"]', 0, .4); await d.click('#travel [data-part="check"]', 1, .4) },
    "#checkin": async d => { await d.click('#checkin [data-part="choice"]'); await d.click('#checkin button:has-text("Next")', 0, .7); await d.type('#checkin input[type="text"]', 'Alex') },
    "#faq": async d => { await d.click('#faq summary', 0, .8) },
  },
  delivery: {
    "#menu": async d => { await d.click('#menu [data-part="add"]', 0, .75) },
    "#builder": async d => { await d.click('#builder [data-part="tile"]', 1, .6); await d.click('#builder [data-part="tile"]', 5, .8) },
    "#zones": async d => { await d.click('#zones [data-part="spot"]', 1, .9) },
    "#tracker": async d => { await d.click('#tracker [data-part="play"]', 0, 7.4) },
    "#faq": async d => { await d.click('#faq [data-part="q"]', 1, .8) },
  },
  tattoo: {
    "#works": async d => { await d.click('#works [data-part="filter"]', 2, .8); await d.click('#works [data-part="filter"]', 0, .7) },
    "#pricing": async d => { await d.slider('#pricing input[type="range"]', .68); await d.click('#pricing [data-part="zone"]', 2, .7) },
    "#reviews": async d => { await d.click('#reviews button[aria-label="Next"]', 0, 1) },
    "#faq": async d => { await d.click('#faq summary', 1, .8) },
  },
  restaurant: {
    "#menu": async d => { await d.click('#menu [data-part="tab"]', 1, 1.0) },
    "#book": async d => { await d.click('#book [data-part="slot"]', 2, .75) },
  },
  vet: {
    "#body": async d => { await d.click('#body [data-part="spot"]', 2, 1.0) },
    "#symptoms": async d => { await d.click('#symptoms [data-part="chip"]', 5, 1) },
    "#grooming": async d => { await d.slider('#grooming input[type="range"]', .7) },
    "#contacts": async d => { await d.type('#contacts input[type="text"]', 'Alex') },
  },
  flowers: {
    "#catalog": async d => { await d.click('#catalog [data-part="nav-arrow"]', 1, 1) },
    "#builder": async d => { await d.click('#builder [data-part="step"]', 1, .5); await d.click('#builder [data-part="step"]', 3, .7) },
    "#delivery": async d => { await d.click('#delivery [data-part="slot"]', 3, 1) },
    "#care": async d => { await d.click('#care [data-part="head"]', 2, .9) },
  },
  wedding: {
    "#story": async d => { await d.click('#story button', 1, 1) },
    "#rsvp": async d => { await d.type('#rsvp input[type="text"]', d.locale === "ru" ? 'Алекс' : 'Alex'); await d.click('#rsvp [data-part="choice"]'); await d.click('#rsvp [data-part="nav"] button:not(:disabled)', 0, .9) },
    "#faq": async d => { await d.click('#faq summary', 0, .8) },
  },
}

async function contactSheet(directory, checkpoints) {
  const width = 480, height = 300, columns = 3
  const tiles = await Promise.all(checkpoints.map(async (point, i) => ({
    input: await sharp(path.join(directory, point.file)).resize(width, height).jpeg({ quality: 85 }).toBuffer(),
    left: (i % columns) * width, top: Math.floor(i / columns) * height,
  })))
  await sharp({ create: { width: width * columns, height: Math.ceil(tiles.length / columns) * height, channels: 3, background: "#181818" } }).composite(tiles).jpeg({ quality: 85 }).toFile(path.join(directory, "contact-sheet.jpg"))
}

async function render(slug, locale, captureOverride) {
  const directory = path.join(auditRoot, ...(args.includes("--locale") ? [locale] : []), slug)
  await mkdir(directory, { recursive: true })
  // The experimental compositor command can stall when a live map navigates.
  // Native still capture uses the same frozen UI clock and per-frame poses.
  const captureMode = captureOverride ?? process.env.MOTION_CAPTURE ?? (["bakery", "app"].includes(slug) ? "screenshot" : "compositor")
  if (!["screenshot", "compositor"].includes(captureMode)) throw new Error("Invalid MOTION_CAPTURE")
  const browser = await chromium.launch({ headless: true, args: captureMode === "compositor" ? ["--enable-begin-frame-control", "--run-all-compositor-stages-before-draw"] : [] })
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1, locale: locale === "ru" ? "ru-RU" : "en-US" })
  let encoder, completion
  try {
    await page.clock.install()
    await page.addInitScript(() => {
      // Third-party map widgets keep their own native timers and rendering.
      if (window.top !== window) window.__pwClock?.controller.uninstall()
    })
    const response = await page.goto(`${baseFor(locale)}/scenarios/${slug}/demo`, { waitUntil: "domcontentloaded", timeout: 120000 })
    if (response.status() !== 200) throw new Error(`HTTP ${response.status()}`)
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
    await page.evaluate(() => document.fonts.ready)
    // Force lazy images to load before freezing the render clock; this never
    // changes their styling or content and avoids blank gallery cards later.
    await page.evaluate(async () => {
      const images = Array.from(document.images)
      images.forEach(image => { image.loading = "eager" })
      document.querySelectorAll('iframe').forEach(frame => { frame.loading = "eager" })
      await Promise.all(images.map(image => image.decode().catch(() => {})))
    })
    await page.evaluate(() => window.__pwClock.controller.pauseAt(Date.now() + 1000))
    await page.evaluate(cursorScript)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
    const cdp = await page.context().newCDPSession(page)
    await cdp.send("Performance.enable")
    await cdp.send('DOM.enable')
    await cdp.send('CSS.enable')
    const { root: documentRoot } = await cdp.send('DOM.getDocument')
    const { metrics } = await cdp.send("Performance.getMetrics")
    const nativeStart = metrics.find(metric => metric.name === "Timestamp").value * 1000
    const output = path.join(directory, `${slug}.mp4`)
    encoder = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-vcodec", "mjpeg", "-i", "pipe:0", "-an", "-c:v", "libx264", "-threads", "2", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", output], { stdio: ["pipe", "ignore", "pipe"], windowsHide: true })
    let encoderError = ""
    encoder.stderr.on("data", data => { encoderError += data })
    completion = new Promise((resolve, reject) => {
      encoder.on("error", reject)
      encoder.on("close", code => code === 0 ? resolve() : reject(new Error(encoderError)))
    })
    completion.catch(() => {})
    const director = new Director(page, cdp, encoder, directory, `${locale}/${slug}`)
    director.locale = locale
    director.captureMode = captureMode
    director.nativeStart = nativeStart
    director.documentNode = documentRoot.nodeId
    try {
      const gateSelector = '[data-vibeui-block^="hero-"] button[data-part="seal"], [data-vibeui-block^="hero-"] button[data-part="tear"], [data-vibeui-block^="hero-"] button[data-part="candle"]'
      const gate = page.locator(gateSelector).first()
      if (await gate.count() && await gate.isVisible()) {
        await director.hold(.7)
        await director.click(gateSelector, 0, 2.1)
      }
      // Replay the original hero film, including its native entrance transition.
      const heroVideo = page.locator('[data-vibeui-block^="hero-"] video').first()
      if (await heroVideo.count()) {
        await heroVideo.evaluate(video => { video.pause(); video.currentTime = 0; video.dispatchEvent(new Event("ended")) })
        await page.evaluate(() => window.__pwClock.controller.runFor(50))
        const replay = page.locator('[data-vibeui-block^="hero-"] [data-part="replay"]')
        if (await replay.count()) {
          await replay.evaluate(button => button.click())
          await page.evaluate(() => window.__pwClock.controller.runFor(50))
        }
        // Let the native play() promise settle BEFORE pausing for frame seeks.
        // Otherwise the hero's AbortError handler switches to its final state,
        // leaving the parked car and final copy over the moving intro film.
        const playback = heroVideo.evaluate(video => video.play())
        if (captureMode === "compositor") await cdp.send('HeadlessExperimental.beginFrame', { frameTimeTicks: director.nativeStart, interval: 1000 / FPS })
        await playback
        await page.evaluate(() => window.__pwClock.controller.runFor(800))
        director.nativeStart += 800
        if (captureMode === "compositor") await cdp.send('HeadlessExperimental.beginFrame', { frameTimeTicks: director.nativeStart, interval: 1000 / FPS })
        await page.evaluate(() => { for (const video of document.querySelectorAll('video')) { video.pause(); video.currentTime = 0 } })
        if (slug === 'auto') {
          const phase = await page.locator('[data-vibeui-block="hero-046"]').getAttribute('data-phase')
          if (phase !== 'playing') throw new Error(`Auto intro must not show the parked overlay: ${phase}`)
        }
        const duration = await heroVideo.evaluate(video => Number.isFinite(video.duration) ? video.duration : 4)
        await director.hold(Math.min(18, Math.max(3.2, duration + 1.8)))
      } else await director.hold(3.2)
      if (slug === "podcast") {
        if (!await director.click('[data-vibeui-block="hero-029"] button[data-part="play"]', 0, 1.2)) throw new Error("Hero podcast play button is unreachable")
        if (await page.locator('[data-vibeui-block="podcast-007"]').getAttribute('data-open') !== 'true') throw new Error("Hero podcast player did not open")
        director.actions.at(-1).result = "player-open"
      }
      await director.checkpoint("hero")
      await sharp(director.lastFrame).resize(960, 600).webp({ quality: 80 }).toFile(path.join(directory, `${slug}.webp`))

      const scenes = await page.evaluate(() => {
        const ids = Array.from(document.querySelectorAll('body [id]')).filter(el => /^[a-z][a-z0-9-]*$/.test(el.id) && !el.closest('svg') && el.getBoundingClientRect().height > 180)
        const outer = ids.filter(el => !ids.some(other => other !== el && other.contains(el)))
        const entries = outer.filter(el => !['hero','top'].includes(el.id)).map(el => ({ el, selector: `#${el.id}` }))
        // Some demo sections (logos, reading excerpts) have no anchor. Include
        // those too, without changing the site's layout or styling.
        const blocks = Array.from(document.querySelectorAll('[data-vibeui-block]')).filter(el =>
          !el.parentElement.closest('[data-vibeui-block]') &&
          !/^(navbar|hero|footer|background)-/.test(el.dataset.vibeuiBlock) &&
          !['fixed', 'absolute'].includes(getComputedStyle(el).position) &&
          el.getBoundingClientRect().height > 180 &&
          !outer.some(wrapper => wrapper === el || wrapper.contains(el)))
        blocks.forEach((el, index) => {
          el.dataset.motionScene = String(index)
          entries.push({ el, selector: `[data-motion-scene="${index}"]` })
        })
        const result = entries.sort((a, b) => a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top).map(entry => entry.selector)
        const footer = document.querySelector('footer,[data-vibeui-block^="footer-"]')
        if (footer && !result.some(selector => document.querySelector(selector).contains(footer))) result.push('footer,[data-vibeui-block^="footer-"]')
        return result
      })
      if (scenes.length < 5) throw new Error(`Too few scenes: ${JSON.stringify(scenes)}`)
      console.log(`${slug}: ${scenes.length} scenes`)
      for (const selector of scenes) {
        await director.scrollTo(selector)
        await director.hold(.9)
        const interaction = interactions[slug]?.[selector]
        if (interaction) await interaction(director)
        await director.hold(interaction ? .3 : .85)
        await director.checkpoint(selector)
        const height = await page.locator(selector).first().evaluate(el => el.getBoundingClientRect().height)
        if (height > HEIGHT + 240) {
          const geometry = await page.locator(selector).first().evaluate(el => ({ from: scrollY, to: Math.min(document.documentElement.scrollHeight - innerHeight, scrollY + el.getBoundingClientRect().bottom - innerHeight + 80) }))
          const distance = geometry.to - geometry.from
          const steps = Math.max(1, Math.ceil(distance / (HEIGHT * .85)))
          for (let step = 1; step <= steps; step++) {
            await director.pan({ from: await page.evaluate(() => scrollY), to: geometry.from + distance * step / steps }, `${selector}-detail-${step}`)
            await director.hold(step === steps ? .9 : .45)
          }
          await director.checkpoint(`${selector}-lower`)
        }
      }
      await director.hold(.7)
    } catch (error) {
      if (error.message !== "FRAME_LIMIT") throw error
    }
    encoder.stdin.end()
    await completion
    const probe = JSON.parse(execFileSync(ffprobe, ["-v", "error", "-show_streams", "-show_format", "-of", "json", output], { windowsHide: true, encoding: "utf8" }))
    if (probe.streams.some(stream => stream.codec_type === "audio")) throw new Error("Unexpected audio track")
    if (probe.streams[0].avg_frame_rate !== "60/1") throw new Error("Unexpected frame rate")
    execFileSync(ffmpeg, ["-v", "error", "-i", output, "-f", "null", "-"], { windowsHide: true, timeout: 120000 })
    const audit = { slug, locale, captureMode, url: page.url(), frames: director.frame, seconds: director.frame / FPS, width: WIDTH, height: HEIGHT, checkpoints: director.checkpoints, scrolls: director.scrolls, actions: director.actions, streams: probe.streams, size: probe.format.size }
    await writeFile(path.join(directory, "audit.json"), JSON.stringify(audit, null, 2))
    if (director.checkpoints.length) await contactSheet(directory, director.checkpoints)
    console.log(`DONE ${locale}/${slug}: ${audit.seconds.toFixed(2)}s, ${(Number(audit.size) / 1048576).toFixed(2)} MiB, ${audit.actions.length} interactions`)
  } catch (error) {
    console.error(`FAILED ${locale}/${slug}:`, error)
    throw error
  } finally {
    if (encoder && !encoder.killed) {
      encoder.stdin.end()
      await completion?.catch(() => {})
    }
    await browser.close()
  }
}

if (!selected.length) throw new Error("Specify scenario slugs, all or --missing")
await mkdir(auditRoot, { recursive: true })
// Two independent browsers overlap screenshot I/O without overcrowding this host.
let next = 0
const failures = []
console.log(`Render queue: ${jobs.map(job => `${job.locale}/${job.slug}`).join(', ')}`)
await Promise.all(Array.from({ length: Math.min(2, jobs.length) }, async () => {
  while (next < jobs.length) {
    const { slug, locale } = jobs[next++]
    try { await render(slug, locale) } catch {
      console.log(`Retry ${locale}/${slug} with native still capture`)
      try { await render(slug, locale, "screenshot") } catch { failures.push(`${locale}/${slug}`) }
    }
  }
}))
if (failures.length) throw new Error(`Scenarios to retry: ${failures.join(', ')}`)
