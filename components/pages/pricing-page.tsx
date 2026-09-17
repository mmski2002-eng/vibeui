import Link from "next/link"
import { ArrowRight, Infinity as InfinityIcon, Lock, LockOpen, Sparkles } from "lucide-react"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { PlanCards } from "@/components/pages/pricing/plan-cards"
import { Reveal } from "@/components/pages/pricing/reveal"
import { Cursor005 } from "@/registry/animations/cursor/cursor-005/cursor-005"
import { Pricing011 } from "@/registry/blocks/pricing/pricing-011/pricing-011"
import { getUsedCount } from "@/lib/entitlements"
import { localePath, type Locale } from "@/lib/i18n"
import { FREE_MONTHLY_LIMIT } from "@/lib/limits"
import { getPlans, type Plans } from "@/lib/plan-prices"
import {
  isFirstPayment,
  normalizePromo,
  promoFromReferralCookie,
} from "@/lib/promo"
import { getSession } from "@/lib/session"
import { getSubscriptionState, isProState } from "@/lib/subscription-state"
import { getCatalogItems, getItemsByKind } from "@/registry/index"

/** Витрина красится фирменным оранжевым: блоки из реестра берут его пропом. */
const BRAND_ACCENT = "#ff5900"

type Prices = {
  MONTHLY: number
  YEARLY: number
  ENTERPRISE_MONTHLY: number
  ENTERPRISE_YEARLY: number
  YEARLY_SAVING: number
}

/** Цены в рублях без копеек: администратор правит их в кабинете. */
function pricesOf(plans: Plans): Prices {
  const MONTHLY = Math.round(Number(plans.monthly.price))
  const YEARLY = Math.round(Number(plans.yearly.price))

  return {
    MONTHLY,
    YEARLY,
    ENTERPRISE_MONTHLY: Math.round(Number(plans["enterprise-monthly"].price)),
    ENTERPRISE_YEARLY: Math.round(Number(plans["enterprise-yearly"].price)),
    YEARLY_SAVING: Math.round((1 - YEARLY / (MONTHLY * 12)) * 100),
  }
}

const ITEMS = getCatalogItems().length
const ANIMATIONS = getItemsByKind("animation").length

const number = (value: number) => value.toLocaleString("ru-RU")

const buildTexts = ({
  MONTHLY,
  YEARLY,
  ENTERPRISE_MONTHLY,
  ENTERPRISE_YEARLY,
  YEARLY_SAVING,
}: Prices) =>
  ({
  ru: {
    eyebrow: "Тарифы",
    title: "Сайт за вечер.\nДизайн — ваш.",
    lede: `${number(ITEMS)} блоков, компонентов и анимаций. Выбираете, копируете промпт, ИИ-агент ставит в проект как есть: анимации, типографика, отступы. Ноль зависимостей.`,
    heroPrimary: "Начать бесплатно",
    heroPrimarySigned: "Открыть каталог",
    heroSecondary: "К тарифам",
    heroNote: `${FREE_MONTHLY_LIMIT} компонентов в месяц бесплатно. Карта не нужна.`,
    heroHint: "Проведите курсором по полю",
    trust: [
      `${number(ITEMS)} элементов`,
      "Ноль зависимостей",
      "shadcn CLI",
      "Оплата картой и СБП",
      "Без автосписаний",
    ],
    plansEyebrow: "Тарифы",
    plansTitle: "Бесплатно — чтобы попробовать. PRO — чтобы собирать.",
    plans: {
      switchLabel: "Период оплаты",
      month: "Помесячно",
      year: "На год",
      save: `−${YEARLY_SAVING} %`,
      perMonth: "/ мес",
      perYear: "/ год",
      yearlyNotePro: `${number(Math.round(YEARLY / 12))} ₽ в месяц`,
      yearlyNoteEnterprise: `${number(Math.round(ENTERPRISE_YEARLY / 12))} ₽ в месяц`,
      savingNote: `экономия ${number(MONTHLY * 12 - YEARLY)} ₽`,
      promo: {
        have: "Есть промокод?",
        placeholder: "",
        apply: "Применить",
        remove: "Убрать",
        byCode: "по промокоду",
        instead: "вместо",
        errors: {
          invalid: "Промокод: латиница, цифры, «-» и «_», от 3 символов",
          not_found: "Такого промокода нет",
          own: "Свой промокод применить нельзя",
          not_first: "Скидка по промокоду — только на первый платёж",
          failed: "Не получилось проверить, попробуйте ещё раз",
        },
      },
      free: {
        name: "Бесплатно",
        eyebrow: "Чтобы попробовать",
        features: [
          "Весь каталог, живые превью и поиск",
          `${FREE_MONTHLY_LIMIT} разных компонентов в месяц`,
          "Copy for AI и установка через shadcn",
          "Ключ для установки прямо из shadcn CLI",
          "Избранное и история",
        ],
        cta: "Создать аккаунт",
        ctaSigned: "В кабинет",
        under: "Без карты. Лимит обнуляется первого числа.",
      },
      pro: {
        name: "PRO",
        eyebrow: "Чтобы собирать",
        badge: "Популярный",
        plusAll: "Всё из бесплатного, плюс:",
        features: [
          "Готовые сценарии: целый сайт из блоков — одной ссылкой агенту",
          "Закрытые блоки-showpiece: сложные секции только в PRO",
          `${ANIMATIONS} анимаций: курсоры, фоны, текст, стопки`,
          "Без лимита на копирования",
        ],
        anchor: "Меньше часа работы верстальщика",
        cta: "Открыть PRO",
        payMonth: "Оплатить месяц",
        payYear: "Оплатить год",
        under: "Разовая оплата. Карта не сохраняется, автосписаний нет.",
        activeUntil: "PRO активен до",
        manage: "Управлять подпиской",
      },
      enterprise: {
        name: "Энтерпрайз",
        eyebrow: "Чтобы поддержать",
        badge: "Респект",
        plusAll: "Всё из PRO, плюс:",
        features: [
          "Личный респект от создателя",
          "Ваше имя — в голове автора, когда он пишет следующий блок",
          "Чувство, что проект стал лучше благодаря вам",
        ],
        cta: "Заслужить респект",
        under: "Ровно вдвое дороже PRO. Так и задумано.",
      },
    },
    usage: (used: number) =>
      `В этом месяце вы взяли ${used} из ${FREE_MONTHLY_LIMIT}.`,
    proEyebrow: "Что открывает PRO",
    proTitle: "Три вещи, ради которых берут PRO",
    proTiles: [
      {
        title: "Готовые сценарии",
        text: "Целые страницы, собранные из блоков: демо, точный состав и одна ссылка, по которой ИИ-агент соберёт такой же сайт у вас.",
      },
      {
        title: "Закрытые блоки",
        text: "Сложные секции-showpiece: их видно в превью, но код отдаётся только в PRO — первые экраны, меню, калькуляторы, многошаговые формы.",
      },
      {
        title: "Анимации",
        text: `${ANIMATIONS} живых сцен: курсоры, шейдерные фоны, текстовые эффекты, стопки карточек. Каждая — один файл без библиотек.`,
        chips: [
          "Курсоры",
          "Фоны",
          "Текст",
          "Стопки",
          "Аватары",
          "Устройства",
          "Портфолио",
          "Рукописный",
        ],
      },
    ],
    stepsEyebrow: "Как это работает",
    stepsTitle: "Три шага от каталога до сайта",
    steps: [
      {
        title: "Выбираете",
        text: "Открываете каталог, примеряете блок на светлой и тёмной подложке, крутите настройки прямо на карточке.",
      },
      {
        title: "Копируете для ИИ",
        text: "Кнопка «Copy for AI» собирает промпт: команда установки, что сохранить, что можно менять под бренд.",
      },
      {
        title: "Агент ставит",
        text: "Cursor, Claude Code или любой другой агент ставит тот же файл, что вы видели в превью. Никаких «примерно таких же».",
      },
    ],
    snippet: "npx shadcn add vibeui.ru/r/hero-011",
    faqEyebrow: "Вопросы об оплате",
    faqTitle: "Что обычно спрашивают перед оплатой",
    faqLede: "Только про деньги, документы и сроки. Про сами компоненты — в каталоге.",
    faq: [
      {
        question: "Как оплатить?",
        answer:
          "Картой или через СБП, платёж принимает ЮKassa. Данные карты к нам не попадают.",
        open: true,
      },
      {
        question: "Подписка продлевается сама?",
        answer:
          "Нет. Оплата разовая — за месяц или за год, карта не сохраняется. Когда срок закончится, тариф станет бесплатным, а оплатить снова можно в любой момент из кабинета.",
      },
      {
        question: "Как считается лимит на бесплатном тарифе?",
        answer: `${FREE_MONTHLY_LIMIT} разных компонентов в месяц с аккаунтом. Компонент засчитывается, когда вы открываете его исходник или берёте ссылку на установку — ссылка действует 24 часа. Взять тот же компонент снова в том же месяце бесплатно, ссылка выдаётся заново. PRO снимает лимит целиком.`,
      },
      {
        question: "Будет ли чек?",
        answer:
          "Продавец — самозанятый, чек формируется в «Мой налог» после каждой оплаты. Ссылка на чек появляется в кабинете в разделе оплат.",
      },
      {
        question: "Что будет, когда подписка закончится?",
        answer: `Тариф станет бесплатным: ${FREE_MONTHLY_LIMIT} компонентов в месяц, избранное и история останутся. Всё, что вы уже скопировали в свой проект, остаётся вашим.`,
      },
      {
        question: "Что такое Энтерпрайз?",
        answer:
          "Ровно то же, что PRO, вдвое дороже — и личный респект от создателя. Это способ поддержать проект, если он вам сэкономил больше, чем стоит. Доступ у тарифов одинаковый.",
      },
      {
        question: "Есть ли тариф для команд?",
        answer:
          "Пока нет: подписка на человека. Если нужно несколько мест — напишите, договоримся вручную.",
      },
    ],
    contactText: "Не нашли свой вопрос?",
    contactLabel: "Написать в поддержку",
    ctaTitle: "Начните бесплатно. PRO — когда лимит станет тесен.",
    ctaText: `${FREE_MONTHLY_LIMIT} компонентов в месяц без карты. Потом — ${number(MONTHLY)} ₽ за месяц, без автосписаний.`,
    ctaButton: "Создать аккаунт",
    ctaButtonSigned: "Открыть каталог",
    legal: "Оплата картой или через СБП через ЮKassa. Оформляя подписку, вы принимаете",
    offer: "оферту",
    and: "и",
    privacy: "политику конфиденциальности",
  },
  en: {
    eyebrow: "Pricing",
    title: "A site in an evening.\nThe design is yours.",
    lede: `${number(ITEMS)} blocks, components and animations. Pick, copy the prompt, and the AI agent installs it as is: animations, typography, spacing. Zero dependencies.`,
    heroPrimary: "Start for free",
    heroPrimarySigned: "Open the catalog",
    heroSecondary: "See plans",
    heroNote: `${FREE_MONTHLY_LIMIT} components a month for free. No card needed.`,
    heroHint: "Move your cursor across the field",
    trust: [
      `${number(ITEMS)} items`,
      "Zero dependencies",
      "shadcn CLI",
      "Card and SBP payments",
      "No auto-charges",
    ],
    plansEyebrow: "Plans",
    plansTitle: "Free to try. PRO to build.",
    plans: {
      switchLabel: "Billing period",
      month: "Monthly",
      year: "Yearly",
      save: `−${YEARLY_SAVING}%`,
      perMonth: "/ mo",
      perYear: "/ yr",
      yearlyNotePro: `${number(Math.round(YEARLY / 12))} ₽ a month`,
      yearlyNoteEnterprise: `${number(Math.round(ENTERPRISE_YEARLY / 12))} ₽ a month`,
      savingNote: `save ${number(MONTHLY * 12 - YEARLY)} ₽`,
      promo: {
        have: "Have a promo code?",
        placeholder: "",
        apply: "Apply",
        remove: "Remove",
        byCode: "with promo code",
        instead: "instead of",
        errors: {
          invalid: "Promo code: Latin letters, digits, “-” and “_”, 3+ characters",
          not_found: "No such promo code",
          own: "You cannot apply your own promo code",
          not_first: "The promo discount applies to the first payment only",
          failed: "Could not check the code, please try again",
        },
      },
      free: {
        name: "Free",
        eyebrow: "To try",
        features: [
          "The whole catalog, live previews and search",
          `${FREE_MONTHLY_LIMIT} different components a month`,
          "Copy for AI and shadcn install",
          "A key to install straight from the shadcn CLI",
          "Favourites and history",
        ],
        cta: "Create an account",
        ctaSigned: "Open account",
        under: "No card. The limit resets on the first of the month.",
      },
      pro: {
        name: "PRO",
        eyebrow: "To build",
        badge: "Popular",
        plusAll: "Everything in Free, plus:",
        features: [
          "Ready-made scenarios: a whole site from blocks — one link to your agent",
          "Closed showpiece blocks: the complex sections, PRO-only",
          `${ANIMATIONS} animations: cursors, backgrounds, text, stacks`,
          "No limit on copies",
        ],
        anchor: "Less than an hour of a front-end contractor",
        cta: "Get PRO",
        payMonth: "Pay for a month",
        payYear: "Pay for a year",
        under: "One-off payment. No card on file, no auto-charges.",
        activeUntil: "PRO is active until",
        manage: "Manage subscription",
      },
      enterprise: {
        name: "Enterprise",
        eyebrow: "To support",
        badge: "Respect",
        plusAll: "Everything in PRO, plus:",
        features: [
          "Personal respect from the creator",
          "Your name in the author's head while he writes the next block",
          "The feeling that the project got better because of you",
        ],
        cta: "Earn respect",
        under: "Exactly twice the price of PRO. On purpose.",
      },
    },
    usage: (used: number) =>
      `This month you have taken ${used} of ${FREE_MONTHLY_LIMIT}.`,
    proEyebrow: "What PRO unlocks",
    proTitle: "Three things people get PRO for",
    proTiles: [
      {
        title: "Ready-made scenarios",
        text: "Whole pages assembled from blocks: a demo, the exact composition and one link your AI agent uses to build the same site for you.",
      },
      {
        title: "Closed blocks",
        text: "Complex showpiece sections: visible in the preview, but the code is served only in PRO — heroes, menus, calculators, multi-step forms.",
      },
      {
        title: "Animations",
        text: `${ANIMATIONS} live scenes: cursors, shader backgrounds, text effects, card stacks. Each one a single file with no libraries.`,
        chips: [
          "Cursors",
          "Backgrounds",
          "Text",
          "Stacks",
          "Avatars",
          "Devices",
          "Portfolio",
          "Hand-drawn",
        ],
      },
    ],
    stepsEyebrow: "How it works",
    stepsTitle: "Three steps from the catalog to a site",
    steps: [
      {
        title: "Pick",
        text: "Open the catalog, try a block on a light and a dark surface, tweak the settings right on the card.",
      },
      {
        title: "Copy for AI",
        text: "The Copy for AI button assembles a prompt: the install command, what to keep, what can change for your brand.",
      },
      {
        title: "The agent installs",
        text: "Cursor, Claude Code or any other agent installs the same file you saw in the preview. No \"something similar\".",
      },
    ],
    snippet: "npx shadcn add vibeui.ru/r/hero-011",
    faqEyebrow: "Billing questions",
    faqTitle: "What people ask before paying",
    faqLede: "Only money, documents and access periods. The components speak for themselves in the catalog.",
    faq: [
      {
        question: "How do I pay?",
        answer:
          "By card or via SBP; payments are handled by YooKassa. Card details never reach us.",
        open: true,
      },
      {
        question: "Does the subscription renew itself?",
        answer:
          "No. You pay once — for a month or a year — and no card is stored. When the period ends the plan becomes free, and you can pay again any time from your account.",
      },
      {
        question: "How does the free limit work?",
        answer: `${FREE_MONTHLY_LIMIT} different components a month with an account. A component counts when you open its source or take an install link — the link is valid for 24 hours. Taking the same component again in the same month is free and issues a fresh link. PRO removes the limit entirely.`,
      },
      {
        question: "Will I get a receipt?",
        answer:
          "The seller is a self-employed individual; a receipt is issued through the tax service after every payment. A link to it appears in the payments section of your account.",
      },
      {
        question: "What happens when the subscription ends?",
        answer: `The plan becomes free: ${FREE_MONTHLY_LIMIT} components a month, favourites and history stay. Everything you already copied into your project remains yours.`,
      },
      {
        question: "What is Enterprise?",
        answer:
          "Exactly the same as PRO at twice the price — plus personal respect from the creator. It is a way to support the project if it saved you more than it costs. Access is identical.",
      },
      {
        question: "Is there a team plan?",
        answer:
          "Not yet: the subscription is per person. If you need several seats, write to us and we will sort it out by hand.",
      },
    ],
    contactText: "Did not find your question?",
    contactLabel: "Write to support",
    ctaTitle: "Start for free. Go PRO when the limit gets tight.",
    ctaText: `${FREE_MONTHLY_LIMIT} components a month with no card. Then ${number(MONTHLY)} ₽ for a month, no auto-charges.`,
    ctaButton: "Create an account",
    ctaButtonSigned: "Open the catalog",
    legal: "Card or SBP payments via YooKassa. By subscribing you accept the",
    offer: "offer",
    and: "and the",
    privacy: "privacy policy",
  },
}) as const

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-shell-accent-text text-xs font-semibold tracking-[0.14em] uppercase">
      {children}
    </p>
  )
}

/**
 * Страница тарифов — витрина, а не справка. Первый экран продаёт результат
 * (сайт за вечер) поверх живого шлейфа из каталога, дальше три тарифа с
 * тёмным PRO в центре, три причины взять PRO, три шага до сайта, вопросы
 * об оплате и финальный призыв. Логика оплаты и сессии — как была.
 */
export async function PricingPage({
  locale,
  promo,
}: {
  locale: Locale
  /** Промокод из адреса `?promo=ник`. */
  promo?: string
}) {
  const prices = pricesOf(await getPlans())
  const { MONTHLY, YEARLY, ENTERPRISE_MONTHLY, ENTERPRISE_YEARLY } = prices
  const t = buildTexts(prices)[locale]
  const session = await getSession()
  const [state, used, firstPayment] = session
    ? await Promise.all([
        getSubscriptionState(session.user.id),
        getUsedCount(session.user.id),
        isFirstPayment(session.user.id),
      ])
    : [null, 0, true]
  // Код подставляется сам: из адреса или из куки после ссылки блогера.
  const initialPromo = firstPayment
    ? (normalizePromo(promo) ?? (await promoFromReferralCookie()))
    : null
  const pro = state ? isProState(state) : false
  const dates = locale === "en" ? "en-GB" : "ru-RU"
  const until =
    state && "until" in state ? state.until.toLocaleDateString(dates) : null
  const catalogHref = localePath(locale, "/components")
  const signupHref = localePath(locale, "/signup?next=/pricing")
  const [titleFirst, titleSecond] = t.title.split("\n")

  return (
    <CatalogShell locale={locale}>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8 lg:px-6">
        {/* Первый экран: шлейф картинок из каталога живёт под текстом, текст
            не ловит курсор — движение доходит до поля. */}
        <section className="border-shell-border text-shell-fg relative isolate overflow-hidden rounded-3xl border bg-[light-dark(#ffffff,#151515)]">
          <Cursor005
            caption=""
            size={150}
            threshold={90}
            lifetime={1500}
            max={10}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              aspectRatio: "auto",
              minHeight: 0,
              border: 0,
              borderRadius: 0,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(255,89,0,0.22),transparent_70%)]"
            aria-hidden="true"
          />
          <div className="pointer-events-none relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-12 text-center sm:py-14 lg:py-16">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#ff5900] uppercase">
              {t.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl leading-[1.02] font-semibold tracking-[-0.03em] text-balance sm:text-6xl lg:text-7xl">
              {titleFirst}
              <br />
              <span className="text-[#ff5900]">{titleSecond}</span>
            </h1>
            <p className="text-shell-muted mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
              {t.lede}
            </p>
            <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={session ? catalogHref : signupHref}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-shell-accent px-6 text-sm font-semibold text-shell-accent-fg transition-colors hover:bg-shell-accent-deep focus-visible:ring-2 focus-visible:ring-shell-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[light-dark(#ffffff,#151515)] focus-visible:outline-none"
              >
                {session ? t.heroPrimarySigned : t.heroPrimary}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href="#plans"
                className="border-shell-border-strong hover:border-shell-accent inline-flex h-12 items-center rounded-full border px-6 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#ff5900] focus-visible:outline-none"
              >
                {t.heroSecondary}
              </a>
            </div>
            <p className="text-shell-muted mt-5 text-sm">{t.heroNote}</p>
          </div>
          <p className="text-shell-muted pointer-events-none absolute right-5 bottom-4 z-10 hidden text-xs opacity-70 sm:block">
            {t.heroHint}
          </p>
        </section>

        {/* Доверие до цены */}
        <ul className="text-shell-muted mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-2 text-sm">
          {t.trust.map((line) => (
            <li key={line} className="flex items-center gap-2">
              <span
                className="bg-shell-accent size-1.5 rounded-full"
                aria-hidden="true"
              />
              {line}
            </li>
          ))}
        </ul>

        {/* Тарифы */}
        <section id="plans" className="scroll-mt-24 pt-20 sm:pt-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>{t.plansEyebrow}</Eyebrow>
            <h2 className="text-shell-fg mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {t.plansTitle}
            </h2>
          </Reveal>
          <Reveal delay={120} className="mt-8 text-center">
            <PlanCards
              locale={locale}
              texts={{
                ...t.plans,
                pro: {
                  ...t.plans.pro,
                  activeUntil: until ? `${t.plans.pro.activeUntil} ${until}` : null,
                },
              }}
              prices={{
                monthly: MONTHLY,
                yearly: YEARLY,
                enterpriseMonthly: ENTERPRISE_MONTHLY,
                enterpriseYearly: ENTERPRISE_YEARLY,
              }}
              signed={Boolean(session)}
              pro={pro}
              signupHref={signupHref}
              accountHref={localePath(locale, "/account")}
              manageHref={localePath(locale, "/account/subscription")}
              promo={{ initialCode: initialPromo, eligible: firstPayment }}
            />
          </Reveal>
          {session && !pro ? (
            <p className="text-shell-muted mt-5 text-center text-sm tabular-nums">
              {t.usage(used)}
            </p>
          ) : null}
        </section>

        {/* Три причины */}
        <section className="pt-20 sm:pt-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>{t.proEyebrow}</Eyebrow>
            <h2 className="text-shell-fg mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {t.proTitle}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {t.proTiles.map((tile, index) => (
              <Reveal key={tile.title} delay={index * 120} className="min-w-0">
                <article className="border-shell-border bg-shell-panel group flex h-full flex-col overflow-hidden rounded-3xl border">
                  <div className="relative flex h-40 w-full items-center justify-center overflow-hidden">
                    {index === 0 ? (
                      /* Бегущая строка категорий: два одинаковых ряда, сдвиг на половину — бесшовный цикл. */
                      /* Абсолют: бегущая строка шире карточки и не должна её растягивать. */
                      <div className="pricing-marquee absolute top-1/2 left-0 flex w-max -translate-y-1/2 gap-2 motion-reduce:animate-none">
                        {("chips" in tile ? [...tile.chips, ...tile.chips] : []).map((chip, position) => (
                          <span
                            key={`${chip}-${position}`}
                            className="border-shell-border-strong text-shell-fg rounded-full border px-3 py-1.5 text-sm whitespace-nowrap"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    ) : index === 1 ? (
                      <div className="relative grid size-20 place-items-center rounded-2xl bg-[light-dark(#f2f2f2,#151515)] text-[#ff5900] shadow-[0_20px_50px_-20px_rgba(255,89,0,0.45)] transition-transform duration-(--motion-slow) group-hover:-rotate-6">
                        <Lock
                          className="size-8 transition-opacity duration-(--motion-base) group-hover:opacity-0"
                          aria-hidden="true"
                        />
                        <LockOpen
                          className="absolute size-8 opacity-0 transition-opacity duration-(--motion-base) group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </div>
                    ) : (
                      <p className="text-shell-fg flex items-center gap-3 text-5xl font-semibold tracking-tight tabular-nums">
                        <span className="text-shell-muted line-through decoration-[#ff5900] decoration-2">
                          {FREE_MONTHLY_LIMIT}
                        </span>
                        <ArrowRight className="text-shell-muted size-6" aria-hidden="true" />
                        <InfinityIcon
                          className="size-12 text-[#ff5900] transition-transform duration-(--motion-slow) group-hover:scale-125"
                          aria-hidden="true"
                        />
                      </p>
                    )}
                  </div>
                  <div className="border-shell-border border-t p-6">
                    <h3 className="text-shell-fg flex items-center gap-2 text-lg font-semibold">
                      {index === 0 ? (
                        <Sparkles className="text-shell-accent-text size-4" aria-hidden="true" />
                      ) : null}
                      {tile.title}
                    </h3>
                    <p className="text-shell-muted mt-2 text-sm leading-relaxed">{tile.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Три шага */}
        <section className="pt-20 sm:pt-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>{t.stepsEyebrow}</Eyebrow>
            <h2 className="text-shell-fg mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {t.stepsTitle}
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {t.steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 120} className="h-full">
                <li className="border-shell-border flex h-full flex-col rounded-3xl border p-6">
                  <span className="text-shell-accent-text text-sm font-semibold tabular-nums">
                    0{index + 1}
                  </span>
                  <h3 className="text-shell-fg mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="text-shell-muted mt-2 text-sm leading-relaxed">{step.text}</p>
                  {index === 2 ? (
                    <p className="mt-auto pt-6">
                      <code className="pricing-type block w-fit max-w-full overflow-hidden rounded-lg bg-[light-dark(#f2f2f2,#151515)] px-3 py-2 font-mono text-xs whitespace-nowrap text-[light-dark(#151515,#f2f2f2)] motion-reduce:animate-none">
                        <span className="text-[#ff5900]">$</span> {t.snippet}
                      </code>
                    </p>
                  ) : null}
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <div className="pt-20 sm:pt-24">
          <Pricing011
            eyebrow={t.faqEyebrow}
            title={t.faqTitle}
            lede={t.faqLede}
            questions={[...t.faq]}
            contact={{
              text: t.contactText,
              label: t.contactLabel,
              href: localePath(locale, "/report"),
            }}
            accent={BRAND_ACCENT}
          />
        </div>

        {/* Финальный призыв: тёмная карточка с оранжевыми акцентами — тот же
            язык, что у PRO-карточки. Оранжевый как акцент, а не заливка. */}
        <Reveal className="pt-16 sm:pt-20">
          <section className="relative isolate overflow-hidden rounded-3xl bg-[#151515] px-6 py-12 text-center text-[#f2f2f2] shadow-[0_30px_80px_-30px_rgba(255,89,0,0.5)] ring-1 ring-[#ff5900]/60 sm:px-10 sm:py-16">
            <div
              className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-[#ff5900] to-transparent"
              aria-hidden="true"
            />
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {t.ctaTitle.split(/(PRO)/).map((part, index) =>
                part === "PRO" ? (
                  <span key={index} className="text-[#ff5900]">
                    PRO
                  </span>
                ) : (
                  part
                ),
              )}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-[#f2f2f2]/70">
              {t.ctaText}
            </p>
            <Link
              href={session ? catalogHref : signupHref}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#ff5900] px-6 text-sm font-semibold text-[#151515] transition-colors hover:bg-[#ff6a1a] focus-visible:ring-2 focus-visible:ring-[#ff5900] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151515] focus-visible:outline-none"
            >
              {session ? t.ctaButtonSigned : t.ctaButton}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </section>
        </Reveal>

        <p className="text-shell-muted mt-10 text-sm leading-relaxed">
          {t.legal}{" "}
          <Link
            href={localePath(locale, "/legal/offer")}
            className="text-shell-fg underline-offset-4 hover:underline"
          >
            {t.offer}
          </Link>{" "}
          {t.and}{" "}
          <Link
            href={localePath(locale, "/legal/privacy")}
            className="text-shell-fg underline-offset-4 hover:underline"
          >
            {t.privacy}
          </Link>
          .
        </p>
      </main>
    </CatalogShell>
  )
}
