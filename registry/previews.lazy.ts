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
  "ai-001": dynamic(() =>
    import("@/registry/blocks/ai/ai-001/ai-001").then((module) => module.Ai001),
  ),
  "ai-002": dynamic(() =>
    import("@/registry/blocks/ai/ai-002/ai-002").then((module) => module.Ai002),
  ),
  "ai-003": dynamic(() =>
    import("@/registry/blocks/ai/ai-003/ai-003").then((module) => module.Ai003),
  ),
  "dashboard-001": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-001/dashboard-001").then(
      (module) => module.Dashboard001,
    ),
  ),
  "dashboard-002": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-002/dashboard-002").then(
      (module) => module.Dashboard002,
    ),
  ),
  "dashboard-003": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-003/dashboard-003").then(
      (module) => module.Dashboard003,
    ),
  ),
  "dashboard-004": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-004/dashboard-004").then(
      (module) => module.Dashboard004,
    ),
  ),
  "dashboard-005": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-005/dashboard-005").then(
      (module) => module.Dashboard005,
    ),
  ),
  "dashboard-006": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-006/dashboard-006").then(
      (module) => module.Dashboard006,
    ),
  ),
  "dashboard-007": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-007/dashboard-007").then(
      (module) => module.Dashboard007,
    ),
  ),
  "dashboard-008": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-008/dashboard-008").then(
      (module) => module.Dashboard008,
    ),
  ),
  "dashboard-009": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-009/dashboard-009").then(
      (module) => module.Dashboard009,
    ),
  ),
  "dashboard-010": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-010/dashboard-010").then(
      (module) => module.Dashboard010,
    ),
  ),
  "dashboard-011": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-011/dashboard-011").then(
      (module) => module.Dashboard011,
    ),
  ),
  "dashboard-012": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-012/dashboard-012").then(
      (module) => module.Dashboard012,
    ),
  ),
  "dashboard-013": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-013/dashboard-013").then(
      (module) => module.Dashboard013,
    ),
  ),
  "dashboard-014": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-014/dashboard-014").then(
      (module) => module.Dashboard014,
    ),
  ),
  "commerce-001": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-001/commerce-001").then(
      (module) => module.Commerce001,
    ),
  ),
  "commerce-002": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-002/commerce-002").then(
      (module) => module.Commerce002,
    ),
  ),
  "commerce-003": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-003/commerce-003").then(
      (module) => module.Commerce003,
    ),
  ),
  "commerce-004": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-004/commerce-004").then(
      (module) => module.Commerce004,
    ),
  ),
  "commerce-005": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-005/commerce-005").then(
      (module) => module.Commerce005,
    ),
  ),
  "commerce-006": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-006/commerce-006").then(
      (module) => module.Commerce006,
    ),
  ),
  "auth-001": dynamic(() =>
    import("@/registry/blocks/auth/auth-001/auth-001").then(
      (module) => module.Auth001,
    ),
  ),
  "auth-002": dynamic(() =>
    import("@/registry/blocks/auth/auth-002/auth-002").then(
      (module) => module.Auth002,
    ),
  ),
  "auth-003": dynamic(() =>
    import("@/registry/blocks/auth/auth-003/auth-003").then(
      (module) => module.Auth003,
    ),
  ),
  "auth-004": dynamic(() =>
    import("@/registry/blocks/auth/auth-004/auth-004").then(
      (module) => module.Auth004,
    ),
  ),
  "auth-005": dynamic(() =>
    import("@/registry/blocks/auth/auth-005/auth-005").then(
      (module) => module.Auth005,
    ),
  ),
  "auth-006": dynamic(() =>
    import("@/registry/blocks/auth/auth-006/auth-006").then(
      (module) => module.Auth006,
    ),
  ),
  "solutions-001": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-001/solutions-001").then(
      (module) => module.Solutions001,
    ),
  ),
  "solutions-002": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-002/solutions-002").then(
      (module) => module.Solutions002,
    ),
  ),
  "solutions-003": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-003/solutions-003").then(
      (module) => module.Solutions003,
    ),
  ),
  "solutions-004": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-004/solutions-004").then(
      (module) => module.Solutions004,
    ),
  ),
  "solutions-005": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-005/solutions-005").then(
      (module) => module.Solutions005,
    ),
  ),
  "solutions-006": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-006/solutions-006").then(
      (module) => module.Solutions006,
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
  "button-012": dynamic(() =>
    import("@/registry/components/buttons/button-012/button-012").then(
      (module) => module.Button012,
    ),
  ),
  "button-013": dynamic(() =>
    import("@/registry/components/buttons/button-013/button-013").then(
      (module) => module.Button013,
    ),
  ),
  "button-014": dynamic(() =>
    import("@/registry/components/buttons/button-014/button-014").then(
      (module) => module.Button014,
    ),
  ),
  "button-015": dynamic(() =>
    import("@/registry/components/buttons/button-015/button-015").then(
      (module) => module.Button015,
    ),
  ),
  "button-016": dynamic(() =>
    import("@/registry/components/buttons/button-016/button-016").then(
      (module) => module.Button016,
    ),
  ),
  "button-017": dynamic(() =>
    import("@/registry/components/buttons/button-017/button-017").then(
      (module) => module.Button017,
    ),
  ),
  "button-018": dynamic(() =>
    import("@/registry/components/buttons/button-018/button-018").then(
      (module) => module.Button018,
    ),
  ),
  "button-019": dynamic(() =>
    import("@/registry/components/buttons/button-019/button-019").then(
      (module) => module.Button019,
    ),
  ),
  "button-020": dynamic(() =>
    import("@/registry/components/buttons/button-020/button-020").then(
      (module) => module.Button020,
    ),
  ),
  "button-021": dynamic(() =>
    import("@/registry/components/buttons/button-021/button-021").then(
      (module) => module.Button021,
    ),
  ),
  "button-022": dynamic(() =>
    import("@/registry/components/buttons/button-022/button-022").then(
      (module) => module.Button022,
    ),
  ),
  "button-023": dynamic(() =>
    import("@/registry/components/buttons/button-023/button-023").then(
      (module) => module.Button023,
    ),
  ),
  "button-024": dynamic(() =>
    import("@/registry/components/buttons/button-024/button-024").then(
      (module) => module.Button024,
    ),
  ),
  "button-025": dynamic(() =>
    import("@/registry/components/buttons/button-025/button-025").then(
      (module) => module.Button025,
    ),
  ),
  "button-026": dynamic(() =>
    import("@/registry/components/buttons/button-026/button-026").then(
      (module) => module.Button026,
    ),
  ),
  "button-027": dynamic(() =>
    import("@/registry/components/buttons/button-027/button-027").then(
      (module) => module.Button027,
    ),
  ),
  "button-028": dynamic(() =>
    import("@/registry/components/buttons/button-028/button-028").then(
      (module) => module.Button028,
    ),
  ),
  "button-029": dynamic(() =>
    import("@/registry/components/buttons/button-029/button-029").then(
      (module) => module.Button029,
    ),
  ),
  "button-030": dynamic(() =>
    import("@/registry/components/buttons/button-030/button-030").then(
      (module) => module.Button030,
    ),
  ),
  "button-031": dynamic(() =>
    import("@/registry/components/buttons/button-031/button-031").then(
      (module) => module.Button031,
    ),
  ),
  "button-032": dynamic(() =>
    import("@/registry/components/buttons/button-032/button-032").then(
      (module) => module.Button032,
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
  "alertdialog-001": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-001/alertdialog-001").then(
      (module) => module.Alertdialog001,
    ),
  ),
  "alertdialog-002": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-002/alertdialog-002").then(
      (module) => module.Alertdialog002,
    ),
  ),
  "alertdialog-003": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-003/alertdialog-003").then(
      (module) => module.Alertdialog003,
    ),
  ),
  "alertdialog-004": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-004/alertdialog-004").then(
      (module) => module.Alertdialog004,
    ),
  ),
  "alertdialog-005": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-005/alertdialog-005").then(
      (module) => module.Alertdialog005,
    ),
  ),
  "alertdialog-006": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-006/alertdialog-006").then(
      (module) => module.Alertdialog006,
    ),
  ),
  "alertdialog-007": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-007/alertdialog-007").then(
      (module) => module.Alertdialog007,
    ),
  ),
  "alertdialog-008": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-008/alertdialog-008").then(
      (module) => module.Alertdialog008,
    ),
  ),
  "alertdialog-009": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-009/alertdialog-009").then(
      (module) => module.Alertdialog009,
    ),
  ),
  "alertdialog-010": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-010/alertdialog-010").then(
      (module) => module.Alertdialog010,
    ),
  ),
  "alertdialog-011": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-011/alertdialog-011").then(
      (module) => module.Alertdialog011,
    ),
  ),
  "alertdialog-012": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-012/alertdialog-012").then(
      (module) => module.Alertdialog012,
    ),
  ),
  "alertdialog-013": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-013/alertdialog-013").then(
      (module) => module.Alertdialog013,
    ),
  ),
  "alertdialog-014": dynamic(() =>
    import("@/registry/components/alertdialog/alertdialog-014/alertdialog-014").then(
      (module) => module.Alertdialog014,
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
  "avatar-013": dynamic(() =>
    import("@/registry/components/avatar/avatar-013/avatar-013").then(
      (module) => module.Avatar013,
    ),
  ),
  "avatar-014": dynamic(() =>
    import("@/registry/components/avatar/avatar-014/avatar-014").then(
      (module) => module.Avatar014,
    ),
  ),
  "avatar-015": dynamic(() =>
    import("@/registry/components/avatar/avatar-015/avatar-015").then(
      (module) => module.Avatar015,
    ),
  ),
  "avatar-016": dynamic(() =>
    import("@/registry/components/avatar/avatar-016/avatar-016").then(
      (module) => module.Avatar016,
    ),
  ),
  "avatar-017": dynamic(() =>
    import("@/registry/components/avatar/avatar-017/avatar-017").then(
      (module) => module.Avatar017,
    ),
  ),
  "avatar-018": dynamic(() =>
    import("@/registry/components/avatar/avatar-018/avatar-018").then(
      (module) => module.Avatar018,
    ),
  ),
  "avatar-019": dynamic(() =>
    import("@/registry/components/avatar/avatar-019/avatar-019").then(
      (module) => module.Avatar019,
    ),
  ),
  "avatar-020": dynamic(() =>
    import("@/registry/components/avatar/avatar-020/avatar-020").then(
      (module) => module.Avatar020,
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
  "badge-013": dynamic(() =>
    import("@/registry/components/badge/badge-013/badge-013").then(
      (module) => module.Badge013,
    ),
  ),
  "badge-014": dynamic(() =>
    import("@/registry/components/badge/badge-014/badge-014").then(
      (module) => module.Badge014,
    ),
  ),
  "badge-015": dynamic(() =>
    import("@/registry/components/badge/badge-015/badge-015").then(
      (module) => module.Badge015,
    ),
  ),
  "badge-016": dynamic(() =>
    import("@/registry/components/badge/badge-016/badge-016").then(
      (module) => module.Badge016,
    ),
  ),
  "badge-017": dynamic(() =>
    import("@/registry/components/badge/badge-017/badge-017").then(
      (module) => module.Badge017,
    ),
  ),
  "badge-018": dynamic(() =>
    import("@/registry/components/badge/badge-018/badge-018").then(
      (module) => module.Badge018,
    ),
  ),
  "badge-019": dynamic(() =>
    import("@/registry/components/badge/badge-019/badge-019").then(
      (module) => module.Badge019,
    ),
  ),
  "badge-020": dynamic(() =>
    import("@/registry/components/badge/badge-020/badge-020").then(
      (module) => module.Badge020,
    ),
  ),
  "badge-021": dynamic(() =>
    import("@/registry/components/badge/badge-021/badge-021").then(
      (module) => module.Badge021,
    ),
  ),
  "badge-022": dynamic(() =>
    import("@/registry/components/badge/badge-022/badge-022").then(
      (module) => module.Badge022,
    ),
  ),
  "badge-023": dynamic(() =>
    import("@/registry/components/badge/badge-023/badge-023").then(
      (module) => module.Badge023,
    ),
  ),
  "badge-024": dynamic(() =>
    import("@/registry/components/badge/badge-024/badge-024").then(
      (module) => module.Badge024,
    ),
  ),
  "badge-025": dynamic(() =>
    import("@/registry/components/badge/badge-025/badge-025").then(
      (module) => module.Badge025,
    ),
  ),
  "buttongroup-001": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-001/buttongroup-001").then(
      (module) => module.Buttongroup001,
    ),
  ),
  "buttongroup-002": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-002/buttongroup-002").then(
      (module) => module.Buttongroup002,
    ),
  ),
  "buttongroup-003": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-003/buttongroup-003").then(
      (module) => module.Buttongroup003,
    ),
  ),
  "buttongroup-004": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-004/buttongroup-004").then(
      (module) => module.Buttongroup004,
    ),
  ),
  "buttongroup-005": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-005/buttongroup-005").then(
      (module) => module.Buttongroup005,
    ),
  ),
  "buttongroup-006": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-006/buttongroup-006").then(
      (module) => module.Buttongroup006,
    ),
  ),
  "buttongroup-007": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-007/buttongroup-007").then(
      (module) => module.Buttongroup007,
    ),
  ),
  "buttongroup-008": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-008/buttongroup-008").then(
      (module) => module.Buttongroup008,
    ),
  ),
  "buttongroup-009": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-009/buttongroup-009").then(
      (module) => module.Buttongroup009,
    ),
  ),
  "buttongroup-010": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-010/buttongroup-010").then(
      (module) => module.Buttongroup010,
    ),
  ),
  "buttongroup-011": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-011/buttongroup-011").then(
      (module) => module.Buttongroup011,
    ),
  ),
  "buttongroup-012": dynamic(() =>
    import("@/registry/components/buttongroup/buttongroup-012/buttongroup-012").then(
      (module) => module.Buttongroup012,
    ),
  ),
  "breadcrumb-001": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-001/breadcrumb-001").then(
      (module) => module.Breadcrumb001,
    ),
  ),
  "breadcrumb-002": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-002/breadcrumb-002").then(
      (module) => module.Breadcrumb002,
    ),
  ),
  "breadcrumb-003": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-003/breadcrumb-003").then(
      (module) => module.Breadcrumb003,
    ),
  ),
  "breadcrumb-004": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-004/breadcrumb-004").then(
      (module) => module.Breadcrumb004,
    ),
  ),
  "breadcrumb-005": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-005/breadcrumb-005").then(
      (module) => module.Breadcrumb005,
    ),
  ),
  "breadcrumb-006": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-006/breadcrumb-006").then(
      (module) => module.Breadcrumb006,
    ),
  ),
  "breadcrumb-007": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-007/breadcrumb-007").then(
      (module) => module.Breadcrumb007,
    ),
  ),
  "breadcrumb-008": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-008/breadcrumb-008").then(
      (module) => module.Breadcrumb008,
    ),
  ),
  "breadcrumb-009": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-009/breadcrumb-009").then(
      (module) => module.Breadcrumb009,
    ),
  ),
  "breadcrumb-010": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-010/breadcrumb-010").then(
      (module) => module.Breadcrumb010,
    ),
  ),
  "breadcrumb-011": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-011/breadcrumb-011").then(
      (module) => module.Breadcrumb011,
    ),
  ),
  "breadcrumb-012": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-012/breadcrumb-012").then(
      (module) => module.Breadcrumb012,
    ),
  ),
  "breadcrumb-013": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-013/breadcrumb-013").then(
      (module) => module.Breadcrumb013,
    ),
  ),
  "breadcrumb-014": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-014/breadcrumb-014").then(
      (module) => module.Breadcrumb014,
    ),
  ),
  "breadcrumb-015": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-015/breadcrumb-015").then(
      (module) => module.Breadcrumb015,
    ),
  ),
  "calendar-001": dynamic(() =>
    import("@/registry/components/calendar/calendar-001/calendar-001").then(
      (module) => module.Calendar001,
    ),
  ),
  "calendar-002": dynamic(() =>
    import("@/registry/components/calendar/calendar-002/calendar-002").then(
      (module) => module.Calendar002,
    ),
  ),
  "calendar-003": dynamic(() =>
    import("@/registry/components/calendar/calendar-003/calendar-003").then(
      (module) => module.Calendar003,
    ),
  ),
  "calendar-004": dynamic(() =>
    import("@/registry/components/calendar/calendar-004/calendar-004").then(
      (module) => module.Calendar004,
    ),
  ),
  "calendar-005": dynamic(() =>
    import("@/registry/components/calendar/calendar-005/calendar-005").then(
      (module) => module.Calendar005,
    ),
  ),
  "calendar-006": dynamic(() =>
    import("@/registry/components/calendar/calendar-006/calendar-006").then(
      (module) => module.Calendar006,
    ),
  ),
  "calendar-007": dynamic(() =>
    import("@/registry/components/calendar/calendar-007/calendar-007").then(
      (module) => module.Calendar007,
    ),
  ),
  "calendar-008": dynamic(() =>
    import("@/registry/components/calendar/calendar-008/calendar-008").then(
      (module) => module.Calendar008,
    ),
  ),
  "calendar-009": dynamic(() =>
    import("@/registry/components/calendar/calendar-009/calendar-009").then(
      (module) => module.Calendar009,
    ),
  ),
  "calendar-010": dynamic(() =>
    import("@/registry/components/calendar/calendar-010/calendar-010").then(
      (module) => module.Calendar010,
    ),
  ),
  "calendar-011": dynamic(() =>
    import("@/registry/components/calendar/calendar-011/calendar-011").then(
      (module) => module.Calendar011,
    ),
  ),
  "calendar-012": dynamic(() =>
    import("@/registry/components/calendar/calendar-012/calendar-012").then(
      (module) => module.Calendar012,
    ),
  ),
  "calendar-013": dynamic(() =>
    import("@/registry/components/calendar/calendar-013/calendar-013").then(
      (module) => module.Calendar013,
    ),
  ),
  "calendar-014": dynamic(() =>
    import("@/registry/components/calendar/calendar-014/calendar-014").then(
      (module) => module.Calendar014,
    ),
  ),
  "calendar-015": dynamic(() =>
    import("@/registry/components/calendar/calendar-015/calendar-015").then(
      (module) => module.Calendar015,
    ),
  ),
  "calendar-016": dynamic(() =>
    import("@/registry/components/calendar/calendar-016/calendar-016").then(
      (module) => module.Calendar016,
    ),
  ),
  "calendar-017": dynamic(() =>
    import("@/registry/components/calendar/calendar-017/calendar-017").then(
      (module) => module.Calendar017,
    ),
  ),
  "calendar-018": dynamic(() =>
    import("@/registry/components/calendar/calendar-018/calendar-018").then(
      (module) => module.Calendar018,
    ),
  ),
  "calendar-019": dynamic(() =>
    import("@/registry/components/calendar/calendar-019/calendar-019").then(
      (module) => module.Calendar019,
    ),
  ),
  "calendar-020": dynamic(() =>
    import("@/registry/components/calendar/calendar-020/calendar-020").then(
      (module) => module.Calendar020,
    ),
  ),
  "card-001": dynamic(() =>
    import("@/registry/components/card/card-001/card-001").then(
      (module) => module.Card001,
    ),
  ),
  "card-002": dynamic(() =>
    import("@/registry/components/card/card-002/card-002").then(
      (module) => module.Card002,
    ),
  ),
  "card-003": dynamic(() =>
    import("@/registry/components/card/card-003/card-003").then(
      (module) => module.Card003,
    ),
  ),
  "card-004": dynamic(() =>
    import("@/registry/components/card/card-004/card-004").then(
      (module) => module.Card004,
    ),
  ),
  "card-005": dynamic(() =>
    import("@/registry/components/card/card-005/card-005").then(
      (module) => module.Card005,
    ),
  ),
  "card-006": dynamic(() =>
    import("@/registry/components/card/card-006/card-006").then(
      (module) => module.Card006,
    ),
  ),
  "card-007": dynamic(() =>
    import("@/registry/components/card/card-007/card-007").then(
      (module) => module.Card007,
    ),
  ),
  "card-008": dynamic(() =>
    import("@/registry/components/card/card-008/card-008").then(
      (module) => module.Card008,
    ),
  ),
  "card-009": dynamic(() =>
    import("@/registry/components/card/card-009/card-009").then(
      (module) => module.Card009,
    ),
  ),
  "card-010": dynamic(() =>
    import("@/registry/components/card/card-010/card-010").then(
      (module) => module.Card010,
    ),
  ),
  "card-011": dynamic(() =>
    import("@/registry/components/card/card-011/card-011").then(
      (module) => module.Card011,
    ),
  ),
  "card-012": dynamic(() =>
    import("@/registry/components/card/card-012/card-012").then(
      (module) => module.Card012,
    ),
  ),
  "card-013": dynamic(() =>
    import("@/registry/components/card/card-013/card-013").then(
      (module) => module.Card013,
    ),
  ),
  "card-014": dynamic(() =>
    import("@/registry/components/card/card-014/card-014").then(
      (module) => module.Card014,
    ),
  ),
  "card-015": dynamic(() =>
    import("@/registry/components/card/card-015/card-015").then(
      (module) => module.Card015,
    ),
  ),
  "card-016": dynamic(() =>
    import("@/registry/components/card/card-016/card-016").then(
      (module) => module.Card016,
    ),
  ),
  "card-017": dynamic(() =>
    import("@/registry/components/card/card-017/card-017").then(
      (module) => module.Card017,
    ),
  ),
  "card-018": dynamic(() =>
    import("@/registry/components/card/card-018/card-018").then(
      (module) => module.Card018,
    ),
  ),
  "card-019": dynamic(() =>
    import("@/registry/components/card/card-019/card-019").then(
      (module) => module.Card019,
    ),
  ),
  "card-020": dynamic(() =>
    import("@/registry/components/card/card-020/card-020").then(
      (module) => module.Card020,
    ),
  ),
  "card-021": dynamic(() =>
    import("@/registry/components/card/card-021/card-021").then(
      (module) => module.Card021,
    ),
  ),
  "carousel-001": dynamic(() =>
    import("@/registry/components/carousel/carousel-001/carousel-001").then(
      (module) => module.Carousel001,
    ),
  ),
  "carousel-002": dynamic(() =>
    import("@/registry/components/carousel/carousel-002/carousel-002").then(
      (module) => module.Carousel002,
    ),
  ),
  "carousel-003": dynamic(() =>
    import("@/registry/components/carousel/carousel-003/carousel-003").then(
      (module) => module.Carousel003,
    ),
  ),
  "carousel-004": dynamic(() =>
    import("@/registry/components/carousel/carousel-004/carousel-004").then(
      (module) => module.Carousel004,
    ),
  ),
  "carousel-005": dynamic(() =>
    import("@/registry/components/carousel/carousel-005/carousel-005").then(
      (module) => module.Carousel005,
    ),
  ),
  "carousel-006": dynamic(() =>
    import("@/registry/components/carousel/carousel-006/carousel-006").then(
      (module) => module.Carousel006,
    ),
  ),
  "carousel-007": dynamic(() =>
    import("@/registry/components/carousel/carousel-007/carousel-007").then(
      (module) => module.Carousel007,
    ),
  ),
  "carousel-008": dynamic(() =>
    import("@/registry/components/carousel/carousel-008/carousel-008").then(
      (module) => module.Carousel008,
    ),
  ),
  "checkbox-001": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-001/checkbox-001").then(
      (module) => module.Checkbox001,
    ),
  ),
  "checkbox-002": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-002/checkbox-002").then(
      (module) => module.Checkbox002,
    ),
  ),
  "checkbox-003": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-003/checkbox-003").then(
      (module) => module.Checkbox003,
    ),
  ),
  "checkbox-004": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-004/checkbox-004").then(
      (module) => module.Checkbox004,
    ),
  ),
  "checkbox-005": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-005/checkbox-005").then(
      (module) => module.Checkbox005,
    ),
  ),
  "checkbox-006": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-006/checkbox-006").then(
      (module) => module.Checkbox006,
    ),
  ),
  "checkbox-007": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-007/checkbox-007").then(
      (module) => module.Checkbox007,
    ),
  ),
  "checkbox-008": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-008/checkbox-008").then(
      (module) => module.Checkbox008,
    ),
  ),
  "dropdown-001": dynamic(() =>
    import("@/registry/components/menu/dropdown-001/dropdown-001").then(
      (module) => module.Dropdown001,
    ),
  ),
  "menu-001": dynamic(() =>
    import("@/registry/components/menu/menu-001/menu-001").then(
      (module) => module.Menu001,
    ),
  ),
  "menu-002": dynamic(() =>
    import("@/registry/components/menu/menu-002/menu-002").then(
      (module) => module.Menu002,
    ),
  ),
  "menu-003": dynamic(() =>
    import("@/registry/components/menu/menu-003/menu-003").then(
      (module) => module.Menu003,
    ),
  ),
  "menu-004": dynamic(() =>
    import("@/registry/components/menu/menu-004/menu-004").then(
      (module) => module.Menu004,
    ),
  ),
  "menu-005": dynamic(() =>
    import("@/registry/components/menu/menu-005/menu-005").then(
      (module) => module.Menu005,
    ),
  ),
  "menu-006": dynamic(() =>
    import("@/registry/components/menu/menu-006/menu-006").then(
      (module) => module.Menu006,
    ),
  ),
  "menu-007": dynamic(() =>
    import("@/registry/components/menu/menu-007/menu-007").then(
      (module) => module.Menu007,
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
  "switch-001": dynamic(() =>
    import("@/registry/components/inputs/switch-001/switch-001").then(
      (module) => module.Switch001,
    ),
  ),
  "input-003": dynamic(() =>
    import("@/registry/components/inputs/input-003/input-003").then(
      (module) => module.Input003,
    ),
  ),
  "input-004": dynamic(() =>
    import("@/registry/components/inputs/input-004/input-004").then(
      (module) => module.Input004,
    ),
  ),
  "input-005": dynamic(() =>
    import("@/registry/components/inputs/input-005/input-005").then(
      (module) => module.Input005,
    ),
  ),
  "otp-001": dynamic(() =>
    import("@/registry/components/inputs/otp-001/otp-001").then(
      (module) => module.Otp001,
    ),
  ),
  "file-001": dynamic(() =>
    import("@/registry/components/inputs/file-001/file-001").then(
      (module) => module.File001,
    ),
  ),
  "currency-001": dynamic(() =>
    import("@/registry/components/inputs/currency-001/currency-001").then(
      (module) => module.Currency001,
    ),
  ),
  "textarea-002": dynamic(() =>
    import("@/registry/components/inputs/textarea-002/textarea-002").then(
      (module) => module.Textarea002,
    ),
  ),
  "radio-001": dynamic(() =>
    import("@/registry/components/inputs/radio-001/radio-001").then(
      (module) => module.Radio001,
    ),
  ),
  "slider-001": dynamic(() =>
    import("@/registry/components/inputs/slider-001/slider-001").then(
      (module) => module.Slider001,
    ),
  ),
  "rating-001": dynamic(() =>
    import("@/registry/components/inputs/rating-001/rating-001").then(
      (module) => module.Rating001,
    ),
  ),
  "date-001": dynamic(() =>
    import("@/registry/components/inputs/date-001/date-001").then(
      (module) => module.Date001,
    ),
  ),
  "number-001": dynamic(() =>
    import("@/registry/components/inputs/number-001/number-001").then(
      (module) => module.Number001,
    ),
  ),
  "tags-001": dynamic(() =>
    import("@/registry/components/inputs/tags-001/tags-001").then(
      (module) => module.Tags001,
    ),
  ),
  "field-001": dynamic(() =>
    import("@/registry/components/inputs/field-001/field-001").then(
      (module) => module.Field001,
    ),
  ),
  "range-001": dynamic(() =>
    import("@/registry/components/inputs/range-001/range-001").then(
      (module) => module.Range001,
    ),
  ),
  "cascader-001": dynamic(() =>
    import("@/registry/components/inputs/cascader-001/cascader-001").then(
      (module) => module.Cascader001,
    ),
  ),
  "filters-001": dynamic(() =>
    import("@/registry/components/inputs/filters-001/filters-001").then(
      (module) => module.Filters001,
    ),
  ),
  "cascader-002": dynamic(() =>
    import("@/registry/components/inputs/cascader-002/cascader-002").then(
      (module) => module.Cascader002,
    ),
  ),
  "cascader-003": dynamic(() =>
    import("@/registry/components/inputs/cascader-003/cascader-003").then(
      (module) => module.Cascader003,
    ),
  ),
  "cascader-004": dynamic(() =>
    import("@/registry/components/inputs/cascader-004/cascader-004").then(
      (module) => module.Cascader004,
    ),
  ),
  "cascader-005": dynamic(() =>
    import("@/registry/components/inputs/cascader-005/cascader-005").then(
      (module) => module.Cascader005,
    ),
  ),
  "cascader-006": dynamic(() =>
    import("@/registry/components/inputs/cascader-006/cascader-006").then(
      (module) => module.Cascader006,
    ),
  ),
  "cascader-007": dynamic(() =>
    import("@/registry/components/inputs/cascader-007/cascader-007").then(
      (module) => module.Cascader007,
    ),
  ),
  "cascader-008": dynamic(() =>
    import("@/registry/components/inputs/cascader-008/cascader-008").then(
      (module) => module.Cascader008,
    ),
  ),
  "cascader-009": dynamic(() =>
    import("@/registry/components/inputs/cascader-009/cascader-009").then(
      (module) => module.Cascader009,
    ),
  ),
  "cascader-010": dynamic(() =>
    import("@/registry/components/inputs/cascader-010/cascader-010").then(
      (module) => module.Cascader010,
    ),
  ),
  "cascader-011": dynamic(() =>
    import("@/registry/components/inputs/cascader-011/cascader-011").then(
      (module) => module.Cascader011,
    ),
  ),
  "cascader-012": dynamic(() =>
    import("@/registry/components/inputs/cascader-012/cascader-012").then(
      (module) => module.Cascader012,
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
  "separator-001": dynamic(() =>
    import("@/registry/components/display/separator-001/separator-001").then(
      (module) => module.Separator001,
    ),
  ),
  "kbd-001": dynamic(() =>
    import("@/registry/components/display/kbd-001/kbd-001").then(
      (module) => module.Kbd001,
    ),
  ),
  "code-001": dynamic(() =>
    import("@/registry/components/display/code-001/code-001").then(
      (module) => module.Code001,
    ),
  ),
  "timeline-001": dynamic(() =>
    import("@/registry/components/display/timeline-001/timeline-001").then(
      (module) => module.Timeline001,
    ),
  ),
  "tree-001": dynamic(() =>
    import("@/registry/components/display/tree-001/tree-001").then(
      (module) => module.Tree001,
    ),
  ),
  "scrollarea-001": dynamic(() =>
    import("@/registry/components/display/scrollarea-001/scrollarea-001").then(
      (module) => module.Scrollarea001,
    ),
  ),
  "item-001": dynamic(() =>
    import("@/registry/components/display/item-001/item-001").then(
      (module) => module.Item001,
    ),
  ),
  "spinner-001": dynamic(() =>
    import("@/registry/components/display/spinner-001/spinner-001").then(
      (module) => module.Spinner001,
    ),
  ),
  "frame-001": dynamic(() =>
    import("@/registry/components/display/frame-001/frame-001").then(
      (module) => module.Frame001,
    ),
  ),
  "icontile-001": dynamic(() =>
    import("@/registry/components/display/icontile-001/icontile-001").then(
      (module) => module.Icontile001,
    ),
  ),
  "iconstack-001": dynamic(() =>
    import("@/registry/components/display/iconstack-001/iconstack-001").then(
      (module) => module.Iconstack001,
    ),
  ),
  "sortable-001": dynamic(() =>
    import("@/registry/components/display/sortable-001/sortable-001").then(
      (module) => module.Sortable001,
    ),
  ),
  "kanban-001": dynamic(() =>
    import("@/registry/components/display/kanban-001/kanban-001").then(
      (module) => module.Kanban001,
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
  "toast-002": dynamic(() =>
    import("@/registry/components/feedback/toast-002/toast-002").then(
      (module) => module.Toast002,
    ),
  ),
  "toast-003": dynamic(() =>
    import("@/registry/components/feedback/toast-003/toast-003").then(
      (module) => module.Toast003,
    ),
  ),
  "popover-001": dynamic(() =>
    import("@/registry/components/feedback/popover-001/popover-001").then(
      (module) => module.Popover001,
    ),
  ),
  "drawer-001": dynamic(() =>
    import("@/registry/components/feedback/drawer-001/drawer-001").then(
      (module) => module.Drawer001,
    ),
  ),
  "sheet-001": dynamic(() =>
    import("@/registry/components/feedback/sheet-001/sheet-001").then(
      (module) => module.Sheet001,
    ),
  ),
  "hovercard-001": dynamic(() =>
    import("@/registry/components/feedback/hovercard-001/hovercard-001").then(
      (module) => module.Hovercard001,
    ),
  ),
  "empty-002": dynamic(() =>
    import("@/registry/components/feedback/empty-002/empty-002").then(
      (module) => module.Empty002,
    ),
  ),
  "tabs-001": dynamic(() =>
    import("@/registry/components/navigation/tabs-001/tabs-001").then(
      (module) => module.Tabs001,
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
  "menubar-001": dynamic(() =>
    import("@/registry/components/navigation/menubar-001/menubar-001").then(
      (module) => module.Menubar001,
    ),
  ),
  "command-001": dynamic(() =>
    import("@/registry/components/navigation/command-001/command-001").then(
      (module) => module.Command001,
    ),
  ),
  "tabbar-001": dynamic(() =>
    import("@/registry/components/navigation/tabbar-001/tabbar-001").then(
      (module) => module.Tabbar001,
    ),
  ),
  "scrollspy-001": dynamic(() =>
    import("@/registry/components/navigation/scrollspy-001/scrollspy-001").then(
      (module) => module.Scrollspy001,
    ),
  ),
  "pagination-002": dynamic(() =>
    import("@/registry/components/navigation/pagination-002/pagination-002").then(
      (module) => module.Pagination002,
    ),
  ),
  "contextmenu-001": dynamic(() =>
    import("@/registry/components/navigation/contextmenu-001/contextmenu-001").then(
      (module) => module.Contextmenu001,
    ),
  ),
  "sidebar-002": dynamic(() =>
    import("@/registry/components/navigation/sidebar-002/sidebar-002").then(
      (module) => module.Sidebar002,
    ),
  ),
  "tabs-002": dynamic(() =>
    import("@/registry/components/navigation/tabs-002/tabs-002").then(
      (module) => module.Tabs002,
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
  "table-004": dynamic(() =>
    import("@/registry/components/tables/table-004/table-004").then(
      (module) => module.Table004,
    ),
  ),
  "table-005": dynamic(() =>
    import("@/registry/components/tables/table-005/table-005").then(
      (module) => module.Table005,
    ),
  ),
  "table-006": dynamic(() =>
    import("@/registry/components/tables/table-006/table-006").then(
      (module) => module.Table006,
    ),
  ),
  "table-007": dynamic(() =>
    import("@/registry/components/tables/table-007/table-007").then(
      (module) => module.Table007,
    ),
  ),
  "table-008": dynamic(() =>
    import("@/registry/components/tables/table-008/table-008").then(
      (module) => module.Table008,
    ),
  ),
  "table-009": dynamic(() =>
    import("@/registry/components/tables/table-009/table-009").then(
      (module) => module.Table009,
    ),
  ),
  "table-010": dynamic(() =>
    import("@/registry/components/tables/table-010/table-010").then(
      (module) => module.Table010,
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
  "chart-003": dynamic(() =>
    import("@/registry/components/charts/chart-003/chart-003").then(
      (module) => module.Chart003,
    ),
  ),
  "chart-004": dynamic(() =>
    import("@/registry/components/charts/chart-004/chart-004").then(
      (module) => module.Chart004,
    ),
  ),
  "chart-005": dynamic(() =>
    import("@/registry/components/charts/chart-005/chart-005").then(
      (module) => module.Chart005,
    ),
  ),
  "chart-006": dynamic(() =>
    import("@/registry/components/charts/chart-006/chart-006").then(
      (module) => module.Chart006,
    ),
  ),
  "chart-007": dynamic(() =>
    import("@/registry/components/charts/chart-007/chart-007").then(
      (module) => module.Chart007,
    ),
  ),
  "chart-008": dynamic(() =>
    import("@/registry/components/charts/chart-008/chart-008").then(
      (module) => module.Chart008,
    ),
  ),
  "chart-009": dynamic(() =>
    import("@/registry/components/charts/chart-009/chart-009").then(
      (module) => module.Chart009,
    ),
  ),
  "gantt-001": dynamic(() =>
    import("@/registry/components/charts/gantt-001/gantt-001").then(
      (module) => module.Gantt001,
    ),
  ),
  "chart-010": dynamic(() =>
    import("@/registry/components/charts/chart-010/chart-010").then(
      (module) => module.Chart010,
    ),
  ),
  "chart-011": dynamic(() =>
    import("@/registry/components/charts/chart-011/chart-011").then(
      (module) => module.Chart011,
    ),
  ),
  "chart-012": dynamic(() =>
    import("@/registry/components/charts/chart-012/chart-012").then(
      (module) => module.Chart012,
    ),
  ),
  "chart-013": dynamic(() =>
    import("@/registry/components/charts/chart-013/chart-013").then(
      (module) => module.Chart013,
    ),
  ),
  "chart-014": dynamic(() =>
    import("@/registry/components/charts/chart-014/chart-014").then(
      (module) => module.Chart014,
    ),
  ),
  "chart-015": dynamic(() =>
    import("@/registry/components/charts/chart-015/chart-015").then(
      (module) => module.Chart015,
    ),
  ),
  "chart-016": dynamic(() =>
    import("@/registry/components/charts/chart-016/chart-016").then(
      (module) => module.Chart016,
    ),
  ),
  "chart-017": dynamic(() =>
    import("@/registry/components/charts/chart-017/chart-017").then(
      (module) => module.Chart017,
    ),
  ),
  "chart-018": dynamic(() =>
    import("@/registry/components/charts/chart-018/chart-018").then(
      (module) => module.Chart018,
    ),
  ),
  "chart-019": dynamic(() =>
    import("@/registry/components/charts/chart-019/chart-019").then(
      (module) => module.Chart019,
    ),
  ),
  "chart-020": dynamic(() =>
    import("@/registry/components/charts/chart-020/chart-020").then(
      (module) => module.Chart020,
    ),
  ),
  "chart-021": dynamic(() =>
    import("@/registry/components/charts/chart-021/chart-021").then(
      (module) => module.Chart021,
    ),
  ),
  "chart-022": dynamic(() =>
    import("@/registry/components/charts/chart-022/chart-022").then(
      (module) => module.Chart022,
    ),
  ),
  "sparkline-002": dynamic(() =>
    import("@/registry/components/charts/sparkline-002/sparkline-002").then(
      (module) => module.Sparkline002,
    ),
  ),
} as unknown as Record<string, ComponentType<PreviewProps>>
