import type { CSSProperties } from "react"

import { Navbar040 } from "@/registry/blocks/navbar/navbar-040/navbar-040"
import { Hero040 } from "@/registry/blocks/hero/hero-040/hero-040"
import { Fintech001 } from "@/registry/blocks/fintech/fintech-001/fintech-001"
import { Bento009 } from "@/registry/blocks/bento/bento-009/bento-009"
import { Fintech002 } from "@/registry/blocks/fintech/fintech-002/fintech-002"
import { Fintech003 } from "@/registry/blocks/fintech/fintech-003/fintech-003"
import { Pricing032 } from "@/registry/blocks/pricing/pricing-032/pricing-032"
import { Logocloud014 } from "@/registry/blocks/logos/logocloud-014/logocloud-014"
import { Testimonials032 } from "@/registry/blocks/testimonials/testimonials-032/testimonials-032"
import { Download013 } from "@/registry/blocks/downloads/download-013/download-013"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Footer032 } from "@/registry/blocks/footer/footer-032/footer-032"

/**
 * Сценарий «Финтех / банк для малого бизнеса»: сайт ведёт себя как
 * приложение — карта на первом экране поворачивается за курсором и по ней
 * бегут операции, дашборд рисует график при появлении, калькулятор считает
 * экономию, секция безопасности проводит карту сквозь четыре слоя защиты по
 * прокрутке. Индиго и северное сияние, стекло, ни одной фотографии.
 */
export const metadata = {
  title: "Ось — банк для малого бизнеса: счёт за 10 минут, переводы без комиссии",
  description:
    "Демо сценария «Финтех / банк для малого бизнеса» VibeUI: 3D-карта за курсором, живой баланс с графиком, bento возможностей, калькулятор экономии, безопасность по прокрутке, тарифы с ползунком сотрудников, интеграции бегущей строкой, отзывы, QR приложения, вопросы и подвал с лицензией.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#07091a",
  color: "#e8ecf8",
  fontFamily: '"Inter Tight",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const aurora = { tone: "dark", accent: "#4ade80", ink: "#e8ecf8", background: "#07091a" } as const

const FAQ = [
  { question: "Как быстро откроете счёт?", answer: "Заявка — 5 минут в приложении, реквизиты выдаём сразу, полноценный счёт — после проверки, обычно за 10 минут в рабочее время. Курьер привезёт карту и документы на следующий день." },
  { question: "Что нужно для открытия?", answer: "ИП — паспорт и ИНН. ООО — паспорт директора, ИНН и ОГРН. Ни справок, ни печатей: остальное мы возьмём из открытых реестров." },
  { question: "Правда ли переводы по СБП бесплатные?", answer: "Да, на всех тарифах и без ограничений по сумме. Платёжки по реквизитам — бесплатно в пределах лимита операций тарифа, дальше 25 ₽ за платёж." },
  { question: "Как считаются налоги?", answer: "Мы видим ваши поступления и режим (УСН «Доходы», «Доходы минус расходы», патент), поэтому сумма аванса и взносов копится сама. За неделю до срока напомним, заплатить можно в один тап." },
  { question: "Застрахованы ли деньги?", answer: "Средства ИП и малых предприятий застрахованы АСВ до 1,4 млн ₽. Ось работает по лицензии Банка России № 3538." },
  { question: "Можно ли подключить бухгалтера?", answer: "Да, бесплатно на всех тарифах: бухгалтер получает доступ к выпискам и документам без права распоряжаться деньгами." },
]

export default function FintechDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.2rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar040 {...aurora} />
      <div id="top">
        <Hero040 {...aurora} />
      </div>
      <div id="dashboard">
        <Fintech001 {...aurora} />
      </div>
      <div id="features">
        <Bento009 {...aurora} />
      </div>
      <div id="calc">
        <Fintech002 {...aurora} />
      </div>
      <div id="security">
        <Fintech003 {...aurora} />
      </div>
      <div id="pricing">
        <Pricing032 {...aurora} />
      </div>
      <div id="integrations">
        <Logocloud014 {...aurora} />
      </div>
      <div id="reviews">
        <Testimonials032 {...aurora} />
      </div>
      <div id="app">
        <Download013 {...aurora} />
      </div>
      <div id="faq">
        <Faq023 {...aurora} eyebrow="Вопросы" title="Что спрашивают перед открытием счёта" lede="Короткие ответы на то, что обычно уточняют у менеджера. Подробнее — в тарифах и документах." items={FAQ} contactLabel="Спросить в чате" contactHref="#contact" />
      </div>
      <Footer032
        {...aurora}
        brand="Ось"
        caption="Банк для малого бизнеса. Лицензия Банка России № 3538 от 12.03.2024. Участник системы страхования вкладов."
        status="Все системы работают · 99,98 % за 90 дней"
        statusHref="#status"
        columns={[
          { title: "Продукт", links: [{ label: "Возможности", href: "#features" }, { label: "Экономия", href: "#calc" }, { label: "Безопасность", href: "#security" }, { label: "Тарифы", href: "#pricing" }] },
          { title: "Бизнесу", links: [{ label: "ИП и самозанятым", href: "#open" }, { label: "ООО", href: "#open" }, { label: "Маркетплейсам", href: "#integrations" }, { label: "Бухгалтерам", href: "#faq" }] },
          { title: "Компания", links: [{ label: "О банке", href: "#about" }, { label: "Раскрытие информации", href: "#disclosure" }, { label: "Вакансии", href: "#jobs" }, { label: "Пресса", href: "#press" }] },
        ]}
        socials={[{ label: "Telegram", href: "#" }, { label: "VK", href: "#" }, { label: "Дзен", href: "#" }]}
        legal={[{ label: "Тарифы и документы", href: "#docs" }, { label: "Политика конфиденциальности", href: "#privacy" }, { label: "Условия обслуживания", href: "#terms" }]}
        copyright="© 2026 АО «Ось Банк»"
      />
    </div>
  )
}
