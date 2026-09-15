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
      { item: "surface-025", anchor: "", role: "Фон тетради", roleEn: "Notebook background", note: "Клетка на всю страницу; секции отдают свою бумагу прозрачной.", noteEn: "Squares across the whole page; sections make their paper transparent." },
      { item: "sketch-019", anchor: "", role: "Шапка", roleEn: "Header", note: "Нарисованный фотоаппарат, ссылки с росчерком, кнопка в штриховке.", noteEn: "A sketched camera, stroke-underlined links, a hatched button." },
      { item: "sketch-016", anchor: "hero", role: "Первый экран", roleEn: "First screen", note: "Заголовок с обведённым словом и фото, приклеенное скотчем.", noteEn: "A headline with a circled word and a taped photo." },
      { item: "sketch-018", anchor: "works", role: "Скролл и поля", roleEn: "Scroll and margins", note: "Обёртка всех секций: листы въезжают на стол, нитка и доодлы на полях.", noteEn: "Wraps every section: sheets land on the desk, a thread and doodles in the margins." },
      { item: "sketch-017", anchor: "works", role: "Работы", roleEn: "Work", note: "Галерея с фильтром по жанрам и вылетом кадра на передний план.", noteEn: "A gallery with genre filter and a fly-out lightbox." },
      { item: "sketch-013", anchor: "process", role: "Разделители", roleEn: "Dividers", note: "Линия от руки с подписью между секциями.", noteEn: "A hand-drawn line with a caption between sections." },
      { item: "sketch-009", anchor: "process", role: "Пометка в заголовке", roleEn: "Headline mark", note: "Маркер под словом «съёмка».", noteEn: "A highlighter under one word." },
      { item: "sketch-012", anchor: "process", role: "Шаги съёмки", roleEn: "Shoot steps", note: "Пять шагов процесса кружками.", noteEn: "Five process steps in circles." },
      { item: "sketch-007", anchor: "process", role: "Карточки", roleEn: "Cards", note: "Шаги подробно и три формата с ценами.", noteEn: "Step details and three priced packages." },
      { item: "sketch-020", anchor: "about", role: "Обо мне", roleEn: "About", note: "Фото, цифры в кружках, список с галочками.", noteEn: "A photo, circled numbers, a checkmark list." },
      { item: "sketch-015", anchor: "reviews", role: "Отзывы", roleEn: "Reviews", note: "Три рукописные цитаты.", noteEn: "Three handwritten quotes." },
      { item: "sketch-001", anchor: "pricing", role: "Кнопки в ценах", roleEn: "Price buttons", note: "«Выбрать» в каждой карточке формата.", noteEn: "“Choose” in every package card." },
      { item: "sketch-021", anchor: "book", role: "Запись", roleEn: "Booking", note: "Форма: день, время, телефон, согласие.", noteEn: "A form: day, time, phone, consent." },
      { item: "sketch-022", anchor: "footer", role: "Подвал", roleEn: "Footer", note: "Следующая история на приклеенном фото и строка со студией.", noteEn: "The next story on a taped photo and the studio row." },
      { item: "sketch-023", anchor: "process", role: "Стикеры на полях", roleEn: "Margin stickers", note: "Три записки: перенос по погоде, настоящие люди, свободные даты.", noteEn: "Three notes: weather rescheduling, real people, free dates." },
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
      { item: "realty-001", anchor: "", role: "Шапка", roleEn: "Header", note: "Имя серифом, ссылки, телефон и кнопка «Оценить квартиру»; липнет к верху.", noteEn: "A serif name, links, phone and an “Appraise my flat” button; sticky." },
      { item: "realty-002", anchor: "hero", role: "Первый экран", roleEn: "First screen", note: "Фото с медленным наездом и форма поиска: купить или снять, тип, район, бюджет.", noteEn: "A photo with a slow push-in and a search form: buy or rent, type, district, budget." },
      { item: "realty-003", anchor: "objects", role: "Подборка объектов", roleEn: "Listings", note: "Шесть карточек с ценой и параметрами, чипы по типу, второе фото по наведению, по клику карточка переворачивается в окно.", noteEn: "Six cards with price and specs, type chips, a second photo on hover, a click flips the card into a window." },
      { item: "realty-010", anchor: "districts", role: "Районы", roleEn: "Districts", note: "Настоящая Яндекс Карта с метками районов и карточки с ценой за метр.", noteEn: "A real Yandex Map with district pins and cards with price per metre." },
      { item: "realty-005", anchor: "process", role: "Шаги сделки", roleEn: "Deal steps", note: "Пять шагов со сроками на тёмно-зелёном фоне.", noteEn: "Five steps with durations on a dark green background." },
      { item: "realty-006", anchor: "mortgage", role: "Ипотека", roleEn: "Mortgage", note: "Калькулятор с ползунками и набегающим платежом.", noteEn: "A calculator with sliders and a rolling payment." },
      { item: "realty-008", anchor: "agents", role: "Агенты", roleEn: "Agents", note: "Портреты 4:5, факт-плашка на фото, телефон и «написать».", noteEn: "4:5 portraits, a fact tag on the photo, phone and “message”." },
      { item: "realty-009", anchor: "reviews", role: "Отзывы", roleEn: "Reviews", note: "Серифные цитаты со звёздами и источником, общая оценка в шапке.", noteEn: "Serif quotes with stars and a source, an overall score in the head." },
      { item: "realty-011", anchor: "faq", role: "Вопросы", roleEn: "FAQ", note: "Серифный аккордеон на details в две колонки с липким заголовком.", noteEn: "A serif details accordion in two columns with a sticky heading." },
      { item: "realty-007", anchor: "valuation", role: "Оценка квартиры", roleEn: "Appraisal", note: "Обещания, фото офиса и форма: адрес, метраж, комнаты, телефон.", noteEn: "Promises, an office photo and a form: address, area, rooms, phone." },
      { item: "realty-012", anchor: "footer", role: "Подвал", roleEn: "Footer", note: "Адрес, часы, телефон и мессенджеры значками на тёмно-зелёном.", noteEn: "Address, hours, phone and messengers with icons on dark green." },
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
      { item: "restaurant-001", anchor: "", role: "Шапка", roleEn: "Header", note: "Словомарка, часы, телефон и бронь; прозрачная поверх фото, темнеет при скролле.", noteEn: "Wordmark, hours, phone and booking; transparent over the photo, darkens on scroll." },
      { item: "restaurant-002", anchor: "hero", role: "Первый экран", roleEn: "First screen", note: "Фото с наездом, заголовок построчно, бегущая строка анонсов.", noteEn: "A photo with push-in, a line-by-line headline, an announcements ticker." },
      { item: "restaurant-003", anchor: "menu", role: "Меню", roleEn: "Menu", note: "Разделы табами, лидеры до цены, метки, фото блюда у курсора.", noteEn: "Sections as tabs, leaders to the price, tags, a dish photo by the cursor." },
      { item: "restaurant-011", anchor: "menu", role: "Плашка", roleEn: "Band", note: "«Вино недели» винной полосой с бликом между меню и шефом.", noteEn: "“Wine of the week” as a wine-red band with a shine between the menu and the chef." },
      { item: "restaurant-004", anchor: "chef", role: "Шеф", roleEn: "Chef", note: "Портрет со вторым фото внахлёст, цитата, росчерк, факты.", noteEn: "A portrait with an overlapping second photo, a quote, a signature, facts." },
      { item: "restaurant-005", anchor: "hall", role: "Зал", roleEn: "Hall", note: "Колонки фото с параллаксом при скролле и лайтбокс.", noteEn: "Photo columns with scroll parallax and a lightbox." },
      { item: "restaurant-006", anchor: "book", role: "Бронь", roleEn: "Booking", note: "Свободные окна чипами, дата, время, гости степпером, телефон.", noteEn: "Free slots as chips, date, time, guests stepper, phone." },
      { item: "restaurant-007", anchor: "events", role: "События", roleEn: "Events", note: "Лента с днём недели серифом, ценой и фото по наведению.", noteEn: "A feed with a serif weekday, price and a hover photo." },
      { item: "restaurant-008", anchor: "reviews", role: "Отзывы", roleEn: "Reviews", note: "Стеклянные карточки поверх мутного фото зала, общая оценка.", noteEn: "Glass cards over a blurred hall photo, an overall score." },
      { item: "restaurant-009", anchor: "map", role: "Как добраться", roleEn: "Directions", note: "Яндекс Карта с меткой и карточка с адресом, часами и маршрутом.", noteEn: "A Yandex Map with a pin and a card with address, hours and a route." },
      { item: "restaurant-010", anchor: "footer", role: "Подвал", roleEn: "Footer", note: "Часы по дням, телефон, мессенджеры значками, ссылки.", noteEn: "Hours by day, phone, messengers with icons, links." },
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
