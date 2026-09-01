"use client"

import { useId, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Input024Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: string
  domains?: string[]
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: почта с догадкой опечатки в домене уже есть (input-006) —
// там сравнение с уже введённым доменом. Здесь другая задача — дописать
// домен, который ещё не введён целиком: как только после @ набрано начало
// популярного домена, серым текстом за курсором показывается остаток, а Tab
// его подтверждает вместо перехода к следующему пою. Остаток — не отдельный
// текст рядом, а буквальное продолжение того же слова, поэтому под вводом
// лежит невидимый двойник с тем же шрифтом: реальный текст в нём скрыт, а
// подсказанный хвост показан — так буквы совпадают по ширине без замеров.
const STYLES = `
:where([data-vibeui-block="input-024"]){
--vibeui-input-024-surface:oklch(1 0 0);
--vibeui-input-024-shell:oklch(0.91 0.006 265);
--vibeui-input-024-fg:oklch(0.23 0.014 265);
--vibeui-input-024-muted:oklch(0.56 0.014 265);
--vibeui-input-024-field:oklch(0.985 0.002 265);
--vibeui-input-024-border:oklch(0.88 0.008 265);
--vibeui-input-024-accent:oklch(0.55 0.17 265);
--vibeui-input-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-024"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-024-surface);
border:1px solid var(--vibeui-input-024-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-024-font);color:var(--vibeui-input-024-fg);
}
[data-vibeui-block="input-024"] *{box-sizing:border-box}
[data-vibeui-block="input-024"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-024"] [data-part="frame"]{
position:relative;display:flex;align-items:center;
height:2.5rem;
background:var(--vibeui-input-024-field);
border:1px solid var(--vibeui-input-024-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-024"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-024-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-024-accent) 18%,transparent);
}
[data-vibeui-block="input-024"] [data-part="ghost"],
[data-vibeui-block="input-024"] input{
position:absolute;inset:0;height:100%;padding:0 0.75rem;
font:inherit;font-size:0.875rem;white-space:pre;
display:flex;align-items:center;
}
[data-vibeui-block="input-024"] [data-part="ghost"]{
pointer-events:none;color:var(--vibeui-input-024-fg);overflow:hidden;
}
[data-vibeui-block="input-024"] [data-part="ghost"] span[data-typed]{visibility:hidden}
[data-vibeui-block="input-024"] [data-part="ghost"] span[data-suffix]{color:var(--vibeui-input-024-muted)}
[data-vibeui-block="input-024"] input{
position:relative;width:100%;border:0;background:none;color:inherit;
}
[data-vibeui-block="input-024"] input:focus{outline:none}
[data-vibeui-block="input-024"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-024-muted);
}
[data-vibeui-block="input-024"] [data-part="note"] kbd{
font:inherit;font-weight:650;color:var(--vibeui-input-024-fg);
padding:0.0625rem 0.25rem;border:1px solid var(--vibeui-input-024-border);border-radius:0.25rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-024"] *{animation:none!important;transition:none!important}}
`

const DOMAINS = [
  "gmail.com",
  "yandex.ru",
  "mail.ru",
  "outlook.com",
  "icloud.com",
  "yahoo.com",
  "list.ru",
  "bk.ru",
]

// Подсказка ищется по началу домена после @, короче двух символов не
// предлагается — иначе на пустом хвосте подставится первый попавшийся домен.
function suggest(value: string, domains: string[]) {
  const at = value.indexOf("@")
  if (at < 0) return null

  const typed = value.slice(at + 1).toLowerCase()
  if (typed.length < 2) return null

  const match = domains.find(
    (domain) => domain.startsWith(typed) && domain !== typed,
  )
  if (!match) return null

  return {
    typed: value.slice(0, at + 1) + typed,
    suffix: match.slice(typed.length),
  }
}

/**
 * Поле email с подсказкой домена: остаток популярного домена показывается
 * серым продолжением того же слова, Tab дополняет его. Один файл, ноль
 * зависимостей.
 */
export function Input024({
  label = "Электронная почта",
  defaultValue = "",
  domains = DOMAINS,
  onChange,
  accent,
  className,
  style,
  ...props
}: Input024Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-input-024-accent": accent } : null),
    ...style,
  } as CSSProperties

  const hint = suggest(value, domains)

  const commit = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab" && hint) {
      event.preventDefault()
      commit(hint.typed + hint.suffix)
    }
  }

  return (
    <>
      <style href="vibeui-input-024" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-024"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame">
          {hint ? (
            <div data-part="ghost" aria-hidden="true">
              <span data-typed="1">{hint.typed}</span>
              <span data-suffix="1">{hint.suffix}</span>
            </div>
          ) : null}
          <input
            id={id}
            type="email"
            inputMode="email"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="you@gmail.com"
            value={value}
            aria-describedby={`${id}-note`}
            onChange={(event) => commit(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <p data-part="note" id={`${id}-note`} aria-live="polite">
          {hint ? (
            <>
              <kbd>Tab</kbd> — дополнить до {hint.typed + hint.suffix}
            </>
          ) : (
            "Начните вводить домен после @ — подскажем окончание."
          )}
        </p>
      </div>
    </>
  )
}
