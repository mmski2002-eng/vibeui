import type { LabCheck } from "@/components/lab/check-types"

import { Otp001 } from "@/registry/components/input-otp/otp-001/otp-001"
import { Otp002 } from "@/registry/components/input-otp/otp-002/otp-002"
import { Otp003 } from "@/registry/components/input-otp/otp-003/otp-003"
import { Otp004 } from "@/registry/components/input-otp/otp-004/otp-004"
import { Otp005 } from "@/registry/components/input-otp/otp-005/otp-005"
import { Otp006 } from "@/registry/components/input-otp/otp-006/otp-006"
import { Otp007 } from "@/registry/components/input-otp/otp-007/otp-007"
import { Otp008 } from "@/registry/components/input-otp/otp-008/otp-008"
import { Otp009 } from "@/registry/components/input-otp/otp-009/otp-009"
import { Otp010 } from "@/registry/components/input-otp/otp-010/otp-010"
import { Otp011 } from "@/registry/components/input-otp/otp-011/otp-011"

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
  {
    name: "otp-008",
    title: "Проверка кода",
    notes: [
      "Заголовок: Вход в кабинет",
      "Длина кода: 4",
      "Задержка ответа: 600",
      "Акцент: #f4a261",
    ],
    node: (
      <Otp008
        title="Вход в кабинет"
        length={4}
        correctCode="4829"
        checkDelay={600}
        accent="#f4a261"
      />
    ),
  },
  {
    name: "otp-009",
    title: "Буквенно-цифровой код",
    notes: [
      "Заголовок: Ключ доступа",
      "Знаков в группе: 3",
      "Число групп: 3",
      "Акцент: #6d597a",
    ],
    node: (
      <Otp009
        title="Ключ доступа"
        groupSize={3}
        groups={3}
        accent="#6d597a"
      />
    ),
  },
  {
    name: "otp-010",
    title: "Срок действия кода",
    notes: [
      "Заголовок: Код из СМС",
      "Срок, секунд: 40",
      "Подпись кнопки: Ещё раз",
      "Акцент: #457b9d",
    ],
    node: (
      <Otp010
        title="Код из СМС"
        seconds={40}
        renewLabel="Ещё раз"
        accent="#457b9d"
      />
    ),
  },
  {
    name: "otp-011",
    title: "Маска после ввода",
    notes: [
      "Подпись: Что дальше",
      "Цифр: 5",
      "Показ цифры: 500 мс",
      "Акцент: #d62828",
    ],
    node: (
      <Otp011 label="Что дальше" length={5} revealMs={500} accent="#d62828" />
    ),
  },
]