import type { CSSProperties } from "react"

import { Navbar034, type Navbar034Props } from "@/registry/blocks/navbar/navbar-034/navbar-034"
import { Hero046 } from "@/registry/blocks/hero/hero-046/hero-046"
import { Auto001, type Auto001Props } from "@/registry/blocks/industry/auto-001/auto-001"
import { Auto002, type Auto002Props } from "@/registry/blocks/industry/auto-002/auto-002"
import { Auto003, type Auto003Props } from "@/registry/blocks/industry/auto-003/auto-003"
import { People014, type People014Props } from "@/registry/blocks/team/people-014/people-014"
import { Testimonials026, type Testimonials026Props } from "@/registry/blocks/testimonials/testimonials-026/testimonials-026"
import { Auto004, type Auto004Props } from "@/registry/blocks/industry/auto-004/auto-004"
import { Map011, type Map011Props } from "@/registry/blocks/map/map-011/map-011"
import { Footer033, type Footer033Props } from "@/registry/blocks/footer/footer-033/footer-033"

/**
 * Сценарий «Автосервис / детейлинг»: тёмный «гараж ночью» — графит, металл,
 * один кислотный оранжевый. Supra влетает в кадр в дрифте и замирает на
 * ночном мосту, калькулятор считает на лету и уносит выбор в запись по слотам,
 * результаты сравниваются шторкой, счётчики докручиваются, мастера наклоняются
 * за курсором. Тексты блоков — в строгой редакции, через пропсы.
 */
export const metadata = {
  title: "Гараж 42 — детейлинг-студия в закрытом боксе",
  description:
    "Демо сценария «Автосервис / детейлинг» VibeUI: хиро с въездом машины в дрифте, калькулятор услуг, сравнение результатов, этапы работ, мастера, отзывы со счётчиками, запись по слотам и карта.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0f1114",
  color: "#f2f3f5",
  fontFamily: '"Inter Tight",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const garage = { tone: "dark", accent: "#ff5a1f", ink: "#f2f3f5", background: "#0f1114" } as const

const PHOTOS = "/demo/auto"

const navbar: Navbar034Props = {
  brand: "Гараж 42",
  status: "Свободен бокс № 2",
  links: [
    { label: "Услуги", href: "#services" },
    { label: "Работы", href: "#results" },
    { label: "Мастера", href: "#team" },
    { label: "Отзывы", href: "#reviews" },
    { label: "Контакты", href: "#contacts" },
  ],
  actionLabel: "Записаться",
}

const calculator: Auto001Props = {
  eyebrow: "Калькулятор",
  title: "Стоимость и сроки работ",
  lede: "Отметьте нужные услуги и выберите класс автомобиля — стоимость и срок рассчитаются автоматически. Итоговая цена фиксируется при записи.",
  services: [
    { name: "Детейлинг-мойка", price: 2500, minutes: 90, note: "Двухфазная ручная мойка, очистка глиной, воск." },
    { name: "Полировка кузова", price: 18000, minutes: 480, note: "Абразивный и финишный этапы." },
    { name: "Керамика 9H, 3 слоя", price: 32000, minutes: 720, note: "Гидрофобный эффект 2–3 года." },
    { name: "Плёнка PPF на фронт", price: 45000, minutes: 960, note: "Капот, бампер, зеркала, стойки." },
    { name: "Химчистка салона", price: 9000, minutes: 300, note: "Сиденья, потолок, ковровое покрытие, пластик." },
    { name: "Фары: полировка и защитная плёнка", price: 7000, minutes: 120, note: "Защитная плёнка 200 мкм." },
    { name: "Керамика на диски", price: 5000, minutes: 150, note: "Снятие, очистка, керамическое покрытие." },
    { name: "Кожа: очистка и защита", price: 6500, minutes: 180, note: "Очистка и кондиционирование." },
  ],
  classes: [
    { label: "Компакт", hint: "Polo, Rio, Mini", factor: 1 },
    { label: "Седан", hint: "Camry, 5-я серия", factor: 1.15 },
    { label: "Кроссовер", hint: "RAV4, X3, Q5", factor: 1.3 },
    { label: "Внедорожник", hint: "LC300, X7, G-класс", factor: 1.5 },
  ],
}

const results: Auto002Props = {
  eyebrow: "Результаты",
  title: "Состояние до и после работ",
  lede: "Три автомобиля из нашего бокса. Сдвиньте разделитель, чтобы сравнить состояние до и после обработки.",
  pairs: [
    { label: "Фары", before: `${PHOTOS}/before-lights.webp`, after: `${PHOTOS}/after-lights.webp`, work: "Удалили помутнение и микротрещины в три этапа полировки, нанесли защитную плёнку 200 мкм.", time: "2 часа" },
    { label: "Кузов", before: `${PHOTOS}/before-body.webp`, after: `${PHOTOS}/after-body.webp`, work: "Двухэтапная полировка и керамическое покрытие 9H в три слоя. Глубина цвета восстановлена, голограммы устранены.", time: "2 дня" },
    { label: "Салон", before: `${PHOTOS}/before-interior.webp`, after: `${PHOTOS}/after-interior.webp`, work: "Химчистка потолка, сидений и ковров, очистка и кондиционирование кожи.", time: "5 часов" },
  ],
  tabsLabel: "Что сравниваем",
  workLabel: "Выполненные работы",
  tookLine: "Срок работ: {time}",
  sliderLabel: "Сравнение до и после: {label}",
}

const steps: Auto003Props = {
  eyebrow: "Порядок работы",
  title: "Четыре этапа — от приёмки до выдачи",
  lede: "Стоимость и сроки фиксируются после осмотра. Каждый этап сопровождается фотоотчётом.",
  steps: [
    { title: "Осмотр и диагностика", text: "Мастер осматривает кузов при специальном освещении, измеряет толщину лакокрасочного покрытия, отмечает дефекты и согласует смету.", duration: "20 минут", result: "смета в мессенджере" },
    { title: "Мойка и подготовка", text: "Двухфазная мойка, очистка глиной, обезжиривание. При необходимости демонтируем эмблемы, брызговики и колёса.", duration: "1,5 часа", result: "подготовленная поверхность" },
    { title: "Работы в боксе", text: "Полировка, керамика, оклейка плёнкой или химчистка — согласно смете. Автомобиль находится в закрытом боксе при температуре +22 °C, без пыли и доступа посторонних.", duration: "от 4 часов до 3 дней", result: "фотоотчёт по этапам" },
    { title: "Выдача автомобиля", text: "Демонстрируем результат при том же освещении, что и на осмотре. Выдаём рекомендации по уходу и напоминаем о первой мойке через две недели.", duration: "20 минут", result: "гарантия по договору" },
  ],
}

const crew: People014Props = {
  eyebrow: "Мастера",
  title: "Кто работает с вашим автомобилем",
  lede: "Три мастера, у каждого — своё направление. Стажёры к работе с автомобилями клиентов не допускаются.",
  members: [
    { name: "Артём Гущин", role: "Основатель, полировка и керамика", photo: `${PHOTOS}/master-01.webp`, years: "11 лет", cars: "2 400", skills: ["Керамика", "Удаление голограмм", "Porsche"] },
    { name: "Марат Сафин", role: "Оклейка плёнкой PPF", photo: `${PHOTOS}/master-02.webp`, years: "8 лет", cars: "1 100", skills: ["XPEL", "Бесшовная оклейка", "Фары"] },
    { name: "Дарья Орлова", role: "Салон, кожа, химчистка", photo: `${PHOTOS}/master-03.webp`, years: "6 лет", cars: "1 800", skills: ["Кожа", "Алькантара", "Детские кресла"] },
  ],
}

const reviews: Testimonials026Props = {
  eyebrow: "Отзывы",
  title: "К нам возвращаются за результатом",
  stats: [
    { value: 1840, label: "автомобилей за прошлый год" },
    { value: 9, label: "лет в детейлинге" },
    { value: 72, suffix: "%", label: "клиентов возвращаются" },
    { value: 4.9, label: "рейтинг на картах" },
  ],
  reviews: [
    { name: "Илья Р.", car: "Porsche Macan, 2022", text: "Керамику наносил Артём. Прошёл год: мою машину раз в две недели, вода скатывается сама. Под лампой ни одной голограммы.", stars: 5 },
    { name: "Ксения В.", car: "Mini Cooper S", text: "Фары были мутными и жёлтыми. Через два часа — как новые, сверху нанесли защитную плёнку.", stars: 5 },
    { name: "Дмитрий К.", car: "BMW X5, 2021", text: "Оклеили переднюю часть плёнкой, стыков не видно даже на капоте. Присылали фото каждого этапа, смета не менялась.", stars: 5 },
    { name: "Анна и Павел", car: "Volvo XC90", text: "Химчистка салона после поездок с двумя детьми и собакой. Результат превзошёл ожидания: салон как новый.", stars: 5 },
    { name: "Роман Т.", car: "Tesla Model 3", text: "Полировка и керамика. Понравилось, что сначала замерили толщину лака и объяснили, где работать нужно особенно аккуратно.", stars: 5 },
    { name: "Егор М.", car: "Lexus RX", text: "Бокс чистый и светлый, посторонних рядом с машиной нет. Выдали в срок, рекомендации по уходу — в печатном виде.", stars: 4 },
    { name: "Марина С.", car: "Audi Q5", text: "Покрыли диски керамикой — тормозная пыль теперь смывается обычной водой.", stars: 5 },
    { name: "Сергей Л.", car: "Land Rover Defender", text: "Записался через сайт на субботу, запись подтвердили в течение минуты.", stars: 5 },
  ],
}

const booking: Auto004Props = {
  eyebrow: "Онлайн-запись",
  title: "Выберите удобное время",
  lede: "Расписание на неделю вперёд. Выберите свободное время и оставьте номер телефона — администратор подтвердит запись.",
  doneTitle: "Время забронировано",
  doneText: "Администратор свяжется с вами в течение нескольких минут, чтобы подтвердить запись и уточнить детали.",
  gridLabel: "Свободное время на неделю",
  emptyText: "Услуги, отмеченные в калькуляторе, добавятся автоматически. Состав работ можно уточнить по телефону.",
  pickHint: "Выберите время в расписании",
  fineText: "Без предоплаты. Перенести или отменить запись можно до 18:00 накануне.",
}

const where: Map011Props = {
  eyebrow: "Контакты",
  title: "Бокс на Обводном канале",
  address: "Санкт-Петербург, наб. Обводного канала, 150, корп. 3",
  howToFind: "Въезд с Курляндской улицы, вторые ворота с зелёной вывеской. Шлагбаум откроем по звонку.",
  facts: [
    { label: "Телефон", value: "+7 (812) 420-42-42", href: "tel:+78124204242" },
    { label: "Мессенджер", value: "@garage42_spb", href: "#" },
    { label: "Часы работы", value: "Пн–Сб 9:00–21:00, Вс — выходной" },
    { label: "Парковка", value: "Собственная, 6 мест у ворот" },
  ],
  mapsLabel: "Открыть в Яндекс Картах",
  navigatorLabel: "Маршрут в 2ГИС",
  pinLabel: "Гараж 42",
  fromLabel: "м. Балтийская · 7 минут",
}

const footer: Footer033Props = {
  tagline: "Детейлинг-студия в закрытом боксе. Керамика, защитная плёнка, полировка, химчистка салона. Санкт-Петербург, с 2017 года.",
  columns: [
    { title: "Услуги", links: [{ label: "Керамика", href: "#services" }, { label: "Плёнка PPF", href: "#services" }, { label: "Полировка", href: "#services" }, { label: "Химчистка", href: "#services" }] },
    { title: "Студия", links: [{ label: "Работы", href: "#results" }, { label: "Порядок работы", href: "#process" }, { label: "Мастера", href: "#team" }, { label: "Отзывы", href: "#reviews" }] },
    { title: "Клиентам", links: [{ label: "Записаться", href: "#booking" }, { label: "Гарантия", href: "#" }, { label: "Рекомендации по уходу", href: "#" }, { label: "Подарочный сертификат", href: "#" }] },
  ],
  address: "наб. Обводного канала, 150, корп. 3",
  hours: "Пн–Сб 9:00–21:00",
  note: "Цены на сайте указаны ориентировочно, точная стоимость фиксируется после осмотра.",
}

export default function AutoDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.25rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media (min-width:56rem){#top{margin-top:-4.25rem}}[data-vibeui-block="navbar-034"]{transition:opacity .9s ease-out .9s}:root:not([data-vibeui-hero-046="parked"]) [data-vibeui-block="navbar-034"]{opacity:0;pointer-events:none;transition:none}`}
      </style>
      <Navbar034 {...garage} {...navbar} />
      <div id="top">
        <Hero046 accent={garage.accent} ink={garage.ink} background={garage.background} />
      </div>
      <div id="services">
        <Auto001 {...garage} {...calculator} background="#14171b" />
      </div>
      <div id="results">
        <Auto002 {...garage} {...results} />
      </div>
      <div id="process">
        <Auto003 {...garage} {...steps} background="#14171b" />
      </div>
      <div id="team">
        <People014 {...garage} {...crew} />
      </div>
      <div id="reviews">
        <Testimonials026 {...garage} {...reviews} background="#14171b" />
      </div>
      <div id="booking">
        <Auto004 {...garage} {...booking} />
      </div>
      <div id="contacts">
        <Map011 {...garage} {...where} background="#14171b" />
      </div>
      <Footer033 {...garage} {...footer} />
    </div>
  )
}
