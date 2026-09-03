import type { LabCheck } from "@/components/lab/check-types"

import { Resizable001 } from "@/registry/components/resizable/resizable-001/resizable-001"
import { Resizable002 } from "@/registry/components/resizable/resizable-002/resizable-002"
import { Resizable003 } from "@/registry/components/resizable/resizable-003/resizable-003"
import { Resizable004 } from "@/registry/components/resizable/resizable-004/resizable-004"
import { Resizable005 } from "@/registry/components/resizable/resizable-005/resizable-005"
import { Resizable006 } from "@/registry/components/resizable/resizable-006/resizable-006"
import { Resizable007 } from "@/registry/components/resizable/resizable-007/resizable-007"
import { Resizable008 } from "@/registry/components/resizable/resizable-008/resizable-008"
import { Resizable009 } from "@/registry/components/resizable/resizable-009/resizable-009"
import { Resizable010 } from "@/registry/components/resizable/resizable-010/resizable-010"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 84270

export const CHECKS: LabCheck[] = [
  {
    name: "resizable-001",
    title: "Две панели",
    notes: [
      "Ширина левой панели, %: 80",
      "Акцент: #a344bf",
      "Имя разделителя: Что дальше",
    ],
    node: <Resizable001 defaultSize={80} accent="#a344bf" label="Что дальше" />,
  },
  {
    name: "resizable-002",
    title: "Три панели",
    notes: [
      "Левая панель, %: 27",
      "Средняя панель, %: 46",
      "Акцент: #77fb73",
      "Имя разделителя: Черновик",
    ],
    node: (
      <Resizable002
        defaultLeft={27}
        defaultMiddle={46}
        accent="#77fb73"
        label="Черновик"
      />
    ),
  },
  {
    name: "resizable-003",
    title: "Разделение по вертикали",
    notes: [
      "Высота редактора, %: 66",
      "Акцент: #254e64",
      "Имя разделителя: Черновик",
    ],
    node: <Resizable003 defaultSize={66} accent="#254e64" label="Черновик" />,
  },
  {
    name: "resizable-004",
    title: "Боковая панель с пределами",
    notes: [
      "Ширина меню, px: 223",
      "Акцент: #46cc0a",
      "Имя разделителя: Смена",
    ],
    node: <Resizable004 defaultSize={223} accent="#46cc0a" label="Смена" />,
  },
  {
    name: "resizable-005",
    title: "Сворачиваемая панель",
    notes: [
      "Ширина панели, px: 160",
      "Акцент: #369420",
      "Имя разделителя: Смена",
    ],
    node: <Resizable005 defaultSize={160} accent="#369420" label="Смена" />,
  },
  {
    name: "resizable-006",
    title: "Вложенное разделение",
    notes: [
      "Рабочая область, %: 52",
      "Дерево файлов, %: 53",
      "Акцент: #6dcbf1",
    ],
    node: <Resizable006 defaultRow={52} defaultColumn={53} accent="#6dcbf1" />,
  },
  {
    name: "resizable-007",
    title: "Панели по пропорции",
    notes: [
      "Доля левой панели, %: 41",
      "Акцент: #425464",
      "Имя разделителя: Проверка",
    ],
    node: <Resizable007 defaultRatio={41} accent="#425464" label="Проверка" />,
  },
  {
    name: "resizable-008",
    title: "Код и предпросмотр",
    notes: [
      "Ширина кода, %: 28",
      "Акцент: #a43d82",
      "Имя разделителя: Проверка",
    ],
    node: <Resizable008 defaultSize={28} accent="#a43d82" label="Проверка" />,
  },
  {
    name: "resizable-009",
    title: "Колонки почты",
    notes: [
      "Ширина папок, px: 140",
      "Ширина писем, px: 257",
      "Акцент: #e9483c",
      "Имя разделителя: Черновик",
    ],
    node: (
      <Resizable009
        defaultFolders={140}
        defaultList={257}
        accent="#e9483c"
        label="Черновик"
      />
    ),
  },
  {
    name: "resizable-010",
    title: "Вертикальное разделение по доле",
    notes: [
      "Доля списка, %: 65",
      "Акцент: #a7d985",
      "Имя разделителя: Проверка",
    ],
    node: <Resizable010 defaultRatio={65} accent="#a7d985" label="Проверка" />,
  },
]
