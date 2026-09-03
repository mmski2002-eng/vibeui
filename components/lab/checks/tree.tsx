import type { LabCheck } from "@/components/lab/check-types"

import { Tree001 } from "@/registry/components/tree/tree-001/tree-001"
import { Tree002 } from "@/registry/components/tree/tree-002/tree-002"
import { Tree003 } from "@/registry/components/tree/tree-003/tree-003"
import { Tree004 } from "@/registry/components/tree/tree-004/tree-004"
import { Tree005 } from "@/registry/components/tree/tree-005/tree-005"
import { Tree006 } from "@/registry/components/tree/tree-006/tree-006"
import { Tree007 } from "@/registry/components/tree/tree-007/tree-007"
import { Tree008 } from "@/registry/components/tree/tree-008/tree-008"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 44675

export const CHECKS: LabCheck[] = [
  {
    name: "tree-001",
    title: "Дерево файлов",
    notes: ["Акцент: #dd139d", "Подпись дерева: Черновик"],
    node: <Tree001 accent="#dd139d" label="Черновик" />,
  },
  {
    name: "tree-002",
    title: "Дерево с типами файлов",
    notes: ["Подпись дерева: Черновик", "Акцент: #6a257b"],
    node: <Tree002 label="Черновик" accent="#6a257b" />,
  },
  {
    name: "tree-003",
    title: "Дерево только на details",
    notes: ["Подпись дерева: Подпись: тест", "Акцент: #1eac80"],
    node: <Tree003 label="Подпись: тест" accent="#1eac80" />,
  },
  {
    name: "tree-004",
    title: "Дерево с выбором и клавиатурой",
    notes: [
      "Подпись дерева: Что дальше",
      "Строка о выборе: Смена",
      "Подсказка: Черновик",
      "Акцент: #bddbfb",
    ],
    node: (
      <Tree004
        label="Что дальше"
        selectedText="Смена"
        hintText="Черновик"
        accent="#bddbfb"
      />
    ),
  },
  {
    name: "tree-005",
    title: "Дерево с частичными флажками",
    notes: [
      "Подпись дерева: Подпись: тест",
      "Строка итога: Что дальше",
      "Развернуть: Подпись: тест",
      "Свернуть: Проверка",
      "Акцент: #ad86b8",
    ],
    node: (
      <Tree005
        label="Подпись: тест"
        totalText="Что дальше"
        expandText="Подпись: тест"
        collapseText="Проверка"
        accent="#ad86b8"
      />
    ),
  },
  {
    name: "tree-006",
    title: "Дерево с поиском",
    notes: [
      "Подпись дерева: Подпись: тест",
      "Подсказка поиска: Черновик",
      "Строка находок: Смена",
      "Пустая выдача: Подпись: тест",
      "Акцент: #fdb5ea",
    ],
    node: (
      <Tree006
        label="Подпись: тест"
        placeholder="Черновик"
        countText="Смена"
        emptyText="Подпись: тест"
        accent="#fdb5ea"
      />
    ),
  },
  {
    name: "tree-007",
    title: "Дерево с ленивой веткой",
    notes: [
      "Подпись дерева: Что дальше",
      "Подпись загрузки: Черновик",
      "Задержка, мс: 2065",
      "Акцент: #5685de",
    ],
    node: (
      <Tree007
        label="Что дальше"
        loadingText="Черновик"
        delay={2065}
        accent="#5685de"
      />
    ),
  },
  {
    name: "tree-008",
    title: "Дерево с направляющими",
    notes: ["Подпись дерева: Проверка", "Направляющие: #9cb711"],
    node: <Tree008 label="Проверка" line="#9cb711" />,
  },
]
