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
import accordionRegistry from "@/registry/components/accordion/registry.json"
import alertRegistry from "@/registry/components/alert/registry.json"
import alertDialogRegistry from "@/registry/components/alert-dialog/registry.json"
import aspectRatioRegistry from "@/registry/components/aspect-ratio/registry.json"
import autocompleteRegistry from "@/registry/components/autocomplete/registry.json"
import avatarRegistry from "@/registry/components/avatar/registry.json"
import badgeRegistry from "@/registry/components/badge/registry.json"
import bannerRegistry from "@/registry/components/banner/registry.json"
import breadcrumbRegistry from "@/registry/components/breadcrumb/registry.json"
import buttonRegistry from "@/registry/components/button/registry.json"
import buttonGroupRegistry from "@/registry/components/button-group/registry.json"
import calendarRegistry from "@/registry/components/calendar/registry.json"
import cardRegistry from "@/registry/components/card/registry.json"
import carouselRegistry from "@/registry/components/carousel/registry.json"
import cascaderRegistry from "@/registry/components/cascader/registry.json"
import chartRegistry from "@/registry/components/chart/registry.json"
import checkboxRegistry from "@/registry/components/checkbox/registry.json"
import codeBlockRegistry from "@/registry/components/code-block/registry.json"
import collapsibleRegistry from "@/registry/components/collapsible/registry.json"
import comboboxRegistry from "@/registry/components/combobox/registry.json"
import commandRegistry from "@/registry/components/command/registry.json"
import contextMenuRegistry from "@/registry/components/context-menu/registry.json"
import currencyInputRegistry from "@/registry/components/currency-input/registry.json"
import dataGridRegistry from "@/registry/components/data-grid/registry.json"
import dateSelectorRegistry from "@/registry/components/date-selector/registry.json"
import dialogRegistry from "@/registry/components/dialog/registry.json"
import drawerRegistry from "@/registry/components/drawer/registry.json"
import dropdownMenuRegistry from "@/registry/components/dropdown-menu/registry.json"
import emptyRegistry from "@/registry/components/empty/registry.json"
import eventCalendarRegistry from "@/registry/components/event-calendar/registry.json"
import fieldRegistry from "@/registry/components/field/registry.json"
import fileUploadRegistry from "@/registry/components/file-upload/registry.json"
import filtersRegistry from "@/registry/components/filters/registry.json"
import frameRegistry from "@/registry/components/frame/registry.json"
import ganttRegistry from "@/registry/components/gantt/registry.json"
import hoverCardRegistry from "@/registry/components/hover-card/registry.json"
import iconStackRegistry from "@/registry/components/icon-stack/registry.json"
import iconTileRegistry from "@/registry/components/icon-tile/registry.json"
import inputRegistry from "@/registry/components/input/registry.json"
import inputGroupRegistry from "@/registry/components/input-group/registry.json"
import inputOtpRegistry from "@/registry/components/input-otp/registry.json"
import itemRegistry from "@/registry/components/item/registry.json"
import kanbanRegistry from "@/registry/components/kanban/registry.json"
import kbdRegistry from "@/registry/components/kbd/registry.json"
import labelRegistry from "@/registry/components/label/registry.json"
import menubarRegistry from "@/registry/components/menubar/registry.json"
import nativeSelectRegistry from "@/registry/components/native-select/registry.json"
import navigationMenuRegistry from "@/registry/components/navigation-menu/registry.json"
import numberFieldRegistry from "@/registry/components/number-field/registry.json"
import paginationRegistry from "@/registry/components/pagination/registry.json"
import phoneInputRegistry from "@/registry/components/phone-input/registry.json"
import popoverRegistry from "@/registry/components/popover/registry.json"
import progressRegistry from "@/registry/components/progress/registry.json"
import radioGroupRegistry from "@/registry/components/radio-group/registry.json"
import rangeRegistry from "@/registry/components/range/registry.json"
import ratingRegistry from "@/registry/components/rating/registry.json"
import resizableRegistry from "@/registry/components/resizable/registry.json"
import scrollAreaRegistry from "@/registry/components/scroll-area/registry.json"
import scrollspyRegistry from "@/registry/components/scrollspy/registry.json"
import selectRegistry from "@/registry/components/select/registry.json"
import separatorRegistry from "@/registry/components/separator/registry.json"
import sheetRegistry from "@/registry/components/sheet/registry.json"
import sidebarRegistry from "@/registry/components/sidebar/registry.json"
import skeletonRegistry from "@/registry/components/skeleton/registry.json"
import sliderRegistry from "@/registry/components/slider/registry.json"
import sortableRegistry from "@/registry/components/sortable/registry.json"
import sparklineRegistry from "@/registry/components/sparkline/registry.json"
import spinnerRegistry from "@/registry/components/spinner/registry.json"
import stepperRegistry from "@/registry/components/stepper/registry.json"
import switchRegistry from "@/registry/components/switch/registry.json"
import tableRegistry from "@/registry/components/table/registry.json"
import tabsRegistry from "@/registry/components/tabs/registry.json"
import tagsInputRegistry from "@/registry/components/tags-input/registry.json"
import textareaRegistry from "@/registry/components/textarea/registry.json"
import timelineRegistry from "@/registry/components/timeline/registry.json"
import toastRegistry from "@/registry/components/toast/registry.json"
import toggleRegistry from "@/registry/components/toggle/registry.json"
import toggleGroupRegistry from "@/registry/components/toggle-group/registry.json"
import tooltipRegistry from "@/registry/components/tooltip/registry.json"
import treeRegistry from "@/registry/components/tree/registry.json"

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
    directory: "registry/components/alert-dialog",
    kind: "component",
    items: alertDialogRegistry.items,
  },
  {
    directory: "registry/components/aspect-ratio",
    kind: "component",
    items: aspectRatioRegistry.items,
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
    directory: "registry/components/banner",
    kind: "component",
    items: bannerRegistry.items,
  },
  {
    directory: "registry/components/breadcrumb",
    kind: "component",
    items: breadcrumbRegistry.items,
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
    directory: "registry/components/cascader",
    kind: "component",
    items: cascaderRegistry.items,
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
    directory: "registry/components/collapsible",
    kind: "component",
    items: collapsibleRegistry.items,
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
    directory: "registry/components/context-menu",
    kind: "component",
    items: contextMenuRegistry.items,
  },
  {
    directory: "registry/components/currency-input",
    kind: "component",
    items: currencyInputRegistry.items,
  },
  {
    directory: "registry/components/data-grid",
    kind: "component",
    items: dataGridRegistry.items,
  },
  {
    directory: "registry/components/date-selector",
    kind: "component",
    items: dateSelectorRegistry.items,
  },
  {
    directory: "registry/components/dialog",
    kind: "component",
    items: dialogRegistry.items,
  },
  {
    directory: "registry/components/drawer",
    kind: "component",
    items: drawerRegistry.items,
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
    directory: "registry/components/event-calendar",
    kind: "component",
    items: eventCalendarRegistry.items,
  },
  {
    directory: "registry/components/field",
    kind: "component",
    items: fieldRegistry.items,
  },
  {
    directory: "registry/components/file-upload",
    kind: "component",
    items: fileUploadRegistry.items,
  },
  {
    directory: "registry/components/filters",
    kind: "component",
    items: filtersRegistry.items,
  },
  {
    directory: "registry/components/frame",
    kind: "component",
    items: frameRegistry.items,
  },
  {
    directory: "registry/components/gantt",
    kind: "component",
    items: ganttRegistry.items,
  },
  {
    directory: "registry/components/hover-card",
    kind: "component",
    items: hoverCardRegistry.items,
  },
  {
    directory: "registry/components/icon-stack",
    kind: "component",
    items: iconStackRegistry.items,
  },
  {
    directory: "registry/components/icon-tile",
    kind: "component",
    items: iconTileRegistry.items,
  },
  {
    directory: "registry/components/input",
    kind: "component",
    items: inputRegistry.items,
  },
  {
    directory: "registry/components/input-group",
    kind: "component",
    items: inputGroupRegistry.items,
  },
  {
    directory: "registry/components/input-otp",
    kind: "component",
    items: inputOtpRegistry.items,
  },
  {
    directory: "registry/components/item",
    kind: "component",
    items: itemRegistry.items,
  },
  {
    directory: "registry/components/kanban",
    kind: "component",
    items: kanbanRegistry.items,
  },
  {
    directory: "registry/components/kbd",
    kind: "component",
    items: kbdRegistry.items,
  },
  {
    directory: "registry/components/label",
    kind: "component",
    items: labelRegistry.items,
  },
  {
    directory: "registry/components/menubar",
    kind: "component",
    items: menubarRegistry.items,
  },
  {
    directory: "registry/components/native-select",
    kind: "component",
    items: nativeSelectRegistry.items,
  },
  {
    directory: "registry/components/navigation-menu",
    kind: "component",
    items: navigationMenuRegistry.items,
  },
  {
    directory: "registry/components/number-field",
    kind: "component",
    items: numberFieldRegistry.items,
  },
  {
    directory: "registry/components/pagination",
    kind: "component",
    items: paginationRegistry.items,
  },
  {
    directory: "registry/components/phone-input",
    kind: "component",
    items: phoneInputRegistry.items,
  },
  {
    directory: "registry/components/popover",
    kind: "component",
    items: popoverRegistry.items,
  },
  {
    directory: "registry/components/progress",
    kind: "component",
    items: progressRegistry.items,
  },
  {
    directory: "registry/components/radio-group",
    kind: "component",
    items: radioGroupRegistry.items,
  },
  {
    directory: "registry/components/range",
    kind: "component",
    items: rangeRegistry.items,
  },
  {
    directory: "registry/components/rating",
    kind: "component",
    items: ratingRegistry.items,
  },
  {
    directory: "registry/components/resizable",
    kind: "component",
    items: resizableRegistry.items,
  },
  {
    directory: "registry/components/scroll-area",
    kind: "component",
    items: scrollAreaRegistry.items,
  },
  {
    directory: "registry/components/scrollspy",
    kind: "component",
    items: scrollspyRegistry.items,
  },
  {
    directory: "registry/components/select",
    kind: "component",
    items: selectRegistry.items,
  },
  {
    directory: "registry/components/separator",
    kind: "component",
    items: separatorRegistry.items,
  },
  {
    directory: "registry/components/sheet",
    kind: "component",
    items: sheetRegistry.items,
  },
  {
    directory: "registry/components/sidebar",
    kind: "component",
    items: sidebarRegistry.items,
  },
  {
    directory: "registry/components/skeleton",
    kind: "component",
    items: skeletonRegistry.items,
  },
  {
    directory: "registry/components/slider",
    kind: "component",
    items: sliderRegistry.items,
  },
  {
    directory: "registry/components/sortable",
    kind: "component",
    items: sortableRegistry.items,
  },
  {
    directory: "registry/components/sparkline",
    kind: "component",
    items: sparklineRegistry.items,
  },
  {
    directory: "registry/components/spinner",
    kind: "component",
    items: spinnerRegistry.items,
  },
  {
    directory: "registry/components/stepper",
    kind: "component",
    items: stepperRegistry.items,
  },
  {
    directory: "registry/components/switch",
    kind: "component",
    items: switchRegistry.items,
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
    directory: "registry/components/tags-input",
    kind: "component",
    items: tagsInputRegistry.items,
  },
  {
    directory: "registry/components/textarea",
    kind: "component",
    items: textareaRegistry.items,
  },
  {
    directory: "registry/components/timeline",
    kind: "component",
    items: timelineRegistry.items,
  },
  {
    directory: "registry/components/toast",
    kind: "component",
    items: toastRegistry.items,
  },
  {
    directory: "registry/components/toggle",
    kind: "component",
    items: toggleRegistry.items,
  },
  {
    directory: "registry/components/toggle-group",
    kind: "component",
    items: toggleGroupRegistry.items,
  },
  {
    directory: "registry/components/tooltip",
    kind: "component",
    items: tooltipRegistry.items,
  },
  {
    directory: "registry/components/tree",
    kind: "component",
    items: treeRegistry.items,
  },
] as const satisfies readonly {
  directory: string
  kind: ItemKind
  items: unknown[]
}[]
