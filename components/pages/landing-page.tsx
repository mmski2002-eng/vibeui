import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowRight, X } from "lucide-react"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { Background005 } from "@/registry/animations/background/background-005/background-005"
import { DesignShowcase } from "@/components/pages/landing/design-showcase"
import { RegistryRain } from "@/components/pages/landing/registry-rain"
import {
  CategoryExplorer,
  type ExplorerTab,
} from "@/components/pages/landing/category-explorer"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { FREE_MONTHLY_LIMIT } from "@/lib/limits"
import { getPlans } from "@/lib/plan-prices"
import { getInstallCommand } from "@/lib/site"
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

/** Кадры первого экрана — тот же набор, что в превью компонента. */
const HERO_PHOTOS = [
  { src: "/demo/posters/poster-05.webp", alt: "" },
  { src: "/demo/cards/portrait-07.webp", alt: "" },
  { src: "/demo/features/feature-05.webp", alt: "" },
  { src: "/demo/cards/wide-03.webp", alt: "" },
  { src: "/demo/posters/poster-03.webp", alt: "" },
  { src: "/demo/cards/square-02.webp", alt: "" },
  { src: "/demo/cards/portrait-01.webp", alt: "" },
  { src: "/demo/cards/wide-01.webp", alt: "" },
  { src: "/demo/features/feature-02.webp", alt: "" },
  { src: "/demo/cards/portrait-05.webp", alt: "" },
  { src: "/demo/cards/square-03.webp", alt: "" },
  { src: "/demo/cards/wide-02.webp", alt: "" },
]

const BTN_PRIMARY =
  "bg-shell-accent text-shell-accent-fg inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition hover:bg-shell-accent-deep active:scale-[0.98] focus-visible:ring-shell-ring focus-visible:ring-2 focus-visible:outline-none"
const BTN_GHOST =
  "border-shell-border text-shell-fg hover:bg-shell-panel hover:border-shell-border-strong inline-flex h-11 items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium transition active:scale-[0.98] focus-visible:ring-shell-ring focus-visible:ring-2 focus-visible:outline-none"

/**
 * Главная — витринный лендинг. Каталог живёт в своих разделах (/components,
 * /blocks, /animations); здесь — обзор с живыми числами из реестра.
 */
export async function LandingPage({ locale }: { locale: Locale }) {
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

  // Точка последнего предложения — акцентом: единственное место, где знак
  // бренда стоит внутри самого обещания, а не рядом с ним.
  const promise = t.home.titleParts[2]
  const promiseDot = promise.endsWith(".")
  const promiseEnd = promiseDot ? promise.slice(0, -1) : promise

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

  // Команда установки настоящая: тот же адрес реестра, что отдаёт кнопка
  // на странице компонента.
  const installCommand = getInstallCommand("hero-001")

  const trust = en
    ? [
        `${total} components`,
        "shadcn-compatible",
        "one command to install",
        "zero dependencies",
      ]
    : [
        `${total} компонентов`,
        "shadcn-совместимо",
        "установка одной командой",
        "ноль зависимостей",
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

  const monthly = Number((await getPlans()).monthly.price).toLocaleString("ru-RU")
  const tiers = en
    ? [
        {
          name: "Free",
          price: "0 ₽",
          note: `${FREE_MONTHLY_LIMIT} different components a month`,
          lines: [
            "The whole catalog, previews and search",
            "Copy for AI and shadcn install",
            "Favorites and history",
          ],
        },
        {
          name: "PRO",
          price: `${monthly} ₽ / mo`,
          note: "No copy limit",
          lines: [
            "Animations and closed blocks",
            "No limit on components",
          ],
          highlight: true,
        },
      ]
    : [
        {
          name: "Бесплатно",
          price: "0 ₽",
          note: `${FREE_MONTHLY_LIMIT} разных компонентов в месяц`,
          lines: [
            "Весь каталог, превью и поиск",
            "Копирование для ИИ и установка через shadcn",
            "Избранное и история",
          ],
        },
        {
          name: "PRO",
          price: `${monthly} ₽ / мес`,
          note: "Без лимита на копирование",
          lines: [
            "Анимации и закрытые блоки",
            "Без лимита на компоненты",
          ],
          highlight: true,
        },
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
    <CatalogShell locale={locale} wash>
      <main className="w-full flex-1">
        {/* Hero: обещание стоит внутри работающего компонента каталога, а
            не над картинкой про него. Кадры кружат вокруг заголовка — это и
            есть доказательство продукта в первую секунду. */}
        <section className="w-full pb-8">
          {/* Сцена во всю ширину и без рамки: она не карточка на странице, а
              сам верх страницы. Размер кадров подбирает сама орбита от
              высоты холста. */}
          {/* Фраза поднята над центром сцены: кадры остаются на своей
              орбите, а заголовок с кнопками уходит выше. На телефоне
              подъёма нет — там текст и так занимает почти весь холст и
              ушёл бы под шапку. */}
          <div className="h-[30rem] overflow-hidden sm:h-[32rem] sm:[--vibeui-background-005-center-shift:2rem] lg:h-[34rem] lg:[--vibeui-background-005-center-shift:3rem]">
            <Background005
              photos={HERO_PHOTOS}
              speed={0.7}
              background="var(--shell-bg)"
              ink="var(--shell-fg)"
              // Холст сцены погашен: подложку первого экрана даёт страница,
              // а цвет холста остаётся — из него считается свечение под
              // заголовком.
              style={
                {
                  "--vibeui-background-005-canvas": "transparent",
                } as CSSProperties
              }
            >
              <div className="hero-rise bg-shell/70 flex flex-col items-center gap-3 rounded-2xl px-4 py-5 backdrop-blur-[2px] sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                <Link
                  href={localePath(locale, catalogBasePath("animation"))}
                  className="border-shell-accent-line bg-shell-accent-soft/80 text-shell-accent-text hover:border-shell-accent hover:bg-shell-accent-soft inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md transition-colors"
                >
                  <span
                    className="bg-shell-accent size-1.5 shrink-0 rounded-full"
                    aria-hidden="true"
                  />
                  {en ? "New · Animations section" : "Новое · раздел Анимации"}
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>

                {/* Строки заданы вручную: автоперенос рвал фразу между «Отдай»
                  и «ИИ», а обещание читается только целыми предложениями.
                  Вес внутри строки — ритм: три одинаково жирных предложения
                  склеивались в стену, средний такт снят до обычного веса. */}
                <h1 className="type-display text-shell-fg mx-auto mt-3 max-w-4xl">
                  <span className="block">{t.home.titleParts[0]}</span>
                  <span className="block">
                    <span className="text-shell-muted font-normal">
                      {t.home.titleParts[1]}
                    </span>{" "}
                    {promiseEnd}
                    {promiseDot ? (
                      <span className="text-shell-accent">.</span>
                    ) : null}
                  </span>
                </h1>
                <p className="type-lead text-shell-muted mx-auto mt-1 max-w-xl text-balance">
                  {en
                    ? "Sections, components and animations. Pick one, copy it for AI, drop it into your project."
                    : "Секции, компоненты и анимации. Выбери, скопируй для ИИ и вставь в проект."}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                  <Link href="#designs" className={BTN_PRIMARY}>
                    {en ? "Explore designs" : "Выбрать дизайн"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href={localePath(locale, "/blocks")}
                    // Кадры проходят за кнопкой: стекло держит контраст, но
                    // сцену за собой не закрывает.
                    className={`${BTN_GHOST} bg-shell/40 backdrop-blur-md`}
                  >
                    {t.blocks.title}
                  </Link>
                </div>

                {/* Опора под кнопками: три возражения снимаются одной
                    строкой, и призыв перестаёт висеть в пустоте. */}
                <ul className="type-label text-shell-muted border-shell-border bg-shell/40 mx-auto mt-5 grid max-w-full grid-cols-2 justify-items-center gap-x-4 gap-y-1.5 rounded-2xl border px-4 py-2.5 backdrop-blur-md sm:inline-flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-3 sm:rounded-full">
                  {trust.map((line) => (
                    <li
                      key={line}
                      // Точка-разделитель только там, где строка идёт одной
                      // лентой: при переносе она вылезала бы в начало новой
                      // строки, поэтому на телефоне это сетка без точек.
                      className="before:text-shell-muted/50 before:mr-3 before:hidden before:content-['·'] sm:before:inline sm:first:before:hidden"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Background005>
          </div>
        </section>

        <DesignShowcase locale={locale} />

        {/* Статы и обзор категорий — одна смысловая пара: сколько всего и
            что именно. Между ними шаг тесный, вокруг пары — обычный. */}
        <section className="mx-auto w-full max-w-[1440px] px-4 pt-20 text-center lg:px-6">
          <p className="type-caption text-shell-muted mx-auto max-w-2xl">
            <Stat n={total} /> {en ? "elements across" : "элементов в"}{" "}
            <Stat n={groupsTotal} /> {en ? "groups and" : "группах и"}{" "}
            <Stat n={categoriesTotal} />{" "}
            {en
              ? "categories — for every part of your interface."
              : "категориях — на любую часть интерфейса."}
          </p>
        </section>

        <section className="mx-auto w-full max-w-[1440px] px-4 pt-6 lg:px-6">
          <CategoryExplorer tabs={tabs} locale={locale} />
        </section>

        {/* Разделы */}
        <section className="mx-auto w-full max-w-[1440px] px-4 pt-20 lg:px-6">
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
        <section className="mx-auto w-full max-w-[1100px] px-4 pt-20 lg:px-6">
          <h2 className="type-h2 text-shell-fg mb-8 text-center">
            {en
              ? "Handcrafted, not re-invented"
              : "Готовый, а не пересозданный"}
          </h2>
          {/* Колонки намеренно неравные. Две симметричные плашки с
              крестиками и галочками — самый ходовой паттерн на лендингах
              разработческих инструментов; здесь левая уходит в тень, правая
              крупнее, теплее и приподнята. */}
          <div className="grid items-start gap-4 md:grid-cols-[0.85fr_1.15fr] md:gap-6">
            <div className="border-shell-border/70 rounded-2xl border border-dashed p-6">
              <h3 className="type-label text-shell-muted mb-4">
                {en ? "Without the library" : "Без библиотеки"}
              </h3>
              <ul className="flex flex-col gap-3">
                {compareBad.map((line) => (
                  <li
                    key={line}
                    className="text-shell-muted/80 flex gap-2.5 text-sm"
                  >
                    <X
                      className="mt-0.5 size-4 shrink-0 opacity-60"
                      aria-hidden="true"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-shell-accent-line bg-shell-elevated rounded-2xl border p-6 shadow-lg shadow-black/10 md:-mt-4 md:p-8">
              <h3 className="type-label text-shell-accent-text mb-4">
                {en ? "With VibeUI" : "С VibeUI"}
              </h3>
              <ul className="flex flex-col gap-3.5">
                {compareGood.map((line) => (
                  <li
                    key={line}
                    className="text-shell-fg flex gap-3 text-sm sm:text-base"
                  >
                    <span
                      className="bg-shell-accent mt-2 size-1.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Тарифы. Страница /pricing существовала с самого начала, но
            ссылок на неё не было ни одной: человек узнавал про лимит,
            только упершись в него. Здесь короткая выжимка, подробности —
            на самой странице. */}
        <section className="mx-auto w-full max-w-[1100px] px-4 pt-20 lg:px-6">
          <h2 className="type-h2 text-shell-fg mb-8 text-center">
            {en ? "Free to start" : "Начать можно бесплатно"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={
                  tier.highlight
                    ? "border-shell-accent-line bg-shell-elevated rounded-2xl border p-6"
                    : "border-shell-border bg-shell-panel rounded-2xl border p-6"
                }
              >
                <p
                  className={
                    tier.highlight
                      ? "type-label text-shell-accent-text"
                      : "type-label text-shell-muted"
                  }
                >
                  {tier.name}
                </p>
                <p className="type-h3 text-shell-fg mt-2">{tier.price}</p>
                <p className="text-shell-muted mt-1 text-sm">{tier.note}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {tier.lines.map((line) => (
                    <li
                      key={line}
                      className="text-shell-muted flex gap-3 text-sm"
                    >
                      <span
                        className="bg-shell-accent mt-2 size-1.5 shrink-0 rounded-full"
                        aria-hidden="true"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link href={localePath(locale, "/pricing")} className={BTN_GHOST}>
              {en ? "All plan details" : "Все условия тарифов"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-[760px] px-4 pt-20 lg:px-6">
          <h2 className="type-h2 text-shell-fg mb-8 text-center">
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
          {/* Новичок не найдёт ответ в FAQ: ему нужна не справка, а путь. */}
          <p className="text-shell-muted mt-6 text-center text-sm">
            {en ? "New to AI coding? " : "Только начинаете? "}
            <Link
              href={localePath(locale, "/start")}
              className="text-shell-fg hover:text-shell-accent-text inline-flex items-center gap-1 font-medium transition-colors"
            >
              {en
                ? "Step-by-step guide from setup to the first block"
                : "Пошаговый гайд от установки до первого блока"}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </p>
        </section>

        {/* Финальный CTA. Перед ним пауза шире обычной: это конец разговора,
            а не очередная секция. */}
        <section className="mx-auto w-full max-w-[1440px] px-4 pt-32 pb-24 text-center lg:px-6">
          <h2 className="type-h1 text-shell-fg mx-auto max-w-2xl">
            {en ? "Ship a page tonight" : "Собери страницу за вечер"}
          </h2>
          <p className="type-lead text-shell-muted mx-auto mt-4 max-w-xl">
            {en
              ? "Open the catalog, pick a component, hand it to your agent."
              : "Открой каталог, выбери компонент, отдай его агенту."}
          </p>

          {/* Последнее, что человек видит перед уходом, — не пересказ
              первого экрана, а ровно та команда, которую он получит,
              нажав «Копировать для ИИ». Адрес реестра берётся из
              настройки: выдумывать домен, которым мы не управляем, нельзя,
              и без него строка просто не показывается. */}
          {installCommand ? (
            <div className="mt-8 flex justify-center">
              <code className="border-shell-border bg-shell-panel text-shell-muted max-w-full overflow-x-auto rounded-xl border px-4 py-3 text-left font-mono text-xs whitespace-nowrap sm:text-sm">
                <span className="text-shell-accent select-none">$ </span>
                {installCommand}
              </code>
            </div>
          ) : null}

          <div className="mt-6 flex justify-center">
            <Link
              href={localePath(locale, "/components")}
              className={BTN_PRIMARY}
            >
              {en ? "Browse components" : "Смотреть компоненты"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Футер. Под ним ползут имена реестра: единственное место, где
            каталог присутствует на странице сам по себе. В hero такому слою
            не место — там уже кружат кадры, и два источника движения
            спорили бы друг с другом. */}
        <footer className="border-shell-border relative overflow-hidden border-t">
          <RegistryRain />
          <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-12 sm:flex-row sm:justify-between lg:px-6">
            <div className="max-w-xs">
              <span className="wordmark text-shell-fg text-base">
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
                href={localePath(locale, "/scenarios")}
                className="text-shell-muted hover:text-shell-fg text-sm transition-colors"
              >
                {t.topbar.scenarios}
              </Link>
              <Link
                href={localePath(locale, "/pricing")}
                className="text-shell-muted hover:text-shell-fg text-sm transition-colors"
              >
                {en ? "Pricing" : "Тарифы"}
              </Link>
              <Link
                href={localePath(locale, "/start")}
                className="text-shell-muted hover:text-shell-fg text-sm transition-colors"
              >
                {en ? "Getting started" : "Как начать"}
              </Link>
            </nav>
          </div>
          <div className="border-shell-border text-shell-muted mx-auto flex w-full max-w-[1440px] flex-col gap-2 border-t px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <span>
              {en
                ? `VibeUI · ${total} elements installed with a single command`
                : `VibeUI · ${total} элементов, установка одной командой`}
            </span>
            <a
              href="https://t.me/for_Escape"
              target="_blank"
              rel="noopener noreferrer"
              className="text-shell-muted hover:text-shell-fg inline-flex items-center gap-1.5 transition-colors"
            >
              powered by
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="size-3.5"
              >
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
              </svg>
              @for_Escape
            </a>
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
