import type { Metadata } from "next"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { TimelineShowcase } from "@/components/animations/timeline-showcase"

/**
 * Анимации — внутренняя витрина воссозданных компонентов с других сайтов.
 * Пока концепт не согласован, в registry/ он не попадает; здесь только показ
 * в нашей концепции: своя палитра, ноль зависимостей, тема из окружения.
 */
export const metadata: Metadata = {
  title: "Анимации",
  robots: { index: false, follow: false },
}

// Список концептов витрины. По мере воссоздания новых компонентов растёт —
// сайдбар и якоря собираются отсюда.
const SECTIONS = [{ id: "activity-timeline", label: "Лента активности" }]

const NAV_ITEM =
  "catalog-nav-item flex w-full items-center justify-between gap-2 rounded-md font-medium transition-colors focus-visible:ring-shell-ring focus-visible:ring-2 focus-visible:outline-none"

export default function AnimationsPage() {
  return (
    <CatalogShell locale="ru">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 lg:flex-row lg:gap-8 lg:px-6">
        {/* Левое меню как на витрине: липкий столбец с разделителем справа. */}
        <div className="relative hidden shrink-0 lg:sticky lg:top-14 lg:block lg:w-64 lg:self-start lg:pt-8">
          <span
            aria-hidden="true"
            className="bg-shell-divider pointer-events-none absolute inset-y-0 right-0 w-px"
          />
          <aside className="pr-2.5">
            <p className="text-shell-muted mt-2 mb-2 px-3 text-xs font-medium tracking-wide uppercase">
              Анимации
            </p>
            <ul className="catalog-nav-list">
              {SECTIONS.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={index === 0 ? "page" : undefined}
                    className={
                      NAV_ITEM +
                      (index === 0
                        ? " bg-shell-elevated text-shell-fg"
                        : " text-shell-fg hover:bg-shell-elevated")
                    }
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <main className="min-w-0 flex-1 py-6 lg:py-8">
          <section id="activity-timeline" className="scroll-mt-20">
            <header className="flex max-w-2xl flex-col gap-3">
              <h1 className="text-shell-fg text-3xl font-semibold tracking-tight">
                Лента активности
              </h1>
              <p className="text-shell-muted text-sm leading-relaxed">
                Воссоздание таймлайна с codedvisuals в нашей концепции: события
                сгруппированы секциями с пилюлей, состояние читается формой
                точки, правая колонка несёт время или статус словом. Варианты{" "}
                <code className="font-mono text-[0.8125rem]">fadeOut</code>,{" "}
                <code className="font-mono text-[0.8125rem]">isometric</code> и{" "}
                <code className="font-mono text-[0.8125rem]">gradient</code> —
                пропы компонента. Ноль зависимостей, тема из окружения через{" "}
                <code className="font-mono text-[0.8125rem]">light-dark()</code>.
              </p>
            </header>

            <div className="mt-8">
              <TimelineShowcase />
            </div>
          </section>
        </main>
      </div>
    </CatalogShell>
  )
}
