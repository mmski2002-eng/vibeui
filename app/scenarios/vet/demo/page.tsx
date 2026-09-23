import type { CSSProperties } from "react"

import { Navbar035 } from "@/registry/blocks/navbar/navbar-035/navbar-035"
import { Hero047 } from "@/registry/blocks/hero/hero-047/hero-047"
import { Vet001 } from "@/registry/blocks/industry/vet-001/vet-001"
import { Pricing027, type Pricing027Props } from "@/registry/blocks/pricing/pricing-027/pricing-027"
import { Vet002, type Vet002Props } from "@/registry/blocks/industry/vet-002/vet-002"
import { Vet003, type Vet003Props } from "@/registry/blocks/industry/vet-003/vet-003"
import { People015, type People015Props } from "@/registry/blocks/team/people-015/people-015"
import { Vet004, type Vet004Props } from "@/registry/blocks/industry/vet-004/vet-004"
import { Testimonials027, type Testimonials027Props } from "@/registry/blocks/testimonials/testimonials-027/testimonials-027"
import { Contact023, type Contact023Props } from "@/registry/blocks/contact/contact-023/contact-023"
import { Footer034, type Footer034Props } from "@/registry/blocks/footer/footer-034/footer-034"

/**
 * Сценарий «Ветклиника + груминг», кремовая «Лапа»: кошка впрыгивает в кадр
 * и замирает на первом экране; дальше экстренная кнопка, карта тела,
 * симптом-чекер, живое расписание врачей, ползунок стрижки и дневник отзывов.
 * Тексты блоков — в деловой редакции, через пропсы.
 */
export const metadata = {
  title: "Лапа — ветклиника и груминг на Соколе",
  description:
    "Демо сценария «Ветклиника + груминг» VibeUI: хиро-интро с кошкой, экстренная кнопка, прайс-тикеты, карта тела, симптом-чекер, врачи с расписанием на сегодня, ползунок стрижки, дневник отзывов, запись с картой.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#fbf6ee",
  color: "#2b241f",
  fontFamily: '"Golos Text",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const cream = { tone: "light", accent: "#d9643a", ink: "#2b241f", background: "#fbf6ee" } as const

const PHOTOS = "/demo/vet"

const pricing: Pricing027Props = {
  eyebrow: "Услуги и цены",
  title: "Фиксированные цены",
  lede: "Стоимость услуг известна заранее. Если во время приёма потребуется что-то сверх плана, врач согласует это с вами до начала работ.",
  groups: [
    {
      key: "cat",
      label: "Кошки",
      items: [
        { name: "Первичный приём терапевта", note: "Осмотр, план лечения, ответы на вопросы владельца", price: "1 200 ₽", popular: true },
        { name: "Комплексная вакцинация", note: "Нобивак Tricat и бешенство, запись в ветпаспорт", price: "2 400 ₽" },
        { name: "Стерилизация кошки", note: "Лапароскопически, без снятия швов, выписка в тот же день", price: "9 800 ₽", popular: true },
        { name: "Кастрация кота", note: "Около 20 минут под общей анестезией", price: "4 500 ₽" },
        { name: "Ультразвуковая чистка зубов", note: "Под седацией, с полировкой", price: "6 900 ₽" },
        { name: "Стрижка когтей", note: "Бесплатно при записи на приём", price: "400 ₽" },
      ],
    },
    {
      key: "dog",
      label: "Собаки",
      items: [
        { name: "Первичный приём терапевта", note: "Осмотр, взвешивание, план лечения", price: "1 400 ₽", popular: true },
        { name: "Комплексная вакцинация", note: "Нобивак DHPPi, Lepto и бешенство", price: "2 600 ₽" },
        { name: "Стерилизация", note: "Лапароскопически, до 25 кг", price: "14 500 ₽" },
        { name: "Приём ортопеда", note: "Хромота, дисплазия, нарушения походки", price: "2 200 ₽", popular: true },
        { name: "Ультразвуковая чистка зубов", note: "Под седацией, с полировкой", price: "8 400 ₽" },
        { name: "Чипирование", note: "Установка чипа и регистрация в базе", price: "1 500 ₽" },
      ],
    },
    {
      key: "rabbit",
      label: "Кролики и грызуны",
      items: [
        { name: "Приём ратолога", note: "Врач по кроликам и грызунам принимает ежедневно", price: "1 500 ₽", popular: true },
        { name: "Коррекция зубов", note: "Резцы, под лёгкой седацией", price: "2 800 ₽" },
        { name: "Кастрация кролика", note: "Ингаляционная анестезия, выписка через 3 часа", price: "5 900 ₽" },
        { name: "Вакцинация: ВГБК и миксоматоз", note: "Раз в полгода, запись в ветпаспорт", price: "1 900 ₽" },
        { name: "Стрижка когтей", note: "Около пяти минут", price: "350 ₽" },
        { name: "УЗИ брюшной полости", note: "Срочно при отказе от корма больше суток", price: "2 300 ₽" },
      ],
    },
  ],
  fine: "Полный прайс-лист — 140 позиций — доступен на ресепшене и по запросу в мессенджере. Ночной приём с 22:00 до 8:00 — с надбавкой 30 %.",
}

const bodyMap: Vet002Props = {
  eyebrow: "Карта питомца",
  title: "Выберите, что беспокоит",
  lede: "Каждая точка на схеме — услуга и её стоимость. Если нужной нет, администратор подскажет, к какому врачу записаться.",
  spots: [
    { key: "ears", label: "Уши", x: 31, y: 22, service: "Чистка ушей и осмотр отоскопом", price: "900 ₽", duration: "15 минут", text: "Питомец трясёт головой, чешет уши, есть запах — осматриваем слуховой канал, берём мазок и проводим чистку. Капли назначаем по результатам." },
    { key: "eyes", label: "Глаза", x: 24, y: 17, service: "Приём офтальмолога", price: "1 800 ₽", duration: "30 минут", text: "Слезотечение, покраснение, выпадение третьего века — осмотр со щелевой лампой, тест Ширмера и проба с флюоресцеином." },
    { key: "teeth", label: "Зубы", x: 17, y: 32, service: "Ультразвуковая чистка зубов", price: "от 6 900 ₽", duration: "≈ 1 час", text: "Под седацией, с полировкой и рентгеновскими снимками. Неприятный запах из пасти обычно вызывает зубной камень — его удаляем за один приём." },
    { key: "coat", label: "Шерсть и кожа", x: 52, y: 36, service: "Приём дерматолога", price: "1 600 ₽", duration: "30 минут", text: "Зуд, облысение, перхоть — соскоб и осмотр лампой Вуда на приёме. При подозрении на аллергию поможем определить её причину." },
    { key: "belly", label: "Живот", x: 48, y: 60, service: "УЗИ брюшной полости", price: "2 300 ₽", duration: "25 минут", text: "Отказ от корма, рвота, необычная поза — проводим исследование в день обращения. Заключение и снимки отправляем в мессенджер." },
    { key: "paws", label: "Лапы и когти", x: 31, y: 86, service: "Стрижка когтей и осмотр подушечек", price: "400 ₽", duration: "10 минут", text: "Бесплатно при записи на приём. При хромоте — консультация ортопеда и рентген в тот же день." },
    { key: "tail", label: "Хвост", x: 86, y: 16, service: "Приём хирурга", price: "1 500 ₽", duration: "20 минут", text: "Травма, питомец не поднимает хвост — осмотр хирурга, при необходимости рентген." },
  ],
}

const symptoms: Vet003Props = {
  eyebrow: "Симптомы",
  title: "Отметьте, что заметили",
  lede: "Подскажем, к какому врачу обратиться и насколько это срочно. Это не диагноз, а маршрут, чтобы быстро принять решение в любое время суток.",
  symptoms: [
    { label: "Не ест вторые сутки", doctor: "Терапевт", urgency: 2 },
    { label: "Рвота больше двух раз", doctor: "Терапевт", urgency: 2 },
    { label: "Тяжёлое дыхание, синюшный язык", doctor: "Дежурный врач", urgency: 3 },
    { label: "Не может помочиться", doctor: "Дежурный врач", urgency: 3 },
    { label: "Возможное отравление", doctor: "Дежурный врач", urgency: 3 },
    { label: "Хромота", doctor: "Ортопед", urgency: 1 },
    { label: "Зуд, облысение", doctor: "Дерматолог", urgency: 1 },
    { label: "Запах из пасти", doctor: "Стоматолог", urgency: 1 },
    { label: "Трясёт головой", doctor: "Терапевт", urgency: 1 },
    { label: "Слезотечение", doctor: "Офтальмолог", urgency: 1 },
    { label: "Кровь в моче", doctor: "Терапевт", urgency: 2 },
    { label: "Вялость, прячется", doctor: "Терапевт", urgency: 2 },
    { label: "Судороги", doctor: "Дежурный врач", urgency: 3 },
    { label: "Повышенная жажда", doctor: "Терапевт", urgency: 2 },
    { label: "Уплотнение под кожей", doctor: "Хирург", urgency: 1 },
  ],
  disclaimer: "Если сомневаетесь, позвоните. Дежурный врач проконсультирует бесплатно и подскажет, нужно ли ехать сейчас.",
  emptyText: "Симптомы не выбраны. Отметьте их выше — появятся рекомендации по врачам.",
  scaleEmpty: "Отметьте симптомы — шкала покажет степень срочности.",
}

const doctors: People015Props = {
  lede: "Четыре врача, у каждого своя специализация. Расписание обновляется ежедневно: видно, кто принимает сегодня.",
  doctors: [
    { name: "Марина Соколова", role: "Главный врач, терапевт", photo: `${PHOTOS}/doctor-01.webp`, tags: ["кошки", "УЗИ", "эндокринология"], days: [1, 2, 3, 4, 5], hours: "9:00–17:00", since: "в профессии с 2009" },
    { name: "Артём Гусев", role: "Хирург, ортопед", photo: `${PHOTOS}/doctor-02.webp`, tags: ["операции", "переломы", "лапароскопия"], days: [1, 3, 5, 6], hours: "11:00–21:00", since: "в профессии с 2013" },
    { name: "Дарья Ким", role: "Ратолог, врач по экзотическим животным", photo: `${PHOTOS}/doctor-03.webp`, tags: ["кролики", "грызуны", "птицы"], days: [0, 2, 4, 6], hours: "10:00–19:00", since: "в профессии с 2017" },
    { name: "Илья Романов", role: "Стоматолог, дежурный врач", photo: `${PHOTOS}/doctor-04.webp`, tags: ["стоматология", "ночные смены", "реанимация"], days: [0, 1, 2, 3, 4, 5, 6], hours: "21:00–9:00", since: "в профессии с 2015" },
  ],
}

const grooming: Vet004Props = {
  title: "Рассчитайте стоимость стрижки",
  lede: "Выберите длину стрижки, размер собаки и дополнительные услуги — стоимость рассчитается сразу. Грумер оценит состояние шерсти и при необходимости предложит другой вариант.",
  marks: [
    { upTo: 5, label: "машинкой — летняя стрижка, колтуны" },
    { upTo: 12, label: "коротко и аккуратно" },
    { upTo: 25, label: "модельная стрижка" },
    { upTo: 99, label: "гигиеническая: мытьё и подравнивание" },
  ],
}

const diary: Testimonials027Props = {
  eyebrow: "Отзывы",
  title: "Отзывы владельцев",
  lede: "Отзывы с карт и из мессенджера — с кличками и датами. Фотографии присылают владельцы.",
  entries: [
    { pet: "Батон", owner: "Ольга", date: "14 марта", text: "Кастрация прошла спокойно: вечером того же дня кот уже ел. Шов не беспокоил, воротник не понадобился.", photo: `${PHOTOS}/diary-01.webp`, sticker: "без стресса" },
    { pet: "Мисс Плюш", owner: "Артём и Анастасия", date: "2 апреля", text: "Модельная стрижка. Грумер Елена показала фото «до» и «после» и заранее согласовала с нами результат. Остались довольны.", photo: `${PHOTOS}/diary-02.webp`, sticker: "груминг" },
    { pet: "Фунтик", owner: "Михаил Петрович", date: "19 апреля", text: "Кролик ночью перестал есть. Приехали в два часа ночи, УЗИ сделали сразу. Через день аппетит восстановился.", photo: `${PHOTOS}/diary-03.webp`, sticker: "24/7" },
    { pet: "Зося", owner: "Екатерина", date: "5 мая", text: "Чистка зубов: запах ушёл, собака снова ест сухой корм. Ортопед при этом бесплатно осмотрел лапу.", photo: `${PHOTOS}/diary-04.webp`, sticker: "5 / 5" },
    { pet: "Кекс", owner: "Семья Ивановых", date: "23 мая", text: "Первая прививка щенка. Врач действовала спокойно и бережно, щенок перенёс процедуру без стресса.", sticker: "первая прививка" },
    { pet: "Марсель", owner: "Ирина", date: "8 июня", text: "Дерматолог определил причину аллергии за один приём. Зуд, который длился три года, прошёл за месяц.", sticker: "результат" },
  ],
  hint: "листайте ленту",
}

const contact: Contact023Props = {
  title: "Запишитесь на приём",
  lede: "Оставьте номер телефона — администратор перезвонит в течение 15 минут, подберёт время и расскажет, как подготовиться к визиту.",
  doneTitle: "Заявка принята",
  doneText: "Администратор перезвонит в течение 15 минут. В экстренной ситуации звоните сами — дежурный врач на месте.",
  fine: "Нажимая кнопку, вы соглашаетесь на обратный звонок для записи на приём.",
}

const footer: Footer034Props = {
  caption: "Ветклиника и груминг на Соколе. Принимаем кошек, собак, кроликов, грызунов и птиц.",
  columns: [
    { title: "Услуги", links: [{ label: "Терапия", href: "#services" }, { label: "Хирургия", href: "#services" }, { label: "Стоматология", href: "#services" }, { label: "Груминг", href: "#grooming" }, { label: "Экзотические животные", href: "#services" }] },
    { title: "Клиника", links: [{ label: "Врачи", href: "#doctors" }, { label: "Цены", href: "#services" }, { label: "Отзывы", href: "#diary" }, { label: "Вакансии", href: "#" }] },
    { title: "Помощь", links: [{ label: "Симптомы", href: "#symptoms" }, { label: "Подготовка к визиту", href: "#" }, { label: "Подготовка к операции", href: "#" }, { label: "Вопросы и ответы", href: "#" }] },
  ],
}

// Каскад при прокрутке: анимируем содержимое секций, не их фон, чтобы полосы
// не моргали. Только translate/opacity и только from-кадр — конечное значение
// берётся живым, поэтому hover-сдвиги блоков продолжают работать.
const REVEAL = `@supports (animation-timeline: view()){
[data-reveal] :is([data-part="eyebrow"],[data-part="title"],[data-part="lede"],[data-part="today"],[data-part="hint"],[data-part="tabs"],[data-part="fine"],[data-part="disclaimer"],[data-part="ticket"],[data-part="scheme"],[data-part="legend"],[data-part="result"],[data-part="stage"],[data-part="track"],[data-part="form"],[data-part="map"],[data-part="info"]),[data-reveal] [data-vibeui-block="vet-002"] [data-part="card"],[data-reveal] :is([data-part="chips"],[data-part="grid"],[data-part="panel"]) > *{--vet-d:0;animation:vet-reveal linear both;animation-timing-function:cubic-bezier(.22,1,.36,1);animation-timeline:view();animation-range:entry calc(5% + var(--vet-d) * 7%) cover calc(24% + var(--vet-d) * 4%)}
[data-reveal] :is([data-part="title"],[data-part="legend"],[data-part="info"]),[data-reveal] [data-vibeui-block="vet-002"] [data-part="card"],[data-reveal] :is([data-part="chips"],[data-part="grid"],[data-part="panel"]) > :nth-child(4n+2){--vet-d:1}
[data-reveal] :is([data-part="lede"],[data-part="tabs"],[data-part="today"],[data-part="hint"]),[data-reveal] :is([data-part="chips"],[data-part="grid"],[data-part="panel"]) > :nth-child(4n+3){--vet-d:2}
[data-reveal] :is([data-part="chips"],[data-part="grid"],[data-part="panel"]) > :nth-child(4n+4){--vet-d:3}
[data-reveal] [data-part="grid"] > [data-part="ticket"]:nth-child(3n+1){--vet-d:0}
[data-reveal] [data-part="grid"] > [data-part="ticket"]:nth-child(3n+2){--vet-d:1}
[data-reveal] [data-part="grid"] > [data-part="ticket"]:nth-child(3n){--vet-d:2}
[data-reveal] [data-vibeui-block="pricing-027"] [data-part="grid"] > [data-part="ticket"]{animation:vibeui-pricing-027-rise .45s cubic-bezier(.2,.8,.2,1) both,vet-reveal linear both;animation-delay:calc(var(--vibeui-pricing-027-i) * 50ms),0s;animation-timing-function:cubic-bezier(.2,.8,.2,1),cubic-bezier(.22,1,.36,1);animation-timeline:auto,view();animation-range:normal,entry calc(5% + var(--vet-d) * 7%) cover calc(24% + var(--vet-d) * 4%)}
@keyframes vet-reveal{from{opacity:0;translate:0 28px}}}
@media (prefers-reduced-motion:reduce){[data-reveal] *{animation:none!important}}`

export default function VetDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-vet-reveal" precedence="medium">
        {REVEAL}
      </style>
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:3.75rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar035 {...cream} overlay />
      <div id="top">
        <Hero047 accent={cream.accent} ink={cream.ink} background={cream.background} />
      </div>
      <Vet001 {...cream} />
      <div id="services" data-reveal>
        <Pricing027 {...cream} {...pricing} background="#f4ecdf" />
      </div>
      <div id="body" data-reveal>
        <Vet002 {...cream} {...bodyMap} />
      </div>
      <div id="symptoms" data-reveal>
        <Vet003 {...cream} {...symptoms} background="#f4ecdf" />
      </div>
      <div id="doctors" data-reveal>
        <People015 {...cream} {...doctors} />
      </div>
      <div id="grooming" data-reveal>
        <Vet004 {...cream} {...grooming} background="#f4ecdf" />
      </div>
      <div id="diary" data-reveal>
        <Testimonials027 {...cream} {...diary} />
      </div>
      <div id="contacts" data-reveal>
        <Contact023 {...cream} {...contact} background="#f4ecdf" />
      </div>
      <Footer034 {...cream} {...footer} />
    </div>
  )
}
