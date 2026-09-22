import { useId, type CSSProperties } from "react"

import {
  Accordion021,
  type Accordion021Item,
} from "@/registry/components/accordion/accordion-021/accordion-021"

export type Faq021Item = Accordion021Item

export type Faq021Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Faq021Item[]
  askText?: string
  askLabel?: string
  askHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  openFirst?: boolean
  background?: string
  className?: string
  style?: CSSProperties
}

// Вопросы гостей — багажные бирки: у каждой слева цветной хвостик с
// меткой темы и «дырочкой» под шнурок, вопрос узким капсом, крестик
// справа. Открытая бирка приподнимается и показывает ответ; открыта одна за
// раз (name у details). Две колонки от 56rem. Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="faq-021"]){
--vibeui-faq-021-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-faq-021-sand:light-dark(#f4f4f4,#242424);
--vibeui-faq-021-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-021-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-faq-021-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-faq-021-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-021-sea:#2aa7a0;
--vibeui-faq-021-sun:#f2c14e;
--vibeui-faq-021-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-faq-021-script:"Lobster","Brush Script MT",cursive;
--vibeui-faq-021-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-021"]{color-scheme:dark}
:where([data-vibeui-block="faq-021"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="faq-021"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="faq-021"]{box-sizing:border-box;display:block;background:var(--vibeui-faq-021-bg);color:var(--vibeui-faq-021-fg);font-family:var(--vibeui-faq-021-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="faq-021"] *{box-sizing:border-box}
[data-vibeui-block="faq-021"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
/* Список вопросов — accordion-021, ему отдаётся вся колонка. */
[data-vibeui-block="faq-021"] [data-part="grid"]{width:100%;max-width:none}
[data-vibeui-block="faq-021"] [data-part="head"]{display:grid;gap:.6rem;max-width:40rem;margin-bottom:2rem}
[data-vibeui-block="faq-021"] [data-part="eyebrow"]{margin:0;font-family:var(--vibeui-faq-021-display);font-size:.8rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-faq-021-accent)}
[data-vibeui-block="faq-021"] [data-part="title"]{margin:0;font-family:var(--vibeui-faq-021-display);font-size:clamp(2.2rem,6cqi,4.2rem);font-weight:700;line-height:.98;text-transform:uppercase}
[data-vibeui-block="faq-021"] [data-part="lede"]{margin:0;color:var(--vibeui-faq-021-muted)}
[data-vibeui-block="faq-021"] [data-part="ask"]{margin:.4rem 0 0;font-size:.95rem;color:var(--vibeui-faq-021-muted)}
[data-vibeui-block="faq-021"] [data-part="ask"] a{color:var(--vibeui-faq-021-fg);font-weight:600;text-decoration:none;border-bottom:2px solid var(--vibeui-faq-021-accent);transition:color .25s}
[data-vibeui-block="faq-021"] [data-part="ask"] a:hover{color:var(--vibeui-faq-021-accent)}
}
@container (min-width:56rem){
[data-vibeui-block="faq-021"] [data-part="shell"]{padding:5rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-021"] *{animation:none!important;transition:none!important}}`

/** Вопросы гостей свадьбы за границей багажными бирками: цветной хвостик с темой, один открыт за раз, две колонки. */
export function Faq021({
  eyebrow = "Вопросы",
  title = "Перед вылетом спрашивают",
  lede = "Собрали всё, что нам писали за последний месяц. Нет ответа — Мариэла на связи.",
  items = [
    { tag: "виза", question: "Нужна ли виза?", answer: "Нет. Россиянам — до 90 дней без визы, нужен только загранпаспорт, действующий ещё полгода после поездки." },
    { tag: "деньги", question: "Чем платить?", answer: "Наличными: доллары или евро, менять понемногу в отеле. Карты наших банков не работают, Apple Pay тоже." },
    { tag: "связь", question: "Будет ли интернет?", answer: "Медленный и в основном в отеле. Оформите eSIM Cubacel заранее — или отдохните от него три дня." },
    { tag: "солнце", question: "Насколько жарко?", answer: "Февраль — лучший месяц: +28° днём, +21° вечером, почти без дождей. Крем SPF 50 и шляпа обязательны." },
    { tag: "море", question: "Можно купаться после церемонии?", answer: "Нужно. Ужин начинается в 18:00, между церемонией и ужином — море и закат." },
    { tag: "дети", question: "Можно с детьми?", answer: "Да. На пляже безопасно и мелко, в отеле есть детские кроватки. Напишите возраст в анкете." },
    { tag: "рейс", question: "Сколько лететь?", answer: "Прямой рейс — около 13 часов. Есть варианты через Стамбул с пересадкой, но мы летим прямым." },
    { tag: "подарки", question: "Что везти в подарок?", answer: "Себя и загар. Если хочется — вклад в наш следующий рейс, реквизиты в разделе «Подарки». Цветы не переживут перелёт." },
  ],
  askText = "Не нашли ответ?",
  askLabel = "Напишите Мариэле",
  askHref = "#travel",
  tone = "auto",
  accent,
  ink,
  openFirst = false,
  background,
  className,
  style,
}: Faq021Props) {
  const group = useId()
  const palette = {
    ...(accent ? { "--vibeui-faq-021-accent": accent } : null),
    ...(ink ? { "--vibeui-faq-021-fg": ink } : null),
    ...(background ? { "--vibeui-faq-021-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-faq-021" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-021" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {askLabel ? (
              <p data-part="ask">
                {askText} <a href={askHref}>{askLabel}</a>
              </p>
            ) : null}
          </div>
          <Accordion021
            defaultOpen={openFirst ? 0 : -1}
            data-part="grid"
            items={items}
            group={group}
            accent={accent}
            ink={ink}
            background={background}
          />
        </div>
      </section>
    </>
  )
}
