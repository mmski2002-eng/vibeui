import { getCatalogItem } from "@/registry/index"

/**
 * Сценарии — готовые страницы, собранные из блоков каталога, и рецепт «из
 * чего», без вариантов.
 *
 * Человек приходит с задачей («сайт фотографа»), а не с нашей таксономией.
 * Сценарий показывает результат целиком (демо-страница), перечисляет, какие
 * именно блоки и с какими пропсами в нём стоят, и отдаёт агенту одну
 * ссылку: команды установки всех блоков плюс исходник страницы — композиция
 * и есть инструкция.
 *
 * Сценарий ничего не устанавливает сам и не является `kind: "template"`:
 * ставятся сами блоки, своими обычными командами. Источник правды — файл
 * демо-страницы (`source`): и рецепт, и бриф для агента генерируются из
 * него, поэтому разойтись они не могут. Список секций ведётся руками:
 * роли на странице — решение автора, из кода их не вывести.
 */

export type ScenarioSection = {
  /** Имя item'а каталога. */
  item: string
  /** Роль на странице: «Первый экран», а не «hero». */
  role: string
  roleEn: string
  /** Зачем здесь именно это. Одна строка. */
  note?: string
  noteEn?: string
  /** Якорь секции в демо, где стоит блок. Пусто — верх страницы. */
  anchor?: string
}

export type Scenario = {
  slug: string
  label: string
  en: string
  /** Что это за сайт, одним предложением. */
  summary: string
  summaryEn: string
  /** Адрес демо-страницы на сайте. */
  demo: string
  /** Файл демо-страницы относительно корня репозитория. */
  source: string
  /** Файл с промптами картинок относительно корня репозитория. */
  images?: string
  /** Общие правила страницы: одна тема и палитра на все блоки. */
  theme: {
    tone: "light" | "dark"
    accent: string
    ink: string
    font: string
  }
  sections: ScenarioSection[]
}

export const SCENARIOS: Scenario[] = [
  {
    slug: "photographer",
    label: "Портфолио фотографа",
    en: "Photographer portfolio",
    summary:
      "Сайт портретного и свадебного фотографа: работы с фильтром по жанрам, как проходит съёмка, обо мне, отзывы, цены и запись на звонок. Всё нарисовано от руки на бумажном фоне.",
    summaryEn:
      "A portrait and wedding photographer's site: work filtered by genre, how a shoot goes, about, reviews, prices and call booking. Everything hand-drawn on a paper background.",
    demo: "/scenarios/photographer/demo",
    source: "app/scenarios/photographer/demo/page.tsx",
    images: "docs/scenarios/photographer/IMAGES.md",
    theme: {
      tone: "light",
      accent: "#c2410c",
      ink: "#1c1917",
      font: "Neucha, Caveat",
    },
    sections: [
      {
        item: "surface-025",
        anchor: "",
        role: "Фон тетради",
        roleEn: "Notebook background",
        note: "Клетка на всю страницу; секции отдают свою бумагу прозрачной.",
        noteEn:
          "Squares across the whole page; sections make their paper transparent.",
      },
      {
        item: "sketch-019",
        anchor: "",
        role: "Шапка",
        roleEn: "Header",
        note: "Нарисованный фотоаппарат, ссылки с росчерком, кнопка в штриховке.",
        noteEn: "A sketched camera, stroke-underlined links, a hatched button.",
      },
      {
        item: "sketch-016",
        anchor: "hero",
        role: "Первый экран",
        roleEn: "First screen",
        note: "Заголовок с обведённым словом и фото, приклеенное скотчем.",
        noteEn: "A headline with a circled word and a taped photo.",
      },
      {
        item: "sketch-018",
        anchor: "works",
        role: "Скролл и поля",
        roleEn: "Scroll and margins",
        note: "Обёртка всех секций: листы въезжают на стол, нитка и доодлы на полях.",
        noteEn:
          "Wraps every section: sheets land on the desk, a thread and doodles in the margins.",
      },
      {
        item: "sketch-017",
        anchor: "works",
        role: "Работы",
        roleEn: "Work",
        note: "Галерея с фильтром по жанрам и вылетом кадра на передний план.",
        noteEn: "A gallery with genre filter and a fly-out lightbox.",
      },
      {
        item: "sketch-013",
        anchor: "process",
        role: "Разделители",
        roleEn: "Dividers",
        note: "Линия от руки с подписью между секциями.",
        noteEn: "A hand-drawn line with a caption between sections.",
      },
      {
        item: "sketch-009",
        anchor: "process",
        role: "Пометка в заголовке",
        roleEn: "Headline mark",
        note: "Маркер под словом «съёмка».",
        noteEn: "A highlighter under one word.",
      },
      {
        item: "sketch-012",
        anchor: "process",
        role: "Шаги съёмки",
        roleEn: "Shoot steps",
        note: "Пять шагов процесса кружками.",
        noteEn: "Five process steps in circles.",
      },
      {
        item: "sketch-007",
        anchor: "process",
        role: "Карточки",
        roleEn: "Cards",
        note: "Шаги подробно и три формата с ценами.",
        noteEn: "Step details and three priced packages.",
      },
      {
        item: "sketch-020",
        anchor: "about",
        role: "Обо мне",
        roleEn: "About",
        note: "Фото, цифры в кружках, список с галочками.",
        noteEn: "A photo, circled numbers, a checkmark list.",
      },
      {
        item: "sketch-015",
        anchor: "reviews",
        role: "Отзывы",
        roleEn: "Reviews",
        note: "Три рукописные цитаты.",
        noteEn: "Three handwritten quotes.",
      },
      {
        item: "sketch-001",
        anchor: "pricing",
        role: "Кнопки в ценах",
        roleEn: "Price buttons",
        note: "«Выбрать» в каждой карточке формата.",
        noteEn: "“Choose” in every package card.",
      },
      {
        item: "sketch-021",
        anchor: "book",
        role: "Запись",
        roleEn: "Booking",
        note: "Форма: день, время, телефон, согласие.",
        noteEn: "A form: day, time, phone, consent.",
      },
      {
        item: "sketch-022",
        anchor: "footer",
        role: "Подвал",
        roleEn: "Footer",
        note: "Следующая история на приклеенном фото и строка со студией.",
        noteEn: "The next story on a taped photo and the studio row.",
      },
      {
        item: "sketch-023",
        anchor: "process",
        role: "Стикеры на полях",
        roleEn: "Margin stickers",
        note: "Три записки: перенос по погоде, настоящие люди, свободные даты.",
        noteEn: "Three notes: weather rescheduling, real people, free dates.",
      },
    ],
  },
  {
    slug: "restaurant",
    label: "Ресторан",
    en: "Restaurant",
    summary:
      "Сайт ресторана северной кухни: первый экран с бегущей строкой, меню с фото у курсора, шеф, галерея зала с параллаксом, бронь стола, события, отзывы поверх фото, карта и подвал. Тёмная тема: свечи, дерево и винное свечение.",
    summaryEn:
      "A Nordic-cuisine restaurant site: a hero with a ticker, a menu with cursor photos, the chef, a parallax hall gallery, table booking, events, reviews over a photo, a map and a footer. A dark theme: candles, wood and a wine-red glow.",
    demo: "/scenarios/restaurant/demo",
    source: "app/scenarios/restaurant/demo/page.tsx",
    images: "docs/scenarios/restaurant/IMAGES.md",
    theme: {
      tone: "dark",
      accent: "#7d2a3a",
      ink: "#f2ebe0",
      font: "Playfair Display, Manrope",
    },
    sections: [
      {
        item: "navbar-021",
        anchor: "",
        role: "Шапка",
        roleEn: "Header",
        note: "Словомарка, часы, телефон и бронь; прозрачная поверх фото, темнеет при скролле.",
        noteEn:
          "Wordmark, hours, phone and booking; transparent over the photo, darkens on scroll.",
      },
      {
        item: "hero-021",
        anchor: "hero",
        role: "Первый экран",
        roleEn: "First screen",
        note: "Фото с наездом, заголовок построчно, бегущая строка анонсов.",
        noteEn:
          "A photo with push-in, a line-by-line headline, an announcements ticker.",
      },
      {
        item: "restaurant-003",
        anchor: "menu",
        role: "Меню",
        roleEn: "Menu",
        note: "Разделы табами, лидеры до цены, метки, фото блюда у курсора.",
        noteEn:
          "Sections as tabs, leaders to the price, tags, a dish photo by the cursor.",
      },
      {
        item: "cta-016",
        anchor: "menu",
        role: "Плашка",
        roleEn: "Band",
        note: "«Вино недели» винной полосой с бликом между меню и шефом.",
        noteEn:
          "“Wine of the week” as a wine-red band with a shine between the menu and the chef.",
      },
      {
        item: "about-007",
        anchor: "chef",
        role: "Шеф",
        roleEn: "Chef",
        note: "Портрет со вторым фото внахлёст, цитата, росчерк, факты.",
        noteEn:
          "A portrait with an overlapping second photo, a quote, a signature, facts.",
      },
      {
        item: "restaurant-005",
        anchor: "hall",
        role: "Зал",
        roleEn: "Hall",
        note: "Колонки фото с параллаксом при скролле и лайтбокс.",
        noteEn: "Photo columns with scroll parallax and a lightbox.",
      },
      {
        item: "contact-016",
        anchor: "book",
        role: "Бронь",
        roleEn: "Booking",
        note: "Свободные окна чипами, дата, время, гости степпером, телефон.",
        noteEn: "Free slots as chips, date, time, guests stepper, phone.",
      },
      {
        item: "event-004",
        anchor: "events",
        role: "События",
        roleEn: "Events",
        note: "Лента с днём недели серифом, ценой и фото по наведению.",
        noteEn: "A feed with a serif weekday, price and a hover photo.",
      },
      {
        item: "testimonials-017",
        anchor: "reviews",
        role: "Отзывы",
        roleEn: "Reviews",
        note: "Стеклянные карточки поверх мутного фото зала, общая оценка.",
        noteEn: "Glass cards over a blurred hall photo, an overall score.",
      },
      {
        item: "map-005",
        anchor: "map",
        role: "Как добраться",
        roleEn: "Directions",
        note: "Яндекс Карта с меткой и карточка с адресом, часами и маршрутом.",
        noteEn:
          "A Yandex Map with a pin and a card with address, hours and a route.",
      },
      {
        item: "footer-020",
        anchor: "footer",
        role: "Подвал",
        roleEn: "Footer",
        note: "Часы по дням, телефон, мессенджеры значками, ссылки.",
        noteEn: "Hours by day, phone, messengers with icons, links.",
      },
    ],
  },
  {
    slug: "realty",
    label: "Агентство недвижимости",
    en: "Real estate agency",
    summary:
      "Сайт агентства недвижимости: поиск жилья на первом экране, подборка объектов с фильтром, районы на Яндекс Карте, шаги сделки, ипотечный калькулятор, агенты, отзывы, вопросы и заявка на оценку. Песочная тема с серифом и латунным акцентом.",
    summaryEn:
      "A real estate agency site: property search on the first screen, a filtered listings grid, districts on a Yandex Map, deal steps, a mortgage calculator, agents, reviews, FAQ and an appraisal form. A sand theme with serif headlines and a brass accent.",
    demo: "/scenarios/realty/demo",
    source: "app/scenarios/realty/demo/page.tsx",
    images: "docs/scenarios/realty/IMAGES.md",
    theme: {
      tone: "light",
      accent: "#b8925a",
      ink: "#173b2e",
      font: "Cormorant Garamond, Manrope",
    },
    sections: [
      {
        item: "navbar-020",
        anchor: "",
        role: "Шапка",
        roleEn: "Header",
        note: "Имя серифом, ссылки, телефон и кнопка «Оценить квартиру»; липнет к верху.",
        noteEn:
          "A serif name, links, phone and an “Appraise my flat” button; sticky.",
      },
      {
        item: "hero-020",
        anchor: "hero",
        role: "Первый экран",
        roleEn: "First screen",
        note: "Фото с медленным наездом и форма поиска: купить или снять, тип, район, бюджет.",
        noteEn:
          "A photo with a slow push-in and a search form: buy or rent, type, district, budget.",
      },
      {
        item: "realty-003",
        anchor: "objects",
        role: "Подборка объектов",
        roleEn: "Listings",
        note: "Шесть карточек с ценой и параметрами, чипы по типу, второе фото по наведению, по клику карточка переворачивается в окно.",
        noteEn:
          "Six cards with price and specs, type chips, a second photo on hover, a click flips the card into a window.",
      },
      {
        item: "map-004",
        anchor: "districts",
        role: "Районы",
        roleEn: "Districts",
        note: "Настоящая Яндекс Карта с метками районов и карточки с ценой за метр.",
        noteEn:
          "A real Yandex Map with district pins and cards with price per metre.",
      },
      {
        item: "realty-005",
        anchor: "process",
        role: "Шаги сделки",
        roleEn: "Deal steps",
        note: "Пять шагов со сроками на тёмно-зелёном фоне.",
        noteEn: "Five steps with durations on a dark green background.",
      },
      {
        item: "realty-006",
        anchor: "mortgage",
        role: "Ипотека",
        roleEn: "Mortgage",
        note: "Калькулятор с ползунками и набегающим платежом.",
        noteEn: "A calculator with sliders and a rolling payment.",
      },
      {
        item: "people-007",
        anchor: "agents",
        role: "Агенты",
        roleEn: "Agents",
        note: "Портреты 4:5, факт-плашка на фото, телефон и «написать».",
        noteEn: "4:5 portraits, a fact tag on the photo, phone and “message”.",
      },
      {
        item: "testimonials-016",
        anchor: "reviews",
        role: "Отзывы",
        roleEn: "Reviews",
        note: "Серифные цитаты со звёздами и источником, общая оценка в шапке.",
        noteEn:
          "Serif quotes with stars and a source, an overall score in the head.",
      },
      {
        item: "faq-016",
        anchor: "faq",
        role: "Вопросы",
        roleEn: "FAQ",
        note: "Серифный аккордеон на details в две колонки с липким заголовком.",
        noteEn:
          "A serif details accordion in two columns with a sticky heading.",
      },
      {
        item: "contact-015",
        anchor: "valuation",
        role: "Оценка квартиры",
        roleEn: "Appraisal",
        note: "Обещания, фото офиса и форма: адрес, метраж, комнаты, телефон.",
        noteEn:
          "Promises, an office photo and a form: address, area, rooms, phone.",
      },
      {
        item: "footer-019",
        anchor: "footer",
        role: "Подвал",
        roleEn: "Footer",
        note: "Адрес, часы, телефон и мессенджеры значками на тёмно-зелёном.",
        noteEn:
          "Address, hours, phone and messengers with icons on dark green.",
      },
    ],
  },
  {
    slug: "course",
    label: "Онлайн-курс",
    en: "Online course",
    summary:
      "Лендинг онлайн-курса: первый экран с маркером и превью урока, «для кого», программа по неделям, результаты выпускников, автор, неделя по дням, тарифы с рассрочкой, отзывы, вопросы и обратный отсчёт до старта. Светлая тема: индиго и лаймовый маркер.",
    summaryEn:
      "An online course landing: a hero with a marker and a lesson preview, who it's for, a week-by-week curriculum, graduate results, the author, a day-by-day week, pricing with instalments, reviews, FAQ and a countdown to the start. A light theme: indigo and a lime marker.",
    demo: "/scenarios/course/demo",
    source: "app/scenarios/course/demo/page.tsx",
    images: "docs/scenarios/course/IMAGES.md",
    theme: {
      tone: "light",
      accent: "#4f46e5",
      ink: "#111827",
      font: "Unbounded, Inter",
    },
    sections: [
      {
        item: "navbar-022",
        anchor: "",
        role: "Шапка",
        roleEn: "Header",
        note: "Кнопка с ценой и полоска прогресса чтения.",
        noteEn: "A button with the price and a reading-progress bar.",
      },
      {
        item: "hero-022",
        anchor: "hero",
        role: "Первый экран",
        roleEn: "First screen",
        note: "Маркерное подчёркивание, стикер мест, превью урока, факты и логотипы.",
        noteEn:
          "A marker underline, a seats sticker, a lesson preview, facts and logos.",
      },
      {
        item: "course-001",
        anchor: "who",
        role: "Для кого",
        roleEn: "Who it's for",
        note: "Три персоны переключателем и карточка результатов.",
        noteEn: "Three personas as a switch and an outcomes card.",
      },
      {
        item: "course-002",
        anchor: "program",
        role: "Программа",
        roleEn: "Curriculum",
        note: "Недели аккордеоном, уроки, домашки, липкая сводка.",
        noteEn: "Weeks as an accordion, lessons, homework, a sticky summary.",
      },
      {
        item: "course-003",
        anchor: "results",
        role: "Результаты",
        roleEn: "Results",
        note: "Выпускники «было → стало» со скринами работ.",
        noteEn: "Graduates “before → after” with work screenshots.",
      },
      {
        item: "about-008",
        anchor: "author",
        role: "Автор",
        roleEn: "Author",
        note: "Портрет, цитата с маркером, регалии и факты.",
        noteEn: "A portrait, a marker quote, credentials and facts.",
      },
      {
        item: "course-004",
        anchor: "format",
        role: "Как проходит",
        roleEn: "How it goes",
        note: "Неделя по дням лентой, фото и форматы.",
        noteEn: "A week day by day, a photo and formats.",
      },
      {
        item: "pricing-020",
        anchor: "pricing",
        role: "Тарифы",
        roleEn: "Pricing",
        note: "Три плана, переключатель рассрочки, места и скидка.",
        noteEn: "Three plans, an instalments switch, seats and a discount.",
      },
      {
        item: "testimonials-018",
        anchor: "reviews",
        role: "Отзывы",
        roleEn: "Reviews",
        note: "Видео-отзыв, фото, ссылки на профили, потоки.",
        noteEn: "A video review, photos, profile links, cohorts.",
      },
      {
        item: "faq-017",
        anchor: "faq",
        role: "Вопросы",
        roleEn: "FAQ",
        note: "Аккордеон и карточка «спросить в Telegram».",
        noteEn: "An accordion and an “ask on Telegram” card.",
      },
      {
        item: "cta-017",
        anchor: "enroll",
        role: "Запись",
        roleEn: "Enrolment",
        note: "Обратный отсчёт до старта, места и форма с email.",
        noteEn: "A countdown to the start, seats and an email form.",
      },
      {
        item: "footer-021",
        anchor: "footer",
        role: "Подвал",
        roleEn: "Footer",
        note: "Автор, ссылки, соцсети и реквизиты с лицензией.",
        noteEn: "The author, links, socials and legal details with a licence.",
      },
    ],
  },
  {
    slug: "festival",
    label: "Городской фестиваль",
    en: "City festival",
    summary:
      "Сайт городского фестиваля: гигантский заголовок и цветные капсулы направлений, манифест, программа с «выбором дня», расписание по дням, участники, площадки, билеты, карта, вопросы и баннер «купить билет». Белая страница, двенадцать цветов, капсулы и стикеры.",
    summaryEn:
      "A city festival site: a giant headline and colourful strand pills, a manifesto, a programme with a “pick of the day”, a day-by-day schedule, line-up, venues, tickets, a map, FAQ and a “buy a ticket” banner. A white page, twelve colours, pills and stickers.",
    demo: "/scenarios/festival/demo",
    source: "app/scenarios/festival/demo/page.tsx",
    images: "docs/scenarios/festival/IMAGES.md",
    theme: {
      tone: "light",
      accent: "#d3f43a",
      ink: "#111111",
      font: "Inter Tight, Inter",
    },
    sections: [
      {
        item: "navbar-023",
        anchor: "",
        role: "Шапка",
        roleEn: "Header",
        note: "Словомарка с точкой, серая капсула поиска и лаймовая «Билеты».",
        noteEn:
          "A wordmark with a dot, a grey search pill and a lime “Tickets”.",
      },
      {
        item: "hero-023",
        anchor: "hero",
        role: "Первый экран",
        roleEn: "First screen",
        note: "Гигантский заголовок и цветные капсулы направлений со стикерами.",
        noteEn: "A giant headline and colourful strand pills with stickers.",
      },
      {
        item: "about-009",
        anchor: "about",
        role: "Манифест",
        roleEn: "Manifesto",
        note: "Крупный текст с жирными вставками и капсулы фактов.",
        noteEn: "Large text with bold inserts and fact pills.",
      },
      {
        item: "event-005",
        anchor: "program",
        role: "Программа",
        roleEn: "Programme",
        note: "Сетка событий и липкая карточка «Выбор дня».",
        noteEn: "An event grid and a sticky “pick of the day” card.",
      },
      {
        item: "event-006",
        anchor: "schedule",
        role: "Расписание",
        roleEn: "Schedule",
        note: "Дни цветными капсулами, фильтр направлений, слоты по времени.",
        noteEn: "Days as colour pills, a strand filter, time slots.",
      },
      {
        item: "people-008",
        anchor: "lineup",
        role: "Участники",
        roleEn: "Line-up",
        note: "Цветные карточки хедлайнеров, раскрываются по наведению.",
        noteEn: "Colourful headliner cards that expand on hover.",
      },
      {
        item: "event-007",
        anchor: "venues",
        role: "Площадки",
        roleEn: "Venues",
        note: "Карточки в цветной рамке с фото-вкладкой и фактами.",
        noteEn: "Cards in a colour frame with a photo tab and facts.",
      },
      {
        item: "pricing-021",
        anchor: "tickets",
        role: "Билеты",
        roleEn: "Tickets",
        note: "Три цветных тарифа и счётчик билетов.",
        noteEn: "Three colour tiers and a ticket counter.",
      },
      {
        item: "map-006",
        anchor: "map",
        role: "Карта",
        roleEn: "Map",
        note: "Яндекс Карта с метками площадок и «как добраться».",
        noteEn: "A Yandex Map with venue pins and “how to get there”.",
      },
      {
        item: "faq-018",
        anchor: "faq",
        role: "Вопросы",
        roleEn: "FAQ",
        note: "Две колонки вопросов с цветными маркерами.",
        noteEn: "Two columns of questions with colour markers.",
      },
      {
        item: "cta-019",
        anchor: "cta",
        role: "Призыв",
        roleEn: "Call to action",
        note: "Фото-баннер с капсулами «Программа» и «Купить билет».",
        noteEn: "A photo banner with “Programme” and “Buy a ticket” pills.",
      },
      {
        item: "footer-022",
        anchor: "footer",
        role: "Подвал",
        roleEn: "Footer",
        note: "Цветная полоска, соцсети иконками и пять колонок.",
        noteEn: "A colour stripe, social icons and five columns.",
      },
    ],
  },
  {
    slug: "tattoo",
    label: "Тату-студия",
    en: "Tattoo studio",
    summary:
      "Сайт тату-студии: неоновая вывеска на первом экране, работы с фильтром по стилю и лайтбоксом, мастера-полароиды, как проходит сеанс, цифры, калькулятор цены, отзывы спустя годы, о студии и стерильности, вопросы, запись в три шага, контакты и подвал. Всегда тёмная тема: фуксия, фиолет и циан.",
    summaryEn:
      "A tattoo studio site: a neon sign hero, works filtered by style with a lightbox, polaroid artists, how a session goes, figures, a price calculator, reviews years later, about the studio and sterility, FAQ, a three-step booking, contacts and a footer. Always dark: magenta, violet and cyan.",
    demo: "/scenarios/tattoo/demo",
    source: "app/scenarios/tattoo/demo/page.tsx",
    images: "docs/scenarios/tattoo/IMAGES.md",
    theme: {
      tone: "dark",
      accent: "#ff2bd6",
      ink: "#f3eefc",
      font: "Unbounded, Manrope, JetBrains Mono",
    },
    sections: [
      {
        item: "navbar-024",
        anchor: "",
        role: "Шапка",
        roleEn: "Header",
        note: "Неоновый логотип, лазерные подчёркивания, статус «есть окна».",
        noteEn: "A neon logo, laser underlines, an “open slots” status.",
      },
      {
        item: "hero-024",
        anchor: "hero",
        role: "Первый экран",
        roleEn: "First screen",
        note: "Вывеска зажигается по буквам, фото с зерном, свечение за курсором.",
        noteEn:
          "A sign lighting up letter by letter, a grainy photo, a cursor glow.",
      },
      {
        item: "portfolio-007",
        anchor: "works",
        role: "Работы",
        roleEn: "Works",
        note: "Фильтр по стилю, ч/б → цвет по наведению, лайтбокс с историей.",
        noteEn:
          "A style filter, b/w → colour on hover, a lightbox with the story.",
      },
      {
        item: "people-009",
        anchor: "artists",
        role: "Мастера",
        roleEn: "Artists",
        note: "Полароиды с неоновой обводкой, переворачиваются к работам.",
        noteEn: "Neon-framed polaroids that flip to the works.",
      },
      {
        item: "process-001",
        anchor: "process",
        role: "Как проходит",
        roleEn: "How it goes",
        note: "Пять шагов вдоль линии с бегущим импульсом.",
        noteEn: "Five steps along a line with a running pulse.",
      },
      {
        item: "stats-001",
        anchor: "stats",
        role: "В цифрах",
        roleEn: "In numbers",
        note: "Неоновые кольца и счётчики.",
        noteEn: "Neon rings and counters.",
      },
      {
        item: "pricing-022",
        anchor: "pricing",
        role: "Стоимость",
        roleEn: "Pricing",
        note: "Калькулятор по размеру и зоне, три пакета.",
        noteEn: "A size-and-zone calculator, three packages.",
      },
      {
        item: "testimonials-019",
        anchor: "reviews",
        role: "Отзывы",
        roleEn: "Reviews",
        note: "Карусель coverflow с фото заживших работ.",
        noteEn: "A coverflow carousel with healed-work photos.",
      },
      {
        item: "about-010",
        anchor: "about",
        role: "О студии",
        roleEn: "About",
        note: "Манифест, стерильность, документы, фото с параллаксом.",
        noteEn: "A manifesto, sterility, documents, parallax photos.",
      },
      {
        item: "faq-019",
        anchor: "faq",
        role: "Вопросы",
        roleEn: "FAQ",
        note: "Аккордеон с неоновой линией у открытого.",
        noteEn: "An accordion with a neon line on the open item.",
      },
      {
        item: "contact-017",
        anchor: "booking",
        role: "Запись",
        roleEn: "Booking",
        note: "Три шага: мастер и зона, дата, идея; сводка справа.",
        noteEn:
          "Three steps: artist and zone, date, idea; a summary on the right.",
      },
      {
        item: "cta-020",
        anchor: "contacts",
        role: "Контакты",
        roleEn: "Contacts",
        note: "Табличка OPEN, телефон, мессенджеры.",
        noteEn: "An OPEN sign, phone, messengers.",
      },
      {
        item: "footer-023",
        anchor: "footer",
        role: "Подвал",
        roleEn: "Footer",
        note: "Адрес, часы, соцсети, 18+ и лицензия.",
        noteEn: "Address, hours, socials, 18+ and the licence.",
      },
    ],
  },
  {
    slug: "wedding",
    label: "Приглашение на свадьбу",
    en: "Wedding invitation",
    summary:
      "Сайт-приглашение на свадьбу: конверт с восковой печатью на входе, имена и обратный отсчёт, история пары плёночной лентой, программа дня, дресс-код палитрой, карта и отели, RSVP-анкета в пять шагов с меню и песней, вопросы, галерея, свидетели, подарки, стена пожеланий и подвал. Кремовая страница, слива и терракота, Cormorant Garamond.",
    summaryEn:
      "A wedding invitation site: a wax-sealed envelope at the door, names and a countdown, the couple's story as a film strip, the day's schedule, a dress-code palette, a map and hotels, a five-step RSVP with menu and song, FAQ, a gallery, the wedding party, gifts, a wishes wall and a footer. A cream page, plum and terracotta, Cormorant Garamond.",
    demo: "/scenarios/wedding/demo",
    source: "app/scenarios/wedding/demo/page.tsx",
    images: "docs/scenarios/wedding/IMAGES.md",
    theme: {
      tone: "light",
      accent: "#b8552f",
      ink: "#2b1a24",
      font: "Cormorant Garamond, Manrope",
    },
    sections: [
      {
        item: "navbar-025",
        anchor: "",
        role: "Шапка",
        roleEn: "Header",
        note: "Монограмма с датой, разделы serif'ом, музыка по клику и «Подтвердить».",
        noteEn:
          "A monogram with the date, serif sections, music on click and “RSVP”.",
      },
      {
        item: "hero-025",
        anchor: "hero",
        role: "Конверт и первый экран",
        roleEn: "Envelope and hero",
        note: "Печать открывает конверт; имена, дата, отсчёт, «в календарь», фото в арке.",
        noteEn:
          "The seal opens the envelope; names, date, countdown, “add to calendar”, an arched photo.",
      },
      {
        item: "about-011",
        anchor: "story",
        role: "История",
        roleEn: "Story",
        note: "Плёночная лента с четырьмя кадрами и датами.",
        noteEn: "A film strip with four dated frames.",
      },
      {
        item: "event-008",
        anchor: "program",
        role: "Программа дня",
        roleEn: "Schedule",
        note: "Вертикальный таймлайн с иконками и «что взять».",
        noteEn: "A vertical timeline with icons and “what to bring”.",
      },
      {
        item: "event-009",
        anchor: "dresscode",
        role: "Дресс-код",
        roleEn: "Dress code",
        note: "Палитра с копированием HEX, образы «ей» и «ему».",
        noteEn: "A palette with HEX copying, “her” and “him” looks.",
      },
      {
        item: "map-007",
        anchor: "place",
        role: "Место",
        roleEn: "Venue",
        note: "Фото усадьбы в арке, Яндекс Карта, как доехать, отели.",
        noteEn: "An arched estate photo, a Yandex Map, directions, hotels.",
      },
      {
        item: "contact-018",
        anchor: "rsvp",
        role: "Подтверждение",
        roleEn: "RSVP",
        note: "Пять шагов: кто, с кем, меню, трансфер, песня; сводка справа.",
        noteEn:
          "Five steps: who, with whom, menu, shuttle, song; a summary on the right.",
      },
      {
        item: "faq-020",
        anchor: "faq",
        role: "Вопросы",
        roleEn: "FAQ",
        note: "Аккордеон с римскими номерами, один открыт за раз.",
        noteEn: "An accordion with roman numerals, one open at a time.",
      },
      {
        item: "portfolio-008",
        anchor: "gallery",
        role: "Галерея",
        roleEn: "Gallery",
        note: "Masonry с арками, ч/б → цвет, лайтбокс.",
        noteEn: "Masonry with arches, b/w → colour, a lightbox.",
      },
      {
        item: "people-010",
        anchor: "people",
        role: "С кем вы встретитесь",
        roleEn: "Who you'll meet",
        note: "Свидетели и организатор полароидами с контактами.",
        noteEn: "The wedding party and planner as polaroids with contacts.",
      },
      {
        item: "cta-021",
        anchor: "gifts",
        role: "Подарки",
        roleEn: "Gifts",
        note: "Вклад в путешествие с копированием реквизитов, печать, вишлист.",
        noteEn: "A honeymoon fund with copyable details, a seal, a wishlist.",
      },
      {
        item: "testimonials-020",
        anchor: "wishes",
        role: "Пожелания",
        roleEn: "Wishes",
        note: "Записки на пробковой доске и форма «приколоть».",
        noteEn: "Notes on a cork board and a “pin it” form.",
      },
      {
        item: "footer-024",
        anchor: "footer",
        role: "Подвал",
        roleEn: "Footer",
        note: "Монограмма, хэштег, «ответьте до», с любовью.",
        noteEn: "A monogram, the hashtag, “reply by”, with love.",
      },
    ],
  },
  {
    slug: "wedding-cuba",
    label: "Свадьба на Кубе",
    en: "Wedding in Cuba",
    summary:
      "Сайт свадьбы-путешествия: посадочный талон с отрывным корешком на входе, пляж на весь экран и отсчёт «до вылета», маршрут пары самолётиком по линии рейса, три дня табами-билетами, дорожная информация с чек-листом «что взять», дресс-код beach formal, карта отеля и пляжа, check-in вместо RSVP, вопросы багажными бирками, открытки с переворотом, подарки «на следующий рейс», открытки от гостей и подвал-талон. Бумага и песок, чернила и коралл, Oswald и Lobster.",
    summaryEn:
      "A destination-wedding site: a boarding pass with a tear-off stub at the door, a full-screen beach and a “to departure” countdown, the couple's route as a plane on a flight line, three days as ticket tabs, travel info with a packing checklist, a beach-formal dress code, a hotel and beach map, check-in instead of RSVP, FAQ as luggage tags, flipping postcards, “next flight” gifts, guest postcards and a boarding-pass footer. Paper and sand, ink and coral, Oswald and Lobster.",
    demo: "/scenarios/wedding-cuba/demo",
    source: "app/scenarios/wedding-cuba/demo/page.tsx",
    images: "docs/scenarios/wedding-cuba/IMAGES.md",
    theme: {
      tone: "light",
      accent: "#ff6b57",
      ink: "#123a4b",
      font: "Oswald, Lobster, Manrope",
    },
    sections: [
      {
        item: "navbar-026",
        anchor: "",
        role: "Шапка",
        roleEn: "Header",
        note: "Верх посадочного талона: код рейса, счётчик «до вылета», музыка и «Check-in».",
        noteEn:
          "The top of a boarding pass: flight code, a “to departure” counter, music and “Check-in”.",
      },
      {
        item: "hero-026",
        anchor: "hero",
        role: "Талон и первый экран",
        roleEn: "Pass and hero",
        note: "Корешок отрывается, талон улетает, пляж на весь экран; имена, отсчёт, полароид, штамп.",
        noteEn:
          "The stub tears, the pass flies off, a full-screen beach; names, countdown, polaroid, stamp.",
      },
      {
        item: "about-012",
        anchor: "route",
        role: "Маршрут",
        roleEn: "Route",
        note: "Линия рейса с четырьмя пинами и самолётик, который едет при прокрутке.",
        noteEn: "A flight line with four pins and a plane that travels on scroll.",
      },
      {
        item: "event-010",
        anchor: "days",
        role: "Три дня",
        roleEn: "Three days",
        note: "Табы-билеты по дням, главный день коралловый, расписание и «что надеть».",
        noteEn:
          "Ticket tabs per day, the main day in coral, a timetable and “what to wear”.",
      },
      {
        item: "event-011",
        anchor: "travel",
        role: "Дорога",
        roleEn: "Travel",
        note: "Карточки-билеты: виза, деньги, связь; организатор; чек-лист «что взять».",
        noteEn:
          "Ticket cards: visa, money, connectivity; the planner; a packing checklist.",
      },
      {
        item: "event-012",
        anchor: "dresscode",
        role: "Дресс-код",
        roleEn: "Dress code",
        note: "Образцы ткани с копированием HEX, образы «ей» и «ему», правила пляжа.",
        noteEn:
          "Fabric swatches with HEX copying, “her” and “him” looks, beach rules.",
      },
      {
        item: "map-008",
        anchor: "place",
        role: "Где",
        roleEn: "Where",
        note: "Карта с отелем, пляжем и Гаваной, фото отеля на скотче, трансферы.",
        noteEn: "A map with the hotel, beach and Havana, a taped hotel photo, transfers.",
      },
      {
        item: "contact-019",
        anchor: "checkin",
        role: "Check-in",
        roleEn: "Check-in",
        note: "Пять шагов: летите ли, даты, отель, меню, песня; сводка-посадочный талон.",
        noteEn:
          "Five steps: flying, dates, hotel, menu, song; a boarding-pass summary.",
      },
      {
        item: "faq-021",
        anchor: "faq",
        role: "Вопросы",
        roleEn: "FAQ",
        note: "Багажные бирки с темой на хвостике, один открыт за раз.",
        noteEn: "Luggage tags with the topic on the stub, one open at a time.",
      },
      {
        item: "portfolio-009",
        anchor: "postcards",
        role: "Открытки",
        roleEn: "Postcards",
        note: "Фото на картоне со скотчем, клик переворачивает на оборот со штемпелем.",
        noteEn: "Taped photos on card; a click flips to a postmarked back.",
      },
      {
        item: "cta-022",
        anchor: "gifts",
        role: "Подарки",
        roleEn: "Gifts",
        note: "Билет «HAV → ???» с реквизитами, копирование ставит штамп «PAID».",
        noteEn: "A “HAV → ???” ticket with details; copying prints a “PAID” stamp.",
      },
      {
        item: "testimonials-021",
        anchor: "wishes",
        role: "Открытки от гостей",
        roleEn: "Guest postcards",
        note: "Стена открыток оборотом и форма — новая ложится первой со штемпелем.",
        noteEn: "A wall of postcard backs and a form — the new one lands first, postmarked.",
      },
      {
        item: "footer-025",
        anchor: "footer",
        role: "Подвал",
        roleEn: "Footer",
        note: "Низ талона: коды рейса, имена, координаты пляжа, хэштег, «check-in до».",
        noteEn:
          "The bottom of the pass: flight codes, names, beach coordinates, hashtag, “check-in by”.",
      },
    ],
  },
  {
    slug: "wedding-winter",
    label: "Зимняя свадьба при свечах",
    en: "Winter wedding by candlelight",
    summary:
      "Сайт зимней свадьбы в тёмной теме: свеча на входе, снег на всём сайте, дом в снежном лесу и отсчёт, история-гирлянда с лампочками, программа от заката до полуночи с луной, дресс-код «бархат и шерсть», карта с трансфером и ночёвкой, письмо-ответ с конвертом и сургучом, вопросы на стекле, галерея в оконных рамах, кто встречает, подарки «на камин», записки на запотевшем окне и подвал с хвоей. Синяя ночь, свечи и серебро, Cormorant Garamond и Marck Script.",
    summaryEn:
      "A dark-theme winter wedding site: a candle at the door, snow across the whole site, a house in a snowy forest and a countdown, a garland story with bulbs, a sunset-to-midnight schedule with a moon, a “velvet and wool” dress code, a map with shuttle and rooms, a reply letter with an envelope and wax seal, FAQ on frosted glass, a gallery in window frames, who meets you, “for the fireplace” gifts, notes on a fogged window and a pine footer. Night blue, candles and silver, Cormorant Garamond and Marck Script.",
    demo: "/scenarios/wedding-winter/demo",
    source: "app/scenarios/wedding-winter/demo/page.tsx",
    images: "docs/scenarios/wedding-winter/IMAGES.md",
    theme: {
      tone: "dark",
      accent: "#f2b64f",
      ink: "#f2eee6",
      font: "Cormorant Garamond, Marck Script, Manrope",
    },
    sections: [
      {
        item: "background-006",
        anchor: "",
        role: "Снег",
        roleEn: "Snow",
        note: "Слой на весь экран: снежинки трёх глубин, ветер, выключатель в шапке.",
        noteEn: "A full-screen layer: three flake depths, wind, a switch in the header.",
      },
      {
        item: "navbar-027",
        anchor: "",
        role: "Шапка",
        roleEn: "Header",
        note: "Гирлянда лампочек по краю, монограмма со снежинкой, снег и музыка по клику, «Ответить».",
        noteEn:
          "A bulb garland along the edge, a snowflake monogram, snow and music on click, “RSVP”.",
      },
      {
        item: "hero-027",
        anchor: "hero",
        role: "Свеча и первый экран",
        roleEn: "Candle and hero",
        note: "Клик по фитилю зажигает свечу; дом в лесу, имена, отсчёт, «в календарь», фото в окне.",
        noteEn:
          "A click on the wick lights the candle; a forest house, names, countdown, “add to calendar”, a photo in a window.",
      },
      {
        item: "about-013",
        anchor: "story",
        role: "История",
        roleEn: "Story",
        note: "Гирлянда с четырьмя лампочками, которые зажигаются при прокрутке, под ними кадры.",
        noteEn: "A garland with four bulbs lighting up on scroll, frames underneath.",
      },
      {
        item: "event-013",
        anchor: "evening",
        role: "Вечер",
        roleEn: "Evening",
        note: "Луна ползёт по небу при прокрутке, пункты вечера подсвечиваются свечой.",
        noteEn: "The moon crawls across the sky on scroll, evening items light up by candle.",
      },
      {
        item: "event-014",
        anchor: "dresscode",
        role: "Дресс-код",
        roleEn: "Dress code",
        note: "Ленты ткани на планке с копированием HEX, образы «ей» и «ему», правила вечера.",
        noteEn:
          "Fabric ribbons on a rail with HEX copying, “her” and “him” looks, evening rules.",
      },
      {
        item: "map-009",
        anchor: "place",
        role: "Как доехать",
        roleEn: "Getting there",
        note: "Тёмная карта, дом в морозной раме, машина, трансфер, ночёвка, парковка.",
        noteEn: "A dark map, the house in a frosted frame, car, shuttle, rooms, parking.",
      },
      {
        item: "contact-020",
        anchor: "rsvp",
        role: "Письмо-ответ",
        roleEn: "Reply letter",
        note: "Пять шагов на бумаге: кто, ночёвка, дорога, меню, песня; конверт с сургучом, штамп «Ждём».",
        noteEn:
          "Five steps on paper: who, stay, travel, menu, song; an envelope with a wax seal, a “Waiting” stamp.",
      },
      {
        item: "faq-022",
        anchor: "faq",
        role: "Вопросы",
        roleEn: "FAQ",
        note: "Карточки на стекле с инеем, снежинка поворачивается и загорается.",
        noteEn: "Cards on frosted glass, the snowflake rotates and lights up.",
      },
      {
        item: "portfolio-010",
        anchor: "gallery",
        role: "Кадры",
        roleEn: "Shots",
        note: "Фото в оконных рамах, иней тает по наведению, лайтбокс.",
        noteEn: "Photos in window frames, frost melts on hover, a lightbox.",
      },
      {
        item: "people-011",
        anchor: "people",
        role: "Кто встречает",
        roleEn: "Who meets you",
        note: "Свидетели и организатор со свечкой у каждого, контакты.",
        noteEn: "The wedding party and planner with a candle each, contacts.",
      },
      {
        item: "cta-023",
        anchor: "gifts",
        role: "Подарки",
        roleEn: "Gifts",
        note: "Карточка-камин с живым огнём, копирование реквизитов ставит «Спасибо!».",
        noteEn: "A hearth card with a live fire; copying the details prints “Thank you!”.",
      },
      {
        item: "testimonials-022",
        anchor: "wishes",
        role: "Пожелания",
        roleEn: "Wishes",
        note: "Записки на запотевшем окне и форма «написать на стекле».",
        noteEn: "Notes on a fogged window and a “write on the glass” form.",
      },
      {
        item: "footer-026",
        anchor: "footer",
        role: "Подвал",
        roleEn: "Footer",
        note: "Хвоя по углам, монограмма, «до встречи в снегу», хэштег, «ответьте до».",
        noteEn: "Pine in the corners, the monogram, “see you in the snow”, hashtag, “reply by”.",
      },
    ],
  },
  {
    slug: "bakery",
    label: "Кофейня-пекарня",
    en: "Café-bakery",
    summary:
      "Сайт кофейни-пекарни, который живёт по часам печи: шапка с живым «открыто / откроемся через», первый экран с таймером печи и лентой партий, полка с перетаскиванием и остатками, шкала крепости кофе с наполняющимся стаканом, конструктор коробки к утру, scroll-история «36 часов до буханки» с ночью и утром, люди с записками, перфокарта со штампами, bento-галерея, отзывы на чеках, карта с очередью по часам, хлебный будильник и подвал с полосой дня. Светлая тема: молоко, корка и мак, Unbounded и Caveat.",
    summaryEn:
      "A café-bakery site that lives by the oven clock: a header with a live “open / opens in”, a hero with an oven timer and a batch ribbon, a draggable shelf with stock, a coffee strength slider with a filling cup, a morning box builder, a “36 hours to a loaf” scroll story from night to morning, people with notes, a punch card with stamps, a bento gallery, receipt reviews, a map with an hourly queue, a bread alarm and a footer with a day bar. Light theme: milk, crust and poppy, Unbounded and Caveat.",
    demo: "/scenarios/bakery/demo",
    source: "app/scenarios/bakery/demo/page.tsx",
    images: "docs/scenarios/bakery/IMAGES.md",
    theme: {
      tone: "light",
      accent: "#e4572e",
      ink: "#1f1a17",
      font: "Unbounded, Golos Text, Caveat",
    },
    sections: [
      { item: "navbar-028", anchor: "", role: "Шапка", roleEn: "Header", note: "Словомарка, разделы, живой чип «открыто · до 21:00» по часам посетителя, стекло при прокрутке.", noteEn: "Wordmark, sections, a live “open · until 21:00” chip on the visitor's clock, glass on scroll." },
      { item: "hero-028", anchor: "top", role: "Первый экран", roleEn: "First screen", note: "Фото витрины, заголовок поднимается как тесто, таймер печи и лента партий дня.", noteEn: "A shop photo, a headline rising like dough, an oven timer and the day's batch ribbon." },
      { item: "bakery-001", anchor: "shelf", role: "Витрина", roleEn: "Shelf", note: "Полка с перетаскиванием, «испечено в», остаток, кнопка «в коробку».", noteEn: "A draggable shelf, “baked at”, stock, an “add to box” button." },
      { item: "bakery-002", anchor: "coffee", role: "Кофе", roleEn: "Coffee", note: "Ползунок крепости, стакан наполняется слоями, зерно недели.", noteEn: "A strength slider, the cup fills with layers, the bean of the week." },
      { item: "bakery-003", anchor: "box", role: "Коробка к утру", roleEn: "Morning box", note: "Четыре ячейки, крышка со штампом, форма заказа к выбранному времени.", noteEn: "Four cells, a stamped lid, an order form for the chosen time." },
      { item: "bakery-004", anchor: "story", role: "36 часов до буханки", roleEn: "36 hours to a loaf", note: "Sticky-история по прокрутке: кадры, табло часов, ночь и утро.", noteEn: "A sticky scroll story: frames, a clock board, night and morning." },
      { item: "people-012", anchor: "people", role: "Люди", roleEn: "People", note: "Плитки пекаря и бариста, записка «что в 5 утра» по наведению.", noteEn: "Baker and barista tiles, a “what's at 5 a.m.” note on hover." },
      { item: "bakery-005", anchor: "loyalty", role: "Постоянным", roleEn: "Regulars", note: "Перфокарта со штампами и подписка на хлеб по субботам.", noteEn: "A punch card with stamps and a Saturday bread subscription." },
      { item: "portfolio-011", anchor: "gallery", role: "Галерея", roleEn: "Gallery", note: "Bento из десяти кадров одного утра с подписями по наведению.", noteEn: "A bento of ten shots from one morning with hover captions." },
      { item: "testimonials-023", anchor: "reviews", role: "Отзывы", roleEn: "Reviews", note: "Чеки, которые допечатываются построчно при появлении.", noteEn: "Receipts that print line by line as they appear." },
      { item: "map-010", anchor: "where", role: "Где мы", roleEn: "Find us", note: "Карта, часы и очередь по часам с подсветкой «сейчас».", noteEn: "A map, hours and an hourly queue with a “now” highlight." },
      { item: "subscribe-007", anchor: "newsletter", role: "Хлебный будильник", roleEn: "Bread alarm", note: "Выбор выпечки и напоминание за пять минут до выхода, на крафт-пакете.", noteEn: "Pick a pastry and get a reminder five minutes before it's out, on a kraft bag." },
      { item: "footer-027", anchor: "footer", role: "Подвал", roleEn: "Footer", note: "Колонки ссылок и полоса рабочего дня, залитая до текущего часа.", noteEn: "Link columns and a working-day bar filled to the current hour." },
    ],
  },
  {
    slug: "podcast",
    label: "Подкаст",
    en: "Podcast",
    summary:
      "Сайт подкаста в тёмной теме с кислотным индикатором записи: шапка с чипом «сейчас играет», плеер эпизода недели с живой волной и главами, лента эпизодов, где длительность — длина полосы, цитаты бегущими строками навстречу друг другу, гости бесконечной лентой, статистика count-up и платформы с наклоном, уровни поддержки на фоне студии, письмо после выпуска с переворотом конверта, подвал с огромной словомаркой и мини-плеер, который выезжает снизу и связывает всё событиями. Sofia Sans Extra Condensed, Inter Tight и IBM Plex Mono.",
    summaryEn:
      "A dark-theme podcast site with an acid recording light: a header with a “now playing” chip, an episode-of-the-week player with a live waveform and chapters, an episode list where duration is bar length, quote marquees running towards each other, guests as an endless lane, count-up stats and tilting platforms, support tiers over the studio photo, a post-episode letter with an envelope flip, a footer with a giant wordmark and a bottom mini-player that ties everything together with events. Sofia Sans Extra Condensed, Inter Tight and IBM Plex Mono.",
    demo: "/scenarios/podcast/demo",
    source: "app/scenarios/podcast/demo/page.tsx",
    images: "docs/scenarios/podcast/IMAGES.md",
    theme: {
      tone: "dark",
      accent: "#c8f542",
      ink: "#f3efe6",
      font: "Sofia Sans Extra Condensed, Inter Tight, IBM Plex Mono",
    },
    sections: [
      { item: "navbar-029", anchor: "", role: "Шапка", roleEn: "Header", note: "Словомарка, разделы, чип «сейчас играет» от мини-плеера, стекло при прокрутке.", noteEn: "Wordmark, sections, a “now playing” chip fed by the mini-player, glass on scroll." },
      { item: "hero-029", anchor: "top", role: "Эпизод недели", roleEn: "Episode of the week", note: "Обложка, плакатный заголовок, play, волна из полосок, таймер и главы.", noteEn: "Cover, poster headline, play, a bar waveform, a timer and chapters." },
      { item: "podcast-004", anchor: "episodes", role: "Эпизоды", roleEn: "Episodes", note: "Длительность — длина полосы, hover раскрывает описание, play шлёт событие плееру.", noteEn: "Duration as bar length, hover expands the description, play emits an event to the player." },
      { item: "podcast-005", anchor: "", role: "Цитаты", roleEn: "Quotes", note: "Две бегущие строки навстречу друг другу, пауза по наведению.", noteEn: "Two marquees running towards each other, paused on hover." },
      { item: "people-013", anchor: "guests", role: "Гости", roleEn: "Guests", note: "Бесконечная лента портретов с номером эпизода, остановка под курсором.", noteEn: "An endless lane of portraits with episode numbers, stopping under the cursor." },
      { item: "podcast-006", anchor: "listen", role: "Где слушать", roleEn: "Where to listen", note: "Статистика считает вверх, плитки платформ наклоняются к курсору.", noteEn: "Stats count up, platform tiles tilt towards the cursor." },
      { item: "pricing-023", anchor: "support", role: "Поддержать", roleEn: "Support", note: "Три уровня на фоне студии, переключатель месяц/год.", noteEn: "Three tiers over the studio photo, a monthly/yearly switch." },
      { item: "subscribe-008", anchor: "letter", role: "Письмо", roleEn: "Letter", note: "Одно поле, «что внутри» и переворот в «записали».", noteEn: "One field, “what's inside” and a flip into “noted”." },
      { item: "footer-028", anchor: "footer", role: "Подвал", roleEn: "Footer", note: "Карточка ведущей, платформы, RSS и словомарка на всю ширину.", noteEn: "A host card, platforms, RSS and a full-width wordmark." },
      { item: "podcast-007", anchor: "", role: "Мини-плеер", roleEn: "Mini-player", note: "Полоса у нижнего края: появляется по событию из ленты, рассылает состояние.", noteEn: "A bottom bar: appears on an event from the list, broadcasts state." },
    ],
  },
  {
    slug: "opensource",
    label: "Open-source проект",
    en: "Open-source project",
    summary:
      "Сайт open-source библиотеки в светлой инженерной теме на линиях: шапка с чипом звёзд GitHub, первый экран с копируемой командой установки и терминалом, который печатает сам, песочница, где переключатели меняют и код, и живую таблицу, возможности bento-плитками с CSS-микродемо, сравнение размера бандла растущими полосами, сообщество со стеной контрибьюторов из инициалов, история версий с метками breaking, призыв поставить звезду и минимальный подвал. Onest и JetBrains Mono, электрик-синий акцент.",
    summaryEn:
      "An open-source library site in a light engineering hairline theme: a header with a GitHub stars chip, a hero with a copyable install command and a self-typing terminal, a playground where toggles change both the code and a live table, features as bento tiles with CSS micro-demos, a bundle-size comparison with growing bars, a community with an initials contributors wall, a version history with breaking tags, a star-us call to action and a minimal footer. Onest and JetBrains Mono, an electric blue accent.",
    demo: "/scenarios/opensource/demo",
    source: "app/scenarios/opensource/demo/page.tsx",
    images: "docs/scenarios/opensource/IMAGES.md",
    theme: {
      tone: "light",
      accent: "#2f5bff",
      ink: "#111111",
      font: "Onest, JetBrains Mono",
    },
    sections: [
      { item: "navbar-030", anchor: "", role: "Шапка", roleEn: "Header", note: "Имя пакета, версия, разделы, чип звёзд GitHub с count-up.", noteEn: "Package name, version, sections, a GitHub stars chip with count-up." },
      { item: "hero-030", anchor: "top", role: "Первый экран", roleEn: "First screen", note: "Заголовок, установка с вкладками и копированием, терминал печатает сам.", noteEn: "Headline, install with tabs and copy, a self-typing terminal." },
      { item: "opensource-001", anchor: "playground", role: "Песочница", roleEn: "Playground", note: "Переключатели меняют код и живую таблицу одновременно.", noteEn: "Toggles change the code and the live table at once." },
      { item: "bento-001", anchor: "docs", role: "Возможности", roleEn: "Features", note: "Bento-плитки с CSS-микродемо: виртуализация, сортировка, группировка, типы, размер.", noteEn: "Bento tiles with CSS micro-demos: virtualisation, sorting, grouping, types, size." },
      { item: "comparison-006", anchor: "compare", role: "Сравнение", roleEn: "Comparison", note: "Размер бандла полосами, растут при появлении, числа считают вверх.", noteEn: "Bundle size as bars growing on appear, numbers counting up." },
      { item: "stats-002", anchor: "community", role: "Сообщество", roleEn: "Community", note: "Числа count-up и стена контрибьюторов из инициалов.", noteEn: "Count-up numbers and an initials contributors wall." },
      { item: "changelog-004", anchor: "changelog", role: "История версий", roleEn: "Changelog", note: "Аккордеон релизов с метками latest и breaking.", noteEn: "A release accordion with latest and breaking tags." },
      { item: "cta-024", anchor: "star", role: "Звезда", roleEn: "Star", note: "Звезда заливается по наведению, кнопки GitHub и npm, спонсоры.", noteEn: "A star that fills on hover, GitHub and npm buttons, sponsors." },
      { item: "footer-029", anchor: "footer", role: "Подвал", roleEn: "Footer", note: "Версия, лицензия, ссылки, статус CI.", noteEn: "Version, licence, links, CI status." },
    ],
  },
  {
    slug: "portfolio",
    label: "Портфолио разработчика / дизайнера",
    en: "Developer / designer portfolio",
    summary:
      "Личный сайт дизайнера-разработчика на бумаге с ультрафиолетом: шапка с чипом доступности и живыми часами города, первый экран с печатающимися ролями, светом за курсором и магнитными кнопками, проекты стопкой sticky-карточек, «работал с» текстом бегущей строкой, «обо мне» с фото ч/б → цвет, отзывы по одному с автопрокруткой, контакт с копируемой почтой и подвал в одну полосу. Inter Tight, Golos Text и IBM Plex Mono.",
    summaryEn:
      "A designer-developer's personal site on paper with ultraviolet: a header with an availability chip and a live city clock, a hero with typing roles, a cursor spotlight and magnetic buttons, projects as a stack of sticky cards, “worked with” as a text marquee, “about me” with a B/W → colour photo, one-at-a-time autoplay reviews, a contact with a copyable email and a one-row footer. Inter Tight, Golos Text and IBM Plex Mono.",
    demo: "/scenarios/portfolio/demo",
    source: "app/scenarios/portfolio/demo/page.tsx",
    images: "docs/scenarios/portfolio/IMAGES.md",
    theme: {
      tone: "light",
      accent: "#5b3df5",
      ink: "#141414",
      font: "Inter Tight, Golos Text, IBM Plex Mono",
    },
    sections: [
      { item: "navbar-031", anchor: "", role: "Шапка", roleEn: "Header", note: "Имя, чип «открыт к проектам», живые часы города, кнопка «Написать».", noteEn: "Name, an “open to projects” chip, a live city clock, a “Write” button." },
      { item: "hero-031", anchor: "top", role: "Первый экран", roleEn: "First screen", note: "Огромное имя, роли печатаются, свет за курсором, магнитные кнопки.", noteEn: "A huge name, typing roles, a cursor spotlight, magnetic buttons." },
      { item: "portfolio-012", anchor: "work", role: "Проекты", roleEn: "Work", note: "Стопка sticky-карточек: следующая наезжает, предыдущая уменьшается.", noteEn: "A stack of sticky cards: the next slides over, the previous shrinks." },
      { item: "logocloud-007", anchor: "", role: "Работал с", roleEn: "Worked with", note: "Названия компаний текстом бегущей строкой, начертания чередуются.", noteEn: "Company names as a text marquee with alternating styles." },
      { item: "about-014", anchor: "about", role: "Обо мне", roleEn: "About", note: "Фото ч/б → цвет, три факта, навыки тегами, линия карьеры.", noteEn: "A B/W → colour photo, three facts, skill tags, a career line." },
      { item: "testimonials-024", anchor: "words", role: "Отзывы", roleEn: "Words", note: "По одной цитате крупно, автопрокрутка с полосой, стрелки и клавиши.", noteEn: "One big quote at a time, autoplay with a bar, arrows and keys." },
      { item: "contact-021", anchor: "contact", role: "Контакт", roleEn: "Contact", note: "Почта копируется кликом, местное время, соцсети с никами, фото.", noteEn: "Email copies on click, local time, socials with handles, a photo." },
      { item: "footer-030", anchor: "footer", role: "Подвал", roleEn: "Footer", note: "Имя, ссылки, год, кнопка «наверх» со стрелкой.", noteEn: "Name, links, year, a “to top” arrow button." },
    ],
  },
  {
    slug: "app",
    label: "Мобильное приложение",
    en: "Mobile app",
    summary:
      "Лендинг приложения для сна и дыхания в светлой лавандовой теме — без скриншотов: шапка с «дышащим» лого и рейтингом, первый экран с телефоном из CSS, на котором круг дышит в такт 4-7-8, возможности с липким телефоном, экраны которого меняются по прокрутке, «до / после» с ползунком сравнения графиков сна, отзывы из магазинов лентой, тарифы бесплатно / премиум с таблицей, вопросы аккордеоном, «скачать» с QR из CSS и подвал с бейджами. Manrope и IBM Plex Mono.",
    summaryEn:
      "A sleep-and-breathing app landing in a light lavender theme — with no screenshots: a header with a “breathing” logo and rating, a hero with a CSS phone whose circle breathes to 4-7-8, features with a sticky phone whose screens change on scroll, “before / after” with a sleep chart comparison slider, store reviews as a strip, free / premium pricing with a table, an FAQ accordion, a “download” CTA with a CSS QR and a footer with badges. Manrope and IBM Plex Mono.",
    demo: "/scenarios/app/demo",
    source: "app/scenarios/app/demo/page.tsx",
    images: "docs/scenarios/app/IMAGES.md",
    theme: {
      tone: "light",
      accent: "#7c5cff",
      ink: "#1c1b2e",
      font: "Manrope, IBM Plex Mono",
    },
    sections: [
      { item: "navbar-032", anchor: "", role: "Шапка", roleEn: "Header", note: "Лого с пульсирующей точкой, разделы, чип рейтинга, кнопка «Скачать».", noteEn: "A logo with a pulsing dot, sections, a rating chip, a “Download” button." },
      { item: "hero-032", anchor: "top", role: "Первый экран", roleEn: "First screen", note: "CSS-телефон с дышащим кругом 4-7-8, рейтинг звёздами, бейджи магазинов.", noteEn: "A CSS phone with a 4-7-8 breathing circle, star rating, store badges." },
      { item: "app-001", anchor: "features", role: "Что внутри", roleEn: "Inside", note: "Список фич и липкий телефон, экран меняется по прокрутке.", noteEn: "A feature list and a sticky phone whose screen changes on scroll." },
      { item: "app-002", anchor: "results", role: "Результат", roleEn: "Results", note: "Графики сна до и после, ползунок сравнения.", noteEn: "Sleep charts before and after, a comparison slider." },
      { item: "testimonials-025", anchor: "reviews", role: "Отзывы", roleEn: "Reviews", note: "Карточки из App Store и Google Play лентой со snap, общий рейтинг.", noteEn: "App Store and Google Play cards in a snap strip, an overall rating." },
      { item: "pricing-024", anchor: "pricing", role: "Тарифы", roleEn: "Pricing", note: "Бесплатно и премиум, месяц/год, «7 дней бесплатно», таблица функций.", noteEn: "Free and premium, monthly/yearly, “7 days free”, a feature table." },
      { item: "faq-023", anchor: "faq", role: "Вопросы", roleEn: "FAQ", note: "Аккордеон с плюсом-крестиком, один открыт.", noteEn: "An accordion with a plus-to-cross toggle, one open." },
      { item: "cta-025", anchor: "download", role: "Скачать", roleEn: "Download", note: "Тёмная карточка на фото, бейджи и QR-код из CSS.", noteEn: "A dark card over a photo, badges and a CSS QR code." },
      { item: "footer-031", anchor: "footer", role: "Подвал", roleEn: "Footer", note: "Лого, ссылки, магазины, правовые пункты.", noteEn: "Logo, links, stores, legal items." },
    ],
  },
  {
    slug: "saas",
    label: "AI-инструмент / SaaS",
    en: "AI tool / SaaS",
    summary:
      "Сайт AI-сервиса для встреч в тёмной «авроре» со стеклом — сайт сам является демо: шапка с искрой и аврора-линией, первый экран, где ассистент печатает сводку по расшифровке созвона, «как работает» конвейером из трёх анимированных узлов, песочница с кнопкой и ответом по секциям, интеграции на двух орбитах, бегущая строка клиентов, тарифы с ползунком мест и годовой скидкой, вопросы о данных аккордеоном, стеклянный призыв с полем почты и подвал со статусом систем. Ни одной фотографии. Wix Madefor Display, Golos Text и IBM Plex Mono.",
    summaryEn:
      "An AI meeting-assistant site in a dark aurora with glass — the site is the demo: a header with a spark and an aurora line, a hero where the assistant types a recap from a call transcript, a “how it works” pipeline of three animated nodes, a sandbox with a button and a sectioned answer, integrations on two orbits, a client marquee, pricing with a seats slider and a yearly discount, a data FAQ accordion, a glass email call to action and a footer with a system status. Not a single photo. Wix Madefor Display, Golos Text and IBM Plex Mono.",
    demo: "/scenarios/saas/demo",
    source: "app/scenarios/saas/demo/page.tsx",
    images: "docs/scenarios/saas/IMAGES.md",
    theme: {
      tone: "dark",
      accent: "#5ee7ff",
      ink: "#eef2ff",
      font: "Wix Madefor Display, Golos Text, IBM Plex Mono",
    },
    sections: [
      { item: "navbar-033", anchor: "", role: "Шапка", roleEn: "Header", note: "Лого с мерцающей искрой, разделы, «Войти», «Начать бесплатно», аврора-линия при прокрутке.", noteEn: "A logo with a twinkling spark, sections, “Log in”, “Start free”, an aurora line on scroll." },
      { item: "hero-033", anchor: "top", role: "Первый экран", roleEn: "First screen", note: "Градиентное слово в заголовке, расшифровка созвона и ассистент, который печатает сводку по токенам.", noteEn: "A gradient word in the headline, a call transcript and an assistant typing the recap token by token." },
      { item: "ai-001", anchor: "how", role: "Как работает", roleEn: "How it works", note: "Три узла — звук, текст, задачи — с микроанимациями и бегущими точками между ними.", noteEn: "Three nodes — audio, text, tasks — with micro-animations and dots running between them." },
      { item: "ai-002", anchor: "sandbox", role: "Песочница", roleEn: "Sandbox", note: "Поле с расшифровкой, кнопка «Сделать сводку», ответ печатается секциями, «Скопировать».", noteEn: "A transcript field, a “Make a recap” button, the answer types out in sections, “Copy”." },
      { item: "bento-002", anchor: "integrations", role: "Интеграции", roleEn: "Integrations", note: "Сервисы кружат на двух орбитах вокруг продукта, наведение останавливает и подписывает.", noteEn: "Services circle the product on two orbits, hover pauses and labels them." },
      { item: "logocloud-007", anchor: "", role: "Доверяют", roleEn: "Trusted by", note: "Бегущая строка названий клиентов.", noteEn: "A marquee of client names." },
      { item: "pricing-025", anchor: "pricing", role: "Тарифы", roleEn: "Pricing", note: "Ползунок «человек в команде», переключатель года, три карточки с пересчётом.", noteEn: "A “people on the team” slider, a yearly switch, three cards that recalculate." },
      { item: "faq-023", anchor: "security", role: "Данные", roleEn: "Data", note: "Аккордеон о хранении, обучении модели и своём контуре.", noteEn: "An accordion on storage, model training and on-premise." },
      { item: "cta-026", anchor: "start", role: "Начать", roleEn: "Get started", note: "Стеклянная карточка на плавающих аврорах, поле почты, «без карты».", noteEn: "A glass card on floating auroras, an email field, “no card”." },
      { item: "footer-032", anchor: "footer", role: "Подвал", roleEn: "Footer", note: "Статус «все системы работают» с пульсом, колонки ссылок, правовые пункты, соцсети.", noteEn: "An “all systems operational” status with a pulse, link columns, legal items, socials." },
    ],
  },
]

// Опечатка в имени item'а здесь означала бы пустую карточку в рецепте,
// поэтому состав проверяется при загрузке модуля, а не глазами.
for (const scenario of SCENARIOS) {
  for (const section of scenario.sections) {
    if (!getCatalogItem(section.item)) {
      throw new Error(
        `registry/scenarios.ts: сценарий "${scenario.slug}" ссылается на item "${section.item}", которого нет в каталоге`,
      )
    }
  }
}
