"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth015Code = {
  value: string
  used?: boolean
}

export type Auth015Props = {
  title?: string
  lead?: string
  codes?: Auth015Code[]
  confirm?: string
  submit?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: экран резервных кодов двухфакторки. Его показывают ровно один
// раз, поэтому вся работа интерфейса — заставить человека действительно
// сохранить коды, а не закрыть вкладку. Отсюда обязательная галочка перед
// кнопкой «Готово» и три способа унести коды рядом: копировать, скачать,
// распечатать. Использованные коды не исчезают, а зачёркиваются: пропавшая
// строка выглядит как ошибка выдачи, зачёркнутая — как расход. Коды набраны
// моноширинным шрифтом и разбиты дефисом: так их переписывают с экрана
// на бумагу без ошибок в похожих знаках.
//
// Демонстрация интерфейса: коды выдаёт и сжигает сервер, здесь они просто текст.
const STYLES = `
:where([data-vibeui-block="auth-015"]){
--vibeui-auth-015-bg:oklch(0.96 0.005 265);
--vibeui-auth-015-card:oklch(1 0 0);
--vibeui-auth-015-fg:oklch(0.22 0.014 265);
--vibeui-auth-015-muted:oklch(0.54 0.014 265);
--vibeui-auth-015-border:oklch(0.9 0.006 265);
--vibeui-auth-015-accent:oklch(0.5 0.16 255);
--vibeui-auth-015-warn:oklch(0.58 0.16 55);
--vibeui-auth-015-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-auth-015-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="auth-015"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-015-bg);color:var(--vibeui-auth-015-fg);
font-family:var(--vibeui-auth-015-sans);
}
[data-vibeui-block="auth-015"] *{box-sizing:border-box}
[data-vibeui-block="auth-015"] [data-part="shell"]{
width:100%;max-width:26rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-015-card);
border:1px solid var(--vibeui-auth-015-border);border-radius:1rem;
}
[data-vibeui-block="auth-015"] [data-part="grid"]{display:grid;grid-template-columns:1fr 1fr;gap:0.375rem}
@container (min-width: 44rem){
[data-vibeui-block="auth-015"] [data-part="shell"]{max-width:34rem;padding:2rem}
[data-vibeui-block="auth-015"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}
[data-vibeui-block="auth-015"] [data-part="actions"]{grid-template-columns:repeat(3,1fr)}
}
[data-vibeui-block="auth-015"] h2{margin:0 0 0.375rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-015"] [data-part="lead"]{margin:0 0 1rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-015-muted)}
[data-vibeui-block="auth-015"] [data-part="warn"]{
display:flex;gap:0.5rem;margin:0 0 1rem;padding:0.6875rem 0.8125rem;
border:1px solid oklch(0.58 0.16 55 / 30%);border-radius:0.625rem;
background:oklch(0.58 0.16 55 / 9%);
color:var(--vibeui-auth-015-warn);font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="auth-015"] [data-part="grid"]{
list-style:none;margin:0 0 0.875rem;padding:0.75rem;
border:1px dashed var(--vibeui-auth-015-border);border-radius:0.75rem;
background:oklch(0.55 0.02 265 / 4%);
}
[data-vibeui-block="auth-015"] [data-part="code"]{
font-family:var(--vibeui-auth-015-mono);font-size:0.8125rem;font-weight:650;
letter-spacing:0.03em;text-align:center;padding:0.3125rem 0;border-radius:0.375rem;
background:var(--vibeui-auth-015-card);
}
[data-vibeui-block="auth-015"] [data-part="code"][data-used="true"]{
color:var(--vibeui-auth-015-muted);text-decoration:line-through;background:none;
}
[data-vibeui-block="auth-015"] [data-part="actions"]{display:grid;grid-template-columns:1fr;gap:0.5rem;margin-bottom:1rem}
[data-vibeui-block="auth-015"] [data-part="action"]{
appearance:none;cursor:pointer;height:2.375rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-015-border);border-radius:0.625rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="auth-015"] [data-part="action"]:hover{border-color:var(--vibeui-auth-015-accent);color:var(--vibeui-auth-015-accent)}
[data-vibeui-block="auth-015"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-auth-015-accent);outline-offset:2px}
[data-vibeui-block="auth-015"] [data-part="confirm"]{display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.875rem;font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="auth-015"] [data-part="confirm"] input{flex:none;width:1.0625rem;height:1.0625rem;margin-top:0.0625rem;accent-color:var(--vibeui-auth-015-accent)}
[data-vibeui-block="auth-015"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.625rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-015-accent);color:oklch(1 0 0);
font:inherit;font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="auth-015"] [data-part="submit"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="auth-015"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-015-accent);outline-offset:2px}
[data-vibeui-block="auth-015"] [data-part="left"]{margin:0.75rem 0 0;font-size:0.75rem;color:var(--vibeui-auth-015-muted);text-align:center}
[data-vibeui-block="auth-015"] [data-part="hidden"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CODES: Auth015Code[] = [
  { value: "4TQK-91MD", used: true },
  { value: "8HRB-20XN" },
  { value: "5PVC-73LW" },
  { value: "1KZE-64QT", used: true },
  { value: "9JMA-38RD" },
  { value: "6XSU-52NH" },
  { value: "3BWY-17FG" },
  { value: "7NQL-46VK" },
  { value: "2CDR-85JP" },
  { value: "0GTM-93AZ" },
]

/**
 * Резервные коды двухфакторки: сетка кодов, три способа их унести
 * и обязательное подтверждение сохранения. Один файл, ноль зависимостей.
 */
export function Auth015({
  title = "Резервные коды",
  lead = "Каждый код срабатывает один раз и заменяет код из приложения. Экран показывается только сейчас.",
  codes = DEFAULT_CODES,
  confirm = "Я сохранил коды в надёжном месте",
  submit = "Готово",
  accent,
  className,
  style,
}: Auth015Props) {
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const left = codes.filter((code) => !code.used).length

  const palette = {
    ...(accent ? { "--vibeui-auth-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-015"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <p data-part="warn">
            <span aria-hidden="true">!</span>
            <span>
              Не храните коды в том же менеджере паролей, где лежит пароль от
              этого аккаунта: одна утечка тогда открывает оба фактора.
            </span>
          </p>

          <ul data-part="grid">
            {codes.map((code) => (
              <li
                key={code.value}
                data-part="code"
                data-used={code.used || undefined}
              >
                {code.value}
                {code.used ? (
                  <span data-part="hidden"> (использован)</span>
                ) : null}
              </li>
            ))}
          </ul>

          <div data-part="actions">
            <button
              type="button"
              data-part="action"
              onClick={() => setCopied(true)}
            >
              {copied ? "Скопировано" : "Копировать все"}
            </button>
            <button type="button" data-part="action">
              Скачать файлом
            </button>
            <button type="button" data-part="action">
              Распечатать
            </button>
          </div>

          <label data-part="confirm">
            <input
              type="checkbox"
              checked={saved}
              onChange={(event) => setSaved(event.target.checked)}
            />
            <span>{confirm}</span>
          </label>

          <button type="button" data-part="submit" disabled={!saved}>
            {submit}
          </button>

          <p data-part="left" role="status">
            Осталось неиспользованных кодов: {left} из {codes.length}
          </p>
        </div>
      </section>
    </>
  )
}
