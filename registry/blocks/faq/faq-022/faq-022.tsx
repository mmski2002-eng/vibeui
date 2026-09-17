import { useId, type CSSProperties } from "react"

export type Faq022Item = { question: string; answer: string }

export type Faq022Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Faq022Item[]
  askText?: string
  askLabel?: string
  askHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Вопросы зимней свадьбы: аккордеон на стекле с инеем, маркер — снежинка,
// которая поворачивается при открытии и загорается тёплым; открытая
// карточка светится как окно. Один открыт за раз через name у details,
// без JS. Две колонки от 56rem.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="faq-022"]){
--vibeui-faq-022-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-faq-022-card:light-dark(#ffffff,#242424);
--vibeui-faq-022-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-022-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-faq-022-line:light-dark(color-mix(in oklab,var(--vibeui-faq-022-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-faq-022-fg) 24%,transparent));
--vibeui-faq-022-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-022-silver:#9fb0c8;
--vibeui-faq-022-display:"Cormorant Garamond",Georgia,serif;
--vibeui-faq-022-script:"Marck Script","Segoe Script",cursive;
--vibeui-faq-022-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-022"]{color-scheme:dark}
:where([data-vibeui-block="faq-022"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="faq-022"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="faq-022"]{box-sizing:border-box;display:block;background:var(--vibeui-faq-022-bg);color:var(--vibeui-faq-022-fg);font-family:var(--vibeui-faq-022-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="faq-022"] *{box-sizing:border-box}
[data-vibeui-block="faq-022"] a{color:inherit}
[data-vibeui-block="faq-022"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="faq-022"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-faq-022-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-faq-022-silver)}
[data-vibeui-block="faq-022"] [data-part="title"]{margin:0;font-family:var(--vibeui-faq-022-display);font-size:clamp(2.2rem,5.5cqi,3.8rem);font-weight:500;line-height:1.05}
[data-vibeui-block="faq-022"] [data-part="lede"]{max-width:36rem;margin:1rem 0 0;color:var(--vibeui-faq-022-muted)}
[data-vibeui-block="faq-022"] [data-part="ask"]{margin:1rem 0 0;font-family:var(--vibeui-faq-022-script);font-size:1.25rem;color:var(--vibeui-faq-022-muted)}
[data-vibeui-block="faq-022"] [data-part="ask"] a{color:var(--vibeui-faq-022-accent);text-decoration:none;border-bottom:1px solid rgb(242 182 79 / .4)}
[data-vibeui-block="faq-022"] [data-part="grid"]{display:grid;gap:.8rem;margin-top:2.5rem}
[data-vibeui-block="faq-022"] details{position:relative;border:1px solid var(--vibeui-faq-022-line);border-radius:.9rem;background:var(--vibeui-faq-022-card);overflow:hidden;transition:border-color .35s,box-shadow .35s}
[data-vibeui-block="faq-022"] details::before{content:"";position:absolute;inset:0;background:radial-gradient(30% 40% at 0 0,rgb(242 238 230 / .08),transparent 70%),radial-gradient(25% 35% at 100% 100%,rgb(242 238 230 / .06),transparent 70%);pointer-events:none}
[data-vibeui-block="faq-022"] details[open]{border-color:rgb(242 182 79 / .45);box-shadow:0 0 0 1px rgb(242 182 79 / .12),0 0 40px -10px rgb(242 182 79 / .4)}
[data-vibeui-block="faq-022"] summary{position:relative;display:grid;grid-template-columns:1.6rem minmax(0,1fr);align-items:center;gap:1rem;padding:1.1rem 1.3rem;cursor:pointer;list-style:none;font-family:var(--vibeui-faq-022-display);font-size:1.35rem;font-weight:500;line-height:1.2}
[data-vibeui-block="faq-022"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="faq-022"] summary:focus-visible{outline:2px solid var(--vibeui-faq-022-accent);outline-offset:-4px;border-radius:.9rem}
[data-vibeui-block="faq-022"] [data-part="mark"]{width:1.6rem;height:1.6rem;fill:none;stroke:var(--vibeui-faq-022-silver);stroke-width:1.4;stroke-linecap:round;transition:transform .5s cubic-bezier(.2,.9,.3,1),stroke .35s,filter .35s}
[data-vibeui-block="faq-022"] details[open] [data-part="mark"]{transform:rotate(90deg);stroke:var(--vibeui-faq-022-accent);filter:drop-shadow(0 0 6px var(--vibeui-faq-022-accent))}
[data-vibeui-block="faq-022"] [data-part="answer"]{margin:0;padding:0 1.3rem 1.3rem 3.9rem;font-size:.95rem;color:var(--vibeui-faq-022-muted);animation:vibeui-faq-022-in .4s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-faq-022-in{from{opacity:0;transform:translateY(-.3rem)}}
@container (min-width:56rem){
[data-vibeui-block="faq-022"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="faq-022"] [data-part="grid"]{grid-template-columns:1fr 1fr;gap:1rem;align-items:start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-022"] *{animation:none!important;transition:none!important}}`

/** Вопросы зимней свадьбы: аккордеон на стекле с инеем, маркер-снежинка поворачивается и загорается, один открыт за раз. */
export function Faq022({
  eyebrow = "Вопросы",
  title = "Что спрашивают перед зимой",
  lede = "Всё, о чём нас спросили в последний месяц. Нет ответа — напишите Марине, она отвечает быстрее нас.",
  items = [
    { question: "Холодно ли будет?", answer: "В доме тепло: камин и печь. На террасе и в лесу — минус, но там пледы, глинтвейн и по двадцать минут. Тёплая обувь и куртка нужны только для фейерверка." },
    { question: "Можно с детьми?", answer: "Да. Будет няня, детская комната с мультиками и отдельное меню. Отметьте возраст в ответе — поставим стульчик." },
    { question: "Где спать?", answer: "В доме двенадцать комнат — бесплатно для гостей, по ответам в анкете. Кому не хватит — гостевой дом в трёх минутах, забронируем по нашей цене." },
    { question: "Куда ставить машину?", answer: "Под навесом на двадцать машин, ещё столько же у ворот. Охрана покажет. Утром щётка от снега у охраны же." },
    { question: "Что с телефонами на церемонии?", answer: "В карман на двадцать минут. Фотограф и видеограф снимут всё, а вы посмотрите на нас, а не в экран." },
    { question: "Во сколько всё закончится?", answer: "Фейерверк в 23:00, полночь — финальный танец. Трансфер обратно в 00:30 и 01:00; кто остаётся — завтрак в 10:00." },
    { question: "Что подарить?", answer: "Цветы в декабре замёрзнут по дороге. Если хочется — вклад «на камин», реквизиты в разделе «Подарки». Или просто приезжайте." },
    { question: "Дресс-код строгий?", answer: "Скорее тёплый: бархат, шерсть, глубокие цвета. Главное — чтобы вам было удобно танцевать и выходить на снег." },
  ],
  askText = "Не нашли ответ?",
  askLabel = "Напишите Марине",
  askHref = "#people",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Faq022Props) {
  const group = useId()
  const palette = {
    ...(accent ? { "--vibeui-faq-022-accent": accent } : null),
    ...(ink ? { "--vibeui-faq-022-fg": ink } : null),
    ...(background ? { "--vibeui-faq-022-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-faq-022" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-022" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          {askLabel ? (
            <p data-part="ask">
              {askText} <a href={askHref}>{askLabel}</a>
            </p>
          ) : null}
          <div data-part="grid">
            {items.map((item) => (
              <details key={item.question} name={group}>
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
      </section>
    </>
  )
}
