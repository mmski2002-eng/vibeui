"use client"

import { useState } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"
import type { CSSProperties, FormEvent } from "react"

export type Subscribe006Props = {
  eyebrow?: string
  title?: string
  lead?: string
  emailLabel?: string
  buttonLabel?: string
  note?: string
  success?: string
  /** Пусто — фона вокруг карточки нет, она лежит прямо на странице. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Тёмная карточка подписки с оранжевым градиент-свечением. Карточка нарочно
// не следует теме страницы: собственная тёмная подложка выделяет подписку
// на любом фоне, а свечение из угла даёт бренду появиться без единой
// картинки. Внутри карточки принудительный color-scheme: dark — иначе
// нативные поля на светлой странице остались бы светлыми и разорвали
// картинку. Бэкенда нет: submit гасится заглушкой со строкой успеха.
const STYLES = `
:where([data-vibeui-block="subscribe-006"]){
--vibeui-subscribe-006-bg:transparent;
--vibeui-subscribe-006-card:oklch(0.19 0 0);
--vibeui-subscribe-006-ink:oklch(0.95 0 0);
--vibeui-subscribe-006-muted:oklch(0.95 0 0 / 62%);
--vibeui-subscribe-006-border:oklch(1 0 0 / 14%);
--vibeui-subscribe-006-field:oklch(1 0 0 / 8%);
--vibeui-subscribe-006-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-subscribe-006-on-accent:oklch(from var(--vibeui-subscribe-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-006-ok:oklch(0.76 0.14 150);
--vibeui-subscribe-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-subscribe-006-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-006"]{color-scheme:dark}
[data-vibeui-block="subscribe-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-subscribe-006-bg);
font-family:var(--vibeui-subscribe-006-font);
}
[data-vibeui-block="subscribe-006"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-006"] [data-part="heading"]{margin-bottom:0.625rem}
[data-vibeui-block="subscribe-006"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:2.5rem 1.25rem;
display:flex;justify-content:center;
}
[data-vibeui-block="subscribe-006"] [data-part="card"]{
/* Осознанно своя тёмная подложка: карточка не следует теме страницы.
   color-scheme:dark внутри — чтобы нативные поля темнели вместе с ней. */
color-scheme:dark;
width:100%;max-width:26rem;min-inline-size:0;
padding:2rem 1.75rem;border-radius:1.25rem;
border:1px solid var(--vibeui-subscribe-006-border);
background:
radial-gradient(120% 90% at 88% -12%,color-mix(in oklab,var(--vibeui-subscribe-006-accent) 32%,transparent),transparent 58%),
radial-gradient(80% 60% at -10% 110%,color-mix(in oklab,var(--vibeui-subscribe-006-accent) 12%,transparent),transparent 55%),
var(--vibeui-subscribe-006-card);
color:var(--vibeui-subscribe-006-ink);
}
[data-vibeui-block="subscribe-006"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.375rem;margin:0 0 1rem;
padding:0.25rem 0.625rem;border-radius:999px;
border:1px solid color-mix(in oklab,var(--vibeui-subscribe-006-accent) 45%,transparent);
color:var(--vibeui-subscribe-006-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="subscribe-006"] [data-part="form"]{
display:flex;flex-direction:column;gap:0.625rem;
}
/* Поле input-001 растягивается на остаток строки, кнопка — button-001. */
[data-vibeui-block="subscribe-006"] [data-part="form"] > [data-vibeui-block="input-001"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="subscribe-006"] [data-part="form"] > [data-vibeui-block="button-001"]{align-self:center}
[data-vibeui-block="subscribe-006"] [data-part="visually-hidden"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0;
}
[data-vibeui-block="subscribe-006"] [data-part="done"]{
margin:0;min-height:2.75rem;display:flex;align-items:center;gap:0.5rem;
color:var(--vibeui-subscribe-006-ok);font-size:0.9375rem;font-weight:600;
}
[data-vibeui-block="subscribe-006"] [data-part="done"]::before{content:"✓";font-weight:700}
[data-vibeui-block="subscribe-006"] [data-part="footnote"]{
margin:0.875rem 0 0;color:var(--vibeui-subscribe-006-muted);font-size:0.75rem;
}
@container (min-width: 48rem){
[data-vibeui-block="subscribe-006"] [data-part="shell"]{padding:3.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-006"] *{animation:none!important;transition:none!important}}
`

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

/** Компактная тёмная карточка подписки с оранжевым градиент-свечением. */
export function Subscribe006({
  eyebrow = "Рассылка",
  title = "Письма, после которых открывают редактор",
  lead = "Раз в неделю: новые блоки VibeUI, приём вёрстки и одна готовая идея для лендинга. Коротко, по делу, с кодом.",
  emailLabel = "Электронная почта",
  buttonLabel = "Подписаться",
  note = "Без спама. Отписка в один клик в любом письме.",
  success = "Готово! Письмо-подтверждение уже в ящике.",
  background = "",
  accent,
  className,
  style,
}: Subscribe006Props) {
  const [done, setDone] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-subscribe-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-subscribe-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-subscribe-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="subscribe-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <p data-part="badge">{eyebrow}</p>
            <Heading001
              data-part="heading"
              title={title}
              size="sm"
              accent={accent}
              lede={lead}
            />
            <div aria-live="polite">
              {done ? (
                <p data-part="done">{success}</p>
              ) : (
                <form data-part="form" onSubmit={handleSubmit}>
                  <Input001
                    type="email"
                    name="email"
                    required
                    label={emailLabel}
                    autoComplete="email"
                    accent={accent}
                  />
                  <Button001 type="submit" size="lg" accent={accent}>
                    {buttonLabel}
                  </Button001>
                </form>
              )}
            </div>
            <p data-part="footnote">{note}</p>
          </div>
        </div>
      </section>
    </>
  )
}
