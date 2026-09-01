import type { ReactNode } from "react"

/**
 * Две колонки страницы item'а: список слева, содержимое справа. Витрина свои
 * колонки строит сама — там над ними ещё строка инструментов.
 */
export function CatalogColumns({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 lg:flex-row lg:gap-8 lg:px-6">
      {children}
    </div>
  )
}
