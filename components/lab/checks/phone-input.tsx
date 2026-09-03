import type { LabCheck } from "@/components/lab/check-types"

import { Phoneinput001 } from "@/registry/components/phone-input/phoneinput-001/phoneinput-001"
import { Phoneinput002 } from "@/registry/components/phone-input/phoneinput-002/phoneinput-002"
import { Phoneinput003 } from "@/registry/components/phone-input/phoneinput-003/phoneinput-003"
import { Phoneinput004 } from "@/registry/components/phone-input/phoneinput-004/phoneinput-004"
import { Phoneinput005 } from "@/registry/components/phone-input/phoneinput-005/phoneinput-005"
import { Phoneinput006 } from "@/registry/components/phone-input/phoneinput-006/phoneinput-006"
import { Phoneinput007 } from "@/registry/components/phone-input/phoneinput-007/phoneinput-007"
import { Phoneinput008 } from "@/registry/components/phone-input/phoneinput-008/phoneinput-008"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 108

export const CHECKS: LabCheck[] = [
  {
    name: "phoneinput-001",
    title: "Код страны",
    notes: [
      "Подпись: Что дальше",
      "Заглушка: Черновик",
      "Подсказка: Что дальше",
      "Акцент: #676e15",
    ],
    node: (
      <Phoneinput001
        label="Что дальше"
        placeholder="Черновик"
        hint="Что дальше"
        accent="#676e15"
      />
    ),
  },
  {
    name: "phoneinput-002",
    title: "Маска по стране",
    notes: [
      "Подпись: Подпись: тест",
      "Подсказка: Что дальше",
      "Акцент: #5211ce",
    ],
    node: (
      <Phoneinput002 label="Подпись: тест" hint="Что дальше" accent="#5211ce" />
    ),
  },
  {
    name: "phoneinput-003",
    title: "Счётчик цифр",
    notes: [
      "Ожидаемых цифр: 8",
      "Подпись: Что дальше",
      "Код страны: 42",
      "Заглушка: Что дальше",
      "Строка набора: Что дальше",
      "Строка готовности: Подпись: тест",
      "Акцент: #8ed09e",
    ],
    node: (
      <Phoneinput003
        expected={8}
        label="Что дальше"
        code="42"
        placeholder="Что дальше"
        progressText="Что дальше"
        doneText="Подпись: тест"
        accent="#8ed09e"
      />
    ),
  },
  {
    name: "phoneinput-004",
    title: "Определённая страна",
    notes: [
      "Подпись: Проверка",
      "Заглушка: Черновик",
      "Метка без кода: Ня",
      "Подсказка с кодом: Подпись: тест",
      "Подсказка без кода: Подпись: тест",
      "Акцент: #ebd933",
    ],
    node: (
      <Phoneinput004
        label="Проверка"
        placeholder="Черновик"
        unknownLabel="Ня"
        knownHint="Подпись: тест"
        unknownHint="Подпись: тест"
        accent="#ebd933"
      />
    ),
  },
  {
    name: "phoneinput-005",
    title: "Образец формата",
    notes: [
      "Подпись: Смена",
      "Образец: Смена",
      "Подпись образца: Что дальше",
      "Пояснение: Проверка",
      "Акцент: #420dff",
    ],
    node: (
      <Phoneinput005
        label="Смена"
        example="Смена"
        exampleLabel="Что дальше"
        note="Проверка"
        accent="#420dff"
      />
    ),
  },
  {
    name: "phoneinput-006",
    title: "Не номер",
    notes: [
      "Подпись: Что дальше",
      "Текст ошибки: Что дальше",
      "Набранное: Черновик",
      "Образец: Что дальше",
      "Подпись «набрано»: Проверка",
      "Подпись «нужно»: Смена",
      "Акцент: #eea9f1",
    ],
    node: (
      <Phoneinput006
        label="Что дальше"
        error="Что дальше"
        defaultValue="Черновик"
        example="Что дальше"
        typedLabel="Проверка"
        expectedLabel="Смена"
        accent="#eea9f1"
      />
    ),
  },
  {
    name: "phoneinput-007",
    title: "С добавочным",
    notes: [
      "Подпись: Проверка",
      "Заглушка: Подпись: тест",
      "Подпись добавочного: Что дальше",
      "Заглушка добавочного: Ня",
      "Пояснение: Что дальше",
      "Акцент: #98cae1",
    ],
    node: (
      <Phoneinput007
        label="Проверка"
        placeholder="Подпись: тест"
        extensionLabel="Что дальше"
        extensionPlaceholder="Ня"
        hint="Что дальше"
        accent="#98cae1"
      />
    ),
  },
  {
    name: "phoneinput-008",
    title: "Проверка формата",
    notes: [
      "Подпись: Подпись: тест",
      "Строка формата: Черновик",
      "Акцент: #a0bed9",
    ],
    node: (
      <Phoneinput008 label="Подпись: тест" hint="Черновик" accent="#a0bed9" />
    ),
  },
]
