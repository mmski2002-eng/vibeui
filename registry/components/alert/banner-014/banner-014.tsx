import type { ComponentProps, CSSProperties } from "react"

export type Banner014Props = Omit<ComponentProps<"div">, "children"> & {
  /** Что именно смотрят: дата версии, номер ревизии, имя ветки. */
  version?: string
  /** Подпись состояния. {version} подставляется. */
  template?: string
  note?: string
  actionLabel?: string
  actionHref?: string
  /** Машинная отметка для <time>: ISO-дата версии. */
  dateTime?: string
  accent?: string
  /** Пусто — подложки нет, полоса лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: полоса «вы смотрите не текущую версию». Человек приходит
// по ссылке из переписки, читает старый текст и уходит с ним работать — сама
// страница об этом не говорит, у неё тот же адрес и тот же вид. Здесь состояние
// названо словом, версия вынесена в <time> с машинной отметкой, а переход к
// актуальной стоит рядом и всегда один. Полоса не закрывается: закрыть
// сообщение о просмотре архива — значит снова остаться со старым текстом без
// предупреждения. Цвет спокойный: это не ошибка и не тревога, а контекст.
const STYLES = `
:where([data-vibeui-block="banner-014"]){
--vibeui-banner-014-bg:transparent;
--vibeui-banner-014-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-banner-014-muted:color-mix(in oklab,var(--vibeui-banner-014-fg) 66%,transparent);
--vibeui-banner-014-surface:light-dark(oklch(0.96 0 245),oklch(0.27 0 245));
--vibeui-banner-014-border:light-dark(oklch(0.87 0 245),oklch(0.4 0 245));
--vibeui-banner-014-accent:light-dark(oklch(0.263 0 0),oklch(0.917 0 0));
/* Акцентом набрана версия: светлота ограничивается по обе стороны, чтобы
   цвет проекта не исчез ни на светлой подложке, ни на тёмной. */
--vibeui-banner-014-ink:oklch(from var(--vibeui-banner-014-accent) clamp(0.42,l,0.86) c h);
--vibeui-banner-014-radius:0.625rem;
--vibeui-banner-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-014"]{color-scheme:dark}
[data-vibeui-block="banner-014"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);padding:0.6875rem 1rem;
background:var(--vibeui-banner-014-surface);
border:1px solid var(--vibeui-banner-014-border);
border-radius:var(--vibeui-banner-014-radius);
color:var(--vibeui-banner-014-fg);
font-family:var(--vibeui-banner-014-font);
}
[data-vibeui-block="banner-014"] *{box-sizing:border-box}
/* Слои листов: знак архива, собранный рамками, а не иконочным пакетом. */
[data-vibeui-block="banner-014"] [data-part="mark"]{
position:relative;flex:none;width:1rem;height:1rem;
}
[data-vibeui-block="banner-014"] [data-part="mark"]::before,
[data-vibeui-block="banner-014"] [data-part="mark"]::after{
content:"";position:absolute;width:0.75rem;height:0.75rem;border-radius:0.1875rem;
border:1.5px solid var(--vibeui-banner-014-ink);
}
[data-vibeui-block="banner-014"] [data-part="mark"]::before{left:0;top:0;opacity:.45}
[data-vibeui-block="banner-014"] [data-part="mark"]::after{right:0;bottom:0}
[data-vibeui-block="banner-014"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.125rem;min-width:0;flex:1;
}
[data-vibeui-block="banner-014"] [data-part="state"]{font-size:0.875rem;line-height:1.35}
[data-vibeui-block="banner-014"] [data-part="version"]{
color:var(--vibeui-banner-014-ink);font-weight:650;
}
[data-vibeui-block="banner-014"] [data-part="note"]{
font-size:0.75rem;color:var(--vibeui-banner-014-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="banner-014"] [data-part="action"]{
flex:none;display:inline-flex;align-items:center;
min-height:2rem;padding:0.25rem 0.75rem;justify-content:center;border-radius:0.5rem;
border:1px solid var(--vibeui-banner-014-ink);
background:transparent;color:var(--vibeui-banner-014-ink);
font:inherit;font-size:0.8125rem;font-weight:650;text-decoration:none;
}
[data-vibeui-block="banner-014"] [data-part="action"]:hover{
background:color-mix(in oklab,var(--vibeui-banner-014-ink) 14%,transparent);
}
[data-vibeui-block="banner-014"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-banner-014-ink);outline-offset:2px;
}
@container (max-width: 28rem){
[data-vibeui-block="banner-014"] [data-part="action"]{width:100%;justify-content:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-014"] *{animation:none!important;transition:none!important}}
`

/**
 * Полоса архивной версии: что смотрят и как вернуться к актуальному.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner014({
  version = "3 марта",
  template = "Вы смотрите версию от {version}",
  note = "Актуальная страница могла измениться с тех пор.",
  actionLabel = "К актуальной",
  actionHref = "#",
  dateTime = "2026-03-03",
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner014Props) {
  const palette = {
    ...(accent ? { "--vibeui-banner-014-accent": accent } : null),
    ...(background ? { "--vibeui-banner-014-surface": background } : null),
    ...style,
  } as CSSProperties

  const [before, after = ""] = template.split("{version}")

  return (
    <>
      <style href="vibeui-banner-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-014"
        role="region"
        aria-label={template.replace("{version}", version)}
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <span data-part="text">
          <span data-part="state">
            {before}
            {/* Машинная отметка рядом с человеческой: дату версии читают и
                люди, и разбор страницы. */}
            <time data-part="version" dateTime={dateTime}>
              {version}
            </time>
            {after}
          </span>
          <span data-part="note">{note}</span>
        </span>
        <a data-part="action" href={actionHref}>
          {actionLabel}
        </a>
      </div>
    </>
  )
}
