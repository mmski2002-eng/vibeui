import type { LabCheck } from "@/components/lab/check-types"

import { Dialog001 } from "@/registry/components/dialog/dialog-001/dialog-001"
import { Dialog002 } from "@/registry/components/dialog/dialog-002/dialog-002"
import { Dialog003 } from "@/registry/components/dialog/dialog-003/dialog-003"
import { Dialog004 } from "@/registry/components/dialog/dialog-004/dialog-004"
import { Dialog005 } from "@/registry/components/dialog/dialog-005/dialog-005"
import { Dialog006 } from "@/registry/components/dialog/dialog-006/dialog-006"
import { Dialog007 } from "@/registry/components/dialog/dialog-007/dialog-007"
import { Dialog008 } from "@/registry/components/dialog/dialog-008/dialog-008"
import { Dialog009 } from "@/registry/components/dialog/dialog-009/dialog-009"
import { Dialog010 } from "@/registry/components/dialog/dialog-010/dialog-010"
import { Dialog011 } from "@/registry/components/dialog/dialog-011/dialog-011"
import { Dialog012 } from "@/registry/components/dialog/dialog-012/dialog-012"
import { Dialog013 } from "@/registry/components/dialog/dialog-013/dialog-013"
import { Dialog014 } from "@/registry/components/dialog/dialog-014/dialog-014"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 60513

export const CHECKS: LabCheck[] = [
  {
    name: "dialog-001",
    title: "Диалог во всплывающей панели",
    notes: [
      "Кнопка: Смена",
      "Заголовок: Что дальше",
      "Текст: Черновик",
      "Подтверждение: Смена",
      "Акцент: #140747",
    ],
    node: (
      <Dialog001
        trigger="Смена"
        title="Что дальше"
        description="Черновик"
        confirmLabel="Смена"
        accent="#140747"
      />
    ),
  },
  {
    name: "dialog-002",
    title: "Диалог удаления",
    notes: [
      "Кнопка: Что дальше",
      "Заголовок: Что дальше",
      "Подтверждение: Проверка",
      "Опасность: #3a0ad7",
    ],
    node: (
      <Dialog002
        trigger="Что дальше"
        title="Что дальше"
        confirmLabel="Проверка"
        danger="#3a0ad7"
      />
    ),
  },
  {
    name: "dialog-003",
    title: "Диалог с формой",
    notes: [
      "Заголовок: Смена",
      "Подпись поля: Смена",
      "Значение: Смена",
      "Акцент: #ef2254",
    ],
    node: (
      <Dialog003
        title="Смена"
        label="Смена"
        defaultValue="Смена"
        accent="#ef2254"
      />
    ),
  },
  {
    name: "dialog-004",
    title: "Диалог выбора",
    notes: ["Заголовок: Смена", "Выбрано: publish", "Акцент: #78d5af"],
    node: <Dialog004 title="Смена" defaultValue="publish" accent="#78d5af" />,
  },
  {
    name: "dialog-005",
    title: "Диалог с результатом",
    notes: ["Тон: danger", "Заголовок: Что дальше", "Итог: Подпись: тест"],
    node: <Dialog005 tone="danger" title="Что дальше" detail="Подпись: тест" />,
  },
  {
    name: "dialog-006",
    title: "Диалог с блокирующим прогрессом",
    notes: [
      "Заголовок: Что дальше",
      "Шаг: Что дальше",
      "Процент: 63",
      "Акцент: #43400a",
    ],
    node: (
      <Dialog006
        title="Что дальше"
        step="Что дальше"
        value={63}
        accent="#43400a"
      />
    ),
  },
  {
    name: "dialog-007",
    title: "Лист действий",
    notes: [
      "Заголовок: Проверка",
      "Подпись: Смена",
      "Отмена: Проверка",
      "Акцент: #f3d2b9",
    ],
    node: (
      <Dialog007
        title="Проверка"
        description="Смена"
        cancelLabel="Проверка"
        accent="#f3d2b9"
      />
    ),
  },
  {
    name: "dialog-008",
    title: "Диалог «поделиться»",
    notes: ["Заголовок: Смена", "Ссылка: Подпись: тест", "Акцент: #7c9fc1"],
    node: <Dialog008 title="Смена" link="Подпись: тест" accent="#7c9fc1" />,
  },
  {
    name: "dialog-009",
    title: "Двухшаговый диалог",
    notes: [
      "Кнопка: Подпись: тест",
      "Далее: Смена",
      "Готово: Смена",
      "Акцент: #cf7c43",
    ],
    node: (
      <Dialog009
        trigger="Подпись: тест"
        nextLabel="Смена"
        submitLabel="Смена"
        accent="#cf7c43"
      />
    ),
  },
  {
    name: "dialog-010",
    title: "Диалог сочетаний клавиш",
    notes: [
      "Кнопка: Подпись: тест",
      "Заголовок: Что дальше",
      "Акцент: #b493d3",
    ],
    node: (
      <Dialog010 trigger="Подпись: тест" title="Что дальше" accent="#b493d3" />
    ),
  },
  {
    name: "dialog-011",
    title: "Диалог предпросмотра",
    notes: [
      "Заголовок: Подпись: тест",
      "Характеристики: Что дальше",
      "Акцент: #928596",
    ],
    node: (
      <Dialog011 title="Подпись: тест" meta="Что дальше" accent="#928596" />
    ),
  },
  {
    name: "dialog-012",
    title: "Диалог с секретом",
    notes: [
      "Заголовок: Смена",
      "Копирование: Проверка",
      "Закрытие: Черновик",
      "Акцент: #da3dec",
    ],
    node: (
      <Dialog012
        title="Смена"
        copyLabel="Проверка"
        doneLabel="Черновик"
        accent="#da3dec"
      />
    ),
  },
  {
    name: "dialog-013",
    title: "Диалог обратной связи",
    notes: [
      "Заголовок: Что дальше",
      "Подпись поля: Смена",
      "Отправка: Смена",
      "Акцент: #fbb021",
    ],
    node: (
      <Dialog013
        title="Что дальше"
        fieldLabel="Смена"
        submitLabel="Смена"
        accent="#fbb021"
      />
    ),
  },
  {
    name: "dialog-014",
    title: "Диалог сессии",
    notes: [
      "Заголовок: Черновик",
      "Секунд: 230",
      "Остаться: Проверка",
      "Акцент: #89ec99",
    ],
    node: (
      <Dialog014
        title="Черновик"
        seconds={230}
        stayLabel="Проверка"
        accent="#89ec99"
      />
    ),
  },
]
