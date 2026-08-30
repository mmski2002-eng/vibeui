# ASSORTMENT

Карта ассортимента: какие типы компонентов и блоков должны быть в VibeUI и
в каком порядке их делать.

Это очередь работ, а не реестр. Реестр — файлы `registry/**/registry.json`,
другого источника данных у каталога нет.

## Как составлена

Ориентир по спросу — публичные каталоги shadcn-библиотек: сколько вариантов
рынок держит в каждой категории. Колонка «спрос» — порядок величины числа
вариантов у крупной публичной библиотеки (ReUI, ~1700 items). Это сигнал
приоритета, не план по количеству.

Чужой код не копируется. Каждый item пишется с нуля по правилам
[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md): один файл, своя палитра
`--vibeui-*`, ноль зависимостей, container-запросы, `prefers-reduced-motion`,
`meta.ai` с preserve / adapt / usage.

## Оси

Таксономия — `registry/categories.ts`. Для полного ассортимента её надо
расширить: категорий компонентов сейчас пять (`buttons`, `inputs`, `display`,
`feedback`, `tables`), нужны ещё четыре — `navigation`, `overlays`, `charts`,
`calendar`.

## kind: component

| категория    | что входит                                                                                                                                                                                          | спрос | у нас |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----: | ----: |
| `buttons`    | button, button group, toggle, toggle group, kbd                                                                                                                                                     |  ~155 |    11 |
| `inputs`     | input, input group, select, combobox, autocomplete, checkbox, radio, switch, slider, textarea, number, otp, phone, label, field, file upload, date selector, cascader, rating                       |  ~300 |     6 |
| `display`    | avatar, badge, card, item, icon tile, icon stack, aspect ratio, separator, frame, code block, timeline, carousel, accordion, collapsible, scroll area, resizable, tree, skeleton, spinner, progress |  ~265 |     0 |
| `feedback`   | alert, alert dialog, dialog, drawer, sheet, popover, tooltip, hover card, toast, empty state                                                                                                        |  ~130 |     0 |
| `navigation` | breadcrumb, dropdown menu, context menu, menubar, navigation menu, tabs, stepper, command, scrollspy                                                                                                |   ~85 |     0 |
| `tables`     | table, data grid, pagination                                                                                                                                                                        |   ~60 |     0 |
| `charts`     | chart (line, bar, area, pie, radial), sparkline                                                                                                                                                     |   ~55 |     0 |
| `calendar`   | calendar, event calendar, gantt, kanban, sortable, filters                                                                                                                                          |   ~70 |     0 |

## kind: block

| категория      | что входит                                                        | спрос | у нас |
| -------------- | ----------------------------------------------------------------- | ----: | ----: |
| `hero`         | hero-секции лендинга                                              |   ~24 |     3 |
| `features`     | features, comparison, stats                                       |   ~35 |     1 |
| `pricing`      | pricing, coupon, receipt                                          |   ~20 |     1 |
| `navbar`       | шапки сайта и приложения                                          |   ~13 |     0 |
| `cta`          | cta-секции                                                        |    ~6 |     0 |
| `faq`          | faq-секции                                                        |    ~6 |     0 |
| `testimonials` | отзывы, wall of love, review                                      |   ~12 |     0 |
| `footer`       | подвалы                                                           |    ~8 |     0 |
| `dashboard`    | app shell, dashboard, settings, profile, filter sidebar, schedule |   ~80 |     0 |
| `ai`           | чат, ассистент, агентные сценарии                                 |   ~20 |     0 |

Ещё не заведённые категории блоков, если пойдём в e-commerce и в auth:
`commerce` (product card, product grid, product detail, shop hero, checkout,
cart, wishlist, category card — суммарно ~55) и `auth` (вход, регистрация,
восстановление, onboarding, wizard — ~35).

## kind: template

Зарезервировано, реализации нет. Кандидаты — целые страницы сценариев:
биллинг, аналитика, CRM, пользователи, бронирования, файлы, инвентарь.
Раньше блоков не делать: шаблон собирается из них.

## Порядок

1. `buttons` — набор есть, 11 items. Довести до состояния эталона и не трогать.
2. `inputs` — первая волна закрыта: `input-001` (плавающая подпись),
   `input-002` (приставка и окончание), `textarea-001` (рост под текст),
   `select-001` (нативный список), `checkbox-001`, `switch-001`.
   Дальше по спросу: radio, slider, otp, file upload, combobox.
3. `display` — badge, avatar, card, skeleton, spinner: то, из чего собираются
   остальные блоки.
4. `feedback` — alert, dialog, toast, empty state.
5. `navigation` — tabs, breadcrumb, dropdown, stepper.
6. Блоки — только после того, как компонентная база закрывает их нужды.

Ритм — пачка на категорию: спека всех items категории сразу (иначе выходят
вариации одного и того же), потом реализация по одному, потом отдельный
проход ревью и проверка в браузере. Конвейер и чек-лист — [PIPELINE.md](PIPELINE.md).
