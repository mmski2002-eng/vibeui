import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"

/**
 * Проверка наших полей в registry.json. `shadcn registry validate` знает
 * только свою схему и про `meta` ничего не говорит, поэтому контролы,
 * `export` и `usage` до сих пор никто не проверял.
 *
 * Ошибки роняют сборку, предупреждения — нет: связь контрола с `ai.adapt`
 * ищется по тексту и даёт ложные срабатывания.
 */

const CONTROL_TYPES = ["text", "select", "color", "boolean", "number"]

/**
 * Токены темы проекта-хозяина. Registry-компонент обязан быть безразличен
 * к чужой теме: он несёт собственную палитру `--vibeui-*`, иначе после
 * установки выглядит не так, как в preview, — и главное обещание VibeUI
 * ломается (правило фидельности, docs/PROJECT_CONTEXT.md).
 */
const THEME_TOKENS =
  /(?:bg|text|border|ring|fill|stroke|from|via|to)-(?:primary|secondary|background|foreground|muted|accent|card|popover|destructive|border|input|ring)/

/** Единственный разрешённый источник импорта в файле item'а. */
const ALLOWED_IMPORT = "react"

/** Локали помимо русского: русский лежит в обычных полях. */
const LOCALES = ["en"]

const TRANSLATED_ARRAYS = ["preserve", "adapt", "notes"]
const COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

const errors = []
const warnings = []

function registriesIn(directory) {
  const root = path.join(process.cwd(), directory)

  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(root, entry.name, "registry.json"))
}

function validateControl(where, control, seen) {
  const at = `${where} → ${control.prop ?? "(без prop)"}`

  if (!control.prop || typeof control.prop !== "string") {
    errors.push(`${where}: у контрола нет prop`)
    return
  }

  if (seen.has(control.prop)) {
    errors.push(`${at}: контрол объявлен дважды`)
  }

  seen.add(control.prop)

  if (!control.label) {
    errors.push(`${at}: нет label`)
  }

  if (!CONTROL_TYPES.includes(control.type)) {
    errors.push(`${at}: тип ${control.type} неизвестен`)
    return
  }

  if (control.default === undefined) {
    errors.push(`${at}: нет default`)
    return
  }

  if (control.type === "select") {
    if (!Array.isArray(control.options) || control.options.length === 0) {
      errors.push(`${at}: select без options`)
    } else if (!control.options.includes(control.default)) {
      errors.push(`${at}: default "${control.default}" не входит в options`)
    }
  }

  if (control.type === "text" && control.maxLength !== undefined) {
    if (!Number.isInteger(control.maxLength) || control.maxLength <= 0) {
      errors.push(`${at}: maxLength должен быть положительным целым`)
    } else if (String(control.default).length > control.maxLength) {
      errors.push(`${at}: default длиннее maxLength`)
    }
  }

  if (
    control.type === "color" &&
    control.default !== "" &&
    !COLOR_PATTERN.test(control.default)
  ) {
    errors.push(`${at}: default цвета должен быть пустым или #rrggbb`)
  }

  if (control.type === "boolean" && typeof control.default !== "boolean") {
    errors.push(`${at}: default должен быть boolean`)
  }

  if (control.type === "number") {
    if (typeof control.default !== "number") {
      errors.push(`${at}: default должен быть числом`)
    } else if (
      (control.min !== undefined && control.default < control.min) ||
      (control.max !== undefined && control.default > control.max)
    ) {
      errors.push(`${at}: default вне диапазона min–max`)
    }
  }
}

function pascalCase(name) {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

/**
 * Полнота русской metadata. Каталог и промпт для агента собираются только
 * из неё: пустое поле — это дыра на витрине или в инструкции.
 */
function validateBase(where, item) {
  // Заготовки скаффолда. Пока они на месте, item не готов к витрине —
  // и сборка обязана падать, а не публиковать «TODO» в промпте для агента.
  if (JSON.stringify(item).includes("TODO")) {
    errors.push(`${where}: в metadata остались TODO из скаффолда`)
  }

  if (!item.title) {
    errors.push(`${where}: нет title`)
  }

  if (!item.description || item.description.length < 40) {
    errors.push(`${where}: description короче 40 символов или отсутствует`)
  }

  if (!Array.isArray(item.meta?.tags) || item.meta.tags.length === 0) {
    errors.push(`${where}: нет meta.tags`)
  }

  const ai = item.meta?.ai

  if (!ai?.summary) {
    errors.push(`${where}: нет meta.ai.summary`)
  }

  for (const field of ["preserve", "adapt"]) {
    if (!Array.isArray(ai?.[field]) || ai[field].length < 3) {
      errors.push(`${where}: в meta.ai.${field} меньше трёх пунктов`)
    }
  }
}

/**
 * Паритет переводов. Непереведённое поле откатывается к русскому — это
 * штатное поведение, но для витрины оно означает русский текст на английской
 * странице, поэтому обязательные поля проверяются жёстко, а списки — по длине:
 * потерянный пункт `preserve` меняет инструкцию агенту.
 */
function validateI18n(where, item) {
  const ai = item.meta?.ai ?? {}

  for (const locale of LOCALES) {
    const translated = item.meta?.i18n?.[locale]
    const at = `${where} → i18n.${locale}`

    if (!translated) {
      errors.push(`${where}: нет перевода i18n.${locale}`)
      continue
    }

    // `docs` рендерится на странице item'а: без перевода англоязычный
    // человек видит там русский абзац. У блоков перевод пока не заведён —
    // правило включится, когда он появится.
    if (item.docs && !translated.docs) {
      errors.push(`${at}: не переведён docs`)
    }

    if (!translated.description) {
      errors.push(`${at}: нет description`)
    }

    if (!translated.ai?.summary) {
      errors.push(`${at}: нет ai.summary`)
    }

    for (const field of TRANSLATED_ARRAYS) {
      const original = ai[field]
      const copy = translated.ai?.[field]

      if (!Array.isArray(original)) {
        continue
      }

      if (!Array.isArray(copy)) {
        errors.push(`${at}: не переведён ai.${field}`)
      } else if (copy.length !== original.length) {
        errors.push(
          `${at}: в ai.${field} ${copy.length} пунктов против ${original.length} в оригинале`,
        )
      }
    }

    if (ai.usage && !translated.ai?.usage) {
      errors.push(`${at}: не переведён ai.usage`)
    }

    for (const control of item.meta?.controls ?? []) {
      if (!translated.controls?.[control.prop]?.label) {
        errors.push(`${at}: у контрола ${control.prop} нет label`)
      }

      // Подпись по умолчанию — это видимый текст. На английской витрине
      // русский default уехал бы в сниппет для агента.
      if (
        control.type === "text" &&
        translated.controls?.[control.prop]?.default === undefined
      ) {
        errors.push(`${at}: у текстового контрола ${control.prop} нет default`)
      }
    }
  }
}

/**
 * Проверка самого исходника. Правила переносимости из
 * docs/PROJECT_CONTEXT.md формальны настолько, что их можно не проверять
 * глазами: чужая тема, чужие зависимости, анимация без reduced-motion.
 */
function validateSource(where, directory, item) {
  const relative = item.files?.find((entry) =>
    entry.path?.endsWith(".tsx"),
  )?.path

  if (!relative) {
    errors.push(`${where}: среди files[] нет .tsx`)
    return
  }

  const file = path.join(directory, relative)

  if (!existsSync(file)) {
    errors.push(`${where}: файл ${relative} не найден`)
    return
  }

  const source = readFileSync(file, "utf8")
  const symbol = pascalCase(item.name)

  // CRLF уезжает в `/r/<name>.json` и в `/f/<name>.tsx` как есть, а мы обещаем
  // байтовое равенство установленного файла и исходника (docs/DELIVERY.md).
  // На Windows такой перевод строк заводится сам, поэтому это ошибка сборки.
  if (source.includes("\r\n")) {
    errors.push(`${where}: CRLF в исходнике — файлы item'ов держим в LF`)
  }

  if (!new RegExp(`export (?:function|const) ${symbol}\\b`).test(source)) {
    errors.push(`${where}: нет экспорта ${symbol}`)
  }

  for (const match of source.matchAll(/^import[^"']+["']([^"']+)["']/gm)) {
    if (match[1] !== ALLOWED_IMPORT) {
      errors.push(
        `${where}: импорт "${match[1]}" — item должен быть самодостаточным файлом`,
      )
    }
  }

  // Правила ниже — про компоненты. Блоки живут по своим: это целые секции,
  // их не встраивают в чужую разметку и не цепляют за data-slot.
  const isComponent = directory.split(path.sep).includes("components")

  // Точка стилизации в проекте пользователя. Без неё чужой проект не может
  // дотянуться до компонента иначе как по нашему внутреннему атрибуту.
  if (isComponent && !/data-slot="/.test(source)) {
    errors.push(`${where}: нет data-slot — не за что зацепиться в чужом проекте`)
  }

  // ComponentProps вместо ComponentPropsWithoutRef: иначе ref не
  // пробрасывается и компонент нельзя сделать триггером чужого popover.
  if (isComponent && source.includes("ComponentPropsWithoutRef")) {
    errors.push(
      `${where}: ComponentPropsWithoutRef — ref не пробрасывается, нужен ComponentProps`,
    )
  }

  // light-dark() смотрит только на color-scheme, а next-themes и shadcn
  // ставят класс .dark и его не объявляют: без этого правила компонент
  // остаётся светлым на тёмной странице чужого проекта.
  if (
    isComponent &&
    source.includes("light-dark(") &&
    !source.includes('data-theme="dark"')
  ) {
    errors.push(
      `${where}: есть light-dark(), но нет правила :where(.dark,[data-theme="dark"]) … {color-scheme:dark}`,
    )
  }

  const themeToken = source.match(THEME_TOKENS)

  if (themeToken) {
    errors.push(
      `${where}: класс темы проекта "${themeToken[0]}" — компонент обязан нести свою палитру`,
    )
  }

  for (const match of source.matchAll(/(--[a-z][a-z0-9-]*)\s*:/g)) {
    if (!match[1].startsWith("--vibeui-")) {
      errors.push(`${where}: переменная ${match[1]} без префикса --vibeui-`)
    }
  }

  // Контейнерный запрос применяется к потомкам контейнера, но не к нему
  // самому. Правило внутри @container, целящее в корень блока, молча не
  // работает: раскладка на узкой ширине остаётся прежней, и это замечают
  // только глазами. Проверяем, потому что ловушка уже срабатывала.
  for (const query of source.matchAll(/@container[^{]*\{([\s\S]*?)\n\}/g)) {
    const selfRule = query[1].match(/\[data-vibeui-block="[^"]+"\]\s*\{[^}]*\}/)

    if (selfRule) {
      errors.push(
        `${where}: внутри @container есть правило для самого блока (${selfRule[0].slice(0, 60)}…) — контейнерный запрос действует только на потомков`,
      )
    }
  }

  // Раскладка item'а считается от его собственной ширины, а не от окна:
  // блок ставят и в узкую колонку, и в кадр витрины, и в чужой лейаут.
  // Tailwind-варианты в registry не работают вовсе — своего Tailwind у
  // чужого проекта может не быть, а классы проекта сюда не дотягиваются.
  const viewportVariant = source.match(/\b(?:sm|md|lg|xl|2xl):[a-z-]/)

  if (viewportVariant) {
    errors.push(
      `${where}: viewport-вариант "${viewportVariant[0]}" — раскладка item'а считается от его ширины (container-type), а классы Tailwind сюда не дотягиваются`,
    )
  }

  // Единицы окна ломают ту же границу, но с двумя законными исключениями:
  // слой, прижатый к окну (fixed-popover и <dialog> в top layer), и потолок
  // размера (`max-width: min(24rem, 100vw - 2rem)`) — он не задаёт размер, а
  // страхует всплывашку от вылета за край экрана.
  const viewportSizing = [...source.matchAll(/([a-z-]+)\s*:\s*([^;{}]*[\d.]v[wh]\b[^;{}]*)/g)]
    .filter(([, property, value]) => {
      // Потолок размера — законное применение: `min(24rem, 100vw - 2rem)`
      // страхует всплывашку от вылета за край экрана, но размер задаёт rem.
      if (/^(?:max|min)-(?:width|height|inline-size|block-size)$/.test(property)) {
        return false
      }

      return !/\bmin\(/.test(value)
    })

  if (viewportSizing.length > 0 && !/position:\s*fixed|\bdialog\s*\{/.test(source)) {
    const [first] = viewportSizing
    errors.push(
      `${where}: единица окна в "${first[0].trim().slice(0, 40)}" — размер item'а считается от его ширины, а не от окна`,
    )
  }

  const animated = /@keyframes|transition:|animation:/.test(source)

  if (animated && !source.includes("prefers-reduced-motion")) {
    errors.push(
      `${where}: есть анимация, но нет правила prefers-reduced-motion`,
    )
  }
}

/**
 * Значки настроек в шапке карточки. Кнопка одна на контрол: select, boolean
 * и number она крутит по кругу, у текста раскрывает поле под собой. Числу
 * нужны обе границы — иначе круг не замкнуть.
 */
function validateCardControls(where, item, controls) {
  const card = item.meta?.cardControls

  if (card === undefined) {
    return
  }

  if (!Array.isArray(card)) {
    errors.push(`${where}: meta.cardControls должен быть массивом`)
    return
  }

  // Шапка карточки переносит значки на вторую строку, поэтому семь помещаются
  // без ущерба. Дальше строка растёт вверх и съедает превью, а сам набор из
  // восьми настроек — уже признак того, что компонент делает слишком многое.
  if (card.length > 7) {
    errors.push(
      `${where}: в шапке карточки ${card.length} значков, помещается не больше 7`,
    )
  } else if (card.length > 5) {
    warnings.push(
      `${where}: значков в шапке ${card.length} — проверьте глазами, что они не ломают карточку`,
    )
  }

  for (const prop of card) {
    const control = controls.find((entry) => entry.prop === prop)

    if (!control) {
      errors.push(
        `${where}: cardControls ссылается на ${prop} вне meta.controls`,
      )
      continue
    }

    if (
      control.type === "number" &&
      (control.min === undefined || control.max === undefined)
    ) {
      errors.push(`${where}: у числового ${prop} на карточке нужны min и max`)
    }
  }
}

/**
 * Ряд состояний в миниатюре. Меньше двух — это обычный `preview.props`,
 * больше четырёх ряд не влезает в кадр узкой карточки.
 */
function validatePreviewStates(where, item) {
  const states = item.meta?.preview?.states

  if (states === undefined) {
    return
  }

  if (!Array.isArray(states)) {
    errors.push(`${where}: meta.preview.states должен быть массивом`)
    return
  }

  if (states.length < 2 || states.length > 4) {
    errors.push(
      `${where}: в ряду состояний ${states.length} штук, нужно от 2 до 4`,
    )
  }

  for (const state of states) {
    if (!state || typeof state !== "object" || Array.isArray(state)) {
      errors.push(`${where}: элемент meta.preview.states должен быть объектом`)
    }
  }
}

function validateItem(file, item, { requireApi }) {
  const where = `${path.relative(process.cwd(), file)} → ${item.name}`
  const ai = item.meta?.ai
  const controls = item.meta?.controls

  validateBase(where, item)
  validateI18n(where, item)
  validateSource(where, path.dirname(file), item)
  validatePreviewStates(where, item)

  if (requireApi) {
    if (!ai?.export) {
      errors.push(`${where}: у компонента нет meta.ai.export`)
    }

    if (!ai?.usage && !controls) {
      errors.push(`${where}: нужен meta.ai.usage или meta.controls`)
    }
  }

  if (!controls) {
    return
  }

  if (!Array.isArray(controls)) {
    errors.push(`${where}: meta.controls должен быть массивом`)
    return
  }

  const seen = new Set()

  validateCardControls(where, item, controls)

  for (const control of controls) {
    validateControl(where, control, seen)

    // Контрол — машиночитаемая форма ai.adapt. Совпадение ищется по имени
    // пропа в тексте, поэтому это предупреждение, а не ошибка.
    const adapt = (ai?.adapt ?? []).join(" ").toLowerCase()
    const isLabelProp = /^(children|.*label)$/i.test(control.prop ?? "")

    if (
      control.prop &&
      !isLabelProp &&
      !adapt.includes(control.prop.toLowerCase())
    ) {
      warnings.push(`${where} → ${control.prop}: не упомянут в meta.ai.adapt`)
    }
  }
}

for (const [directory, options] of [
  ["registry/components", { requireApi: true }],
  ["registry/blocks", { requireApi: false }],
  ["registry/animations", { requireApi: true }],
]) {
  for (const file of registriesIn(directory)) {
    const registry = JSON.parse(readFileSync(file, "utf8"))

    for (const item of registry.items ?? []) {
      validateItem(file, item, options)
    }
  }
}

for (const warning of warnings) {
  console.warn(`warning  ${warning}`)
}

for (const error of errors) {
  console.error(`error    ${error}`)
}

if (errors.length > 0) {
  console.error(`\nmeta: ${errors.length} ошибок`)
  process.exit(1)
}

console.log(
  `meta: проверено, ошибок нет${warnings.length ? `, предупреждений ${warnings.length}` : ""}`,
)
