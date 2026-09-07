"use client"

import { useEffect, useId, useState, type ComponentType } from "react"

import { type ControlValues } from "@/lib/controls"
import { getDictionary, type Locale } from "@/lib/i18n"
import { loadLazyPreviewMap } from "@/registry/preview-loaders-lazy"
import type { ItemKind } from "@/registry/categories"
import type { ItemControl } from "@/registry/meta"
import type { PreviewProps } from "@/registry/preview-types"

/**
 * Пустой цвет означает «не переопределять»: проп не передаётся вовсе, чтобы
 * компонент остался на своей палитре.
 */
function toProps(
  controls: ItemControl[],
  values: ControlValues,
): Record<string, unknown> {
  const props: Record<string, unknown> = {}

  for (const control of controls) {
    const value = values[control.prop]

    if (control.type === "color" && value === "") {
      continue
    }

    props[control.prop] = value
  }

  return props
}

const FIELD =
  "border-shell-border bg-shell text-shell-fg focus-visible:ring-shell-ring h-8 w-full rounded-md border px-2 text-xs focus-visible:ring-2 focus-visible:outline-none"

function Control({
  control,
  value,
  onChange,
  locale,
}: {
  control: ItemControl
  value: ControlValues[string]
  onChange: (next: ControlValues[string]) => void
  locale: Locale
}) {
  const id = useId()
  const t = getDictionary(locale)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-shell-muted text-xs">
        {control.label}
      </label>

      {control.type === "text" ? (
        <input
          id={id}
          type="text"
          value={String(value)}
          maxLength={control.maxLength}
          onChange={(event) => onChange(event.target.value)}
          className={FIELD}
        />
      ) : null}

      {control.type === "select" ? (
        <select
          id={id}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className={FIELD}
        >
          {control.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : null}

      {control.type === "number" ? (
        <input
          id={id}
          type="number"
          value={Number(value)}
          min={control.min}
          max={control.max}
          onChange={(event) => onChange(Number(event.target.value))}
          className={FIELD}
        />
      ) : null}

      {control.type === "boolean" ? (
        <input
          id={id}
          type="checkbox"
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
          className="accent-shell-fg size-4 self-start"
        />
      ) : null}

      {control.type === "color" ? (
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="color"
            value={value === "" ? "#000000" : String(value)}
            onChange={(event) => onChange(event.target.value)}
            className="border-shell-border h-8 w-12 cursor-pointer rounded-md border bg-transparent p-1"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={value === ""}
            className="text-shell-muted hover:text-shell-fg text-xs disabled:opacity-40"
          >
            {/* Та же подпись, что на карточке: пустое значение означает
                «цвет берётся из темы окружения», а не «ничего не выбрано». */}
            {t.card.themeColor}
          </button>
        </div>
      ) : null}
    </div>
  )
}

/** Живое превью с выбранными значениями. Пропсы, не исходник. */
export function ConfigurablePreview({
  slug,
  kind,
  category,
  full,
  controls,
  values,
  previewProps,
}: {
  slug: string
  kind: ItemKind
  category: string
  // Та же оговорка, что и в миниатюре: ширину объявляет сам item.
  full: boolean
  controls: ItemControl[]
  values: ControlValues
  /** Демо-содержимое витрины: под ним лежат дефолты компонента, поверх — контролы. */
  previewProps?: Record<string, unknown>
}) {
  const [Preview, setPreview] = useState<ComponentType<PreviewProps> | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false

    loadLazyPreviewMap(kind, category).then((map) => {
      if (!cancelled) {
        setPreview(() => map?.[slug] ?? null)
      }
    })

    return () => {
      cancelled = true
    }
  }, [category, kind, slug])

  if (!Preview) {
    return null
  }

  return (
    // Демо-ссылки компонентов ведут в "#": без перехвата клик по превью
    // прокручивает страницу к началу и меняет адрес.
    <div
      className={full ? "w-full max-w-[30rem]" : undefined}
      onClick={(event) => {
        const link = (event.target as HTMLElement).closest("a")
        const href = link?.getAttribute("href")

        if (link && (href == null || href === "" || href.startsWith("#"))) {
          event.preventDefault()
        }
      }}
    >
      <Preview {...previewProps} {...toProps(controls, values)} />
    </div>
  )
}

/**
 * Панель контролов. Состояние держит вызывающий: одни и те же значения
 * нужны и превью, и ссылке, и переносу на страницу item'а.
 */
export function ItemControls({
  controls,
  values,
  onChange,
  locale,
}: {
  controls: ItemControl[]
  values: ControlValues
  onChange: (next: ControlValues) => void
  locale: Locale
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {controls.map((control) => (
        <Control
          key={control.prop}
          control={control}
          value={values[control.prop]}
          onChange={(next) => onChange({ ...values, [control.prop]: next })}
          locale={locale}
        />
      ))}
    </div>
  )
}
