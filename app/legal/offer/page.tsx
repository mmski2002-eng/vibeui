import { CatalogShell } from "@/components/catalog/catalog-shell"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/legal/offer",
  title: "Оферта",
  description: "Публичный договор на доступ к библиотеке компонентов VibeUI.",
})

export default function OfferPage() {
  return (
    <CatalogShell locale="ru">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 lg:px-6">
        <h1 className="text-shell-fg text-3xl font-semibold tracking-tight">
          Публичная оферта
        </h1>
        <p className="text-shell-muted mt-4 text-sm leading-relaxed">
          Текст договора готовится. До его публикации приём оплаты не
          открывается: продавать доступ без опубликованных условий нельзя.
        </p>
      </main>
    </CatalogShell>
  )
}
