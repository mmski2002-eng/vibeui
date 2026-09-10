# Изображения для семейств основ (шапки, фоны, структуры, футеры)

Дата: 10 сентября 2026. Задача: реалистичные ИИ-изображения для компонентов
этапов 2–4 (H/B/S/F). Генерирует Codex по промптам ниже в указанную папку.
Код этим файлом не меняется — только ревизия и промпты.

## 0. Куда класть и как подключать

- Папка новых изображений: **`public/demo/foundations/`** (рядом с существующими
  `public/demo/{hero,places,scenes,products,cards,people,…}`).
- Формат: **`.webp`**, качество ~82, sRGB. Имена — строго как в таблице §3.
- Путь в компонент попадает **не хардкодом**, а пропом-строкой через
  `meta.preview.props` (русское превью) и `meta.i18n.en.preview.props`
  (английское) в `registry.json` соответствующей категории. Так же, как уже
  сделано у `blog`, `about`, `careers` (`image: "/demo/scenes/scene-03.webp"`).
- Переносимость не нарушается: распространяемый компонент изображение не тащит,
  он принимает путь/слот от проекта.

### Важное ограничение превью (прочитать до вайринга)

Превью рендерит `meta.preview.props` как **JSON**. Значит:

- **Строковый путь** (`src`, `poster`) — подставляется в превью сразу. Это
  `surface-007` и `surface-012`.
- **Слот `ReactNode`** (`media`, `visual`) нельзя задать из JSON. Это
  `footer-018`, `layout-013`, `layout-016`, `navbar-008`. В превью у них
  останется CSS-заглушка. Чтобы показать фото и в превью, нужен маленький
  рефактор: добавить строковый проп `src` рядом со слотом (слот приоритетнее,
  `src` — фолбэк). Рефактор помечен в §2 как «нужен src-фолбэк»; сделать после
  утверждения. Для реальных установок картинки нужны в любом случае — промпты
  готовы.

## 1. Общий стиль для ВСЕХ промптов (префикс)

Подставлять в начало каждого промпта из §3:

```
Realistic photograph, full-frame camera look, natural available light, calm and
restrained mood. Muted neutral palette only: cool greys, warm greige, deep
charcoal, soft off-white. IMPORTANT: no saturated orange, no red, no rainbow or
neon colors anywhere in the frame — the brand accent (#FF5900) is added by the
UI on top, so the photo must stay neutral and let orange stand out. No text, no
letters, no logos, no watermarks, no UI. Photographic realism, not illustration,
not 3D render, not CGI. Subtle natural film grain is fine. Composition leaves a
calmer, slightly darker area (as noted per shot) for text overlay. No visible
faces unless explicitly requested.
```

Бренд-логика: фото держит естественные приглушённые цвета, оранжевый живёт
только в интерфейсе поверх. Тёплый закат/неон — запрещены: они дерутся с
`#FF5900`. Это прямо из §3.1 плана основ (BREND.jfif).

## 2. Ревизия: где нужны изображения

Легенда: **строка** — проп-путь, фото видно в превью сразу; **слот** — нужен
src-фолбэк для превью; **CSS ок** — заглушка достаточна, фото не обязательно;
**reuse** — брать из существующей `public/demo/*`, генерация не нужна.

| Компонент | Что это | Изображение | Механизм | Действие |
| --- | --- | --- | --- | --- |
| `surface-007` | Фотографическая атмосфера | hero-фон | `src` (строка) | **новое** F-01/F-02 |
| `surface-012` | Кинематографический видеофон | постер | `poster` (строка) | **новое** F-03 (видео — вне scope, постер статикой) |
| `footer-018` | Кинематографический финал | медиа-фон | слот `media` | **новое** F-04, нужен src-фолбэк для превью |
| `navbar-008` | Шапка поверх фото | фон под шапкой | демо-CSS | **CSS ок** (в реале — фото проекта; для витрины градиент достаточен) |
| `layout-007` | Асимметричное портфолио | 5 работ | заглушки | **новое** F-05/F-07/F-08 + **reuse** |
| `footer-017` | Следующий проект | превью 21:9 | заглушка | **новое** F-05 (та же арх-широкая) |
| `layout-013` | Главы с закреплённой иллюстрацией | визуал | слот `visual` | **новое** F-06, нужен src-фолбэк |
| `layout-016` | Раскрытие медиа | кадр 16:9 | слот `media` | **новое** F-06, нужен src-фолбэк |
| `layout-019` | Покадровая история продукта | кадры предмета | заглушки | **новое** F-12 (+ можно reuse `products/*`) |
| `layout-012` | Результаты и карта | 4 объекта | заглушки | **новое** F-09/F-10/F-11 + **reuse** `places/*` |
| `layout-009` | Горизонтальная галерея | 6 карточек | заглушки | **reuse** `places/*` + новые stays F-09..11 |
| `layout-003` | Галерея товара | фото товара | заглушки | **reuse** `products/*` |
| `layout-002` | Каталог с фильтрами | фото товаров | заглушки | **reuse** `products/*` |
| `layout-006` | Редакционная сетка | ведущий+карточки | заглушки | **reuse** `scenes/*`, `cards/wide-*` |
| `navbar-014` | Вертикальная навигация студии | работы | заглушки | **reuse** `cards/*` |

Фоны без фото (CSS/SVG, изображения не нужны, подтверждено): `surface-001..006`,
`surface-008`, `surface-009`, `surface-010`, `surface-011`, `surface-013`,
`surface-014`. Шапки/каркасы/футеры без медиа — тоже без картинок.

Итог: **12 новых изображений** (F-01…F-12) закрывают фото-центричные семейства;
сетки/каталоги/ленты — на существующей библиотеке `public/demo/*`.

## 3. Новые изображения и промпты

К каждому промпту добавить префикс из §1. Размеры — целевые пиксели до сжатия в
webp. Где нужен тёмный участок под текст — указано.

### F-01 — `foundations/atmosphere-ridge.webp`
- Компонент: `surface-007` (основной), `navbar-008` (в реальной установке).
- Кадр: 1600×1000 (десктоп), дополнительно мобильный кроп 900×1200.
- Тёмная зона: нижняя треть (там текст и оранжевая кнопка).
- Промпт: `A mountain ridge at cold blue-hour dawn, thin mist between distant peaks, layered silhouettes fading into soft grey haze, a calm empty foreground plateau. Overcast diffused light, cool desaturated blue-grey and charcoal tones, quiet and premium. The lower third is darker and simpler for text overlay. Wide establishing landscape.`

### F-02 — `foundations/atmosphere-coast.webp`
- Компонент: `surface-007` (альтернативный кадр), альтернатива для `navbar-008`.
- Кадр: 1600×1000.
- Тёмная зона: нижняя половина.
- Промпт: `A foggy northern coastline, dark wet cliffs meeting a pale flat sea, low mist erasing the horizon, no sun. Muted slate-grey and greige palette, matte and restrained. A large calm area of sea and fog in the lower half for text overlay. Cinematic wide shot, quiet mood.`

### F-03 — `foundations/lobby-poster.webp`
- Компонент: `surface-012` (постер видеофона; сам ролик генерируется отдельно
  или остаётся постером).
- Кадр: 1600×900.
- Тёмная зона: низ.
- Промпт: `A minimalist hotel lobby at blue hour seen from inside, deep charcoal walls, pale stone floor, a few warm-white lamps kept small and dim, tall windows showing dusk. No people. Calm hospitality mood, neutral warm-grey palette, soft shadows, the lower portion darker for overlaid text. Still cinematic frame.`

### F-04 — `foundations/finale-evening.webp`
- Компонент: `footer-018` (кинематографический финал).
- Кадр: 1680×820 (широкий футер).
- Тёмная зона: верх и низ (заголовок и служебная строка).
- Промпт: `A modern mountain hotel exterior at dusk, concrete and dark timber facade, a few softly glowing warm interior windows kept small, pine forest around, deep blue evening sky. Muted cool palette with restrained warm glow, no orange sky. Dark sky at the top and dark ground at the bottom leaving room for large text. Wide cinematic architectural shot.`

### F-05 — `foundations/arch-slope-wide.webp`
- Компонент: `layout-007` (широкая работа), `footer-017` (превью следующего проекта).
- Кадр: 1680×720 (21:9).
- Промпт: `A contemporary house built into a grassy hillside, board-formed concrete and weathered wood, large flush glazing, overcast soft daylight. Restrained architectural photography, cool neutral greens and greys, no sun flare. Balanced wide 21:9 composition, calm and premium.`

### F-06 — `foundations/interior-workshop.webp`
- Компонент: `layout-013` (закреплённый визуал), `layout-016` (раскрытие медиа).
- Кадр: 1600×900 (16:9).
- Промпт: `A minimal design studio interior lit by soft north-facing window light, pale plaster walls, a long light-oak worktable, a few matte tools and paper, plants kept muted green. No people, no screens on. Neutral warm-greige palette, gentle shadows, airy and quiet. Clean 16:9 composition.`

### F-07 — `foundations/interior-stair-tall.webp`
- Компонент: `layout-007` (вертикальная работа `tall`).
- Кадр: 960×1280 (3:4).
- Промпт: `A sculptural concrete spiral staircase in a quiet gallery, single shaft of soft daylight from above, deep charcoal shadows, pale grey walls. Vertical architectural photograph, moody and restrained, cool neutral tones, strong geometry. 3:4 portrait framing.`

### F-08 — `foundations/photo-series-still.webp`
- Компонент: `layout-007` (работа `photography`, тёплый тон).
- Кадр: 1200×900 (4:3).
- Промпт: `A quiet still-life of a few matte ceramic and stone objects on a dark oak table, museum-style soft directional light, deep shadow background. Warm-neutral muted palette (never orange), fine texture, contemplative mood. Balanced 4:3 studio composition.`

### F-09 — `foundations/stay-cabin.webp`
- Компонент: `layout-012`, `layout-009` (объект «дом у озера»).
- Кадр: 1200×900 (4:3).
- Промпт: `A small timber cabin by a still forest lake at overcast morning, dark stained wood, large window, pale calm water, pine forest behind. Muted cool greens and greys, soft flat light, serene and premium. Real-estate quality 4:3 exterior.`

### F-10 — `foundations/stay-loft.webp`
- Компонент: `layout-012`, `layout-009` (объект «квартира-студия»).
- Кадр: 1200×900 (4:3).
- Промпт: `A bright minimalist city loft interior, pale microcement floor, white walls, a low grey sofa, tall industrial window with soft overcast light, a few muted plants. No people. Neutral airy palette, calm and clean, 4:3 interior real-estate shot.`

### F-11 — `foundations/stay-mansard.webp`
- Компонент: `layout-012`, `layout-009` (объект «мансарда»).
- Кадр: 1200×900 (4:3).
- Промпт: `A cozy attic room with a large sloped skylight letting in soft grey daylight, whitewashed beams, pale linen bed, warm-neutral wood floor. Calm restrained palette, no warm color cast, gentle shadows. 4:3 interior real-estate shot.`

### F-12 — `foundations/object-hero-dark.webp`
- Компонент: `layout-019` (кадр предмета), запасной продуктовый hero.
- Кадр: 1600×900 (16:9).
- Тёмная зона: фон целиком тёмный (студия).
- Промпт: `A matte industrial device — a compact brushed-aluminium and dark-grey instrument — on a seamless deep charcoal studio backdrop, single soft neutral key light from upper right, gentle falloff into black, subtle reflection on the surface below. No branding, no orange light. Product-hero macro, precise and premium, 16:9.`

## 4. Reuse: существующие изображения (генерация не нужна)

Перед использованием проверить глазами, что кадр не спорит с оранжевым (см. §1);
если спорит — сгенерировать замену по образцу ближайшего промпта §3.

| Компонент | Проп | Брать из |
| --- | --- | --- |
| `layout-002` каталог мебели | `cards[].` фото | `public/demo/products/product-01..08.webp` |
| `layout-003` галерея товара | кадры | `public/demo/products/*` (2–3 ракурса) |
| `layout-006` редакционная сетка | ведущий/карточки | `public/demo/scenes/*`, `public/demo/cards/wide-*.webp` |
| `layout-009` лента (доп. карточки) | `cards[]` | `public/demo/places/place-01..08.webp` |
| `layout-012` карта (доп. объект) | `items[]` | `public/demo/places/*` |
| `navbar-014` вертикальная студия | работы | `public/demo/cards/portrait-*, square-*` |

## 5. Вайринг после генерации (порядок для Codex/исполнителя)

1. Сложить F-01…F-12 в `public/demo/foundations/` с именами из §3.
2. Проставить пути в `registry.json` соответствующих категорий:
   - `surface-007`: `meta.preview.props.src = "/demo/foundations/atmosphere-ridge.webp"`,
     `alt`, `focus: "center 40%"`; то же в `i18n.en.preview.props`.
   - `surface-012`: `meta.preview.props.poster = "/demo/foundations/lobby-poster.webp"` (+ en).
   - Остальные (слот `ReactNode`) — сперва мелкий рефактор «src-фолбэк» (§2),
     затем путь в `preview.props`.
3. `npm run meta:validate` — зелёный; открыть `/preview/<slug>` и проверить кадр
   и контраст текста на светлом участке.
4. Мобильные кропы (F-01) подключать через `<picture>`/отдельный проп в реальном
   проекте; для витрины достаточно десктопного кадра.

## 6. Границы

Видео для `surface-012` этим файлом не заказывается — постер F-03 закрывает
статический режим (основной по правилам B12). WebGL-фоны `background-001..005`
(B13–B17) — отдельная задача бренд-адаптации, изображений не требуют.
