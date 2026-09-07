# Фото: товары магазина, вторая партия

20 файлов. Первая партия (`products/`, 36 шт) закрыла одежду и мелкие
предметы, но ассортимент блоков `registry/blocks/commerce` шире: там
мебель, свет, текстиль и кухонная утварь, для которых кадров нет. Из-за
этого 13 блоков из 16 подключить не удалось — витрина смешивала бы
фотографии с цветными полями.

Список составлен по названиям товаров в самих блоках, поэтому кадр и
подпись сойдутся.

Скопировать от `=== ПРОМПТ ===` до `=== КОНЕЦ ===` и отправить как есть.
Подключением занимается Claude, Codex только кладёт файлы.

=== ПРОМПТ ===

Ты работаешь в репозитории VibeUI (Next.js). Задача: сгенерировать
20 фотографий товаров и положить их в `public/demo/products/`. В коде
ничего не менять, только файлы картинок. Имена — строго из таблицы,
продолжают существующую нумерацию (`product-29` … `product-48`).

Это продолжение готовой серии. В `public/demo/products/` уже лежат 36
кадров (`product-01` … `product-28`, `product-tall-01` … `product-tall-08`).
Перед началом посмотреть 4–5 из них и попасть в тот же вид: предметная
съёмка на светлом фоне, ровный рассеянный свет, мягкая тень под объектом.

## Технические требования

- Формат: WebP, качество 82, без метаданных.
- Размер: 900×900 px, ровно, без отклонений.
- Вес: до 60 КБ. Не уложился — снизить качество до 78, размер не менять.
- Фон: однородный светлый, #F2F2F2 — #FAFAFA, тот же, что у первой партии.
  Никакого интерьера, реквизита и рук в кадре.
- Объект в центре, занимает 70–80 % кадра, запас по краям равномерный:
  карточки режут кадр под 4:3 и 1:1.
- Без текста, надписей, логотипов, ценников, водяных знаков.
- Итог проверить: `ls public/demo/products | wc -l` должен дать 56,
  размеры — через `identify`/`sharp`/PIL.

## Стиль серии (добавлять к каждому промпту)

> Product packshot photography, e-commerce catalog style. Single object,
> centered, on a seamless light grey background (#F2F2F2). Soft even studio
> light, gentle contact shadow under the object, no harsh reflections.
> Neutral colours: black, grey, natural wood, off-white. Sharp focus edge to
> edge, no text, no logos, no props, no hands. Clean, restrained, premium.

Один предмет допускает оранжевую деталь #FF5900 — это фирменный цвет
проекта, он уже встречается в первой партии (стропы шлема, крышка бутылки,
кейкап). Не больше одной такой детали на кадр и не на каждом кадре.

## Что снять

| Файл | Промпт сюжета |
| --- | --- |
| `product-29.webp` | Floor lamp with an ash wood stand and a woven fabric shade, switched off |
| `product-30.webp` | Low wooden coffee table, oak, four tapered legs, three-quarter view |
| `product-31.webp` | Rolled-up woollen rug, grey with a thin stripe, standing upright |
| `product-32.webp` | Open shelving unit, three tiers, light oak, empty |
| `product-33.webp` | Chest of drawers, four drawers, matte grey front, wooden legs |
| `product-34.webp` | Round upholstered pouffe, grey wool, low profile |
| `product-35.webp` | Bedside cabinet with one drawer, light wood, matte finish |
| `product-36.webp` | Storage box of grey felt with a folded lid, cube shaped |
| `product-37.webp` | Linen tablecloth folded into a neat stack, sand coloured |
| `product-38.webp` | Four linen napkins in a fanned stack, off-white |
| `product-39.webp` | Waffle-weave towel folded once, warm grey |
| `product-40.webp` | Canvas apron folded flat with its straps arranged, dark grey |
| `product-41.webp` | Digital kitchen scale, matte black, round glass platform |
| `product-42.webp` | Pour-over coffee dripper in white ceramic on a paper filter |
| `product-43.webp` | Clear glass bulb with a visible warm filament, brass base |
| `product-44.webp` | Floor dimmer switch with a fabric cable, matte black |
| `product-45.webp` | Trivet of solid oak, round, with a burned-in grid pattern |
| `product-46.webp` | Grey crew-neck sweatshirt on a wooden hanger, front view |
| `product-47.webp` | The same grey crew-neck sweatshirt folded into a flat square, seen from above |
| `product-48.webp` | Close-up of the same grey sweatshirt's ribbed cuff and knit texture |

Последние три — один и тот же свитшот с трёх сторон: карточка товара
показывает главный кадр и под ним миниатюры-ракурсы, поэтому вещь, ткань
и цвет на всех трёх обязаны совпадать.

=== КОНЕЦ ===
