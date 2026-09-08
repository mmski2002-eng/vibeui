import type { LabCheck } from "@/components/lab/check-types"

import { File001 } from "@/registry/components/file-upload/file-001/file-001"
import { File002 } from "@/registry/components/file-upload/file-002/file-002"
import { File003 } from "@/registry/components/file-upload/file-003/file-003"
import { File006 } from "@/registry/components/file-upload/file-006/file-006"
import { File007 } from "@/registry/components/file-upload/file-007/file-007"
import { File008 } from "@/registry/components/file-upload/file-008/file-008"
import { File009 } from "@/registry/components/file-upload/file-009/file-009"
import { File010 } from "@/registry/components/file-upload/file-010/file-010"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 108

export const CHECKS: LabCheck[] = [
  {
    name: "file-001",
    title: "Зона перетаскивания файлов",
    notes: [
      "Подпись: Что дальше",
      "Требования: Черновик",
      "Размер: Что дальше",
      "Акцент: #676e15",
    ],
    node: (
      <File001
        label="Что дальше"
        hint="Черновик"
        sizeText="Что дальше"
        accent="#676e15"
      />
    ),
  },
  {
    name: "file-002",
    title: "Вставка или перетаскивание",
    notes: [
      "Подпись зоны: Подпись: тест",
      "Форматы: Что дальше",
      "Акцент: #5211ce",
    ],
    node: (
      <File002 label="Подпись: тест" accept="Что дальше" accent="#5211ce" />
    ),
  },
  {
    name: "file-003",
    title: "Очередь загрузки",
    notes: ["Заголовок: Что дальше", "Акцент: #4bb1f1"],
    node: <File003 title="Что дальше" accent="#4bb1f1" />,
  },
  {
    name: "file-006",
    title: "Загрузка с проверкой",
    notes: ["Подпись: Черновик", "Предел, МБ: 21", "Акцент: #ae275d"],
    node: <File006 label="Черновик" maxSizeMb={21} accent="#ae275d" />,
  },
  {
    name: "file-007",
    title: "Прогресс пакета",
    notes: [
      "Заголовок: Смена",
      "Готово файлов: 1",
      "Всего файлов: 16",
      "Акцент: #b6420d",
    ],
    node: <File007 title="Смена" done={1} total={16} accent="#b6420d" />,
  },
  {
    name: "file-008",
    title: "Замена файла",
    notes: [
      "Подпись: Черновик",
      "Текущий файл: Подпись: тест",
      "Описание файла: Что дальше",
      "Акцент: #d58537",
    ],
    node: (
      <File008
        label="Черновик"
        current="Подпись: тест"
        meta="Что дальше"
        accent="#d58537"
      />
    ),
  },
  {
    name: "file-009",
    title: "Файл или ссылка",
    notes: [
      "Заголовок: Проверка",
      "Вкладка «файл»: Смена",
      "Вкладка «ссылка»: Проверка",
      "Акцент: #f1cda0",
    ],
    node: (
      <File009
        title="Проверка"
        fileTab="Смена"
        linkTab="Проверка"
        accent="#f1cda0"
      />
    ),
  },
  {
    name: "file-010",
    title: "Повтор загрузки",
    notes: [
      "Имя файла: Подпись: тест",
      "Причина: Что дальше",
      "Кнопка повтора: Подпись: тест",
      "Акцент: #6e6098",
    ],
    node: (
      <File010
        fileName="Подпись: тест"
        reason="Что дальше"
        retryLabel="Подпись: тест"
        accent="#6e6098"
      />
    ),
  },
]
