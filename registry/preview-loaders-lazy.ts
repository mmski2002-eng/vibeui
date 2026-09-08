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
      return (await import("@/registry/previews-lazy/block/testimonials")).PREVIEWS
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
    case "block/blog":
      return (await import("@/registry/previews-lazy/block/blog")).PREVIEWS
    case "block/contact":
      return (await import("@/registry/previews-lazy/block/contact")).PREVIEWS
    case "block/errors":
      return (await import("@/registry/previews-lazy/block/errors")).PREVIEWS
    case "block/about":
      return (await import("@/registry/previews-lazy/block/about")).PREVIEWS
    case "block/cases":
      return (await import("@/registry/previews-lazy/block/cases")).PREVIEWS
    case "block/changelog":
      return (await import("@/registry/previews-lazy/block/changelog")).PREVIEWS
    case "block/roadmap":
      return (await import("@/registry/previews-lazy/block/roadmap")).PREVIEWS
    case "block/careers":
      return (await import("@/registry/previews-lazy/block/careers")).PREVIEWS
    case "block/comparison":
      return (await import("@/registry/previews-lazy/block/comparison")).PREVIEWS
    case "block/waitlist":
      return (await import("@/registry/previews-lazy/block/waitlist")).PREVIEWS
    case "block/consent":
      return (await import("@/registry/previews-lazy/block/consent")).PREVIEWS
    case "block/downloads":
      return (await import("@/registry/previews-lazy/block/downloads")).PREVIEWS
    case "block/portfolio":
      return (await import("@/registry/previews-lazy/block/portfolio")).PREVIEWS
    case "block/events":
      return (await import("@/registry/previews-lazy/block/events")).PREVIEWS
    case "block/video":
      return (await import("@/registry/previews-lazy/block/video")).PREVIEWS
    case "block/podcast":
      return (await import("@/registry/previews-lazy/block/podcast")).PREVIEWS
    case "block/press":
      return (await import("@/registry/previews-lazy/block/press")).PREVIEWS
    case "block/data-grid":
      return (await import("@/registry/previews-lazy/block/data-grid")).PREVIEWS
    case "block/logos":
      return (await import("@/registry/previews-lazy/block/logos")).PREVIEWS
    case "block/newsletter":
      return (await import("@/registry/previews-lazy/block/newsletter")).PREVIEWS
    case "block/team":
      return (await import("@/registry/previews-lazy/block/team")).PREVIEWS
    case "component/accordion":
      return (await import("@/registry/previews-lazy/component/accordion")).PREVIEWS
    case "component/alert":
      return (await import("@/registry/previews-lazy/component/alert")).PREVIEWS
    case "component/alert-dialog":
      return (await import("@/registry/previews-lazy/component/alert-dialog")).PREVIEWS
    case "component/aspect-ratio":
      return (await import("@/registry/previews-lazy/component/aspect-ratio")).PREVIEWS
    case "component/autocomplete":
      return (await import("@/registry/previews-lazy/component/autocomplete")).PREVIEWS
    case "component/avatar":
      return (await import("@/registry/previews-lazy/component/avatar")).PREVIEWS
    case "component/badge":
      return (await import("@/registry/previews-lazy/component/badge")).PREVIEWS
    case "component/banner":
      return (await import("@/registry/previews-lazy/component/banner")).PREVIEWS
    case "component/breadcrumb":
      return (await import("@/registry/previews-lazy/component/breadcrumb")).PREVIEWS
    case "component/button":
      return (await import("@/registry/previews-lazy/component/button")).PREVIEWS
    case "component/button-group":
      return (await import("@/registry/previews-lazy/component/button-group")).PREVIEWS
    case "component/calendar":
      return (await import("@/registry/previews-lazy/component/calendar")).PREVIEWS
    case "component/card":
      return (await import("@/registry/previews-lazy/component/card")).PREVIEWS
    case "component/carousel":
      return (await import("@/registry/previews-lazy/component/carousel")).PREVIEWS
    case "component/cascader":
      return (await import("@/registry/previews-lazy/component/cascader")).PREVIEWS
    case "component/chart":
      return (await import("@/registry/previews-lazy/component/chart")).PREVIEWS
    case "component/checkbox":
      return (await import("@/registry/previews-lazy/component/checkbox")).PREVIEWS
    case "component/code-block":
      return (await import("@/registry/previews-lazy/component/code-block")).PREVIEWS
    case "component/collapsible":
      return (await import("@/registry/previews-lazy/component/collapsible")).PREVIEWS
    case "component/combobox":
      return (await import("@/registry/previews-lazy/component/combobox")).PREVIEWS
    case "component/command":
      return (await import("@/registry/previews-lazy/component/command")).PREVIEWS
    case "component/context-menu":
      return (await import("@/registry/previews-lazy/component/context-menu")).PREVIEWS
    case "component/currency-input":
      return (await import("@/registry/previews-lazy/component/currency-input")).PREVIEWS
    case "component/date-selector":
      return (await import("@/registry/previews-lazy/component/date-selector")).PREVIEWS
    case "component/dialog":
      return (await import("@/registry/previews-lazy/component/dialog")).PREVIEWS
    case "component/drawer":
      return (await import("@/registry/previews-lazy/component/drawer")).PREVIEWS
    case "component/dropdown-menu":
      return (await import("@/registry/previews-lazy/component/dropdown-menu")).PREVIEWS
    case "component/empty":
      return (await import("@/registry/previews-lazy/component/empty")).PREVIEWS
    case "component/event-calendar":
      return (await import("@/registry/previews-lazy/component/event-calendar")).PREVIEWS
    case "component/field":
      return (await import("@/registry/previews-lazy/component/field")).PREVIEWS
    case "component/file-upload":
      return (await import("@/registry/previews-lazy/component/file-upload")).PREVIEWS
    case "component/filters":
      return (await import("@/registry/previews-lazy/component/filters")).PREVIEWS
    case "component/hover-card":
      return (await import("@/registry/previews-lazy/component/hover-card")).PREVIEWS
    case "component/icon-stack":
      return (await import("@/registry/previews-lazy/component/icon-stack")).PREVIEWS
    case "component/icon-tile":
      return (await import("@/registry/previews-lazy/component/icon-tile")).PREVIEWS
    case "component/input":
      return (await import("@/registry/previews-lazy/component/input")).PREVIEWS
    case "component/input-group":
      return (await import("@/registry/previews-lazy/component/input-group")).PREVIEWS
    case "component/input-otp":
      return (await import("@/registry/previews-lazy/component/input-otp")).PREVIEWS
    case "component/item":
      return (await import("@/registry/previews-lazy/component/item")).PREVIEWS
    case "component/kbd":
      return (await import("@/registry/previews-lazy/component/kbd")).PREVIEWS
    case "component/label":
      return (await import("@/registry/previews-lazy/component/label")).PREVIEWS
    case "component/native-select":
      return (await import("@/registry/previews-lazy/component/native-select")).PREVIEWS
    case "component/navigation-menu":
      return (await import("@/registry/previews-lazy/component/navigation-menu")).PREVIEWS
    case "component/number-field":
      return (await import("@/registry/previews-lazy/component/number-field")).PREVIEWS
    case "component/pagination":
      return (await import("@/registry/previews-lazy/component/pagination")).PREVIEWS
    case "component/phone-input":
      return (await import("@/registry/previews-lazy/component/phone-input")).PREVIEWS
    case "component/popover":
      return (await import("@/registry/previews-lazy/component/popover")).PREVIEWS
    case "component/progress":
      return (await import("@/registry/previews-lazy/component/progress")).PREVIEWS
    case "component/radio-group":
      return (await import("@/registry/previews-lazy/component/radio-group")).PREVIEWS
    case "component/range":
      return (await import("@/registry/previews-lazy/component/range")).PREVIEWS
    case "component/rating":
      return (await import("@/registry/previews-lazy/component/rating")).PREVIEWS
    case "component/scroll-area":
      return (await import("@/registry/previews-lazy/component/scroll-area")).PREVIEWS
    case "component/scrollspy":
      return (await import("@/registry/previews-lazy/component/scrollspy")).PREVIEWS
    case "component/select":
      return (await import("@/registry/previews-lazy/component/select")).PREVIEWS
    case "component/separator":
      return (await import("@/registry/previews-lazy/component/separator")).PREVIEWS
    case "component/skeleton":
      return (await import("@/registry/previews-lazy/component/skeleton")).PREVIEWS
    case "component/slider":
      return (await import("@/registry/previews-lazy/component/slider")).PREVIEWS
    case "component/sortable":
      return (await import("@/registry/previews-lazy/component/sortable")).PREVIEWS
    case "component/sparkline":
      return (await import("@/registry/previews-lazy/component/sparkline")).PREVIEWS
    case "component/spinner":
      return (await import("@/registry/previews-lazy/component/spinner")).PREVIEWS
    case "component/stepper":
      return (await import("@/registry/previews-lazy/component/stepper")).PREVIEWS
    case "component/switch":
      return (await import("@/registry/previews-lazy/component/switch")).PREVIEWS
    case "component/table":
      return (await import("@/registry/previews-lazy/component/table")).PREVIEWS
    case "component/tabs":
      return (await import("@/registry/previews-lazy/component/tabs")).PREVIEWS
    case "component/tags-input":
      return (await import("@/registry/previews-lazy/component/tags-input")).PREVIEWS
    case "component/textarea":
      return (await import("@/registry/previews-lazy/component/textarea")).PREVIEWS
    case "component/timeline":
      return (await import("@/registry/previews-lazy/component/timeline")).PREVIEWS
    case "component/toast":
      return (await import("@/registry/previews-lazy/component/toast")).PREVIEWS
    case "component/toggle":
      return (await import("@/registry/previews-lazy/component/toggle")).PREVIEWS
    case "component/toggle-group":
      return (await import("@/registry/previews-lazy/component/toggle-group")).PREVIEWS
    case "component/tooltip":
      return (await import("@/registry/previews-lazy/component/tooltip")).PREVIEWS
    case "component/tree":
      return (await import("@/registry/previews-lazy/component/tree")).PREVIEWS
    case "animation/cta":
      return (await import("@/registry/previews-lazy/animation/cta")).PREVIEWS
    case "animation/dashboard":
      return (await import("@/registry/previews-lazy/animation/dashboard")).PREVIEWS
    case "animation/auth":
      return (await import("@/registry/previews-lazy/animation/auth")).PREVIEWS
    case "animation/avatar":
      return (await import("@/registry/previews-lazy/animation/avatar")).PREVIEWS
    case "animation/button":
      return (await import("@/registry/previews-lazy/animation/button")).PREVIEWS
    case "animation/code-block":
      return (await import("@/registry/previews-lazy/animation/code-block")).PREVIEWS
    case "animation/chat":
      return (await import("@/registry/previews-lazy/animation/chat")).PREVIEWS
    case "animation/devices":
      return (await import("@/registry/previews-lazy/animation/devices")).PREVIEWS
    case "animation/media":
      return (await import("@/registry/previews-lazy/animation/media")).PREVIEWS
    case "animation/metrics":
      return (await import("@/registry/previews-lazy/animation/metrics")).PREVIEWS
    case "animation/notifications":
      return (await import("@/registry/previews-lazy/animation/notifications")).PREVIEWS
    case "animation/payments":
      return (await import("@/registry/previews-lazy/animation/payments")).PREVIEWS
    case "animation/security":
      return (await import("@/registry/previews-lazy/animation/security")).PREVIEWS
    case "animation/status":
      return (await import("@/registry/previews-lazy/animation/status")).PREVIEWS
    case "animation/checklist":
      return (await import("@/registry/previews-lazy/animation/checklist")).PREVIEWS
    case "animation/stacks":
      return (await import("@/registry/previews-lazy/animation/stacks")).PREVIEWS
    case "animation/cursor":
      return (await import("@/registry/previews-lazy/animation/cursor")).PREVIEWS
    case "animation/text":
      return (await import("@/registry/previews-lazy/animation/text")).PREVIEWS
    default:
      return null
  }
}
