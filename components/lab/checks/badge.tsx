import type { LabCheck } from "@/components/lab/check-types"

import { Badge001 } from "@/registry/components/badge/badge-001/badge-001"
import { Badge002 } from "@/registry/components/badge/badge-002/badge-002"
import { Badge003 } from "@/registry/components/badge/badge-003/badge-003"
import { Badge004 } from "@/registry/components/badge/badge-004/badge-004"
import { Badge005 } from "@/registry/components/badge/badge-005/badge-005"
import { Badge006 } from "@/registry/components/badge/badge-006/badge-006"
import { Badge007 } from "@/registry/components/badge/badge-007/badge-007"
import { Badge008 } from "@/registry/components/badge/badge-008/badge-008"
import { Badge009 } from "@/registry/components/badge/badge-009/badge-009"
import { Badge010 } from "@/registry/components/badge/badge-010/badge-010"
import { Badge011 } from "@/registry/components/badge/badge-011/badge-011"
import { Badge012 } from "@/registry/components/badge/badge-012/badge-012"
import { Badge013 } from "@/registry/components/badge/badge-013/badge-013"
import { Badge014 } from "@/registry/components/badge/badge-014/badge-014"
import { Badge015 } from "@/registry/components/badge/badge-015/badge-015"
import { Badge016 } from "@/registry/components/badge/badge-016/badge-016"
import { Badge017 } from "@/registry/components/badge/badge-017/badge-017"
import { Badge018 } from "@/registry/components/badge/badge-018/badge-018"
import { Badge019 } from "@/registry/components/badge/badge-019/badge-019"
import { Badge020 } from "@/registry/components/badge/badge-020/badge-020"
import { Badge021 } from "@/registry/components/badge/badge-021/badge-021"
import { Badge022 } from "@/registry/components/badge/badge-022/badge-022"
import { Badge023 } from "@/registry/components/badge/badge-023/badge-023"
import { Badge024 } from "@/registry/components/badge/badge-024/badge-024"
import { Badge025 } from "@/registry/components/badge/badge-025/badge-025"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "badge-001",
    title: "Плашка состояния",
    notes: ["Текст: Подпись: тест", "Тон: danger", "Размер: sm", "Точка: true"],
    node: (
      <Badge001 tone="danger" size="sm" dot={true}>
        Подпись: тест
      </Badge001>
    ),
  },
  {
    name: "badge-002",
    title: "Плашка с заливкой",
    notes: ["Текст: Подпись: тест", "Тон: warning", "Размер: sm"],
    node: (
      <Badge002 tone="warning" size="sm">
        Подпись: тест
      </Badge002>
    ),
  },
  {
    name: "badge-003",
    title: "Плашка со счётчиком",
    notes: ["Значение: 4204", "Порог: 327", "Тон: danger"],
    node: <Badge003 value={4204} max={327} tone="danger" />,
  },
  {
    name: "badge-004",
    title: "Точка-маркер",
    notes: [
      "Что случилось: Смена",
      "Тон: accent",
      "Угол: top-left",
      "Маркер: true",
    ],
    node: (
      <Badge004 label="Смена" tone="accent" placement="top-left" show={true} />
    ),
  },
  {
    name: "badge-005",
    title: "Удаляемый чип",
    notes: ["Фильтр: Смена", "Размер: sm"],
    node: <Badge005 label="Смена" size="sm" />,
  },
  {
    name: "badge-006",
    title: "Плашка этапа",
    notes: ["Стадия: draft", "Подпись: Подпись: тест"],
    node: <Badge006 stage="draft" label="Подпись: тест" />,
  },
  {
    name: "badge-007",
    title: "Плашка динамики",
    notes: ["Изменение: 58", "Хорошо, когда: down", "Период: Смена"],
    node: <Badge007 value={58} goodDirection="down" period="Смена" />,
  },
  {
    name: "badge-008",
    title: "Плашка версии",
    notes: ["Версия: Смена", "Канал: stable"],
    node: <Badge008 version="Смена" channel="stable" />,
  },
  {
    name: "badge-009",
    title: "Строка тегов",
    notes: ["Видимых: 6", "Название группы: Подпись: тест"],
    node: <Badge009 visible={6} label="Подпись: тест" />,
  },
  {
    name: "badge-010",
    title: "Плашка приоритета",
    notes: ["Уровень: 4", "Подпись: Черновик", "Ступеней: 2"],
    node: <Badge010 level={4} label="Черновик" total={2} />,
  },
  {
    name: "badge-011",
    title: "Чипы фильтров",
    notes: ["Акцент: #72b988"],
    node: <Badge011 accent="#72b988" />,
  },
  {
    name: "badge-012",
    title: "Плашка «в работе»",
    notes: ["Действие: Черновик", "Оценка: Что дальше", "Акцент: #0ca7f5"],
    node: <Badge012 label="Черновик" hint="Что дальше" accent="#0ca7f5" />,
  },
  {
    name: "badge-013",
    title: "Плашка с иконкой",
    notes: ["Знак: clock", "Тон: neutral", "Подпись: Что дальше"],
    node: (
      <Badge013 icon="clock" tone="neutral">
        Что дальше
      </Badge013>
    ),
  },
  {
    name: "badge-014",
    title: "Контурная плашка",
    notes: ["Оттенок: 44", "Подпись: Подпись: тест", "Пунктир: false"],
    node: (
      <Badge014 hue={44} dashed={false}>
        Подпись: тест
      </Badge014>
    ),
  },
  {
    name: "badge-015",
    title: "Шкала размеров",
    notes: [
      "Размер: md",
      "Счётчик: 546",
      "Подпись: Черновик",
      "Акцент: #b0d92c",
    ],
    node: (
      <Badge015 size="md" count={546} accent="#b0d92c">
        Черновик
      </Badge015>
    ),
  },
  {
    name: "badge-016",
    title: "Плашка-ссылка",
    notes: [
      "Адрес: Черновик",
      "Подпись: Черновик",
      "Подпись про вкладку: Смена",
      "Акцент: #be1ca1",
    ],
    node: (
      <Badge016 href="Черновик" hint="Смена" accent="#be1ca1">
        Черновик
      </Badge016>
    ),
  },
  {
    name: "badge-017",
    title: "Пульс новинки",
    notes: ["Тон: accent", "Колец: 1", "Подпись: Проверка"],
    node: (
      <Badge017 tone="accent" waves={1}>
        Проверка
      </Badge017>
    ),
  },
  {
    name: "badge-018",
    title: "Плашка в углу",
    notes: [
      "Значение: 42",
      "Угол: bottom-right",
      "Подпись для скринридера: Что дальше",
      "Подпись хоста: Ня",
    ],
    node: (
      <Badge018
        content="42"
        position="bottom-right"
        label="Что дальше"
        hostLabel="Ня"
      />
    ),
  },
  {
    name: "badge-019",
    title: "Плашка тарифа",
    notes: ["Тариф: business", "Подпись: 42"],
    node: <Badge019 plan="business" label="42" />,
  },
  {
    name: "badge-020",
    title: "Плашка срока",
    notes: ["Дней осталось: 20", "Порог тревоги: 39", "Локаль: ru"],
    node: <Badge020 days={20} warnAt={39} locale="ru" />,
  },
  {
    name: "badge-021",
    title: "Плашка окружения",
    notes: ["Окружение: prod", "Подпись: Ня"],
    node: <Badge021 env="prod" label="Ня" />,
  },
  {
    name: "badge-022",
    title: "Составной счётчик",
    notes: [
      "Новых: 145",
      "Всего: 542",
      "Порог: 61",
      "Доступное имя: Смена",
      "Акцент: #2a1672",
    ],
    node: (
      <Badge022
        unread={145}
        total={542}
        max={61}
        labelText="Смена"
        accent="#2a1672"
      />
    ),
  },
  {
    name: "badge-023",
    title: "Плашка с обрезкой",
    notes: ["Ширина, знаков: 34", "Обрезка: end", "Текст: Что дальше"],
    node: (
      <Badge023 width={34} truncate="end">
        Что дальше
      </Badge023>
    ),
  },
  {
    name: "badge-024",
    title: "Группа с переполнением",
    notes: [
      "Видимых: 4",
      "Название группы: Что дальше",
      "Подпись хвоста: Подпись: тест",
      "Свернуть: Черновик",
      "Акцент: #5347f1",
    ],
    node: (
      <Badge024
        visible={4}
        label="Что дальше"
        moreLabel="Подпись: тест"
        lessText="Черновик"
        accent="#5347f1"
      />
    ),
  },
  {
    name: "badge-025",
    title: "Плашка «ключ — значение»",
    notes: ["Ключ: Что дальше", "Значение: Смена", "Тон ключа: #abab59"],
    node: <Badge025 label="Что дальше" value="Смена" accent="#abab59" />,
  },
]
