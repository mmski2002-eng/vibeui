import type { ComponentProps, CSSProperties } from "react"

export type Text001Props = Omit<ComponentProps<"a">, "children"> & {
  /** Надпись в покое. */
  text?: string
  /** Надпись, которая приезжает на её место при наведении. */
  hoverText?: string
  /** Стрелка справа: уводит взгляд по направлению перехода. */
  arrow?: boolean
  accent?: string
  /** Цвет надписи под курсором. Пусто — берётся из палитры. */
  accentText?: string
}

// Идея: ссылка-заголовок, которая на наведении меняет формулировку, не
// сдвигая соседей. Обе надписи лежат в одной ячейке grid, поэтому ширина
// берётся по длинной из них и остаётся постоянной. Буквы уезжают не хором:
// чётные вверх, нечётные вниз, каждая со своей задержкой — получается
// перекидное табло, а короткое размытие прячет момент подмены.
const STYLES = `
:where([data-vibeui-block="text-001"]){
--vibeui-text-001-fg:light-dark(oklch(0.18 0 0),oklch(0.96 0 0));
--vibeui-text-001-muted:color-mix(in oklab,var(--vibeui-text-001-fg) 52%,transparent);
--vibeui-text-001-accent:light-dark(#1a1a1a,#f2f2f2);
/* Надпись под курсором берёт акцент. В тёмной теме он высветлен: чистый
   оранжевый на тёмном фоне читается тускло. */
--vibeui-text-001-accent-text:light-dark(var(--vibeui-text-001-accent),oklch(0.82 0 0));
--vibeui-text-001-line:light-dark(oklch(0 0 0 / 14%),oklch(1 0 0 / 16%));
--vibeui-text-001-align:center;
--vibeui-text-001-shift:115%;
--vibeui-text-001-blur:7px;
--vibeui-text-001-stagger:14ms;
--vibeui-text-001-travel:300ms;
--vibeui-text-001-fade:180ms;
/* Пружина без библиотеки: та же кривая, только выписанная точками. */
--vibeui-text-001-spring:linear(0,0.0371,0.1236,0.2323,0.3463,0.4555,0.5545,0.6411,0.7148,0.776,0.826,0.8663,0.8983,0.9234,0.9429,0.9578,0.9692,0.9778,0.9841,0.9888,0.9923,0.9947,0.9965,0.9978,0.9986,0.9992,0.9996,1,1,1);
--vibeui-text-001-ease:cubic-bezier(0.16,1,0.3,1);
--vibeui-text-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="text-001"]{color-scheme:dark}
/* Ссылка занимает ширину родителя, а надпись стоит по центру этой
   ширины: так она не липнет к краю ни в кадре витрины, ни в чужой
   секции. Прижать к краю — переопределить --vibeui-text-001-align.
   Курсор при этом ловит только сама надпись: растянутая на всю ширину
   ссылка иначе перекидывалась бы от наведения на пустое место сбоку. */
[data-vibeui-block="text-001"]{
display:flex;justify-content:var(--vibeui-text-001-align);
box-sizing:border-box;width:100%;pointer-events:none;
color:var(--vibeui-text-001-fg);font-family:var(--vibeui-text-001-font);
text-decoration:none;outline:none;
}
[data-vibeui-block="text-001"] *{box-sizing:border-box}
[data-vibeui-block="text-001"] [data-part="row"]{
display:inline-flex;align-items:center;gap:0.75rem;max-width:100%;
pointer-events:auto;cursor:pointer;
transition:color var(--vibeui-text-001-travel) var(--vibeui-text-001-ease);
padding-bottom:0.5rem;border-bottom:1px solid var(--vibeui-text-001-line);
font-size:clamp(1rem,7cqi,3rem);font-weight:550;line-height:1.1;
letter-spacing:-0.04em;
}
[data-vibeui-block="text-001"] [data-part="stage"]{display:inline-grid}
[data-vibeui-block="text-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="text-001"] [data-part="layers"]{
display:inline-grid;white-space:pre;
}
/* Оба слоя в одной ячейке: ширина берётся по длинной надписи и при
   подмене не прыгает, поэтому соседи по строке остаются на месте. */
[data-vibeui-block="text-001"] [data-part="layer"]{
grid-column:1;grid-row:1;display:inline-flex;white-space:pre;
}
[data-vibeui-block="text-001"] [data-part="cell"]{
display:inline-grid;overflow:hidden;vertical-align:bottom;
}
[data-vibeui-block="text-001"] [data-part="letter"]{
grid-column:1;grid-row:1;display:inline-block;
will-change:transform,filter,opacity;
transition:
transform var(--vibeui-text-001-travel) var(--vibeui-text-001-spring),
opacity var(--vibeui-text-001-fade) var(--vibeui-text-001-ease),
filter var(--vibeui-text-001-fade) var(--vibeui-text-001-ease);
}
/* Приезжающая надпись ждёт за краем своей коробки с противоположной
   стороны от той, куда уедет буква с тем же номером. */
[data-vibeui-block="text-001"] [data-state="in"] [data-part="letter"]{
transform:translateY(calc(var(--vibeui-text-001-shift) * var(--vibeui-text-001-dir)));
opacity:0;filter:blur(var(--vibeui-text-001-blur));
}
[data-vibeui-block="text-001"]:hover [data-state="out"] [data-part="letter"],
[data-vibeui-block="text-001"]:focus-visible [data-state="out"] [data-part="letter"]{
transform:translateY(calc(var(--vibeui-text-001-shift) * var(--vibeui-text-001-dir) * -1));
opacity:0;filter:blur(var(--vibeui-text-001-blur));
}
[data-vibeui-block="text-001"]:hover [data-state="in"] [data-part="letter"],
[data-vibeui-block="text-001"]:focus-visible [data-state="in"] [data-part="letter"]{
transform:translateY(0);opacity:1;filter:blur(0);
}
[data-vibeui-block="text-001"]:hover [data-part="row"],
[data-vibeui-block="text-001"]:focus-visible [data-part="row"]{
color:var(--vibeui-text-001-accent-text);
border-bottom-color:color-mix(in oklab,var(--vibeui-text-001-accent-text) 45%,transparent);
}
[data-vibeui-block="text-001"] [data-part="arrow"]{
flex:none;width:0.75em;height:0.75em;color:var(--vibeui-text-001-muted);
transition:transform 200ms var(--vibeui-text-001-ease),color 200ms var(--vibeui-text-001-ease);
}
[data-vibeui-block="text-001"]:hover [data-part="arrow"],
[data-vibeui-block="text-001"]:focus-visible [data-part="arrow"]{
transform:translate(0.1em,-0.1em);color:var(--vibeui-text-001-accent);
}
[data-vibeui-block="text-001"]:focus-visible [data-part="row"]{
border-bottom-color:var(--vibeui-text-001-accent);
outline:2px solid var(--vibeui-text-001-accent);outline-offset:6px;border-radius:2px;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="text-001"] [data-part="row"],
[data-vibeui-block="text-001"] [data-part="letter"],
[data-vibeui-block="text-001"] [data-part="arrow"]{transition:none}
}
`

/** Пробел внутри строки букв должен занимать место, а не схлопываться. */
function letters(text: string) {
  return [...text].map((character, index) => ({
    character: character === " " ? " " : character,
    key: `${index}-${character}`,
    // Чётные буквы уходят вверх, нечётные вниз: строка разъезжается
    // встречными потоками, а не уезжает целиком в одну сторону.
    direction: index % 2 === 0 ? 1 : -1,
    delay: index,
  }))
}

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-part="arrow"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}

/**
 * Ссылка-заголовок, меняющая надпись на наведении: буквы разъезжаются
 * встречно через короткое размытие, ширина остаётся прежней.
 * Один файл, ноль зависимостей, собственная палитра, без клиентского JS.
 */
export function Text001({
  text = "Смотреть работы",
  hoverText = "Открыть проекты",
  href = "#",
  arrow = true,
  accent,
  accentText,
  className,
  style,
  ...props
}: Text001Props) {
  const palette = {
    ...(accent ? { "--vibeui-text-001-accent": accent } : null),
    ...(accentText ? { "--vibeui-text-001-accent-text": accentText } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-text-001" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-vibeui-block="text-001"
        data-slot="text-swap"
        href={href}
        className={className}
        style={palette}
      >
        <span data-part="row">
          <span data-part="stage">
            <span data-part="sr">{text}</span>
            <span data-part="layers" aria-hidden="true">
              {(
                [
                  ["out", text],
                  ["in", hoverText],
                ] as const
              ).map(([state, value]) => (
                <span data-part="layer" data-state={state} key={state}>
                  {letters(value).map((letter) => (
                    <span data-part="cell" key={letter.key}>
                      <span
                        data-part="letter"
                        style={
                          {
                            "--vibeui-text-001-dir": letter.direction,
                            transitionDelay: `calc(var(--vibeui-text-001-stagger) * ${letter.delay})`,
                          } as CSSProperties
                        }
                      >
                        {letter.character}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </span>
          {arrow ? <ArrowIcon /> : null}
        </span>
      </a>
    </>
  )
}
