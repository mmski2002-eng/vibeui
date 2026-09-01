"use client"

import { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Field011Phase = "idle" | "pending" | "saving" | "saved"

export type Field011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  defaultValue?: string
  delay?: number
  accent?: string
}

// Идея компонента: черновик, который сохраняется сам, без кнопки. Пауза
// после последнего нажатия запускает сохранение, а короткая фаза «сохраняем»
// перед меткой времени не даёт спутать автосохранение с обычным набором
// текста — иначе непонятно, случилось оно вообще или нет.
const STYLES = `
:where([data-vibeui-block="field-011"]){
--vibeui-field-011-bg:oklch(1 0 0);
--vibeui-field-011-surface:oklch(1 0 0);
--vibeui-field-011-fg:oklch(0.24 0.014 265);
--vibeui-field-011-muted:oklch(0.55 0.014 265);
--vibeui-field-011-border:oklch(0.88 0.008 265);
--vibeui-field-011-shell:oklch(0.91 0.006 265);
--vibeui-field-011-accent:oklch(0.55 0.2 262);
--vibeui-field-011-ok:oklch(0.5 0.13 155);
--vibeui-field-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="field-011"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-field-011-surface);
border:1px solid var(--vibeui-field-011-shell);border-radius:0.875rem;
font-family:var(--vibeui-field-011-font);color:var(--vibeui-field-011-fg);
}
[data-vibeui-block="field-011"] *{box-sizing:border-box}
[data-vibeui-block="field-011"] [data-part="row"]{display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem}
[data-vibeui-block="field-011"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="field-011"] textarea{
width:100%;min-height:5.5rem;padding:0.5625rem 0.6875rem;resize:vertical;
background:var(--vibeui-field-011-bg);color:inherit;font:inherit;font-size:0.875rem;line-height:1.45;
border:1px solid var(--vibeui-field-011-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="field-011"] textarea:focus{
outline:none;border-color:var(--vibeui-field-011-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-field-011-accent) 18%,transparent);
}
[data-vibeui-block="field-011"] [data-part="status"]{
display:flex;align-items:center;gap:0.375rem;margin:0;
font-size:0.75rem;color:var(--vibeui-field-011-muted);
}
[data-vibeui-block="field-011"] [data-part="dot"]{
flex:none;width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-field-011-muted);
}
[data-vibeui-block="field-011"][data-phase="saved"] [data-part="dot"]{background:var(--vibeui-field-011-ok)}
[data-vibeui-block="field-011"][data-phase="saving"] [data-part="dot"]{
background:var(--vibeui-field-011-accent);
animation:vibeui-field-011-pulse 0.9s ease-in-out infinite;
}
[data-vibeui-block="field-011"][data-phase="saved"] [data-part="status"]{color:var(--vibeui-field-011-ok);font-weight:600}
@keyframes vibeui-field-011-pulse{0%,100%{opacity:1}50%{opacity:0.35}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-011"] *{animation:none!important;transition:none!important}}
`

const STATUS_TEXT: Record<Field011Phase, string> = {
  idle: "Начните печатать — черновик сохранится сам.",
  pending: "Есть несохранённые правки…",
  saving: "Сохраняем…",
  saved: "Сохранено",
}

/**
 * Поле с автосохранением черновика: пауза после ввода запускает сохранение,
 * а под полем остаётся метка времени последнего сохранения.
 */
export function Field011({
  label = "Заметка к сделке",
  placeholder = "Опишите договорённости…",
  defaultValue = "Созвон перенесли на четверг, обсудить бюджет Q3.",
  delay = 1200,
  accent,
  className,
  style,
  ...props
}: Field011Props) {
  const [value, setValue] = useState(defaultValue)
  const [saved, setSaved] = useState<{ text: string; at: Date } | null>(null)
  const [savingFor, setSavingFor] = useState<string | null>(null)

  const isDirty = value !== (saved?.text ?? "")

  const phase: Field011Phase = !isDirty
    ? saved
      ? "saved"
      : "idle"
    : savingFor === value
      ? "saving"
      : "pending"

  // Пауза после последнего нажатия: сохраняем не на каждую букву, а один
  // раз, когда ввод затих.
  useEffect(() => {
    if (!isDirty) return

    const timer = window.setTimeout(() => setSavingFor(value), delay)

    return () => window.clearTimeout(timer)
  }, [value, isDirty, delay])

  // Короткая фаза «сохраняем» — видимое подтверждение того, что сохранение
  // действительно произошло, а не просто истекла пауза.
  useEffect(() => {
    if (savingFor === null) return

    const timer = window.setTimeout(() => {
      setSaved({ text: savingFor, at: new Date() })
      setSavingFor(null)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [savingFor])

  const timestamp =
    phase === "saved" && saved
      ? saved.at.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null

  const palette = {
    ...(accent ? { "--vibeui-field-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-field-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="field-011"
        data-phase={phase}
        className={className}
        style={palette}
      >
        <div data-part="row">
          <label htmlFor="field-011-input">{label}</label>
        </div>
        <textarea
          id="field-011-input"
          name="draft"
          rows={3}
          placeholder={placeholder}
          value={value}
          aria-describedby="field-011-status"
          onChange={(event) => setValue(event.target.value)}
        />
        <p id="field-011-status" data-part="status" role="status">
          <span data-part="dot" aria-hidden="true" />
          {STATUS_TEXT[phase]}
          {timestamp ? ` в ${timestamp}` : ""}
        </p>
      </div>
    </>
  )
}
