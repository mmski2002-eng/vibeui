// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ItemKind } from "@/registry/categories"

import heroRegistry from "@/registry/blocks/hero/registry.json"
import featuresRegistry from "@/registry/blocks/features/registry.json"
import pricingRegistry from "@/registry/blocks/pricing/registry.json"
import buttonsRegistry from "@/registry/components/buttons/registry.json"
import inputsRegistry from "@/registry/components/inputs/registry.json"
import displayRegistry from "@/registry/components/display/registry.json"
import feedbackRegistry from "@/registry/components/feedback/registry.json"

/**
 * Реестры, попадающие на сайт. Это и есть файловая база каталога: другого
 * источника данных нет.
 *
 * Порядок списка задаёт порядок items в каталоге: сначала блоки, потом
 * компоненты, внутри типа — порядок категорий из `registry/categories.ts`.
 * `kind` объявляется на уровне реестра, а не у каждого item'а: все items
 * одного реестра — одного типа.
 */
export const SOURCES = [
  {
    directory: "registry/blocks/hero",
    kind: "block",
    items: heroRegistry.items,
  },
  {
    directory: "registry/blocks/features",
    kind: "block",
    items: featuresRegistry.items,
  },
  {
    directory: "registry/blocks/pricing",
    kind: "block",
    items: pricingRegistry.items,
  },
  {
    directory: "registry/components/buttons",
    kind: "component",
    items: buttonsRegistry.items,
  },
  {
    directory: "registry/components/inputs",
    kind: "component",
    items: inputsRegistry.items,
  },
  {
    directory: "registry/components/display",
    kind: "component",
    items: displayRegistry.items,
  },
  {
    directory: "registry/components/feedback",
    kind: "component",
    items: feedbackRegistry.items,
  },
] as const satisfies readonly {
  directory: string
  kind: ItemKind
  items: unknown[]
}[]
