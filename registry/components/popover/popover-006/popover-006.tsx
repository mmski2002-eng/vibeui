import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Popover006Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  /** Слово в тексте, к которому цепляется справка. */
  term?: string
  title?: string
  text?: string
  linkLabel?: string
  href?: string
  /** Текст строки до термина. */
  textBefore?: string
  /** Текст строки после термина. */
  textAfter?: string
  /** Доступная подпись кнопки-термина. {term} подставляется. */
  triggerHint?: string
  /** Показать панель раскрытой и в потоке: витрине и документации нужна открытая. */
  defaultOpen?: boolean
  accent?: string
  /** Пусто — плашки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: справка внутри строки текста. От подсказки отличается тем,
// что внутрь можно войти мышью и Tab — там живёт ссылка на документацию.
// Поэтому это popover, а не tooltip: закрытие по Escape и клику вне, не по уходу.
const STYLES = `
:where([data-vibeui-block="popover-006"]){
--vibeui-popover-006-bg:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-popover-006-plate:transparent;
--vibeui-popover-006-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-popover-006-muted:color-mix(in oklab,var(--vibeui-popover-006-fg) 68%,transparent);
--vibeui-popover-006-border:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-popover-006-accent:light-dark(oklch(0.52 0.16 39.8),oklch(0.75 0.14 39.8));
--vibeui-popover-006-soft:light-dark(oklch(0.96 0 250),oklch(0.3 0.04 39.8));
--vibeui-popover-006-shadow:light-dark(oklch(0.2 0 265 / 60%),oklch(0.02 0 265 / 72%));
--vibeui-popover-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-006"]{color-scheme:dark}
[data-vibeui-block="popover-006"]{
display:inline-block;box-sizing:border-box;max-width:26rem;
padding:0.875rem 1rem;
border:1px solid var(--vibeui-popover-006-border);border-radius:0.875rem;
background:var(--vibeui-popover-006-plate);
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
box-shadow:0 24px 52px -30px var(--vibeui-popover-006-shadow);
position-anchor:--vibeui-popover-006-anchor;inset:auto;
top:anchor(bottom);left:anchor(left);margin-top:0.5rem;
}
[data-vibeui-block="popover-006"] [data-part="card"]:popover-open{display:flex;flex-direction:column;gap:0.5rem}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-006"] [data-part="card"]{position:fixed;inset:0;margin:auto}
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
/* Раскрытая панель на месте: атрибут popover прячет её правилом браузера,
   а это правило той же специфичности его переопределяет и возвращает панель
   в поток. Так её показывают на витрине и в документации, без верхнего слоя.
   Только пока popover закрыт: у открытого положение задаёт верхний слой,
   и static отправил бы панель в левый верхний угол экрана. Здесь панель ещё
   и висит поверх абзаца: кнопка стоит внутри фразы, и вставшая в поток
   справка разрывала бы предложение пополам. */
[data-vibeui-block="popover-006"][data-open]{position:relative}
[data-vibeui-block="popover-006"][data-open] [popover]:not(:popover-open){
display:flex;flex-direction:column;gap:0.5rem;position:absolute;z-index:20;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-006"] *{animation:none!important;transition:none!important}}
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
 * Поповер справки в строке текста: внутри объяснение и ссылка на документацию.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover006({
  term = "холодный старт",
  title = "Что такое холодный старт",
  text = "Первый запрос после простоя поднимает контейнер с нуля: он идёт на 300–800 мс дольше обычного. Дальше отвечает уже прогретый экземпляр.",
  linkLabel = "Как его избежать",
  href = "#docs",
  textBefore = "Первый ответ после простоя приходит медленнее — это ",
  textAfter = ", и он проходит сам через минуту работы.",
  triggerHint = "Справка: {term}",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Popover006Props) {
  const id = useId().replace(/:/g, "")
  const palette = {
    ...(accent ? { "--vibeui-popover-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-006-plate": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="popover"
        data-vibeui-block="popover-006"
        data-open={defaultOpen || undefined}
        className={className}
        style={palette}
      >
        <p data-part="line">
          {textBefore}
          <span data-part="host">
            <button
              type="button"
              data-part="trigger"
              popoverTarget={`${id}-card`}
              aria-label={triggerHint.replace("{term}", term)}
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
          {textAfter}
        </p>
      </div>
    </>
  )
}
