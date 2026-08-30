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
  "navbar-001": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-001/navbar-001").then(
      (module) => module.Navbar001,
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
  "testimonials-001": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-001/testimonials-001").then(
      (module) => module.Testimonials001,
    ),
  ),
  "faq-001": dynamic(() =>
    import("@/registry/blocks/faq/faq-001/faq-001").then(
      (module) => module.Faq001,
    ),
  ),
  "cta-001": dynamic(() =>
    import("@/registry/blocks/cta/cta-001/cta-001").then(
      (module) => module.Cta001,
    ),
  ),
  "footer-001": dynamic(() =>
    import("@/registry/blocks/footer/footer-001/footer-001").then(
      (module) => module.Footer001,
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
  "accordion-001": dynamic(() =>
    import("@/registry/components/accordion/accordion-001/accordion-001").then(
      (module) => module.Accordion001,
    ),
  ),
  "accordion-002": dynamic(() =>
    import("@/registry/components/accordion/accordion-002/accordion-002").then(
      (module) => module.Accordion002,
    ),
  ),
  "accordion-003": dynamic(() =>
    import("@/registry/components/accordion/accordion-003/accordion-003").then(
      (module) => module.Accordion003,
    ),
  ),
  "accordion-004": dynamic(() =>
    import("@/registry/components/accordion/accordion-004/accordion-004").then(
      (module) => module.Accordion004,
    ),
  ),
  "accordion-005": dynamic(() =>
    import("@/registry/components/accordion/accordion-005/accordion-005").then(
      (module) => module.Accordion005,
    ),
  ),
  "accordion-006": dynamic(() =>
    import("@/registry/components/accordion/accordion-006/accordion-006").then(
      (module) => module.Accordion006,
    ),
  ),
  "accordion-007": dynamic(() =>
    import("@/registry/components/accordion/accordion-007/accordion-007").then(
      (module) => module.Accordion007,
    ),
  ),
  "accordion-008": dynamic(() =>
    import("@/registry/components/accordion/accordion-008/accordion-008").then(
      (module) => module.Accordion008,
    ),
  ),
  "accordion-009": dynamic(() =>
    import("@/registry/components/accordion/accordion-009/accordion-009").then(
      (module) => module.Accordion009,
    ),
  ),
  "accordion-010": dynamic(() =>
    import("@/registry/components/accordion/accordion-010/accordion-010").then(
      (module) => module.Accordion010,
    ),
  ),
  "accordion-011": dynamic(() =>
    import("@/registry/components/accordion/accordion-011/accordion-011").then(
      (module) => module.Accordion011,
    ),
  ),
  "alert-001": dynamic(() =>
    import("@/registry/components/alert/alert-001/alert-001").then(
      (module) => module.Alert001,
    ),
  ),
  "alert-002": dynamic(() =>
    import("@/registry/components/alert/alert-002/alert-002").then(
      (module) => module.Alert002,
    ),
  ),
  "alert-003": dynamic(() =>
    import("@/registry/components/alert/alert-003/alert-003").then(
      (module) => module.Alert003,
    ),
  ),
  "alert-004": dynamic(() =>
    import("@/registry/components/alert/alert-004/alert-004").then(
      (module) => module.Alert004,
    ),
  ),
  "alert-005": dynamic(() =>
    import("@/registry/components/alert/alert-005/alert-005").then(
      (module) => module.Alert005,
    ),
  ),
  "alert-006": dynamic(() =>
    import("@/registry/components/alert/alert-006/alert-006").then(
      (module) => module.Alert006,
    ),
  ),
  "alert-007": dynamic(() =>
    import("@/registry/components/alert/alert-007/alert-007").then(
      (module) => module.Alert007,
    ),
  ),
  "alert-008": dynamic(() =>
    import("@/registry/components/alert/alert-008/alert-008").then(
      (module) => module.Alert008,
    ),
  ),
  "alert-009": dynamic(() =>
    import("@/registry/components/alert/alert-009/alert-009").then(
      (module) => module.Alert009,
    ),
  ),
  "alert-010": dynamic(() =>
    import("@/registry/components/alert/alert-010/alert-010").then(
      (module) => module.Alert010,
    ),
  ),
  "alert-011": dynamic(() =>
    import("@/registry/components/alert/alert-011/alert-011").then(
      (module) => module.Alert011,
    ),
  ),
  "alert-012": dynamic(() =>
    import("@/registry/components/alert/alert-012/alert-012").then(
      (module) => module.Alert012,
    ),
  ),
  "alert-013": dynamic(() =>
    import("@/registry/components/alert/alert-013/alert-013").then(
      (module) => module.Alert013,
    ),
  ),
  "alert-014": dynamic(() =>
    import("@/registry/components/alert/alert-014/alert-014").then(
      (module) => module.Alert014,
    ),
  ),
  "alert-015": dynamic(() =>
    import("@/registry/components/alert/alert-015/alert-015").then(
      (module) => module.Alert015,
    ),
  ),
  "alert-016": dynamic(() =>
    import("@/registry/components/alert/alert-016/alert-016").then(
      (module) => module.Alert016,
    ),
  ),
  "alert-017": dynamic(() =>
    import("@/registry/components/alert/alert-017/alert-017").then(
      (module) => module.Alert017,
    ),
  ),
  "alert-018": dynamic(() =>
    import("@/registry/components/alert/alert-018/alert-018").then(
      (module) => module.Alert018,
    ),
  ),
  "alert-019": dynamic(() =>
    import("@/registry/components/alert/alert-019/alert-019").then(
      (module) => module.Alert019,
    ),
  ),
  "alert-020": dynamic(() =>
    import("@/registry/components/alert/alert-020/alert-020").then(
      (module) => module.Alert020,
    ),
  ),
  "dialog-001": dynamic(() =>
    import("@/registry/components/dialog/dialog-001/dialog-001").then(
      (module) => module.Dialog001,
    ),
  ),
  "dialog-002": dynamic(() =>
    import("@/registry/components/dialog/dialog-002/dialog-002").then(
      (module) => module.Dialog002,
    ),
  ),
  "dialog-003": dynamic(() =>
    import("@/registry/components/dialog/dialog-003/dialog-003").then(
      (module) => module.Dialog003,
    ),
  ),
  "dialog-004": dynamic(() =>
    import("@/registry/components/dialog/dialog-004/dialog-004").then(
      (module) => module.Dialog004,
    ),
  ),
  "dialog-005": dynamic(() =>
    import("@/registry/components/dialog/dialog-005/dialog-005").then(
      (module) => module.Dialog005,
    ),
  ),
  "dialog-006": dynamic(() =>
    import("@/registry/components/dialog/dialog-006/dialog-006").then(
      (module) => module.Dialog006,
    ),
  ),
  "dialog-007": dynamic(() =>
    import("@/registry/components/dialog/dialog-007/dialog-007").then(
      (module) => module.Dialog007,
    ),
  ),
  "dialog-008": dynamic(() =>
    import("@/registry/components/dialog/dialog-008/dialog-008").then(
      (module) => module.Dialog008,
    ),
  ),
  "dialog-009": dynamic(() =>
    import("@/registry/components/dialog/dialog-009/dialog-009").then(
      (module) => module.Dialog009,
    ),
  ),
  "dialog-010": dynamic(() =>
    import("@/registry/components/dialog/dialog-010/dialog-010").then(
      (module) => module.Dialog010,
    ),
  ),
  "dialog-011": dynamic(() =>
    import("@/registry/components/dialog/dialog-011/dialog-011").then(
      (module) => module.Dialog011,
    ),
  ),
  "dialog-012": dynamic(() =>
    import("@/registry/components/dialog/dialog-012/dialog-012").then(
      (module) => module.Dialog012,
    ),
  ),
  "dialog-013": dynamic(() =>
    import("@/registry/components/dialog/dialog-013/dialog-013").then(
      (module) => module.Dialog013,
    ),
  ),
  "dialog-014": dynamic(() =>
    import("@/registry/components/dialog/dialog-014/dialog-014").then(
      (module) => module.Dialog014,
    ),
  ),
  "aspect-001": dynamic(() =>
    import("@/registry/components/aspect/aspect-001/aspect-001").then(
      (module) => module.Aspect001,
    ),
  ),
  "aspect-002": dynamic(() =>
    import("@/registry/components/aspect/aspect-002/aspect-002").then(
      (module) => module.Aspect002,
    ),
  ),
  "aspect-003": dynamic(() =>
    import("@/registry/components/aspect/aspect-003/aspect-003").then(
      (module) => module.Aspect003,
    ),
  ),
  "aspect-004": dynamic(() =>
    import("@/registry/components/aspect/aspect-004/aspect-004").then(
      (module) => module.Aspect004,
    ),
  ),
  "aspect-005": dynamic(() =>
    import("@/registry/components/aspect/aspect-005/aspect-005").then(
      (module) => module.Aspect005,
    ),
  ),
  "aspect-006": dynamic(() =>
    import("@/registry/components/aspect/aspect-006/aspect-006").then(
      (module) => module.Aspect006,
    ),
  ),
  "aspect-007": dynamic(() =>
    import("@/registry/components/aspect/aspect-007/aspect-007").then(
      (module) => module.Aspect007,
    ),
  ),
  "aspect-008": dynamic(() =>
    import("@/registry/components/aspect/aspect-008/aspect-008").then(
      (module) => module.Aspect008,
    ),
  ),
  "autocomplete-001": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-001/autocomplete-001").then(
      (module) => module.Autocomplete001,
    ),
  ),
  "autocomplete-002": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-002/autocomplete-002").then(
      (module) => module.Autocomplete002,
    ),
  ),
  "autocomplete-003": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-003/autocomplete-003").then(
      (module) => module.Autocomplete003,
    ),
  ),
  "autocomplete-004": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-004/autocomplete-004").then(
      (module) => module.Autocomplete004,
    ),
  ),
  "autocomplete-005": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-005/autocomplete-005").then(
      (module) => module.Autocomplete005,
    ),
  ),
  "autocomplete-006": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-006/autocomplete-006").then(
      (module) => module.Autocomplete006,
    ),
  ),
  "autocomplete-007": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-007/autocomplete-007").then(
      (module) => module.Autocomplete007,
    ),
  ),
  "autocomplete-008": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-008/autocomplete-008").then(
      (module) => module.Autocomplete008,
    ),
  ),
  "autocomplete-009": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-009/autocomplete-009").then(
      (module) => module.Autocomplete009,
    ),
  ),
  "autocomplete-010": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-010/autocomplete-010").then(
      (module) => module.Autocomplete010,
    ),
  ),
  "autocomplete-011": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-011/autocomplete-011").then(
      (module) => module.Autocomplete011,
    ),
  ),
  "autocomplete-012": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-012/autocomplete-012").then(
      (module) => module.Autocomplete012,
    ),
  ),
  "avatar-001": dynamic(() =>
    import("@/registry/components/avatar/avatar-001/avatar-001").then(
      (module) => module.Avatar001,
    ),
  ),
  "avatar-002": dynamic(() =>
    import("@/registry/components/avatar/avatar-002/avatar-002").then(
      (module) => module.Avatar002,
    ),
  ),
  "avatar-003": dynamic(() =>
    import("@/registry/components/avatar/avatar-003/avatar-003").then(
      (module) => module.Avatar003,
    ),
  ),
  "avatar-004": dynamic(() =>
    import("@/registry/components/avatar/avatar-004/avatar-004").then(
      (module) => module.Avatar004,
    ),
  ),
  "avatar-005": dynamic(() =>
    import("@/registry/components/avatar/avatar-005/avatar-005").then(
      (module) => module.Avatar005,
    ),
  ),
  "avatar-006": dynamic(() =>
    import("@/registry/components/avatar/avatar-006/avatar-006").then(
      (module) => module.Avatar006,
    ),
  ),
  "avatar-007": dynamic(() =>
    import("@/registry/components/avatar/avatar-007/avatar-007").then(
      (module) => module.Avatar007,
    ),
  ),
  "avatar-008": dynamic(() =>
    import("@/registry/components/avatar/avatar-008/avatar-008").then(
      (module) => module.Avatar008,
    ),
  ),
  "avatar-009": dynamic(() =>
    import("@/registry/components/avatar/avatar-009/avatar-009").then(
      (module) => module.Avatar009,
    ),
  ),
  "avatar-010": dynamic(() =>
    import("@/registry/components/avatar/avatar-010/avatar-010").then(
      (module) => module.Avatar010,
    ),
  ),
  "avatar-011": dynamic(() =>
    import("@/registry/components/avatar/avatar-011/avatar-011").then(
      (module) => module.Avatar011,
    ),
  ),
  "avatar-012": dynamic(() =>
    import("@/registry/components/avatar/avatar-012/avatar-012").then(
      (module) => module.Avatar012,
    ),
  ),
  "badge-001": dynamic(() =>
    import("@/registry/components/badge/badge-001/badge-001").then(
      (module) => module.Badge001,
    ),
  ),
  "badge-002": dynamic(() =>
    import("@/registry/components/badge/badge-002/badge-002").then(
      (module) => module.Badge002,
    ),
  ),
  "badge-003": dynamic(() =>
    import("@/registry/components/badge/badge-003/badge-003").then(
      (module) => module.Badge003,
    ),
  ),
  "badge-004": dynamic(() =>
    import("@/registry/components/badge/badge-004/badge-004").then(
      (module) => module.Badge004,
    ),
  ),
  "badge-005": dynamic(() =>
    import("@/registry/components/badge/badge-005/badge-005").then(
      (module) => module.Badge005,
    ),
  ),
  "badge-006": dynamic(() =>
    import("@/registry/components/badge/badge-006/badge-006").then(
      (module) => module.Badge006,
    ),
  ),
  "badge-007": dynamic(() =>
    import("@/registry/components/badge/badge-007/badge-007").then(
      (module) => module.Badge007,
    ),
  ),
  "badge-008": dynamic(() =>
    import("@/registry/components/badge/badge-008/badge-008").then(
      (module) => module.Badge008,
    ),
  ),
  "badge-009": dynamic(() =>
    import("@/registry/components/badge/badge-009/badge-009").then(
      (module) => module.Badge009,
    ),
  ),
  "badge-010": dynamic(() =>
    import("@/registry/components/badge/badge-010/badge-010").then(
      (module) => module.Badge010,
    ),
  ),
  "badge-011": dynamic(() =>
    import("@/registry/components/badge/badge-011/badge-011").then(
      (module) => module.Badge011,
    ),
  ),
  "badge-012": dynamic(() =>
    import("@/registry/components/badge/badge-012/badge-012").then(
      (module) => module.Badge012,
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
  "toast-001": dynamic(() =>
    import("@/registry/components/feedback/toast-001/toast-001").then(
      (module) => module.Toast001,
    ),
  ),
  "empty-001": dynamic(() =>
    import("@/registry/components/feedback/empty-001/empty-001").then(
      (module) => module.Empty001,
    ),
  ),
  "tooltip-001": dynamic(() =>
    import("@/registry/components/feedback/tooltip-001/tooltip-001").then(
      (module) => module.Tooltip001,
    ),
  ),
  "banner-001": dynamic(() =>
    import("@/registry/components/feedback/banner-001/banner-001").then(
      (module) => module.Banner001,
    ),
  ),
  "tabs-001": dynamic(() =>
    import("@/registry/components/navigation/tabs-001/tabs-001").then(
      (module) => module.Tabs001,
    ),
  ),
  "breadcrumb-001": dynamic(() =>
    import("@/registry/components/navigation/breadcrumb-001/breadcrumb-001").then(
      (module) => module.Breadcrumb001,
    ),
  ),
  "dropdown-001": dynamic(() =>
    import("@/registry/components/navigation/dropdown-001/dropdown-001").then(
      (module) => module.Dropdown001,
    ),
  ),
  "stepper-001": dynamic(() =>
    import("@/registry/components/navigation/stepper-001/stepper-001").then(
      (module) => module.Stepper001,
    ),
  ),
  "pagination-001": dynamic(() =>
    import("@/registry/components/navigation/pagination-001/pagination-001").then(
      (module) => module.Pagination001,
    ),
  ),
  "sidebar-001": dynamic(() =>
    import("@/registry/components/navigation/sidebar-001/sidebar-001").then(
      (module) => module.Sidebar001,
    ),
  ),
  "table-001": dynamic(() =>
    import("@/registry/components/tables/table-001/table-001").then(
      (module) => module.Table001,
    ),
  ),
  "table-002": dynamic(() =>
    import("@/registry/components/tables/table-002/table-002").then(
      (module) => module.Table002,
    ),
  ),
  "table-003": dynamic(() =>
    import("@/registry/components/tables/table-003/table-003").then(
      (module) => module.Table003,
    ),
  ),
  "chart-001": dynamic(() =>
    import("@/registry/components/charts/chart-001/chart-001").then(
      (module) => module.Chart001,
    ),
  ),
  "chart-002": dynamic(() =>
    import("@/registry/components/charts/chart-002/chart-002").then(
      (module) => module.Chart002,
    ),
  ),
  "sparkline-001": dynamic(() =>
    import("@/registry/components/charts/sparkline-001/sparkline-001").then(
      (module) => module.Sparkline001,
    ),
  ),
} as unknown as Record<string, ComponentType<PreviewProps>>
