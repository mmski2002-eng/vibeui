import Link from "next/link"

import { BlockCard } from "@/components/block-card"
import { SiteHeader } from "@/components/site-header"
import { getFeaturedBlocks } from "@/registry/index"

const STEPS = [
  {
    title: "Выбери дизайн",
    text: "Открой каталог и посмотри блок живьём — не по скриншоту.",
  },
  {
    title: "Отдай ИИ",
    text: "Copy for AI даёт агенту команду установки и правила: что сохранить, что менять.",
  },
  {
    title: "Получи сайт",
    text: "Агент ставит блок из registry, а не пересоздаёт его по описанию.",
  },
]

export default function HomePage() {
  const featured = getFeaturedBlocks().slice(0, 3)

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <section className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Выбери дизайн. Отдай ИИ. Получи сайт.
          </h1>
          <p className="text-muted-foreground mt-5 text-lg text-pretty">
            VibeUI — библиотека UI-компонентов для вайбкодинга. Каждый блок
            приходит не только кодом, но и инструкцией для AI-агента, поэтому
            результат совпадает с тем, что вы видели в каталоге.
          </p>
          <Link
            href="/components"
            className="bg-foreground text-background focus-visible:ring-ring mt-8 inline-flex h-11 items-center rounded-lg px-5 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
          >
            Смотреть компоненты
          </Link>
        </section>

        <section aria-labelledby="how-heading" className="mt-16">
          <h2 id="how-heading" className="sr-only">
            Как это работает
          </h2>
          <ol className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <p className="text-muted-foreground text-xs font-medium">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-medium">{step.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {featured.length > 0 ? (
          <section aria-labelledby="featured-heading" className="mt-16">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <h2 id="featured-heading" className="text-lg font-medium">
                Featured
              </h2>
              <Link
                href="/components"
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Весь каталог
              </Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
