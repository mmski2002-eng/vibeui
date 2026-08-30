import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alert015Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  title?: string
  /** Использовано и всего — в единицах ресурса. */
  used?: number
  total?: number
  unit?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  accent?: string
}

// Идея компонента: лимит на исходе. Полоса и число считаются из одних данных,
// поэтому «8 из 10» и заполнение не могут разойтись. Цвет переключается сам
// на 80 и 100 процентах: тон здесь не оформление, а состояние, и задавать
// его пропом значило бы позволить показать зелёным исчерпанную квоту.
const STYLES = `
:where([data-vibeui-block="alert-015"]){
--vibeui-alert-015-fg:oklch(0.24 0.016 265);
--vibeui-alert-015-muted:oklch(0.5 0.014 265);
--vibeui-alert-015-bg:oklch(1 0 0);
--vibeui-alert-015-border:oklch(0.9 0.006 265);
--vibeui-alert-015-track:oklch(0.93 0.006 265);
--vibeui-alert-015-state:oklch(0.58 0.18 262);
--vibeui-alert-015-accent:oklch(0.55 0.2 262);
--vibeui-alert-015-radius:0.875rem;
--vibeui-alert-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="alert-015"]{
/* flex-wrap живёт здесь, а не в @container: контейнерный запрос применяется
   к потомкам контейнера, но не к нему самому. На широкой раскладке перенос
   ни на что не влияет — всё умещается в строку. */
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1rem;
width:100%;box-sizing:border-box;
padding:0.9375rem 1.0625rem;
border:1px solid var(--vibeui-alert-015-border);
border-radius:var(--vibeui-alert-015-radius);
background:var(--vibeui-alert-015-bg);color:var(--vibeui-alert-015-fg);
font-family:var(--vibeui-alert-015-font);
}
/* Тон выводится из доли, а не задаётся пропом: исчерпанную квоту нельзя
   показать зелёной. */
[data-vibeui-block="alert-015"][data-level="warn"]{--vibeui-alert-015-state:oklch(0.68 0.15 70)}
[data-vibeui-block="alert-015"][data-level="full"]{--vibeui-alert-015-state:oklch(0.56 0.19 25)}
[data-vibeui-block="alert-015"] [data-part="text"]{display:flex;flex-direction:column;gap:0.3125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-015"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}
[data-vibeui-block="alert-015"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.35}
[data-vibeui-block="alert-015"] [data-part="counter"]{
flex:none;font-size:0.8125rem;font-weight:650;
font-variant-numeric:tabular-nums;color:var(--vibeui-alert-015-state);
}
[data-vibeui-block="alert-015"] [data-part="track"]{
height:0.375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-alert-015-track);
}
[data-vibeui-block="alert-015"] [data-part="bar"]{
display:block;height:100%;border-radius:inherit;
background:var(--vibeui-alert-015-state);
width:calc(var(--vibeui-alert-015-ratio,0) * 1%);
transition:width .3s cubic-bezier(.32,.72,0,1),background-color .2s ease;
}
[data-vibeui-block="alert-015"] [data-part="description"]{font-size:0.8125rem;line-height:1.5;color:var(--vibeui-alert-015-muted)}
[data-vibeui-block="alert-015"] [data-part="action"]{
flex:none;display:inline-flex;align-items:center;height:2rem;padding:0 0.9375rem;
border-radius:0.5rem;text-decoration:none;
background:var(--vibeui-alert-015-accent);color:oklch(1 0 0);
font-size:0.8125rem;font-weight:600;
transition:filter .16s ease;
}
[data-vibeui-block="alert-015"] [data-part="action"]:hover{filter:brightness(0.94)}
[data-vibeui-block="alert-015"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-alert-015-accent);outline-offset:2px}
@container (max-width: 28rem){
[data-vibeui-block="alert-015"] [data-part="text"]{flex:1 1 100%}
[data-vibeui-block="alert-015"] [data-part="action"]{flex:1 1 100%;justify-content:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-015"] *{animation:none!important;transition:none!important}}
`

/**
 * Алерт исчерпания лимита: полоса и счётчик из одних данных.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert015({
  title = "Проекты на тарифе заканчиваются",
  used = 8,
  total = 10,
  unit = "проектов",
  description = "На тарифе «Старт» доступно 10 проектов. Дальше — архивировать старые или перейти на «Команду».",
  actionLabel = "Сменить тариф",
  actionHref = "#",
  accent,
  className,
  style,
  ...props
}: Alert015Props) {
  const safeTotal = total > 0 ? total : 1
  const ratio = Math.min(100, Math.max(0, (used / safeTotal) * 100))
  const level = ratio >= 100 ? "full" : ratio >= 80 ? "warn" : "normal"
  const palette = {
    "--vibeui-alert-015-ratio": ratio,
    ...(accent ? { "--vibeui-alert-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alert-015"
        data-level={level}
        role="status"
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="head">
            <span data-part="title">{title}</span>
            <span data-part="counter">
              {used} из {total} {unit}
            </span>
          </span>
          <span
            data-part="track"
            role="progressbar"
            aria-label={title}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={used}
          >
            <span data-part="bar" />
          </span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
        {actionLabel ? (
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        ) : null}
      </div>
    </>
  )
}
