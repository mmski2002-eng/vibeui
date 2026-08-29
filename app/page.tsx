import Link from "next/link"

import { BlockCard } from "@/components/block-card"
import { PageComposition } from "@/components/page-composition"
import { SiteHeader } from "@/components/site-header"
import {
  getBlockByCategory,
  getBlocks,
  getFeaturedBlocks,
} from "@/registry/index"

const STEPS = [
  {
    title: "Выбери дизайн",
    text: "Открой каталог и посмотри блок живьём — не по скриншоту.",
  },
  {
    title: "Нажми Copy for AI",
    text: "Получишь команду установки и правила: что сохранить, что менять.",
  },
  {
    title: "Отдай агенту",
    text: "Агент ставит блок из registry, а не пересоздаёт его по описанию.",
  },
]

// Порядок секций типовой страницы: из этих типов собирается лендинг.
const PAGE_ORDER = ["hero", "features", "pricing"]

export default function HomePage() {
  const blocks = getBlocks()
  const featured = getFeaturedBlocks().slice(0, 3)
  const chain = PAGE_ORDER.map((category) =>
    getBlockByCategory(category),
  ).filter((block) => block !== undefined)
  const categoryCount = new Set(
    blocks.map((block) => block.categories?.[0]).filter(Boolean),
  ).size

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Выбери дизайн. Отдай ИИ. Получи сайт.
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-lg text-pretty">
              VibeUI — библиотека готовых секций для вайбкодинга. Каждый блок
              приходит не только кодом, но и инструкцией для AI-агента, поэтому
              результат совпадает с тем, что вы видели в каталоге.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/components"
                className="bg-foreground text-background focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
              >
                Смотреть каталог
              </Link>
              <Link
                href="#how"
                className="focus-visible:ring-ring hover:bg-muted inline-flex h-11 items-center justify-center rounded-lg border px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Как это работает
              </Link>
            </div>
            <p className="text-muted-foreground mt-6 text-sm">
              {blocks.length} блоков · {categoryCount} типа секций · установка
              одной командой
            </p>
          </div>

          <PageComposition />
        </section>

        <section aria-labelledby="compose-heading" className="mt-20 sm:mt-24">
          <h2
            id="compose-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            Собери страницу из блоков
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-pretty">
            VibeUI — не набор героев. Секции стыкуются друг с другом: возьмите
            hero, добавьте описание возможностей и тарифы — получится связный
            лендинг, собранный из блоков одной библиотеки.
          </p>

          {/* Карточка одна на весь сайт: внутри блока есть свои <a>, поэтому
              обернуть миниатюру в ссылку нельзя — BlockCard решает это
              растянутым псевдоэлементом. */}
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {chain.map((block, index) => (
              <li key={block.name}>
                <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                  Шаг {index + 1}
                </p>
                <BlockCard block={block} />
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="how-heading"
          className="mt-20 sm:mt-24"
          id="how"
        >
          <h2
            id="how-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            Как это работает
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="border-t pt-4">
                <p className="text-muted-foreground text-xs font-medium">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-medium">{step.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm text-pretty">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {featured.length > 0 ? (
          <section
            aria-labelledby="featured-heading"
            className="mt-20 sm:mt-24"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2
                id="featured-heading"
                className="text-2xl font-semibold tracking-tight"
              >
                Один тип блока — разные направления
              </h2>
              <Link
                href="/components"
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Весь каталог
              </Link>
            </div>
            <p className="text-muted-foreground mt-3 max-w-2xl text-pretty">
              Три hero-блока ниже решают одну задачу по-разному: тёмный
              атмосферный, светлый с окном продукта и тёплый из плиток. Вы
              выбираете дизайн-направление, а не подкручиваете пропсы.
            </p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((block) => (
                <li key={block.name}>
                  <BlockCard block={block} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </>
  )
}
