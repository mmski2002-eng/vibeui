import type { LabCheck } from "@/components/lab/check-types"

import { Otp001 } from "@/registry/components/input-otp/otp-001/otp-001"
import { Otp002 } from "@/registry/components/input-otp/otp-002/otp-002"
import { Otp003 } from "@/registry/components/input-otp/otp-003/otp-003"
import { Otp004 } from "@/registry/components/input-otp/otp-004/otp-004"
import { Otp005 } from "@/registry/components/input-otp/otp-005/otp-005"
import { Otp006 } from "@/registry/components/input-otp/otp-006/otp-006"
import { Otp007 } from "@/registry/components/input-otp/otp-007/otp-007"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 84270

export const CHECKS: LabCheck[] = [
  {
    name: "otp-001",
    title: "Поле одноразового кода",
    notes: [
      "Цифр: 8",
      "Подпись: Что дальше",
      "Подсказка: Проверка",
      "Акцент: #435eae",
    ],
    node: (
      <Otp001 length={8} label="Что дальше" hint="Проверка" accent="#435eae" />
    ),
  },
  {
    name: "otp-002",
    title: "Одна каретка",
    notes: ["Подпись: Черновик", "Цифр: 6", "Акцент: #19f6c2"],
    node: <Otp002 label="Черновик" length={6} accent="#19f6c2" />,
  },
  {
    name: "otp-003",
    title: "Таймер повтора",
    notes: [
      "Подпись: Что дальше",
      "Секунд до повтора: 123",
      "Цифр: 7",
      "Акцент: #f08c46",
    ],
    node: (
      <Otp003 label="Что дальше" seconds={123} length={7} accent="#f08c46" />
    ),
  },
  {
    name: "otp-004",
    title: "Встряска при ошибке",
    notes: [
      "Подпись: Смена",
      "Верный код: Смена",
      "Попыток: 1",
      "Акцент: #369420",
    ],
    node: (
      <Otp004 label="Смена" expected="Смена" attempts={1} accent="#369420" />
    ),
  },
  {
    name: "otp-005",
    title: "Код по группам",
    notes: ["Подпись: Смена", "Подсказка: Подпись: тест", "Акцент: #6dcbf1"],
    node: <Otp005 label="Смена" hint="Подпись: тест" accent="#6dcbf1" />,
  },
  {
    name: "otp-006",
    title: "Скрытая строка",
    notes: ["Подпись: Что дальше", "Цифр: 6", "Акцент: #64cea1"],
    node: <Otp006 label="Что дальше" length={6} accent="#64cea1" />,
  },
  {
    name: "otp-007",
    title: "Автоотправка",
    notes: ["Подпись: Проверка", "Цифр: 5", "Акцент: #82f3aa"],
    node: <Otp007 label="Проверка" length={5} accent="#82f3aa" />,
  },
]
