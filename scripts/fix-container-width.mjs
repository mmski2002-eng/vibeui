// Пакетная правка: нижняя граница ширины у компонентов с container-type.
//
// container-type:inline-size отрывает ширину элемента от его содержимого:
// внутри flex-контейнера такой блок сжимается до нуля, потому что содержимое
// больше не заставляет его расти. Это ломает компонент не только на витрине,
// но и в любом чужом макете. Нижняя граница возвращает разумный минимум,
// оставляя запас на узкие экраны через min(100%, …).
//
// Запуск: node scripts/fix-container-width.mjs [--dry]

import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const dry = process.argv.includes("--dry")

/** Разумный минимум: чуть уже собственной максимальной ширины компонента. */
function floorFor(rule) {
  const max = /max-width:\s*([\d.]+)rem/.exec(rule)

  if (!max) {
    return 16
  }

  const value = Number.parseFloat(max[1])

  // Компонент шириной в 20rem не должен требовать 16rem минимума только
  // потому, что так написано в правиле по умолчанию.
  return Math.min(16, Math.max(8, Math.round(value * 0.8)))
}

let fixed = 0
let missed = 0

for (const kind of ["blocks", "components"]) {
  const dir = path.join(ROOT, "registry", kind)

  if (!fs.existsSync(dir)) {
    continue
  }

  for (const category of fs.readdirSync(dir)) {
    const categoryDir = path.join(dir, category)

    if (!fs.statSync(categoryDir).isDirectory()) {
      continue
    }

    for (const name of fs.readdirSync(categoryDir)) {
      const source = path.join(categoryDir, name, `${name}.tsx`)

      if (!fs.existsSync(source)) {
        continue
      }

      const code = fs.readFileSync(source, "utf8")

      if (!code.includes("container-type") || /min-width:\s*min\(/.test(code)) {
        continue
      }

      const lines = code.split("\n")
      const marker = `[data-vibeui-block="${name}"]{`
      const start = lines.findIndex((line) => line === marker)

      if (start < 0) {
        missed += 1
        continue
      }

      const end = lines.findIndex((line, index) => index > start && line === "}")
      const rule = lines.slice(start + 1, end).join(" ")
      const floor = floorFor(rule)

      const at = lines.findIndex(
        (line, index) =>
          index > start && index < end && /width:\s*100%/.test(line),
      )

      const insert = `/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,${floor}rem);`

      if (at >= 0) {
        lines[at] = lines[at].replace(
          /width:\s*100%;/,
          `width:100%;\n${insert}`,
        )
      } else {
        lines.splice(start + 1, 0, insert)
      }

      fixed += 1

      if (!dry) {
        fs.writeFileSync(source, lines.join("\n"))
      }
    }
  }
}

console.log(
  `${dry ? "Проверка: " : ""}нижняя граница ширины добавлена в ${fixed} файлов, не нашлось правила в ${missed}`,
)
