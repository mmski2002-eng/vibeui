// Пакетная правка: meta.preview.width. Кадр витрины центрирует содержимое
// флексом, поэтому компонент, которому нужна настоящая ширина строки, без
// объявления схлопывается по содержимому и показывает не тот дизайн, который
// получит пользователь.
//
// Ширина выводится из корневого правила самого компонента: блочный элемент с
// width:100% просит полную строку, inline-block довольствуется содержимым.
//
// Запуск: node scripts/fix-preview-width.mjs [--dry]

import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const dry = process.argv.includes("--dry")

/** Корневое правило компонента: строки между [data-vibeui-block="имя"]{ и }. */
function rootRule(source, name) {
  const marker = `[data-vibeui-block="${name}"]{`
  const lines = source.split("\n")
  const start = lines.findIndex((line) => line === marker)

  if (start < 0) {
    return ""
  }

  const end = lines.findIndex((line, index) => index > start && line === "}")

  return lines.slice(start + 1, end < 0 ? undefined : end).join(" ")
}

let fixed = 0
let skipped = 0

for (const kind of ["blocks", "components"]) {
  const dir = path.join(ROOT, "registry", kind)

  if (!fs.existsSync(dir)) {
    continue
  }

  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name, "registry.json")

    if (!fs.existsSync(file)) {
      continue
    }

    const registry = JSON.parse(fs.readFileSync(file, "utf8"))
    let changed = false

    for (const item of registry.items ?? []) {
      if (item.meta?.preview?.width) {
        continue
      }

      const source = path.join(dir, name, item.name, `${item.name}.tsx`)

      if (!fs.existsSync(source)) {
        skipped += 1
        continue
      }

      const rule = rootRule(fs.readFileSync(source, "utf8"), item.name)

      // Блок, объявивший собственную ширину, просит полную строку кадра.
      // Inline-элемент занимает столько, сколько нужно содержимому.
      const inline = /display:\s*inline-(block|flex)/.test(rule)
      const wide = /width:\s*100%/.test(rule) || /max-width:/.test(rule)

      item.meta.preview = {
        ...(item.meta.preview ?? {}),
        width: inline && !wide ? "auto" : "full",
      }

      changed = true
      fixed += 1
    }

    if (changed && !dry) {
      fs.writeFileSync(file, JSON.stringify(registry, null, 2) + "\n")
    }
  }
}

console.log(
  `${dry ? "Проверка: " : ""}ширина превью проставлена у ${fixed} items, пропущено без файла: ${skipped}`,
)
