"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { authClient } from "@/lib/auth-client"

export function SignOutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        await authClient.signOut()
        router.push("/")
        router.refresh()
      }}
      className="border-shell-border text-shell-muted hover:border-shell-accent hover:text-shell-fg inline-flex h-9 items-center rounded-lg border px-3 text-sm transition-colors disabled:opacity-60"
    >
      {pending ? "Выходим…" : "Выйти"}
    </button>
  )
}
