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
    case "block/ai":
      return (await import("@/registry/previews/block/ai")).PREVIEWS
    case "block/dashboard":
      return (await import("@/registry/previews/block/dashboard")).PREVIEWS
    case "block/commerce":
      return (await import("@/registry/previews/block/commerce")).PREVIEWS
    case "block/auth":
      return (await import("@/registry/previews/block/auth")).PREVIEWS
    case "block/solutions":
      return (await import("@/registry/previews/block/solutions")).PREVIEWS
    case "block/blog":
      return (await import("@/registry/previews/block/blog")).PREVIEWS
    case "block/contact":
      return (await import("@/registry/previews/block/contact")).PREVIEWS
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
    case "component/data-grid":
      return (await import("@/registry/previews/component/data-grid")).PREVIEWS
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
    case "component/frame":
      return (await import("@/registry/previews/component/frame")).PREVIEWS
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
    case "component/scroll-area":
      return (await import("@/registry/previews/component/scroll-area")).PREVIEWS
    case "component/scrollspy":
      return (await import("@/registry/previews/component/scrollspy")).PREVIEWS
    case "component/select":
      return (await import("@/registry/previews/component/select")).PREVIEWS
    case "component/separator":
      return (await import("@/registry/previews/component/separator")).PREVIEWS
    case "component/sidebar":
      return (await import("@/registry/previews/component/sidebar")).PREVIEWS
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
    case "component/textarea":
      return (await import("@/registry/previews/component/textarea")).PREVIEWS
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
    case "animation/hero":
      return (await import("@/registry/previews/animation/hero")).PREVIEWS
    case "animation/navbar":
      return (await import("@/registry/previews/animation/navbar")).PREVIEWS
    case "animation/features":
      return (await import("@/registry/previews/animation/features")).PREVIEWS
    case "animation/pricing":
      return (await import("@/registry/previews/animation/pricing")).PREVIEWS
    case "animation/testimonials":
      return (await import("@/registry/previews/animation/testimonials")).PREVIEWS
    case "animation/faq":
      return (await import("@/registry/previews/animation/faq")).PREVIEWS
    case "animation/cta":
      return (await import("@/registry/previews/animation/cta")).PREVIEWS
    case "animation/footer":
      return (await import("@/registry/previews/animation/footer")).PREVIEWS
    case "animation/ai":
      return (await import("@/registry/previews/animation/ai")).PREVIEWS
    case "animation/dashboard":
      return (await import("@/registry/previews/animation/dashboard")).PREVIEWS
    case "animation/auth":
      return (await import("@/registry/previews/animation/auth")).PREVIEWS
    case "animation/blog":
      return (await import("@/registry/previews/animation/blog")).PREVIEWS
    case "animation/contact":
      return (await import("@/registry/previews/animation/contact")).PREVIEWS
    case "animation/avatar":
      return (await import("@/registry/previews/animation/avatar")).PREVIEWS
    case "animation/calendar":
      return (await import("@/registry/previews/animation/calendar")).PREVIEWS
    case "animation/chart":
      return (await import("@/registry/previews/animation/chart")).PREVIEWS
    case "animation/code-block":
      return (await import("@/registry/previews/animation/code-block")).PREVIEWS
    case "animation/empty":
      return (await import("@/registry/previews/animation/empty")).PREVIEWS
    case "animation/kanban":
      return (await import("@/registry/previews/animation/kanban")).PREVIEWS
    case "animation/kbd":
      return (await import("@/registry/previews/animation/kbd")).PREVIEWS
    case "animation/table":
      return (await import("@/registry/previews/animation/table")).PREVIEWS
    case "animation/timeline":
      return (await import("@/registry/previews/animation/timeline")).PREVIEWS
    case "animation/activity":
      return (await import("@/registry/previews/animation/activity")).PREVIEWS
    case "animation/api":
      return (await import("@/registry/previews/animation/api")).PREVIEWS
    case "animation/branding":
      return (await import("@/registry/previews/animation/branding")).PREVIEWS
    case "animation/browser":
      return (await import("@/registry/previews/animation/browser")).PREVIEWS
    case "animation/chat":
      return (await import("@/registry/previews/animation/chat")).PREVIEWS
    case "animation/connections":
      return (await import("@/registry/previews/animation/connections")).PREVIEWS
    case "animation/devices":
      return (await import("@/registry/previews/animation/devices")).PREVIEWS
    case "animation/email":
      return (await import("@/registry/previews/animation/email")).PREVIEWS
    case "animation/files":
      return (await import("@/registry/previews/animation/files")).PREVIEWS
    case "animation/geo":
      return (await import("@/registry/previews/animation/geo")).PREVIEWS
    case "animation/git":
      return (await import("@/registry/previews/animation/git")).PREVIEWS
    case "animation/images":
      return (await import("@/registry/previews/animation/images")).PREVIEWS
    case "animation/integrations":
      return (await import("@/registry/previews/animation/integrations")).PREVIEWS
    case "animation/media":
      return (await import("@/registry/previews/animation/media")).PREVIEWS
    case "animation/metrics":
      return (await import("@/registry/previews/animation/metrics")).PREVIEWS
    case "animation/notifications":
      return (await import("@/registry/previews/animation/notifications")).PREVIEWS
    case "animation/payments":
      return (await import("@/registry/previews/animation/payments")).PREVIEWS
    case "animation/search":
      return (await import("@/registry/previews/animation/search")).PREVIEWS
    case "animation/security":
      return (await import("@/registry/previews/animation/security")).PREVIEWS
    case "animation/status":
      return (await import("@/registry/previews/animation/status")).PREVIEWS
    case "animation/checklist":
      return (await import("@/registry/previews/animation/checklist")).PREVIEWS
    case "animation/bento":
      return (await import("@/registry/previews/animation/bento")).PREVIEWS
    case "animation/blog-post":
      return (await import("@/registry/previews/animation/blog-post")).PREVIEWS
    case "animation/comments":
      return (await import("@/registry/previews/animation/comments")).PREVIEWS
    case "animation/error":
      return (await import("@/registry/previews/animation/error")).PREVIEWS
    case "animation/logos":
      return (await import("@/registry/previews/animation/logos")).PREVIEWS
    case "animation/newsletter":
      return (await import("@/registry/previews/animation/newsletter")).PREVIEWS
    case "animation/process":
      return (await import("@/registry/previews/animation/process")).PREVIEWS
    case "animation/stats":
      return (await import("@/registry/previews/animation/stats")).PREVIEWS
    case "animation/team":
      return (await import("@/registry/previews/animation/team")).PREVIEWS
    case "animation/maintenance":
      return (await import("@/registry/previews/animation/maintenance")).PREVIEWS
    case "animation/not-found":
      return (await import("@/registry/previews/animation/not-found")).PREVIEWS
    default:
      return null
  }
}
