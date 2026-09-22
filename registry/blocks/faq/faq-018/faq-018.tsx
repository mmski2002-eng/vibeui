import { useId, type CSSProperties } from "react"

import {
  Accordion018,
  type Accordion018Item,
} from "@/registry/components/accordion/accordion-018/accordion-018"

export type Faq018Item = Accordion018Item

export type Faq018Props = {
  eyebrow?: string
  title?: string
  items?: readonly Faq018Item[]
  /** Подпись и ссылка справа: «Не нашли ответ? Напишите». */
  askText?: string
  askLabel?: string
  askHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  openFirst?: boolean
  background?: string
  className?: string
  style?: CSSProperties
}

// Вопросы фестиваля: две колонки details, у каждого вопроса цветной кружок,
// открытый вопрос заливается светло-серым и кружок растёт. Открыт один за
// раз (name у details). Справа сверху капсула «Напишите». Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="faq-018"]){
--vibeui-faq-018-bg:light-dark(#ffffff,#0e0f12);
--vibeui-faq-018-fg:light-dark(#111111,#f4f4f5);
--vibeui-faq-018-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-faq-018-line:light-dark(#e8e8ea,#26272d);
--vibeui-faq-018-chip:light-dark(#f1f1f3,#1f2026);
--vibeui-faq-018-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-018-on-accent:oklch(from var(--vibeui-faq-018-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-faq-018-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-faq-018-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-018"]{color-scheme:dark}
:where([data-vibeui-block="faq-018"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="faq-018"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="faq-018"]{box-sizing:border-box;display:block;background:var(--vibeui-faq-018-bg);color:var(--vibeui-faq-018-fg);font-family:var(--vibeui-faq-018-font);font-size:1rem;line-height:1.45}
[data-vibeui-block="faq-018"] *{box-sizing:border-box}
[data-vibeui-block="faq-018"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2rem 1.25rem 3rem}
/* Список вопросов — accordion-018, ему отдаётся вся колонка. */
[data-vibeui-block="faq-018"] [data-part="grid"]{width:100%;max-width:none}
[data-vibeui-block="faq-018"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-faq-018-line)}
[data-vibeui-block="faq-018"] [data-part="eyebrow"]{margin:0;font-size:1.05rem}
[data-vibeui-block="faq-018"] [data-part="ask"]{display:inline-flex;align-items:center;gap:.6rem;font-size:.95rem;color:var(--vibeui-faq-018-muted)}
[data-vibeui-block="faq-018"] [data-part="ask"] a{display:inline-flex;align-items:center;height:2.4rem;padding:0 1rem;border-radius:999px;background:var(--vibeui-faq-018-accent);color:var(--vibeui-faq-018-on-accent);font-weight:600;text-decoration:none;transition:transform .2s}
[data-vibeui-block="faq-018"] [data-part="ask"] a:hover{transform:translateY(-2px)}
[data-vibeui-block="faq-018"] [data-part="title"]{margin:.5rem 0 1.5rem;font-family:var(--vibeui-faq-018-display);font-size:clamp(1.6rem,3.4cqi,2.4rem);font-weight:600;letter-spacing:-.03em;line-height:1.1}
to{opacity:1;transform:none}}
@container (min-width: 56rem){
[data-vibeui-block="faq-018"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-018"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Faq018Item[] = [
  { question: "Можно ли прийти с детьми?", answer: "Да. Детям до 7 лет вход бесплатный с любым билетом, на Детской поляне работают аниматоры и мастерские с 11:00 до 19:00, есть тихая зона и пеленальные.", color: "#98f5af" },
  { question: "Что бесплатно, а что по билету?", answer: "Фуд-корт, маркет, лекторий, утренняя йога и велопарад открыты для всех. Сцены, кино и ночная программа — по браслету.", color: "#c2df37" },
  { question: "Что будет, если пойдёт дождь?", answer: "Главная сцена и лекторий под навесами, фуд-корт под зонтами. Отмена возможна только при штормовом предупреждении — тогда билеты вернём полностью.", color: "#464dff" },
  { question: "Можно ли приносить свою еду и воду?", answer: "Воду в пластиковых бутылках — да, на всех площадках есть бесплатные питьевые фонтаны. Еду и стекло — нет.", color: "#ffe2d6" },
  { question: "Как вернуть билет?", answer: "До 15 августа — полностью, через личный кабинет за минуту. Позже — только передача браслета другому человеку.", color: "#ffa5b1" },
  { question: "Пускают ли с собаками?", answer: "На поводке и с водой для собаки — да, кроме зоны Главной сцены после 20:00: там громко.", color: "#f3c37d" },
  { question: "Есть ли доступная среда?", answer: "Все входы без ступеней, у сцен выделены зоны для колясок, лекторий переводят на РЖЯ. Сопровождающий проходит бесплатно.", color: "#9854d1" },
  { question: "Где парковаться?", answer: "У парка парковок нет. Оставьте машину на перехватывающей у метро «Парк культуры» или приезжайте на велосипеде — стоянки у каждого входа.", color: "#d9cafe" },
]

/** Вопросы фестиваля: две колонки раскрывающихся вопросов с цветными маркерами и капсулой «Напишите». */
export function Faq018({
  eyebrow = "Вопросы",
  title = "Что спрашивают перед фестивалем",
  items = DEFAULT_ITEMS,
  askText = "Не нашли ответ?",
  askLabel = "Напишите в Telegram",
  askHref = "https://t.me/",
  tone = "auto",
  accent,
  openFirst = false,
  background,
  className,
  style,
}: Faq018Props) {
  const group = useId()
  const palette = {
    ...(accent ? { "--vibeui-faq-018-accent": accent } : null),
    ...(background ? { "--vibeui-faq-018-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-faq-018" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-018" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            {askLabel ? (
              <p data-part="ask">
                {askText ? <span>{askText}</span> : null}
                <a href={askHref}>{askLabel}</a>
              </p>
            ) : null}
          </div>
          <h2 data-part="title">{title}</h2>
          <Accordion018
            defaultOpen={openFirst ? 0 : -1}
            data-part="grid"
            items={items}
            group={group}
            accent={accent}
            background={background}
          />
        </div>
      </section>
    </>
  )
}
