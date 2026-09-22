// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ItemKind } from "@/registry/categories"

import heroRegistry from "@/registry/blocks/hero/registry.json"
import navbarRegistry from "@/registry/blocks/navbar/registry.json"
import pricingRegistry from "@/registry/blocks/pricing/registry.json"
import testimonialsRegistry from "@/registry/blocks/testimonials/registry.json"
import faqRegistry from "@/registry/blocks/faq/registry.json"
import ctaRegistry from "@/registry/blocks/cta/registry.json"
import footerRegistry from "@/registry/blocks/footer/registry.json"
import aiRegistry from "@/registry/blocks/ai/registry.json"
import authRegistry from "@/registry/blocks/auth/registry.json"
import blogRegistry from "@/registry/blocks/blog/registry.json"
import contactRegistry from "@/registry/blocks/contact/registry.json"
import mapRegistry from "@/registry/blocks/map/registry.json"
import errorsRegistry from "@/registry/blocks/errors/registry.json"
import industryRegistry from "@/registry/blocks/industry/registry.json"
import aboutRegistry from "@/registry/blocks/about/registry.json"
import portfolioRegistry from "@/registry/blocks/portfolio/registry.json"
import eventsRegistry from "@/registry/blocks/events/registry.json"
import dataGridRegistry from "@/registry/blocks/data-grid/registry.json"
import logosRegistry from "@/registry/blocks/logos/registry.json"
import newsletterRegistry from "@/registry/blocks/newsletter/registry.json"
import teamRegistry from "@/registry/blocks/team/registry.json"
import backgroundRegistry from "@/registry/blocks/background/registry.json"
import layoutRegistry from "@/registry/blocks/layout/registry.json"
import accordionRegistry from "@/registry/components/accordion/registry.json"
import alertRegistry from "@/registry/components/alert/registry.json"
import avatarRegistry from "@/registry/components/avatar/registry.json"
import badgeRegistry from "@/registry/components/badge/registry.json"
import buttonRegistry from "@/registry/components/button/registry.json"
import buttonGroupRegistry from "@/registry/components/button-group/registry.json"
import calendarRegistry from "@/registry/components/calendar/registry.json"
import cardRegistry from "@/registry/components/card/registry.json"
import carouselRegistry from "@/registry/components/carousel/registry.json"
import chartRegistry from "@/registry/components/chart/registry.json"
import checkboxRegistry from "@/registry/components/checkbox/registry.json"
import codeBlockRegistry from "@/registry/components/code-block/registry.json"
import comboboxRegistry from "@/registry/components/combobox/registry.json"
import commandRegistry from "@/registry/components/command/registry.json"
import dialogRegistry from "@/registry/components/dialog/registry.json"
import dropdownMenuRegistry from "@/registry/components/dropdown-menu/registry.json"
import emptyRegistry from "@/registry/components/empty/registry.json"
import loadingRegistry from "@/registry/components/loading/registry.json"
import inputRegistry from "@/registry/components/input/registry.json"
import specialInputRegistry from "@/registry/components/special-input/registry.json"
import mockupRegistry from "@/registry/components/mockup/registry.json"
import popoverRegistry from "@/registry/components/popover/registry.json"
import selectRegistry from "@/registry/components/select/registry.json"
import sliderRegistry from "@/registry/components/slider/registry.json"
import stepperRegistry from "@/registry/components/stepper/registry.json"
import tableRegistry from "@/registry/components/table/registry.json"
import tabsRegistry from "@/registry/components/tabs/registry.json"
import navigationRegistry from "@/registry/components/navigation/registry.json"
import toastRegistry from "@/registry/components/toast/registry.json"
import treeRegistry from "@/registry/components/tree/registry.json"
import typographyRegistry from "@/registry/components/typography/registry.json"
import stacksRegistry from "@/registry/animations/stacks/registry.json"
import cursorRegistry from "@/registry/animations/cursor/registry.json"
import sketchRegistry from "@/registry/animations/sketch/registry.json"
import backgroundAnimationRegistry from "@/registry/animations/background/registry.json"
import interfaceRegistry from "@/registry/animations/interface/registry.json"
import promoRegistry from "@/registry/animations/promo/registry.json"

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
    directory: "registry/blocks/auth",
    kind: "block",
    items: authRegistry.items,
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
    directory: "registry/blocks/map",
    kind: "block",
    items: mapRegistry.items,
  },
  {
    directory: "registry/blocks/errors",
    kind: "block",
    items: errorsRegistry.items,
  },
  {
    directory: "registry/blocks/industry",
    kind: "block",
    items: industryRegistry.items,
  },
  {
    directory: "registry/blocks/about",
    kind: "block",
    items: aboutRegistry.items,
  },
  {
    directory: "registry/blocks/portfolio",
    kind: "block",
    items: portfolioRegistry.items,
  },
  {
    directory: "registry/blocks/events",
    kind: "block",
    items: eventsRegistry.items,
  },
  {
    directory: "registry/blocks/data-grid",
    kind: "block",
    items: dataGridRegistry.items,
  },
  {
    directory: "registry/blocks/logos",
    kind: "block",
    items: logosRegistry.items,
  },
  {
    directory: "registry/blocks/newsletter",
    kind: "block",
    items: newsletterRegistry.items,
  },
  {
    directory: "registry/blocks/team",
    kind: "block",
    items: teamRegistry.items,
  },
  {
    directory: "registry/blocks/background",
    kind: "block",
    items: backgroundRegistry.items,
  },
  {
    directory: "registry/blocks/layout",
    kind: "block",
    items: layoutRegistry.items,
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
    directory: "registry/components/button",
    kind: "component",
    items: buttonRegistry.items,
  },
  {
    directory: "registry/components/button-group",
    kind: "component",
    items: buttonGroupRegistry.items,
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
    directory: "registry/components/chart",
    kind: "component",
    items: chartRegistry.items,
  },
  {
    directory: "registry/components/checkbox",
    kind: "component",
    items: checkboxRegistry.items,
  },
  {
    directory: "registry/components/code-block",
    kind: "component",
    items: codeBlockRegistry.items,
  },
  {
    directory: "registry/components/combobox",
    kind: "component",
    items: comboboxRegistry.items,
  },
  {
    directory: "registry/components/command",
    kind: "component",
    items: commandRegistry.items,
  },
  {
    directory: "registry/components/dialog",
    kind: "component",
    items: dialogRegistry.items,
  },
  {
    directory: "registry/components/dropdown-menu",
    kind: "component",
    items: dropdownMenuRegistry.items,
  },
  {
    directory: "registry/components/empty",
    kind: "component",
    items: emptyRegistry.items,
  },
  {
    directory: "registry/components/loading",
    kind: "component",
    items: loadingRegistry.items,
  },
  {
    directory: "registry/components/input",
    kind: "component",
    items: inputRegistry.items,
  },
  {
    directory: "registry/components/special-input",
    kind: "component",
    items: specialInputRegistry.items,
  },
  {
    directory: "registry/components/mockup",
    kind: "component",
    items: mockupRegistry.items,
  },
  {
    directory: "registry/components/popover",
    kind: "component",
    items: popoverRegistry.items,
  },
  {
    directory: "registry/components/select",
    kind: "component",
    items: selectRegistry.items,
  },
  {
    directory: "registry/components/slider",
    kind: "component",
    items: sliderRegistry.items,
  },
  {
    directory: "registry/components/stepper",
    kind: "component",
    items: stepperRegistry.items,
  },
  {
    directory: "registry/components/table",
    kind: "component",
    items: tableRegistry.items,
  },
  {
    directory: "registry/components/tabs",
    kind: "component",
    items: tabsRegistry.items,
  },
  {
    directory: "registry/components/navigation",
    kind: "component",
    items: navigationRegistry.items,
  },
  {
    directory: "registry/components/toast",
    kind: "component",
    items: toastRegistry.items,
  },
  {
    directory: "registry/components/tree",
    kind: "component",
    items: treeRegistry.items,
  },
  {
    directory: "registry/components/typography",
    kind: "component",
    items: typographyRegistry.items,
  },
  {
    directory: "registry/animations/stacks",
    kind: "animation",
    items: stacksRegistry.items,
  },
  {
    directory: "registry/animations/cursor",
    kind: "animation",
    items: cursorRegistry.items,
  },
  {
    directory: "registry/animations/sketch",
    kind: "animation",
    items: sketchRegistry.items,
  },
  {
    directory: "registry/animations/background",
    kind: "animation",
    items: backgroundAnimationRegistry.items,
  },
  {
    directory: "registry/animations/interface",
    kind: "animation",
    items: interfaceRegistry.items,
  },
  {
    directory: "registry/animations/promo",
    kind: "animation",
    items: promoRegistry.items,
  },
] as const satisfies readonly {
  directory: string
  kind: ItemKind
  items: unknown[]
}[]
