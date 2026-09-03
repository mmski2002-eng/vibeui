import Link from "next/link"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { catalogBasePath, getItemsByKind } from "@/registry/index"

/**
 * Главная — короткий SEO-лендинг. Каталог живёт в своих разделах
 * (/components, /blocks, /animations); здесь только описание и вход в них.
 * Временная страница: заменить полноценным лендингом позже.
 */
export function LandingPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const lead =
    locale === "en"
      ? "A component library for vibe coding. Pick a design, hit “Copy for AI,” and your agent installs it from the registry instead of re-inventing a lookalike. Components, whole page blocks, and animated pieces — each ships with its own palette and agent instructions."
      : "Библиотека компонентов для вайбкодинга. Открой компонент, нажми «Копировать для ИИ» — агент поставит его из реестра, а не пересоздаст похожий. Компоненты, целые секции-блоки и анимации — каждый со своей палитрой и инструкцией для агента."

  const sections = (["component", "block", "animation"] as const).map(
    (kind) => ({
      kind,
      href: catalogBasePath(kind),
      count: getItemsByKind(kind).length,
      copy:
        kind === "component"
          ? t.components
          : kind === "block"
            ? t.blocks
            : t.animations,
    }),
  )

  return (
    <CatalogShell locale={locale}>
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-16 lg:px-6 lg:py-24">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-shell-fg text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {t.home.title}
          </h1>
          <p className="text-shell-muted mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
            {lead}
          </p>
        </section>

        <ul className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
          {sections.map((section) => (
            <li key={section.kind}>
              <Link
                href={localePath(locale, section.href)}
                className="border-shell-border bg-shell-panel hover:border-shell-border-strong hover:bg-shell-elevated focus-visible:ring-shell-ring group flex h-full flex-col gap-3 rounded-2xl border p-6 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-shell-fg text-lg font-semibold tracking-tight">
                    {section.copy.title}
                  </h2>
                  <span className="text-shell-muted text-xs tabular-nums">
                    {section.count}
                  </span>
                </div>
                <p className="text-shell-muted text-sm leading-relaxed">
                  {section.copy.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </CatalogShell>
  )
}
