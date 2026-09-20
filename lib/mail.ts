import "server-only"

import nodemailer from "nodemailer"

import type { Locale } from "@/lib/i18n"

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
  html?: string
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

/**
 * Отдельный транспорт для vibeui.club — через Resend. У .club свой домен с
 * DKIM/SPF (настроен в Resend), поэтому письма доходят до Gmail, а не в спам,
 * как со свежего локального Postfix. vibeui.ru остаётся на своём Postfix.
 */
const resendKey = process.env.RESEND_API_KEY
const resendTransport = resendKey
  ? nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: { user: "resend", pass: resendKey },
    })
  : null

const CLUB_FROM = process.env.RESEND_FROM ?? "VibeUI <noreply@vibeui.club>"

export async function sendMail({
  to,
  subject,
  text,
  html,
  resend,
}: Letter & {
  /** Слать через Resend от имени vibeui.club (письма для .club-аудитории). */
  resend?: boolean
}) {
  // .club — через Resend, если он настроен: свой домен и доставляемость.
  if (resend && resendTransport) {
    await resendTransport.sendMail({ from: CLUB_FROM, to, subject, text, html })

    return
  }

  if (!transport) {
    console.info(`[mail] ${to} — ${subject}\n${text}`)

    return
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? "VibeUI <noreply@vibeui.ru>",
    to,
    subject,
    // Текстовая версия обязательна: письмо без неё выглядит подозрительным
    // для спам-фильтров, а часть почтовых клиентов показывает только её.
    text,
    html,
  })
}

const SITE = "vibeui.ru"

const COPY = {
  ru: {
    life: (minutes: number) => `Ссылка действует ${minutes} минут.`,
    ignore: "Если вы этого не запрашивали, просто удалите письмо.",
    fallback: "Кнопка не открывается? Скопируйте ссылку в адресную строку:",
    tagline: "Выбери дизайн. Отдай ИИ. Получи сайт.",
  },
  en: {
    life: (minutes: number) => `The link works for ${minutes} minutes.`,
    ignore: "If you did not request this, just delete the message.",
    fallback: "Button not working? Paste this link into your browser:",
    tagline: "Pick a design. Hand it to AI. Ship the page.",
  },
} satisfies Record<Locale, unknown>

type LetterContent = {
  locale: Locale
  /** Заголовок внутри письма. В теме письма он же, но короче. */
  heading: string
  intro: string
  /** Надпись на кнопке. */
  action: string
  url: string
  minutes: number
  /**
   * Отдельная просьба под кнопкой. Нужна письму подтверждения: домен молодой,
   * почтовые службы кладут первые письма в спам, а перенос письма во
   * «Входящие» и адрес в контактах — то немногое, чем это лечит получатель.
   */
  hint?: string
}

/**
 * Разметка письма. Верстается таблицами и инлайновыми стилями — не от любви
 * к жанру: почтовые клиенты вырезают <style> из <head>, не знают grid и
 * flex, а Outlook рендерит движком Word. Здесь работает только то, что
 * работало в вебе двадцать лет назад.
 *
 * Ни картинок, ни внешних файлов: изображения по умолчанию не грузятся, и
 * письмо, где вся суть в баннере, приходит пустым прямоугольником.
 */
function renderLetter({
  locale,
  heading,
  intro,
  action,
  url,
  minutes,
  hint,
}: LetterContent) {
  const copy = COPY[locale]
  const lang = locale === "en" ? "en" : "ru"

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escape(heading)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;">
<tr>
<td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e4e4e7;">
<tr>
<td style="padding:32px 32px 0;">
<span style="font:600 20px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#18181b;letter-spacing:-0.02em;">Vibe<span style="color:#ff5900;">UI</span></span>
</td>
</tr>
<tr>
<td style="padding:24px 32px 0;">
<h1 style="margin:0;font:600 24px/1.25 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#18181b;letter-spacing:-0.02em;">${escape(heading)}</h1>
<p style="margin:12px 0 0;font:400 15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#52525b;">${escape(intro)}</p>
</td>
</tr>
<tr>
<td style="padding:24px 32px 0;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background:#ff5900;border-radius:999px;">
<a href="${escape(url)}" style="display:inline-block;padding:14px 28px;font:600 15px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#ffffff;text-decoration:none;">${escape(action)}</a>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding:20px 32px 0;">
<p style="margin:0;font:400 13px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#71717a;">${copy.life(minutes)} ${escape(copy.ignore)}</p>
</td>
</tr>
${
  hint
    ? `<tr>
<td style="padding:16px 32px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;">
<tr>
<td style="padding:12px 16px;">
<p style="margin:0;font:400 13px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#7c2d12;">${escape(hint)}</p>
</td>
</tr>
</table>
</td>
</tr>`
    : ""
}
<tr>
<td style="padding:20px 32px 0;">
<p style="margin:0 0 6px;font:400 12px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#a1a1aa;">${escape(copy.fallback)}</p>
<p style="margin:0;font:400 12px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#52525b;word-break:break-all;">${escape(url)}</p>
</td>
</tr>
<tr>
<td style="padding:24px 32px 32px;">
<div style="border-top:1px solid #e4e4e7;padding-top:16px;">
<p style="margin:0;font:400 12px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#a1a1aa;">${escape(copy.tagline)} · <a href="https://${SITE}" style="color:#a1a1aa;">${SITE}</a></p>
</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
}

/** Тот же текст простой строкой — для клиентов без HTML и для фильтров. */
function renderText({ locale, intro, url, minutes, hint }: LetterContent) {
  const copy = COPY[locale]

  return `${intro}\n\n${url}\n\n${copy.life(minutes)} ${copy.ignore}${
    hint ? `\n\n${hint}` : ""
  }\n\nVibeUI — ${SITE}`
}

/** Письмо со ссылкой: обе версии из одного описания, тексты не расходятся. */
export function letterWithLink(content: LetterContent) {
  return { text: renderText(content), html: renderLetter(content) }
}

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
