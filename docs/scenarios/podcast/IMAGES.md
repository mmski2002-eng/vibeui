# Картинки для сценария «Подкаст»

Папка: `public/demo/podcast/`. Формат webp, качество 82. Без текста, водяных
знаков, логотипов и читаемых надписей. Одна серия: ночная студия подкаста,
тёплый точечный свет, тёмные стены с акустическими панелями, микрофон с
поп-фильтром, наушники, пульт. Look — кинематографичный, контрастный, с
одним кислотно-зелёным акцентом (индикатор записи, лента, наклейка).

## Герои

```
Host — Vera: woman, 34, Slavic features, short dark bob, round glasses,
black turtleneck, big studio headphones around her neck, calm attentive look.
Guests: diverse adults 25–60, each in their own work clothes (a potter in an
apron, a surgeon in scrubs, a lighthouse keeper in a knit sweater, a
programmer in a hoodie, a chef in whites, a florist, a train driver, a
librarian) — waist-up, plain dark background, soft key light.
```

## Общий стиль (добавлять к каждому промпту)

```
Photorealistic cinematic photograph, night podcast studio, warm tungsten
key light and deep shadows, dark charcoal walls with acoustic foam, a single
acid-green LED accent, shallow depth of field, no text, no watermark, no
logos, no readable signage.
```

## Список

| Файл | Формат | Промпт |
| --- | --- | --- |
| `cover.webp` | 1:1, 1200×1200 | Podcast cover art without text: a condenser microphone in silhouette against a warm glowing window, dark room, acid-green LED reflection on the mic grille |
| `host.webp` | 4:5, 1024×1280 | Waist-up portrait of Vera at the mixing desk, headphones on her neck, one hand on a fader, looking at camera |
| `studio-01.webp` | 16:9, 1600×900 | Wide shot of the studio at night: two microphones on boom arms, a small table lamp, acoustic panels, a red-green recording light |
| `studio-02.webp` | 3:2, 1600×1067 | Close-up of a mixing console with faders and glowing meters, hands adjusting a knob |
| `studio-03.webp` | 2:3, 1067×1600 | Vertical: a guest's hands holding a warm mug in front of a microphone, out-of-focus host behind |
| `guest-01.webp` … `guest-08.webp` | 1:1, 800×800 | Waist-up portraits of eight guests as described in «Герои», same dark background and key light, looking slightly off camera |
| `episode-01.webp` … `episode-06.webp` | 1:1, 1000×1000 | Abstract episode covers without text: (01) a potter's wheel in motion, (02) a lighthouse beam in fog, (03) surgical lamp reflections, (04) code on a dark screen out of focus, (05) a train cab at dawn, (06) library shelves in low light — each with a subtle acid-green tint |

## Куда что идёт

- `cover.webp` — первый экран (плеер) и мини-плеер.
- `host.webp` — блок «кто ведёт» в подвале/о подкасте.
- `studio-*.webp` — фон секции поддержки и галерея.
- `guest-*.webp` — кольцо гостей.
- `episode-*.webp` — лента эпизодов.
