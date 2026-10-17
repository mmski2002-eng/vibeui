# Релиз: «Страница компонента отвечает на запрос про конкретный элемент» (2026-10-17)

План — [IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md). Worktree `C:\vibeui-seo4`, ветка `seo/item-pages` от `origin/main` `2104d7cc`.

## Что изменено
| Файл | Изменение |
|---|---|
| `lib/seo.ts` | title item'а: `<название> — React-компонент / React-блок / React-анимация \| VibeUI` (EN: `React component / block / animation`). Слово вида уже в названии — дописывается только «React». Название длиннее 55 символов или с «React» — без приписки. H1 не меняется. `pageMetadata` отдаёт явную картинку сайта в `og:image` и `twitter:image` |
| `proxy.ts` | `opengraph-image` исключён из matcher |
| `lib/item-links.ts` | новые: `getBlocksUsing` (до 6 блоков из `registryDependencies`, сначала бесплатные) и `getScenariosUsing` (до 7 из `registry/scenarios.ts`, с ролью секции) |
| `components/catalog/item-reference.tsx` | новые разделы: «Как использовать» (`ai.usage`), «Настройки» (`controls`: подпись, проп, значение по умолчанию), «Используется в блоках», «Используется в сценариях» |
| `components/pages/item-page.tsx` | подключение разделов под рабочей областью |
| `lib/i18n.ts` | подписи разделов RU/EN |
| `registry/**/registry.json` (26 файлов) | разведены дубли title, добавлены 2 недостающих EN-названия; затронуты только поля `title` |

Не трогал: оплату, checkout, регистрацию, аналитику, legal, robots, sitemap, canonical, slug и URL, доступ к исходникам.

## Проверка данных перед реализацией
- `controls`: 2048 из 2048 items, 9190 контролов единого формата `prop / label / type / default` (+ `options`, `min/max`). Пустой `default` у цвета — «цвет темы», у текста — не выводится.
- `ai.usage`: нет у 4 items (`hero-001`, `hero-002`, `hero-003`, `pricing-001`). Раздел у них не показывается, ничего не подставляется. EN-перевод usage есть у всех.
- `ai.preserve`, `ai.notes`, `ai.summary` (инструкции агенту) на страницу не выводятся.
- `ai.usage` и `controls` уже были в публичном RSC-payload каждой страницы, включая Pro. Видимый текст ничего нового не раскрывает.
- У 7 бесплатных items в `default` контрола стоит команда установки (демо-текст кнопки копирования). Она и раньше была в поле контрола. Бесплатный `/r/*.json` публичен; у Pro таких значений нет.

## Соцкарточки: найдено и исправлено
1. Все страницы, у которых `pageMetadata` объявляет свой `openGraph` (item'ы, категории, сценарии и др.), теряли файловую `opengraph-image` корня: `og:image` отсутствовал, а `twitter:card` при этом `summary_large_image`. Проверено на production: `vibeui.ru/blocks/hero`, `vibeui.club/components`, все item'ы.
2. Главная `.club` указывала `og:image` на `https://vibeui.club/en/opengraph-image`. Этот путь публично отдавал **404**: его ловил запрет старых `/en/*` в proxy.

Новая генерация изображений не создавалась: используются существующие `app/opengraph-image.tsx` и `app/en/opengraph-image.tsx`.

## Результаты проверок (локально, dev-сервер worktree)
| Проверка | Результат |
|---|---|
| `npm run meta:validate` | ошибок нет (823 предупреждения — те же, что до правок) |
| `npm run indexes` | индексы без изменений |
| `tsc --noEmit` | без ошибок пакета; одна ошибка `LayoutProps` в `app/layout.tsx` — тип, который генерирует Next при сборке; в свежем worktree его нет, файл не менялся |
| `eslint` + `prettier --check` по изменённым файлам | чисто |
| Дубли title после правки | RU 0, EN 0 (было 49 и 27 групп) |
| Серверный HTML, RU | `hero-001`, `pricing-020` (Pro), `navbar-004`, `button-015`, `button-074`, `button-anim-002` (Pro), `avatar-anim-002` (Pro) — 200, новые title, разделы на месте, превью-iframe и «Копировать для ИИ» сохранены |
| Серверный HTML, EN (Host `vibeui.club`) | `avatar-003`, `iconstack-001`, `hero-001`, `pricing-020`, `button-015`, `button-anim-002`, главная — английские title и разделы, `og:image` = `https://vibeui.club/en/opengraph-image` |
| Пустые данные | `hero-001`: раздела usage нет; `button-anim-002`: нет блоков и сценариев — разделы не выводятся |
| Ссылки разделов | блоки — все 200; `/scenarios/course` на dev 500 (в dev нет `DATABASE_URL`), на production 200 |
| `/en/opengraph-image`, `/opengraph-image` | 200 `image/png` |
| Утечка кода | 8 строк из середины исходника каждого item'а ищутся в HTML: 0 совпадений; у `button-074` 1 — строка из общих стилей сайта, есть и на текущем production |
| Прирост HTML | разделы 1,5–4,3 КБ до сжатия на страницу |
| Мобильный 375 / 390 px | горизонтальной прокрутки нет, разделы в ширину колонки; ссылки «пилюлями» переделаны в список после проверки |
| Десктоп 1366 px | настройки в две колонки, раздел сценариев виден |
| Смоук `deploy.yml` | ассерты не зависят от title; `/en/start` по-прежнему 301 |

## Разведённые дубли title
Отличия взяты из описания и кода (поведение, форма, компоновка, назначение). Номеров и эпитетов нет, slug не менялись.

| Item | RU | EN |
|---|---|---|
| `alert-018` | Нет соединения → **Полоса «Нет соединения»** | Offline Alert |
| `autocomplete-009` | Код страны → **Телефон с поиском страны** | Country Dial |
| `autocomplete-010` | Создание значения → **Создание значения из пустой выдачи** | Create Option → **Create Option from Empty Results** |
| `avatar-003` | Стопка аватаров → **Стопка аватаров с подсказками** | Avatar Stack → **Avatar Stack with Tooltips** |
| `avatar-anim-002` | Стопка аватаров → **Анимированная стопка аватаров** | Avatar stack → **Animated Avatar Stack** |
| `badge-024` | Группа с переполнением → **Группа плашек с «+N»** | Overflow Group → **Badge Overflow Group** |
| `banner-015` | Баннер установки приложения | — (не было) → **App Install Banner** |
| `button-027` | Повтор с отсчётом → **Повторная отправка кода с отсчётом** | Resend Countdown |
| `button-074` | Кнопка копирования → **Кнопка копирования с морфом иконки** | Copy Button → **Copy Button with Icon Morph** |
| `button-103` | Переворачивающаяся карточка → **Кнопка-карточка с переворотом** | Flip card → **Flip Card Button** |
| `buttongroup-020` | Выбор валюты → **Выбор валюты кнопками** | Currency Picker → **Currency Button Group** |
| `buttongroup-033` | Обязательный выбор → **Обязательный выбор кнопками** | Required Choice → **Required Button Choice** |
| `buttongroup-037` | Файл или ссылка → **Переключатель «файл или ссылка»** | File Or Link → **File or Link Switcher** |
| `buttongroup-044` | Счётчик количества → **Счётчик количества с подписью** | Quantity Stepper → **Labeled Quantity Stepper** |
| `buttongroup-046` | Пресеты дат → **Пресеты периода с датами** | Dated Presets |
| `calendar-010` | Карточка события → **Карточка встречи с листком календаря** | Event Card → **Event Card with Tear-off Date** |
| `calendar-015` | Дата и время → **Дата и свободные слоты** | Date And Time |
| `calendar-027` | Готовые диапазоны → **Готовые диапазоны дат** | Range Presets |
| `card-002` | Карточка показателя → **Карточка показателя со столбиками** | Metric Card |
| `card-010` | Скелетон карточки → **Скелетон карточки с квадратной обложкой** | Card Skeleton → **Square Cover Card Skeleton** |
| `card-028` | Отзыв со звёздами → **Отзыв с заголовком и звёздами** | Testimonial with star rating |
| `card-052` | Строка участника → **Строка участника команды** | Team member row |
| `carousel-004` | Бегущая строка логотипов → **Бесшовная лента логотипов** | Logo Marquee → **Seamless Logo Marquee** |
| `case-003` | До и после → **Метрики до и после** | Before and After → **Before and After Metrics** |
| `chart-027` | Паутина → **Лепестковая диаграмма** | Radar Web |
| `chart-029` | Лента активности → **Лента активности по дням** | Activity Ribbon |
| `checkbox-015` | Ошибка группы → **Ошибка группы чекбоксов** | Group Error → **Checkbox Group Error** |
| `checkbox-019` | Чипы фильтров → **Чипы фильтров со сбросом** | Filter Chips → **Filter Chips with Reset** |
| `checklist-001` | Чек-лист → **Анимированный чек-лист** | Checklist → **Animated Checklist** |
| `collapsible-003` | Читать дальше → **Свёртка длинного текста** | Read More |
| `combobox-003` | Множественный выбор чипами → **Множественный выбор чипами с вводом** | Multi Chips |
| `currency-002` | Выбор валюты → **Выбор валюты с подсказкой** | Currency Select |
| `datagrid-019` | Конструктор фильтров → **Таблица с конструктором фильтров** | Filter Builder → **Data Grid Filter Builder** |
| `datagrid-020` | Сохранённые виды → **Таблица с сохранёнными видами** | Saved Views → **Data Grid Saved Views** |
| `datagrid-029` | Ошибка загрузки → **Таблица с ошибкой загрузки** | Load Error → **Data Grid Load Error** |
| `dropdown-011` | Список с поиском → **Выпадающее меню с поиском** | Searchable Select |
| `empty-011` | Запрос разрешения → **Запрос доступа к разделу** | Permission Request → **Access Request** |
| `errorpage-003` | Технические работы → **Страница технических работ** | Maintenance Page |
| `event-002` | Карточка события → **Страница события** | Event Card → **Event Page** |
| `field-003` | Отметка обязательного → **Обязательное поле со сноской** | Required Marker |
| `hovercard-003` | Карточка товара → **Всплывающая карточка товара** | Product Card → **Product Hover Card** |
| `hovercard-006` | Карточка события → **Всплывающая карточка события** | Event Card → **Event Hover Card** |
| `input-014` | Проверка ника → **Проверка ника с вариантами** | Handle Check → **Handle Check with Suggestions** |
| `input-016` | Генератор пароля → **Генератор пароля с оценкой энтропии** | Password Generator → **Password Generator with Entropy** |
| `inputgroup-009` | Ошибка группы → **Ошибка составного поля** | Group Invalid |
| `mockup-002` | Смартфон → **Фото-мокап смартфона** | Phone → **Photo Phone Mockup** |
| `nativeselect-001` | Нативный список → **Нативный список с подсказкой** | Native Basic |
| `nativeselect-006` | Список с ошибкой → **Нативный список с ошибкой** | Invalid Select → **Native Invalid Select** |
| `nativeselect-007` | Шкала размеров → **Нативный список в трёх размерах** | Size Scale → **Native Select Size Scale** |
| `notifications-001` | Колокольчик уведомлений → **Звенящий колокольчик с бейджем** | Bell |
| `phoneinput-001` | Код страны → **Телефон с флагом страны** | Country Code |
| `radio-007` | Способ доставки → **Способ доставки с ценой и сроком** | Delivery Method Radio |
| `radio-010` | Переключатель вида → **Сегментный переключатель вида** | Segmented View Switcher |
| `radio-020` | Выбор цвета → **Выбор цвета с пружинным выделением** | Swatch Picker |
| `range-007` | Готовые диапазоны → **Ползунок с готовыми диапазонами** | Preset Range |
| `select-020` | Выбор периода → **Выбор периода со своим диапазоном** | Period Range Select |
| `toast-004` | Сообщение по этапам → **Уведомление по этапам** | Lifecycle Toast |
| `toast-025` | Товар добавлен в корзину | — (не было) → **Added to Cart Toast** |
| `tooltip-014` | Причина недоступности → **Подсказка у отключённой кнопки** | Disabled Reason |

Пары, у которых изменено только одно название, различались и до правки: второй элемент сохранил прежнее имя.

Неразличимых пар не осталось. Самые близкие — `button-018` / `buttongroup-044` (счётчик количества) и `select-001` / `nativeselect-001` (нативный список). У второго элемента каждой пары в controls есть подпись или подсказка (`label` / `hint`), которых нет у первого. На это отличие и опирается новое название.

## Ограничения
- Title у названий длиннее 55 символов остаётся без типа (например EN `pricing-020`).
- Похожие items не добавлялись (отложено в исследовании).
- Картинка соцкарточки общая для сайта, не своя у каждого item'а.
- Полная сборка локально не запускалась; итог сборки и типов — CI.
