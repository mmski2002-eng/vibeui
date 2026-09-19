# Картинки для сценария «Личный сайт писателя»

Папка: `public/demo/writer/`. Формат webp, качество 82. Без текста, водяных
знаков и логотипов. Одна серия: тихий кабинет писателя, тёплый графит и
бумага, сепия, мягкий боковой свет из окна. Сейчас на месте фото лежат
цветные плейсхолдеры-градиенты с теми же именами.

## Общий стиль (добавлять к каждому промпту)

```
Photorealistic quiet editorial photograph, soft window side light, warm
graphite and paper palette with sepia accents, shallow depth of field,
film grain, no text, no watermark, no logos, no screens.
```

## Список

| Файл | Формат | Промпт |
| --- | --- | --- |
| `portrait.webp` | 3:4, 1200×1600 | A woman writer in her late thirties seated by a window, three-quarter view, face turned slightly away and softly lit, dark wool sweater, calm expression, blurred bookshelves behind |
| `desk.webp` | 3:2, 1600×1067 | A writer's desk seen from above at an angle: an open squared notebook with handwriting, a 2B pencil, a ceramic cup with tea, a folded newspaper, warm light from the left |
| `cover.webp` | 2:3, 1200×1800 | A hardcover book cover design: matte dark graphite paper texture with a single warm sepia rectangle and an embossed thin frame, minimal, no letters, no title |

## Куда что идёт

- `cover.webp` — обложка 3D-книги в `writer-001` (заголовок и автор
  накладываются блоком поверх картинки).
- `portrait.webp` — высокая плитка «портрет» в `bento-014`.
- `desk.webp` — широкая плитка «рабочий стол» в `bento-014`.
