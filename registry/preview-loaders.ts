// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ItemKind } from "@/registry/categories"
import type { PreviewLoaderMap } from "@/registry/preview-types"

export async function loadPreviewMap(
  kind: ItemKind,
  category: string,
): Promise<PreviewLoaderMap | null> {
  switch (`${kind}/${category}`) {
    case "block/hero":
      return (await import("@/registry/previews/block/hero")).PREVIEWS
    case "block/navbar":
      return (await import("@/registry/previews/block/navbar")).PREVIEWS
    case "block/features":
      return (await import("@/registry/previews/block/features")).PREVIEWS
    case "block/pricing":
      return (await import("@/registry/previews/block/pricing")).PREVIEWS
    case "block/testimonials":
      return (await import("@/registry/previews/block/testimonials")).PREVIEWS
    case "block/faq":
      return (await import("@/registry/previews/block/faq")).PREVIEWS
    case "block/cta":
      return (await import("@/registry/previews/block/cta")).PREVIEWS
    case "block/footer":
      return (await import("@/registry/previews/block/footer")).PREVIEWS
    case "block/auth":
      return (await import("@/registry/previews/block/auth")).PREVIEWS
    case "block/blog":
      return (await import("@/registry/previews/block/blog")).PREVIEWS
    case "block/contact":
      return (await import("@/registry/previews/block/contact")).PREVIEWS
    case "block/map":
      return (await import("@/registry/previews/block/map")).PREVIEWS
    case "block/errors":
      return (await import("@/registry/previews/block/errors")).PREVIEWS
    case "block/about":
      return (await import("@/registry/previews/block/about")).PREVIEWS
    case "block/cases":
      return (await import("@/registry/previews/block/cases")).PREVIEWS
    case "block/changelog":
      return (await import("@/registry/previews/block/changelog")).PREVIEWS
    case "block/roadmap":
      return (await import("@/registry/previews/block/roadmap")).PREVIEWS
    case "block/careers":
      return (await import("@/registry/previews/block/careers")).PREVIEWS
    case "block/comparison":
      return (await import("@/registry/previews/block/comparison")).PREVIEWS
    case "block/waitlist":
      return (await import("@/registry/previews/block/waitlist")).PREVIEWS
    case "block/consent":
      return (await import("@/registry/previews/block/consent")).PREVIEWS
    case "block/downloads":
      return (await import("@/registry/previews/block/downloads")).PREVIEWS
    case "block/portfolio":
      return (await import("@/registry/previews/block/portfolio")).PREVIEWS
    case "block/events":
      return (await import("@/registry/previews/block/events")).PREVIEWS
    case "block/video":
      return (await import("@/registry/previews/block/video")).PREVIEWS
    case "block/podcast":
      return (await import("@/registry/previews/block/podcast")).PREVIEWS
    case "block/press":
      return (await import("@/registry/previews/block/press")).PREVIEWS
    case "block/data-grid":
      return (await import("@/registry/previews/block/data-grid")).PREVIEWS
    case "block/logos":
      return (await import("@/registry/previews/block/logos")).PREVIEWS
    case "block/newsletter":
      return (await import("@/registry/previews/block/newsletter")).PREVIEWS
    case "block/team":
      return (await import("@/registry/previews/block/team")).PREVIEWS
    case "component/accordion":
      return (await import("@/registry/previews/component/accordion")).PREVIEWS
    case "component/alert":
      return (await import("@/registry/previews/component/alert")).PREVIEWS
    case "component/alert-dialog":
      return (await import("@/registry/previews/component/alert-dialog")).PREVIEWS
    case "component/aspect-ratio":
      return (await import("@/registry/previews/component/aspect-ratio")).PREVIEWS
    case "component/autocomplete":
      return (await import("@/registry/previews/component/autocomplete")).PREVIEWS
    case "component/avatar":
      return (await import("@/registry/previews/component/avatar")).PREVIEWS
    case "component/badge":
      return (await import("@/registry/previews/component/badge")).PREVIEWS
    case "component/banner":
      return (await import("@/registry/previews/component/banner")).PREVIEWS
    case "component/breadcrumb":
      return (await import("@/registry/previews/component/breadcrumb")).PREVIEWS
    case "component/button":
      return (await import("@/registry/previews/component/button")).PREVIEWS
    case "component/button-group":
      return (await import("@/registry/previews/component/button-group")).PREVIEWS
    case "component/calendar":
      return (await import("@/registry/previews/component/calendar")).PREVIEWS
    case "component/card":
      return (await import("@/registry/previews/component/card")).PREVIEWS
    case "component/carousel":
      return (await import("@/registry/previews/component/carousel")).PREVIEWS
    case "component/cascader":
      return (await import("@/registry/previews/component/cascader")).PREVIEWS
    case "component/chart":
      return (await import("@/registry/previews/component/chart")).PREVIEWS
    case "component/checkbox":
      return (await import("@/registry/previews/component/checkbox")).PREVIEWS
    case "component/code-block":
      return (await import("@/registry/previews/component/code-block")).PREVIEWS
    case "component/collapsible":
      return (await import("@/registry/previews/component/collapsible")).PREVIEWS
    case "component/combobox":
      return (await import("@/registry/previews/component/combobox")).PREVIEWS
    case "component/command":
      return (await import("@/registry/previews/component/command")).PREVIEWS
    case "component/context-menu":
      return (await import("@/registry/previews/component/context-menu")).PREVIEWS
    case "component/currency-input":
      return (await import("@/registry/previews/component/currency-input")).PREVIEWS
    case "component/date-selector":
      return (await import("@/registry/previews/component/date-selector")).PREVIEWS
    case "component/dialog":
      return (await import("@/registry/previews/component/dialog")).PREVIEWS
    case "component/drawer":
      return (await import("@/registry/previews/component/drawer")).PREVIEWS
    case "component/dropdown-menu":
      return (await import("@/registry/previews/component/dropdown-menu")).PREVIEWS
    case "component/empty":
      return (await import("@/registry/previews/component/empty")).PREVIEWS
    case "component/event-calendar":
      return (await import("@/registry/previews/component/event-calendar")).PREVIEWS
    case "component/field":
      return (await import("@/registry/previews/component/field")).PREVIEWS
    case "component/file-upload":
      return (await import("@/registry/previews/component/file-upload")).PREVIEWS
    case "component/filters":
      return (await import("@/registry/previews/component/filters")).PREVIEWS
    case "component/hover-card":
      return (await import("@/registry/previews/component/hover-card")).PREVIEWS
    case "component/icon-stack":
      return (await import("@/registry/previews/component/icon-stack")).PREVIEWS
    case "component/icon-tile":
      return (await import("@/registry/previews/component/icon-tile")).PREVIEWS
    case "component/input":
      return (await import("@/registry/previews/component/input")).PREVIEWS
    case "component/input-group":
      return (await import("@/registry/previews/component/input-group")).PREVIEWS
    case "component/input-otp":
      return (await import("@/registry/previews/component/input-otp")).PREVIEWS
    case "component/item":
      return (await import("@/registry/previews/component/item")).PREVIEWS
    case "component/kbd":
      return (await import("@/registry/previews/component/kbd")).PREVIEWS
    case "component/label":
      return (await import("@/registry/previews/component/label")).PREVIEWS
    case "component/native-select":
      return (await import("@/registry/previews/component/native-select")).PREVIEWS
    case "component/navigation-menu":
      return (await import("@/registry/previews/component/navigation-menu")).PREVIEWS
    case "component/number-field":
      return (await import("@/registry/previews/component/number-field")).PREVIEWS
    case "component/pagination":
      return (await import("@/registry/previews/component/pagination")).PREVIEWS
    case "component/phone-input":
      return (await import("@/registry/previews/component/phone-input")).PREVIEWS
    case "component/popover":
      return (await import("@/registry/previews/component/popover")).PREVIEWS
    case "component/progress":
      return (await import("@/registry/previews/component/progress")).PREVIEWS
    case "component/radio-group":
      return (await import("@/registry/previews/component/radio-group")).PREVIEWS
    case "component/range":
      return (await import("@/registry/previews/component/range")).PREVIEWS
    case "component/rating":
      return (await import("@/registry/previews/component/rating")).PREVIEWS
    case "component/scrollspy":
      return (await import("@/registry/previews/component/scrollspy")).PREVIEWS
    case "component/select":
      return (await import("@/registry/previews/component/select")).PREVIEWS
    case "component/separator":
      return (await import("@/registry/previews/component/separator")).PREVIEWS
    case "component/skeleton":
      return (await import("@/registry/previews/component/skeleton")).PREVIEWS
    case "component/slider":
      return (await import("@/registry/previews/component/slider")).PREVIEWS
    case "component/sortable":
      return (await import("@/registry/previews/component/sortable")).PREVIEWS
    case "component/sparkline":
      return (await import("@/registry/previews/component/sparkline")).PREVIEWS
    case "component/spinner":
      return (await import("@/registry/previews/component/spinner")).PREVIEWS
    case "component/stepper":
      return (await import("@/registry/previews/component/stepper")).PREVIEWS
    case "component/switch":
      return (await import("@/registry/previews/component/switch")).PREVIEWS
    case "component/table":
      return (await import("@/registry/previews/component/table")).PREVIEWS
    case "component/tabs":
      return (await import("@/registry/previews/component/tabs")).PREVIEWS
    case "component/tags-input":
      return (await import("@/registry/previews/component/tags-input")).PREVIEWS
    case "component/timeline":
      return (await import("@/registry/previews/component/timeline")).PREVIEWS
    case "component/toast":
      return (await import("@/registry/previews/component/toast")).PREVIEWS
    case "component/toggle":
      return (await import("@/registry/previews/component/toggle")).PREVIEWS
    case "component/toggle-group":
      return (await import("@/registry/previews/component/toggle-group")).PREVIEWS
    case "component/tooltip":
      return (await import("@/registry/previews/component/tooltip")).PREVIEWS
    case "component/tree":
      return (await import("@/registry/previews/component/tree")).PREVIEWS
    case "animation/cta":
      return (await import("@/registry/previews/animation/cta")).PREVIEWS
    case "animation/dashboard":
      return (await import("@/registry/previews/animation/dashboard")).PREVIEWS
    case "animation/auth":
      return (await import("@/registry/previews/animation/auth")).PREVIEWS
    case "animation/avatar":
      return (await import("@/registry/previews/animation/avatar")).PREVIEWS
    case "animation/button":
      return (await import("@/registry/previews/animation/button")).PREVIEWS
    case "animation/code-block":
      return (await import("@/registry/previews/animation/code-block")).PREVIEWS
    case "animation/chat":
      return (await import("@/registry/previews/animation/chat")).PREVIEWS
    case "animation/devices":
      return (await import("@/registry/previews/animation/devices")).PREVIEWS
    case "animation/media":
      return (await import("@/registry/previews/animation/media")).PREVIEWS
    case "animation/metrics":
      return (await import("@/registry/previews/animation/metrics")).PREVIEWS
    case "animation/notifications":
      return (await import("@/registry/previews/animation/notifications")).PREVIEWS
    case "animation/payments":
      return (await import("@/registry/previews/animation/payments")).PREVIEWS
    case "animation/security":
      return (await import("@/registry/previews/animation/security")).PREVIEWS
    case "animation/status":
      return (await import("@/registry/previews/animation/status")).PREVIEWS
    case "animation/checklist":
      return (await import("@/registry/previews/animation/checklist")).PREVIEWS
    case "animation/stacks":
      return (await import("@/registry/previews/animation/stacks")).PREVIEWS
    case "animation/cursor":
      return (await import("@/registry/previews/animation/cursor")).PREVIEWS
    case "animation/text":
      return (await import("@/registry/previews/animation/text")).PREVIEWS
    case "animation/background":
      return (await import("@/registry/previews/animation/background")).PREVIEWS
    default:
      return null
  }
}
