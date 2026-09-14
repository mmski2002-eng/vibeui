import { cn } from "@/lib/utils"

/** Мерцающий контур. Размер задаётся классами: `h-4 w-32`. */
export function Skeleton({ className }: { className?: string }) {
  return <span className={cn("acc-skeleton block", className)} aria-hidden="true" />
}

/**
 * Скелетон раздела: заголовок, ряд плиток и две панели. Он общий для всех
 * страниц кабинета — точная форма раздела неизвестна до ответа базы, а
 * мерцание одинаковой формы читается спокойнее, чем прыгающие контуры.
 */
export function PageSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="grid gap-2.5">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((tile) => (
          <div
            key={tile}
            className="border-shell-border bg-shell-panel grid gap-3 rounded-xl border p-4"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="border-shell-border bg-shell-panel grid gap-4 rounded-2xl border p-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-44 w-full" />
        </div>
        <div className="border-shell-border bg-shell-panel grid gap-3 rounded-2xl border p-5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  )
}
