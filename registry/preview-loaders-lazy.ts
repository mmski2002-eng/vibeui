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
    case "block/auth":
      return (await import("@/registry/previews-lazy/block/auth")).PREVIEWS
    case "block/blog":
      return (await import("@/registry/previews-lazy/block/blog")).PREVIEWS
    case "block/contact":
      return (await import("@/registry/previews-lazy/block/contact")).PREVIEWS
    case "block/map":
      return (await import("@/registry/previews-lazy/block/map")).PREVIEWS
    case "block/errors":
      return (await import("@/registry/previews-lazy/block/errors")).PREVIEWS
    case "block/industry":
      return (await import("@/registry/previews-lazy/block/industry")).PREVIEWS
    case "block/about":
      return (await import("@/registry/previews-lazy/block/about")).PREVIEWS
    case "block/portfolio":
      return (await import("@/registry/previews-lazy/block/portfolio")).PREVIEWS
    case "block/events":
      return (await import("@/registry/previews-lazy/block/events")).PREVIEWS
    case "block/data-grid":
      return (await import("@/registry/previews-lazy/block/data-grid")).PREVIEWS
    case "block/logos":
      return (await import("@/registry/previews-lazy/block/logos")).PREVIEWS
    case "block/newsletter":
      return (await import("@/registry/previews-lazy/block/newsletter")).PREVIEWS
    case "block/team":
      return (await import("@/registry/previews-lazy/block/team")).PREVIEWS
    case "block/background":
      return (await import("@/registry/previews-lazy/block/background")).PREVIEWS
    case "block/layout":
      return (await import("@/registry/previews-lazy/block/layout")).PREVIEWS
    case "component/accordion":
      return (await import("@/registry/previews-lazy/component/accordion")).PREVIEWS
    case "component/alert":
      return (await import("@/registry/previews-lazy/component/alert")).PREVIEWS
    case "component/avatar":
      return (await import("@/registry/previews-lazy/component/avatar")).PREVIEWS
    case "component/badge":
      return (await import("@/registry/previews-lazy/component/badge")).PREVIEWS
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
    case "component/chart":
      return (await import("@/registry/previews-lazy/component/chart")).PREVIEWS
    case "component/checkbox":
      return (await import("@/registry/previews-lazy/component/checkbox")).PREVIEWS
    case "component/code-block":
      return (await import("@/registry/previews-lazy/component/code-block")).PREVIEWS
    case "component/combobox":
      return (await import("@/registry/previews-lazy/component/combobox")).PREVIEWS
    case "component/command":
      return (await import("@/registry/previews-lazy/component/command")).PREVIEWS
    case "component/dialog":
      return (await import("@/registry/previews-lazy/component/dialog")).PREVIEWS
    case "component/dropdown-menu":
      return (await import("@/registry/previews-lazy/component/dropdown-menu")).PREVIEWS
    case "component/empty":
      return (await import("@/registry/previews-lazy/component/empty")).PREVIEWS
    case "component/loading":
      return (await import("@/registry/previews-lazy/component/loading")).PREVIEWS
    case "component/input":
      return (await import("@/registry/previews-lazy/component/input")).PREVIEWS
    case "component/special-input":
      return (await import("@/registry/previews-lazy/component/special-input")).PREVIEWS
    case "component/mockup":
      return (await import("@/registry/previews-lazy/component/mockup")).PREVIEWS
    case "component/popover":
      return (await import("@/registry/previews-lazy/component/popover")).PREVIEWS
    case "component/select":
      return (await import("@/registry/previews-lazy/component/select")).PREVIEWS
    case "component/slider":
      return (await import("@/registry/previews-lazy/component/slider")).PREVIEWS
    case "component/stepper":
      return (await import("@/registry/previews-lazy/component/stepper")).PREVIEWS
    case "component/table":
      return (await import("@/registry/previews-lazy/component/table")).PREVIEWS
    case "component/tabs":
      return (await import("@/registry/previews-lazy/component/tabs")).PREVIEWS
    case "component/navigation":
      return (await import("@/registry/previews-lazy/component/navigation")).PREVIEWS
    case "component/toast":
      return (await import("@/registry/previews-lazy/component/toast")).PREVIEWS
    case "component/tree":
      return (await import("@/registry/previews-lazy/component/tree")).PREVIEWS
    case "component/typography":
      return (await import("@/registry/previews-lazy/component/typography")).PREVIEWS
    case "animation/stacks":
      return (await import("@/registry/previews-lazy/animation/stacks")).PREVIEWS
    case "animation/cursor":
      return (await import("@/registry/previews-lazy/animation/cursor")).PREVIEWS
    case "animation/sketch":
      return (await import("@/registry/previews-lazy/animation/sketch")).PREVIEWS
    case "animation/background":
      return (await import("@/registry/previews-lazy/animation/background")).PREVIEWS
    case "animation/interface":
      return (await import("@/registry/previews-lazy/animation/interface")).PREVIEWS
    case "animation/promo":
      return (await import("@/registry/previews-lazy/animation/promo")).PREVIEWS
    default:
      return null
  }
}
