# VibeUI в X. 14 дней

Старт — день, когда выложен закреп. Посты на английском. Ссылка на сайт: https://vibeui.club. Команда установки в постах тоже с `.club`.

Бесплатный аккаунт: 280 знаков. Каждая ссылка в посте считается как 23, какой бы длинной ни была.

Каждый день одно и то же окно:

- 17:00 МСК — свой пост
- 17:00–19:30 МСК — 6 ответов
- 21:30–23:00 МСК — 4 ответа

Ответ: их пост про интерфейс или агента, одна конкретная страница компонента, без «check out my project» и без пачки хештегов. В посты @ShadcnStudio, @shadcncraft, @shadcnlabs свою ссылку не класть. Их ленту только читать.

К посту один кадр. Живой скролл страницы не снимать: лаг. Кадр страницы или короткая нарезка превью.

Профиль к дню 1: имя VibeUI, хэндл с доменом, сайт https://vibeui.club, био ниже, аватар и шапка по промптам из чата.

```
Pick a design. Hand it to AI. Ship the page.
shadcn registry · 2000+ React components, blocks, animations.
```

## День 1. Закреп

Пост, сразу закрепить.

```
The agent keeps redrawing your button until it almost looks right.

VibeUI is a shadcn registry. Copy for AI, then the agent runs:

npx shadcn@latest add https://vibeui.club/r/button-001.json

The file already has accessibility and keyboard support.
```

Кадр: `x-posts/day-01.png`. Страница кнопки в тёмной теме, видна «Copy for AI». Команда установки на экране без входа не рисуется, она в тексте поста.

Ответы: @emilkowalski @jh3yy @joshtriedcoding @shuding @pacocoursey @samselikoff

## День 2. Боль

```
Your agent describes a navbar. You get a navbar-shaped div.

VibeUI gives the agent the file.
https://vibeui.club/components
```

Кадр: `x-posts/day-02.png`. Навбар внутри сценария доставки, https://vibeui.club/scenarios/delivery/demo

Ответы: @MaximeHeckel @JohnPhamous @steventey @dillionverma @wesbos @theo

## День 3. Одна команда

```
One command. The component lands in the project with its own palette. Nothing else gets installed.

npx shadcn@latest add https://vibeui.club/r/hero-001.json
```

Кадр: `x-posts/day-03.png`. Главная, на кадре есть «one command to install». Команда в тексте поста.

Ответы: @cursor_ai @claudeai @vercel @nextjs @leerob @shadcn

## День 4. Объём

```
2000+ items in the registry.
Components, full page sections, animations.
Same install for all of them.

https://vibeui.club
```

Кадр: `x-posts/day-04.png`. Каталог блоков.

Ответы: @emilkowalski @jh3yy @joshtriedcoding @MaximeHeckel @marclou @tdinh_me

## День 5. Бесплатный лимит

```
Free account: 20 different components a month.

Open one, copy the prompt, let the agent install it.
https://vibeui.club/pricing
```

Кадр: `x-posts/day-05.png`. Тот же кадр, что в день 1: кнопка Copy for AI.

Ответы: @levelsio @dannypostma @swyx @wesbos @theo @steventey

## День 6. Один блок

Открыть самый сильный блок, который есть в каталоге на этот день. В ссылку поставить его страницу.

```
This section is already in the registry.
The agent installs it. It does not redraw it.

https://vibeui.club/blocks/cta-001
```

Кадр: `x-posts/day-06.png`. Блок cta-001, тёмная тема.

Ответы: @jh3yy @samselikoff @pacocoursey @shuding @JohnPhamous @dillionverma

## День 7. Что сделано за неделю

Одна конкретная вещь с этой недели: страница компонента, фикс, новый блок. Если за неделю ничего не вышло в прод, этот пост заменить на крупный кадр. Запасной кадр: `x-posts/day-07.png`, каталог анимаций, ссылка https://vibeui.club/animations. Выдуманный релиз не писать.

```
Shipping VibeUI in public.
Today: <одна фраза, что именно>.
Preview: <ссылка на страницу>
```

Ответы: @joshtriedcoding @emilkowalski @MaximeHeckel @marclou @tdinh_me @swyx

## День 8. Описание против файла

```
A prompt asks the agent to invent a card.
The registry gives it the card that is already built.

https://vibeui.club/components
```

Кадр: `x-posts/day-08.png`. Карточка card-001, https://vibeui.club/components/card-001

Ответы: @cursor_ai @claudeai @theo @wesbos @leerob @rauchg

## День 9. Анимация

Взять одну анимацию из https://vibeui.club/animations. В пост вставить её адрес.

```
An animation from the registry.
One file. The agent installs that file.

https://vibeui.club/animations/background-005
```

Кадр: `x-posts/day-09.png`. Один кадр анимации, не запись страницы.

Ответы: @emilkowalski @MaximeHeckel @jh3yy @shuding @pacocoursey @samselikoff

## День 10. Сценарий целиком

Открыть один сценарий, лучше delivery или saas. Ссылка на его страницу.

```
A whole page, already assembled from registry blocks.
The agent installs the sections. It does not redesign them.

https://vibeui.club/scenarios/delivery/demo
```

Кадр: `x-posts/day-10.png`. Меню сценария доставки.

Ответы: @marclou @tdinh_me @levelsio @dannypostma @steventey @JohnPhamous

## День 11. Клавиатура и доступность

```
The installed file already has keyboard support and accessibility.
That work is not left for the agent to invent.

https://vibeui.club
```

Кадр: `x-posts/day-11.png`. Кнопка Get started в фокусе, тёмная тема.

Ответы: @shadcn @tailwindcss @adamwathan @wesbos @dillionverma @joshtriedcoding

## День 12. Цена без презентации

```
The catalog is public.
20 components a month are free.
Paid plans are on the pricing page.

https://vibeui.club/pricing
```

Кадр: `x-posts/day-12.png`. Прайс, на бесплатном плане видно 20 компонентов в месяц.

Ответы: @levelsio @marclou @tdinh_me @dannypostma @swyx @theo

## День 13. Вопрос

```
Which screen is your agent redrawing this week?
Navbar, pricing, hero, or something else?

The matching section is probably already in the registry.
https://vibeui.club/blocks
```

Кадр: `x-posts/day-13.png`. Доставка, прайс и главная на одном холсте.

Ответы: всем, кто ответит на вопрос, в тот же вечер. Плюс 4 ответа в ленте: @jh3yy @emilkowalski @joshtriedcoding @cursor_ai

## День 14. Один компонент, который просят

Если в ответах за две недели назвали экран, пост про него: ссылка на ближайший блок. Если никто не назвал, взять навбар.

```
Asked for a <экран>.
This one is in the registry.

<ссылка>
```

Кадр: `x-posts/day-14.png`. Тот же навбар, что в день 2. Если в ответах назовут другой экран, кадр заменить.

Ответы: тем, кто писал в ответы за неделю, и @samselikoff @steventey @JohnPhamous @shuding

## После 14-го дня

Записать четыре числа: подписчики, ответы, которые получили ответ или лайк, переходы на vibeui.club, сколько людей поставили компонент. Дальше оставить то, что дало переход. Формат, который молчал, не повторять.
