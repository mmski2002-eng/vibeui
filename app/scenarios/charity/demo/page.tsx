import type { CSSProperties } from "react"

import { Navbar044 } from "@/registry/blocks/navbar/navbar-044/navbar-044"
import { Hero044 } from "@/registry/blocks/hero/hero-044/hero-044"
import { Charity001 } from "@/registry/blocks/charity/charity-001/charity-001"
import { Charity002 } from "@/registry/blocks/charity/charity-002/charity-002"
import { Charity003 } from "@/registry/blocks/charity/charity-003/charity-003"
import { Charity004 } from "@/registry/blocks/charity/charity-004/charity-004"
import { People024 } from "@/registry/blocks/team/people-024/people-024"
import { Charity005 } from "@/registry/blocks/charity/charity-005/charity-005"
import { Logocloud007 } from "@/registry/blocks/logos/logocloud-007/logocloud-007"
import { Event025 } from "@/registry/blocks/events/event-025/event-025"
import { Cta037 } from "@/registry/blocks/cta/cta-037/cta-037"
import { Footer043 } from "@/registry/blocks/footer/footer-043/footer-043"

/**
 * Сценарий «Благотворительный фонд»: «Тёплый дом» помогает одиноким пожилым
 * людям в Тверской области. Бумага, терракот, антиква и рукописные пометки:
 * сбор с живым счётчиком, «что даёт ваша сумма», письма подопечных в
 * конвертах, кольцевая диаграмма расходов, карта городов, бейдж волонтёра
 * и форма пожертвования с «×12».
 */
export const metadata = {
  title: "Тёплый дом — фонд помощи одиноким пожилым людям",
  description:
    "Демо сценария «Благотворительный фонд» VibeUI: хиро-сбор со счётчиком и вехами, калькулятор «что даёт сумма», письма подопечных, отчётность кольцевой диаграммой, карта помощи, команда, волонтёрство, события и форма пожертвования.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f6f1ea",
  color: "#2b211b",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const paper = { tone: "light", accent: "#c2410c", ink: "#2b211b", background: "#f6f1ea" } as const

const PHOTOS = "/demo/charity"

const STORIES = [
  { name: "Нина Петровна", meta: "84 года · Ржев", letter: "Здравствуйте, мои дорогие. Пишу, потому что телефон я так и не освоила. Спасибо за Катю — она приходит по средам, мы пьём чай и она ругает меня за давление. Кран на кухне теперь не капает, я сплю. Обнимаю всех, кого не знаю.", sign: "Нина П.", image: `${PHOTOS}/ward-02.webp`, imageAlt: "Нина Петровна в кресле с кошкой" },
  { name: "Виктор Ильич", meta: "79 лет · Торжок", letter: "Сорок лет проработал на вагонзаводе, а вот дверь в подъезде сам не осилил. Ребята приехали в субботу, поставили замок и заодно ушли с моей рыбалочной байкой. Хотя бы посмеялись. Спасибо. Продукты — тоже спасибо, но главное — что помнят.", sign: "В. Козлов", image: `${PHOTOS}/ward-01.webp`, imageAlt: "Виктор Ильич за столом с письмом" },
  { name: "Зинаида Фёдоровна", meta: "88 лет · Кувшиново", letter: "Лекарства привезли, всё по списку, чек приложили — вот это по-человечески. Мурзик передаёт привет вашему Серёже, который его кормил, пока я лежала в больнице. Живём. Не забывайте нас.", sign: "Зина", image: `${PHOTOS}/ward-03.webp`, imageAlt: "Зинаида Фёдоровна в дверях деревенского дома" },
  { name: "Анна Семёновна", meta: "91 год · Тверь", letter: "Раньше по неделям ни с кем не разговаривала. Теперь по четвергам — Лена, а по воскресеньям звонит Игорь, читает мне газету. Мне кажется, я снова стала человеком, а не квартирой с номером.", sign: "А. С." },
]

const PEOPLE = [
  { name: "Марина Соколова", role: "Директор фонда", quote: "«Начала с одной бабушки в своём подъезде. Было в 2018-м.»", image: `${PHOTOS}/team-01.webp`, imageAlt: "Марина Соколова" },
  { name: "Игорь Лапин", role: "Логистика и ремонты", quote: "«Знаю все дороги области и где подешевле краны.»", image: `${PHOTOS}/team-02.webp`, imageAlt: "Игорь Лапин у фургона" },
  { name: "Катя Рябова", role: "Старший соцработник", quote: "«Мои среды — это Нина Петровна, чай и давление.»", image: `${PHOTOS}/team-03.webp`, imageAlt: "Катя Рябова" },
]

export default function CharityDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.25rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar044 {...paper} />
      <div id="top">
        <Hero044 {...paper} image={`${PHOTOS}/hero.webp`} imageAlt="Нина Петровна у окна с чашкой чая, рядом рука волонтёра" />
      </div>
      <div id="impact">
        <Charity001 {...paper} />
      </div>
      <div id="stories">
        <Charity002 {...paper} stories={STORIES} />
      </div>
      <div id="report">
        <Charity003 {...paper} />
      </div>
      <div id="map">
        <Charity004 {...paper} />
      </div>
      <div id="team">
        <People024 {...paper} people={PEOPLE} />
      </div>
      <div id="volunteer">
        <Charity005 {...paper} />
      </div>
      <Logocloud007 {...paper} label="нам помогают" names={["Тверской вагонзавод", "Аптека «Вита»", "Сбербанк", "Пятёрочка", "Ростелеком", "Такси «Везёт»", "Афанасий", "Тверская епархия", "Точка", "Дом.ру"]} />
      <div id="events">
        <Event025 {...paper} />
      </div>
      <div id="donate">
        <Cta037 {...paper} image={`${PHOTOS}/hands.webp`} imageAlt="Руки старого и молодого человека держат пакет с продуктами" />
      </div>
      <div id="documents">
        <Footer043 {...paper} />
      </div>
    </div>
  )
}
