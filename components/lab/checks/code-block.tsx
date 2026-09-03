import type { LabCheck } from "@/components/lab/check-types"

import { Codeblock001 } from "@/registry/components/code-block/codeblock-001/codeblock-001"
import { Codeblock002 } from "@/registry/components/code-block/codeblock-002/codeblock-002"
import { Codeblock003 } from "@/registry/components/code-block/codeblock-003/codeblock-003"
import { Codeblock004 } from "@/registry/components/code-block/codeblock-004/codeblock-004"
import { Codeblock005 } from "@/registry/components/code-block/codeblock-005/codeblock-005"
import { Codeblock006 } from "@/registry/components/code-block/codeblock-006/codeblock-006"
import { Codeblock007 } from "@/registry/components/code-block/codeblock-007/codeblock-007"
import { Codeblock008 } from "@/registry/components/code-block/codeblock-008/codeblock-008"
import { Codeblock009 } from "@/registry/components/code-block/codeblock-009/codeblock-009"
import { Codeblock010 } from "@/registry/components/code-block/codeblock-010/codeblock-010"
import { Codeblock011 } from "@/registry/components/code-block/codeblock-011/codeblock-011"
import { Codeblock012 } from "@/registry/components/code-block/codeblock-012/codeblock-012"
import { Codeblock013 } from "@/registry/components/code-block/codeblock-013/codeblock-013"
import { Codeblock014 } from "@/registry/components/code-block/codeblock-014/codeblock-014"
import { Codeblock015 } from "@/registry/components/code-block/codeblock-015/codeblock-015"
import { Codeblock016 } from "@/registry/components/code-block/codeblock-016/codeblock-016"
import { Codeblock017 } from "@/registry/components/code-block/codeblock-017/codeblock-017"
import { Codeblock018 } from "@/registry/components/code-block/codeblock-018/codeblock-018"
import { Codeblock019 } from "@/registry/components/code-block/codeblock-019/codeblock-019"
import { Codeblock020 } from "@/registry/components/code-block/codeblock-020/codeblock-020"
import { Codeblock021 } from "@/registry/components/code-block/codeblock-021/codeblock-021"
import { Codeblock022 } from "@/registry/components/code-block/codeblock-022/codeblock-022"
import { Codeblock023 } from "@/registry/components/code-block/codeblock-023/codeblock-023"
import { Codeblock024 } from "@/registry/components/code-block/codeblock-024/codeblock-024"
import { Codeblock025 } from "@/registry/components/code-block/codeblock-025/codeblock-025"
import { Codeblock026 } from "@/registry/components/code-block/codeblock-026/codeblock-026"
import { Codeblock027 } from "@/registry/components/code-block/codeblock-027/codeblock-027"
import { Codeblock028 } from "@/registry/components/code-block/codeblock-028/codeblock-028"
import { Codeblock029 } from "@/registry/components/code-block/codeblock-029/codeblock-029"
import { Codeblock030 } from "@/registry/components/code-block/codeblock-030/codeblock-030"
import { Code001 } from "@/registry/components/code-block/code-001/code-001"

const JSON_SAMPLE = `{
  "base": "https://api.vibeui.ru/v1",
  "retries": 3,
  "cache": true
}`

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 92189

export const CHECKS: LabCheck[] = [
  {
    name: "codeblock-001",
    title: "Нумерованные строки",
    notes: [
      "Файл: Что дальше",
      "Первый номер: 744",
      "Счётчик строк: Что дальше",
    ],
    node: (
      <Codeblock001 title="Что дальше" start={744} countText="Что дальше" />
    ),
  },
  {
    name: "codeblock-002",
    title: "Копирование с таймером",
    notes: [
      "Подпись кнопки: Смена",
      "Подпись после копирования: Подпись: тест",
      "Откат, мс: 3854",
    ],
    node: (
      <Codeblock002 label="Смена" doneLabel="Подпись: тест" resetDelay={3854} />
    ),
  },
  {
    name: "codeblock-003",
    title: "Вкладки менеджеров",
    notes: [
      "Пакет: Проверка",
      "Имя радиогруппы: Подпись: тест",
      "Подпись группы: Смена",
    ],
    node: (
      <Codeblock003
        packageName="Проверка"
        group="Подпись: тест"
        groupLabel="Смена"
      />
    ),
  },
  {
    name: "codeblock-004",
    title: "Строка приглашения",
    notes: [
      "Команда: Смена",
      "Приглашение: #",
      "Каталог: Проверка",
      "Ветка: Ня",
    ],
    node: (
      <Codeblock004 command="Смена" prompt="#" cwd="Проверка" branch="Ня" />
    ),
  },
  {
    name: "codeblock-005",
    title: "Строки различий",
    notes: ["Файл: Подпись: тест", "Счётчики: false"],
    node: <Codeblock005 path="Подпись: тест" showStats={false} />,
  },
  {
    name: "codeblock-006",
    title: "Свёрнутый файл",
    notes: [
      "Файл: Подпись: тест",
      "Видимых строк: 38",
      "Подпись раскрытия: Проверка",
      "Подпись сворачивания: Что дальше",
    ],
    node: (
      <Codeblock006
        path="Подпись: тест"
        visibleCount={38}
        moreText="Проверка"
        lessText="Что дальше"
      />
    ),
  },
  {
    name: "codeblock-007",
    title: "Диапазон ошибки",
    notes: [
      "Файл: Смена",
      "Текст ошибки: Черновик",
      "Первая строка: 764",
      "Последняя строка: 901",
      "Подпись диапазона: Подпись: тест",
    ],
    node: (
      <Codeblock007
        path="Смена"
        message="Черновик"
        errorFrom={764}
        errorTo={901}
        rangeText="Подпись: тест"
      />
    ),
  },
  {
    name: "codeblock-008",
    title: "Переключатель переноса",
    notes: [
      "Файл: Проверка",
      "Подпись переключателя: Подпись: тест",
      "Перенос сразу: false",
    ],
    node: (
      <Codeblock008
        title="Проверка"
        label="Подпись: тест"
        wrapByDefault={false}
      />
    ),
  },
  {
    name: "codeblock-009",
    title: "Шапка с путём файла",
    notes: ["Путь: Черновик", "Статус: Проверка", "Подпись пути: Что дальше"],
    node: (
      <Codeblock009 path="Черновик" status="Проверка" pathLabel="Что дальше" />
    ),
  },
  {
    name: "codeblock-010",
    title: "Код в строке",
    notes: [
      "Заголовок: Черновик",
      "Команда: Черновик",
      "Путь: Что дальше",
      "Клавиши: Черновик",
    ],
    node: (
      <Codeblock010
        heading="Черновик"
        command="Черновик"
        file="Что дальше"
        shortcut="Черновик"
      />
    ),
  },
  {
    name: "codeblock-011",
    title: "Подсказка прокрутки",
    notes: ["Файл: Смена", "Подсказка: Смена", "Подпись области: Черновик"],
    node: <Codeblock011 title="Смена" hint="Смена" codeLabel="Черновик" />,
  },
  {
    name: "codeblock-012",
    title: "Вывод команды",
    notes: ["Команда: Проверка", "Код возврата: 56", "Длительность: Смена"],
    node: <Codeblock012 command="Проверка" exitCode={56} duration="Смена" />,
  },
  {
    name: "codeblock-013",
    title: "Копирование построчно",
    notes: ["Заголовок: Что дальше", "Номера строк: false"],
    node: <Codeblock013 title="Что дальше" showNumbers={false} />,
  },
  {
    name: "codeblock-014",
    title: "Скелетон кода",
    notes: ["Строк: 31", "Подпись загрузки: Что дальше"],
    node: <Codeblock014 rows={31} label="Что дальше" />,
  },
  {
    name: "codeblock-015",
    title: "Вкладки дерева файлов",
    notes: ["Каталог: Черновик", "Открытый файл: 1"],
    node: <Codeblock015 root="Черновик" activeIndex={1} />,
  },
  {
    name: "codeblock-016",
    title: "Сегменты языков",
    notes: ["Заголовок: Подпись: тест", "Язык по умолчанию: JavaScript"],
    node: <Codeblock016 title="Подпись: тест" defaultLanguage="JavaScript" />,
  },
  {
    name: "codeblock-017",
    title: "Изменённая строка",
    notes: ["Файл: Подпись: тест", "Изменённая строка: 1"],
    node: <Codeblock017 path="Подпись: тест" changedLine={1} />,
  },
  {
    name: "codeblock-018",
    title: "Выноски к строкам",
    notes: ["Файл: Черновик", "Легенда: true"],
    node: <Codeblock018 path="Черновик" showLegend={true} />,
  },
  {
    name: "codeblock-019",
    title: "Оглавление листинга",
    notes: ["Файл: Что дальше", "Высота, rem: 12"],
    node: <Codeblock019 path="Что дальше" maxHeight={12} />,
  },
  {
    name: "codeblock-020",
    title: "Отметка версии",
    notes: ["Версия: Проверка", "Устарело: false"],
    node: <Codeblock020 version="Проверка" stale={false} />,
  },
  {
    name: "codeblock-021",
    title: "Дерево JSON",
    notes: ["Имя ответа: Подпись: тест", "Глубина раскрытия: 1"],
    node: <Codeblock021 rootLabel="Подпись: тест" openDepth={1} />,
  },
  {
    name: "codeblock-022",
    title: "Скрытые переменные",
    notes: ["Файл: Смена", "Показать всё: false"],
    node: <Codeblock022 file="Смена" revealAll={false} />,
  },
  {
    name: "codeblock-023",
    title: "Копирование без приглашения",
    notes: ["Заголовок: Черновик", "Подпись кнопки: Смена"],
    node: <Codeblock023 title="Черновик" label="Смена" />,
  },
  {
    name: "codeblock-024",
    title: "Сравнение в две колонки",
    notes: ["Файл: Черновик", "Левая панель: 42", "Правая панель: Черновик"],
    node: (
      <Codeblock024 path="Черновик" beforeLabel="42" afterLabel="Черновик" />
    ),
  },
  {
    name: "codeblock-025",
    title: "Ограничение высоты",
    notes: [
      "Файл: Что дальше",
      "Высота свёрнутого, rem: 11",
      "Предел раскрытия, rem: 40",
      "Подпись «развернуть»: Смена",
      "Подпись «свернуть»: Что дальше",
    ],
    node: (
      <Codeblock025
        path="Что дальше"
        collapsedHeight={11}
        expandedHeight={40}
        expandText="Смена"
        collapseText="Что дальше"
      />
    ),
  },
  {
    name: "codeblock-026",
    title: "Файл только для чтения",
    notes: [
      "Файл: Черновик",
      "Причина запрета: Что дальше",
      "Где править вместо него: Черновик",
      "Подпись значка: Что дальше",
    ],
    node: (
      <Codeblock026
        path="Черновик"
        reason="Что дальше"
        editInstead="Черновик"
        badgeText="Что дальше"
      />
    ),
  },
  {
    name: "codeblock-027",
    title: "Трассировка выполнения",
    notes: [
      "Тип ошибки: Проверка",
      "Текст ошибки: Что дальше",
      "Подпись свёртки: Смена",
      "Оттенок ошибки: #b9f1d4",
    ],
    node: (
      <Codeblock027
        errorName="Проверка"
        message="Что дальше"
        vendorLabel="Смена"
        accent="#b9f1d4"
      />
    ),
  },
  {
    name: "code-001",
    title: "Блок кода",
    notes: [
      "Путь к файлу: config/api.json",
      "Язык: json",
      "Номера строк: выключены",
      "Переносить строки: включено",
    ],
    node: (
      <Code001
        title="config/api.json"
        language="json"
        showNumbers={false}
        wrap
        code={JSON_SAMPLE}
      />
    ),
  },
  {
    name: "codeblock-028",
    title: "Результат и код",
    notes: [
      "Путь к файлу: examples/badge.tsx",
      "Вкладка результата: Живьём",
      "Вкладка кода: Исходник",
      "Сразу код: включено",
    ],
    node: (
      <Codeblock028
        title="examples/badge.tsx"
        resultLabel="Живьём"
        codeLabel="Исходник"
        codeFirst
        group="lab-codeblock-028"
        code={'<Badge tone="warning">Черновик</Badge>'}
      />
    ),
  },
  {
    name: "codeblock-029",
    title: "Команда с подстановкой",
    notes: [
      "Заголовок: Отправка события",
      "Подпись кнопки: Взять строку",
      "Счётчик незаполненного: Не заполнено: {count}",
    ],
    node: (
      <Codeblock029
        title="Отправка события"
        copyText="Взять строку"
        copiedText="В буфере"
        leftTemplate="Не заполнено: {count}"
      />
    ),
  },
  {
    name: "codeblock-030",
    title: "Журнал с уровнями",
    notes: ["Имя файла: logs/worker.log", "Высота окна: 9rem"],
    node: (
      <Codeblock030
        title="logs/worker.log"
        maxHeight={9}
        group="lab-codeblock-030"
      />
    ),
  },
]