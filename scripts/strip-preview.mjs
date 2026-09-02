import { readdirSync, readFileSync, writeFileSync } from "node:fs"
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
 */
const ROOT = "public/r"
const DEMO = "/demo/"

/** Витрина и её пути уходят; всё остальное в `meta` агенту нужно. */
function stripItem(item) {
  let touched = false

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

for (const file of readdirSync(ROOT)) {
  if (!file.endsWith(".json")) {
    continue
  }

  const full = path.join(ROOT, file)
  const content = JSON.parse(readFileSync(full, "utf8"))
  // Сводный `registry.json` — список item'ов, остальные файлы — сами item'ы.
  const items = Array.isArray(content.items) ? content.items : [content]
  const touched = items.map(stripItem).some(Boolean)

  if (!touched) {
    continue
  }

  writeFileSync(full, `${JSON.stringify(content, null, 2)}\n`)
  cleaned += 1
}

console.log(`✓ витринные данные убраны из ${cleaned} файлов registry`)
