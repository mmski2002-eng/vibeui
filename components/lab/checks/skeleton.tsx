import type { LabCheck } from "@/components/lab/check-types"

import { Skeleton001 } from "@/registry/components/skeleton/skeleton-001/skeleton-001"
import { Skeleton002 } from "@/registry/components/skeleton/skeleton-002/skeleton-002"
import { Skeleton003 } from "@/registry/components/skeleton/skeleton-003/skeleton-003"
import { Skeleton004 } from "@/registry/components/skeleton/skeleton-004/skeleton-004"
import { Skeleton005 } from "@/registry/components/skeleton/skeleton-005/skeleton-005"
import { Skeleton006 } from "@/registry/components/skeleton/skeleton-006/skeleton-006"
import { Skeleton007 } from "@/registry/components/skeleton/skeleton-007/skeleton-007"
import { Skeleton008 } from "@/registry/components/skeleton/skeleton-008/skeleton-008"
import { Skeleton009 } from "@/registry/components/skeleton/skeleton-009/skeleton-009"
import { Skeleton010 } from "@/registry/components/skeleton/skeleton-010/skeleton-010"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 76351

export const CHECKS: LabCheck[] = [
  {
    name: "skeleton-001",
    title: "Скелетон текста",
    notes: ["Форма: block", "Строк: 3", "Подпись: Что дальше"],
    node: <Skeleton001 shape="block" lines={3} label="Что дальше" />,
  },
  {
    name: "skeleton-002",
    title: "Скелетон карточки",
    notes: ["Пропорция обложки: 4 / 3", "Подпись: Черновик"],
    node: <Skeleton002 ratio="4 / 3" label="Черновик" />,
  },
  {
    name: "skeleton-003",
    title: "Скелетон строк списка",
    notes: ["Строк: 16", "Подпись: Проверка"],
    node: <Skeleton003 rows={16} label="Проверка" />,
  },
  {
    name: "skeleton-004",
    title: "Скелетон таблицы",
    notes: ["Строк: 16", "Колонки: Смена"],
    node: <Skeleton004 rows={16} columns="Смена" />,
  },
  {
    name: "skeleton-005",
    title: "Скелетон шапки профиля",
    notes: ["Высота обложки: 7rem", "Подпись: Черновик"],
    node: <Skeleton005 cover="7rem" label="Черновик" />,
  },
  {
    name: "skeleton-006",
    title: "Скелетон абзаца по маске",
    notes: ["Подпись: Что дальше"],
    node: <Skeleton006 label="Что дальше" />,
  },
  {
    name: "skeleton-007",
    title: "Скелетон сетки плиток",
    notes: ["Плиток: 23", "Минимум плитки: 6rem"],
    node: <Skeleton007 tiles={23} minTile="6rem" />,
  },
  {
    name: "skeleton-008",
    title: "Скелетон графика",
    notes: ["Высота поля: 7rem", "Подпись: Черновик"],
    node: <Skeleton008 height="7rem" label="Черновик" />,
  },
  {
    name: "skeleton-009",
    title: "Скелетон карточки товара",
    notes: ["Пропорция обложки: 4 / 3", "Подпись: Черновик"],
    node: <Skeleton009 ratio="4 / 3" label="Черновик" />,
  },
  {
    name: "skeleton-010",
    title: "Скелетон таблицы данных",
    notes: ["Строк: 8", "Подпись: Проверка"],
    node: <Skeleton010 rows={8} label="Проверка" />,
  },
]
