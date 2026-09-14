"use client"

import Link from "next/link"

import { CopyButton } from "@/components/copy-button"
import { useSession } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/**
 * «Копировать для ИИ» с проверкой входа. Кнопка копирует короткую ссылку /c,
 * но без аккаунта копировать нечего — по этой ссылке сервер всё равно ответит
 * 401. Поэтому неавторизованному показываем «Войти» вместо копии: путь к коду
 * начинается со входа, а не с пустого клика.
 */
export function GatedCopy({
  value,
  label,
  copiedLabel,
  locale,
  variant = "primary",
  className,
  onCopied,
}: {
  value: string | null
  label: string
  copiedLabel?: string
  locale: Locale
  variant?: "primary" | "secondary"
  className?: string
  onCopied?: () => void
}) {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Link
        href={localePath(locale, "/signin")}
        className={cn(
          "focus-visible:ring-shell-ring inline-flex h-9 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none",
          variant === "primary"
            ? "bg-shell-accent text-shell-accent-fg border-shell-accent hover:bg-shell-accent-deep hover:border-shell-accent-deep active:scale-[0.98]"
            : "border-shell-border text-shell-fg hover:bg-shell-elevated hover:border-shell-border-strong active:scale-[0.98]",
          className,
        )}
      >
        {locale === "en" ? "Sign in" : "Войти"}
      </Link>
    )
  }

  return (
    <CopyButton
      value={value}
      label={label}
      copiedLabel={copiedLabel}
      variant={variant}
      className={className}
      onCopied={onCopied}
    />
  )
}
