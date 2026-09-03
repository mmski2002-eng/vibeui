import type { Metadata } from "next"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { LAB_RUNS } from "@/components/lab/checks"
import { CATEGORIES } from "@/registry/categories"

/**
 * Рабочая область — внутренняя страница для осмотра глазами.
 *
 * Прогон категории на случайных настройках: то, что человек получит, если
 * после Copy for AI задаст компоненту свои пропы. Каждый кадр показан
 * дважды — на светлой и на тёмной подложке, потому что тему компоненты
 * берут из окружения, а не носят с собой.
 */
export const metadata: Metadata = {
  title: "Рабочая область",
  robots: { index: false, follow: false },
}

const LABELS = new Map<string, string>(
  CATEGORIES.map((entry) => [entry.slug, entry.label]),
)

function label(slug: string) {
  return LABELS.get(slug) ?? slug
}

export default async function LabPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const slugs = Object.keys(LAB_RUNS).sort((first, second) =>
    label(first).localeCompare(label(second), "ru"),
  )
  const current = category && LAB_RUNS[category] ? category : slugs[0]
  const run = current ? LAB_RUNS[current] : undefined

  return (
    <CatalogShell locale="ru">
      <main className="mx-auto w-full max-w-[1440px] px-4 py-10 lg:px-6">
        <header className="flex flex-col gap-4">
          <h1 className="text-shell-fg text-3xl font-semibold tracking-tight">
            Прогон категорий
          </h1>
          <p className="text-shell-muted max-w-3xl text-sm leading-relaxed">
            Компоненты категории со случайными настройками: каждому контролу
            выпало своё значение — другой вариант выбора, произвольный цвет из
            всего диапазона, свой номер раскрытого элемента. Слева светлая
            подложка, справа тёмная; под кадром перечислено, что именно выпало.
          </p>
          <p className="text-shell-muted max-w-3xl text-sm leading-relaxed">
            Цвета случайные нарочно: так проверяется механика веток темы, а не
            подобранный контраст. Некрасивое сочетание — не дефект; дефект — это
            когда текст пропал, подложка не сменила ветку, значок съел заголовок
            или содержимое уехало за край кадра.
          </p>

          <nav className="flex flex-wrap gap-x-3 gap-y-1.5 pt-2 text-sm">
            {slugs.map((slug) => (
              <a
                key={slug}
                href={`/lab?category=${slug}`}
                aria-current={slug === current ? "page" : undefined}
                className={
                  "focus-visible:ring-shell-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none " +
                  (slug === current
                    ? "text-shell-fg font-medium"
                    : "text-shell-muted hover:text-shell-fg")
                }
              >
                {label(slug)}
              </a>
            ))}
          </nav>
        </header>

        {run ? (
          <>
            <p className="text-shell-muted mt-8 text-sm">
              {label(current!)} · {run.checks.length} компонентов · seed{" "}
              <code className="text-shell-fg font-mono text-[0.8125rem]">
                {run.seed}
              </code>
            </p>

            <ol className="mt-4 flex flex-col gap-4">
              {run.checks.map((check) => (
                <li
                  key={check.name}
                  className="border-shell-border bg-shell-panel flex flex-col gap-3 rounded-xl border p-4"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-shell-muted font-mono text-xs">
                      {check.name}
                    </span>
                    <span className="text-shell-fg text-sm font-medium">
                      {check.title}
                    </span>
                    <span className="text-shell-muted text-xs">
                      {check.notes.join(" · ")}
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div
                      data-preview-theme="light"
                      className="bg-preview-surface flex min-h-32 items-center justify-center overflow-hidden rounded-lg p-6"
                    >
                      {check.node}
                    </div>
                    <div
                      data-preview-theme="dark"
                      className="bg-preview-surface flex min-h-32 items-center justify-center overflow-hidden rounded-lg p-6"
                    >
                      {check.nodeDark ?? check.node}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="text-shell-muted mt-8 text-sm">
            Прогонов пока нет — соберите их генератором.
          </p>
        )}
      </main>
    </CatalogShell>
  )
}
