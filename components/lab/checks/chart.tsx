import type { LabCheck } from "@/components/lab/check-types"

import { Chart001 } from "@/registry/components/chart/chart-001/chart-001"
import { Chart002 } from "@/registry/components/chart/chart-002/chart-002"
import { Chart003 } from "@/registry/components/chart/chart-003/chart-003"
import { Chart004 } from "@/registry/components/chart/chart-004/chart-004"
import { Chart005 } from "@/registry/components/chart/chart-005/chart-005"
import { Chart006 } from "@/registry/components/chart/chart-006/chart-006"
import { Chart007 } from "@/registry/components/chart/chart-007/chart-007"
import { Chart008 } from "@/registry/components/chart/chart-008/chart-008"
import { Chart009 } from "@/registry/components/chart/chart-009/chart-009"
import { Chart010 } from "@/registry/components/chart/chart-010/chart-010"
import { Chart011 } from "@/registry/components/chart/chart-011/chart-011"
import { Chart012 } from "@/registry/components/chart/chart-012/chart-012"
import { Chart013 } from "@/registry/components/chart/chart-013/chart-013"
import { Chart014 } from "@/registry/components/chart/chart-014/chart-014"
import { Chart015 } from "@/registry/components/chart/chart-015/chart-015"
import { Chart016 } from "@/registry/components/chart/chart-016/chart-016"
import { Chart017 } from "@/registry/components/chart/chart-017/chart-017"
import { Chart018 } from "@/registry/components/chart/chart-018/chart-018"
import { Chart019 } from "@/registry/components/chart/chart-019/chart-019"
import { Chart020 } from "@/registry/components/chart/chart-020/chart-020"
import { Chart021 } from "@/registry/components/chart/chart-021/chart-021"
import { Chart022 } from "@/registry/components/chart/chart-022/chart-022"
import { Chart023 } from "@/registry/components/chart/chart-023/chart-023"
import { Chart024 } from "@/registry/components/chart/chart-024/chart-024"
import { Chart025 } from "@/registry/components/chart/chart-025/chart-025"
import { Chart026 } from "@/registry/components/chart/chart-026/chart-026"
import { Chart027 } from "@/registry/components/chart/chart-027/chart-027"
import { Chart028 } from "@/registry/components/chart/chart-028/chart-028"
import { Chart029 } from "@/registry/components/chart/chart-029/chart-029"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "chart-001",
    title: "Линейный график",
    notes: [
      "Заголовок: Подпись: тест",
      "Единица: Подпись: тест",
      "Отметить пик: true",
      "Акцент: #e1948b",
    ],
    node: (
      <Chart001
        title="Подпись: тест"
        unit="Подпись: тест"
        markPeak={true}
        accent="#e1948b"
      />
    ),
  },
  {
    name: "chart-002",
    title: "Столбчатый график",
    notes: [
      "Заголовок: Подпись: тест",
      "Единица: Проверка",
      "Значения: true",
      "Акцент: #0e45a3",
    ],
    node: (
      <Chart002
        title="Подпись: тест"
        unit="Проверка"
        showValues={true}
        accent="#0e45a3"
      />
    ),
  },
  {
    name: "chart-003",
    title: "Кольцевая диаграмма",
    notes: [
      "Заголовок: Что дальше",
      "Единица: Подпись: тест",
      "Акцент: #09f876",
    ],
    node: <Chart003 title="Что дальше" unit="Подпись: тест" accent="#09f876" />,
  },
  {
    name: "chart-004",
    title: "Полосы рейтинга",
    notes: ["Заголовок: Подпись: тест", "Единица: Смена", "Акцент: #af002f"],
    node: <Chart004 title="Подпись: тест" unit="Смена" accent="#af002f" />,
  },
  {
    name: "chart-005",
    title: "Столбцы с накоплением",
    notes: ["Заголовок: Проверка", "Итог: Черновик", "Акцент: #92de12"],
    node: <Chart005 title="Проверка" total="Черновик" accent="#92de12" />,
  },
  {
    name: "chart-006",
    title: "График с заливкой",
    notes: ["Заголовок: Проверка", "Единица: Черновик", "Акцент: #fbba3e"],
    node: <Chart006 title="Проверка" unit="Черновик" accent="#fbba3e" />,
  },
  {
    name: "chart-007",
    title: "Спидометр",
    notes: [
      "Значение: 5",
      "Цель: 66",
      "Заголовок: Что дальше",
      "Акцент: #0fbb47",
    ],
    node: (
      <Chart007 value={5} target={66} title="Что дальше" accent="#0fbb47" />
    ),
  },
  {
    name: "chart-008",
    title: "Воронка",
    notes: ["Заголовок: Проверка", "Единица: Черновик", "Акцент: #948bac"],
    node: <Chart008 title="Проверка" unit="Черновик" accent="#948bac" />,
  },
  {
    name: "chart-009",
    title: "Полосы сравнения",
    notes: [
      "Заголовок: Проверка",
      "Текущий период: Смена",
      "Прошлый период: Черновик",
      "Акцент: #7fcf2e",
    ],
    node: (
      <Chart009
        title="Проверка"
        nowLabel="Смена"
        beforeLabel="Черновик"
        accent="#7fcf2e"
      />
    ),
  },
  {
    name: "chart-010",
    title: "Колонки с осью",
    notes: ["Заголовок: Проверка", "Единица: Проверка", "Акцент: #1f7e4d"],
    node: <Chart010 title="Проверка" unit="Проверка" accent="#1f7e4d" />,
  },
  {
    name: "chart-011",
    title: "Тренд пунктиром",
    notes: ["Заголовок: Проверка", "Единица: Проверка", "Акцент: #1849ec"],
    node: <Chart011 title="Проверка" unit="Проверка" accent="#1849ec" />,
  },
  {
    name: "chart-012",
    title: "Градиентная заливка",
    notes: [
      "Заголовок: Проверка",
      "Единица: Черновик",
      "Среднее: true",
      "Акцент: #6e9eae",
    ],
    node: (
      <Chart012
        title="Проверка"
        unit="Черновик"
        showAverage={true}
        accent="#6e9eae"
      />
    ),
  },
  {
    name: "chart-013",
    title: "Кольцо с итогом",
    notes: [
      "Заголовок: Подпись: тест",
      "Подпись в центре: Смена",
      "Единица: Проверка",
      "Акцент: #b1032a",
    ],
    node: (
      <Chart013
        title="Подпись: тест"
        centerLabel="Смена"
        unit="Проверка"
        accent="#b1032a"
      />
    ),
  },
  {
    name: "chart-014",
    title: "Спидометр с зонами",
    notes: [
      "Значение: 9",
      "Заголовок: Проверка",
      "Единица: Черновик",
      "Акцент: #3c77b3",
    ],
    node: (
      <Chart014 value={9} title="Проверка" unit="Черновик" accent="#3c77b3" />
    ),
  },
  {
    name: "chart-015",
    title: "Колонки с накоплением",
    notes: [
      "Заголовок: Подпись: тест",
      "Единица: Что дальше",
      "Акцент: #e05347",
    ],
    node: <Chart015 title="Подпись: тест" unit="Что дальше" accent="#e05347" />,
  },
  {
    name: "chart-016",
    title: "План против факта",
    notes: [
      "Заголовок: Что дальше",
      "Единица: Подпись: тест",
      "Запас шкалы: 1",
      "Акцент: #abab59",
    ],
    node: (
      <Chart016
        title="Что дальше"
        unit="Подпись: тест"
        scaleMax={1}
        accent="#abab59"
      />
    ),
  },
  {
    name: "chart-017",
    title: "Воронка конверсии",
    notes: ["Заголовок: Черновик", "Единица: Проверка", "Акцент: #338a73"],
    node: <Chart017 title="Черновик" unit="Проверка" accent="#338a73" />,
  },
  {
    name: "chart-018",
    title: "Каскадный график",
    notes: ["Заголовок: Подпись: тест", "Единица: Смена", "Акцент: #f75473"],
    node: <Chart018 title="Подпись: тест" unit="Смена" accent="#f75473" />,
  },
  {
    name: "chart-019",
    title: "Диаграмма рассеяния",
    notes: ["Ось X: Подпись: тест", "Ось Y: Смена", "Акцент: #5ae1c4"],
    node: <Chart019 xLabel="Подпись: тест" yLabel="Смена" accent="#5ae1c4" />,
  },
  {
    name: "chart-020",
    title: "Радиальные показатели",
    notes: ["Заголовок: Черновик", "Единица: Черновик", "Акцент: #5c3465"],
    node: <Chart020 title="Черновик" unit="Черновик" accent="#5c3465" />,
  },
  {
    name: "chart-021",
    title: "Тепловая карта активности",
    notes: ["Заголовок: Что дальше", "Единица: Что дальше", "Акцент: #c8b372"],
    node: <Chart021 title="Что дальше" unit="Что дальше" accent="#c8b372" />,
  },
  {
    name: "chart-022",
    title: "Движение в рейтинге",
    notes: [
      "Заголовок: Смена",
      "Единица: Смена",
      "Движение: true",
      "Акцент: #4ccab2",
    ],
    node: (
      <Chart022 title="Смена" unit="Смена" showMoves={true} accent="#4ccab2" />
    ),
  },
  {
    name: "chart-023",
    title: "Сужающаяся воронка",
    notes: ["Заголовок: Проверка", "Единица: Что дальше", "Акцент: #00475d"],
    node: <Chart023 title="Проверка" unit="Что дальше" accent="#00475d" />,
  },
  {
    name: "chart-024",
    title: "Мост бюджета",
    notes: ["Заголовок: Черновик", "Единица: Черновик", "Акцент: #c05e6b"],
    node: <Chart024 title="Черновик" unit="Черновик" accent="#c05e6b" />,
  },
  {
    name: "chart-025",
    title: "Карта по часам",
    notes: ["Заголовок: Проверка", "Единица: Проверка", "Акцент: #6fd40e"],
    node: <Chart025 title="Проверка" unit="Проверка" accent="#6fd40e" />,
  },
  {
    name: "chart-026",
    title: "Строки со спарклайнами",
    notes: ["Заголовок: Проверка", "Рост — это хорошо: false", "Акцент: #1f7a5c"],
    node: <Chart026 title="Проверка" riseIsGood={false} accent="#1f7a5c" />,
  },
  {
    name: "chart-027",
    title: "Паутина",
    notes: ["Заголовок: Черновик", "Подпись контура: Черновик", "Акцент: #7a3fd4"],
    node: (
      <Chart027 title="Черновик" seriesLabel="Черновик" accent="#7a3fd4" />
    ),
  },
  {
    name: "chart-028",
    title: "Столбцы и линия",
    notes: ["Заголовок: Проверка", "Подпись линии: Доля", "Знак: ‰"],
    node: (
      <Chart028
        title="Проверка"
        lineLabel="Доля"
        lineSuffix="‰"
        accent="#d4643f"
      />
    ),
  },
  {
    name: "chart-029",
    title: "Лента активности",
    notes: ["Заголовок: Черновик", "Подписи шкалы: мало / много", "Акцент: #2f6df6"],
    node: (
      <Chart029
        title="Черновик"
        lessLabel="мало"
        moreLabel="много"
        accent="#2f6df6"
      />
    ),
  },
]
