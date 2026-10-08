import { CatalogShell } from "@/components/catalog/catalog-shell"
import { ScenariosGrid, type ScenarioCard } from "@/components/pages/scenarios-grid"
import { getFavoriteCounts } from "@/lib/favorite-counts"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { getScenarios, scenarioText } from "@/lib/scenario"
import { scenarioFavoriteName } from "@/lib/scenario-favorite"

// Сколько последних сценариев считать новыми: список в registry идёт в
// порядке добавления, даты там нет.
const NEW_COUNT = 12

/**
 * Витрина сценариев: готовые страницы, собранные из блоков каталога.
 * Обложка — сама демо-страница, уменьшенная до карточки: честнее любого
 * скриншота и всегда совпадает с тем, что откроется по клику. Новые
 * сценарии сверху, фильтры по сфере и теме — в клиентской сетке.
 */
export async function ScenariosPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).scenarios
  const scenarios = getScenarios()
  const total = scenarios.length

  const cards: ScenarioCard[] = scenarios
    .map((scenario, index) => {
      const text = scenarioText(scenario, locale)
      return {
        slug: scenario.slug,
        label: text.label,
        summary: text.summary,
        href: localePath(locale, `/scenarios/${scenario.slug}`),
        demo: text.demo,
        poster: text.poster,
        video: text.video,
        group: scenario.group,
        tone: scenario.theme.tone,
        blocks: scenario.sections.length,
        blocksLabel: t.blocksCount(scenario.sections.length),
        isNew: index >= total - NEW_COUNT,
      }
    })
    .reverse()

  // На сборке в CI базы нет: тогда порядок по новизне, а счётчики подтянет
  // первая же ревалидация на сервере.
  const counts = await getFavoriteCounts().catch(() => ({}) as Record<string, number>)
  const likes = (card: ScenarioCard) => counts[scenarioFavoriteName(card.slug)] ?? 0
  cards.sort((a, b) => likes(b) - likes(a))

  return (
    <CatalogShell locale={locale}>
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 lg:px-6 lg:py-10">
        <header className="mb-6">
          <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.title}
          </h1>
          <p className="text-shell-muted mt-2 max-w-2xl text-sm text-pretty sm:text-base">
            {t.description}
          </p>
        </header>

        {cards.length === 0 ? (
          <p className="text-shell-muted text-sm">{t.empty}</p>
        ) : (
          <ScenariosGrid
            cards={cards}
            initialCounts={counts}
            locale={locale}
            text={{ ...t.filters, openDemo: t.openDemo, favourite: getDictionary(locale).card.favourite }}
          />
        )}
      </main>
    </CatalogShell>
  )
}
