import type { LabCheck } from "@/components/lab/check-types"

import { Iconstack001 } from "@/registry/components/icon-stack/iconstack-001/iconstack-001"
import { Iconstack002 } from "@/registry/components/icon-stack/iconstack-002/iconstack-002"
import { Iconstack003 } from "@/registry/components/icon-stack/iconstack-003/iconstack-003"
import { Iconstack004 } from "@/registry/components/icon-stack/iconstack-004/iconstack-004"
import { Iconstack005 } from "@/registry/components/icon-stack/iconstack-005/iconstack-005"
import { Iconstack006 } from "@/registry/components/icon-stack/iconstack-006/iconstack-006"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 92189

export const CHECKS: LabCheck[] = [
  {
    name: "iconstack-001",
    title: "Стопка аватаров",
    notes: ["Показывать: 2", "Размер: sm", "Подпись: Смена"],
    node: <Iconstack001 max={2} size="sm" label="Смена" />,
  },
  {
    name: "iconstack-002",
    title: "Строка технологий",
    notes: ["Подпись: Черновик", "Перекрытие: 2"],
    node: <Iconstack002 caption="Черновик" overlap={2} />,
  },
  {
    name: "iconstack-003",
    title: "Раскрывающийся счётчик стопки",
    notes: ["Видимых кружков: 1", "Подпись группы: Что дальше"],
    node: <Iconstack003 max={1} label="Что дальше" />,
  },
  {
    name: "iconstack-004",
    title: "Вертикальная стопка аватаров",
    notes: ["Размер: sm", "Подпись: Черновик"],
    node: <Iconstack004 size="sm" label="Черновик" />,
  },
  {
    name: "iconstack-005",
    title: "Стопка с кольцом подложки",
    notes: [
      "Цвет обводки: #80ac26",
      "Подпись: Смена",
      "Подпись светлой полосы: Черновик",
    ],
    node: <Iconstack005 ring="#80ac26" label="Смена" lightLabel="Черновик" />,
  },
  {
    name: "iconstack-006",
    title: "Стопка интеграций",
    notes: ["Заголовок: Смена", "Показывать: 5"],
    node: <Iconstack006 title="Смена" max={5} />,
  },
]
