# Codex: две новые картинки для сценария «Зимняя свадьба при свечах»

Скопировать целиком и отправить Codex в репозитории VibeUI.

---

Сгенерируй две фотографии для сценария `wedding-winter` и положи их в
`public/demo/wedding-winter/`. Это та же серия, что уже лежит в этой папке
(`hero.webp`, `story-*.webp`, `house-*.webp`, `venue.webp` и т. д.) —
ориентируйся на них по колориту и плёночному look. Ничего в коде не менять,
только создать два webp-файла качества 82. Файлов ещё нет — создать новые.

## Общий стиль (добавить к обоим промптам)

```
Photorealistic 35mm film photograph, Kodak Portra 800 / Cinestill 800T
look, winter blue hour or night, warm tungsten light from windows, candles
and string lights, falling snow visible in the air, gentle grain, deep navy
shadows and amber highlights, shallow depth of field, no text, no watermark,
no logos, no readable signage, no people unless asked, no wedding attire.
```

## Список

| Файл | Формат | Промпт |
| --- | --- | --- |
| `evening.webp` | 4:5, 1024×1280 | Interior of a wooden country-house hall in the evening, the moment dusk turns to night: a long table lit by dozens of candles in glass holders, fir garlands and brass, tall windows behind showing deep blue twilight and falling snow, warm tungsten glow pooling on the table, empty elegant place settings, no people, vertical composition with a little headroom at the top for a heading |
| `map.webp` | 3:2, 1600×1067 | Top-down aerial drone view at night of a single warm-lit wooden house in a small snowy clearing, a winding snow-covered road leading to it through dense dark pine forest, moonlight from above, deep navy forest with amber glow spilling from the house windows, gentle snowfall, cinematic — reads like a map to a secret forest venue, no text, no labels, no people |

## Правила
- Формат и размер строго из таблицы (`evening` — вертикаль 1024×1280,
  `map` — горизонт 1600×1067). webp, качество 82, имя файла ровно как в таблице.
- Без текста, водяных знаков, логотипов, надписей на карте.
- Один колорит с остальной серией (синие сумерки, тёплый свет, снег).
- Ничего не коммитить и не пушить — сделаем отдельно после просмотра.

## Куда пойдёт (для контекста, код не трогать)
- `evening.webp` — левая панель блока «Вечер» вместо CSS-луны.
- `map.webp` — крупная карта в блоке «Как доехать» (Лесная усадьба), поверх
  ляжет метка-снежинка и подпись.
