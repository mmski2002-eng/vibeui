import Link from "next/link"
import { notFound } from "next/navigation"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { CopyButton } from "@/components/copy-button"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import {
  buildScenarioPrompt,
  getScenario,
  resolveScenario,
  scenarioPath,
  type ScenarioSelection,
} from "@/lib/scenario"
import { getSiteBaseUrl } from "@/lib/site"
import { catalogBasePath, itemBasePath } from "@/registry/index"

/**
 * Страница сценария: задача, разложенная в упорядоченные секции.
 *
 * Шаг называет роль на странице («Форма заявки»), а не категорию каталога
 * («Контакты»): человек, пришедший с задачей, узнаёт нужное, не зная нашей
 * таксономии. Внутри шага — несколько вариантов с живым превью; выбранный
 * уезжает в адрес, поэтому собранным сценарием можно поделиться ссылкой.
 *
 * Ставятся по-прежнему сами блоки: сценарий ничего не устанавливает, он
 * только собирает промпт и ведёт в категории.
 */
export function ScenarioPage({
  locale,
  slug,
  query,
}: {
  locale: Locale
  slug: string
  query: Record<string, string | string[] | undefined>
}) {
  const scenario = getScenario(slug)

  if (!scenario) {
    notFound()
  }

  const t = getDictionary(locale)
  const selection: ScenarioSelection = Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  )
  const resolved = resolveScenario(scenario, locale, selection)
  const prompt = buildScenarioPrompt(resolved, locale, getSiteBaseUrl())
  const steps = resolved.steps.filter((step) => step.chosen)

  return (
    <CatalogShell locale={locale}>
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 lg:px-6 lg:py-10">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="text-shell-muted flex flex-wrap items-center gap-2 text-sm">
            <li>
              <Link
                href={localePath(locale, "/scenarios")}
                className="hover:text-shell-fg"
              >
                {t.scenarios.title}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-shell-fg font-medium">{resolved.label}</li>
          </ol>
        </nav>

        <header className="border-shell-border mb-8 border-b pb-8">
          <h1 className="text-shell-fg text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {resolved.label}
          </h1>
          <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty sm:text-base">
            {resolved.summary}
          </p>
          <p className="text-shell-muted mt-3 text-xs tabular-nums">
            {t.scenarios.stepCount(resolved.steps.length)}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CopyButton
              value={prompt}
              label={t.scenarios.copy}
              copiedLabel={t.scenarios.copied}
              variant="primary"
            />
          </div>
          <p className="text-shell-muted mt-3 max-w-2xl text-xs">
            {t.scenarios.copyNote}
          </p>
        </header>

        <ol className="flex flex-col gap-10">
          {resolved.steps.map((step, index) => (
            <li key={step.category}>
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-shell-muted text-xs tabular-nums">
                  {t.scenarios.step} {index + 1}
                </span>
                <h2 className="text-shell-fg text-lg font-medium">
                  {step.role}
                </h2>
                {step.optional ? (
                  <span className="border-shell-border text-shell-muted rounded-full border px-2 py-0.5 text-[11px]">
                    {t.scenarios.optional}
                  </span>
                ) : null}
                <Link
                  href={localePath(
                    locale,
                    `${catalogBasePath(step.kind)}/${step.category}`,
                  )}
                  className="text-shell-muted hover:text-shell-fg ml-auto text-xs"
                >
                  {step.categoryLabel} · {t.scenarios.more(step.total)}
                </Link>
              </div>

              <p className="text-shell-muted mb-4 max-w-2xl text-sm">
                {step.why}
              </p>

              {/* Варианты шага: тот же живой компонент из registry, что и в
                  каталоге. Выбранный отмечен рамкой и уезжает в адрес. */}
              <ul className="grid gap-4 sm:grid-cols-2">
                {step.choices.map((item) => {
                  const active = item.name === step.chosen?.name

                  return (
                    <li key={item.name}>
                      {/* Кадр превью не оборачивается ссылкой: внутри живой
                          блок со своими ссылками, а <a> внутри <a> — ошибка
                          разметки и сломанная гидратация. Выбор делает
                          строка под кадром. */}
                      <div
                        data-active={active ? "true" : undefined}
                        className={
                          "overflow-hidden rounded-xl border transition-colors " +
                          (active
                            ? "border-shell-accent"
                            : "border-shell-border")
                        }
                      >
                        <div className="pointer-events-none">
                          <CatalogThumbnail slug={item.name} locale={locale} />
                        </div>
                        <div className="flex items-baseline justify-between gap-2 px-3 py-2">
                          <Link
                            href={localePath(
                              locale,
                              `${itemBasePath(step.kind)}/${item.name}`,
                            )}
                            className="text-shell-fg hover:text-shell-accent truncate text-sm"
                          >
                            {item.title ?? item.name}
                          </Link>
                          {active ? (
                            <span className="text-shell-accent shrink-0 text-xs">
                              {t.scenarios.chosen}
                            </span>
                          ) : (
                            <Link
                              href={localePath(
                                locale,
                                scenarioPath(scenario.slug, {
                                  ...selection,
                                  [step.category]: item.name,
                                }),
                              )}
                              scroll={false}
                              className="text-shell-muted hover:text-shell-fg shrink-0 text-xs underline"
                            >
                              {t.scenarios.choose}
                            </Link>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ol>

        {resolved.parts.length > 0 ? (
          <section className="border-shell-border mt-12 border-t pt-8">
            <h2 className="text-shell-fg text-lg font-medium">
              {t.scenarios.parts}
            </h2>
            <p className="text-shell-muted mt-2 max-w-2xl text-sm">
              {t.scenarios.partsNote}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {resolved.parts.map((part) => (
                <Link
                  key={part.slug}
                  href={localePath(
                    locale,
                    `${catalogBasePath(part.kind)}/${part.slug}`,
                  )}
                  className="border-shell-border text-shell-fg hover:border-shell-border-strong inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors"
                >
                  {part.label}
                  <span className="text-shell-muted text-xs tabular-nums">
                    {part.count}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {steps.length === 0 ? (
          <p className="text-shell-muted py-16 text-center text-sm">
            {t.catalog.searchEmpty}
          </p>
        ) : null}
      </main>
    </CatalogShell>
  )
}
