import type { ComponentProps, CSSProperties } from "react"

export type Heading001Level = "h1" | "h2" | "h3"
export type Heading001Size = "xs" | "sm" | "md" | "lg" | "xl"
export type Heading001Align = "start" | "center"

export type Heading001Props = Omit<ComponentProps<"div">, "title"> & {
  /** Надзаголовок: короткая пометка над заголовком, мелким uppercase акцентом. */
  eyebrow?: string
  title?: string
  /** Хвост заголовка цветом акцента: «Сайт за вечер, *а не за месяц*». */
  titleAccent?: string
  /** Подводка: одно-два предложения под заголовком, приглушённым цветом. */
  lede?: string
  /** Уровень заголовка в документе: hero — h1, любая другая секция — h2. */
  level?: Heading001Level
  /** Шкала заголовка; размер считается от ширины контейнера (cqi). */
  size?: Heading001Size
  align?: Heading001Align
  /** Гарнитура заголовка; пусто — системный гротеск. Блок передаёт свою. */
  display?: string
  /** Гарнитура надзаголовка и подводки; пусто — системный гротеск. */
  font?: string
  /** Ширина подводки в символах: длинная строка не читается. */
  ledeWidth?: number
  accent?: string
  /** Цвет заголовка. Пусто — цвет текста окружения: секция тёмная — заголовок светлый сам. */
  ink?: string
}

// Идея компонента: заголовочная часть секции как единица — надзаголовок,
// заголовок, подводка. У большинства секций она одна и та же по структуре,
// и различается только гарнитурой, размером и выравниванием; это пропсы.
// Заголовок меряет ширину контейнера (cqi), а не окна, поэтому одинаково
// живёт в узкой колонке и во всю ширину. Цвет по умолчанию — currentColor:
// на тёмной секции заголовок светлый без единого пропа, приглушённый тон
// подводки считается от него же. Гарнитуры компонент не грузит: блок
// передаёт имя, страница подключает шрифт.
const STYLES = `
:where([data-vibeui-block="heading-001"]){
--vibeui-heading-001-fg:currentColor;
--vibeui-heading-001-accent:currentColor;
--vibeui-heading-001-muted:color-mix(in oklab,var(--vibeui-heading-001-fg) 62%,transparent);
--vibeui-heading-001-display:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-heading-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-heading-001-lede-width:44ch;
--vibeui-heading-001-title-size:clamp(1.75rem,4.5cqi,2.75rem);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="heading-001"]{color-scheme:dark}
[data-vibeui-block="heading-001"]{
width:100%;min-width:min(100%,12rem);box-sizing:border-box;
display:flex;flex-direction:column;align-items:flex-start;gap:0.625rem;
color:var(--vibeui-heading-001-fg);font-family:var(--vibeui-heading-001-font);
text-align:start;
}
[data-vibeui-block="heading-001"] *{box-sizing:border-box}
[data-vibeui-block="heading-001"][data-align="center"]{align-items:center;text-align:center}
/* xs — заголовок карточки или формы: рядом поля, а не экран. */
[data-vibeui-block="heading-001"][data-size="xs"]{--vibeui-heading-001-title-size:clamp(1.125rem,2.5cqi,1.375rem)}
[data-vibeui-block="heading-001"][data-size="sm"]{--vibeui-heading-001-title-size:clamp(1.375rem,3cqi,1.875rem)}
[data-vibeui-block="heading-001"][data-size="lg"]{--vibeui-heading-001-title-size:clamp(2rem,5.5cqi,3.5rem)}
[data-vibeui-block="heading-001"][data-size="xl"]{--vibeui-heading-001-title-size:clamp(2.5rem,7cqi,4.75rem)}
[data-vibeui-block="heading-001"] [data-part="eyebrow"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-heading-001-accent);
}
[data-vibeui-block="heading-001"] [data-part="title"]{
margin:0;max-width:20ch;
font-family:var(--vibeui-heading-001-display);
font-size:var(--vibeui-heading-001-title-size);line-height:1.1;letter-spacing:-0.02em;font-weight:680;
text-wrap:balance;
}
/* Крупные шкалы — заголовки hero: строка длиннее, иначе три строки там, где хватило бы двух. */
[data-vibeui-block="heading-001"][data-size="lg"] [data-part="title"]{max-width:24ch}
[data-vibeui-block="heading-001"][data-size="xl"] [data-part="title"]{max-width:26ch;line-height:1.02;letter-spacing:-0.03em}
[data-vibeui-block="heading-001"] [data-part="title-accent"]{color:var(--vibeui-heading-001-accent)}
[data-vibeui-block="heading-001"] [data-part="lede"]{
margin:0;max-width:var(--vibeui-heading-001-lede-width);
font-size:1rem;line-height:1.6;color:var(--vibeui-heading-001-muted);text-wrap:pretty;
}
[data-vibeui-block="heading-001"][data-size="lg"] [data-part="lede"],
[data-vibeui-block="heading-001"][data-size="xl"] [data-part="lede"]{font-size:1.125rem}
[data-vibeui-block="heading-001"][data-size="sm"] [data-part="lede"]{font-size:0.9375rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="heading-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Заголовок секции: надзаголовок, заголовок, подводка — с гарнитурой,
 * шкалой и выравниванием пропсами. Один файл, ноль зависимостей.
 */
export function Heading001({
  eyebrow = "Заголовок секции",
  title = "Коротко о том, как это работает",
  titleAccent = "",
  lede = "",
  level = "h2",
  size = "md",
  align = "start",
  display = "",
  font = "",
  ledeWidth,
  accent,
  ink = "",
  className,
  style,
  ...props
}: Heading001Props) {
  const Tag = level
  const palette = {
    ...(display ? { "--vibeui-heading-001-display": display } : null),
    ...(font ? { "--vibeui-heading-001-font": font } : null),
    ...(ledeWidth ? { "--vibeui-heading-001-lede-width": `${ledeWidth}ch` } : null),
    ...(accent ? { "--vibeui-heading-001-accent": accent } : null),
    ...(ink ? { "--vibeui-heading-001-fg": ink } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-heading-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="heading"
        data-vibeui-block="heading-001"
        data-size={size}
        data-align={align}
        className={className}
        style={palette}
      >
        {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
        <Tag data-part="title">
          {title}
          {titleAccent ? (
            <>
              {" "}
              <span data-part="title-accent">{titleAccent}</span>
            </>
          ) : null}
        </Tag>
        {lede ? <p data-part="lede">{lede}</p> : null}
      </div>
    </>
  )
}
