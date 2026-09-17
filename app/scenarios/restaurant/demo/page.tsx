import type { CSSProperties } from "react"

import { Navbar021 } from "@/registry/blocks/navbar/navbar-021/navbar-021"
import { Hero021 } from "@/registry/blocks/hero/hero-021/hero-021"
import { Restaurant003 } from "@/registry/blocks/restaurant/restaurant-003/restaurant-003"
import { About007 } from "@/registry/blocks/about/about-007/about-007"
import { Restaurant005 } from "@/registry/blocks/restaurant/restaurant-005/restaurant-005"
import { Contact016 } from "@/registry/blocks/contact/contact-016/contact-016"
import { Event004 } from "@/registry/blocks/events/event-004/event-004"
import { Testimonials017 } from "@/registry/blocks/testimonials/testimonials-017/testimonials-017"
import { Map005 } from "@/registry/blocks/map/map-005/map-005"
import { Footer020 } from "@/registry/blocks/footer/footer-020/footer-020"
import { Cta016 } from "@/registry/blocks/cta/cta-016/cta-016"

/**
 * Сценарий «Ресторан»: тёмная тема, свечи и медь. Одиннадцать блоков из
 * общих групп каталога плюс меню и галерея из restaurant; шапка лежит
 * прозрачной поверх первого экрана.
 * Витрина результата, не шаблон.
 */
export const metadata = {
  title: "Сойка — ресторан северной кухни",
  description:
    "Демо сценария «Ресторан» VibeUI: сайт ресторана с меню, шефом, галереей зала, бронью стола, событиями и картой.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#141110",
  color: "#f2ebe0",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const dark = { tone: "dark", background: "#141110", ink: "#f2ebe0", accent: "#7d2a3a" } as const

const PHOTOS = "/demo/restaurant"

const MENU = [
  {
    title: "Закуски",
    note: "Хлеб печём сами дважды в день",
    dishes: [
      { name: "Тартар из оленины", text: "можжевельник, желток, ржаные чипсы", price: "890 ₽", tags: ["шеф"], image: `${PHOTOS}/dish-02.webp` },
      { name: "Устрицы Хасанские", text: "3 шт., уксус с шалотом, лимон", price: "1 250 ₽", image: `${PHOTOS}/dish-05.webp` },
      { name: "Печёная свёкла", text: "козий сыр, фундук, мёд с чабрецом", price: "620 ₽", tags: ["вег"] },
      { name: "Сельдь и картофель", text: "укропное масло, лук в соке смородины", price: "540 ₽" },
    ],
  },
  {
    title: "Горячее",
    dishes: [
      { name: "Ладожский сиг", text: "копчёный картофель, соус из щавеля", price: "1 480 ₽", tags: ["шеф"], image: `${PHOTOS}/dish-01.webp` },
      { name: "Оленина на углях", text: "пюре из пастернака, брусника, ягель", price: "2 100 ₽" },
      { name: "Суп из лесных грибов", text: "сливки, масло из хвои, гренка", price: "690 ₽", tags: ["вег"], image: `${PHOTOS}/dish-03.webp` },
      { name: "Пельмени с щукой", text: "бульон даси, острое масло", price: "820 ₽", tags: ["острое"] },
    ],
  },
  {
    title: "Десерты",
    dishes: [
      { name: "Облепиха и меренга", text: "мёд, крем из козьего молока", price: "560 ₽", tags: ["шеф"], image: `${PHOTOS}/dish-04.webp` },
      { name: "Ржаной хлеб с мороженым", text: "карамель из чёрного хлеба", price: "490 ₽" },
      { name: "Морошка", text: "сорбет, сгущённое молоко, крошка", price: "520 ₽", tags: ["вег"] },
    ],
  },
  {
    title: "Бар",
    note: "Настойки — свои, по 60 мл",
    dishes: [
      { name: "Клюква и розмарин", text: "джин, клюква, розмариновый сироп", price: "650 ₽", image: `${PHOTOS}/dish-06.webp` },
      { name: "Хвойный сауэр", text: "водка на хвое, лимон, белок", price: "620 ₽" },
      { name: "Riesling Kabinett", text: "Мозель, бокал 150 мл", price: "650 ₽" },
      { name: "Настойка на морошке", text: "60 мл", price: "320 ₽" },
    ],
  },
]

const HALL = [
  { src: `${PHOTOS}/hall-01.webp`, aspect: "3 / 2", caption: "бар" },
  { src: `${PHOTOS}/hall-02.webp`, aspect: "2 / 3", caption: "у окна" },
  { src: `${PHOTOS}/hall-04.webp`, aspect: "1", caption: "сервировка" },
  { src: `${PHOTOS}/hall-03.webp`, aspect: "3 / 2", caption: "терраса" },
  { src: `${PHOTOS}/chef-hands.webp`, aspect: "1", caption: "кухня" },
  { src: `${PHOTOS}/hero.webp`, aspect: "2 / 3", caption: "зал" },
  { src: `${PHOTOS}/event.webp`, aspect: "3 / 2", caption: "джаз по пятницам" },
  { src: `${PHOTOS}/dish-05.webp`, aspect: "1", caption: "устричная среда" },
  { src: `${PHOTOS}/chef.webp`, aspect: "4 / 5", caption: "шеф" },
]

const EVENTS = [
  { day: "ср", when: "каждую неделю", time: "18:00–23:00", title: "Устричные среды", text: "Хасанские и дальневосточные устрицы по цене закупки, к ним — бокал мюскаде.", price: "650 ₽ / 6 шт.", actionLabel: "Занять стол", actionHref: "#book", image: `${PHOTOS}/dish-05.webp` },
  { day: "пт", when: "каждую неделю", time: "21:00", title: "Джаз у бара", text: "Трио Ильи Гордеева: стандарты и немного Северного модерна. Вход свободный, стол лучше держать заранее.", price: "вход свободный", actionLabel: "Забронировать", actionHref: "#book", image: `${PHOTOS}/event.webp` },
  { day: "сб–вс", when: "выходные", time: "11:00–16:00", title: "Бранч", text: "Сырники на ржаной муке, яйца с сигом, пирог дня и кофе без ограничений.", price: "1 900 ₽", actionLabel: "Меню бранча", actionHref: "#menu", image: `${PHOTOS}/dish-04.webp` },
  { day: "3 окт", when: "один вечер", time: "19:30", title: "Ужин с виноделом", text: "Шесть подач под вина «Усадьбы Дивноморское», за столом — сам винодел.", price: "7 500 ₽", actionLabel: "Осталось 6 мест", actionHref: "#book", image: `${PHOTOS}/dish-06.webp` },
]

const REVIEWS = [
  { quote: "Сиг с копчёным картофелем — лучшее, что я ела в городе за год. И свечи, и тишина, и никто не торопит.", name: "Мария К.", occasion: "ужин на двоих", source: "Яндекс Карты", rating: 5 },
  { quote: "Пришли на устричную среду, остались до закрытия. Бармен собрал сауэр под наш разговор, а не по карте.", name: "Илья и Саша", occasion: "среда", source: "Restoclub", rating: 5 },
  { quote: "Отмечали день рождения на двенадцать человек — дальний зал, своё меню, ни одной накладки.", name: "Анна Л.", occasion: "день рождения", source: "TripAdvisor", rating: 5 },
]

export default function Page() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar021
        {...dark}
        overlay
        brand="Сойка"
        brandHref="#"
        caption="Северная кухня · Петроградская"
        hours="Сегодня до 23:00"
        phone="+7 812 305-00-40"
        phoneHref="tel:+78123050040"
        actionLabel="Забронировать"
        actionHref="#book"
        links={[
          { label: "Меню", href: "#menu" },
          { label: "Шеф", href: "#chef" },
          { label: "Зал", href: "#hall" },
          { label: "События", href: "#events" },
          { label: "Контакты", href: "#map" },
        ]}
      />

      <div id="hero">
        <Hero021
          {...dark}
          image={`${PHOTOS}/hero.webp`}
          imageAlt="Зал ресторана вечером: свечи на дубовых столах, открытая кухня"
          eyebrow="Кухня · бар · терраса"
          lines={["Север на тарелке,", "тепло за *столом*"]}
          lede="Ладожский сиг, оленина и морошка в получасе от Невского. Открытая кухня, свечи и стол, за который хочется вернуться."
          primaryLabel="Забронировать стол"
          primaryHref="#book"
          secondaryLabel="Смотреть меню"
          secondaryHref="#menu"
          ticker={["Сезонное меню — осень", "Устрицы по средам", "Бранчи в выходные с 11:00", "Джаз по пятницам", "Терраса до конца сентября"]}
        />
      </div>

      <div id="menu">
        <Restaurant003
          {...dark}
          eyebrow="Меню"
          title="Что готовим этой осенью"
          lede="Меню меняется с сезоном. Рыба — с Ладоги, дичь — из Карелии, овощи — с ферм под Гатчиной. Наведите на блюдо — покажем его."
          sections={MENU}
          fullLabel="Полное меню в PDF"
          fullHref="#"
        />
      </div>

      <Cta016
        {...dark}
        label="Вино недели"
        title="Riesling Kabinett, Мозель, 2022"
        text="Сухой, минеральный, с яблоком и лаймом. К сигу и устрицам — идеально."
        price="650 ₽ / бокал"
        actionLabel="Смотреть бар"
        actionHref="#menu"
        image={`${PHOTOS}/dish-06.webp`}
      />

      <div id="chef">
        <About007
          {...dark}
          eyebrow="Шеф"
          quote="Я выросла на Ладоге. Всё, что мы готовим, — это попытка вернуть тот вкус: дым, лес и холодная вода."
          name="Анна Рябова"
          role="Шеф-повар и совладелица"
          text="Десять лет в Копенгагене и Хельсинки, потом — домой. Меню меняется четыре раза в год, рыба приходит с озера по вторникам и пятницам, хлеб печём на закваске, которой семь лет."
          facts={[
            { value: "18", label: "лет на кухне" },
            { value: "4", label: "сезонных меню в год" },
            { value: "2", label: "звезды гида «Где»" },
          ]}
          image={`${PHOTOS}/chef.webp`}
          imageAlt="Анна Рябова на кухне ресторана"
          imageSecondary={`${PHOTOS}/chef-hands.webp`}
        />
      </div>

      <div id="hall">
        <Restaurant005 {...dark} eyebrow="Зал" title="Свечи, дерево и вид на двор" lede="Сорок мест в зале, восемь у бара и терраса на лето. Столы для компаний до двенадцати — в дальнем зале." photos={HALL} />
      </div>

      <div id="book">
        <Contact016
          {...dark}
          background="#1a1614"
          eyebrow="Бронь"
          title="Оставьте стол за собой"
          lede="Подтверждаем в течение пятнадцати минут в рабочее время. Компании от восьми человек — по телефону."
          slots={["18:00", "18:30", "19:30", "20:00", "21:30"]}
          notes={["Стол держим 15 минут после брони", "С детьми — до 20:00, есть стулья", "Терраса открыта с мая по сентябрь"]}
          action=""
        />
      </div>

      <div id="events">
        <Event004 {...dark} eyebrow="События" title="Что бывает по вечерам" lede="Устрицы, джаз и ужины с виноделами. Столы на события держим по брони." events={EVENTS} />
      </div>

      <div id="reviews">
        <Testimonials017 {...dark} eyebrow="Отзывы" title="Что пишут после ужина" score="4,9" scoreLabel="по 640 отзывам на трёх площадках" image={`${PHOTOS}/hall-01.webp`} reviews={REVIEWS} />
      </div>

      <div id="map">
        <Map005
          {...dark}
          eyebrow="Как добраться"
          title="Большая Пушкарская, 20"
          address="Санкт-Петербург, Большая Пушкарская, 20, вход со двора"
          latitude={59.9585}
          longitude={30.3045}
          zoom={16}
          hours={[
            { days: "Пн–Чт", time: "12:00–23:00" },
            { days: "Пт–Сб", time: "12:00–01:00" },
            { days: "Вс", time: "11:00–22:00" },
          ]}
          details={["м. «Горьковская» — 7 минут пешком", "Парковка во дворе, 6 мест, по брони", "Вход со двора, арка слева от аптеки"]}
          phone="+7 812 305-00-40"
          phoneHref="tel:+78123050040"
        />
      </div>

      <div id="footer">
        <Footer020
          {...dark}
          background="#0e0c0b"
          brand="Сойка"
          caption="Северная кухня · Петроградская"
          address="Санкт-Петербург, Большая Пушкарская, 20, вход со двора"
          hours={[
            { days: "Пн–Чт", time: "12:00–23:00" },
            { days: "Пт–Сб", time: "12:00–01:00" },
            { days: "Вс", time: "11:00–22:00" },
          ]}
          phone="+7 812 305-00-40"
          phoneHref="tel:+78123050040"
          email="hello@soyka.spb.ru"
          messengersLabel="Бронь и вопросы"
          messengers={[
            { kind: "telegram", label: "Telegram", href: "https://t.me/" },
            { kind: "whatsapp", label: "WhatsApp", href: "https://wa.me/78123050040" },
            { kind: "max", label: "Max", href: "https://max.ru/", short: "M" },
          ]}
          linksLabel="Ещё"
          links={[
            { label: "Подарочные сертификаты", href: "#" },
            { label: "Банкеты и дальний зал", href: "#" },
            { label: "Вакансии", href: "#" },
            { label: "Политика конфиденциальности", href: "#" },
          ]}
          legal="© 2019–2026 ООО «Сойка». ИНН 7813000000. Меню не является публичной офертой."
        />
      </div>
    </div>
  )
}
