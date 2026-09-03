import type { LabCheck } from "@/components/lab/check-types"

import { Icontile001 } from "@/registry/components/icon-tile/icontile-001/icontile-001"
import { Icontile002 } from "@/registry/components/icon-tile/icontile-002/icontile-002"
import { Icontile003 } from "@/registry/components/icon-tile/icontile-003/icontile-003"
import { Icontile004 } from "@/registry/components/icon-tile/icontile-004/icontile-004"
import { Icontile005 } from "@/registry/components/icon-tile/icontile-005/icontile-005"
import { Icontile006 } from "@/registry/components/icon-tile/icontile-006/icontile-006"
import { Icontile007 } from "@/registry/components/icon-tile/icontile-007/icontile-007"
import { Icontile008 } from "@/registry/components/icon-tile/icontile-008/icontile-008"
import { Icontile009 } from "@/registry/components/icon-tile/icontile-009/icontile-009"
import { Icontile010 } from "@/registry/components/icon-tile/icontile-010/icontile-010"
import { Icontile011 } from "@/registry/components/icon-tile/icontile-011/icontile-011"
import { Icontile012 } from "@/registry/components/icon-tile/icontile-012/icontile-012"
import { Icontile013 } from "@/registry/components/icon-tile/icontile-013/icontile-013"
import { Icontile014 } from "@/registry/components/icon-tile/icontile-014/icontile-014"
import { Icontile015 } from "@/registry/components/icon-tile/icontile-015/icontile-015"
import { Icontile016 } from "@/registry/components/icon-tile/icontile-016/icontile-016"
import { Icontile017 } from "@/registry/components/icon-tile/icontile-017/icontile-017"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 84270

export const CHECKS: LabCheck[] = [
  {
    name: "icontile-001",
    title: "Плитка с иконкой",
    notes: ["Тон: danger", "Размер: md", "Форма: square", "Знак: Ня"],
    node: <Icontile001 tone="danger" size="md" shape="square" glyph="Ня" />,
  },
  {
    name: "icontile-002",
    title: "Градиентная плитка",
    notes: ["Размер: sm", "Оттенок: 132", "Знак: Ок"],
    node: <Icontile002 size="sm" hue={132} glyph="Ок" />,
  },
  {
    name: "icontile-003",
    title: "Плитка формы состояния",
    notes: ["Статус: pending", "Подпись: Смена"],
    node: <Icontile003 status="pending" label="Смена" />,
  },
  {
    name: "icontile-004",
    title: "Шкала размеров плитки",
    notes: ["Форма: squircle", "Знак: Тест"],
    node: <Icontile004 shape="squircle" glyph="Тест" />,
  },
  {
    name: "icontile-005",
    title: "Плитка со счётчиком",
    notes: [
      "Счётчик: 304",
      "Порог: 391",
      "Подпись: Черновик",
      "Подпись счётчика: Что дальше",
    ],
    node: (
      <Icontile005
        count={304}
        max={391}
        label="Черновик"
        countText="Что дальше"
      />
    ),
  },
  {
    name: "icontile-006",
    title: "Нажимаемая плитка",
    notes: ["Оттенок: 288", "Нажата: true", "Имя кнопки: Смена", "Знак: Тест"],
    node: (
      <Icontile006 hue={288} defaultPressed={true} label="Смена" glyph="Тест" />
    ),
  },
  {
    name: "icontile-007",
    title: "Плитка с подписью",
    notes: [
      "Иконка: bolt",
      "Тон: neutral",
      "Подпись: Смена",
      "Описание: Подпись: тест",
    ],
    node: (
      <Icontile007
        icon="bolt"
        tone="neutral"
        title="Смена"
        description="Подпись: тест"
      />
    ),
  },
  {
    name: "icontile-008",
    title: "Сетка плиток категорий",
    notes: ["Подпись счётчика: Проверка"],
    node: <Icontile008 countText="Проверка" />,
  },
  {
    name: "icontile-009",
    title: "Плитка-squircle с тенью",
    notes: ["Иконка: shield", "Тон: accent", "Размер: sm"],
    node: <Icontile009 icon="shield" tone="accent" size="sm" />,
  },
  {
    name: "icontile-010",
    title: "Плитка с круговым прогрессом",
    notes: ["Значение: 33", "Тон: accent", "Размер: lg", "Подпись: Смена"],
    node: <Icontile010 value={33} tone="accent" size="lg" label="Смена" />,
  },
  {
    name: "icontile-011",
    title: "Плитка статуса интеграции",
    notes: ["Статус: pending", "Тон: accent", "Сервис: Черновик"],
    node: <Icontile011 status="pending" tone="accent" name="Черновик" />,
  },
  {
    name: "icontile-012",
    title: "Плитка типа файла",
    notes: [
      "Тип файла: img",
      "Имя файла: Проверка",
      "Размер файла: Что дальше",
    ],
    node: <Icontile012 extension="img" name="Проверка" fileSize="Что дальше" />,
  },
  {
    name: "icontile-013",
    title: "Плитка достижения",
    notes: ["Иконка: trophy", "Тир: silver"],
    node: <Icontile013 icon="trophy" tier="silver" />,
  },
  {
    name: "icontile-014",
    title: "Плитка с уведомлением",
    notes: ["Счётчик: 894", "Выключено: false", "Тон: warning"],
    node: <Icontile014 count={894} disabled={false} tone="warning" />,
  },
  {
    name: "icontile-015",
    title: "Плитка способа оплаты",
    notes: ["Подпись группы: Подпись: тест", "Способ по умолчанию: invoice"],
    node: <Icontile015 label="Подпись: тест" defaultMethod="invoice" />,
  },
  {
    name: "icontile-016",
    title: "Плитка с горячей клавишей",
    notes: [
      "Заголовок: Черновик",
      "Описание: Подпись: тест",
      "Иконка: command",
      "Тон: neutral",
    ],
    node: (
      <Icontile016
        label="Черновик"
        description="Подпись: тест"
        icon="command"
        tone="neutral"
      />
    ),
  },
  {
    name: "icontile-017",
    title: "Плитка папки с вложениями",
    notes: [
      "Название: Что дальше",
      "Число вложений: 7419",
      "Дата изменения: Смена",
      "Тон: success",
    ],
    node: (
      <Icontile017
        name="Что дальше"
        itemCount={7419}
        modifiedLabel="Смена"
        tone="success"
      />
    ),
  },
]
