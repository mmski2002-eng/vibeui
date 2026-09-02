import type { Metadata } from "next"

import {
  ACCORDION_CONCEPTS,
  CONTROL_OPTIONS,
  type Concept,
} from "@/components/lab/accordion-concepts"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import type { ReactNode } from "react"

import { AUTOCOMPLETE_CHECKS } from "@/components/lab/autocomplete-checks"
import { AVATAR_CHECKS } from "@/components/lab/avatar-checks"
import { ConceptPreview } from "@/components/lab/concept-preview"

/**
 * Рабочая область — внутренняя страница для согласования дизайна.
 * Здесь живут макеты, а не registry-компоненты: пока концепт не согласован,
 * в registry/ он не попадает.
 */
export const metadata: Metadata = {
  title: "Рабочая область",
  robots: { index: false, follow: false },
}

function ConceptSection({ concept }: { concept: Concept }) {
  return (
    <section
      id={concept.id}
      className="border-shell-border scroll-mt-20 border-t pt-10 first:border-t-0 first:pt-0"
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-baseline gap-3">
          <span className="text-shell-muted font-mono text-xs tracking-widest">
            {concept.index}
          </span>
          <h2 className="text-shell-fg text-2xl font-semibold tracking-tight">
            {concept.name}
          </h2>
        </div>
        <p className="text-shell-fg max-w-2xl text-base">{concept.tagline}</p>
        <p className="text-shell-muted max-w-2xl text-sm leading-relaxed">
          {concept.thesis}
        </p>
        <p className="text-shell-muted max-w-2xl text-sm leading-relaxed">
          <span className="text-shell-fg font-medium">Риск. </span>
          {concept.risk}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ConceptPreview id={concept.id} />

        <div className="flex flex-col gap-4">
          <h3 className="text-shell-fg text-sm font-semibold tracking-tight">
            Разбор как design engineer
          </h3>
          <dl className="flex flex-col gap-4">
            {concept.review.map((row) => (
              <div key={row.label} className="flex flex-col gap-1">
                <dt className="text-shell-fg text-xs font-semibold tracking-wide uppercase">
                  {row.label}
                </dt>
                <dd className="text-shell-muted m-0 text-sm leading-relaxed">
                  {row.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function ControlsSection() {
  return (
    <section
      id="controls"
      className="border-shell-border scroll-mt-20 border-t pt-10"
    >
      <header className="flex max-w-3xl flex-col gap-3">
        <h2 className="text-shell-fg text-2xl font-semibold tracking-tight">
          Настраиваемые аргументы карточки
        </h2>
        <p className="text-shell-muted text-sm leading-relaxed">
          Кандидаты в{" "}
          <code className="font-mono text-[0.8125rem]">controls</code>. Контрол
          крутится прямо на карточке витрины и уезжает явным пропом в сниппет
          Copy for AI, поэтому лишний контрол — это лишняя строка в инструкции
          агенту. У соседей по категории их два-три: больше строка действий
          карточки не держит. Скажите номера — оставлю их.
        </p>
      </header>

      <ol className="mt-8 flex flex-col gap-3">
        {CONTROL_OPTIONS.map((option) => (
          <li
            key={option.id}
            className="border-shell-border bg-shell-panel flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:gap-5"
          >
            <div className="flex shrink-0 items-baseline gap-3 sm:w-56 sm:flex-col sm:items-start sm:gap-1">
              <span className="text-shell-muted font-mono text-xs">
                {String(option.id).padStart(2, "0")}
              </span>
              <span className="text-shell-fg font-mono text-sm">
                {option.prop}
              </span>
              <span className="text-shell-muted text-xs">{option.kind}</span>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-shell-fg m-0 text-sm font-medium">
                {option.label}
                <span className="text-shell-muted ml-2 text-xs font-normal">
                  {option.scope}
                </span>
                {option.recommended ? (
                  <span className="border-shell-border text-shell-muted ml-2 rounded-full border px-2 py-0.5 text-[0.6875rem] font-normal">
                    рекомендую
                  </span>
                ) : null}
              </p>
              <p className="text-shell-muted m-0 text-sm leading-relaxed">
                {option.note}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

/**
 * Прогон категории на нестандартных настройках: то же, что человек получит,
 * если после Copy for AI задаст компоненту свои пропы. Каждый кадр показан
 * дважды — на светлой и на тёмной подложке, потому что тему компоненты берут
 * из окружения, а не носят с собой.
 */
function CheckSection({
  id,
  title,
  note,
  checks,
}: {
  id: string
  title: string
  note: string
  checks: { name: string; title: string; notes: string[]; node: ReactNode }[]
}) {
  return (
    <section
      id={id}
      className="border-shell-border scroll-mt-20 border-t pt-10"
    >
      <header className="flex max-w-3xl flex-col gap-3">
        <h2 className="text-shell-fg text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="text-shell-muted text-sm leading-relaxed">
          Все {checks.length} компонента категории с настройками, заведомо
          отличными от дефолтных. Слева светлая подложка, справа тёмная — под
          кадром перечислено, что именно подкручено. {note}
        </p>
      </header>

      <ol className="mt-8 flex flex-col gap-4">
        {checks.map((check) => (
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
                {check.node}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function LabPage() {
  return (
    <CatalogShell locale="ru">
      <main className="mx-auto w-full max-w-[1440px] px-4 py-10 lg:px-6">
        <header className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-shell-fg text-3xl font-semibold tracking-tight">
            Рабочая область
          </h1>
          <p className="text-shell-muted text-sm leading-relaxed">
            Согласование дизайна до кода. Здесь показаны макеты, а не
            registry-компоненты:{" "}
            <code className="font-mono text-[0.8125rem]">registry/</code> не
            тронут,{" "}
            <code className="font-mono text-[0.8125rem]">accordion-001</code> в
            каталоге остался прежним. Согласованный концепт переносится в
            компонент отдельным шагом — вместе с локальной палитрой,{" "}
            <code className="font-mono text-[0.8125rem]">ai.*</code> в metadata
            и <code className="font-mono text-[0.8125rem]">controls</code>.
          </p>
          <p className="text-shell-muted text-sm leading-relaxed">
            Первый заход:{" "}
            <span className="text-shell-fg font-medium">
              accordion-001 · Native Accordion
            </span>
            . Четыре концепта, каждый строится вокруг того, что нативный{" "}
            <code className="font-mono text-[0.8125rem]">details</code> умеет, а
            аккордеон на{" "}
            <code className="font-mono text-[0.8125rem]">useState</code> — нет.
            У каждого две палитры: переключатель над кадром меняет и подложку, и
            режим самого компонента.
          </p>
          <nav className="text-shell-muted flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {ACCORDION_CONCEPTS.map((concept) => (
              <a
                key={concept.id}
                href={`#${concept.id}`}
                className="hover:text-shell-fg focus-visible:ring-shell-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {concept.index} {concept.name}
              </a>
            ))}
            <a
              href="#controls"
              className="hover:text-shell-fg focus-visible:ring-shell-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Аргументы
            </a>
            <a
              href="#avatar-check"
              className="hover:text-shell-fg focus-visible:ring-shell-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Прогон «Аватар»
            </a>
            <a
              href="#autocomplete-check"
              className="hover:text-shell-fg focus-visible:ring-shell-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Прогон «Автодополнение»
            </a>
          </nav>
        </header>

        <div className="mt-12 flex flex-col gap-12">
          {ACCORDION_CONCEPTS.map((concept) => (
            <ConceptSection key={concept.id} concept={concept} />
          ))}
          <ControlsSection />
          <CheckSection
            id="avatar-check"
            title="Прогон категории «Аватар»"
            note="Другой размер, другое состояние, свои подписи и подставленные фотографии."
            checks={AVATAR_CHECKS}
          />
          <CheckSection
            id="autocomplete-check"
            title="Прогон категории «Автодополнение»"
            note="Свои списки подсказок, чужие подписи и произвольные цвета подложки и акцента."
            checks={AUTOCOMPLETE_CHECKS}
          />
        </div>
      </main>
    </CatalogShell>
  )
}
