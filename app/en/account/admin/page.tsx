import { notFound } from "next/navigation"

export const metadata = { robots: { index: false, follow: false } }

/** Админка существует только в русской ветке: это внутренний инструмент. */
export default function Page() {
  notFound()
}
