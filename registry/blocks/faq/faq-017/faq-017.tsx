import { useId, type CSSProperties } from "react"

import {
  Accordion017,
  type Accordion017Item,
} from "@/registry/components/accordion/accordion-017/accordion-017"
import { Button016 } from "@/registry/components/button/button-016/button-016"
import { Card024 } from "@/registry/components/card/card-024/card-024"

export type Faq017Item = Accordion017Item

export type Faq017Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Faq017Item[]
  /** Карточка «не нашли ответ»: подпись и ссылка на мессенджер. */
  askTitle?: string
  askText?: string
  askLabel?: string
  askHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  openFirst?: boolean
  tint?: "neutral" | "accent"
  background?: string
  className?: string
  style?: CSSProperties
}

// Вопросы о курсе: две колонки — слева заголовок и карточка «спросить в
// Telegram», справа аккордеон на details с общим name (открыт один ответ),
// плюс превращается в крест, открытый вопрос подсвечивается акцентом слева.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="faq-017"]){
--vibeui-faq-017-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-faq-017-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-017-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-faq-017-card:light-dark(#f8fafc,#242424);
--vibeui-faq-017-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-faq-017-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-017-on-accent:oklch(from var(--vibeui-faq-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-faq-017-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-faq-017-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-017"]{color-scheme:dark}
:where([data-vibeui-block="faq-017"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="faq-017"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="faq-017"]{box-sizing:border-box;display:block;background:var(--vibeui-faq-017-bg);color:var(--vibeui-faq-017-fg);font-family:var(--vibeui-faq-017-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="faq-017"] *{box-sizing:border-box}
[data-vibeui-block="faq-017"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2rem}
/* Список вопросов — accordion-017, ему отдаётся вся колонка. */
[data-vibeui-block="faq-017"] [data-part="list"]{width:100%;max-width:none}
[data-vibeui-block="faq-017"] [data-part="ask"]{margin-top:1.5rem}
[data-vibeui-block="faq-017"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-faq-017-accent);font-weight:700}
[data-vibeui-block="faq-017"] [data-part="heading"]{margin:0;font-family:var(--vibeui-faq-017-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="faq-017"] [data-part="lede"]{margin:.75rem 0 0;max-width:26rem;color:var(--vibeui-faq-017-muted)}
to{opacity:1;transform:none}}
@container (min-width: 56rem){
[data-vibeui-block="faq-017"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:4rem;padding:5.5rem 2rem;align-items:start}
[data-vibeui-block="faq-017"] [data-part="head"]{position:sticky;top:6rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-017"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Faq017Item[] = [
  { question: "Что если я не потяну темп?", answer: "Пять-семь часов в неделю — норма. Если выпадаете, куратор перенесёт дедлайн, а записи и чат остаются на год: можно догнать со следующим потоком бесплатно." },
  { question: "Нужен ли опыт в дизайне?", answer: "Нет. Первые две недели рассчитаны на тех, кто открывает Figma впервые. Тем, кто уже умеет, эти уроки помогут закрыть пробелы в автолейауте и компонентах." },
  { question: "Будет ли сертификат?", answer: "Да, именной сертификат после защиты проекта. Он ничего не «гарантирует» работодателю — гарантирует ваш кейс, и мы помогаем его оформить." },
  { question: "Можно ли вернуть деньги?", answer: "В первые семь дней — полностью, без объяснений. Дальше — пропорционально пройденному, по договору оферты." },
  { question: "Как работает рассрочка?", answer: "Без переплаты, от банка-партнёра, на 6 месяцев. Одобрение за пару минут при оформлении, курс открывается сразу." },
  { question: "Какая нужна техника?", answer: "Любой ноутбук последних пяти лет и бесплатный тариф Figma. Планшет не подойдёт: нет полноценного редактора." },
]

/** Вопросы о курсе: аккордеон на details, липкий заголовок и карточка «спросить». */
export function Faq017({
  eyebrow = "Вопросы",
  title = "Что спрашивают перед оплатой",
  lede = "Про темп, опыт, сертификат, деньги и технику. Остальное — в Telegram, отвечаем в течение часа.",
  items = DEFAULT_ITEMS,
  askTitle = "Не нашли ответ?",
  askText = "Напишите куратору набора — расскажет, подходит ли курс именно вам.",
  askLabel = "Спросить в Telegram",
  askHref = "https://t.me/",
  tone = "auto",
  accent,
  ink,
  openFirst = false,
  tint = "accent",
  background,
  className,
  style,
}: Faq017Props) {
  const group = useId()
  const palette = {
    ...(accent ? { "--vibeui-faq-017-accent": accent } : null),
    ...(ink ? { "--vibeui-faq-017-fg": ink } : null),
    ...(background ? { "--vibeui-faq-017-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-faq-017" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-017" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="heading">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {askTitle ? (
              <Card024
                tint={tint}
                data-part="ask"
                title={askTitle}
                text={askText}
                note=""
                accent={accent}
                ink={ink}
                background={background}
              >
                {askLabel ? (
                  <Button016
                    label={askLabel}
                    href={askHref}
                    external
                    size="lg"
                    externalHint="(откроется в новой вкладке)"
                    tone="accent"
                    accent={accent}
                  />
                ) : null}
              </Card024>
            ) : null}
          </div>
          <Accordion017
            defaultOpen={openFirst ? 0 : -1}
            data-part="list"
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
