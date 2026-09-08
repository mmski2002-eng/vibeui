import { CATEGORIES } from "@/registry/categories"

/**
 * Сценарии — вход в каталог со стороны задачи, а не со стороны устройства
 * библиотеки.
 *
 * «Компоненты / Блоки / Анимации» описывают, из чего собрана библиотека.
 * Человек приходит с другим: «делаю сайт мастера», «нужен магазин»,
 * «собираю личный кабинет». Сценарий раскладывает такую задачу в
 * упорядоченный список секций и говорит, зачем на странице каждая.
 *
 * Сценарий ничего не устанавливает сам и не является `kind: "template"`:
 * шаблон — это готовая страница одним item'ом, а сценарий — маршрут по уже
 * существующим блокам. Ставятся по-прежнему сами блоки.
 *
 * Это единственные данные каталога, которые нельзя вывести из registry:
 * «что с чем сочетается и в каком порядке» — решение автора, а не свойство
 * файлов. Поэтому список ведётся руками, и при новой категории его надо
 * дополнить (см. docs/SCENARIOS.md).
 */

export type ScenarioStep = {
  /** Слаг категории из `registry/categories.ts`. */
  category: string
  /**
   * Роль секции на странице. Это не имя категории: в сценарии человеку
   * важно «Форма заявки», а не «Контакты», — так он узнаёт нужное, не зная
   * нашей таксономии.
   */
  role: string
  roleEn: string
  /** Зачем эта секция на странице. Одна строка. */
  why: string
  whyEn: string
  /** Секция полезная, но не обязательная: страница живёт и без неё. */
  optional?: boolean
}

export type Scenario = {
  slug: string
  label: string
  en: string
  /** Задача одним предложением — то, с чем человек пришёл. */
  summary: string
  summaryEn: string
  steps: ScenarioStep[]
  /**
   * Категория, чей блок показывается обложкой. Задаётся явно: первый шаг
   * почти везде «шапка», и без этого поля половина карточек на витрине
   * выглядела одинаково.
   */
  cover: string
  /** Мелкие компоненты, без которых страница не соберётся. Слаги категорий. */
  parts: string[]
}

export const SCENARIOS: Scenario[] = [
  {
    slug: "service-landing",
    label: "Лендинг услуги",
    en: "Service landing",
    summary: "Одностраничник, который продаёт услугу и собирает заявки",
    summaryEn: "A one-pager that sells a service and collects requests",
    steps: [
      {
        category: "navbar",
        role: "Шапка",
        roleEn: "Header",
        why: "Логотип, разделы страницы и кнопка заявки",
        whyEn: "Logo, page sections and the request button",
      },
      {
        category: "hero",
        role: "Первый экран",
        roleEn: "Hero",
        why: "Что вы делаете и главное действие",
        whyEn: "What you do and the main action",
      },
      {
        category: "features",
        role: "Что входит в услугу",
        roleEn: "What the service includes",
        why: "Состав работы, разложенный по пунктам",
        whyEn: "The work itself, broken into points",
      },
      {
        category: "cases",
        role: "Примеры работ",
        roleEn: "Case studies",
        why: "Доказательство делом: до и после, цифры",
        whyEn: "Proof by work: before and after, numbers",
      },
      {
        category: "testimonials",
        role: "Отзывы",
        roleEn: "Testimonials",
        why: "Чужие слова убеждают сильнее своих",
        whyEn: "Other people's words convince better than yours",
      },
      {
        category: "pricing",
        role: "Стоимость",
        roleEn: "Pricing",
        why: "Цена без письма и звонка снимает половину возражений",
        whyEn: "A price without a call removes half the objections",
      },
      {
        category: "faq",
        role: "Частые вопросы",
        roleEn: "FAQ",
        why: "Ответы на то, из-за чего обычно не пишут",
        whyEn: "Answers to what usually stops people from writing",
      },
      {
        category: "cta",
        role: "Призыв к действию",
        roleEn: "Call to action",
        why: "Последнее предложение перед формой",
        whyEn: "The last offer before the form",
      },
      {
        category: "contact",
        role: "Форма заявки",
        roleEn: "Request form",
        why: "То, ради чего страница написана",
        whyEn: "The reason the page exists",
      },
      {
        category: "footer",
        role: "Подвал",
        roleEn: "Footer",
        why: "Контакты, документы, соцсети",
        whyEn: "Contacts, documents, social links",
      },
    ],
    cover: "features",
    parts: ["button", "input", "field", "textarea", "toast"],
  },
  {
    slug: "store",
    label: "Магазин",
    en: "Store",
    summary: "Витрина товаров, карточка и оформление заказа",
    summaryEn: "A product showcase, a product page and checkout",
    steps: [
      {
        category: "navbar",
        role: "Шапка с корзиной",
        roleEn: "Header with a cart",
        why: "Поиск, разделы, корзина — всё время на виду",
        whyEn: "Search, sections and the cart, always in reach",
      },
      {
        category: "hero",
        role: "Первый экран",
        roleEn: "Hero",
        why: "Сезон, акция или главная категория",
        whyEn: "A season, a sale or the main category",
      },
      {
        category: "commerce",
        role: "Витрина и карточка товара",
        roleEn: "Showcase and product page",
        why: "Сетка товаров, карточка, корзина, оформление",
        whyEn: "Product grid, product page, cart, checkout",
      },
      {
        category: "comparison",
        role: "Сравнение",
        roleEn: "Comparison",
        why: "Помогает выбрать между похожими товарами",
        whyEn: "Helps choose between similar products",
        optional: true,
      },
      {
        category: "testimonials",
        role: "Отзывы покупателей",
        roleEn: "Customer reviews",
        why: "Главный аргумент в пользу покупки",
        whyEn: "The strongest argument for buying",
      },
      {
        category: "faq",
        role: "Доставка и возврат",
        roleEn: "Delivery and returns",
        why: "Вопросы, из-за которых бросают корзину",
        whyEn: "The questions that make carts get abandoned",
      },
      {
        category: "newsletter",
        role: "Подписка",
        roleEn: "Newsletter",
        why: "Возвращает тех, кто не купил сразу",
        whyEn: "Brings back those who did not buy at once",
        optional: true,
      },
      {
        category: "footer",
        role: "Подвал",
        roleEn: "Footer",
        why: "Оплата, доставка, юридические документы",
        whyEn: "Payment, delivery, legal documents",
      },
    ],
    cover: "commerce",
    parts: ["button", "badge", "rating", "select", "pagination", "filters"],
  },
  {
    slug: "portfolio",
    label: "Портфолио",
    en: "Portfolio",
    summary: "Личный сайт, который показывает работы и приводит клиентов",
    summaryEn: "A personal site that shows the work and brings clients",
    steps: [
      {
        category: "navbar",
        role: "Шапка",
        roleEn: "Header",
        why: "Имя и переходы к работам и контактам",
        whyEn: "Your name and links to work and contacts",
      },
      {
        category: "hero",
        role: "Первый экран",
        roleEn: "Hero",
        why: "Кто вы и чем занимаетесь — в одну фразу",
        whyEn: "Who you are and what you do, in one line",
      },
      {
        category: "portfolio",
        role: "Работы",
        roleEn: "Work",
        why: "Сетка проектов — то, за чем сюда приходят",
        whyEn: "The project grid — what people come for",
      },
      {
        category: "cases",
        role: "Разбор проекта",
        roleEn: "Case study",
        why: "Один проект подробно: задача, решение, результат",
        whyEn: "One project in depth: task, solution, result",
      },
      {
        category: "about",
        role: "О себе",
        roleEn: "About",
        why: "Опыт и подход — короткой справкой",
        whyEn: "Experience and approach, briefly",
      },
      {
        category: "logos",
        role: "Клиенты",
        roleEn: "Clients",
        why: "Логотипы тех, с кем уже работали",
        whyEn: "Logos of those you have worked with",
        optional: true,
      },
      {
        category: "contact",
        role: "Связаться",
        roleEn: "Get in touch",
        why: "Форма и прямые контакты",
        whyEn: "A form and direct contacts",
      },
      {
        category: "footer",
        role: "Подвал",
        roleEn: "Footer",
        why: "Соцсети и почта",
        whyEn: "Social links and email",
      },
    ],
    cover: "portfolio",
    parts: ["avatar", "badge", "carousel", "dialog", "button"],
  },
  {
    slug: "dashboard",
    label: "Личный кабинет",
    en: "Dashboard",
    summary: "Закрытая часть продукта: вход, показатели, таблицы",
    summaryEn: "The private side of a product: sign-in, metrics, tables",
    steps: [
      {
        category: "auth",
        role: "Вход и регистрация",
        roleEn: "Sign in and sign up",
        why: "Дверь в кабинет: вход, регистрация, сброс пароля",
        whyEn: "The door: sign in, sign up, password reset",
      },
      {
        category: "dashboard",
        role: "Панель показателей",
        roleEn: "Overview",
        why: "Главные цифры на первом экране после входа",
        whyEn: "The key numbers on the first screen after sign-in",
      },
      {
        category: "data-grid",
        role: "Таблица данных",
        roleEn: "Data table",
        why: "Список записей с сортировкой и фильтрами",
        whyEn: "A list of records with sorting and filters",
      },
      {
        category: "empty",
        role: "Пустое состояние",
        roleEn: "Empty state",
        why: "Что человек видит, пока данных нет",
        whyEn: "What a person sees while there is no data",
      },
      {
        category: "errors",
        role: "Страницы ошибок",
        roleEn: "Error pages",
        why: "404 и сбой — чтобы не терять человека",
        whyEn: "404 and failure — so the person is not lost",
        optional: true,
      },
    ],
    cover: "dashboard",
    parts: ["button", "table", "dialog", "toast", "dropdown-menu", "skeleton"],
  },
  {
    slug: "app-site",
    label: "Сайт приложения",
    en: "App site",
    summary: "Страница продукта: показать, убедить, отправить в стор",
    summaryEn: "A product page: show it, convince, send to the store",
    steps: [
      {
        category: "navbar",
        role: "Шапка",
        roleEn: "Header",
        why: "Разделы и кнопка загрузки",
        whyEn: "Sections and the download button",
      },
      {
        category: "hero",
        role: "Первый экран",
        roleEn: "Hero",
        why: "Приложение в деле: экран телефона и обещание",
        whyEn: "The app in action: a phone screen and the promise",
      },
      {
        category: "features",
        role: "Возможности",
        roleEn: "Features",
        why: "Что умеет приложение, по пунктам",
        whyEn: "What the app can do, point by point",
      },
      {
        category: "video",
        role: "Видео",
        roleEn: "Video",
        why: "Показать работу быстрее, чем описать",
        whyEn: "Showing the flow beats describing it",
        optional: true,
      },
      {
        category: "downloads",
        role: "Загрузка",
        roleEn: "Downloads",
        why: "Кнопки сторов и QR-код",
        whyEn: "Store buttons and a QR code",
      },
      {
        category: "pricing",
        role: "Тарифы",
        roleEn: "Pricing",
        why: "Бесплатный план и подписка",
        whyEn: "The free plan and the subscription",
        optional: true,
      },
      {
        category: "changelog",
        role: "История изменений",
        roleEn: "Changelog",
        why: "Показывает, что продукт живой",
        whyEn: "Shows the product is alive",
        optional: true,
      },
      {
        category: "faq",
        role: "Частые вопросы",
        roleEn: "FAQ",
        why: "Совместимость, доступ, оплата",
        whyEn: "Compatibility, access, payment",
      },
      {
        category: "footer",
        role: "Подвал",
        roleEn: "Footer",
        why: "Ссылки на сторы, поддержку и документы",
        whyEn: "Links to stores, support and documents",
      },
    ],
    cover: "downloads",
    parts: ["button", "badge", "accordion", "carousel", "tabs"],
  },
]

// Опечатка в слаге здесь означала бы пустой шаг на витрине, поэтому
// таксономия проверяется при загрузке модуля, а не глазами.
for (const scenario of SCENARIOS) {
  for (const slug of [
    ...scenario.steps.map((step) => step.category),
    ...scenario.parts,
    scenario.cover,
  ]) {
    if (!CATEGORIES.some((category) => category.slug === slug)) {
      throw new Error(
        `registry/scenarios.ts: сценарий "${scenario.slug}" ссылается на категорию "${slug}", которой нет в registry/categories.ts`,
      )
    }
  }
}
