import type { LabCheck } from "@/components/lab/check-types"

import { Stepper001 } from "@/registry/components/stepper/stepper-001/stepper-001"
import { Stepper002 } from "@/registry/components/stepper/stepper-002/stepper-002"
import { Stepper003 } from "@/registry/components/stepper/stepper-003/stepper-003"
import { Stepper004 } from "@/registry/components/stepper/stepper-004/stepper-004"
import { Stepper005 } from "@/registry/components/stepper/stepper-005/stepper-005"
import { Stepper006 } from "@/registry/components/stepper/stepper-006/stepper-006"
import { Stepper007 } from "@/registry/components/stepper/stepper-007/stepper-007"
import { Stepper008 } from "@/registry/components/stepper/stepper-008/stepper-008"
import { Stepper009 } from "@/registry/components/stepper/stepper-009/stepper-009"
import { Stepper010 } from "@/registry/components/stepper/stepper-010/stepper-010"
import { Stepper011 } from "@/registry/components/stepper/stepper-011/stepper-011"
import { Stepper012 } from "@/registry/components/stepper/stepper-012/stepper-012"
import { Stepper013 } from "@/registry/components/stepper/stepper-013/stepper-013"
import { Stepper014 } from "@/registry/components/stepper/stepper-014/stepper-014"
import { Stepper015 } from "@/registry/components/stepper/stepper-015/stepper-015"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 68432

export const CHECKS: LabCheck[] = [
  {
    name: "stepper-001",
    title: "Шаги процесса",
    notes: ["Текущий шаг: 0", "Акцент: #326f13", "Имя для скринридера: Тест"],
    node: <Stepper001 current={0} accent="#326f13" label="Тест" />,
  },
  {
    name: "stepper-002",
    title: "Шаги-шевроны",
    notes: [
      "Текущий шаг: 2",
      "Имя для скринридера: Подпись: тест",
      "Акцент: #de1e7c",
    ],
    node: <Stepper002 current={2} label="Подпись: тест" accent="#de1e7c" />,
  },
  {
    name: "stepper-003",
    title: "Вертикальные шаги",
    notes: [
      "Текущий шаг: 1",
      "Имя для скринридера: Подпись: тест",
      "Акцент: #555f33",
    ],
    node: <Stepper003 current={1} label="Подпись: тест" accent="#555f33" />,
  },
  {
    name: "stepper-004",
    title: "Состояния шагов",
    notes: ["Имя для скринридера: Подпись: тест", "Акцент: #4b8140"],
    node: <Stepper004 label="Подпись: тест" accent="#4b8140" />,
  },
  {
    name: "stepper-005",
    title: "Прогресс на соединителе",
    notes: [
      "Готовность: 60",
      "Текущий шаг: 0",
      "Акцент: #f0e5e6",
      "Имя для скринридера: Проверка",
    ],
    node: (
      <Stepper005 progress={60} current={0} accent="#f0e5e6" label="Проверка" />
    ),
  },
  {
    name: "stepper-006",
    title: "Счётчик на телефоне",
    notes: ["Текущий шаг: 2", "Приставка «далее»: Смена", "Акцент: #4c3c5f"],
    node: <Stepper006 current={2} nextPrefix="Смена" accent="#4c3c5f" />,
  },
  {
    name: "stepper-007",
    title: "Шаги оформления",
    notes: ["Текущий шаг: 2", "Подпись ссылки: Черновик", "Акцент: #21b1fb"],
    node: <Stepper007 current={2} editLabel="Черновик" accent="#21b1fb" />,
  },
  {
    name: "stepper-008",
    title: "Необязательные шаги",
    notes: [
      "Текущий шаг: 1",
      "Метка «необязательно»: Проверка",
      "Акцент: #3d02e4",
    ],
    node: <Stepper008 current={1} optionalLabel="Проверка" accent="#3d02e4" />,
  },
  {
    name: "stepper-009",
    title: "Шаги настройки",
    notes: ["Текущий шаг: 0", "Подпись над кодом: Смена", "Акцент: #c92b82"],
    node: <Stepper009 current={0} codeCaption="Смена" accent="#c92b82" />,
  },
  {
    name: "stepper-010",
    title: "Шаги с подробностями",
    notes: [
      "Текущий шаг: 1",
      "Имя для скринридера: Что дальше",
      "Акцент: #666550",
    ],
    node: <Stepper010 current={1} label="Что дальше" accent="#666550" />,
  },
  {
    name: "stepper-011",
    title: "Возврат после ошибки",
    notes: ["Имя для скринридера: Подпись: тест", "Акцент: #bc8f6b"],
    node: <Stepper011 label="Подпись: тест" accent="#bc8f6b" />,
  },
  {
    name: "stepper-012",
    title: "Итог заказа",
    notes: ["Текущий шаг: 1", "Подпись итога: Проверка", "Акцент: #f1cdc4"],
    node: <Stepper012 current={1} totalLabel="Проверка" accent="#f1cdc4" />,
  },
  {
    name: "stepper-013",
    title: "Счётчик прогресса",
    notes: ["Текущий шаг: 2", "Акцент: #df64aa"],
    node: <Stepper013 current={2} accent="#df64aa" />,
  },
  {
    name: "stepper-014",
    title: "Пропуск шага",
    notes: ["Текущий шаг: 1", "Подпись пропуска: Проверка", "Акцент: #02f302"],
    node: <Stepper014 current={1} skipLabel="Проверка" accent="#02f302" />,
  },
  {
    name: "stepper-015",
    title: "Шаги с проверкой",
    notes: [
      "Текущий шаг: 2",
      "Подпись редактирования: Смена",
      "Акцент: #e144d6",
    ],
    node: <Stepper015 current={2} editLabel="Смена" accent="#e144d6" />,
  },
]
