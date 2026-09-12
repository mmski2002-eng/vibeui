import type { ReactNode } from "react"

import { CatalogLayout } from "@/components/catalog/catalog-layout"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <CatalogLayout locale="en" kind="animation">
      {children}
    </CatalogLayout>
  )
}
