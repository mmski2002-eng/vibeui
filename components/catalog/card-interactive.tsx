"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { CircleAlert, Heart, Moon, RotateCcw, Sun } from "lucide-react"
import { useEffect, useId, useRef, useState, type ReactNode } from "react"

import { CopyButton } from "@/components/copy-button"
import { SHELL_THEME_EVENT } from "@/components/catalog/theme-switch"
import {
  cardControlIcon,
  cardControlTitle,
  nextControlValue,
} from "@/lib/card-controls"
import {
  defaultValues,
  toSearchParams,
  type ControlValues,
  type PreviewSurface,
} from "@/lib/controls"
import { getDictionary, type Locale } from "@/lib/i18n"
import { itemCode } from "@/lib/item-code"
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
  "border-shell-border text-shell-muted hover:text-shell-accent hover:border-shell-border-strong hover:bg-shell-panel focus-visible:ring-shell-ring inline-flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"

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
  const code = itemCode(name)
  const [copiedCode, setCopiedCode] = useState(false)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(true)
      window.setTimeout(() => setCopiedCode(false), 1500)
    } catch {
      setCopiedCode(false)
    }
  }

  // "auto" — подложку красит CSS по теме оболочки. Так кадр правильный уже в
  // первой отрисовке: раньше карточка стартовала тёмной и перекрашивалась
  // эффектом после гидратации, и светлая страница мигала.
  const [theme, setTheme] = useState<PreviewSurface>("auto")

  // Переключение темы сайта возвращает кадр к «как у оболочки»: человек
  // сменил тему целиком, и локальный выбор в карточке больше не актуален.
  useEffect(() => {
    const onShellTheme = () => setTheme("auto")

    document.addEventListener(SHELL_THEME_EVENT, onShellTheme)
    return () => document.removeEventListener(SHELL_THEME_EVENT, onShellTheme)
  }, [])
  const [values, setValues] = useState<ControlValues>(() =>
    defaultValues(controls),
  )
  const [sheet, setSheet] = useState(false)
  const [sheetMounted, setSheetMounted] = useState(false)
  // Какая панель настройки раскрыта: одновременно открыта максимум одна.
  const [openControl, setOpenControl] = useState<string | null>(null)

  // Кадр не сжимается обратно: раскрытый аккордеон или выехавшая панель
  // поднимают карточку, и если после закрытия она падала бы назад, сетка
  // прыгала бы под курсором — вместе с соседкой по ряду. Планка держится до
  // смены ширины окна, где раскладка всё равно пересчитывается.
  // Жалоба никуда не уходит: бэкенда у витрины нет. Форма собирает текст и
  // подтверждает приём — отправку прикрутит тот, у кого появится адрес.
  const reportId = `report-${useId().replace(/:/g, "")}`
  const reportRef = useRef<HTMLDivElement>(null)
  const reportButtonRef = useRef<HTMLButtonElement>(null)
  // Панель лежит в верхнем слое, поэтому её положение считается вручную:
  // кадр карточки обрезает всё, что торчит наружу, а верхний слой — нет.
  const [reportAt, setReportAt] = useState({ top: 0, left: 0 })
  const [reportText, setReportText] = useState("")
  const [reportSent, setReportSent] = useState(false)
  const [favourite, setFavourite] = useState(false)

  const frameRef = useRef<HTMLDivElement>(null)
  const [floor, setFloor] = useState<number>()

  useEffect(() => {
    const frame = frameRef.current

    if (!frame) {
      return
    }

    const observer = new ResizeObserver(() => {
      const height = frame.getBoundingClientRect().height

      setFloor((current) =>
        current === undefined || height > current ? height : current,
      )
    })

    observer.observe(frame)

    let width = window.innerWidth

    const onResize = () => {
      if (window.innerWidth !== width) {
        width = window.innerWidth
        setFloor(undefined)
      }
    }

    window.addEventListener("resize", onResize)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", onResize)
    }
  }, [])

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

  // Тема переносится, только если её выбрали руками: "auto" — это отсутствие
  // выбора, и страница item'а решит сама по теме оболочки.
  const itemParams = new URLSearchParams(params)

  if (theme !== "auto") {
    itemParams.set("theme", theme)
  }

  return (
    <>
      <div
        ref={frameRef}
        data-preview-theme={theme}
        style={floor ? { minHeight: floor } : undefined}
        className="border-shell-border bg-shell flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border"
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

            {/* Обе иконки в разметке, видимую выбирает CSS: при "auto"
                текущая подложка известна только из атрибута на <html>, а
                читать его в рендере нельзя — сломается гидратация. */}
            <button
              type="button"
              onClick={() => {
                const shellLight =
                  document.documentElement.dataset.shellTheme === "light"

                setTheme((current) =>
                  current === "auto"
                    ? shellLight
                      ? "dark"
                      : "light"
                    : current === "dark"
                      ? "light"
                      : "dark",
                )
              }}
              className={TOGGLE}
            >
              <span data-theme-icon="sun">
                <Sun className="size-3.5" aria-hidden="true" />
                <span className="sr-only">{t.card.toLight}</span>
              </span>
              <span data-theme-icon="moon">
                <Moon className="size-3.5" aria-hidden="true" />
                <span className="sr-only">{t.card.toDark}</span>
              </span>
            </button>

            {/* Избранное пока только помечает карточку в этой вкладке:
                хранилища у витрины нет, а кнопка нужна уже сейчас. */}
            <button
              type="button"
              onClick={() => setFavourite((current) => !current)}
              aria-pressed={favourite}
              title={`${t.card.favourite} · ${t.card.favouriteSoon}`}
              className={`${TOGGLE} ${favourite ? "text-shell-fg border-shell-border-strong" : ""}`}
            >
              <Heart
                className="size-3.5"
                fill={favourite ? "currentColor" : "none"}
                aria-hidden="true"
              />
              <span className="sr-only">{t.card.favourite}</span>
            </button>

            <button
              ref={reportButtonRef}
              type="button"
              popoverTarget={reportId}
              title={t.card.report}
              className={TOGGLE}
            >
              <CircleAlert className="size-3.5" aria-hidden="true" />
              <span className="sr-only">{t.card.report}</span>
            </button>

            <div
              ref={reportRef}
              id={reportId}
              popover="auto"
              onToggle={(event) => {
                if (event.newState !== "open") {
                  return
                }

                const button = reportButtonRef.current?.getBoundingClientRect()

                if (button) {
                  setReportAt({
                    top: button.bottom + 8,
                    left: Math.max(8, button.right - 280),
                  })
                }
              }}
              style={{
                position: "fixed",
                inset: "auto",
                top: reportAt.top,
                left: reportAt.left,
                margin: 0,
              }}
              className="border-shell-border bg-shell-panel text-shell-fg w-70 rounded-xl border p-3 shadow-lg shadow-black/40"
            >
              <p className="text-shell-fg mb-2 text-xs font-medium">
                {t.card.reportTitle}
              </p>
              <textarea
                value={reportText}
                onChange={(event) => {
                  setReportText(event.target.value)
                  setReportSent(false)
                }}
                rows={3}
                placeholder={t.card.reportPlaceholder}
                className="border-shell-border bg-shell text-shell-fg placeholder:text-shell-muted focus-visible:ring-shell-ring w-full resize-none rounded-lg border px-2 py-1.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <span
                  role="status"
                  className="text-shell-muted min-w-0 truncate text-[0.6875rem]"
                >
                  {reportSent ? t.card.reportSent : ""}
                </span>
                <button
                  type="button"
                  disabled={reportText.trim() === ""}
                  onClick={() => {
                    setReportSent(true)
                    setReportText("")
                  }}
                  className="border-shell-border text-shell-fg hover:bg-shell-elevated hover:border-shell-border-strong focus-visible:ring-shell-ring inline-flex h-7 shrink-0 items-center rounded-md border px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t.card.reportSend}
                </button>
              </div>
            </div>
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

      {/* Имя слева, кнопки справа. Обрезки многоточием здесь быть не должно:
          имя item'а и есть смысл карточки — длинное переносится на вторую
          строку, а кнопки остаются на своём месте. */}
      <div className="flex flex-wrap items-start justify-between gap-2 px-2 py-1.5">
        <h3 className="text-shell-muted min-w-0 flex-1 basis-40 text-xs leading-5 break-words">
          {/* Код item'а копируется нажатием: по нему его называют в переписке
              и ищут в каталоге, где половина имён похожа друг на друга. */}
          <button
            type="button"
            onClick={copyCode}
            title={`${code} — ${t.card.copyId}`}
            className={`focus-visible:ring-shell-ring relative z-10 mr-1.5 inline-flex h-5 shrink-0 items-center rounded border px-1.5 align-[1px] font-mono text-[0.6875rem] transition-colors focus-visible:ring-2 focus-visible:outline-none ${
              copiedCode
                ? "border-shell-accent text-shell-fg"
                : "border-shell-border text-shell-muted hover:bg-shell-elevated hover:border-shell-border-strong hover:text-shell-fg"
            }`}
          >
            {code}
            <span className="sr-only" role="status">
              {copiedCode ? t.card.idCopied : ""}
            </span>
          </button>
          <Link
            href={`${itemUrl}?${itemParams}`}
            className="hover:text-shell-fg transition-colors focus-visible:outline-none"
            title={englishTitle ? `${title} (${englishTitle})` : title}
          >
            {title}
            {englishTitle ? (
              <span className="text-shell-muted/70"> ({englishTitle})</span>
            ) : null}
          </Link>
        </h3>

        <div className="relative z-10 flex shrink-0 items-center gap-1.5">
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
