import { buildUsage, getControls, type ControlValues } from "@/lib/controls"
import type { Locale } from "@/lib/i18n"
import { PROMPT_COPY } from "@/lib/i18n-prompt"
import type { ItemKind } from "@/registry/categories"
import type { CatalogItem } from "@/registry/meta"

export type CopyForAiContext = {
  installCommand: string | null
  registryUrl: string | null
  kind: ItemKind
  locale: Locale
}

/**
 * Куда item попадёт после установки. `files[0].target` объявлен в схеме
 * shadcn как `@components/vibeui/<name>.tsx`; ведущая `@` — алиас проекта,
 * агенту полезнее видеть обычный путь.
 */
function installPath(item: CatalogItem): string | null {
  const target = item.files?.[0]?.target

  return target ? target.replace(/^@/, "") : null
}

function importPath(item: CatalogItem): string | null {
  const path = installPath(item)

  return path ? `@/${path.replace(/\.[jt]sx?$/, "")}` : null
}

function bullets(lines: string[]): string[] {
  return lines.map((line) => `- ${line}`)
}

function section(heading: string, body: string[]): string[] {
  return body.length > 0 ? [heading, ...body, ""] : []
}

/**
 * Короткая инструкция, которую агент получает по ссылке `/c/<name>`.
 *
 * Исходника здесь нет намеренно: копировать нечего, поэтому единственный
 * способ выполнить инструкцию это запустить install-команду. Фидельность
 * держится отсутствием альтернативы, а не уговорами в тексте.
 *
 * Документ короткий ещё и потому, что проходит через фетч агента: чем меньше
 * текста, тем меньше шансов, что он приедет пересказанным.
 *
 * `item` приходит уже локализованным (см. `lib/localize.ts`), поэтому здесь
 * язык влияет только на обвязку.
 */
export function buildAgentBrief(
  item: CatalogItem,
  context: CopyForAiContext & {
    pageUrl: string | null
    fileUrl: string | null
    values: ControlValues
  },
): string {
  const {
    installCommand,
    registryUrl,
    kind,
    pageUrl,
    fileUrl,
    values,
    locale,
  } = context
  const copy = PROMPT_COPY[locale].brief
  const ai = item.meta?.ai
  const title = item.title ?? item.name
  const target = installPath(item)

  const lines = [`VibeUI · ${item.name} · ${title}`]

  if (item.description) {
    lines.push(item.description)
  }

  lines.push(
    "",
    copy.install(copy.noun[kind]),
    installCommand ??
      (registryUrl ? `${copy.registryItem} ${registryUrl}` : copy.noCommand),
  )

  // Второй путь по убыванию точности: скачивание переносит файл побайтово
  // так же, как установка. Чтение кода и перепечатывание — не переносит.
  if (fileUrl && target) {
    lines.push("", copy.curl, `curl -o ${target} ${fileUrl}`)
  }

  lines.push("")

  if (target) {
    lines.push(`${copy.file} ${target}`)
  }

  if (ai?.export) {
    lines.push(`${copy.export} ${ai.export}`)
  }

  lines.push(
    item.dependencies?.length
      ? `${copy.npmDeps} ${item.dependencies.join(", ")}`
      : copy.npmNone,
  )

  // Сниппет собирается из значений, которые пользователь выставил на витрине.
  // Меняются только пропы: установленный файл остаётся тем же.
  const usage = buildUsage(item, values)

  if (usage) {
    lines.push("", copy.usage, usage)
  }

  const configured = getControls(item).some(
    (control) => values[control.prop] !== control.default,
  )

  if (configured) {
    lines.push("", copy.configured)
  }

  // Три первых правила — самые важные; остальное агент прочитает в файле,
  // который к этому моменту уже установлен.
  const rules = (ai?.preserve ?? []).slice(0, 3)

  if (rules.length > 0) {
    lines.push("", copy.preserve, ...bullets(rules))
  }

  lines.push("", copy.placement[kind], copy.readFile)

  if (pageUrl) {
    lines.push("", `${copy.page} ${pageUrl}`)
  }

  return lines.join("\n")
}

/** Секция 3 отличает выдачу мелкого компонента от выдачи секции. */
function howToUse(
  item: CatalogItem,
  kind: ItemKind,
  copy: (typeof PROMPT_COPY)[Locale]["full"],
): string[] {
  const ai = item.meta?.ai
  const from = importPath(item)
  const lines: string[] = []

  if (ai?.export && from) {
    lines.push(`import { ${ai.export} } from "${from}"`, "")
  }

  if (ai?.usage) {
    lines.push(ai.usage, "", copy.readForProps)
  } else if (kind === "block") {
    lines.push(...copy.blockHow)
  } else {
    lines.push(...copy.componentHow)
  }

  return lines
}

/**
 * Полная инструкция для агента. Запасной путь: её копируют целиком, если
 * ссылку агент открыть не может. Собирается только из metadata item'а,
 * вручную ничего не дописывается. Структура — Product Delivery Model v1,
 * см. docs/DELIVERY.md: промпт должен ответить не только «как установить»,
 * но и «как использовать» и «куда поставить».
 */
export function buildCopyForAiPrompt(
  item: CatalogItem,
  context: CopyForAiContext,
): string {
  const { installCommand, registryUrl, kind, locale } = context
  const copy = PROMPT_COPY[locale].full
  const ai = item.meta?.ai
  const title = item.title ?? item.name
  const target = installPath(item)

  const lines: string[] = [
    copy.heading(item.name, title),
    "",
    copy.installHeading,
  ]

  if (installCommand) {
    lines.push(copy.runExact, installCommand, "")
  } else {
    lines.push(copy.unavailable, "")
  }

  if (registryUrl) {
    lines.push(`${copy.registryItem} ${registryUrl}`)
  }

  if (target) {
    lines.push(copy.installsTo(target))
  }

  lines.push(
    item.dependencies?.length
      ? `${copy.npmDeps} ${item.dependencies.join(", ")}`
      : copy.npmNone,
  )

  lines.push(
    item.registryDependencies?.length
      ? `${copy.registryDeps} ${item.registryDependencies.join(", ")}`
      : copy.registryNone,
  )

  lines.push("", ...copy.doNotRecreate, "")

  lines.push(copy.whatHeading)

  if (item.description) {
    lines.push(item.description, "")
  }

  if (ai?.summary) {
    lines.push(ai.summary, "")
  }

  lines.push(
    copy.howHeading,
    ...howToUse(item, kind, copy),
    "",
    copy.whereHeading,
    ...copy.where[kind],
    "",
    ...copy.placementSlot,
    "",
  )

  lines.push(
    ...section(copy.keepHeading, bullets(ai?.preserve ?? [])),
    ...section(copy.changeHeading, bullets(ai?.adapt ?? [])),
    ...section(copy.rulesHeading, bullets(ai?.notes ?? [])),
  )

  lines.push(copy.verifyHeading, ...copy.verify)

  return lines.join("\n")
}
