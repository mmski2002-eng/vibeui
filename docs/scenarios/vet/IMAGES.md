# Картинки для сценария «Ветклиника + груминг»

Папка: `public/demo/vet/`. Формат webp, качество 82, все вертикальные 4:5
(1024×1280). Без текста, водяных знаков, логотипов. Две серии: портреты
врачей в светлой клинике и «домашние» фото питомцев для дневника — как
будто сняты хозяевами на телефон, но аккуратно.

## Общий стиль (добавлять к каждому промпту)

```
Photorealistic, warm natural light, cream and soft terracotta palette,
clean modern veterinary clinic or cozy home, shallow depth of field,
friendly mood, no text, no watermark, no logos.
```

## Список

| Файл | Формат | Промпт |
| --- | --- | --- |
| `doctor-01.webp` | 4:5, 1024×1280 | Portrait of a woman veterinarian in her forties, short dark hair, sage green scrubs, holding a calm grey cat, bright clinic room with wooden shelves, gentle smile |
| `doctor-02.webp` | 4:5, 1024×1280 | Portrait of a male veterinary surgeon in his thirties, beard, dark green scrubs with a stethoscope, standing next to a golden retriever on an exam table, confident and kind |
| `doctor-03.webp` | 4:5, 1024×1280 | Portrait of a young woman veterinarian with a small brown rabbit in her hands, terracotta scrubs, plants and a window behind her, soft light |
| `doctor-04.webp` | 4:5, 1024×1280 | Portrait of a male veterinarian in his thirties in navy scrubs, night shift lighting with a warm desk lamp, a sleeping puppy in a blanket beside him, calm |
| `diary-01.webp` | 4:5, 1024×1280 | Phone snapshot of a ginger tabby cat wrapped in a blanket on a sofa, looking offended but comfortable, sunlight from a window |
| `diary-02.webp` | 4:5, 1024×1280 | Phone snapshot of a fluffy white Persian cat with a fresh lion-style haircut sitting proudly on a kitchen counter |
| `diary-03.webp` | 4:5, 1024×1280 | Phone snapshot of a grey lop-eared rabbit eating hay in a wooden pen, close-up, cozy home |
| `diary-04.webp` | 4:5, 1024×1280 | Phone snapshot of a happy corgi with an open mouth on a walk in a park, autumn leaves, low angle |

## Куда что идёт

- `doctor-01…04.webp` — карточки врачей (`people-015`), 3D-tilt, объект-кавер.
- `diary-01…04.webp` — полароиды дневника (`testimonials-027`); две записи без фото
  показывают градиентную подложку — так и задумано.
- Хиро (`hero-035`), карта тела (`vet-002`), груминг (`vet-004`) и карта
  в контактах (`contact-023`) — CSS и SVG, фото не нужны.
