import type { CatalogItem, ControlValue, ItemControl } from "@/registry/meta"

const TEXT_MAX_LENGTH = 80
const COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i
const USAGE_LINE_LIMIT = 72

export type ControlValues = Record<string, ControlValue>

/** Подложка превью. Переносится между витриной и страницей item'а. */
export type PreviewTheme = "dark" | "light"

/**
 * То же плюс «как у оболочки». Значение по умолчанию именно такое: подложку
 * кадра тогда красит CSS по атрибуту на <html>, который инлайн-скрипт ставит
 * до первой отрисовки. Пока дефолтом был "dark", светлая страница успевала
 * показать тёмный кадр и перекрасить его после гидратации.
 */
export type PreviewSurface = PreviewTheme | "auto"

export function getControls(item: CatalogItem): ItemControl[] {
  return item.meta?.controls ?? []
}

/**
 * Значения по умолчанию. На вход — сами контролы, а не item: витрина держит
 * сотни карточек, и таскать в клиентский компонент всю metadata item'а
 * (описания, ai-инструкции, переводы) значило бы сериализовать её в разметку
 * страницы каталога целиком.
 */
export function defaultValues(controls: ItemControl[]): ControlValues {
  const values: ControlValues = {}

  for (const control of controls) {
    values[control.prop] = control.default
  }

  return values
}

export function resolvePreviewTheme(raw: string | undefined): PreviewTheme {
  return raw === "light" ? "light" : "dark"
}

/** Тема из ссылки: без параметра кадр следует теме оболочки. */
export function resolvePreviewSurface(raw: string | undefined): PreviewSurface {
  if (raw === "light" || raw === "dark") {
    return raw
  }

  return "auto"
}

/**
 * Текст из ссылки попадает в документ, инструкциям которого следует агент.
 * Поэтому вырезаются управляющие символы и переводы строк (многострочная
 * вставка выглядела бы как отдельная команда), а `"`, `<` и `>` — потому что
 * ими можно выйти из JSX-атрибута в сниппете.
 */
function sanitizeText(raw: string, maxLength = TEXT_MAX_LENGTH): string {
  return Array.from(raw)
    .filter((character) => character >= " " && character !== "\u007F")
    .join("")
    .replace(/["<>]/g, "")
    .trim()
    .slice(0, maxLength)
}

/** `null` — значение не прошло контрол, берётся default. */
function parseValue(control: ItemControl, raw: string): ControlValue | null {
  switch (control.type) {
    case "text": {
      const value = sanitizeText(raw, control.maxLength)

      return value === "" ? null : value
    }
    case "select":
      return control.options.includes(raw) ? raw : null
    case "color":
      return COLOR_PATTERN.test(raw) ? raw.toLowerCase() : null
    case "boolean":
      return raw === "true" ? true : raw === "false" ? false : null
    case "number": {
      const value = Number(raw)

      if (!Number.isFinite(value)) {
        return null
      }

      return Math.min(
        Math.max(value, control.min ?? Number.NEGATIVE_INFINITY),
        control.max ?? Number.POSITIVE_INFINITY,
      )
    }
  }
}

/**
 * Значения контролов из query. Ключ, не объявленный контролом, игнорируется
 * молча: в выдачу не попадает ни один символ, не прошедший через контрол.
 */
export function resolveControlValues(
  item: CatalogItem,
  params: URLSearchParams,
): ControlValues {
  const values: ControlValues = {}

  for (const control of getControls(item)) {
    const raw = params.get(control.prop)
    const parsed = raw === null ? null : parseValue(control, raw)

    values[control.prop] = parsed ?? control.default
  }

  return values
}

/** В ссылку пишутся только отличия от значений по умолчанию. */
export function toSearchParams(
  controls: ItemControl[],
  values: ControlValues,
): URLSearchParams {
  const params = new URLSearchParams()

  for (const control of controls) {
    const value = values[control.prop]

    if (value !== undefined && value !== control.default) {
      params.set(control.prop, String(value))
    }
  }

  return params
}

function attribute(control: ItemControl, value: ControlValue): string | null {
  if (control.type === "boolean") {
    return value === true ? control.prop : `${control.prop}={false}`
  }

  if (control.type === "number") {
    return `${control.prop}={${value}}`
  }

  return `${control.prop}="${value}"`
}

/**
 * Сниппет использования с выбранными значениями. Пока пользователь ничего не
 * менял, отдаётся авторский `meta.ai.usage`: он показывает API компонента,
 * а не минимальный вызов.
 */
export function buildUsage(
  item: CatalogItem,
  values: ControlValues,
): string | null {
  const exportName = item.meta?.ai?.export
  const authored = item.meta?.ai?.usage ?? null
  const controls = getControls(item)

  if (!exportName || controls.length === 0) {
    return authored
  }

  const changed = controls.filter(
    (control) => values[control.prop] !== control.default,
  )

  if (changed.length === 0) {
    return authored
  }

  const attributes = changed
    .filter((control) => control.prop !== "children")
    .map((control) => attribute(control, values[control.prop]))
    .filter((attr): attr is string => attr !== null)

  const childrenControl = controls.find(
    (control) => control.prop === "children",
  )
  const children = childrenControl
    ? String(values[childrenControl.prop])
    : undefined

  const open = [exportName, ...attributes].join(" ")

  if (children === undefined) {
    return `<${open} />`
  }

  const singleLine = `<${open}>${children}</${exportName}>`

  if (singleLine.length <= USAGE_LINE_LIMIT) {
    return singleLine
  }

  return [
    `<${exportName}`,
    ...attributes.map((attr) => `  ${attr}`),
    ">",
    `  ${children}`,
    `</${exportName}>`,
  ].join("\n")
}
