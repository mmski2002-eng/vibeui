import type { RegistryItem } from "shadcn/schema"

import type { ItemGroup, ItemKind } from "@/registry/categories"

/**
 * Поле `meta` registry item'а. Доезжает в `/r/<name>.json`, то есть агент
 * видит его при установке.
 *
 * `kind` и `group` здесь необязательны и служат точечным исключением:
 * по умолчанию `kind` берётся из объявившего item реестра, а `group` — из
 * категории (см. `registry/categories.ts`). Проставлять их руками у каждого
 * item'а не нужно и не следует — это было бы дублирование metadata.
 */
export type CatalogMeta = {
  tags: string[]
  ai: {
    summary: string
    preserve: string[]
    adapt: string[]
    notes?: string[]
  }
  kind?: ItemKind
  group?: ItemGroup
  internal?: boolean
  featured?: boolean
}

export type CatalogItem = RegistryItem & { meta?: CatalogMeta }
