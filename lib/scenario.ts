import type { Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import { getInstallCommand } from "@/lib/site"
import type { ItemKind } from "@/registry/categories"
import {
  getCategoryLabel,
  getItemKind,
  getItemsByCategory,
  itemBasePath,
} from "@/registry/index"
import type { CatalogItem } from "@/registry/meta"
import {
  SCENARIOS,
  type Scenario,
  type ScenarioStep,
} from "@/registry/scenarios"

/**
 * Сценарий, разложенный в готовые к показу шаги.
 *
 * Данные сценария — только слаги категорий и роли; какие именно items
 * подставить, решается здесь, из живого каталога. Так список сценариев не
 * устаревает при добавлении и удалении блоков.
 */

/** Сколько вариантов показывается в шаге, прежде чем вести в категорию. */
export const STEP_CHOICES = 4

export type ResolvedStep = {
  category: string
  categoryLabel: string
  role: string
  why: string
  optional: boolean
  kind: ItemKind
  /** Варианты на выбор — первые items категории. */
  choices: CatalogItem[]
  /** Выбранный вариант: из адреса или первый подходящий. */
  chosen: CatalogItem | undefined
  /** Сколько всего items в категории. */
  total: number
}

export type ResolvedScenario = {
  scenario: Scenario
  label: string
  summary: string
  /** Item для обложки витрины: блок из категории `cover` сценария. */
  cover: CatalogItem | undefined
  steps: ResolvedStep[]
  parts: { slug: string; label: string; kind: ItemKind; count: number }[]
}

/** Выбор вариантов по шагам, приезжающий в адресе (`?hero=hero-004`). */
export type ScenarioSelection = Record<string, string | undefined>

export function getScenarios(): Scenario[] {
  return SCENARIOS
}

export function getScenario(slug: string): Scenario | undefined {
  return SCENARIOS.find((scenario) => scenario.slug === slug)
}

function stepText(step: ScenarioStep, locale: Locale) {
  return {
    role: locale === "ru" ? step.role : step.roleEn,
    why: locale === "ru" ? step.why : step.whyEn,
  }
}

/**
 * Кандидаты шага: сначала featured, потом остальные по порядку каталога.
 * Первый из них становится вариантом по умолчанию — автор пометил его как
 * самый показательный, и новичку не приходится выбирать вслепую.
 */
function candidates(category: string): CatalogItem[] {
  const blocks = getItemsByCategory("block", category)
  const items =
    blocks.length > 0 ? blocks : getItemsByCategory("component", category)

  return [...items].sort((first, second) => {
    const firstFeatured = first.meta?.featured ? 0 : 1
    const secondFeatured = second.meta?.featured ? 0 : 1

    return firstFeatured - secondFeatured
  })
}

export function resolveScenario(
  scenario: Scenario,
  locale: Locale = "ru",
  selection: ScenarioSelection = {},
): ResolvedScenario {
  const steps = scenario.steps.map((step): ResolvedStep => {
    const items = candidates(step.category)
    const picked = selection[step.category]
    const chosen =
      items.find((item) => item.name === picked) ?? items[0] ?? undefined
    const text = stepText(step, locale)

    // Выбранный вариант всегда виден среди кандидатов, даже если в списке
    // категории он стоял двадцатым: иначе ссылка с выбором открывается на
    // шаге, где выбранного не видно.
    const choices = items.slice(0, STEP_CHOICES)
    const visible =
      chosen && !choices.includes(chosen)
        ? [chosen, ...choices.slice(0, STEP_CHOICES - 1)]
        : choices

    return {
      category: step.category,
      categoryLabel: getCategoryLabel(step.category, locale),
      role: text.role,
      why: text.why,
      optional: step.optional ?? false,
      kind: (chosen && getItemKind(chosen.name)) ?? "block",
      choices: visible.map((item) => localizeItem(item, locale)),
      chosen: chosen ? localizeItem(chosen, locale) : undefined,
      total: items.length,
    }
  })

  const coverStep = steps.find((step) => step.category === scenario.cover)

  return {
    scenario,
    label: locale === "ru" ? scenario.label : scenario.en,
    summary: locale === "ru" ? scenario.summary : scenario.summaryEn,
    cover: coverStep?.chosen ?? candidates(scenario.cover)[0],
    steps,
    parts: scenario.parts.map((slug) => {
      const items = getItemsByCategory("component", slug)

      return {
        slug,
        label: getCategoryLabel(slug, locale),
        kind: (items[0] && getItemKind(items[0].name)) ?? "component",
        count: items.length,
      }
    }),
  }
}

/** Ссылка на шаг с уже выбранными вариантами. */
export function scenarioPath(
  slug: string,
  selection: ScenarioSelection,
): string {
  const parameters = new URLSearchParams()

  for (const [category, name] of Object.entries(selection)) {
    if (name) {
      parameters.set(category, name)
    }
  }

  const query = parameters.toString()

  return `/scenarios/${slug}${query ? `?${query}` : ""}`
}

/**
 * Инструкция агенту на целую страницу.
 *
 * Отличие от промпта одного item'а (`lib/copy-for-ai.ts`) в том, что здесь
 * важен порядок: агент должен поставить блоки и собрать из них страницу
 * сверху вниз. Исходников по-прежнему нет — только команды установки,
 * поэтому единственный способ выполнить инструкцию это поставить блоки из
 * реестра, а не пересоздать похожие.
 */
export function buildScenarioPrompt(
  resolved: ResolvedScenario,
  locale: Locale = "ru",
  siteUrl: string | null = null,
): string {
  const ru = locale === "ru"
  const chosen = resolved.steps.filter((step) => step.chosen)

  const lines: string[] = [
    ru
      ? `VibeUI · сценарий «${resolved.label}»`
      : `VibeUI · “${resolved.label}” scenario`,
    resolved.summary,
    "",
    ru
      ? "Собери страницу из готовых блоков VibeUI. Ставь их командами ниже и располагай в этом порядке."
      : "Build the page from ready VibeUI blocks. Install them with the commands below and place them in this order.",
    "",
  ]

  chosen.forEach((step, index) => {
    const item = step.chosen!
    const command = getInstallCommand(item.name)

    lines.push(
      `${index + 1}. ${step.role} — ${item.title ?? item.name} (${item.name})`,
      `   ${step.why}`,
    )

    if (command) {
      lines.push(`   ${command}`)
    }

    lines.push("")
  })

  lines.push(
    ru ? "Правила:" : "Rules:",
    ru
      ? "- ставь блоки командами, не переписывай их код своими словами;"
      : "- install the blocks with the commands, do not rewrite their code;",
    ru
      ? "- сохраняй порядок секций: он и есть структура страницы;"
      : "- keep the order of the sections: it is the structure of the page;",
    ru
      ? "- у каждого блока своя палитра --vibeui-*; не подменяй её токенами темы;"
      : "- each block carries its own --vibeui-* palette; do not swap it for theme tokens;",
    ru
      ? "- меняй только содержимое: тексты, картинки, ссылки."
      : "- change content only: texts, images, links.",
  )

  if (resolved.parts.length > 0) {
    lines.push(
      "",
      ru
        ? `Мелкие компоненты, которые понадобятся: ${resolved.parts
            .map((part) => part.label)
            .join(", ")}.`
        : `Small components you will need: ${resolved.parts
            .map((part) => part.label)
            .join(", ")}.`,
    )
  }

  if (siteUrl) {
    const first = chosen[0]?.chosen

    lines.push(
      "",
      ru
        ? `Подробности по каждому блоку: ${siteUrl}${itemBasePath(
            first ? (getItemKind(first.name) ?? "block") : "block",
          )}/<имя блока>`
        : `Details for each block: ${siteUrl}${itemBasePath(
            first ? (getItemKind(first.name) ?? "block") : "block",
          )}/<block name>`,
    )
  }

  return lines.join("\n")
}
