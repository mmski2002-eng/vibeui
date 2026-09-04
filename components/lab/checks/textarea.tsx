import type { LabCheck } from "@/components/lab/check-types"

import { Textarea001 } from "@/registry/components/textarea/textarea-001/textarea-001"
import { Textarea002 } from "@/registry/components/textarea/textarea-002/textarea-002"
import { Textarea004 } from "@/registry/components/textarea/textarea-004/textarea-004"
import { Textarea005 } from "@/registry/components/textarea/textarea-005/textarea-005"
import { Textarea006 } from "@/registry/components/textarea/textarea-006/textarea-006"
import { Textarea007 } from "@/registry/components/textarea/textarea-007/textarea-007"
import { Textarea008 } from "@/registry/components/textarea/textarea-008/textarea-008"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 76351

export const CHECKS: LabCheck[] = [
  {
    name: "textarea-001",
    title: "Растущее поле",
    notes: [
      "Подпись: Что дальше",
      "Подсказка: Что дальше",
      "Плейсхолдер: Подпись: тест",
      "Потолок, строк: 20",
      "Акцент: #c879c5",
      "Выключено: false",
    ],
    node: (
      <Textarea001
        label="Что дальше"
        hint="Что дальше"
        placeholder="Подпись: тест"
        maxRows={20}
        accent="#c879c5"
        disabled={false}
      />
    ),
  },
  {
    name: "textarea-002",
    title: "Поле с лимитом",
    notes: ["Подпись: Смена", "Предел: 438", "Акцент: #c0de7d"],
    node: <Textarea002 label="Смена" limit={438} accent="#c0de7d" />,
  },
  {
    name: "textarea-004",
    title: "Поле с панелью Markdown",
    notes: ["Подсказка: Что дальше", "Заглушка: Черновик", "Акцент: #57c0a9"],
    node: (
      <Textarea004 hint="Что дальше" placeholder="Черновик" accent="#57c0a9" />
    ),
  },
  {
    name: "textarea-005",
    title: "Поле с упоминаниями",
    notes: [
      "Подпись: Подпись: тест",
      "Заглушка: Что дальше",
      "Акцент: #420b66",
    ],
    node: (
      <Textarea005
        label="Подпись: тест"
        placeholder="Что дальше"
        accent="#420b66"
      />
    ),
  },
  {
    name: "textarea-006",
    title: "Поле с автосохранением",
    notes: ["Пауза, мс: 853", "Подпись: Черновик", "Акцент: #a3adf4"],
    node: <Textarea006 delay={853} label="Черновик" accent="#a3adf4" />,
  },
  {
    name: "textarea-007",
    title: "Поле со временем чтения",
    notes: ["Цель, слов: 130", "Слов в минуту: 104", "Акцент: #03c4fc"],
    node: <Textarea007 target={130} wordsPerMinute={104} accent="#03c4fc" />,
  },
  {
    name: "textarea-008",
    title: "Поле только для чтения",
    notes: [
      "Кнопка: Подпись: тест",
      "Пояснение: Подпись: тест",
      "Акцент: #e94a3b",
    ],
    node: (
      <Textarea008
        copyText="Подпись: тест"
        hint="Подпись: тест"
        accent="#e94a3b"
      />
    ),
  },
]
