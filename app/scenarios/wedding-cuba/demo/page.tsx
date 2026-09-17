import type { CSSProperties } from "react"

import { About012 } from "@/registry/blocks/about/about-012/about-012"
import { Contact019 } from "@/registry/blocks/contact/contact-019/contact-019"
import { Cta022 } from "@/registry/blocks/cta/cta-022/cta-022"
import { Event010 } from "@/registry/blocks/events/event-010/event-010"
import { Event011 } from "@/registry/blocks/events/event-011/event-011"
import { Event012 } from "@/registry/blocks/events/event-012/event-012"
import { Faq021 } from "@/registry/blocks/faq/faq-021/faq-021"
import { Footer025 } from "@/registry/blocks/footer/footer-025/footer-025"
import { Hero026 } from "@/registry/blocks/hero/hero-026/hero-026"
import { Map008 } from "@/registry/blocks/map/map-008/map-008"
import { Navbar026 } from "@/registry/blocks/navbar/navbar-026/navbar-026"
import { Portfolio009 } from "@/registry/blocks/portfolio/portfolio-009/portfolio-009"
import { Testimonials021 } from "@/registry/blocks/testimonials/testimonials-021/testimonials-021"

/**
 * Сценарий «Свадьба на Кубе»: бумага и песок, чернильно-синий, коралл и
 * бирюза, Oswald + Lobster + Manrope. Посадочный талон на входе, маршрут
 * пары самолётиком, три дня табами, дорожная информация с чек-листом,
 * check-in вместо RSVP, открытки вместо галереи. Тринадцать блоков.
 * Витрина результата, не шаблон.
 */
export const metadata = {
  title: "Соня и Тимур летят жениться — 12–14 февраля 2027, Куба",
  description:
    "Демо сценария «Свадьба на Кубе» VibeUI: посадочный талон, маршрут пары, три дня, дорожная информация, дресс-код beach formal, карта, check-in, вопросы, открытки, подарки и открытки от гостей.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#fffaf0",
  color: "#123a4b",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const light = { tone: "light", background: "#fffaf0", ink: "#123a4b", accent: "#ff6b57" } as const
// Чередующиеся секции на песке.
const sand = { ...light, background: "#f3e9d2" } as const

const IMG = "/demo/wedding-cuba/"

const POSTCARDS = [
  { src: `${IMG}postcard-01.webp`, caption: "Велосипед на двоих", back: "Соня едет на раме и командует. Я кручу. Всё как всегда.", from: "Trinidad", date: "03.2026", shape: "wide" },
  { src: `${IMG}postcard-02.webp`, caption: "Дверь в Гаване", back: "Синяя, облупленная, идеальная. Соня сказала «поженимся здесь». Я сказал «где здесь?»", from: "La Habana", date: "10.2025", shape: "tall" },
  { src: `${IMG}postcard-03.webp`, caption: "Лежим", back: "Море +27, мы +100. Не звоните.", from: "Cayo Largo", date: "10.2025", shape: "wide" },
  { src: `${IMG}postcard-04.webp`, caption: "Кокос", back: "Один на двоих, две трубочки. Тимур выпил больше.", from: "Varadero", date: "10.2025", shape: "square" },
  { src: `${IMG}postcard-05.webp`, caption: "Сон на площади", back: "Нас научили за десять минут. Врут. Но было весело.", from: "La Habana", date: "10.2025", shape: "wide" },
  { src: `${IMG}postcard-06.webp`, caption: "Пирс", back: "Здесь он спросил. Тут я и ответила. Смотрите на воду — она бирюзовая, честно.", from: "Cayo Largo", date: "10.2025", shape: "tall" },
  { src: `${IMG}postcard-07.webp`, caption: "Маленький самолёт", back: "Сорок минут, восемь кресел, оба спали. Проснулись женихом и невестой.", from: "над морем", date: "10.2025", shape: "wide" },
  { src: `${IMG}postcard-08.webp`, caption: "Закат", back: "Ничего не написали. Просто смотрели.", from: "Cayo Largo", date: "10.2025", shape: "wide" },
] as const

export default function Page() {
  return (
    <div style={page} className="min-h-dvh" data-demo="wedding-cuba">
      {/* Песочные плашки внутри блоков: в каталоге они серые, оттенок задаёт сценарий. */}
      <style href="vibeui-demo-cuba-sand" precedence="medium">
        {`[data-vibeui-block]{--vibeui-hero-026-sand:#f3e9d2;--vibeui-about-012-sand:#f3e9d2;--vibeui-event-011-sand:#f3e9d2;--vibeui-event-012-sand:#f3e9d2;--vibeui-faq-021-sand:#f3e9d2;--vibeui-cta-022-sand:#f3e9d2;}`}
      </style>
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar026 {...light} background="rgb(255 250 240 / .9)" brandHref="#hero" date="2027-02-12T09:40:00+03:00" music={`${IMG}music.mp3`} />

      <div id="hero">
        <Hero026
          {...light}
          image={`${IMG}hero.webp`}
          imageAlt="Пустой карибский пляж на закате"
          photo={`${IMG}hero-couple.webp`}
          photoAlt="Соня и Тимур босиком по кромке воды"
        />
      </div>

      <div id="route">
        <About012
          {...light}
          stops={[
            {
              code: "MOW",
              city: "Москва",
              date: "Январь 2022",
              title: "Один стакан кофе",
              text: "Познакомились на мосту в снегопад: у Тимура замёрзли руки, у Сони был лишний кофе.",
              image: `${IMG}route-01.webp`,
            },
            {
              code: "IST",
              city: "Стамбул",
              date: "Май 2023",
              title: "Первая пересадка",
              text: "Опоздали на стыковку и провели в городе сутки. Поняли, что так — лучше.",
              image: `${IMG}route-04.webp`,
            },
            {
              code: "LIS",
              city: "Лиссабон",
              date: "Октябрь 2025",
              title: "Трамвай 28",
              text: "Соня высунулась в окно, Тимур сделал тот самый кадр. Он теперь на обложке.",
              image: `${IMG}route-02.webp`,
            },
            {
              code: "HAV",
              city: "Гавана",
              date: "Февраль 2027",
              title: "Финиш — на пляже",
              text: "Здесь Тимур спросил, здесь Соня ответила. Здесь и поженимся — с вами.",
              image: `${IMG}route-03.webp`,
            },
          ]}
        />
      </div>

      <div id="days">
        <Event010
          {...sand}
          days={[
            {
              day: "12",
              label: "Гавана",
              note: "прилёт и мохито",
              wear: "Лён, кеды и что-нибудь от солнца",
              image: `${IMG}havana-02.webp`,
              slots: [
                { time: "14:30", title: "Прилёт", place: "аэропорт Хосе Марти", text: "Трансфер ждёт на выходе — ищите табличку с нашими именами." },
                { time: "18:00", title: "Прогулка", place: "Старая Гавана", text: "Малекон, старые машины, первое мороженое." },
                { time: "20:30", title: "Ужин на крыше", place: "бар у собора", text: "Знакомимся. Мохито за наш счёт." },
              ],
            },
            {
              day: "13",
              label: "Пляж",
              note: "тот самый день",
              wear: "Beach formal: лён, песок, никаких каблуков",
              main: true,
              image: `${IMG}beach-ceremony.webp`,
              slots: [
                { time: "09:00", title: "Перелёт на Кайо-Ларго", place: "маленький самолёт", text: "Сорок минут над бирюзой — и мы на месте." },
                { time: "16:30", title: "Церемония", place: "Playa Paraíso", text: "Босиком, лицом к морю, двадцать минут." },
                { time: "18:00", title: "Ужин на песке", place: "длинный стол у воды", text: "Лобстер, ром, закат и тосты." },
                { time: "21:00", title: "Сон-кубано", place: "там же", text: "Живая группа из Гаваны. Танцевать умеют все — проверено." },
              ],
            },
            {
              day: "14",
              label: "Отдых",
              note: "медленное утро",
              wear: "Что осталось чистым",
              image: `${IMG}beach-dinner.webp`,
              slots: [
                { time: "10:30", title: "Поздний завтрак", place: "терраса отеля", text: "Кофе, папайя, обмен фотографиями." },
                { time: "13:00", title: "Море", place: "пляж отеля", text: "Последнее купание. Или первое — как пойдёт." },
                { time: "17:00", title: "Обратно в Гавану", place: "самолёт", text: "Вечером кто-то улетает домой, кто-то остаётся на неделю." },
              ],
            },
          ]}
        />
      </div>

      <div id="travel">
        <Event011 {...light} contactImage={`${IMG}planner.webp`} />
      </div>

      <div id="dresscode">
        <Event012
          {...light}
          looks={[
            { who: "Ей", title: "Лён, миди, плоская подошва", text: "Платье или комбинезон в песке, мяте или коралле. Каблуки утонут — сандалии или босиком.", image: `${IMG}look-her.webp` },
            { who: "Ему", title: "Рубашка навыпуск, светлые брюки", text: "Лён или хлопок, рукав закатать. Пиджак не нужен, шляпа — очень.", image: `${IMG}look-him.webp` },
          ]}
        />
      </div>

      <div id="place">
        <Map008 {...sand} image={`${IMG}hotel.webp`} imageAlt="Белые бунгало с бирюзовыми дверями и гамаки между пальм" />
      </div>

      <div id="checkin">
        <Contact019 {...sand} />
      </div>

      <div id="faq">
        <Faq021 {...light} />
      </div>

      <div id="postcards">
        <Portfolio009 {...sand} cards={POSTCARDS} />
      </div>

      <div id="gifts">
        <Cta022 {...light} />
      </div>

      <div id="wishes">
        <Testimonials021 {...sand} />
      </div>

      <div id="footer">
        <Footer025 {...light} background="#123a4b" ink="#fffaf0" />
      </div>
    </div>
  )
}
