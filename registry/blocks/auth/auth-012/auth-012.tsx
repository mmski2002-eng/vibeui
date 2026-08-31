"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth012Props = {
  title?: string
  email?: string
  submit?: string
  length?: number
  attempts?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: подтверждение адреса кодом одним полем, а не шестью клетками.
// Клетки красивы, но ломают автозаполнение на части браузеров, мешают
// выделить код целиком и не переживают ввод с физической клавиатуры на
// планшете. Здесь одно поле с широким межбуквенным интервалом: код
// вставляется, выделяется и правится как обычный текст, а нецифры отсекаются
// на вводе. Число оставшихся попыток показано сразу: молчаливая блокировка
// после третьей ошибки читается как поломка сервиса.
//
// Демонстрация интерфейса: код не проверяется, лимит попыток нужен на сервере.
const STYLES = `
:where([data-vibeui-block="auth-012"]){
--vibeui-auth-012-bg:oklch(0.96 0.01 200);
--vibeui-auth-012-card:oklch(1 0 0);
--vibeui-auth-012-fg:oklch(0.22 0.014 220);
--vibeui-auth-012-muted:oklch(0.54 0.014 220);
--vibeui-auth-012-border:oklch(0.89 0.008 220);
--vibeui-auth-012-accent:oklch(0.55 0.14 220);
--vibeui-auth-012-warn:oklch(0.6 0.16 45);
--vibeui-auth-012-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-auth-012-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="auth-012"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-012-bg);color:var(--vibeui-auth-012-fg);
font-family:var(--vibeui-auth-012-sans);
}
[data-vibeui-block="auth-012"] *{box-sizing:border-box}
[data-vibeui-block="auth-012"] [data-part="shell"]{
width:100%;max-width:23rem;margin:0 auto;padding:1.75rem 1.5rem;
background:var(--vibeui-auth-012-card);
border:1px solid var(--vibeui-auth-012-border);border-radius:1.125rem;
text-align:center;
}
@container (min-width: 40rem){
[data-vibeui-block="auth-012"] [data-part="shell"]{max-width:25rem;padding:2.25rem 2rem}
[data-vibeui-block="auth-012"] [data-part="code"]{height:3.5rem;font-size:1.5rem}
}
[data-vibeui-block="auth-012"] [data-part="glyph"]{
display:inline-flex;align-items:center;justify-content:center;
width:3rem;height:3rem;margin-bottom:0.875rem;border-radius:0.875rem;
background:oklch(0.55 0.14 220 / 12%);color:var(--vibeui-auth-012-accent);
font-size:1.375rem;line-height:1;
}
[data-vibeui-block="auth-012"] h2{margin:0 0 0.375rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-012"] [data-part="lead"]{margin:0 0 1.25rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-012-muted)}
[data-vibeui-block="auth-012"] [data-part="mail"]{font-weight:650;color:var(--vibeui-auth-012-fg);word-break:break-all}
[data-vibeui-block="auth-012"] [data-part="code"]{
width:100%;height:3rem;padding:0 0.5rem;
border:1px solid var(--vibeui-auth-012-border);border-radius:0.75rem;
background:var(--vibeui-auth-012-card);color:inherit;
font-family:var(--vibeui-auth-012-mono);font-size:1.25rem;font-weight:700;
letter-spacing:0.45em;text-align:center;text-indent:0.45em;
}
[data-vibeui-block="auth-012"] [data-part="code"]:focus-visible{outline:2px solid var(--vibeui-auth-012-accent);outline-offset:2px;border-color:var(--vibeui-auth-012-accent)}
[data-vibeui-block="auth-012"] [data-part="attempts"]{
margin:0.625rem 0 1rem;font-size:0.75rem;line-height:1.4;color:var(--vibeui-auth-012-muted);
}
[data-vibeui-block="auth-012"] [data-part="attempts"][data-low="true"]{color:var(--vibeui-auth-012-warn);font-weight:600}
[data-vibeui-block="auth-012"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.75rem;
border:0;border-radius:0.75rem;
background:var(--vibeui-auth-012-accent);color:oklch(1 0 0);
font:inherit;font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="auth-012"] [data-part="submit"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="auth-012"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-012-accent);outline-offset:2px}
[data-vibeui-block="auth-012"] [data-part="links"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.25rem 1rem;
margin-top:1rem;font-size:0.8125rem;
}
[data-vibeui-block="auth-012"] [data-part="links"] button{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:var(--vibeui-auth-012-accent);font:inherit;font-weight:600;text-decoration:underline;
}
[data-vibeui-block="auth-012"] [data-part="links"] button:focus-visible{outline:2px solid var(--vibeui-auth-012-accent);outline-offset:2px;border-radius:0.25rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-012"] *{animation:none!important;transition:none!important}}
`

/**
 * Подтверждение почты кодом: одно поле с разрядкой вместо клеток
 * и счётчик оставшихся попыток. Один файл, ноль зависимостей.
 */
export function Auth012({
  title = "Подтвердите почту",
  email = "anna@vibeui.ru",
  submit = "Подтвердить",
  length = 6,
  attempts = 3,
  accent,
  className,
  style,
}: Auth012Props) {
  const [code, setCode] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-auth-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-012"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <span data-part="glyph" aria-hidden="true">
            ✉
          </span>
          <h2>{title}</h2>
          <p data-part="lead">
            Код из {length} цифр отправлен на{" "}
            <span data-part="mail">{email}</span>. Он действует 10 минут.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <input
              data-part="code"
              name="one-time-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={length}
              aria-label={`Код подтверждения из ${length} цифр`}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, length))
              }
            />
            <p data-part="attempts" data-low={attempts <= 1} role="status">
              Осталось попыток: {attempts}. После этого код придётся запросить
              заново.
            </p>
            <button
              type="submit"
              data-part="submit"
              disabled={code.length < length}
            >
              {submit}
            </button>
          </form>

          <p data-part="links">
            <button type="button">Отправить код ещё раз</button>
            <button type="button">Изменить адрес</button>
          </p>
        </div>
      </section>
    </>
  )
}
