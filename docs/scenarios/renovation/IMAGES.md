# Картинки для сценария «Ремонт квартир / строительная бригада»

Папка: `public/demo/renovation/`. Формат webp, качество 82. Без текста,
водяных знаков, логотипов и людей крупным планом. Одна серия: московская
квартира, дневной свет из окна, честная документальная съёмка «как есть»,
без стилиста и HDR.

## Общий стиль (добавлять к каждому промпту)

```
Photorealistic documentary interior photograph, natural daylight from a
window, neutral white balance, wide-angle 24mm, eye level, straight
verticals, no people, no text, no watermark, no logos, no HDR look.
```

## Список

| Файл | Формат | Промпт |
| --- | --- | --- |
| `before-01.webp` | 4:3, 1600×1200 | A living room in a 1970s Soviet panel apartment before renovation: peeling wallpaper, worn parquet, an old chandelier, a built-in wardrobe, dusty window, seen from the doorway |
| `after-01.webp` | 4:3, 1600×1200 | The same living room after a full renovation from exactly the same doorway viewpoint: warm oak engineered flooring, matte white walls, slim black window frame, hidden skirting, one linen sofa |
| `before-02.webp` | 4:3, 1600×1200 | A new-build apartment shell before finishing: bare concrete walls and floor, exposed ducts, a window without sill, plaster buckets, seen from the room corner |
| `after-02.webp` | 4:3, 1600×1200 | The same room after a designer renovation from the same corner: microcement floor, flush hidden doors, ceiling curtain track, warm grey walls, built-in oak shelving |
| `before-03.webp` | 4:3, 1600×1200 | A small rental studio before cosmetic renovation: yellowed wallpaper, scratched laminate, old radiator, cramped kitchenette, from the entrance |
| `after-03.webp` | 4:3, 1600×1200 | The same studio after a quick cosmetic renovation from the same entrance viewpoint: fresh white paint, new grey laminate, new white radiator, clean compact kitchen |
| `site-01.webp` | 3:2, 1500×1000 | A bathroom mid-renovation: large-format light grey porcelain tiles freshly laid on walls, tile levelling clips still in the joints, a bucket of epoxy grout, work lamp light |
| `site-02.webp` | 3:2, 1500×1000 | Boxes of oak engineered flooring stacked in an empty bedroom for acclimatisation, fresh screed floor, primed walls, daylight from a window |

## Куда что идёт

- `before-0N.webp` / `after-0N.webp` — три пары для шторки «до/после»
  (`renovation-003`): один и тот же ракурс обязателен, иначе сравнение не
  читается.
- `site-01.webp`, `site-02.webp` — фото в ленте отчётов «стройка онлайн»
  (`renovation-004`).
- Бригада (`people-017`) — без фото, монограммы; если появятся портреты,
  проп `photo`, квадрат 1:1, 800×800.
