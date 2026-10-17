import type { Locale } from "@/lib/i18n"

/**
 * Тексты поисковых посадочных: title, description, H1 и вводный абзац для
 * каждой категории каталога и каждого сценария. Категория без записи берёт
 * шаблон из `lib/seo.ts`. Тексты описывают то, что реально лежит в разделе:
 * при чистке ассортимента их нужно сверить. Правка файла сдвигает lastmod
 * всех категорий в sitemap (scripts/build-lastmod.mjs).
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
  "animation/background": {
    ru: {
      title: "Анимированные фоны на весь экран для сайта",
      description:
        "Анимации фона: скрученная лента, сфера из частиц, водопад света, тёплый луч над палитрой, хоровод кадров и снег на весь экран.",
      h1: "Анимированные фоны",
      intro:
        "Шесть живых фонов для первого экрана или промо-секции: скрученная лента, сфера из частиц, водопад света, тёплый луч над палитрой, хоровод кадров вокруг фразы и снег на весь экран. Статичные и более спокойные фоны лежат в блоках, в разделе «Фон».",
    },
    en: {
      title: "Animated full-screen backgrounds for websites",
      description:
        "Background animations: a twisted ribbon, a particle sphere, a waterfall of light, a warm beam over the palette, an orbit of frames and full-screen snow.",
      h1: "Animated backgrounds",
      intro:
        "Six living backgrounds for a hero or promo section: a twisted ribbon, a particle sphere, a waterfall of light, a warm beam over a palette, an orbit of frames around a phrase and full-screen snow. Calmer and static backgrounds live in blocks, under “Background”.",
    },
  },
  "animation/cursor": {
    ru: {
      title: "Анимированные курсоры для сайта на React",
      description:
        "Эффекты курсора: ASCII-жидкость за курсором, магнитный курсор, прицел дизайнера, резинка к узлу и шлейф картинок.",
      h1: "Курсоры",
      intro:
        "Эффекты, которые следуют за мышью и делают сайт заметным: ASCII-жидкость, магнитный курсор, прицел дизайнера, резинка к узлу и шлейф картинок. Уместны на портфолио и промо-страницах; на телефоне курсора нет, поэтому эффект — украшение, а не способ навигации.",
    },
    en: {
      title: "Animated cursor effects for React websites",
      description:
        "Cursor effects: ASCII fluid behind the cursor, a magnetic cursor, a designer's crosshair, a rope to the node and an image trail.",
      h1: "Cursors",
      intro:
        "Effects that follow the mouse and make a site memorable: ASCII fluid, a magnetic cursor, a designer's crosshair, a rope to the node and an image trail. They fit portfolios and promo pages; phones have no cursor, so treat the effect as decoration, not navigation.",
    },
  },
  "animation/error-404": {
    ru: {
      title: "Анимированные страницы 404 на React",
      description:
        "Анимированные сцены для страницы «не найдено»: цифры из пыли, бумажные самолётики, пиксельные пришельцы, лабиринт, сломанный экран, цифры-перевёртыши.",
      h1: "Анимированные страницы 404",
      intro:
        "Сцены, которые превращают ошибку «страница не найдена» в маленькую игру или шутку: цифры из пыли, бумажные самолётики, пиксельные пришельцы и кроличья нора, лабиринт-головоломка, сломанный экран, цифры-перевёртыши, терминал с глазом. Статичные оформленные 404 — в блоках, в разделе «Страница 404».",
    },
    en: {
      title: "Animated 404 pages for React",
      description:
        "Animated “not found” scenes: dust digits, paper planes, pixel invaders, a tilt maze, a glitch screen, flipping digits and a watching terminal.",
      h1: "Animated 404 pages",
      intro:
        "Scenes that turn a “page not found” error into a small game or joke: dust digits, paper planes, pixel invaders and a rabbit hole, a tilt maze puzzle, a glitch screen, flipping digits and a watching terminal. Static designed 404 pages live in blocks, under “404 page”.",
    },
  },
  "animation/interface": {
    ru: {
      title: "Анимированные элементы интерфейса: чат, терминал, уведомления",
      description:
        "Анимации интерфейса: шнур-выключатель темы, док с увеличением, ИИ-чат, терминал и редактор, уведомления, чек-лист, аптайм и аудиоволна.",
      h1: "Анимации интерфейса",
      intro:
        "Живые фрагменты продукта для лендинга и демо: ИИ-чат и пузыри сообщений, терминал, редактор и сниппет кода, колокольчик и список уведомлений, чек-лист, проверка сервисов и полоса аптайма, аудиоволна. Есть и игровые элементы — шнур-выключатель темы и док с увеличением.",
    },
    en: {
      title: "Animated interface elements: chat, terminal, notifications",
      description:
        "Interface animations: a pull-cord theme switch, a magnifying dock, an AI chat, a terminal and editor, notifications, a checklist, uptime and an audio waveform.",
      h1: "Interface animations",
      intro:
        "Living product fragments for landing pages and demos: an AI chat and message bubbles, a terminal, an editor and code snippet, a notification bell and list, a checklist, a service health check and uptime bar, and an audio waveform. There are playful pieces too — a pull-cord theme switch and a magnifying dock.",
    },
  },
  "animation/promo": {
    ru: {
      title: "Промо-анимации: перекидные заголовки, маркер, карточки",
      description:
        "Промо-сцены: перекидная надпись, абзац с бегущим маркером и растущей подсветкой, переворачивающаяся карточка, карточка-окно, рабочий стол XP, паутина.",
      h1: "Промо-сцены",
      intro:
        "Анимации, которые привлекают внимание к главной мысли: перекидная надпись, абзац с бегущим маркером или растущей подсветкой, «дышащий» призыв к действию и шаги вдоль неоновой линии. Для промо с характером — переворачивающаяся карточка, карточка, раскрывающаяся в окно, рабочий стол XP и паутина.",
    },
    en: {
      title: "Promo animations: headline swaps, markers and cards",
      description:
        "Promo scenes: an alternating headline, a paragraph with a travelling marker or growing highlights, a flip card, a card that opens into a modal, an XP desktop and a web.",
      h1: "Promo scenes",
      intro:
        "Animations that draw attention to the main message: an alternating headline, a paragraph with a travelling marker or growing highlights, a breathing call to action and steps along a neon line. For promos with character there is a flip card, a card that opens into a modal, an XP desktop and a spider web.",
    },
  },
  "animation/sketch": {
    ru: {
      title: "Рукописные компоненты: кнопки, поля и карточки от руки",
      description:
        "Рукописный набор интерфейса: кнопка, переключатель, чекбокс, радиокнопки, поле, бейдж, карточка, вкладки, пометка, стрелка, уведомление и шаги.",
      h1: "Рукописный интерфейс",
      intro:
        "Целый набор элементов, нарисованных будто от руки: кнопка, переключатель, чекбокс и радиокнопки, поле ввода, бейдж, карточка, вкладки, уведомление и шаги. Пометки и стрелки помогают выделить мысль на странице. Подходит для черновиков, вайрфреймов и сайтов в «бумажном» стиле.",
    },
    en: {
      title: "Hand-drawn UI components: buttons, inputs and cards",
      description:
        "A hand-drawn UI set: button, toggle, checkbox, radio, input, badge, card, tabs, mark, arrow, alert and steps.",
      h1: "Hand-drawn UI",
      intro:
        "A whole set of elements that look drawn by hand: a button, toggle, checkbox and radio, an input, badge, card, tabs, alert and steps. Marks and arrows help point at an idea on the page. It suits drafts, wireframes and paper-style sites.",
    },
  },
  "animation/stacks": {
    ru: {
      title: "Стопки и веера карточек: анимированные раскладки",
      description:
        "Анимации стопок карточек: веер из пяти и семи, широкая дуга, линейный разворот, угловой веер, раздача на стол, колесо, дуговая и CoverFlow-карусель.",
      h1: "Стопки карточек",
      intro:
        "Анимированные раскладки, где карточки разворачиваются веером, дугой или раздаются на стол. Подходят для показа нескольких проектов, тарифов или фото в одном кадре. Есть веера на пять и семь карточек, широкая дуга, каскад, колесо-веер, дуговая и CoverFlow-карусели и стопка в духе Time Machine.",
    },
    en: {
      title: "Card stacks and fans: animated layouts",
      description:
        "Card stack animations: five- and seven-card fans, a long arc, a linear spread, a corner fan, a scatter deal, a wheel fan, an arc carousel and a CoverFlow carousel.",
      h1: "Card stacks",
      intro:
        "Animated layouts where cards fan out, arc or get dealt onto a table. They show several projects, plans or photos in one frame. There are five- and seven-card fans, a long arc, a cascade, a wheel fan, arc and CoverFlow carousels and a Time Machine-style stack.",
    },
  },
  "block/about": {
    ru: {
      title: "Блоки «О компании» для сайта: миссия, история, ценности",
      description:
        "Секции «О нас»: миссия крупным текстом, история таймлайном, ценности и принципы, цифры компании, автор или шеф с цитатой, манифест. Живое превью и ссылка для ИИ-агента.",
      h1: "О компании",
      intro:
        "Секции, где сайт рассказывает, кто за ним стоит. Для компании подойдут миссия крупным текстом, история таймлайном, ценности сеткой и блок с цифрами; для личного или авторского сайта — портрет с цитатой и росчерком или манифест с фактами в капсулах.",
    },
    en: {
      title: "About section blocks: mission, story and values",
      description:
        "About us sections: a mission statement, a timeline history, values and principles, company numbers, a founder or chef with a quote, a manifesto. Live preview and an AI agent link.",
      h1: "About sections",
      intro:
        "Sections that tell visitors who is behind the site. A company page can use a large mission statement, a timeline history, a values grid or a numbers block; a personal or author site fits a portrait with a quote and signature, or a manifesto with facts in pills.",
    },
  },
  "block/ai": {
    ru: {
      title: "Блоки для AI-сервиса: как работает модель и песочница",
      description:
        "Две секции для лендинга AI-продукта: схема «как работает» из трёх узлов с бегущими точками и песочница, где вставленный текст превращается в сводку по секциям.",
      h1: "Блоки для AI-продуктов",
      intro:
        "Раздел для лендинга AI-сервиса. Здесь два блока: схема «как работает» — конвейер из трёх узлов с бегущими точками — и песочница, где посетитель вставляет текст и видит, как печатается сводка по секциям. Текст ответа задаётся пропсом — к вашей модели блок не подключён.",
    },
    en: {
      title: "AI product blocks: how it works and a sandbox",
      description:
        "Two sections for an AI product landing page: a three-node “how it works” pipeline with running dots and a sandbox where pasted text turns into a sectioned recap.",
      h1: "AI product blocks",
      intro:
        "A section for AI product landing pages. It holds two blocks: a “how it works” pipeline of three nodes with running dots, and a sandbox where a visitor pastes text and watches a sectioned recap type out. The answer text is a prop — the block isn't connected to your model.",
    },
  },
  "block/auth": {
    ru: {
      title: "Формы входа и регистрации на React и Tailwind",
      description:
        "Экраны входа, регистрации, сброса пароля и подтверждения кодом: вход в две колонки, через сервис, приглашение в команду, согласия при регистрации. Живое превью и ссылка для ИИ.",
      h1: "Вход и регистрация",
      intro:
        "Готовые экраны аутентификации: вход по почте и паролю, регистрация, сброс пароля по шагам, подтверждение кодом и приглашение в команду. Есть вход в две колонки, вариант, где сначала предлагается войти через сервис, регистрация с согласиями и карточка-перевёртыш между входом и регистрацией. Логику проверки и отправку подключает ваш бэкенд.",
    },
    en: {
      title: "Sign in and sign up forms for React and Tailwind",
      description:
        "Sign in, sign up, password reset and code verification screens: a split layout, provider-first sign in, a team invite and a consent signup. Live preview and an AI agent link.",
      h1: "Sign in and sign up",
      intro:
        "Ready-made authentication screens: email and password sign in, sign up, a step-by-step password reset, code verification and a team invite. You also get a split sign in, a provider-first variant, a signup with consents and a flip card between sign in and sign up. Validation and submission are wired to your own backend.",
    },
  },
  "block/background": {
    ru: {
      title: "Фоны для секций сайта: градиенты, аврора, частицы, стекло",
      description:
        "Фоновые блоки для первого экрана и секций: mesh-градиент, аврора, свет за курсором, жидкий металл и стекло, точечная матрица, частицы, туман, ячейки Вороного.",
      h1: "Фоны для секций",
      intro:
        "Фоны, на которые кладут заголовок и кнопки первого экрана или промо-секции. Есть спокойные варианты — mesh-градиент, зернистый градиент, слои тумана — и живые: аврора, свет за курсором, поток частиц, жидкий металл, жидкое стекло, ASCII-поле и ячейки Вороного. Выбирайте по тону бренда и проверяйте в превью, как фон ведёт себя на телефоне.",
    },
    en: {
      title: "Section backgrounds: gradients, aurora, particles and glass",
      description:
        "Background blocks for heroes and sections: mesh gradient, aurora, cursor spotlight, liquid metal and glass, dot matrix, particles, fog layers and Voronoi cells.",
      h1: "Section backgrounds",
      intro:
        "Backgrounds that sit behind a hero or promo section's headline and buttons. Some are calm — mesh gradient, grain gradient, fog layers — and some move: aurora, cursor spotlight, particle flow, liquid metal, liquid glass, an ASCII field and Voronoi cells. Pick one by your brand's tone and check in the preview how it behaves on a phone.",
    },
  },
  "block/blog": {
    ru: {
      title: "Блоки для блога и подкаста: лента статей, статья, рубрики",
      description:
        "Секции блога: сетка и лента статей, главный материал, страница статьи, оглавление, похожие материалы, карточка автора, архив, рубрики и подписка на рассылку.",
      h1: "Блог и подкаст",
      intro:
        "Всё для раздела с публикациями: главная блога с главным материалом и лентой, сетка статей, лента по темам и плитки рубрик, шапка и страница статьи с липким оглавлением, «читать дальше» и похожие материалы, карточка автора, архив по месяцам и дайджест. Рядом есть блок подписки на рассылку.",
    },
    en: {
      title: "Blog and podcast blocks: article feeds, posts and topics",
      description:
        "Blog sections: article grid and feeds, a featured post, an article page, sticky contents, related posts, an author card, a monthly archive, topic tiles and a newsletter signup.",
      h1: "Blog and podcast",
      intro:
        "Everything for a publishing section: a blog front page with a featured post and feed, an article grid, topic feeds and tiles, an article hero and reader with sticky contents, up-next and related posts, an author card, a monthly archive and a weekly digest. A newsletter signup block is included too.",
    },
  },
  "block/contact": {
    ru: {
      title: "Блоки контактов: форма обратной связи, карта, запись",
      description:
        "Секции контактов: форма обратной связи и с вложением, заявка на демо, офис на карте, каналы связи, офисы по часовым поясам, слоты для звонка, бронь и запись.",
      h1: "Контакты",
      intro:
        "Секции, через которые с вами связываются. Для сервиса — форма обратной связи, заявка на демо, форма поддержки и каналы связи; для компании с офисами — карточка офиса с картой и офисы по часовым поясам; для записи — слоты для звонка, бронь стола и запись в несколько шагов. Отправку формы подключаете к своему обработчику.",
    },
    en: {
      title: "Contact section blocks: forms, maps and booking",
      description:
        "Contact sections: contact and attachment forms, a demo request, an office map card, contact channels, offices by time zone, callback slots, table booking and appointments.",
      h1: "Contact sections",
      intro:
        "Sections people use to reach you. A service can use a contact form, a demo request, a support form or a list of channels; a company with offices gets an office map card and offices by time zone; bookings are covered by callback slots, table booking and multi-step appointments. You connect form submission to your own handler.",
    },
  },
  "block/cta": {
    ru: {
      title: "Блоки призыва к действию (CTA) для лендинга",
      description:
        "Секции CTA: два действия по центру, призыв на цветной плашке, с картинкой, с формой почты в строку, отсчётом, гарантией, отзывом-доверием и липкая полоса внизу.",
      h1: "Призыв к действию",
      intro:
        "Финальная секция перед подвалом или вставка между блоками, которая просит сделать следующий шаг. Варианты отличаются тем, чем убеждают: гарантией, социальным доказательством, чек-листом, обратным отсчётом или формой почты прямо в строке. Есть и «два пути» для двух аудиторий, и липкая полоса, которая остаётся на экране при прокрутке.",
    },
    en: {
      title: "Call to action (CTA) blocks for landing pages",
      description:
        "CTA sections: centered dual actions, colour slab, split media, inline email form, countdown, guarantee, social proof, two paths for two audiences and a sticky bottom bar.",
      h1: "Call to action sections",
      intro:
        "The closing section before the footer, or a break between blocks, that asks for the next step. The variants differ in how they persuade: a guarantee, social proof, a checklist, a countdown or an inline email form. There is also a “two paths” option for two audiences and a sticky bar that stays on screen while scrolling.",
    },
  },
  "block/data-grid": {
    ru: {
      title: "Таблицы данных для админки: сортировка, фильтры, правка",
      description:
        "Блоки таблиц данных: сортировка, фильтры в шапке, массовые действия, правка ячейки на месте, группы строк, закреплённые края и итоги, пагинация, скелетон загрузки.",
      h1: "Таблицы данных",
      intro:
        "Таблицы для админок и внутренних инструментов, где с данными работают, а не только смотрят на них. Каждый блок показывает одну задачу: сортировку по приоритету, фильтры в шапке, полосу массовых действий, правку ячейки на месте, сгруппированные строки, строку с подробностями, изменение ширины колонок, закреплённые края и итоги, постраничный вывод, пустой результат и загрузку.",
    },
    en: {
      title: "Data grid blocks for dashboards: sorting, filters, inline edit",
      description:
        "Data grid blocks: sorting, header filters, bulk actions, inline cell editing, grouped rows, frozen edges and totals, pagination, empty results and loading skeletons.",
      h1: "Data grids",
      intro:
        "Tables for admin panels and internal tools, where people work with data rather than just read it. Each block shows one job: priority sorting, header filters, a bulk action bar, inline cell editing, grouped rows, a detail row, resizable columns, frozen edges and pinned totals, paging, an empty result and a loading state.",
    },
  },
  "block/errors": {
    ru: {
      title: "Служебные страницы: 404, 500, 403, техработы, cookie",
      description:
        "Блоки служебных страниц: 404 с поиском, 500 с кодом инцидента, 403, технические работы, оффлайн, пустая выдача поиска, полоса cookie и форма согласий.",
      h1: "Служебные страницы",
      intro:
        "Страницы и панели, которые нужны каждому сайту, но о которых вспоминают в последний момент: 404 с поиском, 500 с кодом инцидента, 403, технические работы, оффлайн с чек-листом и пустая выдача поиска. Здесь же полоса cookie, настройки категорий и форма согласий. Отдельная подборка оформленных 404 — в разделе «Страница 404».",
    },
    en: {
      title: "Service pages: 404, 500, 403, maintenance and cookies",
      description:
        "Service page blocks: a 404 with search, a 500 with an incident code, 403, maintenance, offline, empty search results, a cookie bar and a consent form.",
      h1: "Service pages",
      intro:
        "Pages and panels every site needs and nobody remembers until late: a 404 with search, a 500 with an incident code, a 403, maintenance, offline with a checklist and empty search results. The cookie bar, category settings and a consent form live here too. Designed 404 pages have their own section, “404 page”.",
    },
  },
  "block/events": {
    ru: {
      title: "Блоки для событий: афиша, программа, расписание",
      description:
        "Секции для мероприятий: афиша списком, карточка события, сетка расписания, программа по дням, площадки, программа свадебного дня и лента событий заведения.",
      h1: "События",
      intro:
        "Секции для сайтов, где важно «что, где и когда»: фестивалей, заведений и свадеб. Есть афиша списком и карточка события, сетка расписания, программа по дням с цветными метками, карточки площадок, лента событий ресторана и программа свадебного дня вертикальной лентой.",
    },
    en: {
      title: "Event blocks: listings, programmes and schedules",
      description:
        "Event sections: an event list, an event card, a schedule grid, a day-by-day programme, venues, a wedding day timeline and a venue's events feed.",
      h1: "Events",
      intro:
        "Sections for sites where “what, where and when” matters: festivals, venues and weddings. You get an event list and an event card, a schedule grid, a day-by-day programme with colour tags, venue cards, a restaurant events feed and a wedding day programme as a vertical timeline.",
    },
  },
  "block/faq": {
    ru: {
      title: "Блоки FAQ: вопросы и ответы для сайта",
      description:
        "Секции «Вопросы и ответы»: аккордеон с одним открытым, в две колонки, по вкладкам, с поиском, фильтром-чипами, нумерацией и карточкой поддержки рядом.",
      h1: "Вопросы и ответы",
      intro:
        "Секции FAQ, которые снимают возражения перед покупкой или разгружают поддержку. Короткий список подойдёт в две колонки или нумерованным; длинный удобнее разбить по вкладкам, разделам или фильтру-чипам, а для справочного центра есть вопросы с поиском и с карточкой поддержки рядом.",
    },
    en: {
      title: "FAQ section blocks for websites",
      description:
        "FAQ sections: a one-open accordion, two columns, tabs, search, chip filters, numbered questions and a support card alongside.",
      h1: "FAQ sections",
      intro:
        "FAQ sections that answer objections before a purchase or take load off support. A short list works in two columns or numbered; a long one is easier split by tabs, sections or chip filters, and a help centre can use searchable questions or a support card next to them.",
    },
  },
  "block/footer": {
    ru: {
      title: "Подвал сайта (footer): готовые блоки на React и Tailwind",
      description:
        "Блоки подвала: четыре колонки ссылок, с контактами, для магазина, юридический, мега-подвал с подпиской, с большим логотипом, минимальный и с призывом к действию.",
      h1: "Подвал сайта",
      intro:
        "Подвал собирает то, что ищут в конце страницы: навигацию, контакты, документы и соцсети. Для небольшого сайта хватит минимального подвала по центру; продукту подойдут четыре колонки или мега-подвал с подпиской; магазину — отдельный подвал магазина. Есть варианты с большим логотипом, последними статьями и призывом к действию.",
    },
    en: {
      title: "Website footer blocks for React and Tailwind",
      description:
        "Footer blocks: four link columns, contacts, a storefront footer, a legal footer, a mega footer with signup, a big wordmark, a minimal centered footer and a CTA footer.",
      h1: "Footers",
      intro:
        "The footer gathers what people look for at the end of a page: navigation, contacts, documents and social links. A small site needs only a minimal centered footer; a product fits four columns or a mega footer with signup; a shop gets a storefront footer. There are also big-wordmark, latest-posts and call-to-action variants.",
    },
  },
  "block/industry": {
    ru: {
      title: "Отраслевые секции: блоки для кафе, клиник, курсов, сервисов",
      description:
        "Секции под конкретный бизнес: полка выпечки, конструктор коробки, калькуляторы смет и услуг, сбор пожертвований, меню доставки и другие блоки из сайтов-сценариев.",
      h1: "Отраслевые секции",
      intro:
        "Блоки, сделанные под конкретную отрасль: пекарню и доставку еды, ветклинику и автосервис, ремонт, цветы, курсы и языковую школу, финтех, API, приложения и фонды. Это не универсальные секции, а готовые решения задачи бизнеса — полка выпечки с остатками, калькулятор сметы, «что даёт ваша сумма» для пожертвований. Многие из них собраны в сценариях целых сайтов.",
    },
    en: {
      title:
        "Industry sections: blocks for cafés, clinics, courses and services",
      description:
        "Sections built for a specific business: a pastry shelf, a breakfast box builder, quote and service calculators, donation impact, a delivery menu and more from the site scenarios.",
      h1: "Industry sections",
      intro:
        "Blocks made for a specific industry: bakeries and food delivery, vet clinics and car services, renovation, florists, courses and language schools, fintech, APIs, apps and charities. They are not generic sections but answers to a business task — a pastry shelf with stock counts, a renovation quote calculator, “what your gift does” for donations. Many of them appear in the full-site scenarios.",
    },
  },
  "block/layout": {
    ru: {
      title: "Раскладки и бенто-сетки для секций сайта",
      description:
        "Блоки раскладки: бенто-витрина, редакционная сетка, мозаика, горизонтальная лента, закреплённый кадр, раскрывающиеся панели, таймлайн, оболочка приложения.",
      h1: "Раскладки и бенто",
      intro:
        "Каркасы секций, в которые кладут свой контент: бенто-витрина и бенто-hero, редакционная сетка, мозаика, стопка карточек, горизонтальная лента, закреплённый кадр рядом с текстом, раскрывающиеся панели и таймлайн с годом. Для сервисов есть оболочка приложения и каталог с боковой навигацией.",
    },
    en: {
      title: "Layouts and bento grids for website sections",
      description:
        "Layout blocks: a bento showcase, an editorial grid, masonry, a horizontal scroll, sticky media, expanding panels, a sticky timeline and an app shell.",
      h1: "Layouts and bento",
      intro:
        "Section frameworks you fill with your own content: a bento showcase and bento hero, an editorial grid, masonry, a card stack, a horizontal scroll, sticky media beside text, expanding panels and a timeline with a sticky year. Products also get an app shell and a catalog shell with side navigation.",
    },
  },
  "block/logos": {
    ru: {
      title: "Блоки логотипов клиентов и упоминаний в прессе",
      description:
        "Секции «нам доверяют»: строка и бегущая строка логотипов, сетка со счётчиком, логотипы с цитатой и по отраслям, плитки кейсов, интеграции и упоминания в прессе.",
      h1: "Партнёры и пресса",
      intro:
        "Секции социального доказательства: кто пользуется продуктом и где о вас писали. Простой вариант — строка или бегущая строка логотипов; сильнее работают сетка со счётчиком, логотипы с цитатой клиента, логотипы по отраслям и плитки со ссылками на кейсы. Есть «работал с» текстом для личного сайта и блок упоминаний в прессе.",
    },
    en: {
      title: "Client logo and press mention blocks",
      description:
        "“Trusted by” sections: a logo strip and marquee, a logo grid with a counter, logos with a quote or by industry, case study tiles, integrations and press mentions.",
      h1: "Logos and press",
      intro:
        "Social proof sections: who uses the product and where you have been featured. The simple option is a logo strip or marquee; stronger ones are a logo grid with a counter, logos with a client quote, logos by industry and tiles linking to case studies. There is also a “worked with” text marquee for personal sites and a press mentions block.",
    },
  },
  "block/map": {
    ru: {
      title: "Блоки с картой: Яндекс Карты, Google Maps, 2ГИС",
      description:
        "Секции с картой: метка на Яндекс Карте, Google Map рядом со справкой, OSM без ключа и 2ГИС с ключом, районы на карте, «как добраться» с часами работы.",
      h1: "Карты",
      intro:
        "Секции, где посетителю нужно найти место: метка на Яндекс Карте, Google Map рядом с адресом и часами, карта с адресной строкой (OpenStreetMap без ключа, 2ГИС с ключом), районы на карте и «как добраться» с часами работы. Встраиваются официальные бесключевые виджеты; SDK подключается, только если вы задали свой ключ.",
    },
    en: {
      title: "Map blocks: Yandex Maps, Google Maps and 2GIS",
      description:
        "Map sections: a pin on Yandex Maps, a Google Map beside the details, OSM without a key or 2GIS with one, districts on a map and directions with opening hours.",
      h1: "Maps",
      intro:
        "Sections that help a visitor find a place: a pin on Yandex Maps, a Google Map next to the address and hours, a map with an address bar (OpenStreetMap without a key, 2GIS with one), districts on a map and directions with opening hours. They use the official keyless embeds; an SDK loads only when you provide your own key.",
    },
  },
  "block/navbar": {
    ru: {
      title: "Шапка сайта (navbar): меню навигации на React и Tailwind",
      description:
        "Блоки шапки: с главным действием, мега-меню для продукта, с поиском для магазина и документации, поверх фото, плавающие островки, с записью для бизнеса.",
      h1: "Шапка сайта",
      intro:
        "Шапка задаёт навигацию и главное действие на каждой странице. Для лендинга подойдёт чистая шапка с одной кнопкой или пилюли разделов; продукту — мега-меню; магазину и документации — шапка с поиском; кафе и студии — шапка с записью или поверх фотографии. У большинства вариантов есть мобильное меню — проверьте его в превью на ширине телефона.",
    },
    en: {
      title: "Website navbar blocks for React and Tailwind",
      description:
        "Navbar blocks: a clean navbar with a primary action, a product mega menu, search for shops and docs, over a photo, floating islands and local business booking.",
      h1: "Navbars",
      intro:
        "The navbar sets navigation and the main action on every page. A landing page fits a clean navbar with one button or section pills; a product needs a mega menu; shops and docs need search; cafés and studios get a booking navbar or one over a photo. Most variants include a mobile menu — check it in the preview at phone width.",
    },
  },
  "block/newsletter": {
    ru: {
      title: "Блоки подписки на рассылку и листа ожидания",
      description:
        "Секции подписки: классическая форма, с превью письма, полоса, с выбором тем, с числом подписчиков, тёмная карточка и подписки для пекарни, подкаста и цветов.",
      h1: "Рассылка и лист ожидания",
      intro:
        "Формы, которые собирают почту: классическая подписка, полоса во всю ширину, тёмная карточка, форма с превью письма и с выбором тем. Если нужно убедить — есть вариант с числом подписчиков. Отдельно — подписки с характером из сайтов-сценариев: «хлебный будильник», письмо после выпуска подкаста, цветы по подписке.",
    },
    en: {
      title: "Newsletter signup and waitlist blocks",
      description:
        "Signup sections: a classic form, an email preview, a strip, a topic picker, a subscriber count, a dark card and themed signups for a bakery, a podcast and flowers.",
      h1: "Newsletter and waitlist",
      intro:
        "Forms that collect email: a classic signup, a full-width strip, a dark card, a form with an email preview and one with a topic picker. When you need to persuade, there is a version with a subscriber count. Separately, themed signups from the site scenarios: a bread alarm, a letter after each podcast episode, flowers on subscription.",
    },
  },
  "block/not-found": {
    ru: {
      title: "Страница 404: оформленные блоки «страница не найдена»",
      description:
        "Блоки страницы 404 с характером: с разделами сайта, компас с поиском, «выпавший ноль», карта сайта с дырой, газета, браузер без загрузки, лестница вниз.",
      h1: "Страница 404",
      intro:
        "Оформленные страницы «не найдено», которые не бросают человека в тупике: у одних есть разделы сайта или поиск, другие держатся на визуальной шутке — выпавшем нуле, газете «Вестник 404», лестнице вниз или браузере, который не загрузился. Анимированные 404-сцены лежат в разделе анимаций.",
    },
    en: {
      title: "404 page blocks: designed “page not found” screens",
      description:
        "404 page blocks with character: site sections, a compass with search, a dropped zero, a sitemap with a gap, a newspaper, a browser that never loaded, a staircase down.",
      h1: "404 pages",
      intro:
        "Designed “not found” pages that don't leave people at a dead end: some offer site sections or search, others rest on a visual joke — a dropped zero, a “404 Herald” newspaper, a staircase down or a browser that never loaded. Animated 404 scenes live in the animations section.",
    },
  },
  "block/portfolio": {
    ru: {
      title: "Блоки портфолио и кейсов: галереи, плитки работ",
      description:
        "Секции портфолио: masonry-галерея, галерея с фильтром и лайтбоксом, кейс-плитки, кейсы лентой, список работ, главная работа с плитками, галерея-открытки.",
      h1: "Портфолио и кейсы",
      intro:
        "Секции для показа работ — дизайнера, фотографа, студии или агентства. Галереи (masonry, с фильтром, с лайтбоксом, открытки с переворотом) показывают картинки; кейс-плитки, кейсы лентой и главная работа с плитками ведут к истории проекта; список работ подходит, когда проектов много и важны названия.",
    },
    en: {
      title: "Portfolio and case study blocks: galleries and work tiles",
      description:
        "Portfolio sections: a masonry gallery, a filtered gallery with a lightbox, case tiles, a case study feed, a work list, a featured work with tiles and a postcard gallery.",
      h1: "Portfolio and case studies",
      intro:
        "Sections for showing work — a designer's, photographer's, studio's or agency's. Galleries (masonry, filtered, with a lightbox, postcards that flip) put images first; case tiles, a case study feed and a featured work with tiles lead into a project's story; a work list fits when there are many projects and titles matter.",
    },
  },
  "block/team": {
    ru: {
      title: "Блоки «Команда»: сотрудники, руководители, вакансии",
      description:
        "Секции команды: сетка с портретами, фильтр по отделам, ряд руководителей, команда списком, «мы нанимаем», цифры команды и карточки с раскрытием.",
      h1: "Команда",
      intro:
        "Секции, которые показывают людей за продуктом. Сетка с портретами и фильтром по отделам подойдёт большой команде, ряд руководителей — странице «О компании», список — когда важны роли, а не фото. Есть блок «Мы нанимаем», цифры команды и карточки с раскрытием или переворотом для мастеров, артистов и агентов.",
    },
    en: {
      title: "Team section blocks: people, leadership and hiring",
      description:
        "Team sections: a portrait grid, a department filter, a leadership row, a team list, “we're hiring”, team numbers and cards that reveal or flip.",
      h1: "Team",
      intro:
        "Sections that show the people behind a product. A portrait grid with a department filter suits a large team, a leadership row fits an About page, and a list works when roles matter more than photos. There is also a “we're hiring” block, team numbers and cards that reveal or flip for artists, performers and agents.",
    },
  },
  "block/testimonials": {
    ru: {
      title: "Блоки отзывов клиентов для сайта на React и Tailwind",
      description:
        "Секции отзывов: с главным отзывом, ровная сетка, одна большая цитата, звёзды, стена отзывов, бегущая лента, отзывы с результатом и рейтинги площадок.",
      h1: "Отзывы",
      intro:
        "Секции, где говорят клиенты. Одна большая цитата работает, когда отзыв сильный; сетка и стена — когда отзывов много; бегущая лента экономит место. Если важны цифры, есть отзывы с результатом и рейтинги площадок, а для соцсетей — стена постов и отзывы со звёздами.",
    },
    en: {
      title: "Customer testimonial blocks for React and Tailwind",
      description:
        "Testimonial sections: a featured review, an even grid, a single big quote, star ratings, a testimonial wall, a scrolling marquee, results-driven reviews and platform ratings.",
      h1: "Testimonials",
      intro:
        "Sections where customers do the talking. A single big quote works when one review is strong; a grid or wall when you have many; a scrolling marquee saves space. When numbers matter, use testimonials with results or platform ratings; for social proof there is a post wall and star-rated reviews.",
    },
  },
  "component/alert": {
    ru: {
      title: "Уведомления и баннеры (alert) на React и Tailwind",
      description:
        "Компоненты уведомлений: строчное и заливное, у поля формы, с выбором действия, закрываемое, о новинке, с прогрессом и отсчётом, ошибки формы и технические ошибки.",
      h1: "Уведомления и баннеры",
      intro:
        "Сообщения, которые остаются на странице, пока их не прочитают или не закроют, — в отличие от всплывающих тостов. Строчное уведомление подходит для подсказки в тексте, заливное — для важного, у поля — для ошибки ввода. Есть уведомления с выбором действия, прогрессом и отсчётом, сводка ошибок формы и сообщение о технической ошибке.",
    },
    en: {
      title: "Alert and banner components for React and Tailwind",
      description:
        "Alert components: inline and solid, a field alert, a decision alert, dismissible, a feature announcement, progress and countdown alerts, form errors and technical errors.",
      h1: "Alerts and banners",
      intro:
        "Messages that stay on the page until read or dismissed — unlike toasts that pop up and go. An inline alert fits a hint in the text, a solid one something important, a field alert an input error. There are also decision, progress and countdown alerts, a form errors summary and a technical error message.",
    },
  },
  "component/avatar": {
    ru: {
      title: "Аватары на React и Tailwind: фото, инициалы, стопки",
      description:
        "Компоненты аватаров: фото с запасными инициалами, стопка лиц, статус и значок, кольцо прогресса, загрузка фото, строка с именем, аватар ассистента и знак компании.",
      h1: "Аватары и иконки",
      intro:
        "Аватары для профилей, комментариев, чатов и списков участников. Базовый аватар показывает фото и подставляет инициалы, если картинки нет; стопка лиц и аватары с именами показывают команду; статус и значок — присутствие и роль. Есть загрузка фото, кольцо прогресса, аватар ассистента, чтобы отличать бота от человека, и знак компании.",
    },
    en: {
      title:
        "Avatar components for React and Tailwind: photos, initials, stacks",
      description:
        "Avatar components: a photo with initials fallback, an avatar stack, presence and badges, a progress ring, a photo uploader, an identity row, an assistant avatar and a company mark.",
      h1: "Avatars and icons",
      intro:
        "Avatars for profiles, comments, chats and member lists. The base avatar shows a photo and falls back to initials when there is none; a stack and named facepile show a team; presence and badges show status and role. There is also a photo uploader, a progress ring, an assistant avatar that tells a bot from a person, and a company mark.",
    },
  },
  "component/badge": {
    ru: {
      title: "Значки и чипы (badge) на React и Tailwind",
      description:
        "Компоненты значков: статус, счётчик, точка-маркер, удаляемый чип, этап, динамика, версия, приоритет, строка тегов и чипы фильтров.",
      h1: "Значки",
      intro:
        "Короткие метки рядом с текстом: статус заказа, число непрочитанных, версия, приоритет задачи или рост показателя. Здесь же интерактивные варианты — удаляемый чип, строка тегов и чипы фильтров.",
    },
    en: {
      title: "Badge and chip components for React and Tailwind",
      description:
        "Badge components: status, count, marker dot, removable chip, stage, trend, version, priority, a tag row and filter chips.",
      h1: "Badges",
      intro:
        "Short labels next to text: an order status, an unread count, a version, a task priority or a metric trend. Interactive versions live here too — a removable chip, a tag row and filter chips.",
    },
  },
  "component/button-group": {
    ru: {
      title: "Группы кнопок и сегментированные переключатели",
      description:
        "Компоненты групп кнопок: сегментированный фильтр, слитые действия, кнопка сохранения с меню, панель редактора, переключатель вида, листание, выбор периода.",
      h1: "Группы кнопок",
      intro:
        "Кнопки, которые работают вместе: сегментированный фильтр и переключатель вида, слитые действия и кнопка сохранения с меню, панель инструментов редактора, группа листания и выбор периода. Группа с переполнением прячет лишние действия в меню, когда места не хватает.",
    },
    en: {
      title: "Button groups and segmented controls",
      description:
        "Button group components: a segmented filter, attached actions, a split save button, an editor toolbar, a view switcher, a pager group and a period range picker.",
      h1: "Button groups",
      intro:
        "Buttons that work together: a segmented filter and a view switcher, attached actions and a split save button, an editor toolbar, a pager group and a period range. The overflow group tucks extra actions into a menu when space runs out.",
    },
  },
  "component/calendar": {
    ru: {
      title: "Календари и выбор даты на React и Tailwind",
      description:
        "Компоненты календаря: сетка месяца, выбор диапазона на один или два месяца, полоса недели, слоты времени, повестка дня, выбор месяца и года, закрытое прошлое.",
      h1: "Календари и даты",
      intro:
        "Всё для выбора даты и работы с расписанием. Для форм — сетка месяца, выбор диапазона, выбор месяца или десятилетия и нативное поле даты; для записи — слоты времени и полоса недели; для планирования — повестка дня, обзор года и тепловая карта загрузки. Прошлые даты можно закрыть от выбора.",
    },
    en: {
      title: "Calendar and date picker components for React and Tailwind",
      description:
        "Calendar components: a month grid, single and two-month range pickers, a week strip, time slots, a day agenda, month and decade pickers and a locked past.",
      h1: "Calendars and dates",
      intro:
        "Everything for picking dates and working with schedules. Forms get a month grid, a range picker, month and decade pickers and a native date field; bookings get time slots and a week strip; planning gets a day agenda, a year overview and a load heatmap. Past dates can be locked from selection.",
    },
  },
  "component/card": {
    ru: {
      title: "Карточки на React и Tailwind: товар, статья, показатель",
      description:
        "Компоненты карточек: материал, показатель, человек, товар, задача, уведомление, карточки выбора, закладка, карточка с кадром и скелетон загрузки.",
      h1: "Карточки",
      intro:
        "Самый большой раздел: карточки для любых списков и сеток. Карточка товара и материала ведёт к подробностям, карточка показателя — к цифре дашборда, карточка человека — к профилю, карточки выбора заменяют радиокнопки. Есть карточки задачи, уведомления, закладки, с медиакадром и скелетон для загрузки.",
    },
    en: {
      title: "Card components for React and Tailwind: product, content, metric",
      description:
        "Card components: content, metric, person, product, task, notification, choice cards, bookmarks, ratio media cards and a loading skeleton.",
      h1: "Cards",
      intro:
        "The largest section: cards for any list or grid. Product and content cards lead to details, a metric card to a dashboard number, a person card to a profile, and choice cards replace radio buttons. There are task, notification, bookmark and ratio media cards, plus a skeleton for loading.",
    },
  },
  "component/carousel": {
    ru: {
      title: "Карусели и слайдеры картинок на React и Tailwind",
      description:
        "Компоненты каруселей: с прилипанием, с подглядыванием соседних карточек, с миниатюрами, отзывы, истории, киноплёнка, полка товаров и бегущая строка логотипов.",
      h1: "Карусели",
      intro:
        "Ленты, которые листают картинки, карточки и отзывы. Карусель с прилипанием и карточки с подглядыванием подходят для каталога, слайдер с миниатюрами — для галереи товара, проигрыватель историй — для коротких сюжетов, полка товаров — для магазина. Ползунки для выбора значения лежат отдельно, в разделе «Слайдеры».",
    },
    en: {
      title: "Carousel and image slider components for React and Tailwind",
      description:
        "Carousel components: snap scrolling, peek cards, a thumbnail slider, a review slider, a story player, a film strip, a shop rail and a logo marquee.",
      h1: "Carousels",
      intro:
        "Rails that page through images, cards and reviews. A snap carousel and peek cards suit a catalog, a thumbnail slider a product gallery, a story player short stories, and a shop rail a store. Range sliders for picking values live separately, under “Slider”.",
    },
  },
  "component/chart": {
    ru: {
      title: "Графики и диаграммы на React без библиотек",
      description:
        "Компоненты графиков: линейный, столбчатый, с накоплением, с заливкой, кольцевая диаграмма, воронка, спидометр, полосы рейтинга и сравнения.",
      h1: "Графики",
      intro:
        "Графики для дашбордов и отчётов: линейный и с заливкой для динамики, столбчатый и с накоплением для сравнения периодов, кольцевая диаграмма для долей, воронка для конверсии, спидометр для одного показателя, полосы рейтинга и сравнения для списков. Данные передаются пропсами.",
    },
    en: {
      title: "Chart components for React without a chart library",
      description:
        "Chart components: line, bar, stacked bar and area charts, donut charts, a funnel, a gauge, ranking bars and comparison bars.",
      h1: "Charts",
      intro:
        "Charts for dashboards and reports: line and area charts for trends, bar and stacked bars for comparing periods, donuts for shares, a funnel for conversion, a gauge for a single metric, and ranking or comparison bars for lists. Data comes in as props.",
    },
  },
  "component/checkbox": {
    ru: {
      title: "Флажки, радиокнопки и переключатели на React и Tailwind",
      description:
        "Компоненты выбора: флажки и строки с флажком, родительский флажок, список фильтров, согласие, выделение строк, чеклист, карточки дополнений, лимит выбора.",
      h1: "Флажки и переключатели",
      intro:
        "Элементы выбора в формах и списках. Простые флажки и строки с флажком, родительский флажок с частичным состоянием, список фильтров, флажок согласия, выделение строк таблицы и чеклист. Для сложного выбора — карточки дополнений, полоса «выбрать всё» и ограничение числа выбранных вариантов.",
    },
    en: {
      title: "Checkbox, radio and toggle components for React and Tailwind",
      description:
        "Selection components: checkboxes and checkbox rows, a parent checkbox, a filter list, consent, row selection, a checklist, add-on cards and a choice limit.",
      h1: "Checkboxes and toggles",
      intro:
        "Selection controls for forms and lists. Plain checkboxes and checkbox rows, a parent checkbox with an indeterminate state, a filter list, a consent checkbox, table row selection and a checklist. For richer choices there are add-on cards, a select-all bar and a limit on how many options can be picked.",
    },
  },
  "component/code-block": {
    ru: {
      title: "Блок кода для документации на React и Tailwind",
      description:
        "Компоненты блока кода: нумерация строк, копирование, вкладки npm/pnpm/yarn, строка команды, дифф, свёрнутый файл, подсветка ошибки, перенос строк, вывод команды.",
      h1: "Блок кода",
      intro:
        "Блоки кода для документации, блогов и лендингов разработческих продуктов. Есть нумерация строк и кнопка копирования, вкладки менеджеров пакетов, строка приглашения терминала с выводом команды, строки различий, свёрнутый длинный файл, подсветка диапазона с ошибкой и переключатель переноса строк.",
    },
    en: {
      title: "Code block components for docs in React and Tailwind",
      description:
        "Code block components: line numbers, copy button, package manager tabs, a prompt line, diff lines, a collapsed file, an error range, a wrap switch and command output.",
      h1: "Code blocks",
      intro:
        "Code blocks for docs, blogs and developer product pages. You get line numbers and a copy button, package manager tabs, a terminal prompt line with command output, diff lines, a collapsed long file, a highlighted error range and a line wrap switch.",
    },
  },
  "component/combobox": {
    ru: {
      title: "Комбобокс: поле с поиском и выбором на React",
      description:
        "Компоненты поиска с выбором: фильтрация по вводу, группы, множественный выбор чипами, выбор людей, создание значения, недавние сверху, длинные списки.",
      h1: "Поиск и выбор",
      intro:
        "Поле, где значение выбирают из списка, начав печатать. Подходит, когда вариантов слишком много для обычного списка: есть фильтрация по вводу, группы, множественный выбор чипами, выбор людей, создание нового значения и недавние варианты сверху. Для тысяч строк — оконный список, который рисует только видимое.",
    },
    en: {
      title: "Combobox components: searchable select for React",
      description:
        "Combobox components: type-to-filter, grouped sections, multi-select chips, a people picker, create-an-option, recent first and a windowed list for long data.",
      h1: "Combobox",
      intro:
        "A field where you pick a value from a list by starting to type. Use it when there are too many options for a plain select: type-to-filter, grouped sections, multi-select chips, a people picker, creating a new option and recent choices first. For thousands of rows there is a windowed list that renders only what is visible.",
    },
  },
  "component/command": {
    ru: {
      title: "Командное меню и палитра команд на React и Tailwind",
      description:
        "Компоненты командной палитры: палитра в окне и в строке, недавние и вложенные команды, поиск по проекту, переход к файлу, шпаргалка сочетаний.",
      h1: "Командное меню",
      intro:
        "Палитра команд: поле поиска и список действий, по которому идут с клавиатуры. Сочетание для открытия вы назначаете сами. Здесь варианты для приложений и документации: недавние и вложенные команды, поиск по проекту, переход к файлу, действия над выделением, подсказки синтаксиса, шпаргалка сочетаний, а также состояния загрузки и ошибки.",
    },
    en: {
      title:
        "Command menu and command palette components for React and Tailwind",
      description:
        "Command palette components: a modal palette and an inline one, recent and nested commands, project search, go to file and a shortcut cheatsheet.",
      h1: "Command menu",
      intro:
        "A command palette: a search field and a list of actions you move through with the keyboard. You choose the shortcut that opens it. Variants cover apps and docs: recent and nested commands, project search, go to file, selection actions, syntax hints, a shortcut cheatsheet, plus loading and error states.",
    },
  },
  "component/dialog": {
    ru: {
      title: "Модальные окна и диалоги на React и Tailwind",
      description:
        "Компоненты диалогов: подтверждение удаления, форма, выбор, результат, блокирующий прогресс, «поделиться», двухшаговый диалог, лист действий и предпросмотр.",
      h1: "Диалоги и панели",
      intro:
        "Окна, которые просят решения или показывают важное поверх страницы. Диалог удаления подтверждает необратимое действие, диалог с формой собирает данные, двухшаговый ведёт по шагам, блокирующий прогресс не даёт уйти до конца операции. Для телефона есть лист действий снизу, а также диалоги «поделиться», сочетаний клавиш и предпросмотра.",
    },
    en: {
      title: "Modal and dialog components for React and Tailwind",
      description:
        "Dialog components: destructive confirm, form, choice, result, blocking progress, share, a two-step dialog, an action sheet and a preview dialog.",
      h1: "Dialogs and sheets",
      intro:
        "Windows that ask for a decision or show something important above the page. A destructive dialog confirms an irreversible action, a form dialog collects data, a two-step dialog walks through steps, and blocking progress holds the user until an operation ends. Phones get a bottom action sheet; there are also share, shortcuts and preview dialogs.",
    },
  },
  "component/dropdown-menu": {
    ru: {
      title: "Выпадающие меню на React и Tailwind",
      description:
        "Компоненты выпадающих меню: с разделами, сочетаниями клавиш и флажками, выбор темы, вложенное подменю, меню аккаунта, сортировка, опасная зона, массовые действия.",
      h1: "Выпадающие меню",
      intro:
        "Меню, которые открываются по кнопке и собирают действия в одном месте. Меню аккаунта и выбор темы — для шапки, меню сортировки и массовые действия — для таблиц, вложенное подменю — для глубоких списков. Есть пункты с пояснениями и сочетаниями клавиш, флажки внутри меню и отдельная опасная зона для удаления.",
    },
    en: {
      title: "Dropdown menu components for React and Tailwind",
      description:
        "Dropdown menu components: sections, keyboard shortcuts, checkboxes, a theme picker, nested submenus, an account menu, sorting, a danger zone and bulk actions.",
      h1: "Dropdown menus",
      intro:
        "Menus that open from a button and gather actions in one place. An account menu and theme picker suit the header, sort and bulk action menus suit tables, and nested submenus handle deep lists. There are described items and keyboard shortcuts, checkboxes inside the menu and a separate danger zone for deletion.",
    },
  },
  "component/empty": {
    ru: {
      title: "Пустые состояния: «ничего не найдено», ошибки, первый запуск",
      description:
        "Компоненты пустых состояний: пустой список, ничего не найдено, отсеяно фильтрами, первый запуск, ошибка загрузки, нет доступа, нет соединения, запрос разрешения.",
      h1: "Пустые состояния",
      intro:
        "Что показать, когда показывать нечего. Каждый вариант объясняет причину и предлагает следующий шаг: первый запуск ведёт к созданию, «отсеяно фильтрами» — к сбросу фильтров, ошибка загрузки и нет соединения — к повтору, нет доступа — к запросу прав. Есть разбор поискового запроса и чеклист знакомства.",
    },
    en: {
      title: "Empty state components: no results, errors and first run",
      description:
        "Empty state components: an empty list, no results, filtered out, first run, load error, no access, offline and a permission request.",
      h1: "Empty states",
      intro:
        "What to show when there is nothing to show. Each variant explains why and offers a next step: first run leads to creating something, “filtered out” to clearing filters, load errors and offline to retrying, no access to requesting permission. There is also a query breakdown and an onboarding checklist.",
    },
  },
  "component/input": {
    ru: {
      title: "Поля ввода на React и Tailwind: пароль, поиск, телефон",
      description:
        "Компоненты полей ввода: плавающая подпись, группа полей, пароль с правилами, поиск, телефон, маска карты, защита от опечатки в почте, подсказки из истории.",
      h1: "Поля ввода",
      intro:
        "Текстовые поля для форм. Помимо базового поля с подписью здесь есть поле пароля с правилами, поиск с горячей клавишей и подсказками из истории, телефон, маска карты, единицы измерения списком. Мелочи, которые экономят ошибки: защита от опечатки в домене почты и автоподстановка протокола в ссылке.",
    },
    en: {
      title: "Input components for React and Tailwind: password, search, phone",
      description:
        "Input components: floating labels, input groups, password rules, search, phone, card mask, email typo guard, URL scheme autofill and history suggestions.",
      h1: "Inputs",
      intro:
        "Text fields for forms. Beyond a basic labelled field you get a password field with rules, search with a hotkey and history suggestions, phone, a card mask and units in a dropdown. Small touches that prevent errors: an email domain typo guard and URL scheme autofill.",
    },
  },
  "component/loading": {
    ru: {
      title: "Индикаторы загрузки: спиннеры, прогресс, скелетоны",
      description:
        "Компоненты загрузки: спиннер с подписью, волна из точек, неопределённый прогресс, кольцо с процентами, блокирующая подложка, скелетон, кнопка с блокировкой отправки.",
      h1: "Загрузка",
      intro:
        "Как показать ожидание. Когда время неизвестно — спиннер с подписью или неопределённый прогресс; когда известно — кольцо с процентами или полоса; когда грузится макет — пульсирующий скелетон. Блокирующая подложка закрывает экран на время операции, а кнопка с блокировкой не даёт отправить форму дважды.",
    },
    en: {
      title: "Loading indicators: spinners, progress bars and skeletons",
      description:
        "Loading components: a labelled spinner, a dots wave, indeterminate progress, a percent ring, a blocking overlay, a pulse skeleton and a submit-lock button.",
      h1: "Loading",
      intro:
        "How to show waiting. When duration is unknown, use a labelled spinner or indeterminate progress; when it is known, a percent ring or bar; when a layout is loading, a pulse skeleton. A blocking overlay covers the screen during an operation, and a submit-lock button prevents a double form submit.",
    },
  },
  "component/mockup": {
    ru: {
      title: "Мокапы устройств на CSS: ноутбук, телефон, браузер",
      description:
        "Компоненты мокапов без картинок: ноутбук, смартфон, планшет, окно браузера, монитор, умные часы, ноутбук в перспективе, ноутбук с телефоном, стопка окон.",
      h1: "Мокапы устройств",
      intro:
        "Рамки устройств, в которые кладут скриншот или живой интерфейс продукта: ноутбук, смартфон, планшет, монитор, умные часы и окно браузера. Для первого экрана подойдут ноутбук в перспективе и пара «ноутбук и телефон», для показа нескольких экранов — стопка окон.",
    },
    en: {
      title: "CSS device mockups: laptop, phone and browser frames",
      description:
        "Mockup components without images: laptop, phone, tablet, browser window, monitor, smart watch, laptop in perspective, laptop and phone, and a window stack.",
      h1: "Device mockups",
      intro:
        "Device frames that hold a screenshot or your live product UI: laptop, phone, tablet, monitor, smart watch and a browser window. For a hero use the laptop in perspective or the laptop-and-phone pair; to show several screens, a window stack.",
    },
  },
  "component/navigation": {
    ru: {
      title: "Хлебные крошки, пагинация и навигация на React",
      description:
        "Компоненты навигации: хлебные крошки со сворачиванием и раскрытием, путь к файлу, путь мастера, переход к соседним страницам, пагинация и навигация по разделам.",
      h1: "Навигация",
      intro:
        "Элементы, которые показывают, где человек находится и куда можно перейти. Больше всего здесь хлебных крошек: со сворачиванием длинного пути, с раскрытием, через слеш, в шапке страницы и с действиями. Есть путь к файлу, путь мастера по шагам и переход к соседним страницам; сюда же влиты пагинация и меню навигации.",
    },
    en: {
      title: "Breadcrumb, pagination and navigation components for React",
      description:
        "Navigation components: collapsing and expandable breadcrumbs, a file path, a wizard trail, sibling switching, pagination and section navigation.",
      h1: "Navigation",
      intro:
        "Controls that show where someone is and where they can go. Most of them are breadcrumbs: collapsing long paths, expandable, slash-separated, in a page header and with actions. There is also a file path, a step-by-step wizard trail and a sibling switcher; pagination and navigation menus were merged in here too.",
    },
  },
  "component/popover": {
    ru: {
      title: "Всплывающие подсказки и поповеры на React и Tailwind",
      description:
        "Компоненты поповеров: справка у иконки, подсказка рядом с полем, подтверждение, быстрое добавление и правка, выбор цвета и даты, уведомления, карточка пользователя.",
      h1: "Всплывающие подсказки",
      intro:
        "Небольшие панели, которые открываются рядом с элементом и не уводят со страницы. Справка и подсказка у поля объясняют, подтверждение во всплывашке страхует от случайного клика, быстрое добавление и правка экономят переход на отдельную форму. Есть выбор цвета и даты, колокольчик уведомлений, карточка пользователя и вложенная всплывашка.",
    },
    en: {
      title: "Popover and tooltip components for React and Tailwind",
      description:
        "Popover components: info and inline help, a confirm popover, quick add and quick edit, colour and date pickers, a notification bell and a user card.",
      h1: "Popovers",
      intro:
        "Small panels that open next to an element without leaving the page. Info and inline help explain, a confirm popover guards against a stray click, and quick add or quick edit save a trip to a separate form. There are colour and date pickers, a notification bell, a user card and a nested popover.",
    },
  },
  "component/select": {
    ru: {
      title: "Выпадающие списки (select) на React и Tailwind",
      description:
        "Компоненты списков выбора: нативный, с иконкой, с пояснениями, с поиском, с точкой статуса, коды стран, множественный выбор чипами, загрузка и ошибка.",
      h1: "Списки выбора",
      intro:
        "Списки, где значение выбирают из заранее известных вариантов. Нативный список надёжен на телефоне, список с пояснениями помогает выбрать тариф или роль, со статусом — состояние задачи, коды стран — телефонный префикс. Если вариантов много, есть список с поиском, а для нескольких значений — выбор чипами. Состояния загрузки и ошибки уже оформлены.",
    },
    en: {
      title: "Select dropdown components for React and Tailwind",
      description:
        "Select components: native, icon trigger, described options, search, status dots, country codes, chip multi-select, loading and invalid states.",
      h1: "Selects",
      intro:
        "Lists where the value comes from a known set of options. A native select is the most reliable on phones, described options help pick a plan or role, status dots show a task state, and country codes set a phone prefix. With many options there is a searchable select, and chips handle multiple values. Loading and invalid states are styled already.",
    },
  },
  "component/special-input": {
    ru: {
      title: "Специальные поля: одноразовый код, счётчик, рейтинг, файлы",
      description:
        "Компоненты специальных полей: поле одноразового кода с таймером повтора, маска после ввода, счётчик числа, телефон, валюта, теги, загрузка файлов и рейтинг.",
      h1: "Специальные поля",
      intro:
        "Поля для данных, которые не вводят обычной строкой. Больше всего вариантов поля одноразового кода — с таймером повтора, разбивкой по группам, проверкой и автоотправкой. Сюда же объединены счётчики чисел, ввод телефона и валюты, теги, загрузка файлов и рейтинг.",
    },
    en: {
      title: "Specialised inputs: OTP codes, number steppers, rating, files",
      description:
        "Specialised input components: one-time code fields with a resend timer, mask after typing, number steppers, phone, currency, tags, file upload and rating.",
      h1: "Specialised inputs",
      intro:
        "Fields for data you don't type as a plain line. Most variants are one-time code fields — with a resend timer, grouped digits, validation and auto-submit. Number steppers, phone and currency inputs, tags, file upload and rating were merged in here too.",
    },
  },
  "component/stepper": {
    ru: {
      title: "Шаги и таймлайн на React: степпер, оформление заказа",
      description:
        "Компоненты шагов: шаги процесса, шевроны, вертикальные шаги, состояния, прогресс на соединителе, шаги оформления заказа и настройки, возврат после ошибки.",
      h1: "Шаги и таймлайн",
      intro:
        "Показывают, сколько шагов в процессе и на каком человек сейчас. Горизонтальные шаги и шевроны подходят для формы в несколько экранов, вертикальные — для таймлайна и инструкции, счётчик — для телефона. Есть шаги оформления заказа с итогом, необязательные шаги и возврат после ошибки.",
    },
    en: {
      title: "Stepper and timeline components for React",
      description:
        "Stepper components: process steps, chevrons, vertical steps, step states, connector progress, checkout and setup steps, optional steps and error recovery.",
      h1: "Steps and timelines",
      intro:
        "They show how many steps a process has and where someone is now. Horizontal steps and chevrons suit a multi-screen form, vertical steps a timeline or guide, and a counter a phone. There are checkout steps with an order summary, optional steps and error recovery.",
    },
  },
  "component/table": {
    ru: {
      title: "Таблицы на React и Tailwind: сортировка, выбор строк",
      description:
        "Компоненты таблиц: таблица данных, сравнения и счёта, сортировка, выделение строк, раскрывающиеся строки, адаптивная таблица, логи и фильтры.",
      h1: "Таблицы и фильтры",
      intro:
        "Таблицы для контента и интерфейсов: таблица данных и сравнения, счёт и смета с итогами, матрица тарифов, таблица логов. Взаимодействие — сортировка, выделение строк, раскрывающиеся строки; адаптивная таблица перестраивается на телефоне. Сложные таблицы для админок лежат в блоках, в разделе «Таблица данных».",
    },
    en: {
      title: "Table components for React and Tailwind: sorting and selection",
      description:
        "Table components: data, comparison and invoice tables, sorting, row selection, expandable rows, a responsive table, a log table and filters.",
      h1: "Tables and filters",
      intro:
        "Tables for content and interfaces: data and comparison tables, invoices and quotes with totals, a plan matrix and a log table. Interaction covers sorting, row selection and expandable rows; the responsive table reflows on phones. Heavier admin grids live in blocks, under “Data Grid”.",
    },
  },
  "component/tabs": {
    ru: {
      title: "Вкладки (tabs) на React и Tailwind",
      description:
        "Компоненты вкладок: с управлением с клавиатуры, на CSS, со скользящим подчёркиванием, пилюли, вертикальные, со счётчиками, прокручиваемые и с переполнением.",
      h1: "Вкладки",
      intro:
        "Переключение между разделами без перехода на другую страницу. Вкладки-пилюли и со скользящим подчёркиванием — для настроек и карточек, вертикальные — для длинных разделов, со счётчиками — для входящих. Если вкладок много, есть прокручиваемый вариант и вариант с переполнением в меню; для телефона — нижняя панель навигации.",
    },
    en: {
      title: "Tab components for React and Tailwind",
      description:
        "Tab components: keyboard-accessible, pure CSS, sliding underline, pills, vertical, counter tabs, scrolling tabs and overflow tabs.",
      h1: "Tabs",
      intro:
        "Switching between sections without leaving the page. Pill tabs and a sliding underline suit settings and cards, vertical tabs long sections, and counter tabs inboxes. With many tabs there is a scrolling version and one that overflows into a menu; phones get a bottom tab bar.",
    },
  },
  "component/toast": {
    ru: {
      title: "Всплывающие сообщения (toast) на React и Tailwind",
      description:
        "Компоненты тостов: с таймером, отменой, повтором и прогрессом, стопка и колода сообщений, сообщение по этапам операции, развёрнутое сообщение и пилюля.",
      h1: "Всплывающие сообщения",
      intro:
        "Короткие сообщения о результате действия, которые появляются и исчезают сами. Тост с отменой даёт вернуть удаление, с повтором — повторить неудачную операцию, по этапам — проследить долгую задачу от начала до конца. Несколько сообщений собираются в стопку или колоду, область сообщений отвечает за их размещение на экране.",
    },
    en: {
      title: "Toast notification components for React and Tailwind",
      description:
        "Toast components: timed, undo, retry and progress toasts, a stack and a deck, a lifecycle toast, a rich toast and a pill toast.",
      h1: "Toasts",
      intro:
        "Short messages about the result of an action that appear and disappear on their own. An undo toast lets someone reverse a deletion, a retry toast repeats a failed operation, and a lifecycle toast follows a long task from start to finish. Several messages gather into a stack or deck, and a toast region handles where they sit on screen.",
    },
  },
  "component/tree": {
    ru: {
      title: "Деревья файлов и иерархии на React и Tailwind",
      description:
        "Компоненты деревьев: дерево файлов и с типами файлов, выбор с клавиатуры, частичные флажки, поиск, ленивая загрузка ветки, направляющие и оглавление.",
      h1: "Деревья и перетаскивание",
      intro:
        "Иерархии, которые раскрываются по уровням: файлы проекта, разделы документации, категории. Есть дерево только на details, дерево с выбором и управлением с клавиатуры, с частичными флажками для выбора поддерева, с поиском, с ленивой загрузкой ветки и направляющими линиями. Оглавление подсвечивает текущий раздел; сюда же влиты списки с перетаскиванием.",
    },
    en: {
      title: "File tree and hierarchy components for React and Tailwind",
      description:
        "Tree components: a file tree with file types, keyboard selection, partial checkboxes, search, lazy-loaded branches, guide lines and a table of contents.",
      h1: "Trees and drag and drop",
      intro:
        "Hierarchies that open level by level: project files, documentation sections, categories. There is a details-only tree, a selectable keyboard tree, partial checkboxes for picking a subtree, search, a lazy-loaded branch and guide lines. The table of contents highlights the current section; sortable drag-and-drop lists were merged in here too.",
    },
  },
  "component/typography": {
    ru: {
      title: "Типографика: заголовок секции и подписи",
      description:
        "Небольшой набор типографических компонентов: заголовок секции, счётчик кадров, ячейка значения с подписью для скринридеров и подпись к демо.",
      h1: "Типографика",
      intro:
        "Небольшой служебный раздел из четырёх компонентов. Заголовок секции используют многие блоки каталога; счётчик кадров, ячейка значения с подписью для скринридеров и подпись к демо закрывают мелкие задачи оформления.",
    },
    en: {
      title: "Typography components: section heading and captions",
      description:
        "A small set of typography components: a section heading, a frame counter, a value cell with a screen reader label and a demo caption.",
      h1: "Typography",
      intro:
        "A small utility section of four components. The section heading is used by many catalog blocks; the frame counter, a value cell with a screen reader label and a demo caption cover small formatting jobs.",
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
  realty: {
    ru: {
      title: "Сайт агентства недвижимости: страница из готовых блоков",
      description:
        "Пример сайта агентства недвижимости: поиск жилья на первом экране, объекты с фильтром, районы на карте, шаги сделки, ипотечный калькулятор, агенты и заявка на оценку.",
      h1: "Сайт агентства недвижимости",
      intro:
        "Результат — сайт агентства, где посетитель сразу ищет жильё, смотрит подборку объектов и районы на карте, считает ипотеку и оставляет заявку на оценку квартиры. Агентство в демо вымышленное; ниже перечислены блоки каталога, из которых собрана страница.",
    },
    en: {
      title: "Real estate agency website built from ready-made blocks",
      description:
        "A real estate agency site example: home search in the hero, filtered listings, districts on a map, deal steps, a mortgage calculator, agents and a valuation request.",
      h1: "Real estate agency website",
      intro:
        "The result is an agency site where visitors search for a home right away, browse listings and districts on a map, work out a mortgage and request a valuation. The agency in the demo is fictional; the catalog blocks the page is built from are listed below.",
    },
  },
  course: {
    ru: {
      title: "Лендинг онлайн-курса: страница из готовых блоков",
      description:
        "Пример лендинга онлайн-курса: превью урока, для кого курс, программа по неделям, результаты выпускников, автор, тарифы с рассрочкой, отзывы и отсчёт до старта.",
      h1: "Лендинг онлайн-курса",
      intro:
        "Лендинг ведёт от обещания к записи: кому подойдёт курс, что будет по неделям, что получили выпускники, кто автор, сколько стоит с рассрочкой и сколько осталось до старта. Курс в демо придуман для примера, структура подойдёт и вебинару, и интенсиву.",
    },
    en: {
      title: "Online course landing page built from ready-made blocks",
      description:
        "An online course landing page example: a lesson preview, who it's for, a weekly programme, graduate results, the author, instalment pricing, reviews and a launch countdown.",
      h1: "Online course landing page",
      intro:
        "The page leads from the promise to enrolment: who the course is for, what happens week by week, what graduates achieved, who teaches it, the price with instalments and the time left until launch. The course in the demo is made up; the same structure works for a webinar or an intensive.",
    },
  },
  festival: {
    ru: {
      title: "Сайт фестиваля: программа, площадки, билеты",
      description:
        "Пример сайта городского фестиваля: направления, манифест, программа с «выбором дня», расписание по дням, участники, площадки, билеты, карта и вопросы.",
      h1: "Сайт фестиваля",
      intro:
        "Сайт мероприятия с большой программой: посетитель видит направления, выбирает события по дням, смотрит участников и площадки, покупает билет и находит место на карте. Фестиваль в демо вымышленный; страница подойдёт конференции, ярмарке или городскому празднику.",
    },
    en: {
      title: "Festival website: programme, venues and tickets",
      description:
        "A city festival site example: tracks, a manifesto, a programme with a pick of the day, a daily schedule, artists, venues, tickets, a map and FAQ.",
      h1: "Festival website",
      intro:
        "An event site with a big programme: visitors see the tracks, choose events by day, browse artists and venues, buy a ticket and find the place on a map. The festival in the demo is fictional; the page also fits a conference, a fair or a city celebration.",
    },
  },
  tattoo: {
    ru: {
      title: "Сайт тату-студии: работы, мастера, запись",
      description:
        "Пример сайта тату-студии: работы с фильтром по стилю, мастера, как проходит сеанс, калькулятор цены, отзывы, стерильность, вопросы и запись в три шага.",
      h1: "Сайт тату-студии",
      intro:
        "Сайт, который снимает сомнения перед первым сеансом: работы по стилям, мастера, как проходит сеанс, сколько это стоит, как устроена стерильность и что говорят клиенты спустя годы. Завершает страницу запись в три шага. Студия в демо вымышленная.",
    },
    en: {
      title: "Tattoo studio website: work, artists and booking",
      description:
        "A tattoo studio site example: work filtered by style, the artists, how a session goes, a price calculator, reviews, hygiene, FAQ and three-step booking.",
      h1: "Tattoo studio website",
      intro:
        "A site that removes doubts before a first session: work by style, the artists, how a session goes, what it costs, how hygiene is handled and what clients say years later. The page ends with three-step booking. The studio in the demo is fictional.",
    },
  },
  wedding: {
    ru: {
      title: "Сайт-приглашение на свадьбу с RSVP",
      description:
        "Пример свадебного сайта-приглашения: конверт на входе, отсчёт, история пары, программа дня, дресс-код, карта и отели, RSVP-анкета, вопросы и подарки.",
      h1: "Сайт-приглашение на свадьбу",
      intro:
        "Вместо бумажного приглашения — сайт, где гости находят всё: программу дня, дресс-код, адрес, отели и ответы на вопросы, а затем подтверждают участие в анкете из пяти шагов с выбором меню и песни. Пара в демо вымышленная.",
    },
    en: {
      title: "Wedding invitation website with RSVP",
      description:
        "A wedding invitation site example: an envelope intro, a countdown, the couple's story, the day's programme, dress code, map and hotels, an RSVP form, FAQ and gifts.",
      h1: "Wedding invitation website",
      intro:
        "Instead of a paper invite, a site where guests find everything: the day's programme, dress code, address, hotels and answers, then confirm in a five-step RSVP with menu and song choices. The couple in the demo is fictional.",
    },
  },
  "wedding-cuba": {
    ru: {
      title: "Сайт свадьбы-путешествия: маршрут, программа, отель",
      description:
        "Пример сайта выездной свадьбы: посадочный талон на входе, отсчёт до вылета, маршрут пары, программа трёх дней, чек-лист «что взять», дресс-код и карта отеля.",
      h1: "Сайт свадьбы-путешествия",
      intro:
        "Вариант для свадьбы в другой стране, где гостям важнее логистика, чем открытка: отсчёт до вылета, программа по дням, что взять с собой, дресс-код для пляжа и как добраться до отеля. Пара и маршрут в демо вымышленные.",
    },
    en: {
      title: "Destination wedding website: route, programme and hotel",
      description:
        "A destination wedding site example: a boarding pass intro, a departure countdown, the couple's route, a three-day programme, a packing checklist, dress code and a hotel map.",
      h1: "Destination wedding website",
      intro:
        "A version for a wedding abroad, where guests care more about logistics than a card: a countdown to departure, a day-by-day programme, what to pack, a beach dress code and how to reach the hotel. The couple and route in the demo are fictional.",
    },
  },
  "wedding-winter": {
    ru: {
      title: "Сайт зимней свадьбы: приглашение в тёмной теме",
      description:
        "Пример сайта зимней свадьбы: свеча на входе, снег по всему сайту, отсчёт, история-гирлянда, программа от заката до полуночи, дресс-код, трансфер и ответ гостей.",
      h1: "Сайт зимней свадьбы",
      intro:
        "Тёмное камерное приглашение для зимнего торжества: снег идёт по всему сайту, программа расписана от заката до полуночи, есть дресс-код, трансфер, ночёвка и письмо-ответ от гостей. Пара в демо вымышленная.",
    },
    en: {
      title: "Winter wedding website: a dark-themed invitation",
      description:
        "A winter wedding site example: a candle intro, snow across the site, a countdown, a garland story, a sunset-to-midnight programme, dress code, transfer and guest replies.",
      h1: "Winter wedding website",
      intro:
        "A dark, intimate invitation for a winter celebration: snow falls across the whole site, the programme runs from sunset to midnight, and there is a dress code, transfer, an overnight stay and a reply letter from guests. The couple in the demo is fictional.",
    },
  },
  bakery: {
    ru: {
      title: "Сайт кофейни-пекарни: витрина, меню, предзаказ",
      description:
        "Пример сайта кофейни-пекарни: часы работы в шапке, таймер печи, полка выпечки с остатками, выбор крепости кофе, коробка к утру, история хлеба и подписка.",
      h1: "Сайт кофейни-пекарни",
      intro:
        "Сайт, который живёт по часам печи: посетитель видит, открыто ли сейчас и что осталось на полке, выбирает кофе, собирает коробку к утру и подписывается на свежий хлеб. Пекарня в демо вымышленная; блоки подойдут любой кофейне или кондитерской.",
    },
    en: {
      title: "Café-bakery website: shelf, menu and pre-orders",
      description:
        "A café-bakery site example: opening hours in the header, an oven timer, a pastry shelf with stock, a coffee strength picker, a breakfast box, a bread story and a subscription.",
      h1: "Café-bakery website",
      intro:
        "A site that runs on oven time: visitors see whether it's open now and what's left on the shelf, pick a coffee, build a box for the morning and subscribe to fresh bread. The bakery in the demo is fictional; the blocks fit any café or patisserie.",
    },
  },
  podcast: {
    ru: {
      title: "Сайт подкаста: плеер, эпизоды, гости",
      description:
        "Пример сайта подкаста: плеер эпизода недели с главами, лента эпизодов, цитаты бегущими строками, гости, подписка на выпуски и платформы прослушивания.",
      h1: "Сайт подкаста",
      intro:
        "Сайт шоу, где главное — слушать: плеер эпизода недели с главами, лента выпусков, где длительность видна по полосе, цитаты и гости бегущими лентами, подписка на новые эпизоды. Подкаст в демо придуман для примера.",
    },
    en: {
      title: "Podcast website: player, episodes and guests",
      description:
        "A podcast site example: an episode-of-the-week player with chapters, an episode feed, quotes as marquees, guests, episode subscriptions and listening platforms.",
      h1: "Podcast website",
      intro:
        "A show site built for listening: an episode-of-the-week player with chapters, an episode feed where length shows as a bar, quotes and guests in marquees and a subscription to new episodes. The podcast in the demo is made up.",
    },
  },
  opensource: {
    ru: {
      title: "Сайт open-source проекта: установка, песочница, документация",
      description:
        "Пример сайта open-source библиотеки: звёзды GitHub в шапке, команда установки и терминал, песочница с живым кодом, возможности, сравнение и вклад сообщества.",
      h1: "Сайт open-source проекта",
      intro:
        "Сайт библиотеки, который за минуту показывает, зачем она нужна и как её поставить: копируемая команда установки, терминал, песочница, где переключатели меняют и код, и результат, возможности плитками. Проект в демо вымышленный.",
    },
    en: {
      title: "Open-source project website: install, sandbox and docs",
      description:
        "An open-source library site example: GitHub stars in the header, an install command and terminal, a live code sandbox, features, a comparison and community contributions.",
      h1: "Open-source project website",
      intro:
        "A library site that shows in a minute why it exists and how to install it: a copyable install command, a terminal, a sandbox where toggles change both the code and the result, and features as tiles. The project in the demo is fictional.",
    },
  },
  portfolio: {
    ru: {
      title: "Личный сайт-портфолио разработчика или дизайнера",
      description:
        "Пример личного сайта: первый экран с печатающимися ролями, проекты стопкой карточек, «работал с», обо мне, отзывы и контакт с копируемой почтой.",
      h1: "Портфолио разработчика и дизайнера",
      intro:
        "Личный сайт, который продаёт специалиста: роли печатаются на первом экране, проекты листаются стопкой карточек, рядом — с кем работал, «обо мне», отзывы и почта, которую копируют в один клик. Автор в демо вымышленный.",
    },
    en: {
      title: "Developer or designer portfolio website",
      description:
        "A personal site example: a hero with typing roles, projects as a card stack, “worked with”, about, reviews and a copyable email contact.",
      h1: "Developer and designer portfolio",
      intro:
        "A personal site that sells a specialist: roles type out in the hero, projects flip by as a card stack, and alongside are past clients, an about section, reviews and a one-click copyable email. The author in the demo is fictional.",
    },
  },
  app: {
    ru: {
      title: "Лендинг мобильного приложения без скриншотов",
      description:
        "Пример лендинга приложения: телефон из CSS на первом экране, возможности с липким телефоном, сравнение «до и после», тарифы, отзывы и ссылки на магазины.",
      h1: "Лендинг мобильного приложения",
      intro:
        "Лендинг приложения, которому не нужны готовые скриншоты: телефон нарисован кодом, а его экраны меняются по прокрутке вместе с описанием возможностей. Дальше — тарифы, отзывы и кнопки магазинов. Приложение в демо вымышленное.",
    },
    en: {
      title: "Mobile app landing page without screenshots",
      description:
        "An app landing page example: a CSS phone in the hero, features with a sticky phone, a before-and-after comparison, pricing, reviews and store links.",
      h1: "Mobile app landing page",
      intro:
        "An app landing page that needs no ready screenshots: the phone is drawn in code and its screens change on scroll alongside the features. After that come pricing, reviews and store buttons. The app in the demo is fictional.",
    },
  },
  auto: {
    ru: {
      title: "Сайт автосервиса и детейлинга: услуги, цены, запись",
      description:
        "Пример сайта автосервиса: силуэт машины с ценами по зонам, калькулятор услуг по классу авто, «до и после», мастера, отзывы и онлайн-запись.",
      h1: "Сайт автосервиса и детейлинга",
      intro:
        "Сайт сервиса, где клиент сразу видит, что и за сколько сделают с его машиной: зоны подсвечиваются на силуэте, калькулятор считает цену по классу авто, «до и после» показывает результат, а запись занимает пару шагов. Сервис в демо вымышленный.",
    },
    en: {
      title: "Car service and detailing website: services, prices, booking",
      description:
        "A car service site example: a car silhouette with prices by zone, a service calculator by car class, before-and-after, the team, reviews and online booking.",
      h1: "Car service and detailing website",
      intro:
        "A service site where customers see at once what will be done to their car and for how much: zones light up on the silhouette, a calculator prices by car class, before-and-after shows the result, and booking takes a couple of steps. The garage in the demo is fictional.",
    },
  },
  vet: {
    ru: {
      title: "Сайт ветклиники и груминга: услуги, врачи, запись",
      description:
        "Пример сайта ветклиники: питомец на первом экране, переключатель «кот / собака / кролик», кнопка «срочно» с чек-листом, услуги, врачи, цены и запись.",
      h1: "Сайт ветклиники и груминга",
      intro:
        "Сайт клиники, где владелец быстро находит своё: переключатель вида питомца меняет содержимое страницы, кнопка «срочно» подсказывает, что делать прямо сейчас, а дальше — услуги, врачи, цены и запись. Клиника в демо вымышленная.",
    },
    en: {
      title: "Vet clinic and grooming website: services, vets, booking",
      description:
        "A vet clinic site example: a pet in the hero, a cat / dog / rabbit switch, an urgent button with a checklist, services, vets, prices and booking.",
      h1: "Vet clinic and grooming website",
      intro:
        "A clinic site where owners quickly find what applies to them: a pet type switch changes the page content, an urgent button says what to do right now, and then come services, vets, prices and booking. The clinic in the demo is fictional.",
    },
  },
  flowers: {
    ru: {
      title: "Сайт цветочной мастерской: каталог букетов и доставка",
      description:
        "Пример сайта цветочной мастерской: букет из слоёв на первом экране, каталог с картинкой за курсором, конструктор букета, доставка и подписка на цветы.",
      h1: "Сайт цветочной мастерской",
      intro:
        "Сайт в духе ботанического журнала: букет собирается на первом экране, каталог показывает картинку букета рядом с названием, а конструктор букета, доставка к нужному часу и подписка на цветы идут следом. Мастерская в демо вымышленная.",
    },
    en: {
      title: "Flower studio website: bouquet catalog and delivery",
      description:
        "A flower studio site example: a layered bouquet in the hero, a catalog with an image at the cursor, a bouquet builder, delivery and a flower subscription.",
      h1: "Flower studio website",
      intro:
        "A site styled like a botanical journal: a bouquet assembles in the hero, the catalog shows each bouquet next to its name, and a bouquet builder, delivery by the hour and a flower subscription follow. The studio in the demo is fictional.",
    },
  },
  renovation: {
    ru: {
      title: "Сайт бригады по ремонту квартир: смета и этапы",
      description:
        "Пример сайта ремонтной бригады: план квартиры на первом экране, калькулятор сметы по площади и типу ремонта, этапы работ, «до и после» и заявка.",
      h1: "Сайт ремонта квартир",
      intro:
        "Сайт, который отвечает на главные вопросы заказчика ремонта: сколько это стоит — калькулятор сметы по площади и типу ремонта, сколько займёт — этапы на диаграмме, как будет выглядеть — «до и после». Завершает страницу заявка в одно поле. Бригада в демо вымышленная.",
    },
    en: {
      title: "Apartment renovation website: estimates and stages",
      description:
        "A renovation crew site example: an apartment plan in the hero, an estimate calculator by area and renovation type, work stages, before-and-after and an enquiry.",
      h1: "Apartment renovation website",
      intro:
        "A site that answers a renovation client's main questions: how much it costs — an estimate calculator by area and type, how long it takes — stages on a chart, and how it will look — before-and-after. A one-field enquiry ends the page. The crew in the demo is fictional.",
    },
  },
  delivery: {
    ru: {
      title: "Сайт доставки еды: меню, корзина, конструктор",
      description:
        "Пример сайта доставки еды: время доставки на первом экране, меню с корзиной и прогрессом до бесплатной доставки, конструктор боула, акции и зона доставки.",
      h1: "Сайт доставки еды",
      intro:
        "Сайт, где заказ собирается без лишних переходов: меню с корзиной в закреплённой полосе, прогресс до бесплатной доставки, конструктор боула по слоям. Первый экран обещает время доставки. Сервис в демо вымышленный.",
    },
    en: {
      title: "Food delivery website: menu, cart and builder",
      description:
        "A food delivery site example: delivery time in the hero, a menu with a cart and free-delivery progress, a bowl builder, offers and a delivery zone.",
      h1: "Food delivery website",
      intro:
        "A site where an order comes together without extra steps: a menu with a cart in a sticky bar, progress towards free delivery and a layer-by-layer bowl builder. The hero promises a delivery time. The service in the demo is fictional.",
    },
  },
  language: {
    ru: {
      title: "Сайт языковой школы: тест уровня, занятия, тарифы",
      description:
        "Пример сайта онлайн-школы иностранных языков: слово-перевёртыш и диалог на первом экране, тест уровня A1–C1, как проходят занятия, преподаватели и тарифы.",
      h1: "Сайт языковой школы",
      intro:
        "Сайт школы, который помогает начать: короткий тест показывает уровень по шкале A1–C1, дальше видно, как проходят занятия, кто преподаёт и сколько стоит. Школа в демо вымышленная.",
    },
    en: {
      title: "Language school website: level test, lessons and pricing",
      description:
        "An online language school site example: a flipping word and a dialogue in the hero, an A1–C1 level test, how lessons work, teachers and pricing.",
      h1: "Language school website",
      intro:
        "A school site that helps people start: a short test shows a level on the A1–C1 scale, then visitors see how lessons work, who teaches and what it costs. The school in the demo is fictional.",
    },
  },
  fintech: {
    ru: {
      title: "Сайт финтех-сервиса для бизнеса: продукт, тарифы, безопасность",
      description:
        "Пример сайта необанка для малого бизнеса: 3D-карта на первом экране, дашборд с графиком и операциями, возможности, безопасность, тарифы и интеграции.",
      h1: "Сайт финтеха для бизнеса",
      intro:
        "Сайт финансового продукта, который показывает его в работе: карта поворачивается за курсором, дашборд рисует график и добавляет операции по одной, дальше — возможности, тарифы и раздел о безопасности. Банк в демо вымышленный, данные в дашборде — пример.",
    },
    en: {
      title: "Business fintech website: product, pricing and security",
      description:
        "A small business neobank site example: a 3D card in the hero, a dashboard with a chart and transactions, features, security, pricing and integrations.",
      h1: "Business fintech website",
      intro:
        "A financial product site that shows the product at work: a card turns with the cursor, a dashboard draws a chart and adds transactions one by one, then come features, pricing and a security section. The bank in the demo is fictional and the dashboard data is sample data.",
    },
  },
  market: {
    ru: {
      title: "Сайт маркетплейса цифровых товаров: витрина и фильтры",
      description:
        "Пример маркетплейса шаблонов: полка обложек на первом экране, витрина с живыми фильтрами, быстрый просмотр, лицензии, авторы и корзина.",
      h1: "Сайт маркетплейса шаблонов",
      intro:
        "Сайт магазина цифровых товаров: обложки раскладываются в сетку по прокрутке, витрина фильтруется без перезагрузки, у товара есть быстрый просмотр и выбор лицензии. Маркетплейс в демо вымышленный.",
    },
    en: {
      title: "Digital product marketplace website: storefront and filters",
      description:
        "A template marketplace example: a shelf of covers in the hero, a storefront with live filters, quick view, licences, authors and a cart.",
      h1: "Template marketplace website",
      intro:
        "A digital goods store: covers lay out into a grid on scroll, the storefront filters without reloading, and each product has a quick view and a licence choice. The marketplace in the demo is fictional.",
    },
  },
  api: {
    ru: {
      title: "Сайт API и инструмента для разработчиков",
      description:
        "Пример сайта API: запрос и JSON-ответ на первом экране с примерами curl, JS, Python и Go, песочница, эндпоинты, тарифы за запросы и статус сервиса.",
      h1: "Сайт API и dev-tool",
      intro:
        "Сайт продукта для разработчиков, который отвечает кодом: первый экран показывает запрос и ответ на четырёх языках, песочница даёт попробовать, дальше — эндпоинты, цены за запросы и статус. API в демо вымышленный.",
    },
    en: {
      title: "API and developer tool website",
      description:
        "An API site example: a request and JSON response in the hero with curl, JS, Python and Go examples, a sandbox, endpoints, per-request pricing and service status.",
      h1: "API and dev tool website",
      intro:
        "A developer product site that answers in code: the hero shows a request and response in four languages, a sandbox lets people try it, then come endpoints, per-request pricing and status. The API in the demo is fictional.",
    },
  },
  gadget: {
    ru: {
      title: "Лендинг гаджета: продуктовая страница устройства",
      description:
        "Пример лендинга умного устройства: лампа из CSS на первом экране с живыми ползунками, сценарий на липкой сцене, характеристики, сравнение с прошлой версией и предзаказ.",
      h1: "Лендинг гаджета",
      intro:
        "Продуктовая страница устройства в духе больших брендов: свет лампы меняется ползунками прямо на первом экране, сценарий использования разворачивается по прокрутке, дальше — характеристики, сравнение с прошлой версией и предзаказ. Устройство в демо вымышленное.",
    },
    en: {
      title: "Gadget landing page: a hardware product page",
      description:
        "A smart device landing page example: a CSS lamp in the hero with live sliders, a sticky scrolling story, specs, a comparison with the previous version and pre-order.",
      h1: "Gadget landing page",
      intro:
        "A device product page in the style of big brands: the lamp's light changes with sliders right in the hero, a usage story unfolds on scroll, then come specs, a comparison with the previous version and pre-order. The device in the demo is fictional.",
    },
  },
  charity: {
    ru: {
      title: "Сайт благотворительного фонда: сбор, истории, помощь",
      description:
        "Пример сайта фонда: счётчик сбора с вехами, «что даёт ваша сумма», истории подопечных, отчёты, волонтёрство и форма пожертвования.",
      h1: "Сайт благотворительного фонда",
      intro:
        "Сайт фонда, который объясняет помощь конкретно: счётчик показывает, сколько собрано, блок «что даёт ваша сумма» переводит деньги в дела, истории подопечных и отчёты дают доверие, а форма помогает пожертвовать или стать волонтёром. Фонд в демо вымышленный.",
    },
    en: {
      title: "Charity foundation website: fundraising, stories and help",
      description:
        "A charity site example: a fundraising counter with milestones, “what your gift does”, beneficiary stories, reports, volunteering and a donation form.",
      h1: "Charity foundation website",
      intro:
        "A foundation site that explains help in concrete terms: a counter shows what's been raised, “what your gift does” turns money into actions, stories and reports build trust, and a form lets people donate or volunteer. The foundation in the demo is fictional.",
    },
  },
  writer: {
    ru: {
      title: "Личный сайт писателя: книги, тексты, читалка",
      description:
        "Пример сайта писателя: режим день/ночь на весь сайт, 3D-книга, тексты и эссе, удобная для чтения типографика, встречи и письма читателям.",
      h1: "Сайт писателя",
      intro:
        "Сайт автора, где главное — текст: страница переключается между дневным и ночным режимом, книга открывается в 3D, эссе набраны так, чтобы их было удобно читать. Писательница в демо вымышленная.",
    },
    en: {
      title: "Writer's personal website: books, essays and a reader",
      description:
        "A writer's site example: a site-wide day/night mode, a 3D book, essays and texts, reading-friendly typography, events and letters to readers.",
      h1: "Writer's website",
      intro:
        "An author's site where the text comes first: the page switches between day and night modes, a book opens in 3D and essays are set to be easy to read. The writer in the demo is fictional.",
    },
  },
  house: {
    ru: {
      title: "Сайт строительной компании: проекты домов и цены",
      description:
        "Пример сайта строителя домов из клеёного бруса: слайдер проектов с ценой, каталог с фильтром по площади, технология, этапы стройки и заявка.",
      h1: "Сайт строительной компании",
      intro:
        "Сайт, который продаёт проект дома: слайдер на весь экран с ценой каждого проекта, каталог «какой дом ваш» с фильтром по площади, рассказ о технологии и этапах строительства и заявка. Компания в демо вымышленная.",
    },
    en: {
      title: "Home builder website: house projects and prices",
      description:
        "A glulam home builder site example: a project slider with prices, a catalog filtered by floor area, the technology, construction stages and an enquiry form.",
      h1: "Home builder website",
      intro:
        "A site that sells a house project: a full-screen slider with each project's price, a “which house is yours” catalog filtered by area, the technology and construction stages, and an enquiry. The company in the demo is fictional.",
    },
  },
}

export function categoryCopy(kind: string, category: string, locale: Locale) {
  return CATEGORY_COPY[`${kind}/${category}`]?.[locale]
}

export function scenarioCopy(slug: string, locale: Locale) {
  return SCENARIO_COPY[slug]?.[locale]
}
