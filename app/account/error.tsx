"use client"

import { AccountError } from "@/components/account/error-state"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <AccountError locale="ru" error={error} reset={reset} />
}
