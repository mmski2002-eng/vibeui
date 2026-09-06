import type { ComponentProps, CSSProperties } from "react"

export type Button065Props = Omit<ComponentProps<"div">, "children"> & {
  /** Имя файла, который заливается. */
  file?: string
  /** Размер файла строкой: «2,4 МБ». */
  size?: string
  /** 0–100. Управляется снаружи: компонент ничего не заливает сам. */
  progress?: number
  /** Подпись кнопки отмены. */
  cancelLabel?: string
  /** Что показать после завершения. */
  doneLabel?: string
  onCancel?: () => void
  accent?: string
  /** Поверхность плашки. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: заливка файла как одна строка, а не диалог. Прогресс идёт
// полосой под именем файла, проценты стоят рядом с размером, а крестик рвёт
// закачку — всё в пределах одной плашки, поэтому её можно поставить в список
// вложений, в форму и в чат, ничего не перекраивая.
//
// Прогресс приходит пропом: компонент не знает про сеть и не умеет её рвать.
// Он показывает состояние и зовёт onCancel — остальное дело приложения.
const STYLES = `
:where([data-vibeui-block="button-065"]){
--vibeui-button-065-surface:light-dark(oklch(1 0 0),oklch(0.24 0.01 265));
--vibeui-button-065-fg:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-065-muted:color-mix(in oklab,var(--vibeui-button-065-fg) 60%,transparent);
--vibeui-button-065-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-button-065-track:light-dark(oklch(0.92 0 265),oklch(0.31 0 265));
--vibeui-button-065-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-065-done:light-dark(oklch(0.52 0.14 152),oklch(0.72 0.14 152));
--vibeui-button-065-radius:0.75rem;
--vibeui-button-065-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-065"]{color-scheme:dark}
[data-vibeui-block="button-065"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;
padding:0.75rem 0.875rem;
border:1px solid var(--vibeui-button-065-border);
border-radius:var(--vibeui-button-065-radius);
background:var(--vibeui-button-065-surface);
font-family:var(--vibeui-button-065-font);color:var(--vibeui-button-065-fg);
}
[data-vibeui-block="button-065"] *{box-sizing:border-box}
/* Кольцо вместо иконки файла: оно же показывает процент, поэтому вторая
   индикация в строке не нужна. */
[data-vibeui-block="button-065"] [data-part="ring"]{
position:relative;flex:none;width:2.25rem;height:2.25rem;border-radius:9999px;
background:conic-gradient(var(--vibeui-button-065-accent) calc(var(--vibeui-button-065-progress) * 1%),var(--vibeui-button-065-track) 0);
}
[data-vibeui-block="button-065"] [data-part="ring"]::after{
content:"";position:absolute;inset:3px;border-radius:inherit;
background:var(--vibeui-button-065-surface);
}
[data-vibeui-block="button-065"][data-done="true"] [data-part="ring"]{
background:var(--vibeui-button-065-done);
}
[data-vibeui-block="button-065"] [data-part="tick"]{
position:absolute;inset:0;display:none;align-items:center;justify-content:center;
color:var(--vibeui-button-065-done);font-size:0.875rem;font-weight:800;line-height:1;
z-index:1;
}
[data-vibeui-block="button-065"][data-done="true"] [data-part="tick"]{display:flex}
[data-vibeui-block="button-065"] [data-part="body"]{flex:1;min-width:0}
[data-vibeui-block="button-065"] [data-part="name"]{
display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="button-065"] [data-part="meta"]{
display:block;margin-top:0.125rem;
font-size:0.75rem;color:var(--vibeui-button-065-muted);font-variant-numeric:tabular-nums;
}
/* Крестик — отдельная цель нажатия: промах по строке не должен рвать
   закачку, которая идёт уже минуту. */
[data-vibeui-block="button-065"] [data-part="cancel"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:9999px;
border:1px solid var(--vibeui-button-065-border);
background:transparent;color:var(--vibeui-button-065-muted);
font:inherit;font-size:0.875rem;line-height:1;
transition:color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-065"] [data-part="cancel"]:hover:not(:disabled){
color:var(--vibeui-button-065-fg);border-color:var(--vibeui-button-065-fg);
}
[data-vibeui-block="button-065"] [data-part="cancel"]:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="button-065"] [data-part="cancel"]:focus-visible{
outline:2px solid var(--vibeui-button-065-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-065"] *{animation:none!important;transition:none!important}}
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

/**
 * Заливка файла: кольцо прогресса, имя, проценты и отмена в одной строке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button065({
  file = "Договор-2026.pdf",
  size = "2,4 МБ",
  progress = 42,
  cancelLabel = "Отменить загрузку",
  doneLabel = "Загружено",
  onCancel,
  accent,
  background = "",
  className,
  style,
  ...props
}: Button065Props) {
  const value = Math.min(100, Math.max(0, Math.round(progress)))
  const done = value >= 100

  const palette = {
    "--vibeui-button-065-progress": String(value),
    ...(accent ? { "--vibeui-button-065-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-065-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-065" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-065"
        data-done={done}
        className={className}
        style={palette}
      >
        <span
          data-part="ring"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-label={file}
        >
          <span data-part="tick" aria-hidden="true">
            ✓
          </span>
        </span>

        <span data-part="body">
          <span data-part="name">{file}</span>
          <span data-part="meta">
            {done ? doneLabel : `${value}%`} · {size}
          </span>
        </span>

        <button
          type="button"
          data-part="cancel"
          disabled={done}
          aria-label={cancelLabel}
          title={cancelLabel}
          onClick={onCancel}
        >
          ✕
        </button>
      </div>
    </>
  )
}
