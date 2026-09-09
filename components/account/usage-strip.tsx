import { FREE_MONTHLY_LIMIT } from "@/lib/entitlements"

/**
 * Лента месяца: одно деление — один компонент. Обычная полоса прогресса
 * показала бы проценты, а человеку важно другое — сколько штук осталось и
 * насколько это много. Сто делений отвечают на оба вопроса сразу, без цифр.
 *
 * У подписки лента не нужна: считать нечего.
 */
export function UsageStrip({
  used,
  resetsOn,
}: {
  used: number
  resetsOn: string
}) {
  const left = Math.max(0, FREE_MONTHLY_LIMIT - used)
  const spent = Math.min(used, FREE_MONTHLY_LIMIT)

  return (
    <section className="border-shell-border bg-shell-panel rounded-2xl border p-6 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-shell-fg text-5xl leading-none font-semibold tabular-nums">
            {left}
          </p>
          <p className="text-shell-muted mt-2 text-sm">
            компонентов осталось в этом месяце
          </p>
        </div>
        <p className="text-shell-muted text-sm">Обновится {resetsOn}</p>
      </div>

      {/* Деления в разметке, а не в canvas: их читает скринридер как одно
          число, а глазами видно плотность израсходованного. Десятками —
          чтобы остаток можно было прикинуть, не читая цифру. */}
      <div
        className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-5"
        role="img"
        aria-label={`Израсходовано ${spent} из ${FREE_MONTHLY_LIMIT}`}
      >
        {Array.from({ length: FREE_MONTHLY_LIMIT / 10 }, (_, group) => (
          <span key={group} className="grid grid-cols-10 gap-[3px]">
            {Array.from({ length: 10 }, (_, slot) => (
              <span
                key={slot}
                className={`h-3.5 rounded-[2px] ${
                  group * 10 + slot < spent
                    ? "bg-shell-accent"
                    : "bg-shell-elevated"
                }`}
              />
            ))}
          </span>
        ))}
      </div>

      <p className="text-shell-muted mt-5 text-sm leading-relaxed">
        Считаются разные компоненты. Повторное копирование того же самого
        деление не занимает.
      </p>
    </section>
  )
}

/** То же место у подписчика: считать нечего, поэтому здесь просто статус. */
export function UnlimitedStrip({ until }: { until: string }) {
  return (
    <section className="border-shell-accent/40 bg-shell-panel rounded-2xl border p-6 sm:p-7">
      <p className="text-shell-fg text-5xl leading-none font-semibold">Pro</p>
      <p className="text-shell-muted mt-2 text-sm">
        Компоненты без ограничений, закрытые — тоже
      </p>
      <div className="bg-shell-accent mt-6 h-6 rounded-[2px]" />
      <p className="text-shell-muted mt-5 text-sm">Действует до {until}</p>
    </section>
  )
}
