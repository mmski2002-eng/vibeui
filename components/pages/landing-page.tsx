import Link from "next/link"
import { ArrowRight, Check, X } from "lucide-react"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { DesignShowcase } from "@/components/pages/landing/design-showcase"
import {
  CategoryExplorer,
  type ExplorerTab,
} from "@/components/pages/landing/category-explorer"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { CATEGORIES, type ItemKind } from "@/registry/categories"
import {
  catalogBasePath,
  getItemsByKind,
  getUsedCategories,
} from "@/registry/index"

const KIND_ORDER: ItemKind[] = ["component", "block", "animation"]
const GROUP_OF = new Map<string, string>(
  CATEGORIES.map((category) => [category.slug, category.group]),
)

const BTN_PRIMARY =
  "bg-shell-accent text-shell-accent-fg inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:ring-shell-ring focus-visible:ring-2 focus-visible:outline-none"
const BTN_GHOST =
  "border-shell-border text-shell-fg hover:bg-shell-panel hover:border-shell-border-strong inline-flex h-11 items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors focus-visible:ring-shell-ring focus-visible:ring-2 focus-visible:outline-none"

/**
 * Главная — витринный лендинг. Каталог живёт в своих разделах (/components,
 * /blocks, /animations); здесь — обзор с живыми числами из реестра.
 */
export function LandingPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const en = locale === "en"

  const kinds = KIND_ORDER.map((kind) => ({
    kind,
    base: catalogBasePath(kind),
    count: getItemsByKind(kind).length,
    categories: getUsedCategories(kind, locale),
    copy:
      kind === "component"
        ? t.components
        : kind === "block"
          ? t.blocks
          : t.animations,
  }))

  const total = kinds.reduce((sum, entry) => sum + entry.count, 0)
  const allCategories = kinds.flatMap((entry) =>
    entry.categories.map((category) => ({
      slug: category.slug,
      label: category.label,
      count: category.count,
      href: `${entry.base}/${category.slug}`,
    })),
  )
  const categoriesTotal = allCategories.length
  const groupsTotal = new Set(
    allCategories
      .map((category) => GROUP_OF.get(category.slug))
      .filter(Boolean),
  ).size

  const tabs: ExplorerTab[] = [
    {
      key: "all",
      label: en ? "All" : "Все",
      count: total,
      categories: allCategories,
    },
    ...kinds.map((entry) => ({
      key: entry.kind,
      label: entry.copy.title,
      count: entry.count,
      categories: entry.categories.map((category) => ({
        slug: category.slug,
        label: category.label,
        count: category.count,
        href: `${entry.base}/${category.slug}`,
      })),
    })),
  ]

  const compareBad = en
    ? [
        "The agent re-invents a lookalike from a description",
        "Hours lost to prompts, reviews and drifting design",
        "Accessibility and keyboard support missing",
        "Every screen built from scratch again",
      ]
    : [
        "Агент лепит похожий компонент по описанию",
        "Часы на промпты, правки и разъезжающийся дизайн",
        "Нет доступности и работы с клавиатуры",
        "Каждый экран собирается заново",
      ]
  const compareGood = en
    ? [
        "The agent installs the exact file from the registry",
        "Zero dependencies, its own palette",
        "Accessibility and keyboard support built in",
        "One command — and it is done",
      ]
    : [
        "Агент ставит тот же файл из реестра — как в превью",
        "Ноль зависимостей, собственная палитра",
        "Доступность и клавиатура на месте",
        "Одна команда — и готово",
      ]

  const faq = en
    ? [
        {
          q: "What do I get after installing?",
          a: "One component file in your project — the same one you saw in the preview. No build step, no wrappers, no coupling to our theme.",
        },
        {
          q: "Do I need extra dependencies?",
          a: "Most components have zero — only React. Everything required is declared in the metadata.",
        },
        {
          q: "What if I have my own design system?",
          a: "The component carries its palette in local variables. Override them and it snaps into your theme.",
        },
        {
          q: "Components vs blocks vs animations?",
          a: "Components are small elements, blocks are whole page sections, animations are recreated animated components. Each section is independent.",
        },
      ]
    : [
        {
          q: "Что я получаю после установки?",
          a: "Один файл компонента в вашем проекте — тот же, что в превью. Ни сборки, ни обёрток, ни привязки к нашей теме.",
        },
        {
          q: "Нужны ли дополнительные зависимости?",
          a: "У большинства компонентов ноль — только React. Всё необходимое объявлено в метаданных.",
        },
        {
          q: "А если у меня своя дизайн-система?",
          a: "Компонент несёт палитру в локальных переменных. Переопределите их — и он встанет в вашу тему, не трогая остальной проект.",
        },
        {
          q: "Чем компоненты отличаются от блоков и анимаций?",
          a: "Компоненты — мелкие элементы, блоки — целые секции страницы, анимации — воссозданные анимированные компоненты. Разделы независимы.",
        },
      ]

  return (
    <CatalogShell locale={locale}>
      <main className="w-full flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-8 text-center sm:pt-10 lg:px-6 lg:pt-12">
          <Link
            href={localePath(locale, catalogBasePath("animation"))}
            className="border-shell-border bg-shell-panel text-shell-muted hover:text-shell-fg hover:border-shell-border-strong mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
          >
            <span
              className="bg-shell-accent size-1.5 shrink-0 rounded-full"
              aria-hidden="true"
            />
            {en ? "New · Animations section" : "Новое · раздел Анимации"}
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>

          {/* Строки заданы вручную: автоперенос рвал фразу между «Отдай» и
              «ИИ», а обещание читается только целыми предложениями. */}
          <h1 className="text-shell-fg mx-auto mt-5 max-w-4xl text-4xl leading-[1.14] font-semibold tracking-[-0.015em] text-balance sm:text-5xl lg:text-6xl">
            <span className="block">{t.home.titleLines[0]}</span>
            <span className="block">{t.home.titleLines[1]}</span>
          </h1>
          <p className="text-shell-muted mx-auto mt-4 max-w-xl text-base leading-relaxed text-balance sm:text-lg">
            {en
              ? "Sections, components and animations. Pick one, copy it for AI, drop it into your project."
              : "Секции, компоненты и анимации. Выбери, скопируй для ИИ и вставь в проект."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="#designs" className={BTN_PRIMARY}>
              {en ? "Explore designs" : "Выбрать дизайн"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href={localePath(locale, "/blocks")} className={BTN_GHOST}>
              {t.blocks.title}
            </Link>
          </div>
        </section>

        <DesignShowcase locale={locale} />

        {/* Статы */}
        <section className="mx-auto w-full max-w-[1440px] px-4 pt-16 text-center lg:px-6">
          <p className="text-shell-muted mx-auto max-w-2xl text-sm sm:text-base">
            <Stat n={total} /> {en ? "elements across" : "элементов в"}{" "}
            <Stat n={groupsTotal} /> {en ? "groups and" : "группах и"}{" "}
            <Stat n={categoriesTotal} />{" "}
            {en
              ? "categories — for every part of your interface."
              : "категориях — на любую часть интерфейса."}
          </p>
        </section>

        {/* Обзор категорий */}
        <section className="mx-auto w-full max-w-[1440px] px-4 py-12 lg:px-6">
          <CategoryExplorer tabs={tabs} locale={locale} />
        </section>

        {/* Разделы */}
        <section className="mx-auto w-full max-w-[1440px] px-4 py-12 lg:px-6">
          <ul className="grid gap-4 sm:grid-cols-3">
            {kinds.map((entry) => (
              <li key={entry.kind}>
                <Link
                  href={localePath(locale, entry.base)}
                  className="border-shell-border bg-shell-panel hover:border-shell-border-strong hover:bg-shell-elevated group flex h-full flex-col gap-3 rounded-2xl border p-6 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-shell-fg text-lg font-semibold tracking-tight">
                      {entry.copy.title}
                    </h2>
                    <span className="text-shell-muted text-xs tabular-nums">
                      {entry.count}
                    </span>
                  </div>
                  <p className="text-shell-muted text-sm leading-relaxed">
                    {entry.copy.description}
                  </p>
                  <span className="text-shell-fg group-hover:text-shell-accent mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium transition-colors">
                    {en ? "Open" : "Открыть"}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Сравнение */}
        <section className="mx-auto w-full max-w-[1100px] px-4 py-12 lg:px-6">
          <h2 className="text-shell-fg mb-8 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            {en
              ? "Handcrafted, not re-invented"
              : "Готовый, а не пересозданный"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-shell-border bg-shell-panel rounded-2xl border p-6">
              <h3 className="text-shell-fg mb-4 font-semibold">
                {en ? "Without the library" : "Без библиотеки"}
              </h3>
              <ul className="flex flex-col gap-3">
                {compareBad.map((line) => (
                  <li
                    key={line}
                    className="text-shell-muted flex gap-2.5 text-sm"
                  >
                    <X
                      className="mt-0.5 size-4 shrink-0 opacity-70"
                      aria-hidden="true"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-shell-accent/40 bg-shell-elevated rounded-2xl border p-6">
              <h3 className="text-shell-fg mb-4 font-semibold">
                {en ? "With VibeUI" : "С VibeUI"}
              </h3>
              <ul className="flex flex-col gap-3">
                {compareGood.map((line) => (
                  <li key={line} className="text-shell-fg flex gap-2.5 text-sm">
                    <Check
                      className="text-shell-accent mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-[760px] px-4 py-12 lg:px-6">
          <h2 className="text-shell-fg mb-8 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            {en ? "Frequently asked questions" : "Частые вопросы"}
          </h2>
          <div className="flex flex-col gap-2">
            {faq.map((entry) => (
              <details
                key={entry.q}
                className="border-shell-border bg-shell-panel group rounded-xl border px-5"
              >
                <summary className="text-shell-fg flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                  {entry.q}
                  <ArrowRight
                    className="text-shell-muted size-4 shrink-0 transition-transform group-open:rotate-90"
                    aria-hidden="true"
                  />
                </summary>
                <p className="text-shell-muted pb-4 text-sm leading-relaxed">
                  {entry.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Финальный CTA */}
        <section className="mx-auto w-full max-w-[1440px] px-4 py-16 text-center lg:px-6 lg:py-24">
          <h2 className="text-shell-fg mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {en ? "Ship a page tonight." : "Собери страницу за вечер."}
          </h2>
          <p className="text-shell-muted mx-auto mt-4 max-w-xl text-sm sm:text-base">
            {en
              ? "Open the catalog, pick a component, hand it to your agent."
              : "Открой каталог, выбери компонент, отдай его агенту."}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href={localePath(locale, "/components")}
              className={BTN_PRIMARY}
            >
              {en ? "Browse components" : "Смотреть компоненты"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Футер */}
        <footer className="border-shell-border border-t">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-12 sm:flex-row sm:justify-between lg:px-6">
            <div className="max-w-xs">
              <span className="text-shell-fg text-base font-semibold tracking-tight">
                Vibe<span className="text-shell-accent">UI</span>
              </span>
              <p className="text-shell-muted mt-2 text-sm leading-relaxed">
                {en
                  ? "Pick a design. Hand it to your AI. Ship the page."
                  : "Выбери дизайн. Отдай ИИ. Получи сайт."}
              </p>
            </div>
            <nav className="grid grid-cols-2 gap-x-12 gap-y-2 sm:grid-cols-3">
              {kinds.map((entry) => (
                <Link
                  key={entry.kind}
                  href={localePath(locale, entry.base)}
                  className="text-shell-muted hover:text-shell-fg flex items-center gap-2 text-sm transition-colors"
                >
                  {entry.copy.title}
                  <span className="text-shell-muted/60 text-xs tabular-nums">
                    {entry.count}
                  </span>
                </Link>
              ))}
              <Link
                href="/lab"
                className="text-shell-muted hover:text-shell-fg text-sm transition-colors"
              >
                {t.topbar.lab}
              </Link>
            </nav>
          </div>
          <div className="border-shell-border text-shell-muted mx-auto w-full max-w-[1440px] border-t px-4 py-6 text-xs lg:px-6">
            {en
              ? `VibeUI · ${total} elements installed with a single command`
              : `VibeUI · ${total} элементов, установка одной командой`}
          </div>
        </footer>
      </main>
    </CatalogShell>
  )
}

function Stat({ n }: { n: number }) {
  return (
    <strong className="text-shell-fg font-semibold tabular-nums">{n}</strong>
  )
}
