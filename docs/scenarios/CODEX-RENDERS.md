# Промпт для Codex: рендеры-вырезки взамен CSS-рисунков

Скопировать всё между `---` и отправить Codex в репозитории VibeUI.

---

Сгенерируй набор картинок-«вырезок» (объект на прозрачном фоне) для трёх
сценариев VibeUI. Ими заменяются предметы, которые сейчас нарисованы CSS/SVG
и выглядят плохо. Ничего в коде не менять — только создать файлы.

**Формат.** PNG с прозрачным фоном (alpha), без текста, водяных знаков и
логотипов. Объект целиком в кадре, с отступом 4–6 % от краёв. Свет мягкий
студийный, лёгкая тень под объектом допустима только если сказано. Если
прозрачный фон сделать нельзя — сохранить на ровном фоне `#000000` для
gadget и `#ffffff` для vet/delivery/flowers, я вырежу сам. Имя файла
ровно как в таблице.

## 1. `gadget` — умная лампа-будильник «Луч» → `public/demo/gadget/`

Общий стиль для всех кадров лампы (добавлять к промпту):

```
Product render of a smart sunrise alarm lamp: a compact matte-black
anodised-aluminium cylinder about 18 cm tall, a frosted opal-white
diffuser ring on top that glows warm amber, a small brass rotary dial on the
front, a fine speaker grille of tiny holes around the lower third, a
silicone base ring. Minimal industrial design in the spirit of Teenage
Engineering / Braun. Photorealistic, studio softbox lighting, 8k, isolated
on transparent background, no text, no logo.
```

| Файл | Формат | Промпт |
| --- | --- | --- |
| `lamp-front.png` | 4:5, 1200×1500 | The lamp seen straight from the front at eye level, diffuser glowing soft amber, dial centred, subtle contact shadow directly under the base |
| `lamp-three-quarter.png` | 4:5, 1200×1500 | The same lamp from a three-quarter view, slightly from above, diffuser glowing warm, brass dial catching a highlight, subtle contact shadow |
| `lamp-off.png` | 4:5, 1200×1500 | The same lamp from the front, switched off: diffuser plain matte white, no glow, neutral daylight, subtle contact shadow |
| `lamp-top.png` | 1:1, 1200×1200 | The same lamp seen exactly from above, showing the round glowing diffuser as a full amber disc with a soft falloff, no shadow |
| `lamp-white.png` | 4:5, 1200×1500 | The same lamp in a warm off-white ceramic-look body colour, front view, diffuser glowing, subtle contact shadow |
| `lamp-sand.png` | 4:5, 1200×1500 | The same lamp in a warm sand-beige body colour, front view, diffuser glowing, subtle contact shadow |
| `exploded.png` | 3:4, 1200×1600 | Exploded-view render of the same lamp: five parts stacked vertically with even gaps, from top to bottom — the opal diffuser ring, a small green circuit board with sensors, the round speaker driver, the black aluminium body shell, the silicone base ring; front view, each part fully visible, no lines or labels, no shadow |

Все кадры лампы — один и тот же объект, одинаковые пропорции и ракурс
камеры, чтобы картинки можно было подменять друг другом без сдвига.

## 2. `vet` — ветклиника «Лапа» → `public/demo/vet/`

Общий стиль:

```
Photorealistic studio photograph of a real animal, full body visible,
calm pose, soft even lighting, warm neutral tones, isolated on transparent
background, no props, no text, no watermark.
```

| Файл | Формат | Промпт |
| --- | --- | --- |
| `dog-profile.png` | 3:2, 1600×1067 | A medium-sized short-haired dog (beagle-like) standing in full side profile facing left, all four legs and tail visible, relaxed, head slightly turned to the camera — used as a body map with hotspots, so the silhouette must be clean and unobstructed |
| `dog-fluffy.png` | 4:5, 1024×1280 | A fluffy long-haired small dog (Pomeranian or Bichon) sitting facing the camera, very full untrimmed coat, cheerful — used for the grooming "before" state |
| `dog-trimmed.png` | 4:5, 1024×1280 | The same fluffy small dog, same pose and framing, after a neat short grooming cut: short even coat, tidy face, same colour — used for the grooming "after" state |
| `cat-face.png` | 1:1, 1200×1200 | Close-up of a calm ginger tabby cat looking straight at the camera, head and shoulders, whiskers sharp — replaces a CSS-drawn cat face in the hero |
| `dog-face.png` | 1:1, 1200×1200 | Close-up of a friendly corgi looking straight at the camera, head and shoulders, tongue slightly out — hero switch "dog" |
| `rabbit-face.png` | 1:1, 1200×1200 | Close-up of a grey lop-eared rabbit looking at the camera, head and shoulders — hero switch "rabbit" |

Три «face» кадра — одинаковое кадрирование и размер головы в кадре,
чтобы переключатель менял животное без прыжка.

## 3. `delivery` — доставка еды «Горячо» → `public/demo/delivery/`

Общий стиль:

```
Photorealistic food photograph, shot from a 45° angle, dramatic warm
side light, appetising, glossy, isolated on transparent background, no
plate shadow bleeding outside the plate, no text, no watermark.
```

| Файл | Формат | Промпт |
| --- | --- | --- |
| `burger-cut.png` | 1:1, 1400×1400 | A tall double smash burger on a black slate coaster, sesame brioche bun, melted cheddar dripping, caramelised onion, one half cut away to show the layers, steam wisps — hero object |
| `bowl-base.png` | 1:1, 1200×1200 | Top-down view of an empty matte-black ceramic bowl with a bed of white rice inside, nothing else — base layer of a bowl builder |
| `bowl-salmon.png` | 1:1, 1200×1200 | Top-down view of the same black bowl with rice and a portion of grilled salmon cubes only, same camera and framing as bowl-base |
| `bowl-chicken.png` | 1:1, 1200×1200 | Same bowl and framing with rice and grilled chicken slices only |
| `bowl-shrimp.png` | 1:1, 1200×1200 | Same bowl and framing with rice and grilled shrimps only |
| `bowl-full.png` | 1:1, 1200×1200 | Same bowl and framing, a complete poke bowl: rice, salmon, avocado, edamame, mango, sesame, a drizzle of sauce |

Все `bowl-*` — строго один и тот же ракурс и положение миски, чтобы слои
можно было накладывать друг на друга.

## 4. `flowers` — мастерская «Стебель» → `public/demo/flowers/`

Общий стиль:

```
Photorealistic photograph of a single fresh flower stem, full length
from bloom to cut end, natural daylight, botanical-catalogue feel, isolated
on transparent background, no vase, no text, no watermark.
```

| Файл | Формат | Промпт |
| --- | --- | --- |
| `stem-peony.png` | 1:3, 500×1500 | One pink peony stem with two leaves, bloom open, stem straight and vertical |
| `stem-poppy.png` | 1:3, 500×1500 | One red poppy stem with a slight natural curve, bloom open |
| `stem-chamomile.png` | 1:3, 500×1500 | One white chamomile stem with several blooms |
| `stem-ranunculus.png` | 1:3, 500×1500 | One coral ranunculus stem, bloom open |
| `stem-lavender.png` | 1:3, 500×1500 | One lavender stem with a long purple spike |
| `stem-eucalyptus.png` | 1:3, 500×1500 | One silver-dollar eucalyptus branch |
| `vase.png` | 1:1, 1200×1200 | An empty simple clear-glass cylinder vase with a little water, front view, on transparent background — stems will be placed behind its rim |

Стебли — одна высота и одинаковое положение среза (низ кадра), чтобы
складывать в вазу без подгонки.

## 5. `bakery` — кофейня «Корка» → `public/demo/bakery/`

| Файл | Формат | Промпт |
| --- | --- | --- |
| `cup-empty.png` | 4:5, 1024×1280 | Photorealistic clear double-wall glass cup, empty, front view at eye level, soft daylight, isolated on transparent background, no text |
| `cup-latte.png` | 4:5, 1024×1280 | The same glass cup, same framing, filled with a flat white: milk on top, coffee below, visible layer line |
| `cup-espresso.png` | 4:5, 1024×1280 | The same glass cup, same framing, a third full of dark espresso with crema |

## Порядок и отчёт

Идти по разделам сверху вниз, после каждого — короткий отчёт: сколько
файлов записано, что не удалось (например, не получился прозрачный фон —
тогда какой фон использован). Ничего не коммитить и не пушить.

---
