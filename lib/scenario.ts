import type { Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import type { ItemKind } from "@/registry/categories"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"
import type { CatalogItem } from "@/registry/meta"
import { SCENARIOS, type Scenario } from "@/registry/scenarios"

/**
 * Сценарий как он показывается: секции с живыми items из каталога.
 * Файловые операции (исходник демо, промпты картинок, бриф) — в
 * `lib/scenario.server.ts`: сюда ходят и клиентские компоненты.
 */

export type ScenarioSectionView = {
  name: string
  role: string
  note: string | undefined
  item: CatalogItem
  kind: ItemKind
  /** Страница item'а на сайте. */
  path: string
  /** Имя экспорта — по нему из исходника вырезается пример использования. */
  exportName: string | undefined
  anchor: string
}

export function getScenarios(): Scenario[] {
  return SCENARIOS
}

export function getScenario(slug: string): Scenario | undefined {
  return SCENARIOS.find((scenario) => scenario.slug === slug)
}

// Явный список готовых роликов оставляет постер для новых
// сценариев, пока их видео не создано; fs здесь нельзя использовать,
// поскольку этот модуль импортируется и клиентскими компонентами.
const VIDEO_SLUGS = new Set([
  "auto", "wedding-cuba", "saas", "photographer", "restaurant", "delivery",
  "tattoo", "vet", "language", "flowers", "wedding-winter", "wedding",
  "realty", "course", "festival", "bakery", "opensource",
  "portfolio", "app", "renovation", "fintech", "market", "api", "gadget",
  "charity",
])

const EN_VIDEO_SLUGS = new Set([
  "auto", "wedding-cuba", "saas", "photographer", "restaurant", "delivery",
  "tattoo", "vet", "language", "flowers", "wedding-winter", "wedding",
])

export function scenarioText(scenario: Scenario, locale: Locale) {
  // Английское демо и его постер есть не у каждого сценария: без них
  // английская витрина показывает русские.
  const english = locale === "en" && Boolean(scenario.sourceEn)
  return {
    label: locale === "ru" ? scenario.label : scenario.en,
    summary: locale === "ru" ? scenario.summary : scenario.summaryEn,
    demo: scenario.demo,
    poster: english ? `/demo/scenarios/en/${scenario.slug}.webp` : `/demo/scenarios/${scenario.slug}.webp`,
    video: english
      ? EN_VIDEO_SLUGS.has(scenario.slug) ? `/demo/scenarios/en/${scenario.slug}.mp4` : undefined
      : VIDEO_SLUGS.has(scenario.slug) ? `/demo/scenarios/${scenario.slug}.mp4` : undefined,
  }
}

export function scenarioSections(
  scenario: Scenario,
  locale: Locale,
): ScenarioSectionView[] {
  return scenario.sections.flatMap((section) => {
    const found = getCatalogItem(section.item)

    if (!found) return []

    const item = localizeItem(found, locale)
    const kind = getItemKind(section.item) ?? "component"
    const base = itemBasePath(kind)

    return [
      {
        name: section.item,
        role: locale === "ru" ? section.role : section.roleEn,
        note: locale === "ru" ? section.note : section.noteEn,
        item,
        kind,
        path: `${base}/${section.item}`,
        exportName: item.meta?.ai?.export,
        anchor: section.anchor ?? "",
      },
    ]
  })
}

/** Имя, которым подписывается ссылка сценария — отдельное от имён items. */
export function scenarioSignName(slug: string) {
  return `scenario:${slug}`
}
