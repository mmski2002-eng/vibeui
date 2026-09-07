import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { getScenarios, resolveScenario } from "@/lib/scenario"

/**
 * Витрина сценариев: вход в каталог со стороны задачи.
 *
 * Обложка карточки — превью первой секции сценария: она сразу показывает,
 * с чего начинается собранная страница, и это честнее любой иконки.
 */
export function ScenariosPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const scenarios = getScenarios().map((scenario) =>
    resolveScenario(scenario, locale),
  )

  return (
    <CatalogShell locale={locale}>
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 lg:px-6 lg:py-10">
        <header className="border-shell-border mb-8 border-b pb-8">
          <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.scenarios.title}
          </h1>
          <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty sm:text-base">
            {t.scenarios.description}
          </p>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2">
          {scenarios.map((resolved) => {
            const cover = resolved.cover

            return (
              <li key={resolved.scenario.slug}>
                {/* Обложка — вне ссылки: внутри превью живут собственные
                    ссылки блока, и <a> внутри <a> ломает гидратацию. */}
                <div className="border-shell-border hover:border-shell-border-strong flex h-full flex-col overflow-hidden rounded-xl border transition-colors">
                  {cover ? (
                    <div className="pointer-events-none">
                      <CatalogThumbnail slug={cover.name} locale={locale} />
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="text-shell-fg text-base font-medium">
                        <Link
                          href={localePath(
                            locale,
                            `/scenarios/${resolved.scenario.slug}`,
                          )}
                          className="hover:text-shell-accent transition-colors"
                        >
                          {resolved.label}
                        </Link>
                      </h2>
                      <span className="text-shell-muted shrink-0 text-xs tabular-nums">
                        {t.scenarios.stepCount(resolved.steps.length)}
                      </span>
                    </div>
                    <p className="text-shell-muted text-sm text-pretty">
                      {resolved.summary}
                    </p>
                    <Link
                      href={localePath(
                        locale,
                        `/scenarios/${resolved.scenario.slug}`,
                      )}
                      className="text-shell-muted hover:text-shell-fg mt-auto inline-flex items-center gap-1.5 pt-2 text-xs transition-colors"
                    >
                      {resolved.steps
                        .slice(0, 3)
                        .map((step) => step.role)
                        .join(" · ")}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
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
