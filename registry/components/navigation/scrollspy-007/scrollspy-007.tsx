"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Scrollspy007Section = {
  id: string
  title: string
  text?: string
}

export type Scrollspy007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  sections?: Scrollspy007Section[]
  title?: string
  /** Ширина блока в пикселях, ниже которой оглавление сворачивается. */
  compactAt?: number
  accent?: string
}

// Идея компонента: одно оглавление в двух видах. Широкий блок держит его
// колонкой слева, узкий — сворачивает в раскрывающийся список, где в
// заголовке написан текущий раздел: свёрнутое оглавление обязано отвечать
// «где я», иначе оно бесполезно. Порог считается от ширины самого блока
// (ResizeObserver), а не от ширины окна: тот же компонент может стоять в
// узкой колонке на большом экране.
const STYLES = `
:where([data-vibeui-block="scrollspy-007"]){
--vibeui-scrollspy-007-bg:oklch(1 0 0);
--vibeui-scrollspy-007-fg:oklch(0.23 0.014 265);
--vibeui-scrollspy-007-muted:oklch(0.56 0.014 265);
--vibeui-scrollspy-007-border:oklch(0.91 0.006 265);
--vibeui-scrollspy-007-accent:oklch(0.55 0.18 145);
--vibeui-scrollspy-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="scrollspy-007"]{
display:grid;grid-template-columns:9.5rem 1fr;gap:0.875rem;
width:100%;max-width:30rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-scrollspy-007-bg);
border:1px solid var(--vibeui-scrollspy-007-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollspy-007-font);color:var(--vibeui-scrollspy-007-fg);
}
[data-vibeui-block="scrollspy-007"][data-compact="true"]{grid-template-columns:1fr;gap:0.625rem}
[data-vibeui-block="scrollspy-007"] [data-part="toc"]{position:sticky;top:0;align-self:start;min-width:0}
[data-vibeui-block="scrollspy-007"] [data-part="head"]{
margin:0 0 0.375rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;
text-transform:uppercase;color:var(--vibeui-scrollspy-007-muted);
}
/* Свёрнутый вид: в заголовке стоит текущий раздел, а не слово «Содержание». */
[data-vibeui-block="scrollspy-007"] [data-part="summary"]{
display:flex;align-items:center;gap:0.375rem;cursor:pointer;list-style:none;
padding:0.4375rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-scrollspy-007-border);
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="scrollspy-007"] [data-part="summary"]::-webkit-details-marker{display:none}
[data-vibeui-block="scrollspy-007"] [data-part="summary"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-007-accent);outline-offset:2px}
[data-vibeui-block="scrollspy-007"] [data-part="now"]{color:var(--vibeui-scrollspy-007-muted);font-weight:500}
[data-vibeui-block="scrollspy-007"] [data-part="chevron"]{
margin-left:auto;width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
transition:transform .16s ease;
}
[data-vibeui-block="scrollspy-007"] details[open] [data-part="chevron"]{transform:rotate(-135deg) translate(-0.0625rem,-0.0625rem)}
[data-vibeui-block="scrollspy-007"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="scrollspy-007"] details ul{margin-top:0.25rem;padding:0.25rem;border-radius:0.5rem;background:color-mix(in oklab,var(--vibeui-scrollspy-007-muted) 7%,transparent)}
[data-vibeui-block="scrollspy-007"] [data-part="link"]{
display:block;padding:0.25rem 0.375rem;border-radius:0.375rem;
color:var(--vibeui-scrollspy-007-muted);text-decoration:none;font-size:0.8125rem;line-height:1.35;
}
[data-vibeui-block="scrollspy-007"] [data-part="link"]:hover{color:var(--vibeui-scrollspy-007-fg)}
[data-vibeui-block="scrollspy-007"] [data-part="link"][aria-current="true"]{
color:var(--vibeui-scrollspy-007-fg);font-weight:650;
background:color-mix(in oklab,var(--vibeui-scrollspy-007-accent) 14%,transparent);
}
[data-vibeui-block="scrollspy-007"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-007-accent);outline-offset:-2px}
[data-vibeui-block="scrollspy-007"] [data-part="body"]{
height:12rem;overflow-y:auto;overscroll-behavior:contain;scroll-behavior:smooth;padding-right:0.375rem;
}
[data-vibeui-block="scrollspy-007"] [data-part="body"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-007-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="scrollspy-007"] [data-part="section"]{scroll-margin-top:0.5rem}
[data-vibeui-block="scrollspy-007"] [data-part="section"] h4{margin:0 0 0.25rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="scrollspy-007"] [data-part="section"] p{margin:0 0 1.25rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-scrollspy-007-muted)}
[data-vibeui-block="scrollspy-007"] [data-part="section"]:last-child p{margin-bottom:8rem}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollspy-007"] [data-part="body"]{scroll-behavior:auto}
[data-vibeui-block="scrollspy-007"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_SECTIONS: Scrollspy007Section[] = [
  {
    id: "rules",
    title: "Условия",
    text: "Договор оферты описывает, что именно вы получаете и в какой срок. Читать целиком не обязательно, но раздел про возврат стоит открыть.",
  },
  {
    id: "payment",
    title: "Оплата",
    text: "Платёж проходит на стороне банка: реквизиты карты не попадают на наш сервер и нигде не сохраняются.",
  },
  {
    id: "delivery",
    title: "Доставка",
    text: "Сроки считаются от момента сборки заказа, а не от оплаты: в выходные склад не работает.",
  },
  {
    id: "refund",
    title: "Возврат",
    text: "Вернуть заказ можно в течение четырнадцати дней. Деньги приходят на ту же карту, обычно за три рабочих дня.",
  },
  {
    id: "support",
    title: "Поддержка",
    text: "Пишите на почту: ответ приходит в течение суток, а по срочным вопросам — быстрее.",
  },
]

/**
 * Оглавление, которое на узком блоке сворачивается в список с текущим разделом в заголовке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollspy007({
  sections = DEFAULT_SECTIONS,
  title = "Содержание",
  compactAt = 420,
  accent,
  className,
  style,
  ...props
}: Scrollspy007Props) {
  const root = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(sections[0]?.id)
  const [compact, setCompact] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const node = root.current
    if (!node) return
    const sizer = new ResizeObserver(([entry]) =>
      setCompact(entry.contentRect.width < compactAt),
    )
    sizer.observe(node)
    return () => sizer.disconnect()
  }, [compactAt])

  useEffect(() => {
    const scroller = body.current
    if (!scroller) return

    const watcher = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0]
        if (visible) setActive(visible.target.id)
      },
      { root: scroller, rootMargin: "0px 0px -65% 0px", threshold: 0 },
    )

    scroller
      .querySelectorAll("[data-part='section']")
      .forEach((section) => watcher.observe(section))
    return () => watcher.disconnect()
  }, [sections])

  const palette = {
    ...(accent ? { "--vibeui-scrollspy-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  const activeTitle =
    sections.find((section) => section.id === active)?.title ?? ""

  const list = (
    <ul>
      {sections.map((section) => (
        <li key={section.id}>
          <a
            data-part="link"
            href={`#${section.id}`}
            aria-current={section.id === active}
            onClick={() => setOpen(false)}
          >
            {section.title}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <style href="vibeui-scrollspy-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={root}
        data-vibeui-block="scrollspy-007"
        data-compact={compact}
        className={className}
        style={palette}
      >
        <nav data-part="toc" aria-label={title}>
          {compact ? (
            <details
              open={open}
              onToggle={(event) => setOpen(event.currentTarget.open)}
            >
              <summary data-part="summary">
                {title}
                <span data-part="now">· {activeTitle}</span>
                <span data-part="chevron" aria-hidden="true" />
              </summary>
              {list}
            </details>
          ) : (
            <>
              <p data-part="head">{title}</p>
              {list}
            </>
          )}
        </nav>
        <div
          data-part="body"
          ref={body}
          tabIndex={0}
          role="group"
          aria-label="Текст соглашения"
        >
          {sections.map((section) => (
            <section key={section.id} id={section.id} data-part="section">
              <h4>{section.title}</h4>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
