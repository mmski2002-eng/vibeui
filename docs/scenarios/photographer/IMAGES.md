# Картинки для сценария «Портфолио фотографа»

Папка: `public/demo/photographer/`. Формат webp, качество 82, длинная сторона
1600px (аватары 512px). Без текста, водяных знаков, логотипов и лишних
пальцев. Одна серия: снято одним автором в одном городе.

## Общий стиль (добавлять к каждому промпту)

```
Photorealistic candid photograph, shot on 35mm film (Kodak Portra 400 look),
natural available light, soft warm muted palette, gentle grain, shallow depth
of field, unposed genuine moment, Saint Petersburg, Russia. No text, no
watermark, no logos. Editorial documentary style, not stock photo.
```

## Список

| Файл | Формат | Промпт |
| --- | --- | --- |
| `hero.webp` | 3:2, 1600×1067 | Young woman photographer in her early 30s, dark hair tied loosely, holding a film camera at chest level and laughing at someone off-frame, standing on a granite embankment of the Neva at golden hour, blurred bridge behind, wind in hair, linen shirt |
| `work-01.webp` | 4:5, 1280×1600 | Bride and groom walking barefoot along a pebble shore of Lake Ladoga at dusk, holding hands, backs half-turned to camera, pine trees and pale water, wedding dress hem wet |
| `work-02.webp` | 4:5, 1280×1600 | Close portrait of a woman in her 40s with freckles and grey streaks, looking straight into camera without smiling, window light from the left, plain plaster wall, no retouching feel |
| `work-03.webp` | 3:2, 1600×1067 | Family of four at a wooden dacha table in a garden, grandmother pouring tea from a samovar, child reaching for a bowl of cherries, dappled midday light through apple trees |
| `work-04.webp` | 3:2, 1600×1067 | Early morning on Vasilievsky Island, empty street with tram tracks, a man in a coat crossing with a paper bag, low sun flare, long shadows, wet cobblestones |
| `work-05.webp` | 4:5, 1280×1600 | Young actress in a black turtleneck sitting on a windowsill of an old apartment, high ceiling with stucco, she looks out the window, cigarette-free, thoughtful, side light |
| `work-06.webp` | 3:2, 1600×1067 | Civil wedding ceremony in a small old registry hall, couple signing papers, elderly registrar smiling, guests blurred, warm lamps, wooden panelling |
| `work-07.webp` | 4:5, 1280×1600 | Six-month-old baby lying on a linen blanket on the floor, grabbing his own foot and laughing, mother's hands at the edge of frame, soft north window light |
| `work-08.webp` | 3:2, 1600×1067 | Nevsky Prospekt in heavy rain, people under umbrellas crossing at a green light, reflections of shop lights on wet asphalt, motion blur on a passing bus |
| `about.webp` | 4:5, 1280×1600 | The same woman photographer from hero.webp, in a small home studio, sitting on the floor sorting prints spread around her, film cameras on a shelf, plants, honest tired smile, overcast window light |
| `next.webp` | 16:9, 1600×900 | Wedding reception at night by a lake, bonfire on the shore, garlands of warm bulbs between pines, silhouettes of dancing guests, embers rising, long exposure feel |

## Куда что идёт

- `hero.webp` — первый экран.
- `work-01…08.webp` — галерея, порядок как в списке (чередуются жанры).
- `about.webp` — блок «Обо мне».
- `next.webp` — подвал «Следующая история».

## Дополнительно

| Файл | Формат | Промпт |
| --- | --- | --- |
| `about.webp` (вариант 2) | 4:5, 1280×1600 | Waist-up portrait of the same woman photographer from hero.webp in a small home studio, face fully visible and sharp, looking slightly off-camera with an honest tired smile, holding a stack of printed photos, film cameras on a shelf and plants behind, overcast window light from the side. Head fully inside the frame with room above |
| `logo.png` | 1:1, 512×512, прозрачный фон | Minimal hand-drawn ink doodle of a vintage film camera, single-line sketch style, slightly wobbly pen stroke, black ink on transparent background, no text, no shading, centered, sticker-like |

`logo.png` не обязателен: у рукописной шапки фотоаппарат нарисован в SVG и кипит вместе с остальным. Картинка подставляется пропом `logo`.
