// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ItemKind } from "@/registry/categories"
import type { PreviewMap } from "@/registry/preview-types"

export async function loadLazyPreviewMap(
  kind: ItemKind,
  category: string,
): Promise<PreviewMap | null> {
  switch (`${kind}/${category}`) {
    case "block/hero":
      return (await import("@/registry/previews-lazy/block/hero")).PREVIEWS
    case "block/navbar":
      return (await import("@/registry/previews-lazy/block/navbar")).PREVIEWS
    case "block/features":
      return (await import("@/registry/previews-lazy/block/features")).PREVIEWS
    case "block/pricing":
      return (await import("@/registry/previews-lazy/block/pricing")).PREVIEWS
    case "block/testimonials":
      return (await import("@/registry/previews-lazy/block/testimonials"))
        .PREVIEWS
    case "block/faq":
      return (await import("@/registry/previews-lazy/block/faq")).PREVIEWS
    case "block/cta":
      return (await import("@/registry/previews-lazy/block/cta")).PREVIEWS
    case "block/footer":
      return (await import("@/registry/previews-lazy/block/footer")).PREVIEWS
    case "block/ai":
      return (await import("@/registry/previews-lazy/block/ai")).PREVIEWS
    case "block/dashboard":
      return (await import("@/registry/previews-lazy/block/dashboard")).PREVIEWS
    case "block/commerce":
      return (await import("@/registry/previews-lazy/block/commerce")).PREVIEWS
    case "block/auth":
      return (await import("@/registry/previews-lazy/block/auth")).PREVIEWS
    case "block/solutions":
      return (await import("@/registry/previews-lazy/block/solutions")).PREVIEWS
    case "block/blog":
      return (await import("@/registry/previews-lazy/block/blog")).PREVIEWS
    case "block/contact":
      return (await import("@/registry/previews-lazy/block/contact")).PREVIEWS
    case "component/accordion":
      return (await import("@/registry/previews-lazy/component/accordion"))
        .PREVIEWS
    case "component/alert":
      return (await import("@/registry/previews-lazy/component/alert")).PREVIEWS
    case "component/alert-dialog":
      return (await import("@/registry/previews-lazy/component/alert-dialog"))
        .PREVIEWS
    case "component/aspect-ratio":
      return (await import("@/registry/previews-lazy/component/aspect-ratio"))
        .PREVIEWS
    case "component/autocomplete":
      return (await import("@/registry/previews-lazy/component/autocomplete"))
        .PREVIEWS
    case "component/avatar":
      return (await import("@/registry/previews-lazy/component/avatar"))
        .PREVIEWS
    case "component/badge":
      return (await import("@/registry/previews-lazy/component/badge")).PREVIEWS
    case "component/banner":
      return (await import("@/registry/previews-lazy/component/banner"))
        .PREVIEWS
    case "component/breadcrumb":
      return (await import("@/registry/previews-lazy/component/breadcrumb"))
        .PREVIEWS
    case "component/button":
      return (await import("@/registry/previews-lazy/component/button"))
        .PREVIEWS
    case "component/button-group":
      return (await import("@/registry/previews-lazy/component/button-group"))
        .PREVIEWS
    case "component/calendar":
      return (await import("@/registry/previews-lazy/component/calendar"))
        .PREVIEWS
    case "component/card":
      return (await import("@/registry/previews-lazy/component/card")).PREVIEWS
    case "component/carousel":
      return (await import("@/registry/previews-lazy/component/carousel"))
        .PREVIEWS
    case "component/cascader":
      return (await import("@/registry/previews-lazy/component/cascader"))
        .PREVIEWS
    case "component/chart":
      return (await import("@/registry/previews-lazy/component/chart")).PREVIEWS
    case "component/checkbox":
      return (await import("@/registry/previews-lazy/component/checkbox"))
        .PREVIEWS
    case "component/code-block":
      return (await import("@/registry/previews-lazy/component/code-block"))
        .PREVIEWS
    case "component/collapsible":
      return (await import("@/registry/previews-lazy/component/collapsible"))
        .PREVIEWS
    case "component/combobox":
      return (await import("@/registry/previews-lazy/component/combobox"))
        .PREVIEWS
    case "component/command":
      return (await import("@/registry/previews-lazy/component/command"))
        .PREVIEWS
    case "component/context-menu":
      return (await import("@/registry/previews-lazy/component/context-menu"))
        .PREVIEWS
    case "component/currency-input":
      return (await import("@/registry/previews-lazy/component/currency-input"))
        .PREVIEWS
    case "component/data-grid":
      return (await import("@/registry/previews-lazy/component/data-grid"))
        .PREVIEWS
    case "component/date-selector":
      return (await import("@/registry/previews-lazy/component/date-selector"))
        .PREVIEWS
    case "component/dialog":
      return (await import("@/registry/previews-lazy/component/dialog"))
        .PREVIEWS
    case "component/drawer":
      return (await import("@/registry/previews-lazy/component/drawer"))
        .PREVIEWS
    case "component/dropdown-menu":
      return (await import("@/registry/previews-lazy/component/dropdown-menu"))
        .PREVIEWS
    case "component/empty":
      return (await import("@/registry/previews-lazy/component/empty")).PREVIEWS
    case "component/event-calendar":
      return (await import("@/registry/previews-lazy/component/event-calendar"))
        .PREVIEWS
    case "component/field":
      return (await import("@/registry/previews-lazy/component/field")).PREVIEWS
    case "component/file-upload":
      return (await import("@/registry/previews-lazy/component/file-upload"))
        .PREVIEWS
    case "component/filters":
      return (await import("@/registry/previews-lazy/component/filters"))
        .PREVIEWS
    case "component/frame":
      return (await import("@/registry/previews-lazy/component/frame")).PREVIEWS
    case "component/gantt":
      return (await import("@/registry/previews-lazy/component/gantt")).PREVIEWS
    case "component/hover-card":
      return (await import("@/registry/previews-lazy/component/hover-card"))
        .PREVIEWS
    case "component/icon-stack":
      return (await import("@/registry/previews-lazy/component/icon-stack"))
        .PREVIEWS
    case "component/icon-tile":
      return (await import("@/registry/previews-lazy/component/icon-tile"))
        .PREVIEWS
    case "component/input":
      return (await import("@/registry/previews-lazy/component/input")).PREVIEWS
    case "component/input-group":
      return (await import("@/registry/previews-lazy/component/input-group"))
        .PREVIEWS
    case "component/input-otp":
      return (await import("@/registry/previews-lazy/component/input-otp"))
        .PREVIEWS
    case "component/item":
      return (await import("@/registry/previews-lazy/component/item")).PREVIEWS
    case "component/kanban":
      return (await import("@/registry/previews-lazy/component/kanban"))
        .PREVIEWS
    case "component/kbd":
      return (await import("@/registry/previews-lazy/component/kbd")).PREVIEWS
    case "component/label":
      return (await import("@/registry/previews-lazy/component/label")).PREVIEWS
    case "component/menubar":
      return (await import("@/registry/previews-lazy/component/menubar"))
        .PREVIEWS
    case "component/native-select":
      return (await import("@/registry/previews-lazy/component/native-select"))
        .PREVIEWS
    case "component/navigation-menu":
      return (
        await import("@/registry/previews-lazy/component/navigation-menu")
      ).PREVIEWS
    case "component/number-field":
      return (await import("@/registry/previews-lazy/component/number-field"))
        .PREVIEWS
    case "component/pagination":
      return (await import("@/registry/previews-lazy/component/pagination"))
        .PREVIEWS
    case "component/phone-input":
      return (await import("@/registry/previews-lazy/component/phone-input"))
        .PREVIEWS
    case "component/popover":
      return (await import("@/registry/previews-lazy/component/popover"))
        .PREVIEWS
    case "component/progress":
      return (await import("@/registry/previews-lazy/component/progress"))
        .PREVIEWS
    case "component/radio-group":
      return (await import("@/registry/previews-lazy/component/radio-group"))
        .PREVIEWS
    case "component/range":
      return (await import("@/registry/previews-lazy/component/range")).PREVIEWS
    case "component/rating":
      return (await import("@/registry/previews-lazy/component/rating"))
        .PREVIEWS
    case "component/resizable":
      return (await import("@/registry/previews-lazy/component/resizable"))
        .PREVIEWS
    case "component/scroll-area":
      return (await import("@/registry/previews-lazy/component/scroll-area"))
        .PREVIEWS
    case "component/scrollspy":
      return (await import("@/registry/previews-lazy/component/scrollspy"))
        .PREVIEWS
    case "component/select":
      return (await import("@/registry/previews-lazy/component/select"))
        .PREVIEWS
    case "component/separator":
      return (await import("@/registry/previews-lazy/component/separator"))
        .PREVIEWS
    case "component/sheet":
      return (await import("@/registry/previews-lazy/component/sheet")).PREVIEWS
    case "component/sidebar":
      return (await import("@/registry/previews-lazy/component/sidebar"))
        .PREVIEWS
    case "component/skeleton":
      return (await import("@/registry/previews-lazy/component/skeleton"))
        .PREVIEWS
    case "component/slider":
      return (await import("@/registry/previews-lazy/component/slider"))
        .PREVIEWS
    case "component/sortable":
      return (await import("@/registry/previews-lazy/component/sortable"))
        .PREVIEWS
    case "component/sparkline":
      return (await import("@/registry/previews-lazy/component/sparkline"))
        .PREVIEWS
    case "component/spinner":
      return (await import("@/registry/previews-lazy/component/spinner"))
        .PREVIEWS
    case "component/stepper":
      return (await import("@/registry/previews-lazy/component/stepper"))
        .PREVIEWS
    case "component/switch":
      return (await import("@/registry/previews-lazy/component/switch"))
        .PREVIEWS
    case "component/table":
      return (await import("@/registry/previews-lazy/component/table")).PREVIEWS
    case "component/tabs":
      return (await import("@/registry/previews-lazy/component/tabs")).PREVIEWS
    case "component/tags-input":
      return (await import("@/registry/previews-lazy/component/tags-input"))
        .PREVIEWS
    case "component/textarea":
      return (await import("@/registry/previews-lazy/component/textarea"))
        .PREVIEWS
    case "component/timeline":
      return (await import("@/registry/previews-lazy/component/timeline"))
        .PREVIEWS
    case "component/toast":
      return (await import("@/registry/previews-lazy/component/toast")).PREVIEWS
    case "component/toggle":
      return (await import("@/registry/previews-lazy/component/toggle"))
        .PREVIEWS
    case "component/toggle-group":
      return (await import("@/registry/previews-lazy/component/toggle-group"))
        .PREVIEWS
    case "component/tooltip":
      return (await import("@/registry/previews-lazy/component/tooltip"))
        .PREVIEWS
    case "component/tree":
      return (await import("@/registry/previews-lazy/component/tree")).PREVIEWS
    default:
      return null
  }
}
