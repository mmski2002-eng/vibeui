// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ItemKind } from "@/registry/categories"

import heroRegistry from "@/registry/blocks/hero/registry.json"
import navbarRegistry from "@/registry/blocks/navbar/registry.json"
import featuresRegistry from "@/registry/blocks/features/registry.json"
import pricingRegistry from "@/registry/blocks/pricing/registry.json"
import testimonialsRegistry from "@/registry/blocks/testimonials/registry.json"
import faqRegistry from "@/registry/blocks/faq/registry.json"
import ctaRegistry from "@/registry/blocks/cta/registry.json"
import footerRegistry from "@/registry/blocks/footer/registry.json"
import buttonsRegistry from "@/registry/components/buttons/registry.json"
import accordionRegistry from "@/registry/components/accordion/registry.json"
import alertRegistry from "@/registry/components/alert/registry.json"
import dialogRegistry from "@/registry/components/dialog/registry.json"
import aspectRegistry from "@/registry/components/aspect/registry.json"
import autocompleteRegistry from "@/registry/components/autocomplete/registry.json"
import avatarRegistry from "@/registry/components/avatar/registry.json"
import badgeRegistry from "@/registry/components/badge/registry.json"
import breadcrumbRegistry from "@/registry/components/breadcrumb/registry.json"
import calendarRegistry from "@/registry/components/calendar/registry.json"
import cardRegistry from "@/registry/components/card/registry.json"
import carouselRegistry from "@/registry/components/carousel/registry.json"
import inputsRegistry from "@/registry/components/inputs/registry.json"
import displayRegistry from "@/registry/components/display/registry.json"
import feedbackRegistry from "@/registry/components/feedback/registry.json"
import navigationRegistry from "@/registry/components/navigation/registry.json"
import tablesRegistry from "@/registry/components/tables/registry.json"
import chartsRegistry from "@/registry/components/charts/registry.json"

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
    directory: "registry/blocks/navbar",
    kind: "block",
    items: navbarRegistry.items,
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
    directory: "registry/blocks/testimonials",
    kind: "block",
    items: testimonialsRegistry.items,
  },
  {
    directory: "registry/blocks/faq",
    kind: "block",
    items: faqRegistry.items,
  },
  {
    directory: "registry/blocks/cta",
    kind: "block",
    items: ctaRegistry.items,
  },
  {
    directory: "registry/blocks/footer",
    kind: "block",
    items: footerRegistry.items,
  },
  {
    directory: "registry/components/buttons",
    kind: "component",
    items: buttonsRegistry.items,
  },
  {
    directory: "registry/components/accordion",
    kind: "component",
    items: accordionRegistry.items,
  },
  {
    directory: "registry/components/alert",
    kind: "component",
    items: alertRegistry.items,
  },
  {
    directory: "registry/components/dialog",
    kind: "component",
    items: dialogRegistry.items,
  },
  {
    directory: "registry/components/aspect",
    kind: "component",
    items: aspectRegistry.items,
  },
  {
    directory: "registry/components/autocomplete",
    kind: "component",
    items: autocompleteRegistry.items,
  },
  {
    directory: "registry/components/avatar",
    kind: "component",
    items: avatarRegistry.items,
  },
  {
    directory: "registry/components/badge",
    kind: "component",
    items: badgeRegistry.items,
  },
  {
    directory: "registry/components/breadcrumb",
    kind: "component",
    items: breadcrumbRegistry.items,
  },
  {
    directory: "registry/components/calendar",
    kind: "component",
    items: calendarRegistry.items,
  },
  {
    directory: "registry/components/card",
    kind: "component",
    items: cardRegistry.items,
  },
  {
    directory: "registry/components/carousel",
    kind: "component",
    items: carouselRegistry.items,
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
  {
    directory: "registry/components/navigation",
    kind: "component",
    items: navigationRegistry.items,
  },
  {
    directory: "registry/components/tables",
    kind: "component",
    items: tablesRegistry.items,
  },
  {
    directory: "registry/components/charts",
    kind: "component",
    items: chartsRegistry.items,
  },
] as const satisfies readonly {
  directory: string
  kind: ItemKind
  items: unknown[]
}[]
