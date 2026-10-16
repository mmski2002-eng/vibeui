import type { Locale } from "@/lib/i18n"

/**
 * Тексты поисковых посадочных: title, description, H1 и вводный абзац.
 * Пилот на нескольких страницах — остальные категории и сценарии берут
 * шаблон из `lib/seo.ts` и свою подпись. Тексты описывают то, что реально
 * лежит в разделе: при чистке ассортимента их нужно сверить.
 */
type LandingCopy = {
  title: string
  description: string
  h1?: string
  intro: string
}

/** Ключ — `<kind>/<category>`, как в `catalogBasePath`. */
const CATEGORY_COPY: Record<string, Record<Locale, LandingCopy>> = {
  "block/hero": {
    ru: {
      title: "Первый экран сайта (hero): готовые блоки на React и Tailwind",
      description:
        "Блоки первого экрана для лендинга: с картинкой, снимком продукта, видео, формой подписки, логотипами клиентов или отсчётом до события. Живое превью и ссылка для ИИ-агента.",
      h1: "Первый экран сайта",
      intro:
        "Первый экран — то, что посетитель видит до прокрутки: заголовок, пара фраз и главная кнопка. Здесь варианты для продукта, сервиса, мероприятия и личного сайта — с картинкой сбоку, снимком интерфейса, видео, подпиской, логотипами клиентов или показателями. Откройте блок, проверьте его на телефоне и десктопе и нажмите «Копировать для ИИ»: агент поставит блок в проект на React и Tailwind CSS, а тексты вы замените на свои.",
    },
    en: {
      title: "Hero section blocks for React and Tailwind",
      description:
        "Hero sections for landing pages: with an image, a product shot, video, a signup form, client logos or a countdown. Live preview and a link your AI agent can install from.",
      h1: "Hero sections",
      intro:
        "The hero is what a visitor sees before scrolling: a headline, a line or two of copy and the main button. These variants cover products, services, events and personal sites — with a side image, an interface shot, video, a signup form, client logos or key numbers. Open a block, check it on phone and desktop, then press “Copy for AI”: your agent adds it to a React and Tailwind CSS project and you swap in your own copy.",
    },
  },
  "block/pricing": {
    ru: {
      title: "Блоки тарифов и сравнения цен на React и Tailwind",
      description:
        "Секции тарифов для сайта: три плана с рекомендуемым, переключатель месяц/год, таблица сравнения, цена за место, калькуляторы и «мы против них». Живое превью и ссылка для ИИ-агента.",
      h1: "Тарифы и сравнение",
      intro:
        "Секции, где посетитель выбирает план и понимает, за что платит. Есть классические три тарифа с рекомендуемым, переключатель месячной и годовой оплаты, таблица сравнения возможностей, цена за место и калькуляторы объёма, а рядом — блоки сравнения с конкурентами и разбор возражений. Тексты, планы и цены вы меняете под свой продукт — блок подходит и SaaS, и курсу, и сервису с пакетами услуг.",
    },
    en: {
      title: "Pricing table and comparison blocks for React and Tailwind",
      description:
        "Pricing sections: three plans with a recommended one, a monthly/yearly toggle, a comparison table, per-seat pricing, calculators and “us vs them”. Live preview and an AI agent link.",
      h1: "Pricing and comparison sections",
      intro:
        "Sections where a visitor picks a plan and sees what they pay for. You get the classic three tiers with a recommended plan, a monthly/yearly toggle, a feature comparison table, per-seat pricing and usage calculators, plus competitor comparisons and objection handling. You change the copy, plans and prices to fit your product, so the same block works for a SaaS, a course or a service sold in packages.",
    },
  },
  "component/button": {
    ru: {
      title: "Кнопки на React и Tailwind: готовые компоненты",
      description:
        "Компоненты кнопок: основная, контурная и призрачная, кнопки-иконки, с меню, копирования, подтверждения удержанием, «в корзину» и «поделиться». Живое превью и ссылка для ИИ-агента.",
      h1: "Кнопки",
      intro:
        "Кнопки для форм, карточек и интерфейса приложения. Кроме привычных основной, контурной и призрачной, здесь есть кнопки-иконки с подсказкой, кнопка с выпадающим меню, копирование в буфер, подтверждение удержанием для опасных действий, повтор с отсчётом, «в корзину», «в избранное» и «поделиться». Откройте кнопку, проверьте её в светлой и тёмной теме и передайте агенту ссылкой «Копировать для ИИ».",
    },
    en: {
      title: "Button components for React and Tailwind",
      description:
        "Button components: primary, outline and ghost, icon buttons, split buttons with a menu, copy, hold-to-confirm, add to cart and share. Live preview and a link your AI agent can install from.",
      h1: "Buttons",
      intro:
        "Buttons for forms, cards and app interfaces. Beyond the usual primary, outline and ghost styles you get icon buttons with tooltips, a split button with a menu, copy to clipboard, hold-to-confirm for destructive actions, retry with a countdown, add to cart, favourite and share. Open a button, check it in light and dark themes and hand it to your agent with “Copy for AI”.",
    },
  },
  "component/slider": {
    ru: {
      title: "Ползунки и диапазоны (range slider) на React и Tailwind",
      description:
        "Компоненты ползунков: одно значение и диапазон, деления и шаги, цена с гистограммой, громкость, даты, вертикальный ползунок и связка с полем ввода. Живое превью и ссылка для ИИ-агента.",
      h1: "Ползунки и диапазоны",
      intro:
        "Ползунки для выбора числа или диапазона: фильтр цены с гистограммой, громкость, шкала с делениями и шагами, выбор дат, вертикальный вариант и ползунок в паре с полем ввода. Это элементы ввода, а не карусель картинок — карусели лежат в разделе «Карусели». Значение и границы задаются пропсами, ползунки работают с клавиатуры.",
    },
    en: {
      title: "Range slider components for React and Tailwind",
      description:
        "Slider components: single value and range, ticks and steps, a price range with a histogram, volume, dates, a vertical slider and one paired with a number input. Live preview and an AI agent link.",
      h1: "Sliders and range inputs",
      intro:
        "Sliders for picking a number or a range: a price filter with a histogram, volume, a scale with ticks and steps, dates, a vertical variant and a slider paired with a number input. These are form inputs, not image carousels — those live under “Carousel”. Values and bounds come in as props, and every slider works from the keyboard.",
    },
  },
  "component/accordion": {
    ru: {
      title: "Аккордеон на React и Tailwind: раскрывающиеся списки",
      description:
        "Компоненты аккордеона для FAQ, настроек и инструкций: нативный на details, с анимацией высоты, двухуровневый, чеклист, «Читать дальше» и липкие заголовки. Живое превью и ссылка для ИИ-агента.",
      h1: "Аккордеоны",
      intro:
        "Аккордеон прячет длинный текст за заголовками и раскрывает по одному. Подойдёт для вопросов и ответов, настроек, пошаговых инструкций и длинных списков. Здесь есть нативный вариант на details, раскрытие с анимацией высоты, вложенные уровни, аккордеон-чеклист, «Читать дальше», взаимоисключающие шаги и липкие заголовки. Заголовки — настоящие кнопки или details, поэтому раскрываются с клавиатуры.",
    },
    en: {
      title: "Accordion components for React and Tailwind",
      description:
        "Accordion components for FAQs, settings and guides: native details, animated height, two levels, a checklist, read more and sticky headers. Live preview and a link your AI agent can install from.",
      h1: "Accordions",
      intro:
        "An accordion hides long content behind headings and opens it one part at a time. Use it for FAQs, settings, step-by-step guides and long lists. You get a native details version, animated height, nested levels, a checklist accordion, read more, mutually exclusive steps and sticky headers. Headings are real buttons or details elements, so they open from the keyboard.",
    },
  },
}

const SCENARIO_COPY: Record<string, Record<Locale, LandingCopy>> = {
  restaurant: {
    ru: {
      title: "Сайт ресторана: готовая страница из блоков для ИИ-агента",
      description:
        "Пример сайта ресторана из блоков каталога: первый экран, меню с фото, шеф, галерея зала, бронь стола, события, отзывы и карта. Демо и список блоков для сборки своей страницы.",
      h1: "Сайт ресторана",
      intro:
        "Сценарий показывает, из каких блоков собрать сайт ресторана или кафе, и в каком порядке их поставить. Откройте демо, чтобы увидеть страницу целиком, а ниже возьмите нужные секции из каталога по одной.",
    },
    en: {
      title: "Restaurant website built from ready-made blocks",
      description:
        "A restaurant website made from catalog blocks: hero, menu with photos, the chef, a hall gallery, table booking, events, reviews and a map. A live demo plus the list of blocks to build your own.",
      h1: "Restaurant website",
      intro:
        "This scenario shows which blocks make up a restaurant or café website and in what order. Open the demo to see the whole page, then take the sections you need from the catalog one by one.",
    },
  },
  photographer: {
    ru: {
      title: "Сайт фотографа-портфолио: готовая страница из блоков",
      description:
        "Пример сайта фотографа из блоков каталога: работы с фильтром по жанрам, как проходит съёмка, обо мне, отзывы, цены и запись. Демо и список блоков для сборки своего портфолио.",
      h1: "Сайт-портфолио фотографа",
      intro:
        "Сценарий показывает, из каких блоков собрать сайт фотографа или другое портфолио и в каком порядке их поставить. Откройте демо, чтобы увидеть страницу целиком, а ниже возьмите нужные секции из каталога по одной.",
    },
    en: {
      title: "Photographer portfolio website built from ready-made blocks",
      description:
        "A photographer's website made from catalog blocks: work filtered by genre, how a shoot goes, about, reviews, prices and booking. A live demo plus the list of blocks to build your own portfolio.",
      h1: "Photographer portfolio website",
      intro:
        "This scenario shows which blocks make up a photographer's site or any other portfolio, and in what order. Open the demo to see the whole page, then take the sections you need from the catalog one by one.",
    },
  },
  saas: {
    ru: {
      title: "Лендинг AI-сервиса или SaaS: готовая страница из блоков",
      description:
        "Пример лендинга AI-сервиса из блоков каталога: первый экран с демо продукта, как это работает, интеграции, логотипы клиентов, тарифы, вопросы и призыв. Демо и список блоков.",
      h1: "Лендинг AI-сервиса и SaaS",
      intro:
        "Сценарий показывает, из каких блоков собрать лендинг онлайн-сервиса: от первого экрана с демо продукта до тарифов, вопросов и формы подписки. Откройте демо, чтобы увидеть страницу целиком, а ниже возьмите нужные секции из каталога по одной.",
    },
    en: {
      title: "AI tool and SaaS landing page built from ready-made blocks",
      description:
        "An AI product landing page made from catalog blocks: a hero with a product demo, how it works, integrations, client logos, pricing, FAQ and a call to action. A live demo plus the list of blocks.",
      h1: "AI tool and SaaS landing page",
      intro:
        "This scenario shows which blocks make up a landing page for an online product: from a hero with a product demo to pricing, FAQ and a signup form. Open the demo to see the whole page, then take the sections you need from the catalog one by one.",
    },
  },
}

export function categoryCopy(kind: string, category: string, locale: Locale) {
  return CATEGORY_COPY[`${kind}/${category}`]?.[locale]
}

export function scenarioCopy(slug: string, locale: Locale) {
  return SCENARIO_COPY[slug]?.[locale]
}
