# Почта для писем аккаунта

Письма подтверждения адреса и восстановления пароля отправляет сам сервер:
Postfix слушает только localhost, приложение отдаёт ему письмо через
`SMTP_HOST=127.0.0.1`. Подписывает письма OpenDKIM.

Установлено и настроено 08.09.2026 на `185.104.251.106`:

| Что | Состояние |
| --- | --- |
| Postfix | активен, `myhostname = vibeui.ru`, `inet_interfaces = loopback-only` |
| OpenDKIM | активен, ключ 2048 бит, селектор `mail` |
| Приложение | `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM` в `/etc/vibeui.env` |
| Исходящий порт 25 | открыт хостером, проверено |

## Что осталось сделать в DNS — без этого письма не доходят

Проверка отправки на Gmail закончилась отказом:

```
550-5.7.25 The IP address sending this message does not have a PTR record
setup, or the corresponding forward DNS entry does not match the sending IP.
```

Крупные почтовые службы не принимают письма с адресов без обратной записи.
Значит нужны четыре вещи, и три из них — в панели управления доменом.

### 1. PTR (обратная запись) — у хостера сервера

Запросить в поддержке или в панели VPS:

```
185.104.251.106  →  vibeui.ru
```

Это единственный пункт, который нельзя сделать из DNS-панели домена.

### 2. SPF — TXT для `vibeui.ru`

```
v=spf1 ip4:185.104.251.106 -all
```

Сейчас у домена TXT-записей нет вообще. Если позже появится сторонний
отправитель (рассылки, CRM), его нужно дописать в ту же строку — двух
SPF-записей у домена быть не должно.

### 3. DKIM — TXT для `mail._domainkey.vibeui.ru`

```
v=DKIM1;h=sha256;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsffXm1S+S5yYRqgEXSLxU6ZYQYOhgGwKtswtx2NRi9D5cSbSDO16Iu6qHKgWH0uVR0sx03EK/VmWNu5GSPce3PTrAUwomWQ2h+ESXse3C1SsRHI1oxGcQnIP7cjj9pC1/xmcJiADll07XIhea2Z7WBCUpTHqRSmGrY9NV58gtdmNEJX8qNhzJ7pvo6ZbEKYp+YOhR2jTYm5PK+8gkg/QGK1vBO6ib6x0qx/ziP3luHonP/5vSQLULLyEnBTwIBlFzgUXvT6BpsduNZYh7wmLaflqF5YnoLwRy4xOFJnh7RLTCxysrxsY/fAjiECSTGwvtuasoNca4YkDUOe8qoyVdQIDAQAB
```

Приватная часть лежит на сервере в `/etc/opendkim/keys/vibeui.ru/mail.private`,
в git её нет и быть не должно.

### 4. DMARC — TXT для `_dmarc.vibeui.ru`

```
v=DMARC1; p=none; rua=mailto:postmaster@vibeui.ru
```

Начинаем с `p=none` — это режим наблюдения. Через пару недель, когда отчёты
покажут, что всё подписывается верно, поднять до `p=quarantine`.

## Проверка после публикации записей

```bash
ssh root@185.104.251.106 'printf "From: VibeUI <noreply@vibeui.ru>\nTo: ПОЧТА\nSubject: test\n\nПроверка\n" | sendmail -f noreply@vibeui.ru ПОЧТА'
ssh root@185.104.251.106 'journalctl -t postfix/smtp --since "-5 min" | tail -5'
```

В журнале должно быть `status=sent`, а не `bounced`. Отдельно стоит
отправить письмо на Mail.ru и Яндекс: у них свои требования, и папка
«Спам» там встречается чаще, чем прямой отказ.

## Если доставка всё равно хромает

Код к этому готов: `lib/mail.ts` собирает транспорт из переменных
окружения, поэтому переход на сторонний SMTP-релей (Яндекс 360, Mail.ru
для бизнеса, SMTP-провайдер рассылок) — это правка `/etc/vibeui.env` и
перезапуск сервиса, без единой строки кода:

```
SMTP_HOST=smtp.провайдер.ru
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
```

## Входящая почта

MX домена ведёт на этот же сервер (`mail.vibeui.ru` → 185.104.251.106), но
приём писем не настроен: Postfix слушает только localhost. Письма на
`noreply@vibeui.ru` и `postmaster@vibeui.ru` сейчас никуда не приходят.
Если нужен рабочий ящик — заводить его отдельно, проще всего на почтовом
сервисе с переносом MX на него.
