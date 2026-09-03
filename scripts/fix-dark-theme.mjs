// Пакетная правка: ветка тёмной темы по классу. Функция light-dark() смотрит
// только на color-scheme, а shadcn и next-themes переключают тему классом
// .dark и сам color-scheme не объявляют. Без этой строки компонент остаётся
// светлым на тёмной странице чужого проекта — самый частый и самый заметный
// дефект переносимости.
//
// Запуск: node scripts/fix-dark-theme.mjs [--dry]

import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const dry = process.argv.includes("--dry")

let fixed = 0
let missed = 0

for (const kind of ["blocks", "components"]) {
  const dir = path.join(ROOT, "registry", kind)

  if (!fs.existsSync(dir)) {
    continue
  }

  for (const category of fs.readdirSync(dir)) {
    const file = path.join(dir, category, "registry.json")

    if (!fs.existsSync(file)) {
      continue
    }

    const registry = JSON.parse(fs.readFileSync(file, "utf8"))

    for (const item of registry.items ?? []) {
      const source = path.join(dir, category, item.name, `${item.name}.tsx`)

      if (!fs.existsSync(source)) {
        continue
      }

      let code = fs.readFileSync(source, "utf8")

      if (!code.includes("light-dark(")) {
        continue
      }

      const line = `:where(.dark,[data-theme="dark"]) [data-vibeui-block="${item.name}"]{color-scheme:dark}`

      if (code.includes(line)) {
        continue
      }

      // Строка встаёт сразу за блоком переменных: там она читается как часть
      // палитры, а не как случайное правило посреди раскладки.
      const marker = `:where([data-vibeui-block="${item.name}"]){`
      const start = code.indexOf(marker)

      if (start < 0) {
        missed += 1
        continue
      }

      const end = code.indexOf("\n}\n", start)

      if (end < 0) {
        missed += 1
        continue
      }

      const comment = `/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */\n`

      code =
        code.slice(0, end + 3) + comment + line + "\n" + code.slice(end + 3)

      fixed += 1

      if (!dry) {
        fs.writeFileSync(source, code)
      }
    }
  }
}

console.log(
  `${dry ? "Проверка: " : ""}ветка тёмной темы добавлена в ${fixed} файлов, не нашлось места в ${missed}`,
)
