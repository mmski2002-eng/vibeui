# Диагностика sitemap `vibeui.club` в GSC (2026-10-17)

Продолжение [STAGE-3.md](STAGE-3.md) §8. Только чтение: настройки Cloudflare, nginx, DNS, GSC не менялись, повторная отправка не выполнялась.

## Проверки (17.10, ~07:15–07:35 UTC)

| Что | Результат |
|---|---|
| CI/CD | Деплои `622f0204` (06:33 UTC) и `2104d7cc` (07:04 UTC) — `success` (GitHub Actions API) |
| `https://vibeui.club/sitemap.xml` | 200, `application/xml`, 2173 `<loc>`, 983 188 байт без сжатия; `gzip`/`br`/`zstd` по `Accept-Encoding`, `cf-cache-status: DYNAMIC` |
| Origin напрямую (`--resolve vibeui.club:443:216.173.70.241`) | 200, те же 983 188 байт |
| `robots.txt` `.club` | 200, `Allow: /`, sitemap не закрыт, `Sitemap: https://vibeui.club/sitemap.xml` |
| `vibeui.ru/sitemap.xml` | 200, 2173 URL |
| Редирект `/en/*` | `vibeui.ru/en/components` → 301 `https://vibeui.club/components` |
| DNS `.club` | A `172.67.215.222`, `104.21.35.75` (Cloudflare); AAAA через 1.1.1.1 не вернулся |
| CF Security Events, 7 дней | 69 смягчённых запросов, все — «Managed rules» Block на сканеры (`/wp-config.php.bak` и т.п., Cloudflare Managed Free Ruleset, правило `9ce4e284…`). Событий по `/sitemap.xml` нет; событий по Google-IP (66.249.x) нет. Блок 17.10 02:42 UTC с `34.79.12.228` — сканер WP, не sitemap |
| CF Traffic (sampled) | Запросы `/sitemap.xml` проходят до origin. Пример: мои curl 07:18–07:20 UTC видны и в CF, и в nginx (те же секунды) — сквозная цепочка CF→nginx для этого пути работает |
| nginx `.club` access.log за 16–17.10 | Запросов `/sitemap.xml` от загрузчика sitemap Google нет. Есть: `Google-InspectionTool` 06:27 UTC (live-проверка, 200), curl'ы агентов с UA Googlebot 06:49 и мои 07:18–07:20. Обычный Googlebot ходит по страницам (07:20 UTC `/blocks/course-003` → 200) |
| nginx-конфиг `.club` | Для `location /` логирование включено; `access_log off` только на внутреннем `/agent-…/`. Ограничений (`limit_req`, `deny`) нет |
| GSC `vibeui.club` → Файлы Sitemap | `/sitemap.xml`, «Неизвестно», отправлен 17.10, **«Не получено»**, выявлено 0. **Поле «Дата последней обработки» пустое** |

## Факты
1. Файл и доставка исправны: 200 через Cloudflare и напрямую, при любом сжатии.
2. Cloudflare в окне 06:40–06:50 UTC и за 7 дней не блокировал и не челленджил ни `/sitemap.xml`, ни Google-IP: Security Events пусты по этому пути.
3. Загрузчик sitemap Google за 16–17.10 до origin не дошёл; при этом другие запросы Google (InspectionTool, Googlebot) через тот же Cloudflare проходят с 200.
4. В GSC нет даты обработки — Google не зафиксировал ни одной попытки чтения.

## Вывод
Подтверждённой причины на стороне Cloudflare, сервера или файла **нет**. Наиболее вероятно (гипотеза, не доказано): Google ещё не выполнил загрузку — «Не получено» без даты обработки GSC показывает и для отправленных, но не запрошенных sitemap. Против Cloudflare: нет событий блокировки, хотя все остальные запросы Google проходят. Отличие от `.ru` (обработан сразу): молодой домен `.club` с низким приоритетом сканирования.

Изменений не сделано: условие «доказано, что конкретное правило блокирует» не выполнено.

## Неизвестно
- Что было 30.09: логи nginx с 03.10, Security Events CF Free — 7 дней.
- Пытался ли Google вообще загрузить файл 30.09–17.10 (Google этого не показывает).
- Состояние переключателей Bot Fight Mode / AI bot policies не прочитано (дерево доступности не отдаёт состояние). Влияния не видно: при их срабатывании были бы события Challenge/Block.

## Что дальше
1. Ждать 3–7 дней без повторных отправок. Признак успеха — дата обработки и число URL в GSC.
2. Проверять nginx: `grep sitemap.xml /var/log/nginx/access.log | grep -i googlebot` — первый настоящий запрос покажет, дошёл ли.
3. Если к ~24.10 даты обработки нет, а в nginx запроса нет — повторить Security Events в момент новой отправки; при пустом результате — вопрос к стороне Google (обращение в справочное сообщество GSC).
