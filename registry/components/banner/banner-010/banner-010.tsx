import type { ComponentProps, CSSProperties } from "react"

export type Banner010Props = Omit<ComponentProps<"div">, "children"> & {
  /** Кого сейчас изображает сотрудник. */
  person?: string
  /** Кто вошёл под этим человеком. */
  operator?: string
  /** Подпись режима. {person} и {operator} подставляются. */
  template?: string
  note?: string
  exitLabel?: string
  exitHref?: string
  accent?: string
  /** Пусто — подложки нет, полоса лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: полоса режима «вы смотрите от чужого имени». Поддержка
// заходит в аккаунт клиента, разбирается — и забывает выйти, а следующее
// действие уходит от имени клиента. Обычный мягкий баннер здесь не работает:
// он выглядит как объявление, к которому глаз привыкает за минуту. Поэтому
// полоса держит косую штриховку по краям и не закрывается: единственная
// кнопка — выход из режима. Имя того, кем работают, стоит первым и крупнее
// остального: это ответ на вопрос «от чьего имени я сейчас нажму».
const STYLES = `
:where([data-vibeui-block="banner-010"]){
--vibeui-banner-010-bg:transparent;
--vibeui-banner-010-accent:light-dark(oklch(0.52 0.19 39.8),oklch(0.75 0.16 39.8));
/* Полоса живёт поверх интерфейса и всегда тёмная: текст на ней выводится из
   акцента, а не задаётся токеном — проект передаёт один цвет на обе ветки. */
--vibeui-banner-010-ink:oklch(from var(--vibeui-banner-010-accent) max(l,0.78) c h);
--vibeui-banner-010-surface:light-dark(oklch(0.22 0.02 25),oklch(0.24 0.024 25));
--vibeui-banner-010-fg:oklch(0.97 0 265);
--vibeui-banner-010-muted:color-mix(in oklab,var(--vibeui-banner-010-fg) 68%,transparent);
--vibeui-banner-010-radius:0.625rem;
--vibeui-banner-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-010"]{color-scheme:dark}
[data-vibeui-block="banner-010"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.875rem;
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);padding:0.75rem 1rem;
background:var(--vibeui-banner-010-surface);
border-radius:var(--vibeui-banner-010-radius);
color:var(--vibeui-banner-010-fg);
font-family:var(--vibeui-banner-010-font);
}
[data-vibeui-block="banner-010"] *{box-sizing:border-box}
/* Штриховка по краям: полоса режима обязана отличаться от объявления, к
   которому глаз привыкает за минуту. */
[data-vibeui-block="banner-010"] [data-part="stripe"]{
flex:none;width:1.75rem;height:1.25rem;border-radius:0.25rem;
background:repeating-linear-gradient(
  -45deg,
  var(--vibeui-banner-010-ink) 0 0.1875rem,
  transparent 0.1875rem 0.4375rem
);
}
[data-vibeui-block="banner-010"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.125rem;min-width:0;flex:1;
}
[data-vibeui-block="banner-010"] [data-part="mode"]{
font-size:0.875rem;line-height:1.35;
}
[data-vibeui-block="banner-010"] [data-part="person"]{
color:var(--vibeui-banner-010-ink);font-weight:650;
}
[data-vibeui-block="banner-010"] [data-part="note"]{
font-size:0.75rem;color:var(--vibeui-banner-010-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Выход — единственное действие и всегда на виду: полоса не закрывается,
   потому что закрыть режим и закрыть сообщение о нём — разные вещи. */
[data-vibeui-block="banner-010"] [data-part="exit"]{
flex:none;display:inline-flex;align-items:center;
min-height:2.125rem;padding:0.25rem 0.875rem;display:inline-flex;align-items:center;justify-content:center;border-radius:0.5rem;
border:1px solid var(--vibeui-banner-010-ink);
background:transparent;color:var(--vibeui-banner-010-ink);
font:inherit;font-size:0.8125rem;font-weight:650;text-decoration:none;
}
[data-vibeui-block="banner-010"] [data-part="exit"]:hover{
background:color-mix(in oklab,var(--vibeui-banner-010-ink) 16%,transparent);
}
[data-vibeui-block="banner-010"] [data-part="exit"]:focus-visible{
outline:2px solid var(--vibeui-banner-010-ink);outline-offset:2px;
}
@container (max-width: 30rem){
[data-vibeui-block="banner-010"] [data-part="exit"]{width:100%;justify-content:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-010"] *{animation:none!important;transition:none!important}}
`

/** Подставляет имена в шаблон подписи режима. */
function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)
}

/**
 * Полоса режима «просмотр от чужого имени» с единственным выходом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner010({
  person = "Мария Гурова",
  operator = "поддержка",
  template = "Вы работаете от имени {person}",
  note = "Действия сохранятся в её журнале и будут видны ей.",
  exitLabel = "Выйти из режима",
  exitHref = "#",
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner010Props) {
  const palette = {
    ...(accent ? { "--vibeui-banner-010-accent": accent } : null),
    ...(background ? { "--vibeui-banner-010-surface": background } : null),
    ...style,
  } as CSSProperties

  const [before, after = ""] = template.split("{person}")

  return (
    <>
      <style href="vibeui-banner-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-010"
        role="region"
        aria-label={fill(template, { person, operator })}
        className={className}
        style={palette}
      >
        <span data-part="stripe" aria-hidden="true" />
        <span data-part="text">
          <span data-part="mode">
            {before}
            <span data-part="person">{person}</span>
            {after}
          </span>
          <span data-part="note">{note}</span>
        </span>
        <a data-part="exit" href={exitHref}>
          {exitLabel}
        </a>
      </div>
    </>
  )
}
