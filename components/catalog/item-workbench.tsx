"use client"

import { useState } from "react"

import { BlockPreview } from "@/components/block-preview"
import {
  ConfigurablePreview,
  ItemControls,
} from "@/components/catalog/item-configurator"
import { CopyButton } from "@/components/copy-button"
import {
  defaultValues,
  getControls,
  toSearchParams,
  type ControlValues,
  type PreviewTheme,
} from "@/lib/controls"
import { getDictionary, type Locale } from "@/lib/i18n"
import type { CatalogItem } from "@/registry/meta"

/**
 * Превью и выдача на странице item'а. Состояние — подложка и значения
 * контролов — приходит с витрины через query и живёт здесь: обе секции
 * должны показывать одну и ту же настройку, и она же уезжает в ссылку.
 */
export function ItemWorkbench({
  item,
  locale,
  docUrl,
  fullPrompt,
  compact,
  initialTheme,
  initialValues,
}: {
  item: CatalogItem
  locale: Locale
  docUrl: string | null
  fullPrompt: string
  compact: boolean
  initialTheme: PreviewTheme
  initialValues: ControlValues
}) {
  const t = getDictionary(locale)
  const [theme, setTheme] = useState<PreviewTheme>(initialTheme)
  const [values, setValues] = useState<ControlValues>(initialValues)
  const controls = getControls(item)

  const params = toSearchParams(controls, values)

  if (locale !== "ru") {
    params.set("lang", locale)
  }

  const link = docUrl
    ? params.toString()
      ? `${docUrl}?${params}`
      : docUrl
    : null

  return (
    <>
      <section aria-labelledby="preview-heading" className="mb-12">
        <h2
          id="preview-heading"
          className="text-shell-fg mb-4 text-lg font-medium"
        >
          {t.item.preview}
        </h2>
        <BlockPreview
          locale={locale}
          slug={item.name}
          compact={compact}
          theme={theme}
          onThemeChange={setTheme}
        />
      </section>

      <section
        aria-labelledby="use-heading"
        data-preview-theme={theme}
        className="bg-shell-panel border-shell-border-strong mb-10 rounded-xl border p-5 sm:p-6"
      >
        <h2 id="use-heading" className="text-shell-fg text-xl font-medium">
          {t.item.use}
        </h2>

        <ol className="text-shell-muted mt-4 max-w-2xl space-y-1.5 text-sm">
          {t.item.steps.map((step, index) => (
            <li key={step}>
              {index + 1}. {step}
            </li>
          ))}
        </ol>

        {link ? (
          <p className="text-shell-muted bg-shell-elevated border-shell-border mt-4 max-w-2xl rounded-lg border px-3 py-2 font-mono text-xs break-all">
            {t.item.example} {link}
          </p>
        ) : null}

        {controls.length > 0 ? (
          // Настройка меняет пропсы и ссылку, но не исходник: установленный
          // файл обязан остаться тем же (см. docs/CONTROLS.md).
          <div className="border-shell-border bg-shell mt-5 overflow-hidden rounded-xl border">
            <div className="bg-preview-surface flex min-h-32 items-center justify-center p-6">
              <ConfigurablePreview
                slug={item.name}
                full={item.meta?.preview?.width === "full"}
                controls={controls}
                values={values}
                previewProps={item.meta?.preview?.props}
              />
            </div>
            <div className="border-shell-border border-t p-4">
              <ItemControls
                controls={controls}
                values={values}
                onChange={setValues}
                locale={locale}
              />
              <button
                type="button"
                onClick={() => setValues(defaultValues(controls))}
                className="text-shell-muted hover:text-shell-fg mt-3 text-xs"
              >
                {t.card.reset}
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-5">
          <CopyButton
            value={link}
            label={t.card.copy}
            copiedLabel={t.card.copied}
            variant="primary"
            className="h-11 px-5"
          />
        </div>

        {/* Запасной путь: если агент не может открыть ссылку, инструкцию
            копируют целиком. */}
        <details
          id="ai-prompt"
          className="border-shell-border mt-6 scroll-mt-20 border-t pt-5"
        >
          <summary className="text-shell-muted hover:text-shell-fg cursor-pointer text-sm select-none marker:content-none [&::-webkit-details-marker]:hidden">
            {t.item.showFull}
          </summary>
          <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty">
            {t.item.fullNote}
          </p>
          <div className="mt-3">
            <CopyButton value={fullPrompt} label={t.item.copyFull} />
          </div>
          <pre className="bg-shell-elevated border-shell-border text-shell-fg mt-3 max-h-96 overflow-auto rounded-lg border p-4 text-xs leading-relaxed whitespace-pre-wrap">
            {fullPrompt}
          </pre>
        </details>
      </section>
    </>
  )
}
