"use client"

import { useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog014Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  rememberLabel?: string
  rememberHint?: string
  /** Строка рядом с кнопкой, когда подтверждение отключено. */
  mutedText?: string
  /** Подпись ссылки, возвращающей подтверждение. */
  resetLabel?: string
  confirm?: string
  cancel?: string
  accent?: string
  /** Подложка окна и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: подтверждение, которое можно отключить. Галочка «больше не
// спрашивать» уместна только для обратимых действий — для удаления она
// превращает защиту в одноразовую формальность. Отключение показано честно:
// сказано, где вернуть подтверждение обратно, иначе человек боится нажимать.
// Галочка выключена по умолчанию и не влияет на текущее действие: она про
// следующий раз, и подпись это проговаривает.
const STYLES = `
:where([data-vibeui-block="alertdialog-014"]){
--vibeui-alertdialog-014-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-alertdialog-014-panel:light-dark(oklch(0.97 0.003 265),oklch(0.27 0.014 265));
--vibeui-alertdialog-014-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-alertdialog-014-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-alertdialog-014-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-alertdialog-014-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-alertdialog-014-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0.03 262));
--vibeui-alertdialog-014-shadow:light-dark(oklch(0.2 0.03 265 / 55%),oklch(0.02 0.01 265 / 70%));
--vibeui-alertdialog-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alertdialog-014"]{
font-family:var(--vibeui-alertdialog-014-font);color:var(--vibeui-alertdialog-014-fg);
}
[data-vibeui-block="alertdialog-014"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-014"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-014-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-014-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-014"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-014-accent);outline-offset:2px}
[data-vibeui-block="alertdialog-014"] [data-part="state"]{
margin:0.5rem 0 0;font-size:0.6875rem;color:var(--vibeui-alertdialog-014-muted);
}
[data-vibeui-block="alertdialog-014"] [data-part="reset"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:var(--vibeui-alertdialog-014-accent);font:inherit;font-size:0.6875rem;font-weight:650;
text-decoration:underline;
}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-014"] dialog{
margin:auto;width:min(22rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-014-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-014-bg);color:var(--vibeui-alertdialog-014-fg);
box-shadow:0 24px 60px -24px var(--vibeui-alertdialog-014-shadow);
font-family:var(--vibeui-alertdialog-014-font);
}
[data-vibeui-block="alertdialog-014"] dialog::backdrop{background:light-dark(oklch(0.2 0.02 265 / 45%),oklch(0.08 0.014 265 / 62%))}
[data-vibeui-block="alertdialog-014"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-014"] [data-part="text"]{margin:0 0 0.875rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alertdialog-014-muted)}
/* Галочка про следующий раз, а не про текущее действие — так и подписана. */
[data-vibeui-block="alertdialog-014"] [data-part="remember"]{
display:flex;align-items:flex-start;gap:0.625rem;cursor:pointer;
padding:0.625rem 0.75rem;margin-bottom:0.875rem;border-radius:0.625rem;
background:var(--vibeui-alertdialog-014-panel);
}
[data-vibeui-block="alertdialog-014"] input{
appearance:none;position:relative;flex:none;cursor:pointer;margin-top:0.0625rem;
width:1.0625rem;height:1.0625rem;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-alertdialog-014-muted);background:var(--vibeui-alertdialog-014-bg);
}
[data-vibeui-block="alertdialog-014"] input:checked{
background:var(--vibeui-alertdialog-014-accent);border-color:var(--vibeui-alertdialog-014-accent);
}
[data-vibeui-block="alertdialog-014"] input:checked::after{
content:"";position:absolute;left:0.3rem;top:0.1rem;
width:0.2rem;height:0.45rem;
border:solid var(--vibeui-alertdialog-014-on-accent);border-width:0 2px 2px 0;transform:rotate(45deg);
}
[data-vibeui-block="alertdialog-014"] input:focus-visible{outline:2px solid var(--vibeui-alertdialog-014-accent);outline-offset:2px}
[data-vibeui-block="alertdialog-014"] [data-part="rlabel"]{display:flex;flex-direction:column;gap:0.125rem;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="alertdialog-014"] [data-part="rhint"]{font-size:0.75rem;font-weight:400;color:var(--vibeui-alertdialog-014-muted)}
[data-vibeui-block="alertdialog-014"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem}
[data-vibeui-block="alertdialog-014"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-014"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-014-accent);color:var(--vibeui-alertdialog-014-on-accent)}
[data-vibeui-block="alertdialog-014"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-014-border);background:var(--vibeui-alertdialog-014-bg);color:inherit;
}
[data-vibeui-block="alertdialog-014"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-014-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-014"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

/**
 * Подтверждение, которое можно отключить: галочка про следующий раз.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog014({
  triggerLabel = "Отправить блок в архив",
  title = "Отправить в архив?",
  text = "Блок исчезнет из каталога, но останется в архиве — вернуть его можно в любой момент.",
  rememberLabel = "Больше не спрашивать",
  rememberHint = "Следующие блоки уйдут в архив сразу. Подтверждение вернётся в настройках проекта.",
  mutedText = "Подтверждение отключено.",
  resetLabel = "Включить снова",
  confirm = "В архив",
  cancel = "Отменить",
  accent,
  background = "",
  className,
  style,
  ...props
}: Alertdialog014Props) {
  const box = useRef<HTMLDialogElement>(null)
  const [remember, setRemember] = useState(false)
  const [muted, setMuted] = useState(false)

  const run = () => {
    if (remember) setMuted(true)
    box.current?.close()
  }

  const palette = {
    ...(accent ? { "--vibeui-alertdialog-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alertdialog-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alertdialog-014"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => {
            if (muted) return
            setRemember(false)
            box.current?.showModal()
          }}
        >
          {triggerLabel}
        </button>

        {muted ? (
          <p data-part="state">
            {mutedText}{" "}
            <button
              type="button"
              data-part="reset"
              onClick={() => setMuted(false)}
            >
              {resetLabel}
            </button>
          </p>
        ) : null}

        <dialog ref={box} aria-labelledby="vibeui-alertdialog-014-title">
          <h2 id="vibeui-alertdialog-014-title">{title}</h2>
          <p data-part="text">{text}</p>

          <label data-part="remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            <span data-part="rlabel">
              {rememberLabel}
              <span data-part="rhint">{rememberHint}</span>
            </span>
          </label>

          <div data-part="actions">
            <button type="button" data-part="confirm" onClick={run}>
              {confirm}
            </button>
            <button
              type="button"
              data-part="cancel"
              autoFocus
              onClick={() => box.current?.close()}
            >
              {cancel}
            </button>
          </div>
        </dialog>
      </div>
    </>
  )
}
