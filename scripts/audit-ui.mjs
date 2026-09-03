// Аудит каталога: ищет по всем items дефекты, которые повторяются из
// категории в категорию, и печатает их одним списком. Смысл в том, чтобы не
// искать одно и то же заново в каждой категории: правки становятся пакетными.
//
// Запуск: npm run audit            — весь каталог
//         npm run audit -- avatar  — только эти категории
//
// Правила намеренно текстовые, а не через разбор AST: они ловят форму записи,
// принятую в этом репозитории, и не претендуют на общий анализатор.

import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const REGISTRY = path.join(ROOT, "registry")

/** Правила по исходнику компонента. Каждое возвращает текст находки или null. */
const CODE_RULES = [
  {
    id: "props",
    title: "props не пробрасываются",
    check(source) {
      if (!/ComponentProps</.test(source)) {
        return null
      }

      return source.includes("{...props}")
        ? null
        : "тип объявляет ComponentProps, но в разметке нет {...props}: id, aria-* и обработчики теряются"
    },
  },
  {
    id: "container-width",
    title: "container-type без нижней границы ширины",
    check(source) {
      if (!source.includes("container-type")) {
        return null
      }

      return /min-width:\s*min\(/.test(source)
        ? null
        : "container-type отрывает ширину от содержимого: без min-width:min(100%,…) блок схлопнется внутри flex"
    },
  },
  {
    id: "button-height",
    title: "фиксированная высота у кнопки с настраиваемой подписью",
    check(source) {
      const rules = source.match(/\[data-part="[^"]*"\][^{]*\{[^}]*\}/g) ?? []

      for (const rule of rules) {
        const named = /\[data-part="(copy|action|apply|save|confirm|retry|submit|primary)"\]/.test(
          rule,
        )

        if (!named) {
          continue
        }

        if (/[^-]height:\s*\d/.test(rule) && !/min-height/.test(rule)) {
          return "у кнопки с настраиваемой подписью стоит height: длинный перевод вылезет за пределы"
        }
      }

      return null
    },
  },
  {
    id: "hover-only",
    title: "элемент управления живёт только на наведении",
    check(source) {
      if (!/opacity:\s*0;/.test(source)) {
        return null
      }

      const hoverShows = /:hover\s+(button|\[data-part)/.test(source)

      if (!hoverShows) {
        return null
      }

      return /@media\s*\(hover:\s*none\)/.test(source)
        ? null
        : "кнопка появляется по наведению, но нет @media (hover:none): на телефоне её не существует"
    },
  },
  {
    id: "radio-form",
    title: "радиогруппа не изолирована формой",
    check(source) {
      if (!/type="radio"/.test(source)) {
        return null
      }

      if (/<form/.test(source) || /useId\(\)/.test(source)) {
        return null
      }

      return "радиокнопки с общим именем вне <form>: два блока на странице сольются в одну группу"
    },
  },
  {
    id: "dialog-open",
    title: "панель на dialog не умеет открываться на витрине",
    check(source) {
      if (!/<dialog/.test(source)) {
        return null
      }

      return /defaultOpen/.test(source)
        ? null
        : "нет defaultOpen: на карточке каталога компонент показывает одну кнопку"
    },
  },
  {
    id: "dark-theme",
    title: "нет ветки тёмной темы по классу",
    check(source, name) {
      if (!source.includes("light-dark(")) {
        return null
      }

      return source.includes(`[data-theme="dark"]) [data-vibeui-block="${name}"]`)
        ? null
        : "light-dark() без строки color-scheme:dark по классу .dark — в проекте на shadcn останется светлым"
    },
  },
  {
    id: "reduced-motion",
    title: "анимация без учёта prefers-reduced-motion",
    check(source) {
      if (!/animation:|transition:/.test(source)) {
        return null
      }

      return /prefers-reduced-motion/.test(source)
        ? null
        : "есть анимация, но нет правила prefers-reduced-motion"
    },
  },
  {
    id: "crlf",
    title: "CRLF в исходнике",
    check(source) {
      return source.includes("\r\n") ? "файл в CRLF, ожидается LF" : null
    },
  },
]

/** Правила по metadata. */
const META_RULES = [
  {
    id: "card-controls",
    title: "значки на карточке не совпадают с настройками",
    check(item) {
      const all = (item.meta?.controls ?? []).map((entry) => entry.prop)
      const card = item.meta?.cardControls ?? []

      if (all.length === 0) {
        return null
      }

      const same =
        all.length === card.length && all.every((prop, index) => prop === card[index])

      return same
        ? null
        : `настроек ${all.length}, значков на карточке ${card.length}: часть настроек не видна с витрины`
    },
  },
  {
    id: "preview-width",
    title: "не объявлена ширина превью",
    check(item) {
      return item.meta?.preview?.width
        ? null
        : "нет meta.preview.width: кадр витрины может схлопнуть компонент по содержимому"
    },
  },
  {
    id: "controls-count",
    title: "настроек больше семи",
    check(item) {
      const count = (item.meta?.controls ?? []).length

      return count > 7
        ? `настроек ${count}: в шапке карточки столько значков не помещается`
        : null
    },
  },
  {
    id: "ai-thin",
    title: "инструкция для агента слишком тонкая",
    check(item) {
      const ai = item.meta?.ai

      if (!ai) {
        return "нет meta.ai: агенту нечего читать"
      }

      const thin =
        (ai.preserve ?? []).length < 3 || (ai.adapt ?? []).length < 3

      return thin ? "в ai.preserve или ai.adapt меньше трёх пунктов" : null
    },
  },
]

function categories() {
  const groups = []

  for (const kind of ["blocks", "components"]) {
    const dir = path.join(REGISTRY, kind)

    if (!fs.existsSync(dir)) {
      continue
    }

    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name, "registry.json")

      if (fs.existsSync(file)) {
        groups.push({ kind, name, file, dir: path.join(dir, name) })
      }
    }
  }

  return groups
}

const only = process.argv.slice(2).filter((value) => !value.startsWith("-"))
const findings = []
let checked = 0

for (const category of categories()) {
  if (only.length > 0 && !only.includes(category.name)) {
    continue
  }

  const registry = JSON.parse(fs.readFileSync(category.file, "utf8"))

  for (const item of registry.items ?? []) {
    checked += 1

    for (const rule of META_RULES) {
      const found = rule.check(item)

      if (found) {
        findings.push({
          category: category.name,
          item: item.name,
          rule: rule.id,
          text: found,
        })
      }
    }

    const source = path.join(category.dir, item.name, `${item.name}.tsx`)

    if (!fs.existsSync(source)) {
      findings.push({
        category: category.name,
        item: item.name,
        rule: "missing",
        text: "нет файла компонента",
      })
      continue
    }

    const code = fs.readFileSync(source, "utf8")

    for (const rule of CODE_RULES) {
      const found = rule.check(code, item.name)

      if (found) {
        findings.push({
          category: category.name,
          item: item.name,
          rule: rule.id,
          text: found,
        })
      }
    }
  }
}

const byRule = new Map()

for (const finding of findings) {
  const list = byRule.get(finding.rule) ?? []
  list.push(finding)
  byRule.set(finding.rule, list)
}

const titles = new Map(
  [...CODE_RULES, ...META_RULES].map((rule) => [rule.id, rule.title]),
)

console.log(`\nПроверено items: ${checked}. Находок: ${findings.length}.\n`)

const order = [...byRule.entries()].sort((a, b) => b[1].length - a[1].length)

for (const [rule, list] of order) {
  console.log(`── ${titles.get(rule) ?? rule} — ${list.length}`)

  const byCategory = new Map()

  for (const finding of list) {
    const items = byCategory.get(finding.category) ?? []
    items.push(finding.item)
    byCategory.set(finding.category, items)
  }

  for (const [category, items] of [...byCategory.entries()].sort()) {
    const shown = items.slice(0, 8).join(", ")
    const rest = items.length > 8 ? ` … и ещё ${items.length - 8}` : ""
    console.log(`   ${category}: ${shown}${rest}`)
  }

  console.log("")
}

if (findings.length > 0 && process.argv.includes("--json")) {
  const out = path.join(ROOT, ".omc", "audit-ui.json")
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, JSON.stringify(findings, null, 2))
  console.log(`Полный список: ${path.relative(ROOT, out)}`)
}
