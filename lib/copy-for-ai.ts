import { buildUsage, getControls, type ControlValues } from "@/lib/controls"
import type { ItemKind } from "@/registry/categories"
import type { CatalogItem } from "@/registry/meta"

export type CopyForAiContext = {
  installCommand: string | null
  registryUrl: string | null
  kind: ItemKind
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

/** Секция 3 отличает выдачу мелкого компонента от выдачи секции. */
function howToUse(item: CatalogItem, kind: ItemKind): string[] {
  const ai = item.meta?.ai
  const from = importPath(item)
  const lines: string[] = []

  if (ai?.export && from) {
    lines.push(`import { ${ai.export} } from "${from}"`, "")
  }

  if (ai?.usage) {
    lines.push(ai.usage, "")
    lines.push("Read the installed file for the full prop list.")
  } else if (kind === "block") {
    lines.push(
      "This is a whole page section. Render it as one piece — do not copy",
      "fragments out of it and do not rebuild it from smaller components.",
      "Read the installed file for the export name and its props.",
    )
  } else {
    lines.push(
      "Read the installed file for the export name, its props and how to",
      "render it. Do not guess the API.",
    )
  }

  return lines
}

/** Секция 4 — прямой ответ на «размести вот это тут». */
function wherePlace(kind: ItemKind): string[] {
  if (kind === "component") {
    return [
      "This is a small inline component. Put it exactly where the user asked,",
      "inside the existing markup. Do not create a new page, section or",
      "wrapper for it. If a similar control already sits in that spot,",
      "replace it instead of adding a second one.",
    ]
  }

  if (kind === "template") {
    return [
      "This is a whole page. Use it as the content root of the page the user",
      "named. Do not nest it inside another page's layout.",
    ]
  }

  return [
    "This is a full-width page section. Place it as a direct child of the",
    "page layout, in the section order the user asked for. Do not nest it",
    "inside a card, sidebar, modal or any narrow inline container: the",
    "section measures its own width and will lay out wrong there.",
  ]
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
 */
export function buildAgentBrief(
  item: CatalogItem,
  context: CopyForAiContext & {
    pageUrl: string | null
    fileUrl: string | null
    values: ControlValues
  },
): string {
  const { installCommand, registryUrl, kind, pageUrl, fileUrl, values } =
    context
  const ai = item.meta?.ai
  const title = item.title ?? item.name
  const target = installPath(item)
  const noun = kind === "component" ? "компонент" : "блок"

  const lines = [`VibeUI · ${item.name} · ${title}`]

  if (item.description) {
    lines.push(item.description)
  }

  lines.push(
    "",
    `Установи ${noun} командой. Не пиши код сам и не пересоздавай его по описанию:`,
    installCommand ?? `Registry item: ${registryUrl ?? "не сконфигурирован"}`,
  )

  // Второй путь по убыванию точности: скачивание переносит файл побайтово
  // так же, как установка. Чтение кода и перепечатывание — не переносит.
  if (fileUrl && target) {
    lines.push(
      "",
      "Если shadcn CLI в проекте нет — скачай файл, не переписывай его руками:",
      `curl -o ${target} ${fileUrl}`,
    )
  }

  lines.push("")

  if (target) {
    lines.push(`Файл: ${target}`)
  }

  if (ai?.export) {
    lines.push(`Экспорт: ${ai.export}`)
  }

  lines.push(
    item.dependencies?.length
      ? `npm-зависимости: ${item.dependencies.join(", ")}`
      : "npm-зависимости: нет",
  )

  // Сниппет собирается из значений, которые пользователь выставил на витрине.
  // Меняются только пропы: установленный файл остаётся тем же.
  const usage = buildUsage(item, values)

  if (usage) {
    lines.push("", "Использование:", usage)
  }

  const configured = getControls(item).some(
    (control) => values[control.prop] !== control.default,
  )

  if (configured) {
    lines.push(
      "",
      "Пропсы в сниппете выбрал пользователь — вставляй компонент именно с ними.",
    )
  }

  // Три первых правила — самые важные; остальное агент прочитает в файле,
  // который к этому моменту уже установлен.
  const rules = (ai?.preserve ?? []).slice(0, 3)

  if (rules.length > 0) {
    lines.push("", "Сохрани как установлено:", ...bullets(rules))
  }

  lines.push(
    "",
    kind === "component"
      ? "Это inline-компонент: поставь его туда, куда просил пользователь, внутрь существующей разметки."
      : "Это полноширинная секция: поставь её прямым потомком разметки страницы, не внутрь карточки или сайдбара.",
    "Полный список пропсов и правил — в установленном файле.",
  )

  if (pageUrl) {
    lines.push("", `Страница компонента: ${pageUrl}`)
  }

  return lines.join("\n")
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
  const { installCommand, registryUrl, kind } = context
  const ai = item.meta?.ai
  const title = item.title ?? item.name
  const target = installPath(item)

  const lines: string[] = [
    `# Install and place "${item.name}" (${title}) from VibeUI`,
    "",
    "## 1. Install first — do not skip, do not recreate",
  ]

  if (installCommand) {
    lines.push(
      "Run this exact command before writing any code:",
      installCommand,
      "",
    )
  } else {
    lines.push(
      "Install command is unavailable: the VibeUI registry URL is not configured.",
      "",
    )
  }

  if (registryUrl) {
    lines.push(`Registry item: ${registryUrl}`)
  }

  if (target) {
    lines.push(
      `Installs to: ${target} (the exact path follows this project's components.json aliases).`,
    )
  }

  lines.push(
    item.dependencies?.length
      ? `npm dependencies: ${item.dependencies.join(", ")}`
      : "npm dependencies: none.",
  )

  lines.push(
    item.registryDependencies?.length
      ? `Registry dependencies: ${item.registryDependencies.join(", ")}`
      : "Registry dependencies: none.",
  )

  lines.push(
    "",
    "Install it from the registry. Do not recreate it from the description,",
    "do not substitute a similar component from another library, and do not",
    "rewrite it to match the project's existing style.",
    "",
  )

  lines.push("## 2. What it is")

  if (item.description) {
    lines.push(item.description, "")
  }

  if (ai?.summary) {
    lines.push(ai.summary, "")
  }

  lines.push(
    "## 3. How to use it",
    ...howToUse(item, kind),
    "",
    "## 4. Where to place it",
    ...wherePlace(kind),
    "",
    "Placement: ___",
    "(The user fills this line in. If it is still blank, ask where to put it",
    "instead of guessing.)",
    "",
  )

  lines.push(
    ...section("## 5. Keep exactly as installed", bullets(ai?.preserve ?? [])),
    ...section("## 6. You may change", bullets(ai?.adapt ?? [])),
    ...section("## 7. Rules", bullets(ai?.notes ?? [])),
  )

  lines.push(
    "## 8. Verify",
    "- it renders with no console errors;",
    "- it looks like the preview on the VibeUI page you copied this from;",
    "- if it does not, you changed something listed in section 5 — put it back.",
  )

  return lines.join("\n")
}
