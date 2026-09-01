# ASSORTMENT-GAP

Чего не хватает ассортименту компонентов. Сверка с публичным каталогом
ReUI (`reui.io/components`) на 2026-09-01.

Очередь работ и правила написания items — [ASSORTMENT.md](ASSORTMENT.md).
Здесь только разрыв в количестве по типам.

## Как считалось

Их сторона — список категорий и счётчики со страницы каталога, снятые из
DOM: 74 категории, 1101 компонент.

Наша сторона — items из `registry/**/registry.json`, сгруппированные по
префиксу имени (`input-001` → `input`), потому что наши категории крупнее
(`inputs` включает input, select, switch и прочее) и по ним сравнивать
нечестно. Всего у нас 1355 items, из них 980 — `kind: component`.

По их 74 типам у нас 931 против 1101. **Разрыв — 221 item** (в 20 типах мы
впереди, поэтому суммарная разница меньше).

Типов, которых нет вовсе, **ни одного** — все 74 покрыты хотя бы одним
компонентом. Но это верно только на уровне файлов: в навигации витрины
половины типов не видно, см. следующий раздел.

## Главный разрыв — не количество, а таксономия

У них 74 категории в меню, у нас 32. Разница в том, что шесть наших
категорий — это корзины, внутрь которых свалено по полтора десятка разных
типов:

| наша категория | items | типов внутри | что спрятано                                                                                                                                                                          |
| -------------- | ----: | -----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inputs`       |   168 |           18 | cascader 20, input 15, file 10, field 10, inputgroup 10, select 9, switch 9, filters 9, textarea 8, radio 8, slider 8, rating 8, date 8, number 8, otp 7, currency 7, tags 7, range 7 |
| `display`      |   110 |           16 | item 10, collapsible 10, progress 9, skeleton 8, timeline 8, **tree 8**, scrollarea 7, sortable 7, kanban 7, separator 6, kbd 6, spinner 6, frame 6, icontile 6, iconstack 5, code 1  |
| `navigation`   |    79 |           10 | tabs 10, command 10, stepper 9, pagination 9, sidebar 9, menubar 8, contextmenu 8, navmenu 8, scrollspy 7, tabbar 1                                                                   |
| `feedback`     |    66 |            8 | toast 10, empty 9, tooltip 9, banner 8, popover 8, drawer 8, sheet 7, hovercard 7                                                                                                     |
| `charts`       |    31 |            3 | chart 22, gantt 7, sparkline 2                                                                                                                                                        |
| `menu`         |    19 |            2 | dropdown 12, menu 7                                                                                                                                                                   |

Итого 57 типов схлопнуты в 6 пунктов меню. Человек, которому нужен Tree или
Select, на витрине его не найдёт: нет ни пункта в списке категорий, ни
страницы `/components/tree`.

Разбить корзины на типы — отдельная задача, и она важнее, чем добить
количество: после разбивки в меню будет ~83 категории против их 74, а
`categories` у items меняются скриптом по префиксу имени, файлы двигать не
нужно.

## Дефицит по типам

| тип            | у них | у нас | не хватает |
| -------------- | ----: | ----: | ---------: |
| Input Group    |    40 |    10 |         30 |
| Select         |    33 |     9 |         24 |
| Input          |    31 |    15 |         16 |
| Frame          |    19 |     6 |         13 |
| Empty          |    20 |     9 |         11 |
| Icon Tile      |    17 |     6 |         11 |
| Toast (Sonner) |    21 |    10 |         11 |
| Radio Group    |    17 |     8 |          9 |
| Combobox       |    28 |    20 |          8 |
| Toggle Group   |    16 |     8 |          8 |
| Tooltip        |    16 |     9 |          7 |
| Dropdown Menu  |    18 |    12 |          6 |
| Pagination     |    15 |     9 |          6 |
| Spinner        |    12 |     6 |          6 |
| Stepper        |    15 |     9 |          6 |
| Toggle         |    14 |     8 |          6 |
| Label          |    13 |     8 |          5 |
| Switch         |    14 |     9 |          5 |
| Slider         |    12 |     8 |          4 |
| Timeline       |    12 |     8 |          4 |
| Chart          |    25 |    22 |          3 |
| Filters        |    12 |     9 |          3 |
| Popover        |    11 |     8 |          3 |
| Resizable      |    10 |     7 |          3 |
| Context Menu   |    10 |     8 |          2 |
| Item           |    12 |    10 |          2 |
| Skeleton       |    10 |     8 |          2 |
| Data Grid      |    30 |    29 |          1 |
| Field          |    11 |    10 |          1 |
| Hover Card     |     8 |     7 |          1 |
| Icon Stack     |     6 |     5 |          1 |
| Phone Input    |     8 |     7 |          1 |
| Rating         |     9 |     8 |          1 |
| Sortable       |     8 |     7 |          1 |

Первые семь строк — половина всего разрыва (116 items). Начинать с них.

## Где мы уже не отстаём

Ровно столько же: Accordion 11, Alert 20, Alert Dialog 14, Aspect Ratio 8,
Autocomplete 12, Avatar 35, Badge 25, Breadcrumb 15, Button 61,
Button Group 57, Calendar 30, Cascader 20, Checkbox 22, Code Block 27,
Collapsible 10, Event Calendar 5, File Upload 10, Gantt 7, Kbd 6,
Separator 6.

Больше, чем у них: Card 21/18, Table 20/17, Carousel 16/11, Dialog 14/10,
Tabs 10/9, Command 10/8, Progress 9/8, Date Selector 8/4,
Navigation Menu 8/4, Drawer 8/5, Menubar 8/5, Number Field 8/6,
Textarea 8/6, Tree 8/7, Scrollspy 7/2, Sheet 7/4, Scroll Area 7/5,
Input OTP 7/6, Kanban 7/6, Native Select 7/6.

## Чего нет у них, а у нас есть

Секции страниц (`kind: block`), которых в их каталоге компонентов нет
вообще: dashboard 92, commerce 79, solutions 55, auth 29, ai 19, pricing 19,
hero 16, features 15, navbar 13, sidebar 9, banner 8, footer 8, blog 6,
contact 6, cta 6, faq 6, testimonials 6, а также currency 7, tags 7,
range 7, menu 7, sparkline 2, tabbar 1.

Это 375 items и, по сути, отдельный продукт: у них библиотека примитивов,
у нас к ней добавлены готовые секции лендинга и приложения. Догонять по
компонентам имеет смысл, отказываться от блоков — нет.
