"use client"

import { Children, useState, type ReactNode } from "react"

import type { CatalogSlots } from "@/registry/meta"

type Density = CatalogSlots["density"]
type Need = NonNullable<CatalogSlots["needs"]>[number]

export type SlotFacet = {
  density?: Density
  needs: Need[]
}

/**
 * Фильтр каталога по форме контента — недостающая ось входа: человек с
 * идеей отбирает блоки по плотности текста и по тому, нужны ли фото/видео/
 * форма, а не по чужой истории в превью. Карточки приходят готовыми
 * серверными элементами (SSG сохраняется), клиент лишь прячет несовпавшие.
 */
export function FilterableGrid({
  facets,
  single,
  lead,
  densityLabel,
  needsLabel,
  densityText,
  needsText,
  children,
}: {
  facets: SlotFacet[]
  single: boolean
  lead: string
  densityLabel: string
  needsLabel: string
  densityText: Record<Density, string>
  needsText: Record<Need, string>
  children: ReactNode
}) {
  const [density, setDensity] = useState<Density | null>(null)
  const [need, setNeed] = useState<Need | null>(null)

  const cards = Children.toArray(children)

  // Показываем только те опции, что реально есть у блоков категории: пустой
  // фильтр, ничего не отбирающий, вводит в заблуждение.
  const densities = (["light", "medium", "heavy"] as Density[]).filter((d) =>
    facets.some((f) => f.density === d),
  )
  const needs = (["photo", "video", "logo", "avatar", "form"] as Need[]).filter(
    (n) => facets.some((f) => f.needs.includes(n)),
  )

  const chip =
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors border-shell-border text-shell-muted hover:border-shell-accent-line hover:text-shell-fg data-[on=true]:border-shell-accent data-[on=true]:bg-shell-accent data-[on=true]:text-shell-accent-fg"

  return (
    <>
      {densities.length > 1 || needs.length > 0 ? (
        <div className="border-shell-border bg-shell-panel mb-6 rounded-xl border p-3 sm:p-4">
          <p className="text-shell-muted mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h12l-4.5 5.5V13L6.5 11V8.5L2 3Z" />
            </svg>
            {lead}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {densities.length > 1 ? (
              <>
                <span className="text-shell-muted text-xs">
                  {densityLabel}:
                </span>
                {densities.map((d) => (
                  <button
                    key={d}
                    type="button"
                    data-on={density === d}
                    className={chip}
                    onClick={() => setDensity(density === d ? null : d)}
                  >
                    {densityText[d]}
                  </button>
                ))}
              </>
            ) : null}
            {needs.length > 0 ? (
              <>
                <span className="text-shell-muted ml-2 text-xs">
                  {needsLabel}:
                </span>
                {needs.map((n) => (
                  <button
                    key={n}
                    type="button"
                    data-on={need === n}
                    className={chip}
                    onClick={() => setNeed(need === n ? null : n)}
                  >
                    {needsText[n]}
                  </button>
                ))}
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="@container/grid">
        <ul className="catalog-grid" data-single={single ? "" : undefined}>
          {cards.map((card, index) => {
            const facet = facets[index]
            const hide =
              (density !== null && facet?.density !== density) ||
              (need !== null && !facet?.needs.includes(need))

            return (
              <li key={index} hidden={hide || undefined}>
                {card}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
