"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { Moon, SlidersHorizontal, Sun, X } from "lucide-react"
import { useState, type ReactNode } from "react"

import { CopyButton } from "@/components/copy-button"
import {
  defaultValues,
  toSearchParams,
  type ControlValues,
  type PreviewTheme,
} from "@/lib/controls"
import { getDictionary, type Locale } from "@/lib/i18n"
import type { ItemControl } from "@/registry/meta"

// Код компонента и панель контролов грузятся только по первому клику: пока
// витрину просто просматривают, клиентского JS компонентов на ней нет.
const ConfigurablePreview = dynamic(() =>
  import("@/components/catalog/item-configurator").then(
    (module) => module.ConfigurablePreview,
  ),
)

const ItemControls = dynamic(() =>
  import("@/components/catalog/item-configurator").then(
    (module) => module.ItemControls,
  ),
)

// Панель кода — это ещё и разметка: шапка, секции, кнопки. Витрина держит
// под тысячу карточек, поэтому пустой <dialog> у каждой стоил бы мегабайты
// HTML. Панель появляется в дереве по первому Get Code и дальше остаётся:
// иначе размонтирование съело бы анимацию закрытия.
const CodeSheet = dynamic(() =>
  import("@/components/catalog/code-sheet").then((module) => module.CodeSheet),
)

const TOGGLE =
  "border-shell-border bg-shell/70 text-shell-muted hover:text-shell-fg hover:border-shell-border-strong focus-visible:ring-shell-ring absolute top-2 z-10 inline-flex size-7 items-center justify-center rounded-md border backdrop-blur transition-colors focus-visible:ring-2 focus-visible:outline-none"

/**
 * Интерактивная часть карточки: подложка превью, настройка и подпись.
 *
 * Состояние живёт здесь, а не в отдельных переключателях, потому что его
 * нужно донести до страницы item'а — тема и значения контролов уезжают в
 * ссылку заголовка, чтобы переход не сбрасывал то, что человек настроил.
 */
export function CardInteractive({
  name,
  controls,
  full,
  locale,
  docUrl,
  itemUrl,
  title,
  categoryLabel,
  installCommand,
  children,
}: {
  name: string
  /** Контролы, а не item целиком: metadata сотен items не должна ехать в
      разметку витрины (см. lib/controls.ts). */
  controls: ItemControl[]
  full: boolean
  locale: Locale
  docUrl: string | null
  itemUrl: string
  title: string
  categoryLabel: string | null
  installCommand: string | null
  children: ReactNode
}) {
  const t = getDictionary(locale)
  const [theme, setTheme] = useState<PreviewTheme>("dark")
  const [values, setValues] = useState<ControlValues>(() =>
    defaultValues(controls),
  )
  const [open, setOpen] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [sheetMounted, setSheetMounted] = useState(false)

  const isDark = theme === "dark"
  const params = toSearchParams(controls, values)

  // Язык уезжает в ссылку вместе с настройкой: агент должен получить
  // инструкцию на том языке, на котором человек смотрел витрину.
  const docParams = new URLSearchParams(params)

  if (locale !== "ru") {
    docParams.set("lang", locale)
  }

  const docLink = docUrl
    ? docParams.toString()
      ? `${docUrl}?${docParams}`
      : docUrl
    : null

  // Тема переносится всегда, значения — только изменённые.
  const itemParams = new URLSearchParams(params)
  itemParams.set("theme", theme)

  return (
    <>
      <div
        data-preview-theme={theme}
        className={
          "border-shell-border bg-shell-panel relative flex min-h-44 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border " +
          (open ? "z-10" : "")
        }
      >
        {open ? (
          <>
            <div className="bg-preview-surface flex min-h-32 flex-1 items-center justify-center overflow-hidden p-6">
              <ConfigurablePreview
                slug={name}
                full={full}
                controls={controls}
                values={values}
              />
            </div>
            <div className="border-shell-border border-t p-3">
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
          </>
        ) : (
          children
        )}

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-pressed={isDark}
          className={`${TOGGLE} right-2`}
        >
          {isDark ? (
            <Sun className="size-3.5" aria-hidden="true" />
          ) : (
            <Moon className="size-3.5" aria-hidden="true" />
          )}
          <span className="sr-only">
            {isDark ? t.card.toLight : t.card.toDark}
          </span>
        </button>

        {controls.length > 0 ? (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className={`${TOGGLE} right-11`}
          >
            {open ? (
              <X className="size-3.5" aria-hidden="true" />
            ) : (
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {open ? t.card.closeConfigure : t.card.configure}
            </span>
          </button>
        ) : null}
      </div>

      <div className="flex flex-row items-center gap-3 px-2 py-1.5">
        <h3 className="text-shell-muted flex min-w-0 flex-1 items-center gap-1.5 truncate text-xs">
          <Link
            href={`${itemUrl}?${itemParams}`}
            className="hover:text-shell-fg truncate transition-colors focus-visible:outline-none"
            title={title}
          >
            {title}
          </Link>
        </h3>

        <div className="relative z-10 flex items-center gap-1.5">
          {categoryLabel ? (
            <span className="text-shell-muted hidden shrink-0 text-xs sm:inline">
              {categoryLabel}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setSheetMounted(true)
              setSheet(true)
            }}
            className="border-shell-border text-shell-fg hover:bg-shell-elevated hover:border-shell-border-strong focus-visible:ring-shell-ring inline-flex h-7 items-center rounded-md border px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t.card.getCode}
          </button>
          <CopyButton
            value={docLink}
            label={t.card.copy}
            copiedLabel={t.card.copied}
            className="h-7 px-3 text-xs"
          />
        </div>
      </div>

      {sheetMounted ? (
        <CodeSheet
          name={name}
          title={title}
          installCommand={installCommand}
          itemUrl={itemUrl}
          locale={locale}
          open={sheet}
          onClose={() => setSheet(false)}
        />
      ) : null}
    </>
  )
}
