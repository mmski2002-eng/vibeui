"use client"

import { useState, type CSSProperties, type FormEvent } from "react"

type Consent003Item = {
  id: string
  label: string
  required?: boolean
}

export type Consent003Props = {
  eyebrow?: string
  title?: string
  summary?: string
  items?: Consent003Item[]
  submitLabel?: string
  successNote?: string
  /** Пусто — подложки нет, форма лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Форма согласий на обработку данных: список чекбоксов, где обязательные
// помечены и блокируют отправку, пока не отмечены. Кнопка неактивна, пока
// обязательные согласия не даны. Формат GDPR-согласия перед регистрацией
// или подпиской: явные галочки вместо одной общей.
const STYLES = `
:where([data-vibeui-block="consent-003"]){
--vibeui-consent-003-bg:transparent;
--vibeui-consent-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-consent-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-consent-003-border:light-dark(oklch(0.82 0 0),oklch(0.4 0 0));
--vibeui-consent-003-req:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-consent-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-consent-003-on-accent:oklch(from var(--vibeui-consent-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-consent-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-consent-003-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="consent-003"]{color-scheme:dark}
[data-vibeui-block="consent-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-consent-003-bg);color:var(--vibeui-consent-003-ink);
font-family:var(--vibeui-consent-003-font);
}
[data-vibeui-block="consent-003"] [data-part="shell"]{max-width:36rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="consent-003"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-consent-003-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="consent-003"] [data-part="title"]{margin:0 0 0.625rem;font-size:clamp(1.5rem,4.5cqi,2rem);line-height:1.15;letter-spacing:-0.02em;font-weight:700}
[data-vibeui-block="consent-003"] [data-part="summary"]{margin:0 0 1.75rem;color:var(--vibeui-consent-003-muted);font-size:0.9375rem;line-height:1.55}
[data-vibeui-block="consent-003"] [data-part="list"]{list-style:none;margin:0 0 1.5rem;padding:0;display:grid;gap:0.875rem}
[data-vibeui-block="consent-003"] [data-part="item"]{display:grid;grid-template-columns:auto 1fr;gap:0.75rem;align-items:start}
[data-vibeui-block="consent-003"] [data-part="box"]{
appearance:none;width:1.375rem;height:1.375rem;margin:0;flex:none;cursor:pointer;position:relative;
border:1px solid var(--vibeui-consent-003-border);border-radius:0.375rem;background:transparent;
transition:background-color var(--vibeui-consent-003-dur-2) ease,border-color var(--vibeui-consent-003-dur-2) ease;
}
[data-vibeui-block="consent-003"] [data-part="box"]:checked{background:var(--vibeui-consent-003-accent);border-color:transparent;color:oklch(from var(--vibeui-consent-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="consent-003"] [data-part="box"]:checked::after{content:"";position:absolute;left:0.4375rem;top:0.1875rem;width:0.3125rem;height:0.625rem;border:solid var(--vibeui-consent-003-on-accent);border-width:0 2px 2px 0;transform:rotate(45deg)}
[data-vibeui-block="consent-003"] [data-part="box"]:focus-visible{outline:2px solid var(--vibeui-consent-003-accent);outline-offset:2px}
[data-vibeui-block="consent-003"] [data-part="label"]{font-size:0.9375rem;line-height:1.5;cursor:pointer}
[data-vibeui-block="consent-003"] [data-part="req"]{color:var(--vibeui-consent-003-req);font-weight:700}
[data-vibeui-block="consent-003"] [data-part="submit"]{
height:2.875rem;padding:0 1.5rem;border:0;border-radius:0.75rem;cursor:pointer;
background:var(--vibeui-consent-003-accent);color:oklch(from var(--vibeui-consent-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.9375rem;font-weight:650;transition:opacity var(--vibeui-consent-003-dur-2) ease;
}
[data-vibeui-block="consent-003"] [data-part="submit"]:hover:not(:disabled){opacity:.9}
[data-vibeui-block="consent-003"] [data-part="submit"]:disabled{opacity:.5;cursor:not-allowed}
[data-vibeui-block="consent-003"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-consent-003-accent);outline-offset:2px}
[data-vibeui-block="consent-003"] [data-part="success"]{
margin:0;padding:0.875rem 1rem;border-radius:0.75rem;
background:color-mix(in oklab,var(--vibeui-consent-003-accent) 12%,transparent);
color:var(--vibeui-consent-003-accent);font-size:0.9375rem;font-weight:600;
}
@container (min-width: 40rem){[data-vibeui-block="consent-003"] [data-part="shell"]{padding:4rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="consent-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Consent003Item[] = [
  {
    id: "terms",
    label:
      "Я согласен с условиями использования и политикой конфиденциальности",
    required: true,
  },
  {
    id: "data",
    label: "Разрешаю обрабатывать мои данные для работы сервиса",
    required: true,
  },
  {
    id: "news",
    label: "Хочу получать новости о новых компонентах (необязательно)",
  },
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

/** Форма согласий: чекбоксы, обязательные блокируют кнопку, пока не отмечены. */
export function Consent003({
  eyebrow = "Согласие",
  title = "Перед тем как продолжить",
  summary = "Отметьте согласия ниже. Обязательные помечены — без них продолжить нельзя.",
  items = DEFAULT_ITEMS,
  submitLabel = "Продолжить",
  successNote = "Спасибо! Согласия сохранены.",
  background = "",
  accent,
  className,
  style,
}: Consent003Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [sent, setSent] = useState(false)
  const allRequiredChecked = items
    .filter((item) => item.required)
    .every((item) => checked[item.id])

  const palette = {
    ...(accent ? { "--vibeui-consent-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-consent-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (allRequiredChecked) {
      setSent(true)
    }
  }

  return (
    <>
      <style href="vibeui-consent-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="consent-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="summary">{summary}</p>
          {sent ? (
            <p data-part="success" role="status">
              {successNote}
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <ul data-part="list">
                {items.map((item) => (
                  <li key={item.id} data-part="item">
                    <input
                      id={`consent-003-${item.id}`}
                      data-part="box"
                      type="checkbox"
                      checked={checked[item.id] ?? false}
                      required={item.required}
                      onChange={(event) =>
                        setChecked((prev) => ({
                          ...prev,
                          [item.id]: event.target.checked,
                        }))
                      }
                    />
                    <label data-part="label" htmlFor={`consent-003-${item.id}`}>
                      {item.label}
                      {item.required ? <span data-part="req"> *</span> : null}
                    </label>
                  </li>
                ))}
              </ul>
              <button
                data-part="submit"
                type="submit"
                disabled={!allRequiredChecked}
              >
                {submitLabel}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
