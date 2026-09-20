import type { CSSProperties } from "react"

import { Navbar038 } from "@/registry/blocks/navbar/navbar-038/navbar-038"
import { Hero038 } from "@/registry/blocks/hero/hero-038/hero-038"
import { Delivery001 } from "@/registry/blocks/industry/delivery-001/delivery-001"
import { Delivery002 } from "@/registry/blocks/industry/delivery-002/delivery-002"
import { Delivery003 } from "@/registry/blocks/industry/delivery-003/delivery-003"
import { Delivery004 } from "@/registry/blocks/industry/delivery-004/delivery-004"
import { Download011 } from "@/registry/blocks/cta/download-011/download-011"
import { Delivery005 } from "@/registry/blocks/industry/delivery-005/delivery-005"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Footer037 } from "@/registry/blocks/footer/footer-037/footer-037"

/**
 * Сценарий «Доставка еды / дарк-китчен»: уголь, томат и сливки. Таймер
 * «привезём за 28:00» тикает в хиро, CSS-бургер собирается из слоёв,
 * меню с корзиной-полосой внизу, конструктор боула, карта зон, трекер
 * с курьером и стикеры-отзывы. Блоки общаются событиями vibeui-cart:*.
 */
export const metadata = {
  title: "Горячо — доставка еды за 28 минут",
  description:
    "Демо сценария «Доставка еды / дарк-китчен» VibeUI: хиро с живым таймером и CSS-бургером, меню с закреплённой корзиной, конструктор боула, карта зон доставки, трекер заказа, промо приложения, отзывы-стикеры и подвал.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#141414",
  color: "#fff4e6",
  fontFamily: '"Onest",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const hot = { tone: "dark", accent: "#ff3d2e", ink: "#fff4e6", background: "#141414" } as const

const PHOTOS = "/demo/delivery"

const FAQ = [
  { question: "Почему 28 минут, а не «от 30 до 60»?", answer: "Кухня одна, меню короткое, курьеры свои. Мы знаем, сколько готовится каждое блюдо и сколько ехать до каждого квартала. 28 — среднее по центру за последний месяц; в вашей зоне цифра будет на карте выше." },
  { question: "Что, если привезёте позже?", answer: "Если опоздали больше чем на 10 минут от обещанного времени в трекере — вернём стоимость доставки и подарим десерт к следующему заказу. Автоматически, без звонков в поддержку." },
  { question: "Еда приезжает горячей?", answer: "Готовим после оплаты, а не греем заготовки. Курьер везёт в термосумке с разделением горячего и холодного: бургер не парится, поке не греется." },
  { question: "Можно без лука / без глютена / без острого?", answer: "Да: в карточке блюда перед оплатой есть «убрать» для каждого ингредиента, а конструктор боула собирается вообще с нуля. Полный список аллергенов — в подвале сайта." },
  { question: "Как оплатить и есть ли минимальная сумма?", answer: "Картой, СБП или через приложение. Минимального заказа нет, но доставка бесплатна от 1 500 ₽ внутри ТТК и с любой суммы — в центре." },
]

export default function DeliveryDemo() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar038 {...hot} />
      <div id="top">
        <Hero038 {...hot} />
      </div>
      <div id="menu">
        <Delivery001 {...hot} />
      </div>
      <div id="builder">
        <Delivery002 {...hot} />
      </div>
      <div id="zones">
        <Delivery003 {...hot} />
      </div>
      <div id="tracker">
        <Delivery004 {...hot} />
      </div>
      <div id="app">
        <Download011 {...hot} image={`${PHOTOS}/promo.webp`} />
      </div>
      <div id="reviews">
        <Delivery005 {...hot} />
      </div>
      <div id="faq">
        <Faq023 {...hot} eyebrow="Вопросы" title="Спрашивают перед первым заказом" lede="Коротко о времени, температуре и составе. Остальное — в чате поддержки, отвечаем за пару минут." items={FAQ} contactLabel="Написать в поддержку" contactHref="#support" />
      </div>
      <Footer037 {...hot} />
    </div>
  )
}
