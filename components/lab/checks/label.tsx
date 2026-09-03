import type { LabCheck } from "@/components/lab/check-types"

import { Label001 } from "@/registry/components/label/label-001/label-001"
import { Label002 } from "@/registry/components/label/label-002/label-002"
import { Label003 } from "@/registry/components/label/label-003/label-003"
import { Label004 } from "@/registry/components/label/label-004/label-004"
import { Label005 } from "@/registry/components/label/label-005/label-005"
import { Label006 } from "@/registry/components/label/label-006/label-006"
import { Label007 } from "@/registry/components/label/label-007/label-007"
import { Label008 } from "@/registry/components/label/label-008/label-008"
import { Label009 } from "@/registry/components/label/label-009/label-009"
import { Label010 } from "@/registry/components/label/label-010/label-010"
import { Label011 } from "@/registry/components/label/label-011/label-011"
import { Label012 } from "@/registry/components/label/label-012/label-012"
import { Label013 } from "@/registry/components/label/label-013/label-013"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "label-001",
    title: "Отметка обязательного",
    notes: [
      "Подпись: Подпись: тест",
      "Пояснение: Подпись: тест",
      "Акцент: #22e194",
    ],
    node: (
      <Label001 label="Подпись: тест" hint="Подпись: тест" accent="#22e194" />
    ),
  },
  {
    name: "label-002",
    title: "Подсказка во всплывашке",
    notes: [
      "Вопрос: Подпись: тест",
      "Подсказка: Что дальше",
      "Подпись: Смена",
      "Акцент: #0e45a3",
    ],
    node: (
      <Label002
        question="Подпись: тест"
        answer="Что дальше"
        label="Смена"
        accent="#0e45a3"
      />
    ),
  },
  {
    name: "label-003",
    title: "Метка «необязательно»",
    notes: ["Подпись: Что дальше", "Пометка: Подпись: тест", "Акцент: #09f876"],
    node: (
      <Label003
        label="Что дальше"
        optionalText="Подпись: тест"
        accent="#09f876"
      />
    ),
  },
  {
    name: "label-004",
    title: "Подпись сбоку",
    notes: [
      "Подпись: Подпись: тест",
      "Ширина колонки, rem: 13",
      "Акцент: #2eaf00",
    ],
    node: <Label004 label="Подпись: тест" labelWidth={13} accent="#2eaf00" />,
  },
  {
    name: "label-005",
    title: "Заголовок группы",
    notes: [
      "Вопрос группы: Черновик",
      "Пояснение: Подпись: тест",
      "Акцент: #e592de",
    ],
    node: <Label005 legend="Черновик" hint="Подпись: тест" accent="#e592de" />,
  },
  {
    name: "label-006",
    title: "Подпись со счётчиком",
    notes: [
      "Подпись: Подпись: тест",
      "Предел символов: 301",
      "Акцент: #88fafb",
    ],
    node: <Label006 label="Подпись: тест" limit={301} accent="#88fafb" />,
  },
  {
    name: "label-007",
    title: "Подпись с ошибкой",
    notes: ["Подпись: Что дальше", "Текст ошибки: Проверка", "Акцент: #f54b0f"],
    node: <Label007 label="Что дальше" error="Проверка" accent="#f54b0f" />,
  },
  {
    name: "label-008",
    title: "Причина блокировки",
    notes: [
      "Причина: Что дальше",
      "Ссылка-выход: Проверка",
      "Значение поля: Черновик",
      "Акцент: #948bac",
    ],
    node: (
      <Label008
        reason="Что дальше"
        actionText="Проверка"
        defaultValue="Черновик"
        accent="#948bac"
      />
    ),
  },
  {
    name: "label-009",
    title: "Плашка обязательного",
    notes: [
      "Подпись: Проверка",
      "Текст бейджа: Смена",
      "Пояснение: Черновик",
      "Акцент: #7fcf2e",
    ],
    node: (
      <Label009
        label="Проверка"
        badge="Смена"
        hint="Черновик"
        accent="#7fcf2e"
      />
    ),
  },
  {
    name: "label-010",
    title: "Раскрытие в подписи",
    notes: [
      "Подпись: Проверка",
      "Текст кнопки-раскрытия: Проверка",
      "Ответ: Подпись: тест",
      "Акцент: #4da7ab",
    ],
    node: (
      <Label010
        label="Проверка"
        toggleText="Проверка"
        answer="Подпись: тест"
        accent="#4da7ab"
      />
    ),
  },
  {
    name: "label-011",
    title: "Счётчик отмеченных",
    notes: [
      "Заголовок группы: Проверка",
      "Счётчик: Что дальше",
      "Акцент: #ecb2bf",
    ],
    node: (
      <Label011 legend="Проверка" countText="Что дальше" accent="#ecb2bf" />
    ),
  },
  {
    name: "label-012",
    title: "Пометка необязательного",
    notes: [
      "Подпись: Черновик",
      "Текст пометки: Подпись: тест",
      "Акцент: #9eae1f",
    ],
    node: (
      <Label012
        label="Черновик"
        optionalText="Подпись: тест"
        accent="#9eae1f"
      />
    ),
  },
  {
    name: "label-013",
    title: "Ошибка группы",
    notes: [
      "Заголовок группы: Подпись: тест",
      "Текст ошибки: Подпись: тест",
      "Подпись первого поля: Проверка",
      "Подпись второго поля: Смена",
      "Акцент: #1672ab",
    ],
    node: (
      <Label013
        legend="Подпись: тест"
        error="Подпись: тест"
        firstLabel="Проверка"
        secondLabel="Смена"
        accent="#1672ab"
      />
    ),
  },
]
