import "server-only"

import nodemailer from "nodemailer"

/**
 * Отправка писем. Провайдер меняется переменными окружения, потому что
 * доставляемость собственного сервера заранее неизвестна: письма
 * подтверждения — критичный путь, и если свежий IP начнёт попадать в спам,
 * переключение на релей не должно требовать правки кода.
 *
 * Пока SMTP не настроен, письмо уходит в лог: разработка не должна
 * останавливаться из-за неподнятой почты, а на проде пустой SMTP_HOST
 * означает, что регистрация ещё не открыта.
 */
type Letter = {
  to: string
  subject: string
  text: string
}

const host = process.env.SMTP_HOST
const port = Number(process.env.SMTP_PORT ?? 587)

/**
 * Свой Postfix на этой же машине отвечает самоподписанным сертификатом, и
 * проверка его отвергает — письма не уходили вовсе. Шифровать петлю
 * незачем: трафик не покидает сервер. Для внешнего релея всё остаётся как
 * обычно, с полноценной проверкой.
 */
const local = host === "127.0.0.1" || host === "localhost" || host === "::1"

const transport = host
  ? nodemailer.createTransport({
      host,
      port,
      // 465 — implicit TLS, 587 — STARTTLS: у портов разный смысл флага.
      secure: !local && port === 465,
      ignoreTLS: local,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
    })
  : null

export async function sendMail({ to, subject, text }: Letter) {
  if (!transport) {
    console.info(`[mail] ${to} — ${subject}\n${text}`)

    return
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? "VibeUI <noreply@vibeui.ru>",
    to,
    subject,
    text,
  })
}

/** Письмо со ссылкой: одинаковая рамка, чтобы тексты не расходились. */
export function letterWithLink(intro: string, url: string, life: string) {
  return `${intro}\n\n${url}\n\nСсылка действует ${life}. Если вы этого не запрашивали — просто удалите письмо.\n\nVibeUI — vibeui.ru`
}
