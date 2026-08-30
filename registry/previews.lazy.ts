// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

/**
 * Ленивая карта превью для конфигуратора. Отличается от `previews.ts` двумя
 * вещами: компоненты грузятся отдельными чанками по требованию и принимают
 * произвольные пропсы.
 *
 * Зачем отдельная карта: статическая нужна серверному рендеру миниатюр и
 * не должна тащить `next/dynamic`, а эта грузится только когда пользователь
 * действительно открыл настройку — витрина остаётся без клиентского JS
 * компонентов (см. docs/CONTROLS.md).
 *
 * Пропсы типизированы как `Record<string, unknown>`: значения приходят из
 * контролов самого item'а, то есть по построению совпадают с его API.
 * Проверить это статически нельзя — карта индексируется по slug.
 */
export type PreviewProps = Record<string, unknown>

export const LAZY_PREVIEWS = {
  "hero-001": dynamic(() =>
    import("@/registry/blocks/hero/hero-001/hero-001").then(
      (module) => module.Hero001,
    ),
  ),
  "hero-002": dynamic(() =>
    import("@/registry/blocks/hero/hero-002/hero-002").then(
      (module) => module.Hero002,
    ),
  ),
  "hero-003": dynamic(() =>
    import("@/registry/blocks/hero/hero-003/hero-003").then(
      (module) => module.Hero003,
    ),
  ),
  "features-001": dynamic(() =>
    import("@/registry/blocks/features/features-001/features-001").then(
      (module) => module.Features001,
    ),
  ),
  "pricing-001": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-001/pricing-001").then(
      (module) => module.Pricing001,
    ),
  ),
  "button-001": dynamic(() =>
    import("@/registry/components/buttons/button-001/button-001").then(
      (module) => module.Button001,
    ),
  ),
  "button-002": dynamic(() =>
    import("@/registry/components/buttons/button-002/button-002").then(
      (module) => module.Button002,
    ),
  ),
  "button-003": dynamic(() =>
    import("@/registry/components/buttons/button-003/button-003").then(
      (module) => module.Button003,
    ),
  ),
  "button-004": dynamic(() =>
    import("@/registry/components/buttons/button-004/button-004").then(
      (module) => module.Button004,
    ),
  ),
  "button-005": dynamic(() =>
    import("@/registry/components/buttons/button-005/button-005").then(
      (module) => module.Button005,
    ),
  ),
  "button-006": dynamic(() =>
    import("@/registry/components/buttons/button-006/button-006").then(
      (module) => module.Button006,
    ),
  ),
  "button-007": dynamic(() =>
    import("@/registry/components/buttons/button-007/button-007").then(
      (module) => module.Button007,
    ),
  ),
  "button-008": dynamic(() =>
    import("@/registry/components/buttons/button-008/button-008").then(
      (module) => module.Button008,
    ),
  ),
  "button-009": dynamic(() =>
    import("@/registry/components/buttons/button-009/button-009").then(
      (module) => module.Button009,
    ),
  ),
  "button-010": dynamic(() =>
    import("@/registry/components/buttons/button-010/button-010").then(
      (module) => module.Button010,
    ),
  ),
  "button-011": dynamic(() =>
    import("@/registry/components/buttons/button-011/button-011").then(
      (module) => module.Button011,
    ),
  ),
  "input-001": dynamic(() =>
    import("@/registry/components/inputs/input-001/input-001").then(
      (module) => module.Input001,
    ),
  ),
  "input-002": dynamic(() =>
    import("@/registry/components/inputs/input-002/input-002").then(
      (module) => module.Input002,
    ),
  ),
  "textarea-001": dynamic(() =>
    import("@/registry/components/inputs/textarea-001/textarea-001").then(
      (module) => module.Textarea001,
    ),
  ),
  "select-001": dynamic(() =>
    import("@/registry/components/inputs/select-001/select-001").then(
      (module) => module.Select001,
    ),
  ),
  "checkbox-001": dynamic(() =>
    import("@/registry/components/inputs/checkbox-001/checkbox-001").then(
      (module) => module.Checkbox001,
    ),
  ),
  "switch-001": dynamic(() =>
    import("@/registry/components/inputs/switch-001/switch-001").then(
      (module) => module.Switch001,
    ),
  ),
  "badge-001": dynamic(() =>
    import("@/registry/components/display/badge-001/badge-001").then(
      (module) => module.Badge001,
    ),
  ),
  "avatar-001": dynamic(() =>
    import("@/registry/components/display/avatar-001/avatar-001").then(
      (module) => module.Avatar001,
    ),
  ),
  "card-001": dynamic(() =>
    import("@/registry/components/display/card-001/card-001").then(
      (module) => module.Card001,
    ),
  ),
  "skeleton-001": dynamic(() =>
    import("@/registry/components/display/skeleton-001/skeleton-001").then(
      (module) => module.Skeleton001,
    ),
  ),
  "progress-001": dynamic(() =>
    import("@/registry/components/display/progress-001/progress-001").then(
      (module) => module.Progress001,
    ),
  ),
  "accordion-001": dynamic(() =>
    import("@/registry/components/display/accordion-001/accordion-001").then(
      (module) => module.Accordion001,
    ),
  ),
} as unknown as Record<string, ComponentType<PreviewProps>>
