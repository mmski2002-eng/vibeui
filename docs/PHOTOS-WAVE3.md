# Фото: остаток серии (обложки и возможности)

Третья волна, 14 файлов. Первые две (`cards`, `products`, `people`,
`avatars`, `scenes`, `hero`, `places`, `screens`) уже в `public/demo/` —
128 файлов, стиль оттуда держать один в один.

Скопировать целиком от `=== ПРОМПТ ===` до `=== КОНЕЦ ===` и отправить как
есть. Подключением в коде занимается Claude, Codex только кладёт файлы.

Из первоначального плана выпали:
- `logos/` (12 шт) — не нужны: `logocloud-001…006` рисуют wordmark текстом,
  разными гарнитурами, файлы там были бы лишними;
- отдельные постеры под видео — превью роликов берут кадры из `scenes/`.

=== ПРОМПТ ===

Ты работаешь в репозитории VibeUI (Next.js). Задача: сгенерировать
14 изображений и положить их в `public/demo/`. В коде ничего не менять,
только файлы картинок. Папки `posters/` и `features/` создать.

Это продолжение уже сделанной серии. В `public/demo/` лежат 128 готовых
файлов (`products`, `people`, `avatars`, `scenes`, `hero`, `places`,
`screens`, `cards`) — новые кадры обязаны выглядеть их частью: та же
цветовая температура, та же зернистость, тот же оранжевый ключ.
Перед началом посмотреть 3–4 файла из `public/demo/scenes/` и
`public/demo/hero/` и попасть в их грейдинг.

## Технические требования

- Формат: WebP, качество 82, без метаданных.
- Точные размеры — в таблицах ниже, отклонения недопустимы.
- Сюжет в центре кадра с запасом ~15 % по краям: обложки дополнительно
  режутся под круг и мелкие превью, широкие — под 16:9 (`object-fit: cover`).
- Вес: обложки до 60 КБ, широкие до 80 КБ. Не уложился — снизить качество
  до 78, не менять размер.
- Без текста, надписей, логотипов, водяных знаков, интерфейсных элементов,
  без рамок и скруглений — кадрирует CSS.
- Если генератор не умеет WebP — сохранить PNG и сконвертировать
  (`sharp`, `cwebp` или PIL) в нужный размер.
- Итог проверить: `ls public/demo/posters` — ровно 6 файлов,
  `ls public/demo/features` — ровно 8, имена из таблиц, размеры через
  `identify`/`sharp`/PIL.

## Единый стиль серии (добавлять к каждому промпту)

> Cinematic photography, consistent series. Dark, moody grading: deep blacks
> (#000–#1A1A1A), off-white highlights (#F2F2F2), one vivid orange accent
> (#FF5900) as rim light, sunset glow, neon or a single orange object. High
> contrast, shallow depth of field, 50 mm look, fine film grain, natural skin
> tones, no text, no logos, no watermarks, no borders. Premium, restrained,
> editorial. Subject centered with breathing room on every side.

Оранжевый #FF5900 — фирменный цвет проекта. Он в кадре один и работает
источником света или единственным цветным предметом, не заливкой и не
фильтром поверх всей картинки. Остальное — чёрное, серое, тёплая кожа.
Люди: настоящие лица разных возрастов и этничностей, естественные эмоции,
без известных личностей, без детей.

## Набор A — обложки, квадрат 1:1, 900×900 px → `public/demo/posters/`

Обложки выпусков подкаста. Их показывают и крупно, и кружком 48 px, поэтому
сюжет читается силуэтом: один объект, никакой мелкой детали.

| Файл | Промпт сюжета |
| --- | --- |
| `poster-01.webp` | Vintage ribbon microphone in a dark studio, single orange light behind it, black background, heavy vignette |
| `poster-02.webp` | Overhead shot of studio headphones on black felt, one orange cable coiled beside them |
| `poster-03.webp` | Silhouette of a woman speaking into a microphone, orange backlight through haze, face in shadow |
| `poster-04.webp` | Close-up of an analog mixing console, black knobs, one orange fader lit, shallow focus |
| `poster-05.webp` | Sound wave drawn by orange neon tube on a black concrete wall, soft glow, no text |
| `poster-06.webp` | Two people in profile facing each other across a dark table, warm orange lamp between them, conversation |

## Набор B — возможности, 16:10, 1200×750 px → `public/demo/features/`

Иллюстрации к разделу «возможности продукта». Не абстракции: каждый кадр —
предметная сцена, по которой понятно, о чём пункт. Кадры уходят под текст,
поэтому левая треть каждого держится спокойной, без ключевого объекта.

| Файл | Промпт сюжета |
| --- | --- |
| `feature-01.webp` | Designer's desk from above, dark wood, open laptop with dim screen, orange sticky notes fanned out, warm side light |
| `feature-02.webp` | Two colleagues at a whiteboard covered in diagrams, backlit by an orange window, dark office |
| `feature-03.webp` | Close-up of hands typing on a mechanical keyboard, orange keycaps on the home row, black desk, night |
| `feature-04.webp` | Server room corridor at night, black racks, a single orange status light in the distance, long perspective |
| `feature-05.webp` | Macro of a fiber optic cable end glowing orange, black background, extreme shallow depth of field |
| `feature-06.webp` | Woman reviewing printed layouts pinned to a dark wall, orange desk lamp raking across the paper |
| `feature-07.webp` | Courier handing a parcel across a counter at dusk, orange street light behind, dark interior |
| `feature-08.webp` | Time-lapse look of a dark city intersection from above, orange light trails, black asphalt |

=== КОНЕЦ ===
