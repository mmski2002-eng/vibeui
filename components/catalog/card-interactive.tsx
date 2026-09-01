"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { Moon, RotateCcw, Sun } from "lucide-react"
import { useState, type ReactNode } from "react"

import { CopyButton } from "@/components/copy-button"
import {
  cardControlIcon,
  cardControlTitle,
  nextControlValue,
} from "@/lib/card-controls"
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

// Панель кода — это ещё и разметка: шапка, секции, кнопки. Витрина держит
// под тысячу карточек, поэтому пустой <dialog> у каждой стоил бы мегабайты
// HTML. Панель появляется в дереве по первому Get Code и дальше остаётся:
// иначе размонтирование съело бы анимацию закрытия.
const CodeSheet = dynamic(() =>
  import("@/components/catalog/code-sheet").then((module) => module.CodeSheet),
)

const TOGGLE =
  "border-shell-border text-shell-muted hover:text-shell-fg hover:border-shell-border-strong hover:bg-shell-panel focus-visible:ring-shell-ring inline-flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"

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
  cardControls,
  full,
  locale,
  docUrl,
  itemUrl,
  title,
  englishTitle,
  previewProps,
  installCommand,
  children,
}: {
  name: string
  /** Контролы, а не item целиком: metadata сотен items не должна ехать в
      разметку витрины (см. lib/controls.ts). */
  controls: ItemControl[]
  /** Подмножество controls, вынесенное значками в шапку кадра. */
  cardControls: ItemControl[]
  full: boolean
  locale: Locale
  docUrl: string | null
  itemUrl: string
  title: string
  /** Английское имя компонента: показывается в скобках рядом с русским. */
  englishTitle: string | null
  /** Демо-содержимое превью на языке витрины. */
  previewProps?: Record<string, unknown>
  installCommand: string | null
  children: ReactNode
}) {
  const t = getDictionary(locale)
  const [theme, setTheme] = useState<PreviewTheme>("dark")
  const [values, setValues] = useState<ControlValues>(() =>
    defaultValues(controls),
  )
  const [sheet, setSheet] = useState(false)
  const [sheetMounted, setSheetMounted] = useState(false)

  const isDark = theme === "dark"
  const params = toSearchParams(controls, values)
  // Пока настройки не трогали, в кадре живёт серверная миниатюра, и JS
  // конфигуратора на витрину не едет. Первое нажатие значка переводит кадр
  // на настраиваемое превью; возврат к дефолтам возвращает миниатюру.
  const configured = params.toString() !== ""

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
        className="border-shell-border bg-shell flex min-h-44 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border"
      >
        {/* Отдельная полоса, а не наложение поверх кадра: у компонентов
            высота разная, и при переключении настройки содержимое доезжало
            до кнопок и уходило под них. Теперь кадру достаётся своя область. */}
        <div className="border-shell-border bg-shell flex shrink-0 items-center justify-between gap-2 border-b px-1.5 py-1.5">
          <div className="flex min-w-0 items-center gap-1">
            {cardControls.map((control) => {
              const value = values[control.prop]
              const Icon = cardControlIcon(control, value)
              const changed = value !== control.default

              if (control.type === "color") {
                return (
                  <span
                    key={control.prop}
                    className={`${TOGGLE} relative overflow-hidden ${changed ? "text-shell-fg border-shell-border-strong" : ""}`}
                    title={cardControlTitle(control, value)}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    <input
                      type="color"
                      value={String(value) || "#000000"}
                      aria-label={cardControlTitle(control, value)}
                      onChange={(event) => {
                        const next = event.target.value

                        setValues((current) => ({
                          ...current,
                          [control.prop]: next,
                        }))
                      }}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </span>
                )
              }

              return (
                <button
                  key={control.prop}
                  type="button"
                  // Шаг считается от текущего значения, а не от снимка: два
                  // быстрых нажатия подряд должны дать два шага, а не один.
                  onClick={() =>
                    setValues((current) => ({
                      ...current,
                      [control.prop]: nextControlValue(
                        control,
                        current[control.prop],
                      ),
                    }))
                  }
                  title={cardControlTitle(control, value)}
                  className={`${TOGGLE} ${changed ? "text-shell-fg border-shell-border-strong" : ""}`}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">
                    {cardControlTitle(control, value)}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {configured ? (
              <button
                type="button"
                onClick={() => setValues(defaultValues(controls))}
                title={t.card.reset}
                className={TOGGLE}
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span className="sr-only">{t.card.reset}</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-pressed={isDark}
              className={TOGGLE}
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
          </div>
        </div>

        {configured ? (
          <div className="bg-preview-surface flex min-h-32 flex-1 items-center justify-center overflow-hidden p-6">
            <ConfigurablePreview
              slug={name}
              full={full}
              controls={controls}
              values={values}
              previewProps={previewProps}
            />
          </div>
        ) : (
          children
        )}
      </div>

      <div className="flex flex-row items-center gap-3 px-2 py-1.5">
        <h3 className="text-shell-muted flex min-w-0 flex-1 items-center gap-1.5 truncate text-xs">
          <Link
            href={`${itemUrl}?${itemParams}`}
            className="hover:text-shell-fg truncate transition-colors focus-visible:outline-none"
            title={englishTitle ? `${title} (${englishTitle})` : title}
          >
            {title}
            {englishTitle ? (
              <span className="text-shell-muted/70"> ({englishTitle})</span>
            ) : null}
          </Link>
        </h3>

        <div className="relative z-10 flex items-center gap-1.5">
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
