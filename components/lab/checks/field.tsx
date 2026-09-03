import type { LabCheck } from "@/components/lab/check-types"

import { Field001 } from "@/registry/components/field/field-001/field-001"
import { Field002 } from "@/registry/components/field/field-002/field-002"
import { Field003 } from "@/registry/components/field/field-003/field-003"
import { Field004 } from "@/registry/components/field/field-004/field-004"
import { Field005 } from "@/registry/components/field/field-005/field-005"
import { Field006 } from "@/registry/components/field/field-006/field-006"
import { Field007 } from "@/registry/components/field/field-007/field-007"
import { Field008 } from "@/registry/components/field/field-008/field-008"
import { Field009 } from "@/registry/components/field/field-009/field-009"
import { Field010 } from "@/registry/components/field/field-010/field-010"
import { Field011 } from "@/registry/components/field/field-011/field-011"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "field-001",
    title: "Поле с ошибкой",
    notes: [
      "Подпись: Подпись: тест",
      "Ошибка: Подпись: тест",
      "Обязательное: true",
      "Акцент: #e1948b",
    ],
    node: (
      <Field001
        label="Подпись: тест"
        error="Подпись: тест"
        required={true}
        accent="#e1948b"
      />
    ),
  },
  {
    name: "field-002",
    title: "Оболочка поля",
    notes: [
      "Подпись: Подпись: тест",
      "Подсказка: Проверка",
      "Ошибка: Смена",
      "Метка: Проверка",
      "Значение: Что дальше",
      "Акцент: #046f09",
    ],
    node: (
      <Field002
        label="Подпись: тест"
        hint="Проверка"
        error="Смена"
        badge="Проверка"
        defaultValue="Что дальше"
        accent="#046f09"
      />
    ),
  },
  {
    name: "field-003",
    title: "Отметка обязательного",
    notes: [
      "Подпись: Подпись: тест",
      "Плейсхолдер: Подпись: тест",
      "Подпись необязательного: Смена",
      "Метка необязательного: Смена",
      "Сноска: Черновик",
      "Акцент: #b97ce5",
    ],
    node: (
      <Field003
        label="Подпись: тест"
        placeholder="Подпись: тест"
        optionalTitle="Смена"
        optionalLabel="Смена"
        legend="Черновик"
        accent="#b97ce5"
      />
    ),
  },
  {
    name: "field-004",
    title: "Кольцо счётчика",
    notes: [
      "Подпись: Черновик",
      "Значение: Подпись: тест",
      "Пояснение: Подпись: тест",
      "Лимит символов: 196",
      "Акцент: #fbba3e",
    ],
    node: (
      <Field004
        label="Черновик"
        defaultValue="Подпись: тест"
        hint="Подпись: тест"
        limit={196}
        accent="#fbba3e"
      />
    ),
  },
  {
    name: "field-005",
    title: "Единица у поля",
    notes: [
      "Подпись: Проверка",
      "Приставка: Что дальше",
      "Пояснение: Проверка",
      "Значение: 0",
      "Акцент: #1fac8e",
    ],
    node: (
      <Field005
        label="Проверка"
        prefix="Что дальше"
        hint="Проверка"
        defaultValue={0}
        accent="#1fac8e"
      />
    ),
  },
  {
    name: "field-006",
    title: "Поле с действием",
    notes: [
      "Подпись: Подпись: тест",
      "Кнопка: Проверка",
      "Плейсхолдер: Проверка",
      "Пояснение: Смена",
      "Акцент: #4bf07f",
    ],
    node: (
      <Field006
        label="Подпись: тест"
        action="Проверка"
        placeholder="Проверка"
        note="Смена"
        accent="#4bf07f"
      />
    ),
  },
  {
    name: "field-007",
    title: "Поле с копированием",
    notes: [
      "Подпись: Смена",
      "Значение: Проверка",
      "Подсказка: Проверка",
      "Кнопка: Подпись: тест",
      "Акцент: #4da7ab",
    ],
    node: (
      <Field007
        label="Смена"
        value="Проверка"
        hint="Проверка"
        copyText="Подпись: тест"
        accent="#4da7ab"
      />
    ),
  },
  {
    name: "field-008",
    title: "Проверка занятости",
    notes: [
      "Подпись: Проверка",
      "Приставка: Что дальше",
      "Плейсхолдер: Проверка",
      "Пауза, мс: 1545",
      "Акцент: #17d120",
    ],
    node: (
      <Field008
        label="Проверка"
        prefix="Что дальше"
        placeholder="Проверка"
        delay={1545}
        accent="#17d120"
      />
    ),
  },
  {
    name: "field-009",
    title: "Подпись в строке",
    notes: [
      "Подпись: Проверка",
      "Подсказка: Смена",
      "Значение: Подпись: тест",
      "Подпись роли: Подпись: тест",
      "Подпись города: Проверка",
      "Ширина подписей: Тест",
      "Акцент: #1672ab",
    ],
    node: (
      <Field009
        label="Проверка"
        hint="Смена"
        defaultValue="Подпись: тест"
        roleLabel="Подпись: тест"
        cityLabel="Проверка"
        labelWidth="Тест"
        accent="#1672ab"
      />
    ),
  },
  {
    name: "field-010",
    title: "Ошибка группы полей",
    notes: [
      "Заголовок группы: Черновик",
      "Ошибка: Подпись: тест",
      "Подсказка: Что дальше",
      "Подпись дня: Ок",
      "Подпись месяца: Черновик",
      "Подпись года: Ок",
      "Акцент: #f13d56",
    ],
    node: (
      <Field010
        legend="Черновик"
        error="Подпись: тест"
        hint="Что дальше"
        dayLabel="Ок"
        monthLabel="Черновик"
        yearLabel="Ок"
        accent="#f13d56"
      />
    ),
  },
  {
    name: "field-011",
    title: "Автосохранение черновика",
    notes: [
      "Подпись: Смена",
      "Подсказка: Проверка",
      "Черновик: Подпись: тест",
      "Пауза, мс: 3805",
      "Акцент: #90bf33",
    ],
    node: (
      <Field011
        label="Смена"
        placeholder="Проверка"
        defaultValue="Подпись: тест"
        delay={3805}
        accent="#90bf33"
      />
    ),
  },
]
