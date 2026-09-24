import type { CSSProperties, ReactNode } from "react"

import {
  Accordion023,
  type Accordion023Item,
} from "@/registry/components/accordion/accordion-023/accordion-023"
import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Faq023Item = Accordion023Item

export type Faq023Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Faq023Item[]
  contactLabel?: string
  /** Значок перед подписью кнопки: логотип мессенджера. */
  contactIcon?: ReactNode
  contactHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  openFirst?: boolean
  buttonTone?: "neutral" | "accent"
  background?: string
  className?: string
  style?: CSSProperties
}

// Составной блок: список вопросов — accordion-023 (плитки с плюсом-крестиком,
// один открыт, высота анимируется), «задать вопрос» — button-016. Блок
// владеет раскладкой в две колонки и заголовком; частям уходят пропсы
// accent/ink/background, их палитры не трогает.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"

const STYLES = `
:where([data-vibeui-block="faq-023"]){
--vibeui-faq-023-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-faq-023-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-023-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-023-muted:color-mix(in oklab,var(--vibeui-faq-023-fg) 60%,var(--vibeui-faq-023-bg));
--vibeui-faq-023-line:color-mix(in oklab,var(--vibeui-faq-023-fg) 12%,transparent);
--vibeui-faq-023-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-023"]{color-scheme:dark}
:where([data-vibeui-block="faq-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="faq-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="faq-023"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-faq-023-bg);color:var(--vibeui-faq-023-fg);font-family:var(--vibeui-faq-023-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="faq-023"] *{box-sizing:border-box}
[data-vibeui-block="faq-023"] [data-part="contact"]{margin-top:1.4rem}
[data-vibeui-block="faq-023"] [data-part="list"]{margin:0}
[data-vibeui-block="faq-023"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="faq-023"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:600;color:var(--vibeui-faq-023-accent)}
[data-vibeui-block="faq-023"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,5cqi,3.4rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="faq-023"] [data-part="lede"]{margin:1rem 0 0;max-width:26rem;color:var(--vibeui-faq-023-muted)}
[data-vibeui-block="faq-023"] [data-part="contact"]{margin-top:1.4rem}
/* Список — accordion-023, кнопка — button-016: им отдаётся ширина колонки. */
[data-vibeui-block="faq-023"] [data-part="list"]{width:100%;max-width:none}
@container (min-width: 56rem){[data-vibeui-block="faq-023"] [data-part="shell"]{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:4rem;align-items:start}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-023"] *{transition:none!important}}`

const DEFAULT_ITEMS: Faq023Item[] = [
  { question: "Приложение слушает меня всю ночь?", answer: "Только микрофоном и только на телефоне: звук не записывается и никуда не отправляется, анализируется ритм дыхания. Можно выключить — тогда фазы считаются по движению." },
  { question: "Что будет после 7 дней премиума?", answer: "Ничего страшного: премиум-функции закроются, бесплатные останутся навсегда. Мы напомним за день до конца пробного периода." },
  { question: "Работает без интернета?", answer: "Да, полностью. Синхронизация между устройствами — когда сеть появится." },
  { question: "Есть версия для часов?", answer: "Для Apple Watch и Wear OS — будильник и дыхание на запястье. Виджет с серией — в следующем обновлении." },
  { question: "Можно ли отменить подписку?", answer: "В любой момент в настройках магазина. Деньги за неиспользованный период вернут по правилам App Store и Google Play." },
]

/** Вопросы аккордеоном accordion-023 с плюсом-крестиком и кнопкой button-016. */
export function Faq023({
  eyebrow = "Вопросы",
  title = "Спрашивают перед установкой",
  lede = "Коротко о приватности, деньгах и часах. Не нашли ответ — напишите, отвечаем за день.",
  items = DEFAULT_ITEMS,
  contactLabel = "Задать вопрос",
  contactIcon,
  contactHref = "#",
  tone = "auto",
  accent,
  ink,
  openFirst = true,
  buttonTone = "neutral",
  background,
  className,
  style,
}: Faq023Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-023-accent": accent } : null),
    ...(ink ? { "--vibeui-faq-023-fg": ink } : null),
    ...(background ? { "--vibeui-faq-023-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-faq-023" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-023" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {contactLabel ? (
              <Button016
                tone={buttonTone}
                data-part="contact"
                label={contactLabel}
                icon={contactIcon}
                href={contactHref}
                external={false}
                size="lg"
                accent={accent}
              />
            ) : null}
          </div>
          <Accordion023
            defaultOpen={openFirst ? 0 : -1}
            data-part="list"
            items={items}
            accent={accent}
            ink={ink}
            background={background}
          />
        </div>
      </section>
    </>
  )
}
