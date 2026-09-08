# SEO и аналитика

Что уже настроено в коде, где это лежит и что делать руками в кабинетах.

## Origin

Канонический адрес — `https://vibeui.ru`. Он объявлен в `lib/seo.ts`
(`SITE_URL`) и переопределяется переменной `NEXT_PUBLIC_SITE_URL`.

Это не то же самое, что `getSiteBaseUrl()` из `lib/site.ts`: тот выводится из
`REGISTRY_BASE_URL` и нужен для install-команд. Canonical и sitemap обязаны
указывать на боевой домен даже когда сборка идёт без окружения, поэтому у них
свой источник.

## Что отдаёт сайт

| Адрес | Откуда | Что внутри |
| --- | --- | --- |
| `/robots.txt` | `app/robots.ts` | allow всего каталога, disallow служебных маршрутов, ссылка на sitemap |
| `/sitemap.xml` | `app/sitemap.ts` | все страницы каталога на двух языках с `xhtml:link` hreflang |
| `/opengraph-image` | `app/opengraph-image.tsx` | картинка 1200×630, рисуется на сборке, наследуется всеми страницами |
| `/icon.svg` | `app/icon.svg` | favicon |

Закрыто от индексации: `/api/`, `/preview/`, `/c/`, `/f/`, `/r/`, `/lab`,
`/search`, `/en/search`. У `/preview` и `/search` вдобавок стоит `noindex` в
метаданных — robots.txt запрещает обход, но не индексацию по внешней ссылке.

## Метаданные страницы

Собираются одним хелпером `pageMetadata()` из `lib/seo.ts`: title, description,
canonical, hreflang (`ru`, `en`, `x-default`) и Open Graph с тем же URL.
Страница передаёт локаль и путь **без** языкового префикса — пару для второго
языка хелпер выводит сам (`localePath`).

Сегмент `[slug]` каталога обслуживает `catalogSlugMetadata()`: за одним
маршрутом стоят страница item'а и страница категории, они различаются числовым
суффиксом в имени. Хелпер один на шесть файлов — блоки, компоненты и анимации
на двух языках.

Новая страница → метаданные только через эти хелперы. Свой объект `metadata`
без `alternates` означает страницу без canonical: Яндекс склеит её с
однотипной и выберет главную сам.

## Разметка Schema.org

- `WebSite` + `SearchAction` + `Organization` — в `app/layout.tsx`, один раз на
  весь сайт;
- `BreadcrumbList` — на странице item'а и на странице категории, рядом с
  визуальными крошками (`components/pages/item-page.tsx`,
  `components/pages/category-page.tsx`);
- `SoftwareSourceCode` — на странице item'а.

Тег рисует `components/json-ld.tsx`. В `metadata` разметки нет, поэтому она
живёт в самом компоненте страницы.

## Язык

Русская витрина в корне, английская под `/en`. `<html lang>` объявлен один раз
в корневом layout'е как `ru` и правится на `en` инлайновым скриптом по пути —
корневой layout в приложении один, и статически развести его по языкам нельзя.
Для поисковиков язык задают hreflang в `<head>` и в sitemap, скрипт нужен
читалкам с экрана.

## Счётчики

`components/analytics.tsx` — Яндекс.Метрика и Google Analytics 4. Ничего не
рендерится, пока не заданы идентификаторы, поэтому dev и локальные сборки
остаются чистыми.

`components/analytics-route-hits.tsx` досылает просмотр при переходах внутри
приложения: обе системы считают просмотр только при загрузке документа, а
роутер Next меняет URL без неё.

Переменные (`NEXT_PUBLIC_*` вшиваются на сборке — после изменения нужен
редеплой):

| Переменная | Что |
| --- | --- |
| `NEXT_PUBLIC_YM_ID` | номер счётчика Яндекс.Метрики |
| `NEXT_PUBLIC_GA_ID` | идентификатор потока GA4, `G-…` |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | `content` meta-тега Яндекс.Вебмастера |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | `content` meta-тега Google Search Console |

В продакшене они приходят из GitHub Actions: Settings → Secrets and variables →
Actions → Variables. Имена совпадают с переменными выше.

## Кабинеты

Разовые действия руками, кодом не автоматизируются.

**Яндекс.Вебмастер** (`webmaster.yandex.ru`):

1. добавить сайт `https://vibeui.ru`;
2. подтвердить права мета-тегом → положить `content` в переменную
   `NEXT_PUBLIC_YANDEX_VERIFICATION` → редеплой → нажать «Проверить»;
3. Индексирование → Файлы Sitemap → добавить `https://vibeui.ru/sitemap.xml`;
4. Информация о сайте → регион: сайт не региональный, регион не задавать;
5. связать с Метрикой в разделе «Качество сайта».

**Яндекс.Метрика** (`metrika.yandex.ru`): создать счётчик на `vibeui.ru`,
включить вебвизор, номер → `NEXT_PUBLIC_YM_ID`. Код счётчика в коде уже есть,
вставлять фрагмент из кабинета не нужно.

**Google Search Console** (`search.google.com/search-console`): добавить ресурс
с префиксом URL `https://vibeui.ru/`, подтвердить HTML-тегом →
`NEXT_PUBLIC_GOOGLE_VERIFICATION`, затем Sitemaps → `sitemap.xml`.

**Google Analytics 4** (`analytics.google.com`): создать ресурс и поток данных
на `https://vibeui.ru`, `G-…` → `NEXT_PUBLIC_GA_ID`.

## Проверка после деплоя

`deploy.yml` сам проверяет `robots.txt` и `sitemap.xml`. Глазами стоит открыть:

- `https://vibeui.ru/robots.txt` — есть `Sitemap:` и `Host:`;
- `https://vibeui.ru/sitemap.xml` — в `<loc>` боевой домен, у записей есть
  `xhtml:link`;
- исходник любой страницы каталога — `<link rel="canonical">`, три `hreflang`,
  `og:*`, два `application/ld+json`;
- `https://vibeui.ru/opengraph-image` — картинка, кириллица не в квадратах.
