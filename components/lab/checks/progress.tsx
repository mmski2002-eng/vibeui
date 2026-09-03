import type { LabCheck } from "@/components/lab/check-types"

import { Progress001 } from "@/registry/components/progress/progress-001/progress-001"
import { Progress002 } from "@/registry/components/progress/progress-002/progress-002"
import { Progress003 } from "@/registry/components/progress/progress-003/progress-003"
import { Progress004 } from "@/registry/components/progress/progress-004/progress-004"
import { Progress005 } from "@/registry/components/progress/progress-005/progress-005"
import { Progress006 } from "@/registry/components/progress/progress-006/progress-006"
import { Progress007 } from "@/registry/components/progress/progress-007/progress-007"
import { Progress008 } from "@/registry/components/progress/progress-008/progress-008"
import { Progress009 } from "@/registry/components/progress/progress-009/progress-009"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 76351

export const CHECKS: LabCheck[] = [
  {
    name: "progress-001",
    title: "Прогресс с подписью",
    notes: [
      "Значение: 92",
      "Подпись: Что дальше",
      "Размер: sm",
      "Акцент: #9278ce",
    ],
    node: (
      <Progress001 value={92} label="Что дальше" size="sm" accent="#9278ce" />
    ),
  },
  {
    name: "progress-002",
    title: "Полоса из сегментов",
    notes: ["Текущий этап: 2", "Заголовок: Проверка", "Акцент: #c1ec05"],
    node: <Progress002 current={2} label="Проверка" accent="#c1ec05" />,
  },
  {
    name: "progress-003",
    title: "Кольцо цели с делениями",
    notes: [
      "Значение: 87",
      "Цель: 75",
      "Заголовок: Подпись: тест",
      "Подпись под числом: Черновик",
      "Акцент: #7b169c",
    ],
    node: (
      <Progress003
        value={87}
        target={75}
        label="Подпись: тест"
        unit="Черновик"
        accent="#7b169c"
      />
    ),
  },
  {
    name: "progress-004",
    title: "Строка скорости загрузки",
    notes: [
      "Имя файла: Что дальше",
      "Скорость, байт/с: 2111795",
      "Акцент: #f9f357",
    ],
    node: (
      <Progress004 fileName="Что дальше" speed={2111795} accent="#f9f357" />
    ),
  },
  {
    name: "progress-005",
    title: "Полосы по категориям",
    notes: ["Ёмкость: 1538", "Единица: 42"],
    node: <Progress005 capacity={1538} unit="42" />,
  },
  {
    name: "progress-006",
    title: "Полоса с порогом",
    notes: [
      "Расход: 73",
      "Порог: 78",
      "Заголовок: Что дальше",
      "Акцент: #0b661e",
    ],
    node: (
      <Progress006
        value={73}
        threshold={78}
        label="Что дальше"
        accent="#0b661e"
      />
    ),
  },
  {
    name: "progress-007",
    title: "Полосатый индикатор задачи",
    notes: [
      "Заголовок: Черновик",
      "Обработано: 640290",
      "Единица: Черновик",
      "Время: Смена",
      "Акцент: #03c4fc",
    ],
    node: (
      <Progress007
        label="Черновик"
        processed={640290}
        unit="Черновик"
        elapsed="Смена"
        accent="#03c4fc"
      />
    ),
  },
  {
    name: "progress-008",
    title: "Прогресс по именованным шагам",
    notes: ["Текущий шаг: 1", "Заголовок: Смена", "Акцент: #7ae94a"],
    node: <Progress008 current={1} title="Смена" accent="#7ae94a" />,
  },
  {
    name: "progress-009",
    title: "Бегущая подпись значения",
    notes: [
      "Значение: 23",
      "Пояснение: Черновик",
      "Заголовок: Черновик",
      "Акцент: #f51ac4",
    ],
    node: (
      <Progress009
        value={23}
        caption="Черновик"
        label="Черновик"
        accent="#f51ac4"
      />
    ),
  },
]
