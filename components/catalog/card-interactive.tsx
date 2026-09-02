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
import type { ItemKind } from "@/registry/categories"
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
  kind,
  category,
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
  kind: ItemKind
  category: string
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
  // Какая панель настройки раскрыта: одновременно открыта максимум одна.
  const [openControl, setOpenControl] = useState<string | null>(null)

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

              // Текст и цвет не крутятся кнопкой: у них выезжает панель, и
              // первой строкой в ней стоит название настройки — по одному
              // значку в ряду из пяти не понять, что именно меняешь.
              if (control.type === "text" || control.type === "color") {
                const open = openControl === control.prop

                return (
                  // Панель закрывается и по Escape, и по уходу фокуса —
                  // иначе она остаётся висеть над соседней карточкой.
                  <span
                    key={control.prop}
                    className="relative"
                    onBlur={(event) => {
                      if (
                        !event.currentTarget.contains(
                          event.relatedTarget as Node | null,
                        )
                      ) {
                        setOpenControl(null)
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setOpenControl(null)
                      }
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenControl(open ? null : control.prop)}
                      aria-expanded={open}
                      title={cardControlTitle(control, value)}
                      className={`${TOGGLE} ${changed || open ? "text-shell-fg border-shell-border-strong" : ""}`}
                    >
                      {control.type === "color" && changed ? (
                        <span
                          aria-hidden="true"
                          style={{ background: String(value) }}
                          className="border-shell-border size-3.5 rounded-full border"
                        />
                      ) : (
                        <Icon className="size-3.5" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {cardControlTitle(control, value)}
                      </span>
                    </button>
                    {open ? (
                      <span className="border-shell-border bg-shell-panel absolute top-full left-0 z-20 mt-1 flex w-56 max-w-[calc(100vw-2rem)] flex-col gap-1.5 rounded-md border p-2 shadow-lg shadow-black/20">
                        <span className="text-shell-muted text-[0.6875rem]">
                          {control.label}
                        </span>
                        {control.type === "text" ? (
                          <input
                            type="text"
                            autoFocus
                            value={String(value ?? "")}
                            maxLength={control.maxLength}
                            aria-label={control.label}
                            onChange={(event) => {
                              const next = event.target.value

                              setValues((current) => ({
                                ...current,
                                [control.prop]: next,
                              }))
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                setOpenControl(null)
                              }
                            }}
                            className="border-shell-border bg-shell text-shell-fg focus-visible:ring-shell-ring rounded border px-1.5 py-1 text-xs focus-visible:ring-2 focus-visible:outline-none"
                          />
                        ) : (
                          <>
                            <input
                              type="color"
                              autoFocus
                              value={String(value) || "#111827"}
                              aria-label={control.label}
                              onChange={(event) => {
                                const next = event.target.value

                                setValues((current) => ({
                                  ...current,
                                  [control.prop]: next,
                                }))
                              }}
                              className="border-shell-border bg-shell h-7 w-full cursor-pointer rounded border"
                            />
                            {/* Пустое значение цветом не выбрать: вернуть
                                компонент к цвету окружения можно только
                                отдельной кнопкой. */}
                            <button
                              type="button"
                              onClick={() =>
                                setValues((current) => ({
                                  ...current,
                                  [control.prop]: control.default,
                                }))
                              }
                              disabled={!changed}
                              className="border-shell-border text-shell-muted hover:text-shell-fg hover:border-shell-border-strong focus-visible:ring-shell-ring rounded border px-1.5 py-1 text-[0.6875rem] transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40"
                            >
                              {t.card.themeColor}
                            </button>
                          </>
                        )}
                      </span>
                    ) : null}
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
              kind={kind}
              category={category}
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

      {/* На узком экране подпись уходит на свою строку: рядом с двумя
          кнопками действий от неё оставалось «Карточ…», и понять, что за
          компонент, было нельзя. */}
      <div className="flex flex-col gap-1.5 px-2 py-1.5 sm:flex-row sm:items-center sm:gap-3">
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
