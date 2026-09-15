import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight, Lock } from "lucide-react"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { ScenarioCopy } from "@/components/catalog/scenario-copy"
import { ScenarioTour } from "@/components/catalog/scenario-tour"
import { isPro } from "@/lib/entitlements"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { getScenario, scenarioSections, scenarioText } from "@/lib/scenario"
import { extractUsage, readScenarioImages, readScenarioSource } from "@/lib/scenario.server"
import { getSession } from "@/lib/session"

/**
 * Страница сценария: готовая страница и рецепт «из чего», без вариантов.
 *
 * Всем: демо в живом кадре и список блоков — видно, что каждый есть в
 * каталоге. Подписчику: точный JSX каждого блока из демо, общие правила,
 * промпты картинок и ссылка для агента с исходником страницы целиком.
 */
export async function ScenarioPage({ locale, slug }: { locale: Locale; slug: string }) {
  const scenario = getScenario(slug)

  if (!scenario) {
    notFound()
  }

  const t = getDictionary(locale).scenarios
  const text = scenarioText(scenario, locale)
  const sections = scenarioSections(scenario, locale)
  const session = await getSession()
  const pro = session ? await isPro(session.user.id) : false
  const [source, pictures] = pro
    ? await Promise.all([readScenarioSource(scenario), readScenarioImages(scenario)])
    : [null, null]

  return (
    <CatalogShell locale={locale}>
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 lg:px-6 lg:py-10">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="text-shell-muted flex flex-wrap items-center gap-2 text-sm">
            <li>
              <Link href={localePath(locale, "/scenarios")} className="hover:text-shell-fg transition-colors">
                {t.title}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-shell-fg">{text.label}</li>
          </ol>
        </nav>

        <header className="mb-6">
          <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">{text.label}</h1>
          <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty sm:text-base">{text.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={scenario.demo}
              target="_blank"
              rel="noopener"
              className="acc-press border-shell-border-strong text-shell-fg hover:border-shell-accent inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors"
            >
              {t.openDemo}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            {pro ? (
              <ScenarioCopy slug={scenario.slug} locale={locale} labels={{ copy: t.copy, copied: t.copied, signIn: t.signIn }} />
            ) : (
              <Link
                href={localePath(locale, "/pricing")}
                className="acc-press inline-flex h-11 items-center gap-2 rounded-full bg-[#ff5900] px-5 text-sm font-semibold text-[#151515] transition-colors hover:bg-[#ff7a33]"
              >
                <Lock className="size-4" aria-hidden="true" />
                {t.proLink}
              </Link>
            )}
          </div>
          {pro ? <p className="text-shell-muted mt-3 max-w-2xl text-xs">{t.copyNote}</p> : null}
        </header>

        <section className="mt-2">
          <h2 className="text-shell-fg text-lg font-semibold">{t.composition}</h2>
          <p className="text-shell-muted mt-2 max-w-2xl text-sm">{t.compositionNote(sections.length)}</p>
          <div className="mt-6">
            <ScenarioTour
              demo={scenario.demo}
              labels={{ show: t.showInDemo, openInCatalog: t.openInCatalog }}
              rows={sections.map((section) => ({
                name: section.name,
                role: section.role,
                title: section.item.title ?? section.name,
                note: section.note,
                path: section.path,
                anchor: section.anchor,
                usage:
                  pro && source && section.exportName
                    ? (extractUsage(source, section.exportName) ?? `<${section.exportName} />`)
                    : null,
              }))}
            />
          </div>
        </section>

        {pro && pictures ? (
          <>
            <section className="mt-12">
              <h2 className="text-shell-fg text-lg font-semibold">{t.rules}</h2>
              <ul className="text-shell-muted mt-3 grid max-w-2xl gap-2 text-sm">
                <li>{t.ruleTheme(scenario.theme.tone, scenario.theme.accent, scenario.theme.ink)}</li>
                <li>{t.ruleFont(scenario.theme.font)}</li>
                {t.ruleList.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </section>

            {pictures.images.length > 0 ? (
              <section className="mt-12">
                <h2 className="text-shell-fg text-lg font-semibold">{t.images}</h2>
                <p className="text-shell-muted mt-2 max-w-2xl text-sm">{t.imagesNote}</p>
                {pictures.style ? (
                  <pre className="bg-shell-elevated border-shell-border text-shell-fg mt-4 overflow-auto rounded-lg border p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                    {pictures.style}
                  </pre>
                ) : null}
                <div className="border-shell-border mt-4 overflow-x-auto rounded-lg border">
                  <table className="w-full text-left text-sm">
                    <thead className="text-shell-muted text-xs">
                      <tr>
                        <th className="px-3 py-2 font-medium">{t.imageFile}</th>
                        <th className="px-3 py-2 font-medium">{t.imageFormat}</th>
                        <th className="px-3 py-2 font-medium">{t.imagePrompt}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-shell-border divide-y">
                      {pictures.images.map((image) => (
                        <tr key={`${image.file}-${image.format}`} className="align-top">
                          <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{image.file}</td>
                          <td className="text-shell-muted px-3 py-2 text-xs whitespace-nowrap">{image.format}</td>
                          <td className="text-shell-fg px-3 py-2 text-xs">{image.prompt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            <section className="mt-12">
              <h2 className="text-shell-fg text-lg font-semibold">{t.howTo}</h2>
              <ol className="text-shell-muted mt-3 grid max-w-2xl gap-2 text-sm">
                {t.howToSteps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="text-shell-accent-text font-semibold tabular-nums">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </>
        ) : (
          <section className="border-shell-border bg-shell-panel mt-12 rounded-2xl border px-6 py-10 text-center">
            <p className="text-shell-accent-text text-xs font-semibold tracking-[0.14em] uppercase">Pro</p>
            <h2 className="text-shell-fg mt-3 text-xl font-semibold text-balance sm:text-2xl">{t.proTitle}</h2>
            <p className="text-shell-muted mx-auto mt-3 max-w-xl text-sm text-pretty">{t.proText}</p>
            <Link
              href={localePath(locale, "/pricing")}
              className="acc-press mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#ff5900] px-6 text-sm font-semibold text-[#151515] transition-colors hover:bg-[#ff7a33]"
            >
              {t.proLink}
            </Link>
          </section>
        )}
      </main>
    </CatalogShell>
  )
}
