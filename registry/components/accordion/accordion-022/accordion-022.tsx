import type { ComponentProps, CSSProperties } from "react"

export type Accordion022Item = {
  question: string
  answer: string
}

export type Accordion022Props = Omit<ComponentProps<"div">, "children"> & {
  items?: readonly Accordion022Item[]
  /** Открытым остаётся только один раздел: группировка через атрибут name. */
  exclusive?: boolean
  /** Имя группы взаимного исключения: двум аккордеонам на странице нужны разные. */
  group?: string
  /** Номер раздела, открытого сразу. -1 — все закрыты. */
  defaultOpen?: number
  accent?: string
  /** Цвет текста. Пусто — чернильный по color-scheme окружения. */
  ink?: string
  /** Цвет подложки страницы, от которого считаются приглушённые тона; фона компонент не рисует. */
  background?: string
}

// Идея компонента: карточки на матовом стекле с инеем по краю, вместо плюса
// — снежинка, которая поворачивается при раскрытии. Раскладка в две колонки
// от ширины компонента.
const STYLES = `
:where([data-vibeui-block="accordion-022"]){
--vibeui-accordion-022-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-accordion-022-card:light-dark(#ffffff,#242424);
--vibeui-accordion-022-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-022-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-accordion-022-line:light-dark(color-mix(in oklab,var(--vibeui-accordion-022-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-accordion-022-fg) 24%,transparent));
--vibeui-accordion-022-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-022-silver:#9fb0c8;
--vibeui-accordion-022-display:"Cormorant Garamond",Georgia,serif;
--vibeui-accordion-022-script:"Marck Script","Segoe Script",cursive;
--vibeui-accordion-022-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-022"]{color-scheme:dark}
[data-vibeui-block="accordion-022"] [data-part="deck"]{display:grid;gap:.8rem}
[data-vibeui-block="accordion-022"] details{position:relative;border:1px solid var(--vibeui-accordion-022-line);border-radius:.9rem;background:var(--vibeui-accordion-022-card);overflow:hidden;transition:border-color .35s,box-shadow .35s}
[data-vibeui-block="accordion-022"] details::before{content:"";position:absolute;inset:0;background:radial-gradient(30% 40% at 0 0,rgb(242 238 230 / .08),transparent 70%),radial-gradient(25% 35% at 100% 100%,rgb(242 238 230 / .06),transparent 70%);pointer-events:none}
[data-vibeui-block="accordion-022"] details[open]{border-color:rgb(242 182 79 / .45);box-shadow:0 0 0 1px rgb(242 182 79 / .12),0 0 40px -10px rgb(242 182 79 / .4)}
[data-vibeui-block="accordion-022"] details::details-content{block-size:0;overflow:hidden;opacity:0;transition:block-size .45s cubic-bezier(.2,.9,.3,1),opacity .35s,content-visibility .45s allow-discrete}
[data-vibeui-block="accordion-022"] details[open]::details-content{block-size:auto;opacity:1}
[data-vibeui-block="accordion-022"] summary{position:relative;display:grid;grid-template-columns:1.6rem minmax(0,1fr);align-items:center;gap:1rem;padding:1.1rem 1.3rem;cursor:pointer;list-style:none;font-family:var(--vibeui-accordion-022-display);font-size:1.35rem;font-weight:500;line-height:1.2}
[data-vibeui-block="accordion-022"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-022"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-022-accent);outline-offset:-4px;border-radius:.9rem}
[data-vibeui-block="accordion-022"] [data-part="mark"]{width:1.6rem;height:1.6rem;fill:none;stroke:var(--vibeui-accordion-022-silver);stroke-width:1.4;stroke-linecap:round;transition:transform .5s cubic-bezier(.2,.9,.3,1),stroke .35s,filter .35s}
[data-vibeui-block="accordion-022"] details[open] [data-part="mark"]{transform:rotate(90deg);stroke:var(--vibeui-accordion-022-accent);filter:drop-shadow(0 0 6px var(--vibeui-accordion-022-accent))}
[data-vibeui-block="accordion-022"] [data-part="answer"]{margin:0;padding:0 1.3rem 1.3rem 3.9rem;font-size:.95rem;color:var(--vibeui-accordion-022-muted);animation:vibeui-accordion-022-in .4s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-accordion-022-in{from{opacity:0;transform:translateY(-.3rem)}}
@container (min-width:56rem){
[data-vibeui-block="accordion-022"] [data-part="deck"]{grid-template-columns:1fr 1fr;gap:1rem;align-items:start}
}
[data-vibeui-block="accordion-022"]{width:100%;min-width:min(100%,16rem);box-sizing:border-box;color:var(--vibeui-accordion-022-fg);font-family:var(--vibeui-accordion-022-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="accordion-022"] *{box-sizing:border-box}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-022"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion022Item[] = [
  { question: "Холодно ли будет?", answer: "В доме тепло: камин и печь. На террасе и в лесу — минус, но там пледы, глинтвейн и по двадцать минут. Тёплая обувь и куртка нужны только для фейерверка." },
  { question: "Можно с детьми?", answer: "Да. Будет няня, детская комната с мультиками и отдельное меню. Отметьте возраст в ответе — поставим стульчик." },
  { question: "Где спать?", answer: "В доме двенадцать комнат — бесплатно для гостей, по ответам в анкете. Кому не хватит — гостевой дом в трёх минутах, забронируем по нашей цене." },
  { question: "Куда ставить машину?", answer: "Под навесом на двадцать машин, ещё столько же у ворот. Охрана покажет. Утром щётка от снега у охраны же." },
  { question: "Что с телефонами на церемонии?", answer: "В карман на двадцать минут. Фотограф и видеограф снимут всё, а вы посмотрите на нас, а не в экран." },
  { question: "Во сколько всё закончится?", answer: "Фейерверк в 23:00, полночь — финальный танец. Трансфер обратно в 00:30 и 01:00; кто остаётся — завтрак в 10:00." },
  { question: "Что подарить?", answer: "Цветы в декабре замёрзнут по дороге. Если хочется — вклад «на камин», реквизиты в разделе «Подарки». Или просто приезжайте." },
  { question: "Дресс-код строгий?", answer: "Скорее тёплый: бархат, шерсть, глубокие цвета. Главное — чтобы вам было удобно танцевать и выходить на снег." },
]

/**
 * Аккордеон на стекле с инеем и снежинкой-маркером.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion022({
  items = DEFAULT_ITEMS,
  exclusive = true,
  group = "vibeui-accordion-022",
  defaultOpen = -1,
  accent,
  ink = "",
  background = "",
  className,
  style,
  ...props
}: Accordion022Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-022-accent": accent } : null),
    ...(ink ? { "--vibeui-accordion-022-fg": ink } : null),
    ...(background ? { "--vibeui-accordion-022-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-022" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-022"
        className={className}
        style={palette}
      >
        <div data-part="deck">
          {items.map((item, index) => (
            <details
              key={item.question}
              name={exclusive ? group : undefined}
              open={index === defaultOpen}
            >
              <summary>
                <svg data-part="mark" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4M12 3l-2 2M12 3l2 2M12 21l-2-2M12 21l2-2M3 12l2-2M3 12l2 2M21 12l-2-2M21 12l-2 2" />
                </svg>
                <span>{item.question}</span>
              </summary>
              <p data-part="answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  )
}
