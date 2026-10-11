type Section = { title: string; paragraphs?: string[]; items?: string[] }

type Numbers = {
  commission: number
  discount: number
  trialDays: number
  minimum: string
}

export const PARTNER_GUIDE_EMAIL = "vibeuiclub@gmail.com"

export const PARTNER_GUIDE_TEXTS = {
  ru: {
    title: "Инструкция партнёра",
    lead: "Всё о партнёрской программе VibeUI: как работает ссылка, за что начисляется комиссия, как получить выплату и что где лежит в кабинете.",
    back: "К рефералам",
    open: "Инструкция партнёра",
    supportLink: "Написать в поддержку",
    sections: (n: Numbers): Section[] => [
      {
        title: "Что такое VibeUI",
        paragraphs: [
          "VibeUI — каталог готовых UI-блоков и целых страниц для вайбкодинга. Человек выбирает дизайн, нажимает «Copy for AI» и отдаёт инструкцию своему ИИ-агенту (Cursor, Claude Code и другим). Агент ставит настоящий файл компонента, а не придумывает его заново, — поэтому результат выглядит как в превью.",
          "Аудитория, которой это полезно: те, кто собирает сайты и лендинги с помощью ИИ, разработчики на Next.js и React, фрилансеры, которым нужен быстрый красивый результат.",
        ],
      },
      {
        title: "Как вы стали партнёром",
        items: [
          `При регистрации по личной ссылке вы получили ${n.trialDays} дней Pro бесплатно — пользуйтесь всем каталогом, чтобы показывать его в материалах.`,
          "Та же ссылка теперь ваша партнёрская: все, кто придёт по ней, закрепляются за вами.",
          "Раздел «Рефералы» в меню кабинета виден только партнёрам — там ссылка, статистика и выплаты.",
        ],
      },
      {
        title: "Ссылка и промокод",
        items: [
          "Ваше слово — одновременно хвост ссылки (/?ref=слово) и промокод. Задаётся в блоке «Промокод» на странице «Рефералы»: латиница, цифры, «-» и «_», от 3 до 24 символов.",
          `Промокод даёт зрителю скидку ${n.discount}% на первый платёж. Пришедшему по ссылке код подставляется на странице тарифов сам, вводить его не нужно.`,
          "Промокод работает и без ссылки: его можно произнести в видео или написать в посте. Человек вводит его на странице тарифов при оплате.",
          "Ссылку удобно копировать кнопкой рядом с ней в кабинете.",
        ],
      },
      {
        title: "Как начисляется комиссия",
        items: [
          "Переход по ссылке запоминается на 60 дней — человеку не обязательно регистрироваться сразу.",
          "Человек закрепляется за вами в момент регистрации — навсегда.",
          "Если он пришёл без ссылки, но оплатил с вашим промокодом, он тоже закрепляется за вами.",
          `Вы получаете ${n.commission}% со всех его оплат подписки: первой, продлений, годовых — без ограничения по времени.`,
          "Комиссия считается от суммы, которую человек фактически заплатил, после скидки.",
        ],
      },
      {
        title: "Что показывает страница «Рефералы»",
        items: [
          "Партнёрская ссылка и код — то, что вы раздаёте.",
          "Промокод — ваше слово, размер скидки, число оплат по коду, их сумма и ваша комиссия.",
          "Выплаты — сколько начислено, выплачено и сколько к выплате; реквизиты и кнопка запроса вывода.",
          "Переходы — сколько раз открыли вашу ссылку за выбранный период.",
          "Регистрации — сколько человек зарегистрировалось после перехода.",
          "Оплатили — у скольких был хотя бы один успешный платёж.",
          "Конверсия — доля оплативших среди зарегистрированных.",
          "Динамика и воронка — переходы и регистрации по дням, путь «переход → регистрация → оплата».",
          "Список людей — кого вы привели (почта скрыта частично), статус и дата регистрации.",
          "Переключатель 30 / 90 дней вверху меняет период для графиков и счётчиков.",
        ],
      },
      {
        title: "Выплаты",
        items: [
          `Вывести можно, когда к выплате накопилось от ${n.minimum}.`,
          "Один раз заполните реквизиты в блоке «Выплаты». После сохранения их меняет только поддержка — вводите внимательно.",
          "Нажмите «Запросить вывод». Заявка уходит на рассмотрение; её статус виден там же.",
        ],
      },
      {
        title: "Остальные страницы кабинета",
        items: [
          "Обзор — тариф, сводка и быстрые ссылки.",
          "Избранное — компоненты, которые вы отметили в каталоге.",
          "История — компоненты, которые вы брали.",
          "Тариф и оплата — текущая подписка и её продление.",
          "Оплата — история ваших платежей.",
          "Подключение к проекту — токен, чтобы ИИ-агент ставил компоненты Pro в ваш проект.",
          "Профиль и безопасность — имя, почта, пароль.",
          "Поддержка — вопросы нам.",
        ],
      },
      {
        title: "Как рассказывать о VibeUI",
        items: [
          "Покажите живой процесс: выбрать блок в каталоге, нажать «Copy for AI», вставить в агента — и получить готовую секцию.",
          "Соберите страницу целиком через раздел «Сценарии»: лендинг, магазин, портфолио.",
          "Сравните: страница, которую ИИ сгенерировал с нуля, и та же страница из блоков VibeUI.",
          "Ссылку — в описание и закреплённый комментарий, промокод — голосом или текстом в кадре.",
          `Скажите зрителям про скидку ${n.discount}% на первый платёж по вашему коду.`,
        ],
      },
      {
        title: "Правила",
        items: [
          "Отмечайте материал как рекламу или партнёрство, если этого требует площадка.",
          "Не обещайте того, чего нет в продукте, и не выдумывайте цены — актуальные всегда на странице тарифов.",
          "Без спама, накруток и мотивированного трафика: такие регистрации и оплаты могут быть не засчитаны.",
          "Не покупайте рекламу в поиске по слову VibeUI.",
          "Нельзя регистрироваться и платить по своей же ссылке или коду.",
        ],
      },
      {
        title: "Частые вопросы",
        items: [
          "Переходы есть, регистраций нет — у человека есть 60 дней, многие возвращаются позже.",
          "Человек оплатил, а комиссии нет — проверьте, что он регистрировался после перехода по ссылке или ввёл ваш промокод. Если всё так, напишите нам.",
          "Можно ли сменить слово — да, в блоке «Промокод»; старая ссылка перестанет работать, поэтому меняйте до публикации.",
          "Нужны скриншоты или ответы для ролика — напишите, поможем.",
        ],
      },
    ],
    contactTitle: "Связь",
    contact: "Вопросы — через страницу поддержки в кабинете или на почту",
  },
  en: {
    title: "Partner guide",
    lead: "Everything about the VibeUI partner program: how the link works, what earns commission, how to get paid and where things are in your account.",
    back: "Back to referrals",
    open: "Partner guide",
    supportLink: "Contact support",
    sections: (n: Numbers): Section[] => [
      {
        title: "What VibeUI is",
        paragraphs: [
          "VibeUI is a catalog of ready UI blocks and whole pages for vibe coding. A person picks a design, presses “Copy for AI” and hands the instruction to their AI agent (Cursor, Claude Code and others). The agent installs the real component file instead of improvising one, so the result looks like the preview.",
          "Who finds it useful: people building sites and landing pages with AI, Next.js and React developers, freelancers who need a fast, good-looking result.",
        ],
      },
      {
        title: "How you became a partner",
        items: [
          `Signing up through your personal link gave you ${n.trialDays} days of Pro for free — use the whole catalog to show it in your content.`,
          "The same link is now your partner link: everyone who comes through it is attributed to you.",
          "The Referrals section in the account menu is visible to partners only — it has your link, stats and payouts.",
        ],
      },
      {
        title: "Link and promo code",
        items: [
          "Your word is both the end of the link (/?ref=word) and your promo code. Set it in the Promo code block on the Referrals page: Latin letters, digits, “-” and “_”, 3 to 24 characters.",
          `The promo code gives viewers ${n.discount}% off their first payment. For people who come through the link it is filled in on the pricing page automatically.`,
          "The code also works without the link: say it in a video or write it in a post. People enter it on the pricing page when paying.",
          "Copy the link with the button next to it in your account.",
        ],
      },
      {
        title: "How commission works",
        items: [
          "A visit through the link is remembered for 60 days — people do not have to sign up right away.",
          "A person is attributed to you at signup, permanently.",
          "If they came without the link but paid with your promo code, they are attributed to you too.",
          `You get ${n.commission}% of all their subscription payments: the first one, renewals, yearly plans — with no time limit.`,
          "Commission is counted from what the person actually paid, after the discount.",
        ],
      },
      {
        title: "What the Referrals page shows",
        items: [
          "Partner link and code — what you share.",
          "Promo code — your word, discount size, payments made with the code, their total and your commission.",
          "Payouts — accrued, paid out and due; your wallet and the payout request button.",
          "Clicks — how many times your link was opened in the selected period.",
          "Signed up — how many people registered after a visit.",
          "Paid — how many made at least one successful payment.",
          "Conversion — the share of paying people among those who signed up.",
          "Dynamics and funnel — clicks and signups by day, the path “click → signup → payment”.",
          "People list — who you brought (email partly hidden), status and signup date.",
          "The 30 / 90 days switch at the top changes the period for charts and counters.",
        ],
      },
      {
        title: "Payouts",
        items: [
          `You can withdraw once at least ${n.minimum} is due.`,
          "Payouts are sent in USDC on the Ethereum network. Enter your wallet once in the Payouts block; it cannot be changed after saving, so check it carefully.",
          "Press “Request payout”. The request goes to review; its status is shown in the same block.",
        ],
      },
      {
        title: "Other account pages",
        items: [
          "Overview — your plan, summary and quick links.",
          "Favorites — components you starred in the catalog.",
          "History — components you have taken.",
          "Plan and billing — your subscription and renewal.",
          "Payments — your payment history.",
          "Connect to project — a token so your AI agent can install Pro components into your project.",
          "Profile and security — name, email, password.",
          "Support — questions to us.",
        ],
      },
      {
        title: "How to talk about VibeUI",
        items: [
          "Show the real flow: pick a block in the catalog, press “Copy for AI”, paste it into the agent — and get a finished section.",
          "Build a whole page through Scenarios: a landing page, a store, a portfolio.",
          "Compare a page the AI generated from scratch with the same page built from VibeUI blocks.",
          "Put the link in the description and a pinned comment; say or show the promo code.",
          `Tell viewers about ${n.discount}% off the first payment with your code.`,
        ],
      },
      {
        title: "Rules",
        items: [
          "Mark the content as an ad or partnership where the platform requires it.",
          "Do not promise what the product does not have and do not quote prices from memory — current prices are always on the pricing page.",
          "No spam, fake or incentivized traffic: such signups and payments may not be counted.",
          "Do not buy search ads on the word VibeUI.",
          "You cannot sign up or pay through your own link or code.",
        ],
      },
      {
        title: "FAQ",
        items: [
          "Clicks but no signups — people have 60 days, many come back later.",
          "Someone paid but there is no commission — check that they signed up after visiting your link or entered your code. If so, write to us.",
          "Can I change my word — yes, in the Promo code block; the old link stops working, so change it before publishing.",
          "Need screenshots or answers for a video — write to us, we will help.",
        ],
      },
    ],
    contactTitle: "Contact",
    contact: "Questions — through the support page in your account or by email",
  },
} as const
