import type { LabCheck } from "@/components/lab/check-types"

import { Separator001 } from "@/registry/components/separator/separator-001/separator-001"
import { Separator002 } from "@/registry/components/separator/separator-002/separator-002"
import { Separator003 } from "@/registry/components/separator/separator-003/separator-003"
import { Separator004 } from "@/registry/components/separator/separator-004/separator-004"
import { Separator005 } from "@/registry/components/separator/separator-005/separator-005"
import { Separator006 } from "@/registry/components/separator/separator-006/separator-006"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 84270

export const CHECKS: LabCheck[] = [
  {
    name: "separator-001",
    title: "Разделитель с подписью",
    notes: ["Подпись: Ня", "Направление: horizontal", "Цвет линии: #bf9a43"],
    node: <Separator001 label="Ня" orientation="horizontal" line="#bf9a43" />,
  },
  {
    name: "separator-002",
    title: "Разделитель с пилюлей",
    notes: ["Подпись: Ня", "Положение: center", "Цвет линии: #fb7319"],
    node: <Separator002 label="Ня" align="center" line="#fb7319" />,
  },
  {
    name: "separator-003",
    title: "Вертикальные линии между показателями",
    notes: ["Промежуток: 47", "Высота линии: full"],
    node: <Separator003 gap={47} dividerHeight="full" />,
  },
  {
    name: "separator-004",
    title: "Пунктирный разделитель",
    notes: ["Длина штриха: 4", "Промежуток: 6"],
    node: <Separator004 dash={4} gap={6} />,
  },
  {
    name: "separator-005",
    title: "Разделитель с иконкой",
    notes: ["Знак: Ня", "Тон: accent", "Цвет линии: #8c46cc"],
    node: <Separator005 glyph="Ня" tone="accent" line="#8c46cc" />,
  },
  {
    name: "separator-006",
    title: "Разделитель по шкале отступов",
    notes: ["Ступень отступа: xs", "Втяжка: true"],
    node: <Separator006 space="xs" inset={true} />,
  },
]
