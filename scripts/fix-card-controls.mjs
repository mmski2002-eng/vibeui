// Пакетная правка: значки в шапке карточки должны показывать все настройки
// компонента. Исторически cardControls заполняли выборочно, и половина
// настроек оставалась недоступной с витрины — человек видел компонент, но не
// мог его покрутить.
//
// Запуск: node scripts/fix-card-controls.mjs [--dry]

import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const dry = process.argv.includes("--dry")

let touched = 0
let items = 0

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
      const all = (item.meta?.controls ?? []).map((entry) => entry.prop)

      if (all.length === 0) {
        continue
      }

      // Больше семи значков шапка не выдерживает: там оставляем то, что уже
      // выбрано руками, и разбираемся отдельно.
      if (all.length > 7) {
        continue
      }

      const current = item.meta.cardControls ?? []
      const same =
        current.length === all.length &&
        all.every((prop, index) => prop === current[index])

      if (same) {
        continue
      }

      item.meta.cardControls = all
      changed = true
      items += 1
    }

    if (changed) {
      touched += 1

      if (!dry) {
        fs.writeFileSync(file, JSON.stringify(registry, null, 2) + "\n")
      }
    }
  }
}

console.log(
  `${dry ? "Проверка: " : ""}items исправлено: ${items}, реестров затронуто: ${touched}`,
)
