import type { CSSProperties } from "react"

import { Background006 } from "@/registry/animations/background/background-006/background-006"
import { About013 } from "@/registry/blocks/about/about-013/about-013"
import { Contact020 } from "@/registry/blocks/contact/contact-020/contact-020"
import { Cta023 } from "@/registry/blocks/cta/cta-023/cta-023"
import { Event013 } from "@/registry/blocks/events/event-013/event-013"
import { Event014 } from "@/registry/blocks/events/event-014/event-014"
import { Faq022 } from "@/registry/blocks/faq/faq-022/faq-022"
import { Footer026 } from "@/registry/blocks/footer/footer-026/footer-026"
import { Hero027 } from "@/registry/blocks/hero/hero-027/hero-027"
import { Map009 } from "@/registry/blocks/map/map-009/map-009"
import { Navbar027 } from "@/registry/blocks/navbar/navbar-027/navbar-027"
import { Portfolio010 } from "@/registry/blocks/portfolio/portfolio-010/portfolio-010"
import { People011 } from "@/registry/blocks/team/people-011/people-011"
import { Testimonials022 } from "@/registry/blocks/testimonials/testimonials-022/testimonials-022"

/**
 * Сценарий «Зимняя свадьба при свечах»: синяя ночь, свечи, снег на всём
 * сайте. Cormorant Garamond + Marck Script + Manrope. Свеча на входе,
 * дом в лесу, история-гирлянда, программа с луной, письмо-ответ.
 * Витрина результата, не шаблон.
 */
export const metadata = {
  title: "Валерия и Дмитрий — 18 декабря 2027, Лесная усадьба",
  description:
    "Демо сценария «Зимняя свадьба при свечах» VibeUI: свеча на входе, снег на всём сайте, дом в лесу, история-гирлянда, программа от заката до полуночи, дресс-код, карта, письмо-ответ, вопросы, галерея в окнах, подарки и записки на стекле.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0b1220",
  color: "#f2eee6",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

const dark = { tone: "dark" } as const

const IMG = "/demo/wedding-winter/"

const GALLERY = [
  { src: `${IMG}gallery-01.webp`, caption: "Дорога в лес", shape: "wide" },
  { src: `${IMG}gallery-02.webp`, caption: "Снег на ресницах", shape: "tall" },
  { src: `${IMG}gallery-03.webp`, caption: "Глинтвейн", shape: "square" },
  { src: `${IMG}gallery-04.webp`, caption: "Дрова", shape: "tall" },
  { src: `${IMG}gallery-05.webp`, caption: "Снежные ангелы" },
  { src: `${IMG}gallery-06.webp`, caption: "Сердце на стекле" },
  { src: `${IMG}gallery-07.webp`, caption: "Фонарь", shape: "square" },
  { src: `${IMG}gallery-08.webp`, caption: "Фейерверк" },
] as const

export default function Page() {
  return (
    <div style={page} className="dark min-h-dvh" data-demo="wedding-winter">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Background006 density={0.9} wind={0.2} zIndex={30} />
      <Navbar027 {...dark} brandHref="#hero" music={`${IMG}music.mp3`} />

      <div id="hero">
        <Hero027
          {...dark}
          image={`${IMG}hero.webp`}
          imageAlt="Дом в снежном лесу с тёплыми окнами"
          photo={`${IMG}hero-couple.webp`}
          photoAlt="Валерия и Дмитрий с фонарём на лесной тропе"
        />
      </div>

      <div id="story">
        <About013
          {...dark}
          frames={[
            { date: "Декабрь 2023", title: "Каток", text: "Дима упал первым, Лера — второй. Встали вместе, так и держимся.", image: `${IMG}story-01.webp` },
            { date: "Январь 2025", title: "Ёлка на двоих", text: "Несли её через весь город. Игрушек хватило на одну ветку.", image: `${IMG}story-02.webp` },
            { date: "Февраль 2026", title: "Первая зима вместе", text: "Съехались в снегопад. Коробки разбирали до весны.", image: `${IMG}story-03.webp` },
            { date: "Ноябрь 2027", title: "Под ёлкой в лесу", text: "Дима спросил под большой елью с гирляндой. Лера сказала «да» и «холодно».", image: `${IMG}story-04.webp` },
          ]}
        />
      </div>

      <div id="evening">
        <Event013 {...dark} />
      </div>

      <div id="dresscode">
        <Event014
          {...dark}
          looks={[
            { who: "Ей", title: "Длинное и тёплое", text: "Бархат, шерсть, плотный шёлк — в ночи, бордо или хвое. Шаль дадим на террасе. Каблук можно: в доме паркет.", image: `${IMG}look-her.webp` },
            { who: "Ему", title: "Тёмный костюм, водолазка или рубашка", text: "Синий, графит, бутылочный. Шарф приветствуется, галстук — по желанию.", image: `${IMG}look-him.webp` },
          ]}
        />
      </div>

      <div id="place">
        <Map009 {...dark} image={`${IMG}venue.webp`} imageAlt="Дом с тёплыми окнами и фонарями у подъезда" />
      </div>

      <div id="rsvp">
        <Contact020 {...dark} />
      </div>

      <div id="faq">
        <Faq022 {...dark} />
      </div>

      <div id="gallery">
        <Portfolio010 {...dark} photos={GALLERY} />
      </div>

      <div id="people">
        <People011
          {...dark}
          people={[
            { name: "Кристина", role: "Свидетельница", text: "Подруга Леры с первого класса. Знает про платья, шали и куда прятать телефоны на церемонии.", image: `${IMG}people-01.webp`, contactLabel: "Написать в Telegram", contactHref: "#" },
            { name: "Игорь", role: "Свидетель", text: "Брат Димы. Отвечает за трансферы, дрова и фейерверк — в этом порядке.", image: `${IMG}people-02.webp`, contactLabel: "Написать в Telegram", contactHref: "#" },
            { name: "Марина", role: "Организатор", text: "Собирает вечер по минутам. Комнаты, аллергии, детские стулья — это к ней.", image: `${IMG}people-03.webp`, contactLabel: "Позвонить", contactHref: "tel:+70000000000" },
          ]}
        />
      </div>

      <div id="gifts">
        <Cta023 {...dark} />
      </div>

      <div id="wishes">
        <Testimonials022 {...dark} />
      </div>

      <div id="footer">
        <Footer026 {...dark} />
      </div>
    </div>
  )
}
