import type { CSSProperties } from "react"

import { Navbar020 } from "@/registry/blocks/navbar/navbar-020/navbar-020"
import { Hero020 } from "@/registry/blocks/hero/hero-020/hero-020"
import { Realty003 } from "@/registry/blocks/industry/realty-003/realty-003"
import { Realty005 } from "@/registry/blocks/industry/realty-005/realty-005"
import { Realty006 } from "@/registry/blocks/industry/realty-006/realty-006"
import { Contact015 } from "@/registry/blocks/contact/contact-015/contact-015"
import { People007 } from "@/registry/blocks/team/people-007/people-007"
import { Testimonials016 } from "@/registry/blocks/testimonials/testimonials-016/testimonials-016"
import { Map004 } from "@/registry/blocks/map/map-004/map-004"
import { Faq016 } from "@/registry/blocks/faq/faq-016/faq-016"
import { Footer019 } from "@/registry/blocks/footer/footer-019/footer-019"

/**
 * Сценарий «Агентство недвижимости»: светлая песочная тема, серифные
 * заголовки, латунный акцент. Двенадцать блоков: шапка, первый экран, подвал и остальное
 * из общих групп каталога плюс четыре предметных из realty, включая Яндекс
 * Карту районов. Витрина результата, не шаблон.
 */
export const metadata = {
  title: "Дом на Неве — агентство недвижимости",
  description:
    "Демо сценария «Агентство недвижимости» VibeUI: сайт агентства с поиском, подборкой объектов, картой районов, ипотечным калькулятором и оценкой квартиры.",
}

const page: CSSProperties = {
  colorScheme: "light",
  background: "#f3ede3",
  color: "#173b2e",
  fontFamily: '"Manrope",ui-sans-serif,system-ui,sans-serif',
}

// Тема страницы: блоки каталога по умолчанию нейтральные, цвета задаёт сценарий.
const realty = { tone: "light", background: "#f3ede3", ink: "#173b2e", accent: "#b8925a" } as const
// Инверсные секции: чернильно-зелёная плита со светлым текстом.
const realtyDark = { ...realty, background: "#173b2e", ink: "#eef0ea" } as const

const PHOTOS = "/demo/realty"

const LISTINGS = [
  { title: "Двушка с зелёной кухней на Петроградской", price: "18 900 000 ₽", kind: "Квартиры", area: "64 м²", rooms: "2 комнаты", floor: "4 из 6", district: "Петроградская", metro: "Чкаловская, 7 мин", badge: "эксклюзив", image: `${PHOTOS}/object-01.webp`, imageHover: `${PHOTOS}/object-02.webp`, text: "Кухня-гостиная 24 м² с окнами во двор, две изолированные спальни, свежий ремонт 2024 года.", features: ["Дом 1912 года, капремонт 2019", "Потолки 3,4 м, паркет ёлочкой", "Закрытый двор, кладовая в подвале"] },
  { title: "Дом-эркер на тихой улице", price: "31 500 000 ₽", kind: "Квартиры", area: "112 м²", rooms: "3 комнаты", floor: "2 из 5", district: "Центральный", metro: "Владимирская, 9 мин", image: `${PHOTOS}/object-02.webp`, imageHover: `${PHOTOS}/object-04.webp`, text: "Три комнаты с эркером на юг, кабинет в бывшей гардеробной, окна на липовую аллею.", features: ["Лепнина и печи сохранены", "Две ванные, гардеробная", "Парковка во дворе"] },
  { title: "Студия с видом на закат", price: "9 200 000 ₽", kind: "Новостройки", area: "31 м²", rooms: "студия", floor: "19 из 24", district: "Приморский", metro: "Беговая, 12 мин", badge: "новостройка", image: `${PHOTOS}/object-03.webp`, text: "Угловая студия с панорамным остеклением, кухня в нише, отделка white box от застройщика.", features: ["Сдача в 4 квартале 2026", "Ипотека от 6 % по программе", "Паркинг и кладовые в доме"] },
  { title: "Спальня с лепниной, окна во двор", price: "22 400 000 ₽", kind: "Квартиры", area: "78 м²", rooms: "3 комнаты", floor: "3 из 4", district: "Центральный", metro: "Чернышевская, 6 мин", image: `${PHOTOS}/object-04.webp`, text: "Тихая трёшка на третьем этаже: спальня с лепниной, детская и гостиная с камином.", features: ["Дом 1898 года, лифт", "Два санузла", "Школа и сад во дворе"] },
  { title: "Таунхаус с садом и террасой", price: "27 000 000 ₽", kind: "Дома", area: "148 м²", rooms: "4 комнаты", district: "Курортный", metro: "Сестрорецк, ж/д", badge: "срочно", image: `${PHOTOS}/object-05.webp`, text: "Двухэтажный таунхаус с участком четыре сотки, террасой и отдельным входом.", features: ["Газ, вода, канализация центральные", "Гараж на две машины", "До залива 10 минут пешком"] },
  { title: "Пентхаус с террасой над крышами", price: "64 000 000 ₽", kind: "Квартиры", area: "164 м²", rooms: "4 комнаты", floor: "7 из 7", district: "Центральный", metro: "Адмиралтейская, 5 мин", image: `${PHOTOS}/object-06.webp`, text: "Последний этаж с террасой 60 м², видом на купол собора и своим лифтом.", features: ["Потолки 4,2 м", "Панорамные окна на три стороны", "Две парковки в закрытом дворе"] },
] as const

const DISTRICTS = [
  { name: "Петроградская", price: "285 тыс ₽", count: "164 объекта", note: "модерн, тихие дворы, 10 минут до центра", image: `${PHOTOS}/district-01.webp`, latitude: 59.9632, longitude: 30.3117, href: "#objects" },
  { name: "Васильевский", price: "240 тыс ₽", count: "128 объектов", note: "набережные, линии, тихо вечером", image: `${PHOTOS}/district-02.webp`, latitude: 59.9412, longitude: 30.2626, href: "#objects" },
  { name: "Центральный", price: "310 тыс ₽", count: "402 объекта", note: "парадные, лепнина, лучшие школы", image: `${PHOTOS}/district-03.webp`, latitude: 59.9343, longitude: 30.3462, href: "#objects" },
  { name: "Приморский", price: "205 тыс ₽", count: "356 объектов", note: "новостройки у залива, парки", image: `${PHOTOS}/district-04.webp`, latitude: 59.9989, longitude: 30.2632, href: "#objects" },
] as const

const AGENTS = [
  { name: "Марина Лебедева", role: "Руководитель. Исторический фонд, центр", fact: "18 лет в сделках", image: `${PHOTOS}/agent-01.webp`, phone: "+7 812 240-00-41", phoneHref: "tel:+78122400041", chatLabel: "Написать", chatHref: "#valuation" },
  { name: "Илья Громов", role: "Новостройки и ипотека, все программы банков", fact: "412 сделок", image: `${PHOTOS}/agent-02.webp`, phone: "+7 812 240-00-42", phoneHref: "tel:+78122400042", chatLabel: "Написать", chatHref: "#valuation" },
  { name: "Ксения Орлова", role: "Аренда и продажа: Петроградская, Васильевский", fact: "26 дней до сделки", image: `${PHOTOS}/agent-03.webp`, phone: "+7 812 240-00-43", phoneHref: "tel:+78122400043", chatLabel: "Написать", chatHref: "#valuation" },
  { name: "Андрей Фёдоров", role: "Юрист. История квартиры, долги, собственники", fact: "0 оспоренных сделок", image: `${PHOTOS}/agent-04.webp`, phone: "+7 812 240-00-44", phoneHref: "tel:+78122400044", chatLabel: "Почта", chatHref: "mailto:law@domnaneve.ru" },
]

const REVIEWS = [
  { quote: "Продали двушку за 26 дней и дороже, чем оценивали соседние агентства. Все звонки и показы взяла на себя Ксения, мы только подписали.", name: "Ольга и Сергей", deal: "продали квартиру на Петроградской", source: "Яндекс Карты", rating: 5 },
  { quote: "Илья нашёл ипотечную программу на два процента ниже той, что предлагал наш банк. За год это больше двухсот тысяч.", name: "Дмитрий", deal: "купил студию в Приморском", source: "Google", rating: 5 },
  { quote: "Квартира была с долгом по капремонту и прописанным родственником. Андрей всё вычистил до сделки, мы ничего не заметили.", name: "Анна", deal: "купила трёшку в центре", source: "Авито", rating: 5 },
]

const FAQ = [
  { question: "Сколько стоят ваши услуги?", answer: "При покупке — 2 % от цены, при продаже — 3 %, но не меньше 150 000 ₽. Оплата после регистрации сделки, никаких авансов." },
  { question: "Можно ли продать квартиру с ипотекой?", answer: "Да. Гасим ипотеку деньгами покупателя через аккредитив или переводим кредит на него — банк соглашается в 9 случаях из 10." },
  { question: "Как проходит проверка квартиры?", answer: "Юрист поднимает историю переходов права, долги, прописанных, банкротство продавца и супругов. Заключение письменное, за него отвечаем." },
  { question: "Работаете ли с новостройками?", answer: "Со всеми застройщиками города по их прайсу: комиссию платит застройщик, для вас подбор и сделка бесплатны." },
  { question: "Что если квартира не продастся за 30 дней?", answer: "Пересматриваем цену и стратегию вместе с вами. Договор можно расторгнуть в любой момент без штрафов." },
]

export default function Page() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:5.5rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar020
        {...realty}
        brand="Дом на Неве"
        brandHref="#"
        caption="Агентство недвижимости · Петербург"
        phone="+7 812 240-00-40"
        phoneHref="tel:+78122400040"
        actionLabel="Оценить квартиру"
        actionHref="#valuation"
        links={[
          { label: "Объекты", href: "#objects" },
          { label: "Районы", href: "#districts" },
          { label: "Как мы работаем", href: "#process" },
          { label: "Ипотека", href: "#mortgage" },
          { label: "Агенты", href: "#agents" },
        ]}
      />

      <div id="hero">
        <Hero020
          {...realty}
          image={`${PHOTOS}/hero.webp`}
          imageAlt="Гостиная квартиры в историческом доме с видом на Неву"
          eyebrow="Петербург · с 2007 года"
          title="Квартира, в которую хочется вернуться"
          lede="Подбираем жильё в Петербурге под ваш бюджет и ритм жизни: от студии у метро до дома с садом. Проверяем каждый объект юристом."
          modes={["Купить", "Снять"]}
          types={["Квартира", "Дом", "Новостройка", "Коммерческая"]}
          districts={["Любой район", "Центральный", "Петроградская", "Васильевский", "Приморский"]}
          budgets={["Любой бюджет", "до 10 млн", "10–20 млн", "20–40 млн", "от 40 млн"]}
          submitLabel="Найти"
          action="#objects"
          stats={[
            { value: "1 240", label: "объектов в базе" },
            { value: "18 лет", label: "на рынке" },
            { value: "3 офиса", label: "в городе" },
          ]}
        />
      </div>

      <div id="objects">
        <Realty003
          {...realty}
          eyebrow="Подборка недели"
          title="Объекты, за которые мы ручаемся"
          lede="Каждый объект агент видел сам, а юрист проверил до публикации. Наведите на фото — второй ракурс, нажмите — карточка раскроется в окно."
          allLabel="Все"
          moreLabel="Все объекты"
          moreHref="#valuation"
          listings={[...LISTINGS]}
        />
      </div>

      <div id="districts">
        <Map004
          {...realty}
          eyebrow="Районы"
          title="Где вы будете жить"
          lede="Средняя цена метра и живые объекты по районам — на настоящей карте города."
          zoom={11}
          points={[...DISTRICTS]}
        />
      </div>

      <div id="process">
        <Realty005 {...realtyDark} />
      </div>

      <div id="mortgage">
        <Realty006
          {...realty}
          eyebrow="Ипотека"
          title="Сколько это в месяц"
          lede="Считаем по аннуитетной формуле, как банки. Точную ставку под вашу программу подберёт Илья."
          price={18900000}
          downPercent={20}
          years={20}
          rate={16.5}
          actionLabel="Подобрать программу"
          actionHref="#valuation"
        />
      </div>

      <div id="agents">
        <People007
          {...realty}
          eyebrow="Команда"
          title="Четыре человека, которые ведут вашу сделку"
          lede="Один агент от первого звонка до ключей. Юрист подключается к каждой сделке, а не по запросу."
          agents={AGENTS}
        />
      </div>

      <div id="reviews">
        <Testimonials016
          {...realty}
          eyebrow="Отзывы"
          title="Что говорят после сделки"
          lede="Отзывы с открытых площадок, где их нельзя отредактировать."
          score="4,9"
          scoreLabel="средняя оценка по 312 отзывам"
          reviews={REVIEWS}
        />
      </div>

      <div id="faq">
        <Faq016 {...realty} eyebrow="Вопросы" title="Что спрашивают перед первой встречей" items={FAQ} noteLabel="Не нашли ответ? Спросите" noteHref="#valuation" />
      </div>

      <div id="valuation">
        <Contact015
          {...realty}
          image={`${PHOTOS}/office.webp`}
          imageAlt="Офис агентства на первом этаже исторического дома"
          action=""
        />
      </div>

      <div id="footer">
        <Footer019
          {...realtyDark}
          brand="Дом на Неве"
          caption="Агентство недвижимости · Петербург"
          address="Санкт-Петербург, наб. реки Фонтанки, 24, первый этаж"
          hours="Ежедневно 10:00–20:00, показы по договорённости"
          phone="+7 812 240-00-40"
          phoneHref="tel:+78122400040"
          email="hello@domnaneve.ru"
          messengersLabel="Напишите, где удобно"
          messengers={[
            { kind: "telegram", label: "Telegram", href: "https://t.me/" },
            { kind: "whatsapp", label: "WhatsApp", href: "https://wa.me/78122400040" },
            { kind: "max", label: "Max", href: "https://max.ru/", short: "M" },
            { kind: "vk", label: "ВКонтакте", href: "https://vk.com/" },
          ]}
          links={[
            { label: "Политика конфиденциальности", href: "#" },
            { label: "Договор оферты", href: "#" },
          ]}
          legal="© 2007–2026 ООО «Дом на Неве». Лицензия РГР № 0412. Не оферта."
        />
      </div>
    </div>
  )
}
