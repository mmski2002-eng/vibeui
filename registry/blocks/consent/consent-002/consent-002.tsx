"use client"

import { useState, type CSSProperties } from "react"

type Consent002Category = {
  id: string
  title: string
  note: string
  required?: boolean
}

export type Consent002Props = {
  title?: string
  summary?: string
  categories?: Consent002Category[]
  saveLabel?: string
  acceptAllLabel?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Панель настройки категорий cookie: строки с переключателем на каждую
// категорию. Обязательная категория заблокирована и всегда включена.
// Тумблеры — настоящие checkbox, объявленные aria, состояние держит
// компонент. Формат окна «Настроить cookie» из бара согласия.
const STYLES = `
:where([data-vibeui-block="consent-002"]){
--vibeui-consent-002-bg:transparent;
--vibeui-consent-002-panel:light-dark(oklch(1 0 0),oklch(0.2 0 0));
--vibeui-consent-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-consent-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-consent-002-border:light-dark(oklch(0.88 0 0),oklch(0.32 0 0));
--vibeui-consent-002-track:light-dark(oklch(0.85 0 0),oklch(0.4 0 0));
--vibeui-consent-002-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-consent-002-on-accent:oklch(0.15 0.02 39.8);
--vibeui-consent-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="consent-002"]{color-scheme:dark}
[data-vibeui-block="consent-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-consent-002-bg);color:var(--vibeui-consent-002-ink);
font-family:var(--vibeui-consent-002-font);padding:1.25rem;
}
[data-vibeui-block="consent-002"] [data-part="panel"]{
max-width:34rem;margin:0 auto;
padding:1.5rem;border:1px solid var(--vibeui-consent-002-border);border-radius:1rem;
background:var(--vibeui-consent-002-panel);box-shadow:0 12px 32px -20px oklch(0 0 0 / 40%);
}
[data-vibeui-block="consent-002"] [data-part="title"]{margin:0 0 0.375rem;font-size:1.1875rem;font-weight:700}
[data-vibeui-block="consent-002"] [data-part="summary"]{margin:0 0 1.25rem;font-size:0.875rem;line-height:1.5;color:var(--vibeui-consent-002-muted)}
[data-vibeui-block="consent-002"] [data-part="list"]{list-style:none;margin:0 0 1.25rem;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="consent-002"] [data-part="row"]{
display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:start;
padding:0.875rem 0;border-bottom:1px solid var(--vibeui-consent-002-border);
}
[data-vibeui-block="consent-002"] [data-part="row"]:last-child{border-bottom:0}
[data-vibeui-block="consent-002"] [data-part="cat-title"]{margin:0;font-size:0.9375rem;font-weight:640}
[data-vibeui-block="consent-002"] [data-part="cat-note"]{margin:0.1875rem 0 0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-consent-002-muted)}
[data-vibeui-block="consent-002"] [data-part="switch"]{position:relative;display:inline-flex;flex:none;width:2.75rem;height:1.625rem;cursor:pointer}
[data-vibeui-block="consent-002"] [data-part="switch"] input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}
[data-vibeui-block="consent-002"] [data-part="switch"] input:disabled{cursor:not-allowed}
[data-vibeui-block="consent-002"] [data-part="track"]{position:absolute;inset:0;border-radius:999px;background:var(--vibeui-consent-002-track);transition:background-color .16s ease}
[data-vibeui-block="consent-002"] [data-part="track"]::after{content:"";position:absolute;left:0.1875rem;top:0.1875rem;width:1.25rem;height:1.25rem;border-radius:999px;background:oklch(1 0 0);transition:transform .16s ease}
[data-vibeui-block="consent-002"] [data-part="switch"] input:checked+[data-part="track"]{background:var(--vibeui-consent-002-accent)}
[data-vibeui-block="consent-002"] [data-part="switch"] input:checked+[data-part="track"]::after{transform:translateX(1.125rem)}
[data-vibeui-block="consent-002"] [data-part="switch"] input:focus-visible+[data-part="track"]{outline:2px solid var(--vibeui-consent-002-accent);outline-offset:2px}
[data-vibeui-block="consent-002"] [data-part="switch"] input:disabled+[data-part="track"]{opacity:.6}
[data-vibeui-block="consent-002"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:flex-end}
[data-vibeui-block="consent-002"] [data-part="btn"]{
height:2.625rem;padding:0 1.25rem;border-radius:0.75rem;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:640;
border:1px solid var(--vibeui-consent-002-border);background:transparent;color:inherit;transition:border-color .16s ease;
}
[data-vibeui-block="consent-002"] [data-part="btn"]:hover{border-color:var(--vibeui-consent-002-accent)}
[data-vibeui-block="consent-002"] [data-part="btn"]:focus-visible{outline:2px solid var(--vibeui-consent-002-accent);outline-offset:2px}
[data-vibeui-block="consent-002"] [data-part="btn"][data-variant="primary"]{border-color:transparent;background:var(--vibeui-consent-002-accent);color:var(--vibeui-consent-002-on-accent)}
@container (min-width: 40rem){[data-vibeui-block="consent-002"] [data-part="panel"]{padding:2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="consent-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CATEGORIES: Consent002Category[] = [
  { id: "necessary", title: "Необходимые", note: "Нужны для работы сайта. Отключить нельзя.", required: true },
  { id: "analytics", title: "Аналитика", note: "Помогают понять, как вы пользуетесь каталогом." },
  { id: "marketing", title: "Маркетинг", note: "Показывают релевантные предложения на других сайтах." },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/** Панель настройки категорий cookie: тумблеры-checkbox, обязательная заблокирована. */
export function Consent002({
  title = "Настройки cookie",
  summary = "Выберите, какие категории cookie разрешить. Необходимые всегда включены.",
  categories = DEFAULT_CATEGORIES,
  saveLabel = "Сохранить выбор",
  acceptAllLabel = "Принять все",
  background = "",
  accent,
  className,
  style,
}: Consent002Props) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      categories.map((category) => [category.id, category.required ?? false]),
    ),
  )
  const palette = {
    ...(accent ? { "--vibeui-consent-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-consent-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-consent-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="consent-002"
        className={className}
        style={palette}
        role="region"
        aria-label="Настройки cookie"
      >
        <div data-part="panel">
          <h2 data-part="title">{title}</h2>
          <p data-part="summary">{summary}</p>
          <ul data-part="list">
            {categories.map((category) => (
              <li key={category.id} data-part="row">
                <div>
                  <p data-part="cat-title">{category.title}</p>
                  <p data-part="cat-note">{category.note}</p>
                </div>
                <label data-part="switch">
                  <input
                    type="checkbox"
                    checked={
                      category.required
                        ? true
                        : (enabled[category.id] ?? false)
                    }
                    disabled={category.required}
                    aria-label={category.title}
                    onChange={(event) =>
                      setEnabled((prev) => ({
                        ...prev,
                        [category.id]: event.target.checked,
                      }))
                    }
                  />
                  <span data-part="track" aria-hidden="true" />
                </label>
              </li>
            ))}
          </ul>
          <div data-part="actions">
            <button data-part="btn" type="button">
              {saveLabel}
            </button>
            <button data-part="btn" data-variant="primary" type="button">
              {acceptAllLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
