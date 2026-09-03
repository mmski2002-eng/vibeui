import type { LabCheck } from "@/components/lab/check-types"

import { Nativeselect001 } from "@/registry/components/native-select/nativeselect-001/nativeselect-001"
import { Nativeselect002 } from "@/registry/components/native-select/nativeselect-002/nativeselect-002"
import { Nativeselect003 } from "@/registry/components/native-select/nativeselect-003/nativeselect-003"
import { Nativeselect004 } from "@/registry/components/native-select/nativeselect-004/nativeselect-004"
import { Nativeselect005 } from "@/registry/components/native-select/nativeselect-005/nativeselect-005"
import { Nativeselect006 } from "@/registry/components/native-select/nativeselect-006/nativeselect-006"
import { Nativeselect007 } from "@/registry/components/native-select/nativeselect-007/nativeselect-007"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 15946

export const CHECKS: LabCheck[] = [
  {
    name: "nativeselect-001",
    title: "Нативный список",
    notes: ["Подпись: Что дальше", "Пояснение: Смена", "Акцент: #f16ec8"],
    node: <Nativeselect001 label="Что дальше" hint="Смена" accent="#f16ec8" />,
  },
  {
    name: "nativeselect-002",
    title: "Список с группами",
    notes: ["Подпись: Смена", "Пояснение: Черновик", "Акцент: #0e8ef3"],
    node: <Nativeselect002 label="Смена" hint="Черновик" accent="#0e8ef3" />,
  },
  {
    name: "nativeselect-003",
    title: "Обязательный выбор с подсказкой",
    notes: ["Подпись: Черновик", "Заглушка: Проверка", "Акцент: #3b55bc"],
    node: (
      <Nativeselect003
        label="Черновик"
        placeholder="Проверка"
        accent="#3b55bc"
      />
    ),
  },
  {
    name: "nativeselect-004",
    title: "Список с множественным выбором",
    notes: ["Подсказка: Черновик", "Видимых строк: 8", "Акцент: #53dc76"],
    node: <Nativeselect004 hint="Черновик" rows={8} accent="#53dc76" />,
  },
  {
    name: "nativeselect-005",
    title: "Фильтр в строке",
    notes: [
      "Первая подпись: Черновик",
      "Вторая подпись: Подпись: тест",
      "Акцент: #a214e1",
    ],
    node: (
      <Nativeselect005
        label="Черновик"
        secondLabel="Подпись: тест"
        accent="#a214e1"
      />
    ),
  },
  {
    name: "nativeselect-006",
    title: "Список с ошибкой",
    notes: [
      "Подпись: Смена",
      "Текст ошибки: Смена",
      "Заглушка: Черновик",
      "Акцент: #c8f993",
    ],
    node: (
      <Nativeselect006
        label="Смена"
        error="Смена"
        placeholder="Черновик"
        accent="#c8f993"
      />
    ),
  },
  {
    name: "nativeselect-007",
    title: "Шкала размеров",
    notes: ["Размер: sm", "Подпись: Подпись: тест", "Акцент: #271a91"],
    node: <Nativeselect007 size="sm" label="Подпись: тест" accent="#271a91" />,
  },
]
