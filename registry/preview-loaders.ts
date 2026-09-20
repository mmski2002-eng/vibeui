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
    case "block/industry":
      return (await import("@/registry/previews/block/industry")).PREVIEWS
    case "block/about":
      return (await import("@/registry/previews/block/about")).PREVIEWS
    case "block/portfolio":
      return (await import("@/registry/previews/block/portfolio")).PREVIEWS
    case "block/events":
      return (await import("@/registry/previews/block/events")).PREVIEWS
    case "block/data-grid":
      return (await import("@/registry/previews/block/data-grid")).PREVIEWS
    case "block/logos":
      return (await import("@/registry/previews/block/logos")).PREVIEWS
    case "block/newsletter":
      return (await import("@/registry/previews/block/newsletter")).PREVIEWS
    case "block/team":
      return (await import("@/registry/previews/block/team")).PREVIEWS
    case "block/background":
      return (await import("@/registry/previews/block/background")).PREVIEWS
    case "block/layout":
      return (await import("@/registry/previews/block/layout")).PREVIEWS
    case "component/accordion":
      return (await import("@/registry/previews/component/accordion")).PREVIEWS
    case "component/alert":
      return (await import("@/registry/previews/component/alert")).PREVIEWS
    case "component/avatar":
      return (await import("@/registry/previews/component/avatar")).PREVIEWS
    case "component/badge":
      return (await import("@/registry/previews/component/badge")).PREVIEWS
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
    case "component/chart":
      return (await import("@/registry/previews/component/chart")).PREVIEWS
    case "component/checkbox":
      return (await import("@/registry/previews/component/checkbox")).PREVIEWS
    case "component/code-block":
      return (await import("@/registry/previews/component/code-block")).PREVIEWS
    case "component/combobox":
      return (await import("@/registry/previews/component/combobox")).PREVIEWS
    case "component/command":
      return (await import("@/registry/previews/component/command")).PREVIEWS
    case "component/dialog":
      return (await import("@/registry/previews/component/dialog")).PREVIEWS
    case "component/dropdown-menu":
      return (await import("@/registry/previews/component/dropdown-menu")).PREVIEWS
    case "component/empty":
      return (await import("@/registry/previews/component/empty")).PREVIEWS
    case "component/loading":
      return (await import("@/registry/previews/component/loading")).PREVIEWS
    case "component/input":
      return (await import("@/registry/previews/component/input")).PREVIEWS
    case "component/special-input":
      return (await import("@/registry/previews/component/special-input")).PREVIEWS
    case "component/mockup":
      return (await import("@/registry/previews/component/mockup")).PREVIEWS
    case "component/popover":
      return (await import("@/registry/previews/component/popover")).PREVIEWS
    case "component/select":
      return (await import("@/registry/previews/component/select")).PREVIEWS
    case "component/slider":
      return (await import("@/registry/previews/component/slider")).PREVIEWS
    case "component/stepper":
      return (await import("@/registry/previews/component/stepper")).PREVIEWS
    case "component/table":
      return (await import("@/registry/previews/component/table")).PREVIEWS
    case "component/tabs":
      return (await import("@/registry/previews/component/tabs")).PREVIEWS
    case "component/navigation":
      return (await import("@/registry/previews/component/navigation")).PREVIEWS
    case "component/toast":
      return (await import("@/registry/previews/component/toast")).PREVIEWS
    case "component/tree":
      return (await import("@/registry/previews/component/tree")).PREVIEWS
    case "animation/stacks":
      return (await import("@/registry/previews/animation/stacks")).PREVIEWS
    case "animation/cursor":
      return (await import("@/registry/previews/animation/cursor")).PREVIEWS
    case "animation/sketch":
      return (await import("@/registry/previews/animation/sketch")).PREVIEWS
    case "animation/background":
      return (await import("@/registry/previews/animation/background")).PREVIEWS
    case "animation/interface":
      return (await import("@/registry/previews/animation/interface")).PREVIEWS
    case "animation/promo":
      return (await import("@/registry/previews/animation/promo")).PREVIEWS
    default:
      return null
  }
}
