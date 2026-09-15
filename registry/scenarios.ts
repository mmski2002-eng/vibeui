import { getCatalogItem } from "@/registry/index"

/**
 * Сценарии — готовые страницы, собранные из блоков каталога, и рецепт «из
 * чего», без вариантов.
 *
 * Человек приходит с задачей («сайт фотографа»), а не с нашей таксономией.
 * Сценарий показывает результат целиком (демо-страница), перечисляет, какие
 * именно блоки и с какими пропсами в нём стоят, и отдаёт агенту одну
 * ссылку: команды установки всех блоков плюс исходник страницы — композиция
 * и есть инструкция.
 *
 * Сценарий ничего не устанавливает сам и не является `kind: "template"`:
 * ставятся сами блоки, своими обычными командами. Источник правды — файл
 * демо-страницы (`source`): и рецепт, и бриф для агента генерируются из
 * него, поэтому разойтись они не могут. Список секций ведётся руками:
 * роли на странице — решение автора, из кода их не вывести.
 */

export type ScenarioSection = {
  /** Имя item'а каталога. */
  item: string
  /** Роль на странице: «Первый экран», а не «hero». */
  role: string
  roleEn: string
  /** Зачем здесь именно это. Одна строка. */
  note?: string
  noteEn?: string
  /** Якорь секции в демо, где стоит блок. Пусто — верх страницы. */
  anchor?: string
}

export type Scenario = {
  slug: string
  label: string
  en: string
  /** Что это за сайт, одним предложением. */
  summary: string
  summaryEn: string
  /** Адрес демо-страницы на сайте. */
  demo: string
  /** Файл демо-страницы относительно корня репозитория. */
  source: string
  /** Файл с промптами картинок относительно корня репозитория. */
  images?: string
  /** Общие правила страницы: одна тема и палитра на все блоки. */
  theme: {
    tone: "light" | "dark"
    accent: string
    ink: string
    font: string
  }
  sections: ScenarioSection[]
}

export const SCENARIOS: Scenario[] = [
  {
    slug: "photographer",
    label: "Портфолио фотографа",
    en: "Photographer portfolio",
    summary:
      "Сайт портретного и свадебного фотографа: работы с фильтром по жанрам, как проходит съёмка, обо мне, отзывы, цены и запись на звонок. Всё нарисовано от руки на бумажном фоне.",
    summaryEn:
      "A portrait and wedding photographer's site: work filtered by genre, how a shoot goes, about, reviews, prices and call booking. Everything hand-drawn on a paper background.",
    demo: "/scenarios/photographer/demo",
    source: "app/scenarios/photographer/demo/page.tsx",
    images: "docs/scenarios/photographer/IMAGES.md",
    theme: {
      tone: "light",
      accent: "#c2410c",
      ink: "#1c1917",
      font: "Neucha, Caveat",
    },
    sections: [
      { item: "surface-025", anchor: "", role: "Фон тетради", roleEn: "Notebook background", note: "Клетка на всю страницу; секции отдают свою бумагу прозрачной.", noteEn: "Squares across the whole page; sections make their paper transparent." },
      { item: "sketch-019", anchor: "", role: "Шапка", roleEn: "Header", note: "Нарисованный фотоаппарат, ссылки с росчерком, кнопка в штриховке.", noteEn: "A sketched camera, stroke-underlined links, a hatched button." },
      { item: "sketch-016", anchor: "hero", role: "Первый экран", roleEn: "First screen", note: "Заголовок с обведённым словом и фото, приклеенное скотчем.", noteEn: "A headline with a circled word and a taped photo." },
      { item: "sketch-018", anchor: "works", role: "Скролл и поля", roleEn: "Scroll and margins", note: "Обёртка всех секций: листы въезжают на стол, нитка и доодлы на полях.", noteEn: "Wraps every section: sheets land on the desk, a thread and doodles in the margins." },
      { item: "sketch-017", anchor: "works", role: "Работы", roleEn: "Work", note: "Галерея с фильтром по жанрам и вылетом кадра на передний план.", noteEn: "A gallery with genre filter and a fly-out lightbox." },
      { item: "sketch-013", anchor: "process", role: "Разделители", roleEn: "Dividers", note: "Линия от руки с подписью между секциями.", noteEn: "A hand-drawn line with a caption between sections." },
      { item: "sketch-009", anchor: "process", role: "Пометка в заголовке", roleEn: "Headline mark", note: "Маркер под словом «съёмка».", noteEn: "A highlighter under one word." },
      { item: "sketch-012", anchor: "process", role: "Шаги съёмки", roleEn: "Shoot steps", note: "Пять шагов процесса кружками.", noteEn: "Five process steps in circles." },
      { item: "sketch-007", anchor: "process", role: "Карточки", roleEn: "Cards", note: "Шаги подробно и три формата с ценами.", noteEn: "Step details and three priced packages." },
      { item: "sketch-020", anchor: "about", role: "Обо мне", roleEn: "About", note: "Фото, цифры в кружках, список с галочками.", noteEn: "A photo, circled numbers, a checkmark list." },
      { item: "sketch-015", anchor: "reviews", role: "Отзывы", roleEn: "Reviews", note: "Три рукописные цитаты.", noteEn: "Three handwritten quotes." },
      { item: "sketch-001", anchor: "pricing", role: "Кнопки в ценах", roleEn: "Price buttons", note: "«Выбрать» в каждой карточке формата.", noteEn: "“Choose” in every package card." },
      { item: "sketch-021", anchor: "book", role: "Запись", roleEn: "Booking", note: "Форма: день, время, телефон, согласие.", noteEn: "A form: day, time, phone, consent." },
      { item: "sketch-022", anchor: "footer", role: "Подвал", roleEn: "Footer", note: "Следующая история на приклеенном фото и строка со студией.", noteEn: "The next story on a taped photo and the studio row." },
      { item: "sketch-023", anchor: "process", role: "Стикеры на полях", roleEn: "Margin stickers", note: "Три записки: перенос по погоде, настоящие люди, свободные даты.", noteEn: "Three notes: weather rescheduling, real people, free dates." },
    ],
  },
]

// Опечатка в имени item'а здесь означала бы пустую карточку в рецепте,
// поэтому состав проверяется при загрузке модуля, а не глазами.
for (const scenario of SCENARIOS) {
  for (const section of scenario.sections) {
    if (!getCatalogItem(section.item)) {
      throw new Error(
        `registry/scenarios.ts: сценарий "${scenario.slug}" ссылается на item "${section.item}", которого нет в каталоге`,
      )
    }
  }
}
