import type { CSSProperties } from "react"

import { Navbar041 } from "@/registry/blocks/navbar/navbar-041/navbar-041"
import { Hero041 } from "@/registry/blocks/hero/hero-041/hero-041"
import { Market001 } from "@/registry/blocks/market/market-001/market-001"
import { Market002 } from "@/registry/blocks/market/market-002/market-002"
import { Market003 } from "@/registry/blocks/market/market-003/market-003"
import { People021 } from "@/registry/blocks/team/people-021/people-021"
import { Bento010 } from "@/registry/blocks/bento/bento-010/bento-010"
import { Testimonials024 } from "@/registry/blocks/testimonials/testimonials-024/testimonials-024"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Cta034 } from "@/registry/blocks/cta/cta-034/cta-034"
import { Footer040 } from "@/registry/blocks/footer/footer-040/footer-040"

/**
 * Сценарий «Маркетплейс цифровых товаров»: галерея-каталог на почти белом
 * фоне с одним электрическим акцентом. Полка обложек в 3D разъезжается по
 * прокрутке, витрина живёт под фильтрами, набор со скидкой собирается
 * руками и уходит событием в шапку, доход авторов тикает в реальном времени.
 */
export const metadata = {
  title: "Слой — шаблоны, иконки и шрифты от независимых авторов",
  description:
    "Демо сценария «Маркетплейс цифровых товаров» VibeUI: 3D-полка в хиро, витрина с FLIP-фильтрами и быстрым просмотром, конструктор набора со скидкой, лицензии-билеты, авторы с живым доходом, bento для авторов, подписка на дропы.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f7f7f5",
  color: "#0f0f0f",
  fontFamily: '"Onest",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const gallery = { tone: "light", accent: "#3b5bff", ink: "#0f0f0f", background: "#f7f7f5" } as const

const QUOTES = [
  { text: "Купила UI-кит в четверг, в пятницу показала клиенту готовый прототип. Слои названы, автолейауты живые — не пришлось ничего чинить.", name: "Полина Ершова", role: "продуктовый дизайнер, Ozon", project: "покупатель" },
  { text: "За полгода на Слое шрифт заработал больше, чем за три года на западной площадке. Выплаты по пятницам — как зарплата.", name: "Тимур Гареев", role: "шрифтовой дизайнер", project: "автор" },
  { text: "Командная лицензия — одна кнопка, один счёт на компанию, и вся студия работает из общей библиотеки. Бухгалтерия впервые не спорила.", name: "Марк Лещенко", role: "арт-директор, студия «Формат»", project: "команда" },
]

const FAQ = [
  { question: "Что входит в покупку и как скачать?", answer: "Сразу после оплаты — ссылка на файлы и лицензия в личном кабинете. Обновления от автора приходят бесплатно, скачивать можно сколько угодно раз." },
  { question: "Чем личная лицензия отличается от коммерческой?", answer: "Личная — для своих проектов и портфолио. Коммерческая — для клиентских работ и продуктов, где вы зарабатываете. Командная добавляет общий доступ до 10 человек и договор на компанию." },
  { question: "Можно ли вернуть цифровой товар?", answer: "Да, в течение 14 дней, если файлы не открываются или не соответствуют описанию. Пишем автору, если не отвечает за два дня — возвращаем сами." },
  { question: "Как платят авторам?", answer: "80 % цены каждой продажи. Выплата каждую пятницу на карту или счёт ИП, без минимальной суммы. Налоги — по агентской схеме, отчёт приходит раз в месяц." },
  { question: "Как попасть в дроп четверга?", answer: "Загрузите товар до вторника — редакция проверит файлы и описание, и он выйдет в ближайшем дропе. В письмо попадают все новинки недели." },
]

export default function MarketDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar041 {...gallery} />
      <div id="top">
        <Hero041 {...gallery} />
      </div>
      <div id="catalog">
        <Market001 {...gallery} />
      </div>
      <div id="bundle">
        <Market002 {...gallery} />
      </div>
      <div id="licenses">
        <Market003 {...gallery} />
      </div>
      <div id="authors">
        <People021 {...gallery} />
      </div>
      <div id="for-authors">
        <Bento010 {...gallery} />
      </div>
      <Testimonials024 {...gallery} eyebrow="говорят покупатели и авторы" quotes={QUOTES} />
      <div id="faq">
        <Faq023 {...gallery} eyebrow="Вопросы" title="Спрашивают перед покупкой" lede="Коротко о лицензиях, возвратах и выплатах. Не нашли ответ — напишите, отвечаем за день." items={FAQ} contactLabel="Написать в поддержку" contactHref="#contact" />
      </div>
      <div id="drops">
        <Cta034 {...gallery} />
      </div>
      <Footer040 {...gallery} />
    </div>
  )
}
