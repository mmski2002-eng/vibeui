import type { CSSProperties, ReactNode } from "react"

import { Sketch001 } from "@/registry/animations/sketch/sketch-001/sketch-001"
import { Sketch007 } from "@/registry/animations/sketch/sketch-007/sketch-007"
import { Sketch009 } from "@/registry/animations/sketch/sketch-009/sketch-009"
import { Sketch012 } from "@/registry/animations/sketch/sketch-012/sketch-012"
import { Sketch013 } from "@/registry/animations/sketch/sketch-013/sketch-013"
import { Sketch015 } from "@/registry/animations/sketch/sketch-015/sketch-015"
import { Sketch016 } from "@/registry/animations/sketch/sketch-016/sketch-016"
import { Sketch017 } from "@/registry/animations/sketch/sketch-017/sketch-017"
import { Sketch018 } from "@/registry/animations/sketch/sketch-018/sketch-018"
import { Sketch019 } from "@/registry/animations/sketch/sketch-019/sketch-019"
import { Sketch020 } from "@/registry/animations/sketch/sketch-020/sketch-020"
import { Sketch021 } from "@/registry/animations/sketch/sketch-021/sketch-021"
import { Sketch022 } from "@/registry/animations/sketch/sketch-022/sketch-022"
import { Sketch023 } from "@/registry/animations/sketch/sketch-023/sketch-023"
import { Surface025 } from "@/registry/blocks/background/surface-025/surface-025"

/**
 * Сценарий «Портфолио фотографа», собранный целиком из рукописной группы
 * sketch: светлая бумажная тема, один почерк на всю страницу. Это витрина
 * результата, а не шаблон: те же блоки человек ставит к себе командами.
 */
export const metadata = {
  title: "Аня Соколова — фотограф",
  description:
    "Демо сценария «Портфолио фотографа» VibeUI: сайт портретного и свадебного фотографа, собранный из рукописных блоков каталога.",
}

const ACCENT = "#c2410c"
const INK = "#1c1917"
const PAPER = "#faf7f2"
const FONT = '"Neucha","Caveat","Segoe Print","Bradley Hand",cursive'
const DISPLAY = '"Caveat","Neucha","Segoe Print",cursive'
const FONTS = "https://fonts.googleapis.com/css2?family=Neucha&family=Caveat:wght@400..700&display=swap"

const sketch = {
  tone: "light",
  accent: ACCENT,
  ink: INK,
  rough: "loose",
  boil: "soft",
} as const

// Клетку даёт surface-025; секции отдают свой бумажный фон прозрачным,
// чтобы она шла сквозь всю страницу. Белые карточки и липкая шапка — поверх.
const page: CSSProperties = {
  colorScheme: "light",
  color: INK,
  fontFamily: FONT,
}

/** Бумажный фон блока — прозрачный: клетка страницы видна сквозь него. */
const onGrid = (name: string) => ({ [`--vibeui-sketch-${name}-paper`]: "transparent" }) as CSSProperties

const PHOTOS = "/demo/photographer"

const WORKS = [
  { title: "Лиза и Марк, Ладога", category: "Свадьба", image: `${PHOTOS}/work-01.webp`, orientation: "portrait" },
  { title: "Портрет для обложки", category: "Портрет", image: `${PHOTOS}/work-02.webp`, orientation: "portrait" },
  { title: "Семья Ивановых, дача", category: "Семья", image: `${PHOTOS}/work-03.webp`, orientation: "landscape" },
  { title: "Утро на Васильевском", category: "Улица", image: `${PHOTOS}/work-04.webp`, orientation: "landscape" },
  { title: "Анна, актриса", category: "Портрет", image: `${PHOTOS}/work-05.webp`, orientation: "portrait" },
  { title: "Регистрация в Пушкине", category: "Свадьба", image: `${PHOTOS}/work-06.webp`, orientation: "landscape" },
  { title: "Даня, 6 месяцев", category: "Семья", image: `${PHOTOS}/work-07.webp`, orientation: "portrait" },
  { title: "Дождь на Невском", category: "Улица", image: `${PHOTOS}/work-08.webp`, orientation: "landscape" },
] as const

const STEPS = [
  { title: "Знакомство", text: "Полчаса по телефону или за кофе: кто вы, зачем фото, чего боитесь в кадре." },
  { title: "Идея и место", text: "Подбираю место под вас: набережная, ваша кухня, дача. Присылаю референсы и что надеть." },
  { title: "Съёмка", text: "Час-два. Я говорю, вы отвечаете, камера сама. Позировать не надо." },
  { title: "Отбор и ретушь", text: "Из 300 кадров выбираю живые, ретуширую свет и мусор, кожу оставляю вашей." },
  { title: "Альбом", text: "Через 7–10 дней ссылка на галерею, через месяц — печатный альбом по почте." },
]

const PACKAGES = [
  { title: "Портрет", price: "12 000 ₽", text: "Час съёмки в городе или студии, 30 кадров в ретуши, готово за неделю." },
  { title: "Семья", price: "18 000 ₽", text: "Два часа на природе или дома, 50 кадров, слайдшоу для бабушек." },
  { title: "Свадьба", price: "от 60 000 ₽", text: "Весь день от сборов до танцев, 400+ кадров, альбом в подарок." },
]

const QUOTES = [
  { text: "Мы стеснялись камеры, а через десять минут забыли про неё. На фото мы настоящие.", author: "Лиза и Марк" },
  { text: "Аня поймала момент, когда сын впервые засмеялся. Этот кадр висит у нас в прихожей.", author: "Ольга" },
  { text: "Портрет получился без «фотошопной» кожи. Наконец-то это я, а не кукла.", author: "Анна, актриса" },
]

function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-18">
      {children}
    </section>
  )
}

function Heading({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl" style={{ fontFamily: DISPLAY }}>
        {children}
      </h2>
      {note ? <p className="mt-3 text-lg leading-relaxed opacity-70">{note}</p> : null}
    </div>
  )
}

export default function Page() {
  return (
    <Surface025 tone="light" pattern="grid" cell={24} strength="soft" paper={PAPER} style={page} className="min-h-dvh">
      <link rel="stylesheet" href={FONTS} precedence="medium" />

      <Sketch019
        {...sketch}
        brand="Аня Соколова"
        brandHref="#"
        caption="портретный и свадебный фотограф · Петербург"
        links={[
          { label: "Работы", href: "#works" },
          { label: "Как проходит съёмка", href: "#process" },
          { label: "Обо мне", href: "#about" },
          { label: "Цены", href: "#pricing" },
        ]}
        actionLabel="Записаться"
        actionHref="#book"
      />

      <div id="hero">
      <Sketch016
        {...sketch}
        style={onGrid("016")}
        eyebrow="Портретный и свадебный фотограф · Петербург"
        title="Снимаю людей,"
        titleAccent="а не позы"
        lede="Без «улыбнитесь на счёт три». Час разговора, немного прогулки — и на карточках вы такие, какими вас видят близкие."
        primaryLabel="Записаться"
        primaryHref="#book"
        secondaryLabel="Смотреть работы"
        secondaryHref="#works"
        image={`${PHOTOS}/hero.webp`}
        imageAlt="Аня с плёночной камерой на набережной Невы"
        imageCaption="Нева, май, плёнка"
        arrowLabel="это я"
      />
      </div>

      <Sketch018
        {...sketch}
        labels={["работы", "как проходит", "обо мне", "отзывы", "цены", "запись"]}
        doodles={[
          ["film", "frame"],
          ["coffee", "clock"],
          ["glasses", "lens"],
          ["heart", "chat"],
          ["coin", "tag"],
          ["phone", "calendar"],
        ]}
      >
        <div id="works">
          <Sketch017 {...sketch} style={onGrid("017")} title="Восемь историй из трёхсот" allLabel="Все" works={[...WORKS]} />
        </div>

        <Section id="process">
          <div className="mb-8">
            <Sketch013 {...sketch} text="как это устроено" />
          </div>
          <div className="absolute top-24 right-8 hidden lg:block">
            <Sketch023 {...sketch} text="перенос по погоде — бесплатно" pin="tape" tilt={4} />
          </div>
          <Heading note="Никаких сюрпризов: от первого сообщения до альбома ровно пять шагов.">
            Как проходит <Sketch009 {...sketch} kind="highlight" text="съёмка" />
          </Heading>
          <Sketch012 {...sketch} steps={STEPS.map((step) => step.title)} current={2} />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, index) => (
              <Sketch007 key={step.title} {...sketch} seed={100 + index} title={`${index + 1}. ${step.title}`} text={step.text} className="!max-w-none" />
            ))}
          </div>
        </Section>

        <div id="about">
          <Sketch020
            {...sketch}
            style={onGrid("020")}
            eyebrow="Обо мне"
            title="Семь лет снимаю людей, которые не любят сниматься"
            paragraphs={[
              "Начинала с репортажей для городской газеты, поэтому не жду «правильного» света и не расставляю руки. Ловлю то, что уже происходит.",
              "Снимаю на плёнку и цифру, ретуширую сама и без «пластика»: веснушки и морщинки остаются на месте.",
            ]}
            image={`${PHOTOS}/about.webp`}
            imageAlt="Аня в домашней студии разбирает отпечатки"
            imageCaption="домашняя студия, ноябрь"
            points={["Без поз и «улыбнитесь»", "Плёнка и цифра, ретушь без пластика", "Готово за 10 дней, альбом за месяц"]}
            stats={[
              { value: "300+", label: "съёмок" },
              { value: "48", label: "свадеб" },
              { value: "7 лет", label: "с камерой" },
              { value: "10 дней", label: "до готовых фото" },
            ]}
          />
        </div>

        <Section id="reviews">
          <div className="absolute top-12 right-10 hidden lg:block">
            <Sketch023 {...sketch} text="это настоящие люди, не стоковые" pin="tape" tilt={3} paper="#e6f1e2" />
          </div>
          <Heading>Что говорят после</Heading>
          <div className="grid gap-8 md:grid-cols-3">
            {QUOTES.map((quote) => (
              <Sketch015 key={quote.author} {...sketch} text={quote.text} author={quote.author} />
            ))}
          </div>
        </Section>

        <Section id="pricing">
          <div className="mb-8">
            <Sketch013 {...sketch} text="цены" />
          </div>
          <div className="absolute top-20 right-8 hidden lg:block">
            <Sketch023 {...sketch} text="свободные даты — май и июнь" pin="pin" tilt={-5} paper="#ffe8d6" />
          </div>
          <Heading note="Предоплата 30 %, остальное после съёмки. Перенос по погоде бесплатный.">
            Три формата, без мелкого шрифта
          </Heading>
          <div className="grid gap-6 sm:grid-cols-3">
            {PACKAGES.map((item) => (
              <Sketch007 key={item.title} {...sketch} title={item.title} text={item.text}>
                <p className="mb-4 text-4xl font-bold" style={{ color: ACCENT, fontFamily: DISPLAY }}>
                  {item.price}
                </p>
                <p className="mb-5 leading-snug opacity-75">{item.text}</p>
                <Sketch001 {...sketch} variant="solid" label="Выбрать" />
              </Sketch007>
            ))}
          </div>
        </Section>

        <div id="book">
          <Sketch021
            {...sketch}
            style={onGrid("021")}
            eyebrow="Запись"
            title="Выберите день, я перезвоню"
            description="Пятнадцать минут по телефону: обсудим идею, место и что взять с собой."
            submitLabel="Записаться"
            footNote="Отвечаю в тот же день. Переносы без вопросов."
          />
        </div>
      </Sketch018>

      <div id="footer">
      <Sketch022
        {...sketch}
        style={onGrid("022")}
        image={`${PHOTOS}/next.webp`}
        imageAlt="Свадьба у костра на берегу Ладоги"
        kicker="Следующая история"
        title="Лиза и Марк. Ладога, июнь"
        note="свадьба на два дня, без тамады и с костром"
        href="#works"
        linkLabel="смотреть →"
        studioName="Аня Соколова"
        contactLabel="Написать"
        contactHref="#book"
        links={[
          { label: "Телеграм", href: "https://t.me/" },
          { label: "Инстаграм", href: "https://instagram.com/" },
        ]}
        legal="© 2026 Аня Соколова. Фото не для перепечатки."
      />
      </div>
    </Surface025>
  )
}
