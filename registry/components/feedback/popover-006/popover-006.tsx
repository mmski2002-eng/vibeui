import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Popover006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  /** Слово в тексте, к которому цепляется справка. */
  term?: string
  title?: string
  text?: string
  linkLabel?: string
  href?: string
}

// Идея компонента: справка внутри строки текста. От подсказки отличается тем,
// что внутрь можно войти мышью и Tab — там живёт ссылка на документацию.
// Поэтому это popover, а не tooltip: закрытие по Escape и клику вне, не по уходу.
const STYLES = `
:where([data-vibeui-block="popover-006"]){
--vibeui-popover-006-bg:oklch(1 0 0);
--vibeui-popover-006-fg:oklch(0.23 0.014 265);
--vibeui-popover-006-muted:oklch(0.53 0.014 265);
--vibeui-popover-006-border:oklch(0.89 0.006 265);
--vibeui-popover-006-accent:oklch(0.52 0.16 250);
--vibeui-popover-006-soft:oklch(0.96 0.02 250);
--vibeui-popover-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="popover-006"]{
display:inline-block;box-sizing:border-box;max-width:26rem;
padding:0.875rem 1rem;
border:1px solid var(--vibeui-popover-006-border);border-radius:0.875rem;
background:var(--vibeui-popover-006-bg);
font-family:var(--vibeui-popover-006-font);color:var(--vibeui-popover-006-fg);
}
[data-vibeui-block="popover-006"] [data-part="line"]{margin:0;font-size:0.875rem;line-height:1.7}
/* Справка цепляется к слову в строке, а не к абзацу целиком. */
[data-vibeui-block="popover-006"] [data-part="host"]{position:relative;display:inline-block}
[data-vibeui-block="popover-006"] [data-part="trigger"]{
appearance:none;cursor:pointer;border:0;background:transparent;
display:inline;padding:0;
color:var(--vibeui-popover-006-accent);font:inherit;font-weight:620;
text-decoration:underline;text-decoration-style:dotted;text-underline-offset:0.2em;
anchor-name:--vibeui-popover-006-anchor;
}
[data-vibeui-block="popover-006"] [data-part="trigger"]::after{
content:"?";display:inline-flex;align-items:center;justify-content:center;
width:0.9375rem;height:0.9375rem;margin-left:0.25rem;vertical-align:0.05em;
border-radius:9999px;background:var(--vibeui-popover-006-soft);
color:var(--vibeui-popover-006-accent);
font-size:0.625rem;font-weight:800;text-decoration:none;
}
[data-vibeui-block="popover-006"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-006-accent);outline-offset:2px;border-radius:0.25rem}
/* Раскладка карточки только в :popover-open — display в обычном правиле
   отменил бы браузерный display:none и справка висела бы поверх текста. */
[data-vibeui-block="popover-006"] [data-part="card"]{
position:fixed;margin:0;padding:0.875rem;
width:min(18rem,100vw - 2rem);box-sizing:border-box;
border:1px solid var(--vibeui-popover-006-border);border-radius:0.875rem;
background:var(--vibeui-popover-006-bg);color:inherit;
box-shadow:0 24px 52px -30px oklch(0.2 0.02 265 / 60%);
position-anchor:--vibeui-popover-006-anchor;
top:anchor(bottom);left:anchor(left);margin-top:0.5rem;
}
[data-vibeui-block="popover-006"] [data-part="card"]:popover-open{display:flex;flex-direction:column;gap:0.5rem}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-006"] [data-part="card"]{position:absolute;inset:auto;top:calc(100% + 0.5rem);left:0}
}
[data-vibeui-block="popover-006"] [data-part="title"]{display:block;margin:0;font-size:0.875rem;font-weight:660;line-height:1.3}
[data-vibeui-block="popover-006"] [data-part="text"]{display:block;margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-popover-006-muted)}
[data-vibeui-block="popover-006"] [data-part="link"]{
display:inline-flex;align-items:center;gap:0.3125rem;align-self:flex-start;
color:var(--vibeui-popover-006-accent);font-size:0.8125rem;font-weight:650;
text-decoration:none;border-radius:0.25rem;
}
[data-vibeui-block="popover-006"] [data-part="link"]:hover{text-decoration:underline;text-underline-offset:0.2em}
[data-vibeui-block="popover-006"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-popover-006-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Поповер справки в строке текста: внутри объяснение и ссылка на документацию.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover006({
  term = "холодный старт",
  title = "Что такое холодный старт",
  text = "Первый запрос после простоя поднимает контейнер с нуля: он идёт на 300–800 мс дольше обычного. Дальше отвечает уже прогретый экземпляр.",
  linkLabel = "Как его избежать",
  href = "#docs",
  className,
  style,
  ...props
}: Popover006Props) {
  const id = useId().replace(/:/g, "")

  return (
    <>
      <style href="vibeui-popover-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="popover-006"
        className={className}
        style={style as CSSProperties}
      >
        <p data-part="line">
          Первый ответ после простоя приходит медленнее — это{" "}
          <span data-part="host">
            <button
              type="button"
              data-part="trigger"
              popoverTarget={`${id}-card`}
              aria-label={`Справка: ${term}`}
            >
              {term}
            </button>
            <span
              data-part="card"
              id={`${id}-card`}
              popover="auto"
              aria-label={title}
            >
              <span data-part="title">{title}</span>
              <span data-part="text">{text}</span>
              <a data-part="link" href={href}>
                {linkLabel}
                <span aria-hidden="true">→</span>
              </a>
            </span>
          </span>
          , и он проходит сам через минуту работы.
        </p>
      </div>
    </>
  )
}
