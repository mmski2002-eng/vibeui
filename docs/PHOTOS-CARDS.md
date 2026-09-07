# Фото для стопок карточек (`registry/animations/stacks`)

Ниже — один большой промпт для Codex. Скопировать целиком от строки
`=== ПРОМПТ ===` до `=== КОНЕЦ ===` и отправить как есть. После генерации
в коде ничего менять не нужно: пути уже прописаны в
`registry/animations/stacks/registry.json` (`meta.preview.props`).

=== ПРОМПТ ===

Ты работаешь в репозитории VibeUI (Next.js). Задача: сгенерировать
17 демонстрационных фотографий для компонентов «стопки карточек» и положить
их в `public/demo/cards/`. Сейчас там лежат временные плейсхолдеры с теми же
именами — перезаписать их. Ничего в коде не менять, только файлы картинок.

## Технические требования

- Формат: WebP, качество 82, без метаданных.
- Три набора с разными пропорциями (ниже точные размеры и имена).
- Сюжет держать в центре кадра с запасом ~15 % по краям: портретные файлы
  дополнительно режутся под квадрат, широкие — под 4:3 (`object-fit: cover`).
- Без текста, логотипов, водяных знаков, интерфейсных элементов.
- Итог проверить: `ls public/demo/cards` должен показать ровно 17 файлов из
  списка ниже, размеры — через `identify`/`sharp`/PIL.
- Если инструмент генерации не умеет WebP, сохранить PNG и сконвертировать
  (`sharp`, `cwebp` или PIL) в нужный размер.

## Единый стиль серии (добавлять к каждому промпту)

> Cinematic photography, consistent series. Dark, moody grading: deep blacks
> (#000–#1A1A1A), off-white highlights (#F2F2F2), one vivid orange accent
> (#FF5900) as rim light, sunset glow, neon or a single orange object. High
> contrast, shallow depth of field, 50 mm look, fine film grain, natural skin
> tones, no text, no logos, no watermarks, no borders. Premium, restrained,
> editorial. Subject centered with breathing room on every side.

Люди: настоящие лица разных возрастов и этничностей, естественные эмоции,
без известных личностей, без детей. Природа: реальные ландшафты без
фантастики. Всё в одной цветовой температуре — тёплый оранжевый ключ на
холодном тёмном фоне.

## Набор A — портрет 3:4, 900×1200 px (веера и CoverFlow)

| Файл | Промпт сюжета |
| --- | --- |
| `portrait-01.webp` | Close-up portrait of a young woman with freckles, side-lit by warm orange light, dark background, looking slightly off camera |
| `portrait-02.webp` | Portrait of a bearded man in his 40s wearing a black hoodie, orange rim light on the edge of his face, calm expression |
| `portrait-03.webp` | Mountain ridge at sunset, last orange light on the peaks, deep blue-black valleys, thin mist |
| `portrait-04.webp` | Portrait of a laughing elderly woman with silver hair, warm orange window light, dark room |
| `portrait-05.webp` | Lone pine tree on a cliff above a dark sea, orange horizon line, long exposure water |
| `portrait-06.webp` | Portrait of a young Black man in profile, sweat on skin, orange stage light, black background |
| `portrait-07.webp` | Desert dunes at dusk, orange crest lit by the sun, black shadows, one small human figure far away |

## Набор B — квадрат 1:1, 900×900 px (дуговая карусель)

| Файл | Промпт сюжета |
| --- | --- |
| `square-01.webp` | Portrait of a woman with short dark hair in a black turtleneck, half of her face in orange light |
| `square-02.webp` | Forest road in fog at dawn, orange sun breaking through dark trees |
| `square-03.webp` | Close-up of hands holding a steaming ceramic cup, orange lamp glow, dark table |
| `square-04.webp` | Night city street after rain, black asphalt, orange neon reflections, no readable signs |
| `square-05.webp` | Portrait of an Asian man in his 30s with glasses, orange reflection in the lenses, dark background |

## Набор C — широкий 16:10, 1200×750 px (стопка Time Machine)

| Файл | Промпт сюжета |
| --- | --- |
| `wide-01.webp` | Wide shot of a calm lake at sunset, orange sky mirrored in black water, silhouette of a distant shore |
| `wide-02.webp` | Wide portrait: two friends sitting on a rooftop at dusk, backs to camera, orange city glow ahead |
| `wide-03.webp` | Wide shot of a dark coastline, orange lighthouse beam cutting the fog |
| `wide-04.webp` | Wide shot of an empty highway at night, orange sodium lamps, black hills |
| `wide-05.webp` | Wide shot of a snowy field at blue hour, one cabin window glowing orange |

## Готово, когда

- 17 файлов на месте, старые плейсхолдеры перезаписаны;
- размеры точно 900×1200 / 900×900 / 1200×750;
- серия выглядит как один фотосет: одинаковая температура света, один
  характер зерна, оранжевый — единственный цветной акцент.

=== КОНЕЦ ===

## Проверка глазами после генерации

`/animations/stacks` — карточки каталога, затем `/animations/stack-001` …
`/animations/stack-012`, обе темы, три устройства в превью.
