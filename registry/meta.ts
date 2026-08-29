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
    /**
     * Имя экспорта компонента (`Hero001`). Путь установки выводится из
     * `files[0].target`, а символ — нет, поэтому его приходится объявлять.
     */
    export?: string
    /**
     * Канонический пример использования — JSX, который агент вставит
     * в разметку. Единственное поле, которое нельзя вывести: это
     * дизайнерское решение автора компонента.
     *
     * Для `kind: component` обязательно по соглашению — без него агент не
     * знает, с какими пропсами ставить мелкий компонент. Для `kind: block`
     * опционально: секция ставится целиком и агент прочитает установленный
     * файл.
     */
    usage?: string
  }
  kind?: ItemKind
  group?: ItemGroup
  internal?: boolean
  featured?: boolean
}

export type CatalogItem = RegistryItem & { meta?: CatalogMeta }
