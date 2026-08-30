import { readFileSync, readdirSync } from "node:fs"
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

function validateItem(file, item, { requireApi }) {
  const where = `${path.relative(process.cwd(), file)} → ${item.name}`
  const ai = item.meta?.ai
  const controls = item.meta?.controls

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
