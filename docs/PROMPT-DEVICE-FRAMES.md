# Промпт для Codex: фото-корпуса устройств для категории «Мокап устройства»

Скопировать целиком в Codex. Ниже — задача для агента, за ней — промпты для
image-модели, которые агент подставляет в API как есть.

---

## Задача

Сгенерировать набор АИ изображений корпусов устройств для React-компонентов
`registry/components/mockup/mockup-00X` проекта VibeUI. Компоненты кладут
скриншот пользователя под PNG корпуса с прозрачным вырезом экрана
(образец готовой схемы — `mockup-001/mockup-001.tsx`, переменные
`--vibeui-mockup-001-screen-*` и слой `data-part="frame"`).

Результат: файлы в `public/demo/devices/`, JSON с геометрией выреза и
скрипт проверки. Компоненты не трогать — их переделаю отдельно по JSON.

### Инструмент

Встроенный инструмент генерации изображений Codex (imagegen). Внешние API
и ключи не нужны — `OPENAI_API_KEY` не искать и не запрашивать.

Параметры генерации: размер `1536×1024` для горизонтальных корпусов,
`1024×1536` для вертикальных, качество максимальное. Каждое изображение
сохранять как `public/demo/devices/raw/<имя>.png`. Если инструмент не
умеет писать файл в рабочую папку — вывести изображение в ответ и
написать, под каким именем его сохранить; постобработку тогда запускать
после того, как файлы окажутся в `raw/`.

Прозрачный фон у инструмента не просить: он не гарантирован. Вместо этого
фон — **сплошная заливка `#FF00FF`**, экран — **сплошная заливка
`#00FF00`**. Оба цвета вырезаются хромакеем детерминированно.

### Набор (7 файлов)

| Файл | Ориентация | Экран | Что за устройство |
|---|---|---|---|
| `laptop-front.png` | 1536×1024 | 16:10 | тонкий ультрабук, вид строго спереди, крышка открыта на ~100°, видно основание |
| `laptop-angle.png` | 1536×1024 | 16:10, четырёхугольник | тот же ультрабук, поворот ~25° влево, лёгкий взгляд сверху (~10°) |
| `phone-front.png` | 1024×1536 | 9:19.5 | безрамочный смартфон, вид спереди, боковые клавиши, без выреза камеры в экране |
| `tablet-portrait.png` | 1024×1536 | 3:4 | планшет с ровной рамкой, вид спереди, камера на верхней короткой стороне |
| `tablet-landscape.png` | 1536×1024 | 4:3 | тот же планшет, повёрнут в альбом, камера на левой стороне |
| `monitor-front.png` | 1536×1024 | 16:9 | тонкий настольный монитор на ножке с круглой подставкой, вид спереди |
| `watch-front.png` | 1024×1536 | ≈1:1.2, скруглённый | умные часы с прямоугольным экраном, колёсико справа, ремешок сверху и снизу, вид спереди |

Правая версия ноутбука под углом — зеркало `laptop-angle.png`, отдельно не
генерировать.

### Общие требования к картинке

- Один и тот же материал и свет на всех семи: матовый серебристый
  алюминий, чёрная рамка экрана, мягкий студийный свет сверху-слева,
  без цветных рефлексов.
- Фон — сплошной `#FF00FF`, без виньетки и градиента. Тени под
  устройством **нет** — тень рисует CSS.
- Никаких логотипов, надписей, названий брендов, узнаваемых фирменных
  деталей (яблоко, «чёлка», надпись на кромке). Устройство — generic.
- Фронтальные виды строго ортографические и симметричные: камера на
  уровне центра экрана, без перспективного сужения.
- Экран — сплошная заливка `#00FF00` без бликов, без градиента, без
  отражений. Блик поверх экрана рисует CSS.
- Устройство занимает не меньше 90 % ширины кадра, ничего не обрезано.
- Один корпус на картинку, без рук, без стола, без второго устройства.

### Постобработка (скрипт `scripts/device-frames.mjs`, Node, `sharp`)

1. Хромакей, два цвета: фон — `R > 200 && B > 200 && G < 80`, экран —
   `G > 200 && R < 80 && B < 80`; оба → alpha 0. Край смягчить: alpha по
   расстоянию до порога, 1–2 px. Остаточную зелёную и пурпурную окантовку
   на границе снять: у полупрозрачных пикселей насыщенность к нулю.
2. Обрезать пустые поля до контура устройства + 2 % отступ, сохранить
   пропорцию кадра в JSON.
3. Для фронтальных: bbox прозрачного выреза → `screen: {left, top, width,
   height}` в процентах от кадра, 2 знака.
4. Для `laptop-angle.png`: четыре угла выреза (`quad: [[x,y]×4]`,
   проценты, по часовой от левого верхнего). Углы искать как крайние
   точки контура прозрачной области.
5. Проверка симметрии фронтальных: разница левой и зеркальной правой
   половины по alpha < 1.5 % пикселей. Не прошло — перегенерировать
   (до 4 попыток), в отчёт писать, какая попытка взята.
6. Экспорт: `PNG` (RGBA) и `WebP` (`quality 85`, alpha). Бюджет: WebP
   ≤ 250 KB на файл.
7. `public/demo/devices/devices.json`:

```json
{
  "laptop-front": {
    "file": "laptop-front.webp",
    "width": 1480,
    "height": 940,
    "screen": { "left": 11.4, "top": 6.3, "width": 77.1, "height": 83.3 }
  },
  "laptop-angle": {
    "file": "laptop-angle.webp",
    "width": 1500,
    "height": 1010,
    "quad": [[14.2, 8.1], [71.9, 3.4], [72.6, 78.8], [15.0, 84.9]]
  }
}
```

8. Скрипт проверки `scripts/device-frames-check.mjs`: для каждого
   устройства собрать `public/demo/devices/check/<name>.png` — кадр
   `public/demo/screens/desktop-01.webp` (или `screen-01.webp` для
   вертикальных) подложен под корпус по геометрии из JSON. Для
   `laptop-angle` — перспективная трансформация по `quad`. Смотреть
   глазами: кадр заполняет вырез без зазоров и не вылезает за рамку.

### Что отдать

- `public/demo/devices/*.png`, `*.webp`, `devices.json`, `check/*.png`;
- `scripts/device-frames.mjs`, `scripts/device-frames-check.mjs`;
- короткий отчёт: сколько попыток на каждое устройство, какие
  забракованы и почему, итоговые размеры файлов.

Не запускать `npm run build`, `lint`, `typecheck`. Не коммитить.

---

## Промпты для imagegen

Подставлять дословно. `{DEVICE}` — строка из таблицы ниже.

**Базовый промпт (общий хвост для всех):**

```
Product photo of a {DEVICE}, isolated on a perfectly flat, uniform, solid #FF00FF magenta background, no shadow, no floor, no table, no hands.
Generic unbranded industrial design: no logo, no brand name, no text anywhere, no notch, no camera cutout in the display.
Matte silver aluminium body, thin black display bezel. Soft neutral studio lighting from the top-left, no coloured reflections.
The display is a perfectly flat, uniform, solid #00FF00 green fill with no glare, no gradient, no reflection and no content.
Strictly orthographic frontal view, camera at the exact centre height of the display, perfectly symmetrical, no perspective distortion.
The device fills at least 90% of the frame width and is fully visible with nothing cropped.
Photorealistic, clean, high detail, sharp edges.
```

**`{DEVICE}` по файлам:**

- `laptop-front`:
  `thin modern ultrabook laptop, lid open at about 100 degrees, seen straight from the front so the keyboard deck is visible only as a thin base strip below the display, 16:10 display`
- `laptop-angle` (вместо строки про ортографический вид использовать: `three-quarter view rotated about 25 degrees to the left and tilted about 10 degrees from above, mild perspective`):
  `thin modern ultrabook laptop, lid open at about 100 degrees, 16:10 display, keyboard deck and trackpad visible`
- `phone-front`:
  `bezel-less modern smartphone, flat sides, side buttons visible, tall 9:19.5 display with rounded corners`
- `tablet-portrait`:
  `modern tablet in portrait orientation, even bezel on all four sides, front camera centred on the top short edge, 3:4 display`
- `tablet-landscape`:
  `modern tablet in landscape orientation, even bezel on all four sides, front camera centred on the left short edge, 4:3 display`
- `monitor-front`:
  `thin modern desktop monitor on a slim neck and a round flat metal stand, minimal bezel, 16:9 display`
- `watch-front`:
  `modern smartwatch with a rectangular rounded display, digital crown and side button on the right, sport band attached above and below, seen straight from the front`

Если модель добавляет надпись или логотип — повторить с добавкой в конец:
`Absolutely no text, letters, logos or symbols anywhere on the device.`
