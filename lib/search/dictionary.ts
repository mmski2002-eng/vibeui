/**
 * Словарь поиска: нормализация, стемминг, синонимы.
 *
 * Каталог называет вещи по-своему («Тарифы», «Контакты», «Первый экран»),
 * а человек ищет своими словами («цены», «форма заявки», «обложка»). Пока
 * поиск сравнивал строки, любое расхождение читалось как «ничего нет» —
 * самый вредный ответ, потому что нужное лежит в каталоге и человек об этом
 * не узнаёт.
 *
 * Здесь нет ИИ и эвристик: только явные таблицы. Их видно, их можно
 * дополнить одной строкой, и они одинаково работают на сервере и в браузере.
 */

/** Слова-оценки и слова-обращения: они ничего не выбирают, но ломают поиск
 *  по всем словам сразу («красивая кнопка» → «кнопка»). Записаны основами,
 *  потому что отсев идёт уже после стемминга. */
const STOP_STEMS = new Set([
  "красив",
  "современ",
  "стильн",
  "прост",
  "удобн",
  "минималистичн",
  "лучш",
  "хорош",
  "крут",
  "аккуратн",
  "классн",
  "симпатичн",
  "нормальн",
  "обычн",
  "мне",
  "нам",
  "нужн",
  "хоч",
  "хотел",
  "покаж",
  "найд",
  "ищ",
  "дай",
  "как",
  "нибуд",
  "какой",
  "кака",
  // Предлоги и союзы: в поиске «по всем словам сразу» они требуют совпадения
  // там, где ничего не значат.
  "для",
  "под",
  "про",
  "на",
  "над",
  "с",
  "со",
  "у",
  "из",
  "по",
  "до",
  "от",
  "или",
  "либо",
  "что",
  "чем",
  "the",
  "for",
  "and",
  "with",
  "beautiful",
  "modern",
  "simple",
  "nice",
  "best",
  "good",
  "show",
  "find",
  "need",
  "want",
])

/**
 * Окончания, которые снимает стеммер. Порядок — от длинных к коротким:
 * «тарифами» должно потерять «ами», а не «и».
 */
const ENDINGS = [
  "ионного",
  "ования",
  "ениями",
  "ениям",
  "иями",
  "ями",
  "ами",
  "ого",
  "его",
  "ому",
  "ему",
  "ыми",
  "ими",
  "ени",
  "ов",
  "ев",
  "ам",
  "ям",
  "ах",
  "ях",
  "ой",
  "ей",
  "ий",
  "ый",
  "ая",
  "яя",
  "ое",
  "ее",
  "ые",
  "ие",
  "ью",
  "ом",
  "ем",
  "ин",
  "ы",
  "и",
  "а",
  "я",
  "о",
  "е",
  "у",
  "ю",
  "ь",
  "й",
]

/** Минимальная длина основы: короче — стеммер режет смысл, а не окончание. */
const MIN_STEM = 4

/**
 * Синонимы: слово или фраза человека → категории каталога и добавочные слова.
 *
 * Ключ пишется как говорят, в любой форме — сравнение идёт по основам,
 * поэтому «тариф», «тарифы» и «тарифов» покрываются одной записью.
 *
 * Категории отсюда получают отдельный вес при ранжировании: попадание
 * «тарифы» → `pricing` должно поднять блоки тарифов выше items, у которых
 * слово «тариф» просто встретилось в описании.
 */
type Synonym = {
  /** Как это называет человек. Многословные варианты разрешены. */
  say: string[]
  /** Слаги категорий из `registry/categories.ts`. */
  categories?: string[]
  /** Дополнительные слова запроса — обычно английские теги. */
  terms?: string[]
}

export const SYNONYMS: Synonym[] = [
  {
    say: [
      "тарифы",
      "цены",
      "прайс",
      "прайслист",
      "прайс лист",
      "стоимость",
      "расценки",
      "планы подписки",
      "подписка",
    ],
    categories: ["pricing"],
    terms: ["pricing", "plans"],
  },
  {
    say: [
      "форма обратной связи",
      "обратная связь",
      "форма заявки",
      "заявка",
      "связаться",
      "написать нам",
      "контакты",
      "контактная форма",
    ],
    // Только «Контакты»: поля ввода — это `input`/`field`, у них свой
    // синоним. Пока они стояли здесь, «форма заявки» тянула сотню полей.
    categories: ["contact"],
    terms: ["contact"],
  },
  {
    say: [
      "карта",
      "карты",
      "карта проезда",
      "как добраться",
      "адрес на карте",
      "метка на карте",
      "яндекс карты",
      "гугл карты",
      "2гис",
      "двагис",
    ],
    categories: ["map"],
    terms: ["map", "maps", "yandex", "google", "2gis"],
  },
  {
    say: ["кнопка", "кнопочка", "баттон", "клавиша действия"],
    categories: ["button", "button-group"],
    terms: ["button"],
  },
  {
    say: ["вход", "войти", "логин", "регистрация", "авторизация", "пароль"],
    categories: ["auth"],
    terms: ["auth", "login", "signup"],
  },
  {
    say: ["вопросы и ответы", "частые вопросы", "вопросы", "faq"],
    categories: ["faq"],
    terms: ["faq"],
  },
  {
    say: ["отзывы", "рекомендации", "мнения клиентов", "цитаты"],
    categories: ["testimonials"],
    terms: ["testimonials"],
  },
  {
    say: ["первый экран", "главный экран", "обложка", "заглавная секция"],
    categories: ["hero"],
    terms: ["hero"],
  },
  {
    say: ["шапка", "хедер", "верхнее меню", "навигация сверху"],
    categories: ["navbar", "navigation-menu"],
    terms: ["navbar", "header"],
  },
  {
    say: ["подвал", "футер", "низ сайта"],
    categories: ["footer"],
    terms: ["footer"],
  },
  {
    say: ["рассылка", "подписка на новости", "email рассылка", "новостная"],
    categories: ["newsletter", "email"],
    terms: ["newsletter"],
  },
  {
    say: [
      "таблица",
      "табличка",
      "таблица данных",
      "данные таблицей",
      "грид",
      "реестр записей",
      "список записей",
    ],
    categories: ["table", "data-grid", "datagrid"],
    terms: ["table"],
  },
  {
    say: ["график", "диаграмма", "чарт", "визуализация данных"],
    categories: ["chart", "sparkline"],
    terms: ["chart"],
  },
  {
    say: ["дашборд", "панель показателей", "админка", "админ панель"],
    categories: ["dashboard", "metrics"],
    terms: ["dashboard"],
  },
  {
    say: ["поле ввода", "инпут", "текстовое поле"],
    categories: ["input", "field", "input-group", "textarea"],
    terms: ["input"],
  },
  {
    say: ["выпадающий список", "селект", "список выбора"],
    categories: ["select", "native-select", "combobox"],
    terms: ["select"],
  },
  {
    say: ["выпадающее меню", "меню действий", "контекстное меню"],
    categories: ["dropdown-menu", "context-menu"],
    terms: ["dropdown", "menu"],
  },
  {
    say: ["модалка", "модальное окно", "попап", "всплывающее окно", "диалог"],
    categories: ["dialog", "alert-dialog", "drawer", "popover"],
    terms: ["dialog", "modal"],
  },
  {
    say: ["уведомление", "тост", "снекбар", "всплывающее сообщение"],
    categories: ["toast", "notifications", "alert"],
    terms: ["toast", "alert"],
  },
  {
    say: ["вкладки", "табы", "переключение разделов"],
    categories: ["tabs"],
    terms: ["tabs"],
  },
  {
    say: ["пагинация", "постраничная навигация", "страницы списка"],
    categories: ["pagination"],
    terms: ["pagination"],
  },
  {
    say: ["хлебные крошки", "путь по разделам"],
    categories: ["breadcrumb"],
    terms: ["breadcrumb"],
  },
  {
    say: ["карусель", "слайдер картинок", "галерея"],
    categories: ["carousel", "images"],
    terms: ["carousel"],
  },
  {
    say: ["ползунок", "слайдер значения", "регулятор"],
    categories: ["slider", "range"],
    terms: ["slider"],
  },
  {
    say: ["поиск", "строка поиска", "поле поиска"],
    categories: ["search", "command", "autocomplete"],
    terms: ["search"],
  },
  {
    say: ["календарь", "выбор даты", "датапикер", "дата"],
    categories: ["calendar", "date-selector", "event-calendar"],
    terms: ["calendar", "date"],
  },
  {
    say: ["загрузка файлов", "дропзона", "прикрепить файл", "аплоад"],
    categories: ["file-upload", "files"],
    terms: ["upload"],
  },
  {
    say: ["призыв к действию", "цта", "блок с кнопкой"],
    categories: ["cta"],
    terms: ["cta"],
  },
  {
    say: ["команда", "сотрудники", "наши люди", "мастера", "специалисты"],
    categories: ["team"],
    terms: ["team"],
  },
  {
    say: ["о компании", "о нас", "про компанию"],
    categories: ["about"],
    terms: ["about"],
  },
  {
    say: ["блог", "статьи", "публикации", "новости"],
    categories: ["blog", "blog-post"],
    terms: ["blog"],
  },
  {
    say: ["цифры", "показатели", "метрики", "статистика"],
    categories: ["stats", "metrics"],
    terms: ["stats"],
  },
  {
    say: ["таймлайн", "лента событий", "хронология", "история"],
    categories: ["timeline", "changelog", "activity"],
    terms: ["timeline"],
  },
  {
    say: ["этапы", "как это работает", "шаги", "пошагово"],
    categories: ["process", "stepper"],
    terms: ["steps"],
  },
  {
    say: ["логотипы", "клиенты", "партнёры", "нам доверяют"],
    categories: ["logos"],
    terms: ["logos"],
  },
  {
    say: ["ошибка", "страница не найдена", "404"],
    categories: ["errors", "not-found", "error"],
    terms: ["error"],
  },
  {
    say: ["пустое состояние", "заглушка", "нет данных"],
    categories: ["empty"],
    terms: ["empty"],
  },
  {
    say: ["скелетон", "заглушка загрузки"],
    categories: ["skeleton"],
    terms: ["skeleton"],
  },
  {
    say: ["спиннер", "лоадер", "индикатор ожидания"],
    categories: ["spinner", "progress"],
    terms: ["spinner", "loading"],
  },
  {
    say: ["магазин", "товары", "корзина", "витрина товаров"],
    categories: ["commerce"],
    terms: ["commerce", "shop"],
  },
  {
    say: ["оплата", "платежи", "чекаут", "оформление заказа", "карта оплаты"],
    categories: ["payments", "currency-input"],
    terms: ["payments", "checkout"],
  },
  {
    say: ["сравнение", "таблица сравнения", "чем отличается"],
    categories: ["comparison"],
    terms: ["comparison"],
  },
  {
    say: ["интеграции", "подключения", "сервисы"],
    categories: ["integrations", "connections"],
    terms: ["integrations"],
  },
  {
    say: ["лист ожидания", "ранний доступ", "запись в очередь"],
    categories: ["waitlist"],
    terms: ["waitlist"],
  },
  {
    say: ["видео", "плеер", "проигрыватель"],
    categories: ["video", "media"],
    terms: ["video"],
  },
  {
    say: ["аккордеон", "раскрывающийся список", "сворачиваемый блок"],
    categories: ["accordion", "collapsible"],
    terms: ["accordion"],
  },
  {
    say: ["подсказка", "тултип", "поясняющая надпись"],
    categories: ["tooltip", "hover-card"],
    terms: ["tooltip"],
  },
  {
    say: ["тумблер", "переключатель", "свитч"],
    categories: ["switch", "toggle", "toggle-group", "radio-group"],
    terms: ["switch", "toggle"],
  },
  {
    say: ["чекбокс", "галочка", "флажок"],
    categories: ["checkbox", "checklist"],
    terms: ["checkbox"],
  },
  {
    say: ["прогресс", "полоса загрузки", "индикатор выполнения"],
    categories: ["progress"],
    terms: ["progress"],
  },
  {
    say: ["рейтинг", "звёзды", "оценка"],
    categories: ["rating"],
    terms: ["rating"],
  },
  {
    say: ["чат", "переписка", "мессенджер", "сообщения"],
    categories: ["chat", "comments"],
    terms: ["chat"],
  },
  {
    say: ["канбан", "доска задач", "колонки задач"],
    categories: ["kanban"],
    terms: ["kanban"],
  },
  {
    say: ["командное меню", "палитра команд", "быстрые команды"],
    categories: ["command"],
    terms: ["command"],
  },
  {
    say: ["код", "блок кода", "подсветка синтаксиса", "сниппет"],
    categories: ["code-block"],
    terms: ["code"],
  },
  {
    say: ["куки", "согласие", "cookie баннер"],
    categories: ["consent", "banner"],
    terms: ["consent", "cookie"],
  },
  {
    say: ["аватар", "фото профиля", "юзерпик"],
    categories: ["avatar"],
    terms: ["avatar"],
  },
  {
    say: ["плашка", "бейдж", "метка", "лейбл"],
    categories: ["badge", "label"],
    terms: ["badge"],
  },
  {
    say: ["карточка", "карточки", "плитка"],
    categories: ["card", "stacks", "icon-tile"],
    terms: ["card"],
  },
  {
    say: ["карта", "география", "точки на карте"],
    categories: ["geo"],
    terms: ["map"],
  },
  {
    say: ["портфолио", "работы", "кейсы", "проекты", "тату", "татуировки", "эскизы"],
    categories: ["portfolio", "cases"],
    terms: ["portfolio", "cases"],
  },
  {
    say: [
      "недвижимость",
      "агентство недвижимости",
      "квартиры",
      "квартира",
      "риелтор",
      "риэлтор",
      "застройщик",
      "жилой комплекс",
      "объекты",
      "ипотека",
      "аренда",
      "снять квартиру",
      "купить квартиру",
    ],
    categories: ["realty"],
    terms: ["real estate", "realty", "property", "listing", "mortgage", "apartment"],
  },
  {
    say: [
      "ресторан",
      "ресторана",
      "кафе",
      "бар",
      "меню",
      "меню ресторана",
      "блюда",
      "блюдо",
      "кухня",
      "шеф-повар",
      "шеф",
      "бронь стола",
      "бронирование столика",
      "забронировать стол",
      "столик",
      "гастробар",
      "винная карта",
    ],
    categories: ["restaurant"],
    terms: ["restaurant", "cafe", "bar", "bistro", "menu", "dish", "chef", "reservation", "booking", "table", "wine", "food"],
  },
  {
    say: ["пекарня", "кофейня", "хлеб", "выпечка", "булочная", "кофе", "круассан"],
    categories: ["bakery"],
    terms: ["bakery", "cafe", "coffee", "bread", "pastry", "croissant", "loaf", "barista", "oven", "shelf", "box", "preorder"],
  },
  {
    say: ["опенсорс", "open source", "библиотека", "документация", "песочница", "npm", "гитхаб"],
    categories: ["opensource"],
    terms: ["open source", "library", "docs", "playground", "sandbox", "github", "npm", "package", "developer", "sdk", "cli"],
  },
  {
    say: ["приложение", "мобильное приложение", "скачать приложение", "телефон", "экраны приложения", "app store"],
    categories: ["app"],
    terms: ["app", "mobile", "phone", "screens", "app store", "google play", "download", "ios", "android", "mockup"],
  },
  {
    say: [
      "онлайн-курс",
      "онлайн курс",
      "курс",
      "курсы",
      "обучение",
      "школа",
      "программа курса",
      "модули",
      "уроки",
      "выпускники",
      "для кого курс",
      "лендинг курса",
      "edtech",
    ],
    categories: ["course"],
    terms: ["course", "online course", "education", "edtech", "curriculum", "syllabus", "lessons", "students", "graduates", "learning"],
  },
  {
    say: ["приложение", "скачать приложение", "сторы"],
    categories: ["downloads", "devices"],
    terms: ["downloads", "app"],
  },
  {
    say: [
      "мокап",
      "макет устройства",
      "ноутбук",
      "макбук",
      "рамка ноутбука",
      "рамка устройства",
      "скриншот в ноутбуке",
      "экран ноутбука",
    ],
    categories: ["mockup"],
    terms: ["mockup", "laptop", "macbook", "device"],
  },
  {
    say: ["безопасность", "приватность", "защита данных"],
    categories: ["security", "consent"],
    terms: ["security"],
  },
  {
    say: ["ии", "искусственный интеллект", "ассистент", "чат бот", "нейросеть", "saas", "песочница"],
    categories: ["ai", "chat"],
    terms: ["ai", "saas", "sandbox", "assistant"],
  },
  {
    say: ["события", "мероприятия", "афиша", "фестиваль", "программа", "расписание", "площадки"],
    categories: ["events", "event-calendar"],
    terms: ["events", "festival", "programme", "schedule", "venues", "lineup"],
  },
  {
    say: ["подкаст", "аудио", "выпуски"],
    categories: ["podcast", "media"],
    terms: ["podcast"],
  },
  {
    say: ["пресс кит", "для прессы", "медиа материалы"],
    categories: ["press", "branding"],
    terms: ["press"],
  },
  {
    say: ["фильтры", "отбор", "уточнение выдачи"],
    categories: ["filters"],
    terms: ["filters"],
  },
  {
    say: ["ввод кода", "смс код", "одноразовый код", "otp"],
    categories: ["input-otp"],
    terms: ["otp"],
  },
  {
    say: ["телефон", "номер телефона"],
    categories: ["phone-input"],
    terms: ["phone"],
  },
  {
    say: [
      "курсор",
      "указатель мыши",
      "след за курсором",
      "кастомный курсор",
      "мышь",
    ],
    categories: ["cursor"],
    terms: ["cursor", "pointer", "trail"],
  },
  {
    say: ["технические работы", "заглушка сайта", "скоро вернёмся"],
    categories: ["maintenance", "status"],
    terms: ["maintenance"],
  },
  {
    say: [
      "анимация текста",
      "оживший текст",
      "буквы",
      "подсветка слов",
      "маркер по тексту",
      "надпись меняется",
      "заголовок с эффектом",
    ],
    categories: ["text"],
    terms: ["text", "typography", "highlight", "letters", "reveal"],
  },
  {
    say: [
      "портфолио как рабочий стол",
      "рабочий стол",
      "windows xp",
      "виндовс",
      "окна",
      "ретро сайт",
      "личный сайт",
      "операционная система",
    ],
    categories: ["folio"],
    terms: [
      "portfolio",
      "desktop",
      "windows",
      "xp",
      "retro",
      "os",
      "window manager",
      "personal site",
    ],
  },
  {
    say: [
      "рукописный",
      "рукописная кнопка",
      "нарисованный от руки",
      "рисованный",
      "скетч",
      "каракули",
      "карандашный",
      "как в тетради",
    ],
    categories: ["sketch"],
    terms: [
      "sketch",
      "hand-drawn",
      "handwritten",
      "doodle",
      "rough",
      "scribble",
      "boil",
      "wobbly",
    ],
  },
  {
    say: [
      "переворот карточки",
      "переворачивающаяся карточка",
      "флип",
      "флип-карточка",
      "карточка с обратной стороной",
      "две стороны карточки",
      "3d карточка",
      "объёмная карточка",
    ],
    categories: ["cards"],
    terms: ["flip", "flip card", "3d card", "two-sided", "backface", "rotate", "reveal"],
  },
  {
    say: [
      "раскладка",
      "раскладки",
      "сетка страницы",
      "bento",
      "бенто",
      "плитки",
      "композиция",
      "структура страницы",
    ],
    categories: ["layout"],
    terms: [
      "layout",
      "bento",
      "grid",
      "tiles",
      "composition",
      "stack",
      "sticky",
      "editorial",
      "masonry",
      "app shell",
    ],
  },
  {
    say: [
      "фон",
      "фон секции",
      "анимированный фон",
      "живой фон",
      "градиентный фон",
      "подложка",
      "лента света",
      "переливы",
      "сияние на фоне",
      "mesh градиент",
      "жидкий металл",
      "дизеринг",
      "аврора",
      "точечная матрица",
      "жидкое стекло",
      "зерно",
      "частицы",
      "ascii",
      "фольга",
      "туман",
      "волны",
      "вороной",
      "лучи",
      "чернила",
      "полутон",
      "рябь",
    ],
    categories: ["background"],
    terms: [
      "background",
      "gradient",
      "mesh",
      "ribbon",
      "ambient",
      "webgl",
      "shader",
      "aurora",
      "dither",
      "metal",
      "chrome",
      "glass",
      "grain",
      "noise",
      "dots",
      "particles",
      "ascii",
      "foil",
      "fog",
      "waves",
      "voronoi",
      "rays",
      "ink",
      "halftone",
      "ripple",
    ],
  },
  // Мостики от темы сайта к типу элемента. Человек ищет предмет своего
  // сайта («герои игры», «рецепты»), а каталог называет вещи по элементам
  // интерфейса — без моста такой запрос давал уверенно нерелевантную
  // выдачу: «герои» → кейс-герой, «игра» → аудиоплеер.
  {
    say: [
      "персонаж",
      "персонажи",
      "герой",
      "герои",
      "карточка героя",
      "карточка персонажа",
      "character",
      "characters",
    ],
    categories: ["card", "avatar"],
    terms: ["card", "avatar", "profile"],
  },
  {
    say: ["игра", "игры", "игровой сайт", "гейминг", "game", "games", "gaming"],
    categories: ["card", "rating", "comparison"],
    terms: ["card", "rating", "comparison"],
  },
  {
    say: ["фильм", "фильмы", "кино", "сериал", "сериалы", "movie", "movies"],
    categories: ["video", "carousel", "card"],
    terms: ["video", "card"],
  },
  {
    say: ["рецепт", "рецепты", "еда", "блюдо", "блюда", "recipe", "food"],
    categories: ["card", "carousel"],
    terms: ["card"],
  },
  {
    say: ["коллекция", "энциклопедия", "справочник", "collection"],
    categories: ["card", "filters", "pagination"],
    terms: ["card", "filters"],
  },
]

/** Ё и пунктуация уходят до всего остального: дальше сравниваются только буквы. */
export function normalize(text: string): string {
  return text.toLowerCase().replace(/ё/g, "е")
}

/**
 * Основа слова. Русская морфология здесь снимается грубо — отсечением
 * окончания, — и этого хватает: одна и та же функция применяется и к
 * запросу, и к индексу, поэтому «тарифы» и «тариф» сходятся в «тариф»
 * независимо от того, насколько лингвистически верна основа.
 */
export function stem(word: string): string {
  if (!/[а-я]/.test(word)) {
    // Латиница: снимаем только множественное число, иначе «press» станет «pres».
    return word.length > 4 && word.endsWith("s") && !word.endsWith("ss")
      ? word.slice(0, -1)
      : word
  }

  for (const ending of ENDINGS) {
    if (word.length - ending.length >= MIN_STEM && word.endsWith(ending)) {
      return word.slice(0, -ending.length)
    }
  }

  return word
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
}

/** Токен в том виде, в каком он лежит в индексе и ищется в запросе. */
export function processTerm(term: string): string | null {
  const word = stem(normalize(term))

  return word.length < 2 ? null : word
}

/** Строка основ: по ней ищутся многословные синонимы. */
function stemLine(text: string): string {
  return tokenize(text).map(stem).join(" ")
}

// Синонимы разложены в поисковую форму один раз при загрузке модуля:
// на каждый ввод пересчитывать семь десятков записей незачем. Длинные
// фразы идут первыми — «форма обратной связи» должна сработать целиком,
// а не тремя словами по отдельности, каждое из которых означает другое.
const PHRASES = SYNONYMS.flatMap((entry) =>
  entry.say.map((phrase) => {
    const stems = stemLine(phrase).split(" ").filter(Boolean)

    return {
      stems,
      categories: entry.categories ?? [],
      terms: entry.terms ?? [],
    }
  }),
).sort((first, second) => second.stems.length - first.stems.length)

/**
 * Одна смысловая единица запроса: слово человека вместе со всем, чем то же
 * самое называется в каталоге. Внутри группы условия складываются (годится
 * любое), а группы между собой умножаются (нужны все) — иначе «форма заявки»
 * отдавала бы всё, где встретилось слово «форма».
 */
export type QueryGroup = {
  terms: string[]
  categories: string[]
  /**
   * Позиция первого слова группы в запросе. Порядок важен при ранжировании:
   * первым человек называет саму вещь («тарифы»), остальным уточняет её
   * («…с переключателем»), поэтому вес у групп разный.
   */
  at: number
}

export type ExpandedQuery = {
  groups: QueryGroup[]
  /** Категории, названные словарём: ими предлагается переход в раздел. */
  categories: string[]
}

/** Совпадает ли фраза со словами запроса начиная с позиции `at`. */
function matchesAt(words: string[], stems: string[], at: number): boolean {
  return stems.every((word, offset) => words[at + offset] === word)
}

/**
 * Разбор запроса: чистка от оценок, снятие окончаний, подстановка синонимов.
 *
 * Фразы выбираются жадно и слева направо, длинные раньше коротких. Слова,
 * которые ушли во фразу, во второй раз не участвуют: «выбор даты» — это одна
 * единица, а не «выбор» И «дата».
 */
export function expandQuery(raw: string): ExpandedQuery {
  // Слова хранятся в двух видах: как написаны и в основах. Основы нужны,
  // чтобы узнать синоним в любой форме; в поиск же уходят исходные слова —
  // MiniSearch стеммит запрос сам, и стеммить дважды нельзя. Двойной проход
  // молча прощал лишние буквы: «кнопкаа» → «кнопка» → «кнопк», и опечатка
  // объявлялась точным совпадением.
  const words = tokenize(raw)
  const stems = words.map(stem)

  if (words.length === 0) {
    return { groups: [], categories: [] }
  }

  const taken = new Array<boolean>(words.length).fill(false)
  // Ключ — занятый фразой отрезок запроса. Одни и те же слова могут значить
  // сразу несколько вещей («карточка» — и card, и стопка карточек): такие
  // синонимы складываются в одну группу, а не отменяют друг друга.
  const spans = new Map<string, QueryGroup>()
  const categories = new Set<string>()

  for (const phrase of PHRASES) {
    for (let at = 0; at + phrase.stems.length <= stems.length; at += 1) {
      const span = `${at}:${phrase.stems.length}`
      const free = phrase.stems.every(
        (_, offset) => !taken[at + offset] || spans.has(span),
      )

      if (!free || !matchesAt(stems, phrase.stems, at)) {
        continue
      }

      for (let offset = 0; offset < phrase.stems.length; offset += 1) {
        taken[at + offset] = true
      }

      for (const category of phrase.categories) {
        categories.add(category)
      }

      const group = spans.get(span) ?? {
        terms: words.slice(at, at + phrase.stems.length),
        categories: [],
        at,
      }

      // Слаг категории — тоже поисковый терм: он лежит в отдельном поле
      // документа и даёт точное попадание, а не совпадение по описанию.
      group.terms.push(...phrase.terms, ...phrase.categories)
      group.categories.push(...phrase.categories)
      spans.set(span, group)
    }
  }

  const groups = [...spans.values()]

  for (let at = 0; at < words.length; at += 1) {
    if (taken[at] || STOP_STEMS.has(stems[at])) {
      continue
    }

    groups.push({ terms: [words[at]], categories: [], at })
  }

  // Группы возвращаются в порядке слов запроса, а не в порядке, в каком
  // сработали синонимы: длинные фразы проверяются первыми, и без сортировки
  // «переключатель» из хвоста запроса оказался бы главным словом.
  groups.sort((first, second) => first.at - second.at)

  return { groups, categories: [...categories] }
}
