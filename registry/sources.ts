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
import aiRegistry from "@/registry/blocks/ai/registry.json"
import dashboardRegistry from "@/registry/blocks/dashboard/registry.json"
import commerceRegistry from "@/registry/blocks/commerce/registry.json"
import authRegistry from "@/registry/blocks/auth/registry.json"
import solutionsRegistry from "@/registry/blocks/solutions/registry.json"
import blogRegistry from "@/registry/blocks/blog/registry.json"
import contactRegistry from "@/registry/blocks/contact/registry.json"
import datagridRegistry from "@/registry/components/datagrid/registry.json"
import buttonsRegistry from "@/registry/components/buttons/registry.json"
import accordionRegistry from "@/registry/components/accordion/registry.json"
import alertRegistry from "@/registry/components/alert/registry.json"
import dialogRegistry from "@/registry/components/dialog/registry.json"
import alertdialogRegistry from "@/registry/components/alertdialog/registry.json"
import aspectRegistry from "@/registry/components/aspect/registry.json"
import autocompleteRegistry from "@/registry/components/autocomplete/registry.json"
import avatarRegistry from "@/registry/components/avatar/registry.json"
import badgeRegistry from "@/registry/components/badge/registry.json"
import buttongroupRegistry from "@/registry/components/buttongroup/registry.json"
import breadcrumbRegistry from "@/registry/components/breadcrumb/registry.json"
import calendarRegistry from "@/registry/components/calendar/registry.json"
import cardRegistry from "@/registry/components/card/registry.json"
import carouselRegistry from "@/registry/components/carousel/registry.json"
import checkboxRegistry from "@/registry/components/checkbox/registry.json"
import codeblockRegistry from "@/registry/components/codeblock/registry.json"
import comboboxRegistry from "@/registry/components/combobox/registry.json"
import labelRegistry from "@/registry/components/label/registry.json"
import nativeselectRegistry from "@/registry/components/nativeselect/registry.json"
import phoneinputRegistry from "@/registry/components/phoneinput/registry.json"
import resizableRegistry from "@/registry/components/resizable/registry.json"
import toggleRegistry from "@/registry/components/toggle/registry.json"
import togglegroupRegistry from "@/registry/components/togglegroup/registry.json"
import eventcalendarRegistry from "@/registry/components/eventcalendar/registry.json"
import menuRegistry from "@/registry/components/menu/registry.json"
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
    directory: "registry/blocks/ai",
    kind: "block",
    items: aiRegistry.items,
  },
  {
    directory: "registry/blocks/dashboard",
    kind: "block",
    items: dashboardRegistry.items,
  },
  {
    directory: "registry/blocks/commerce",
    kind: "block",
    items: commerceRegistry.items,
  },
  {
    directory: "registry/blocks/auth",
    kind: "block",
    items: authRegistry.items,
  },
  {
    directory: "registry/blocks/solutions",
    kind: "block",
    items: solutionsRegistry.items,
  },
  {
    directory: "registry/blocks/blog",
    kind: "block",
    items: blogRegistry.items,
  },
  {
    directory: "registry/blocks/contact",
    kind: "block",
    items: contactRegistry.items,
  },
  {
    directory: "registry/components/datagrid",
    kind: "component",
    items: datagridRegistry.items,
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
    directory: "registry/components/alertdialog",
    kind: "component",
    items: alertdialogRegistry.items,
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
    directory: "registry/components/buttongroup",
    kind: "component",
    items: buttongroupRegistry.items,
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
    directory: "registry/components/checkbox",
    kind: "component",
    items: checkboxRegistry.items,
  },
  {
    directory: "registry/components/codeblock",
    kind: "component",
    items: codeblockRegistry.items,
  },
  {
    directory: "registry/components/combobox",
    kind: "component",
    items: comboboxRegistry.items,
  },
  {
    directory: "registry/components/label",
    kind: "component",
    items: labelRegistry.items,
  },
  {
    directory: "registry/components/nativeselect",
    kind: "component",
    items: nativeselectRegistry.items,
  },
  {
    directory: "registry/components/phoneinput",
    kind: "component",
    items: phoneinputRegistry.items,
  },
  {
    directory: "registry/components/resizable",
    kind: "component",
    items: resizableRegistry.items,
  },
  {
    directory: "registry/components/toggle",
    kind: "component",
    items: toggleRegistry.items,
  },
  {
    directory: "registry/components/togglegroup",
    kind: "component",
    items: togglegroupRegistry.items,
  },
  {
    directory: "registry/components/eventcalendar",
    kind: "component",
    items: eventcalendarRegistry.items,
  },
  {
    directory: "registry/components/menu",
    kind: "component",
    items: menuRegistry.items,
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
