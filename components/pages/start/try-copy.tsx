"use client"

import { useState } from "react"

import { CopyForAi } from "@/components/catalog/copy-for-ai"
import type { Locale } from "@/lib/i18n"

/**
 * «Копировать для ИИ» в тестовом блоке с пульсирующим кольцом: подсказка,
 * куда нажать. После первого копирования кольцо гаснет — цель достигнута.
 */
export function TryCopy({
  name,
  label,
  copiedLabel,
  locale,
}: {
  name: string
  label: string
  copiedLabel: string
  locale: Locale
}) {
  const [copied, setCopied] = useState(false)

  return (
    <span
      className="start-pulse inline-flex rounded-md"
      data-copied={copied ? "true" : undefined}
    >
      <CopyForAi
        name={name}
        label={label}
        copiedLabel={copiedLabel}
        locale={locale}
        onCopied={() => setCopied(true)}
      />
    </span>
  )
}
