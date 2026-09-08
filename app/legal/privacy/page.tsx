import { CatalogShell } from "@/components/catalog/catalog-shell"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/legal/privacy",
  title: "Политика обработки персональных данных",
  description:
    "Какие данные собирает VibeUI, зачем они нужны и как долго хранятся.",
})

export default function PrivacyPage() {
  return (
    <CatalogShell locale="ru">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 lg:px-6">
        <h1 className="text-shell-fg text-3xl font-semibold tracking-tight">
          Политика обработки персональных данных
        </h1>
        <p className="text-shell-muted mt-4 text-sm leading-relaxed">
          Текст политики готовится. Данные аккаунтов хранятся на сервере в
          России; при регистрации сохраняются адрес почты, имя, дата и версия
          принятых документов.
        </p>
      </main>
    </CatalogShell>
  )
}
