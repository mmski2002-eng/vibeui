import type { CSSProperties } from "react"

import { Navbar046 } from "@/registry/blocks/navbar/navbar-046/navbar-046"
import { Hero049 } from "@/registry/blocks/hero/hero-049/hero-049"
import { House001 } from "@/registry/blocks/industry/house-001/house-001"
import { House002 } from "@/registry/blocks/industry/house-002/house-002"
import { House003 } from "@/registry/blocks/industry/house-003/house-003"
import { House004 } from "@/registry/blocks/industry/house-004/house-004"
import { House005 } from "@/registry/blocks/industry/house-005/house-005"
import { Testimonials036 } from "@/registry/blocks/testimonials/testimonials-036/testimonials-036"
import { Faq025 } from "@/registry/blocks/faq/faq-025/faq-025"
import { Cta038 } from "@/registry/blocks/cta/cta-038/cta-038"
import { Footer045 } from "@/registry/blocks/footer/footer-045/footer-045"

/**
 * Сценарий «Дома из клеёного бруса»: тёмный кинематографичный сайт поверх
 * фото домов в сумерках, тёплый янтарь окон — единственный акцент. Слайдер
 * проектов с ценой, каталог с фильтром по площади, калькулятор передаёт
 * расчёт в заявку, балка бруса раскладывается на ламели при прокрутке,
 * этапы на липкой сцене, построенные дома лентой.
 */
export const metadata = {
  title: "Сосна — дома из клеёного бруса под ключ с фиксированной ценой",
  description:
    "Демо сценария «Дома из клеёного бруса» VibeUI: слайдер проектов, каталог с фильтром по площади, калькулятор стоимости, технология бруса, этапы стройки, построенные дома, отзывы владельцев, вопросы и заявка.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0e0f10",
  color: "#f2efe9",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Подача «мокапом»: за страницей размытое фото дома, секции лежат поверх
// отдельными скруглёнными карточками. overflow:clip, а не hidden — иначе
// перестали бы работать липкие сцены внутри блоков.
const card = "house-card relative mb-3 overflow-clip rounded-[1.75rem] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] sm:mb-4 sm:rounded-[2.25rem]"

const night = { tone: "dark", accent: "#e8a35c", ink: "#f2efe9" } as const

export default function HouseDemo() {
  return (
    <div style={page} className="relative min-h-dvh px-2 pt-2 pb-1 sm:px-4 sm:pt-4 lg:px-6">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-0">
        <img src="/demo/house/hero-01.webp" alt="" className="h-full w-full scale-110 object-cover blur-[6px] brightness-[0.45] saturate-[1.1]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent,rgb(8_9_10/0.85))]" />
      </div>
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.75rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}.house-nav{top:.5rem!important;border-radius:1.4rem}.house-nav[data-scrolled=true]{margin-inline:.5rem}.house-nav [data-part=progress]{left:1.4rem;width:calc(100% - 2.8rem)}.house-card::after{content:'';position:absolute;inset:0;z-index:30;padding:1px;border-radius:inherit;background:linear-gradient(170deg,rgb(255 255 255/.32),rgb(255 255 255/.06) 22%,transparent 55%,rgb(232 163 92/.28));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}@supports (animation-timeline:view()){@media (prefers-reduced-motion:no-preference){.house-card:not(#top){animation:house-rise linear both;animation-timeline:view();animation-range:entry 0% entry 40%}}}@keyframes house-rise{from{opacity:.25;transform:translateY(60px) scale(.965);filter:blur(4px)}}`}
      </style>
      <Navbar046 className="house-nav" {...night} />
      <div id="top" className={card}>
        <Hero049 {...night} />
      </div>
      <div id="projects" className={card}>
        <House001 {...night} />
      </div>
      <div id="calc" className={card}>
        <House002 {...night} />
      </div>
      <div id="tech" className={card}>
        <House003 {...night} />
      </div>
      <div id="stages" className={card}>
        <House004 {...night} />
      </div>
      <div id="built" className={card}>
        <House005 {...night} />
      </div>
      <div id="reviews" className={card}>
        <Testimonials036 {...night} />
      </div>
      <div id="faq" className={card}>
        <Faq025 {...night} />
      </div>
      <div id="contact" className={card}>
        <Cta038 {...night} />
      </div>
      <div className={card}>
        <Footer045 {...night} />
      </div>
    </div>
  )
}
