import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"

/**
 * Убирает витринные данные из опубликованных registry-файлов.
 *
 * `meta.preview` — это демо для карточки каталога: пропсы кадра и ряд
 * состояний. Пути в них ведут на наши демо-фотографии (`/demo/avatars/…`),
 * которых в чужом проекте нет. В устанавливаемый файл они не попадают, но
 * агент читает JSON целиком и вполне может подставить такой путь в разметку.
 *
 * Всё остальное в `meta` — `ai`, `controls`, `tags` — агенту нужно и остаётся.
 *
 * Здесь же из публичной раздачи убираются закрытые item'ы (`meta.pro`):
 * `public/r/` отдаёт nginx без всяких проверок, поэтому оставленный там
 * файл — это подписка, отданная даром. Их раздаёт `/r/pro/<name>.json`,
 * который сверяет ключ и подписку.
 */
const ROOT = "public/r"
const DEMO = "/demo/"

/**
 * База для `registryDependencies` составных блоков: голое имя shadcn CLI
 * ищет в ui.shadcn.com, а не у нас. Домен — `homepage` корневого
 * registry.json; на `.club` статика укажет на `.ru`, файл тот же.
 */
const HOMEPAGE = JSON.parse(readFileSync("registry.json", "utf8")).homepage.replace(/\/$/, "")

/**
 * Три первых правила «сохрани как установлено» — в `docs`: shadcn CLI
 * печатает это поле после установки, и правила доходят до агента терминалом,
 * даже когда его фетчер пересказал бриф. Тот же текст для закрытых item'ов
 * собирает lib/registry-docs.ts.
 */
function withRules(item) {
  const rules = (item.meta?.ai?.preserve ?? []).slice(0, 3)

  if (rules.length === 0 || item.docs?.startsWith("Сохрани как установлено:")) {
    return false
  }

  const block = ["Сохрани как установлено:", ...rules.map((rule) => `- ${rule}`)].join("\n")

  item.docs = item.docs ? `${block}\n\n${item.docs}` : block

  return true
}

/** Витрина и её пути уходят; всё остальное в `meta` агенту нужно. */
function stripItem(item) {
  let touched = withRules(item)

  // Исходник из статики убираем: `public/r` отдаёт nginx без проверки, и
  // оставленный тут `content` — это код, отданный даром. Реальный файл
  // приезжает по подписанной ссылке через /r/pro (см. lib/registry-link).
  for (const file of item.files ?? []) {
    if (file.content !== undefined) {
      delete file.content
      touched = true
    }
  }

  const dependencies = item.registryDependencies ?? []

  if (dependencies.some((name) => !name.startsWith("http"))) {
    item.registryDependencies = dependencies.map((name) =>
      name.startsWith("http") ? name : `${HOMEPAGE}/r/${name}.json`,
    )
    touched = true
  }

  if (item.meta?.preview) {
    delete item.meta.preview
    touched = true
  }

  if (item.meta?.i18n?.en?.preview) {
    delete item.meta.i18n.en.preview
    touched = true
  }

  // Дефолт контрола едет агенту как есть. Наш демо-путь в чужом проекте —
  // битая ссылка, поэтому такой контрол публикуется пустым.
  for (const control of item.meta?.controls ?? []) {
    if (typeof control.default === "string" && control.default.startsWith(DEMO)) {
      control.default = ""
      touched = true
    }
  }

  for (const control of Object.values(item.meta?.i18n?.en?.controls ?? {})) {
    if (typeof control.default === "string" && control.default.startsWith(DEMO)) {
      control.default = ""
      touched = true
    }
  }

  return touched
}

let cleaned = 0
let closed = 0

for (const file of readdirSync(ROOT)) {
  if (!file.endsWith(".json")) {
    continue
  }

  const full = path.join(ROOT, file)
  const content = JSON.parse(readFileSync(full, "utf8"))
  // Сводный `registry.json` — список item'ов, остальные файлы — сами item'ы.
  const isIndex = Array.isArray(content.items)
  const items = isIndex ? content.items : [content]

  if (!isIndex && items[0]?.meta?.pro) {
    rmSync(full)
    closed += 1
    continue
  }

  if (isIndex) {
    const open = items.filter((item) => !item.meta?.pro)

    if (open.length !== items.length) {
      content.items = open
      closed += items.length - open.length
      open.map(stripItem)
      writeFileSync(full, `${JSON.stringify(content, null, 2)}\n`)
      cleaned += 1
      continue
    }
  }

  const touched = items.map(stripItem).some(Boolean)

  if (!touched) {
    continue
  }

  writeFileSync(full, `${JSON.stringify(content, null, 2)}\n`)
  cleaned += 1
}

console.log(`✓ витринные данные убраны из ${cleaned} файлов registry`)

if (closed > 0) {
  console.log(`✓ закрытых item'ов не опубликовано: ${closed}`)
}
