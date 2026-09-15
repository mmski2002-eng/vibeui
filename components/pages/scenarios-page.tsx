import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { LiveCover } from "@/components/catalog/live-cover"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { getScenarios, scenarioText } from "@/lib/scenario"

/**
 * Витрина сценариев: готовые страницы, собранные из блоков каталога.
 * Обложка — сама демо-страница, уменьшенная до карточки: честнее любого
 * скриншота и всегда совпадает с тем, что откроется по клику.
 */
export function ScenariosPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).scenarios
  const scenarios = getScenarios()

  return (
    <CatalogShell locale={locale}>
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 lg:px-6 lg:py-10">
        <header className="border-shell-border mb-8 border-b pb-8">
          <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.title}
          </h1>
          <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty sm:text-base">
            {t.description}
          </p>
        </header>

        {scenarios.length === 0 ? (
          <p className="text-shell-muted text-sm">{t.empty}</p>
        ) : null}

        <ul className="grid gap-6 sm:grid-cols-2">
          {scenarios.map((scenario) => {
            const text = scenarioText(scenario, locale)
            const href = localePath(locale, `/scenarios/${scenario.slug}`)

            return (
              <li key={scenario.slug}>
                <div className="border-shell-border hover:border-shell-border-strong bg-shell-panel flex h-full flex-col overflow-hidden rounded-xl border transition-colors">
                  {/* Обложка вне ссылки: внутри iframe со своими ссылками. */}
                  <LiveCover src={scenario.demo} title={text.label} />

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="text-shell-fg text-base font-medium">
                        <Link href={href} className="hover:text-shell-accent transition-colors">
                          {text.label}
                        </Link>
                      </h2>
                      <span className="text-shell-muted shrink-0 text-xs tabular-nums">
                        {t.blocksCount(scenario.sections.length)}
                      </span>
                    </div>
                    <p className="text-shell-muted text-sm text-pretty">{text.summary}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs">
                      <Link
                        href={href}
                        className="text-shell-fg hover:text-shell-accent inline-flex items-center gap-1.5 font-medium transition-colors"
                      >
                        {t.openRecipe}
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                      <Link
                        href={scenario.demo}
                        target="_blank"
                        rel="noopener"
                        className="text-shell-muted hover:text-shell-fg transition-colors"
                      >
                        {t.openDemo}
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </main>
    </CatalogShell>
  )
}
