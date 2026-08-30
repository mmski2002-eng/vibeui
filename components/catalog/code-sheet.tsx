"use client"

import Link from "next/link"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { getDictionary, type Locale } from "@/lib/i18n"

/**
 * Панель кода, выезжающая справа по кнопке Get Code.
 *
 * Внутри нативный `<dialog>` с `showModal()`: Esc, ловушка фокуса и
 * `::backdrop` достаются от браузера, руками добавлен только клик мимо.
 *
 * Исходник не приходит вместе с карточкой: витрина отдаёт десятки items, и
 * тащить их код в разметку страницы означало бы мегабайты ради панели,
 * которую откроют один раз. Файл забирается по `/f/<name>.tsx` при первом
 * открытии — тот самый адрес, который получает и агент, поэтому показанный
 * код гарантированно совпадает с устанавливаемым.
 */
export function CodeSheet({
  name,
  title,
  installCommand,
  itemUrl,
  locale,
  open,
  onClose,
}: {
  name: string
  title: string
  installCommand: string | null
  itemUrl: string
  locale: Locale
  open: boolean
  onClose: () => void
}) {
  const t = getDictionary(locale)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [source, setSource] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (open && !dialog.open) {
      dialog.showModal()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    if (!open || source !== null) {
      return
    }

    let cancelled = false

    fetch(`/f/${name}.tsx`)
      .then((response) => (response.ok ? response.text() : Promise.reject()))
      .then((text) => {
        if (!cancelled) {
          setSource(text)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [open, name, source])

  return (
    <dialog
      ref={dialogRef}
      className="code-sheet bg-shell text-shell-fg border-shell-border"
      onClose={onClose}
      onClick={(event) => {
        // Клик мимо: у dialog события backdrop приходят на сам элемент.
        if (event.target === dialogRef.current) {
          onClose()
        }
      }}
    >
      <div className="flex h-full flex-col">
        <header className="border-shell-border flex items-center justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="text-shell-muted truncate text-xs">{name}</p>
          </div>
          <div className="flex flex-none items-center gap-2">
            <Link
              href={itemUrl}
              className="text-shell-muted hover:text-shell-fg text-xs"
            >
              {t.card.openPage}
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.card.close}
              className="border-shell-border text-shell-muted hover:text-shell-fg hover:border-shell-border-strong focus-visible:ring-shell-ring inline-flex size-7 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <section className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium">{t.card.install}</h2>
              <CopyButton
                value={installCommand}
                label={t.card.copyCommand}
                copiedLabel={t.card.copied}
                className="h-7 px-3 text-xs"
              />
            </div>
            <CodeBlock code={installCommand ?? t.item.noCommand} />
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium">{t.card.code}</h2>
              <CopyButton
                value={source}
                label={t.card.copyCode}
                copiedLabel={t.card.copied}
                className="h-7 px-3 text-xs"
              />
            </div>
            <CodeBlock
              code={
                source ?? (failed ? t.item.noSource : `${t.card.loading}\n\n\n`)
              }
            />
          </section>
        </div>
      </div>
    </dialog>
  )
}
