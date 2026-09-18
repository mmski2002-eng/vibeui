# Картинки для сценария «Кофейня-пекарня»

Папка: `public/demo/bakery/`. Формат webp, качество 82, длинная сторона
1600px (портреты 1024×1280, квадраты 1200). Без текста, водяных знаков,
логотипов и читаемых вывесок. Одна серия: одна пекарня, одно утро, один
фотограф. Look — дневной и чистый: мягкий свет из большого окна, светлые
стены, светлый дуб и белая плитка, **без тёплого оранжевого фильтра и без
мешковины**. Современная городская пекарня, не деревенская.

## Герои (добавлять к промптам с людьми)

```
Olga: woman, 38, Slavic features, dark hair tied back under a linen cap,
freckles, flour on forearms, wears a light grey apron over a white tee,
calm focused expression.
Timur: man, 27, Central Asian features, short black hair, neat beard,
wears a dark green apron over a black tee, silver ring, friendly relaxed
look.
```

## Общий стиль (добавлять к каждому промпту)

```
Photorealistic editorial photograph of a modern city bakery-café, soft
daylight from a large window, light neutral palette (milk white, pale
oak, white tiles, charcoal details), crisp textures of bread crust and
flour, shallow depth of field, no text, no watermark, no logos, no
readable signage, no warm orange color grading.
```

## Список

| Файл | Формат | Промпт |
| --- | --- | --- |
| `hero.webp` | 4:5, 1280×1600 | Morning bakery counter seen from the customer side: glass display with croissants, sourdough loaves on wooden boards behind, a barista's hands blurred at the espresso machine, steam, window light from the left |
| `shelf.webp` | 16:9, 1600×900 | Wide shot of pale oak shelves with sourdough loaves standing in a row, each with a different scoring pattern, flour dust on the shelf edge, white tile wall |
| `item-01.webp` | 1:1, 1200×1200 | Single sourdough country loaf with an ear-shaped score, on a light concrete surface, three-quarter view, soft top light — **все `item-*` в одном ракурсе, на одной поверхности, одинаковый свет** |
| `item-02.webp` | 1:1, 1200×1200 | Single butter croissant, glossy layers, same surface and angle as item-01 |
| `item-03.webp` | 1:1, 1200×1200 | Single cinnamon bun with glaze, same surface and angle |
| `item-04.webp` | 1:1, 1200×1200 | Slice of rosemary focaccia with sea salt, same surface and angle |
| `item-05.webp` | 1:1, 1200×1200 | Rye loaf with cracked dark crust and a dusting of flour, same surface and angle |
| `item-06.webp` | 1:1, 1200×1200 | Cardamom knot bun, same surface and angle |
| `item-07.webp` | 1:1, 1200×1200 | Two baguettes leaning, same surface and angle |
| `item-08.webp` | 1:1, 1200×1200 | Pain au chocolat, cut to show the layers, same surface and angle |
| `coffee-flat.webp` | 1:1, 1200×1200 | Flat white in a white ceramic cup with rosetta latte art, top-down, pale oak table |
| `coffee-espresso.webp` | 1:1, 1200×1200 | Double espresso in a small glass with thick crema, side view at table height, steam |
| `beans.webp` | 3:2, 1600×1067 | Close-up of roasted coffee beans spilling from a paper bag onto a light surface, one green bean among them |
| `story-01.webp` | 3:2, 1600×1067 | Evening: hands mixing sourdough in a large steel bowl, kitchen with warm overhead light, window dark behind |
| `story-02.webp` | 3:2, 1600×1067 | Night: dough resting in linen-lined baskets on a rack inside a walk-in fridge, cool blue light |
| `story-03.webp` | 3:2, 1600×1067 | Pre-dawn: baker loading loaves into a deck oven with a wooden peel, glow of the oven the only light |
| `story-04.webp` | 3:2, 1600×1067 | Morning: first batch of loaves cooling on wire racks, steam rising, first daylight from the window |
| `story-05.webp` | 3:2, 1600×1067 | Close-up of a bread knife cutting a fresh loaf, open crumb visible, crust flakes |
| `olga.webp` | 4:5, 1024×1280 | Waist-up portrait of Olga in the bakery kitchen holding a loaf with both hands, looking at camera, window light |
| `timur.webp` | 4:5, 1024×1280 | Waist-up portrait of Timur behind the espresso machine, tamping, looking up at camera, slight smile |
| `hands-flour.webp` | 1:1, 1200×1200 | Top-down of hands shaping dough on a floured wooden bench, flour in the air |
| `queue.webp` | 3:2, 1600×1067 | Small morning queue of three people outside a glass bakery door, city street, soft morning light, faces turned away |
| `window.webp` | 2:3, 1067×1600 | Vertical view of the bakery window from inside: a person reading at a table, coffee cup, street blurred outside |
| `box.webp` | 3:2, 1600×1067 | Open white cardboard pastry box with four pastries inside, top-down, on a light surface — **для крышки конструктора** |
| `bag.webp` | 1:1, 1200×1200 | Flat texture of clean brown kraft paper bag, top-down, even light — **фактура для формы рассылки** |

## Куда что идёт

- `hero.webp` — первый экран.
- `shelf.webp` — фон витрины (полки).
- `item-01…08.webp` — карточки полки и ячейки коробки.
- `coffee-*.webp`, `beans.webp` — секция кофе.
- `story-01…05.webp` — история «36 часов до буханки» (шестой кадр — `shelf.webp`).
- `olga.webp`, `timur.webp` — люди.
- `hands-flour.webp`, `queue.webp`, `window.webp`, `coffee-flat.webp`, `story-04.webp`, `story-05.webp`, `shelf.webp` — bento-галерея «Сегодня утром».
- `box.webp` — крышка собранной коробки.
- `bag.webp` — фактура формы рассылки.
- `queue.webp` — также секция «Где мы».
