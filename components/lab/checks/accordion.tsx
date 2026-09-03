import type { LabCheck } from "@/components/lab/check-types"

import { Accordion001 } from "@/registry/components/accordion/accordion-001/accordion-001"
import { Accordion002 } from "@/registry/components/accordion/accordion-002/accordion-002"
import { Accordion003 } from "@/registry/components/accordion/accordion-003/accordion-003"
import { Accordion004 } from "@/registry/components/accordion/accordion-004/accordion-004"
import { Accordion005 } from "@/registry/components/accordion/accordion-005/accordion-005"
import { Accordion006 } from "@/registry/components/accordion/accordion-006/accordion-006"
import { Accordion007 } from "@/registry/components/accordion/accordion-007/accordion-007"
import { Accordion008 } from "@/registry/components/accordion/accordion-008/accordion-008"
import { Accordion009 } from "@/registry/components/accordion/accordion-009/accordion-009"
import { Accordion010 } from "@/registry/components/accordion/accordion-010/accordion-010"
import { Accordion011 } from "@/registry/components/accordion/accordion-011/accordion-011"
import { Accordion012 } from "@/registry/components/accordion/accordion-012/accordion-012"
import { Accordion013 } from "@/registry/components/accordion/accordion-013/accordion-013"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 84270

export const CHECKS: LabCheck[] = [
  {
    name: "accordion-001",
    title: "Нативный аккордеон",
    notes: [
      "Значок: none",
      "Разделители: dashed",
      "Открыт раздел: 0",
      "Акцент: #bf9a43",
      "Один раздел: true",
    ],
    node: (
      <Accordion001
        marker="none"
        divider="dashed"
        defaultOpen={0}
        accent="#bf9a43"
        exclusive={true}
        group="lab-accordion-001-light"
      />
    ),
    nodeDark: (
      <Accordion001
        marker="none"
        divider="dashed"
        defaultOpen={0}
        accent="#bf9a43"
        exclusive={true}
        group="lab-accordion-001-dark"
      />
    ),
  },
  {
    name: "accordion-002",
    title: "Аккордеон-карточки",
    notes: [
      "Значок: plus",
      "Открытая карточка: ring",
      "Открыт раздел: 2",
      "Акцент: #7319f6",
    ],
    node: (
      <Accordion002
        marker="plus"
        elevation="ring"
        defaultOpen={2}
        accent="#7319f6"
      />
    ),
  },
  {
    name: "accordion-003",
    title: "Аккордеон с подсветкой",
    notes: [
      "Пигмент: #c2254e",
      "Каретка: bar",
      "Акцент: #9ef08c",
      "Один раздел: true",
      "Открыт раздел: 2",
    ],
    node: (
      <Accordion003
        highlight="#c2254e"
        caret="bar"
        accent="#9ef08c"
        exclusive={true}
        defaultOpen={2}
        group="lab-accordion-003-light"
      />
    ),
    nodeDark: (
      <Accordion003
        highlight="#c2254e"
        caret="bar"
        accent="#9ef08c"
        exclusive={true}
        defaultOpen={2}
        group="lab-accordion-003-dark"
      />
    ),
  },
  {
    name: "accordion-004",
    title: "Плотный аккордеон",
    notes: [
      "Значок: chevron",
      "Зебра: true",
      "Открыт раздел: 0",
      "Акцент: #0f3694",
    ],
    node: (
      <Accordion004
        marker="chevron"
        zebra={true}
        defaultOpen={0}
        accent="#0f3694"
      />
    ),
  },
  {
    name: "accordion-005",
    title: "Аккордеон с состояниями",
    notes: [
      "Значок: chevron",
      "Отметка внимания: none",
      "Цвет внимания: #32888e",
      "Открыт раздел: 1",
      "Акцент: #cbf15a",
    ],
    node: (
      <Accordion005
        marker="chevron"
        stripe="none"
        warn="#32888e"
        defaultOpen={1}
        accent="#cbf15a"
      />
    ),
  },
  {
    name: "accordion-006",
    title: "Аккордеон-чеклист",
    notes: [
      "Заголовок: Что дальше",
      "Шапка: count",
      "Открыт шаг: 2",
      "Акцент: #a112a4",
    ],
    node: (
      <Accordion006
        title="Что дальше"
        progress="count"
        defaultOpen={2}
        accent="#a112a4"
      />
    ),
  },
  {
    name: "accordion-007",
    title: "Аккордеон с метками",
    notes: [
      "Значок: triangle",
      "Счётчик: false",
      "Открыт раздел: 2",
      "Акцент: #aa34aa",
    ],
    node: (
      <Accordion007
        marker="triangle"
        badge={false}
        defaultOpen={2}
        accent="#aa34aa"
      />
    ),
  },
  {
    name: "accordion-008",
    title: "Двухуровневый аккордеон",
    notes: [
      "Значок: none",
      "Линия вложенности: line",
      "Открыта глава: 0",
      "Акцент: #58e4c0",
    ],
    node: (
      <Accordion008
        marker="none"
        guide="line"
        defaultOpen={0}
        accent="#58e4c0"
      />
    ),
  },
  {
    name: "accordion-009",
    title: "Аккордеон-лента событий",
    notes: [
      "Точка: ring",
      "Линия: none",
      "Открыта запись: 1",
      "Акцент: #fcb6dc",
    ],
    node: (
      <Accordion009
        marker="ring"
        rail="none"
        defaultOpen={1}
        accent="#fcb6dc"
      />
    ),
  },
  {
    name: "accordion-010",
    title: "Аккордеон в две колонки",
    notes: [
      "Значок: triangle",
      "Нумерация: true",
      "Открыт вопрос: 2",
      "Акцент: #2c624a",
    ],
    node: (
      <Accordion010
        marker="triangle"
        numbered={true}
        defaultOpen={2}
        accent="#2c624a"
      />
    ),
  },
  {
    name: "accordion-011",
    title: "Тёмный аккордеон",
    notes: [
      "Значок: plus",
      "Подсветка: ring",
      "Акцент: #0a90dc",
      "Открыт раздел: 2",
      "Один раздел: true",
    ],
    node: (
      <Accordion011
        marker="plus"
        glow="ring"
        accent="#0a90dc"
        defaultOpen={2}
        exclusive={true}
        group="lab-accordion-011-light"
      />
    ),
    nodeDark: (
      <Accordion011
        marker="plus"
        glow="ring"
        accent="#0a90dc"
        defaultOpen={2}
        exclusive={true}
        group="lab-accordion-011-dark"
      />
    ),
  },
  {
    name: "accordion-012",
    title: "Аккордеон-диафрагма",
    notes: ["Вырез: sunken", "Один раздел: true", "Открыт раздел: 1"],
    node: (
      <Accordion012
        well="sunken"
        exclusive={true}
        defaultOpen={1}
        group="lab-accordion-012-light"
      />
    ),
    nodeDark: (
      <Accordion012
        well="sunken"
        exclusive={true}
        defaultOpen={1}
        group="lab-accordion-012-dark"
      />
    ),
  },
  {
    name: "accordion-013",
    title: "Аккордеон-клавиатура",
    notes: [
      "Ход клавиши: 1",
      "Акцент: #846998",
      "Один раздел: false",
      "Открыт раздел: 2",
    ],
    node: (
      <Accordion013
        travel={1}
        accent="#846998"
        exclusive={false}
        defaultOpen={2}
        group="lab-accordion-013-light"
      />
    ),
    nodeDark: (
      <Accordion013
        travel={1}
        accent="#846998"
        exclusive={false}
        defaultOpen={2}
        group="lab-accordion-013-dark"
      />
    ),
  },
]
