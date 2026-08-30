"use client"

import { useId, useState } from "react"

import { CopyButton } from "@/components/copy-button"
import { getControls, toSearchParams, type ControlValues } from "@/lib/controls"
import type { CatalogItem, ItemControl } from "@/registry/meta"
import { LAZY_PREVIEWS } from "@/registry/previews.lazy"

function initialValues(item: CatalogItem): ControlValues {
  const values: ControlValues = {}

  for (const control of getControls(item)) {
    values[control.prop] = control.default
  }

  return values
}

/**
 * Пустой цвет означает «не переопределять»: проп не передаётся вовсе, чтобы
 * компонент остался на своей палитре.
 */
function toProps(
  item: CatalogItem,
  values: ControlValues,
): Record<string, unknown> {
  const props: Record<string, unknown> = {}

  for (const control of getControls(item)) {
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
}: {
  control: ItemControl
  value: ControlValues[string]
  onChange: (next: ControlValues[string]) => void
}) {
  const id = useId()

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
            {value === "" ? "по умолчанию" : "сбросить"}
          </button>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Настройка item'а перед выдачей агенту: превью слева, контролы справа,
 * ссылка снизу. Меняются только пропсы — исходник компонента остаётся тем
 * же файлом, который раздаёт реестр (см. docs/CONTROLS.md).
 */
export function ItemConfigurator({
  item,
  docUrl,
}: {
  item: CatalogItem
  docUrl: string | null
}) {
  const [values, setValues] = useState<ControlValues>(() => initialValues(item))
  const controls = getControls(item)
  const Preview = LAZY_PREVIEWS[item.name]

  const params = toSearchParams(item, values).toString()
  const link = docUrl ? (params ? `${docUrl}?${params}` : docUrl) : null

  return (
    <div className="flex min-h-44 flex-1 flex-col">
      <div className="bg-preview-surface flex min-h-32 flex-1 items-center justify-center overflow-hidden p-6">
        {Preview ? <Preview {...toProps(item, values)} /> : null}
      </div>

      <div className="border-shell-border bg-shell-panel border-t p-3">
        <div className="grid gap-3 sm:grid-cols-2">
          {controls.map((control) => (
            <Control
              key={control.prop}
              control={control}
              value={values[control.prop]}
              onChange={(next) =>
                setValues((current) => ({ ...current, [control.prop]: next }))
              }
            />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CopyButton
            value={link}
            label="Copy for AI"
            copiedLabel="Ссылка скопирована"
            variant="primary"
            className="h-8 px-3 text-xs"
          />
          <button
            type="button"
            onClick={() => setValues(initialValues(item))}
            className="text-shell-muted hover:text-shell-fg text-xs"
          >
            Сбросить всё
          </button>
        </div>

        {link ? (
          <p className="text-shell-muted mt-3 font-mono text-[11px] break-all">
            {link}
          </p>
        ) : null}
      </div>
    </div>
  )
}
