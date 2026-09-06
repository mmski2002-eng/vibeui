# CATALOG-IA

Информационная архитектура каталога: как устроен образец (ReUI), как
устроены мы и что менять. Сверка 2026-09-01, значения сняты из DOM
`reui.io`, не с картинок.

Количественный разрыв по ассортименту — [ASSORTMENT-GAP.md](ASSORTMENT-GAP.md).

## Как устроено у них

Маршруты:

| адрес               | что показывает                                                                         |
| ------------------- | -------------------------------------------------------------------------------------- |
| `/components`       | сетка карточек **категорий** (74 штуки), карточка = обложка + подпись + «N components» |
| `/components/<тип>` | страница одного типа: заголовок, тулбар, сетка вариантов, ниже — статья и FAQ          |
| страницы варианта   | **нет**; вариант живёт только карточкой внутри страницы типа                           |

Страница типа (`/components/tree`):

- `h1` вида «Shadcn Tree», `title` — «Shadcn Tree - UI Components - ReUI»;
- тулбар над сеткой: `List view`, `1 column (row mode)`, `2 columns`,
  `Customize preview`;
- карточка варианта — `div`, не ссылка: превью, подпись, кнопки
  `Copy registry URL` и `View code`;
- под сеткой SEO-слой: `h2` «Shadcn Tree: File Explorer and Hierarchical…»
  с разделами «What is», «Why Use», «Libraries and Primitives», «Features»,
  затем «Integrating With Other Components» и «Frequently Asked Questions»
  с аккордеоном вопросов.

Колонка слева одинакова на всех страницах каталога: «All Components» с общим
счётчиком, ниже плоский алфавитный список типов со счётчиками; над ней —
фильтр по названию и переключатель плотности списка.

Ключевое: **категория = тип компонента**. Ни одной сборной категории вроде
«Inputs» у них нет.

## Как устроено у нас

| адрес                     | что показывает                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `/components`             | сетка карточек категорий (32 штуки)                                                  |
| `/components/<категория>` | сетка вариантов категории                                                            |
| `/components/<item>`      | **страница варианта**: превью во фрейме, настройка контролами, Copy for AI, исходник |
| `/c/<item>`               | инструкция для агента (plain text)                                                   |
| `/r/<item>.json`          | registry-манифест для `npx shadcn add`                                               |
| `/f/<item>.tsx`           | исходный файл                                                                        |

Отличие по существу одно, и оно вредное: 6 из 32 категорий — корзины, в
которых лежит 57 разных типов. `tree`, `select`, `switch`, `toast`,
`pagination` и ещё полсотни типов не имеют ни пункта в меню, ни адреса.

| корзина      | items | типов внутри |
| ------------ | ----: | -----------: |
| `inputs`     |   168 |           18 |
| `display`    |   110 |           16 |
| `navigation` |    79 |           10 |
| `feedback`   |    66 |            8 |
| `charts`     |    31 |            3 |
| `menu`       |    19 |            2 |

## Что делаем

Разбить корзины на типы: **81 категория** вместо 32, каждая со своей
страницей и счётчиком. Их 74 против наших 81 — разница за счёт типов,
которых у них нет (`banner`, `sidebar`, `currency-input`, `tags-input`,
`range`, `sparkline`, `menu`).

Разбивка механическая: категория item'а выводится из префикса его имени
(`tree-001` → `tree`), файлы никуда не двигаются, меняются только поля
`categories` в `registry/**/registry.json` и таблица в
`registry/categories.ts`. Индексы пересобирает `npm run indexes`.

### Целевая таксономия

| slug              | подпись         | items | сейчас лежит в     |
| ----------------- | --------------- | ----: | ------------------ |
| `alert`           | Alert           |    20 | alert              |
| `alert-dialog`    | Alert Dialog    |    14 | alertdialog        |
| `aspect-ratio`    | Aspect Ratio    |     8 | aspect             |
| `autocomplete`    | Autocomplete    |    12 | autocomplete       |
| `avatar`          | Avatar          |    35 | avatar             |
| `badge`           | Badge           |    25 | badge              |
| `banner`          | Banner          |     8 | feedback           |
| `breadcrumb`      | Breadcrumb      |    15 | breadcrumb         |
| `button`          | Button          |    61 | buttons            |
| `button-group`    | Button Group    |    57 | buttongroup        |
| `calendar`        | Calendar        |    30 | calendar           |
| `card`            | Card            |    21 | card               |
| `carousel`        | Carousel        |    16 | carousel           |
| `cascader`        | Cascader        |    20 | inputs             |
| `chart`           | Chart           |    22 | charts             |
| `checkbox`        | Checkbox        |    22 | checkbox           |
| `code-block`      | Code Block      |    28 | codeblock, display |
| `collapsible`     | Collapsible     |    10 | display            |
| `combobox`        | Combobox        |    20 | combobox           |
| `command`         | Command         |    10 | navigation         |
| `context-menu`    | Context Menu    |     8 | navigation         |
| `currency-input`  | Currency Input  |     7 | inputs             |
| `data-grid`       | Data Grid       |    29 | datagrid           |
| `date-selector`   | Date Selector   |     8 | inputs             |
| `dialog`          | Dialog          |    14 | dialog             |
| `drawer`          | Drawer          |     8 | feedback           |
| `dropdown-menu`   | Dropdown Menu   |    12 | menu               |
| `empty`           | Empty           |     9 | feedback           |
| `event-calendar`  | Event Calendar  |     5 | eventcalendar      |
| `field`           | Field           |    10 | inputs             |
| `file-upload`     | File Upload     |    10 | inputs             |
| `filters`         | Filters         |     9 | inputs             |
| `frame`           | Frame           |     6 | display            |
| `gantt`           | Gantt           |     7 | charts             |
| `hover-card`      | Hover Card      |     7 | feedback           |
| `icon-stack`      | Icon Stack      |     5 | display            |
| `icon-tile`       | Icon Tile       |     6 | display            |
| `input`           | Input           |    15 | inputs             |
| `input-group`     | Input Group     |    10 | inputs             |
| `input-otp`       | Input OTP       |     7 | inputs             |
| `item`            | Item            |    10 | display            |
| `kanban`          | Kanban          |     7 | display            |
| `kbd`             | Kbd             |     6 | display            |
| `label`           | Label           |     8 | label              |
| `menu`            | Menu            |     7 | menu               |
| `native-select`   | Native Select   |     7 | nativeselect       |
| `navigation-menu` | Navigation Menu |     8 | navigation         |
| `number-field`    | Number Field    |     8 | inputs             |
| `pagination`      | Pagination      |     9 | navigation         |
| `phone-input`     | Phone Input     |     7 | phoneinput         |
| `popover`         | Popover         |     8 | feedback           |
| `progress`        | Progress        |     9 | display            |
| `radio-group`     | Radio Group     |     8 | inputs             |
| `range`           | Range           |     7 | inputs             |
| `rating`          | Rating          |     8 | inputs             |
| `scroll-area`     | Scroll Area     |     7 | display            |
| `scrollspy`       | Scrollspy       |     7 | navigation         |
| `select`          | Select          |     9 | inputs             |
| `separator`       | Separator       |     6 | display            |
| `sheet`           | Sheet           |     7 | feedback           |
| `sidebar`         | Sidebar         |     9 | navigation         |
| `skeleton`        | Skeleton        |     8 | display            |
| `slider`          | Slider          |     8 | inputs             |
| `sortable`        | Sortable        |     7 | display            |
| `sparkline`       | Sparkline       |     2 | charts             |
| `spinner`         | Spinner         |     6 | display            |
| `stepper`         | Stepper         |     9 | navigation         |
| `switch`          | Switch          |     9 | inputs             |
| `table`           | Table           |    20 | tables             |
| `tabs`            | Tabs            |    11 | navigation         |
| `tags-input`      | Tags Input      |     7 | inputs             |
| `textarea`        | Textarea        |     8 | inputs             |
| `timeline`        | Timeline        |     8 | display            |
| `toast`           | Toast           |    10 | feedback           |
| `toggle`          | Toggle          |     8 | toggle             |
| `toggle-group`    | Toggle Group    |     8 | togglegroup        |
| `tooltip`         | Tooltip         |     9 | feedback           |
| `tree`            | Tree            |     8 | display            |

### Порядок работ

1. `registry/categories.ts` — заменить 32 категории на 81, подписи и группы.
2. Скрипт-миграция: пройти по `registry/**/registry.json`, проставить
   `categories: [<тип по префиксу>]`. Спорные разобрать руками:
   `menu-001…007` (внутри action menu, context menu, menubar, profile,
   mega menu, action sheet — часть уедет в `dropdown-menu`, `context-menu`,
   `menubar`, `navigation-menu`, `sheet`), `code-001` → `code-block`,
   `tabbar-001` → `tabs`. Позже оба переименованы под префикс своей
   категории: `code-001` → `codeblock-031`, `tabbar-001` → `tabs-014`
   (в категории живёт ровно один префикс).
3. `npm run indexes` + `npm run meta:validate`.
4. Проверить страницы: `/components` (81 карточка), `/components/tree`,
   `/components/select`, старые адреса корзин.
5. Старые адреса `/components/inputs`, `/display`, `/navigation`,
   `/feedback`, `/charts`, `/menu` перестанут существовать. Они появились
   вчера и наружу не публиковались — редиректы не нужны; если решим иначе,
   добавим их в `next.config.ts`.

### Чего у них не копируем

- **Страницы вариантов оставляем.** У них варианта-страницы нет, у нас на
  ней держится главный сценарий: превью → Copy for AI → установка агентом.
  Отказаться от неё — отказаться от продукта.
- **SEO-слой страницы типа** (статья + FAQ + перелинковка) — отдельная
  задача: это тексты, а не разметка. Место под него на странице категории
  предусмотреть стоит.
- **`Customize preview` и `List view`** в тулбаре типа — их настройка
  превью и вид списком; у нас роль настройки играют контролы на карточке.
