import type { Metadata } from "next"

import { CatalogShell } from "@/components/catalog/catalog-shell"

/**
 * Страница для тестов — пустой холст для ручной проверки объектов.
 * Не индексируется, содержимое добавляется по месту.
 */
export const metadata: Metadata = {
  title: "Страница для тестов",
  robots: { index: false, follow: false },
}

export default function LabPage() {
  return (
    <CatalogShell locale="ru">
      <main className="mx-auto w-full max-w-[1440px] px-4 py-10 lg:px-6" />
    </CatalogShell>
  )
}
