import type { LabCheck } from "@/components/lab/check-types"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Button002 } from "@/registry/components/button/button-002/button-002"
import { Button003 } from "@/registry/components/button/button-003/button-003"
import { Button004 } from "@/registry/components/button/button-004/button-004"
import { Button005 } from "@/registry/components/button/button-005/button-005"
import { Button006 } from "@/registry/components/button/button-006/button-006"
import { Button007 } from "@/registry/components/button/button-007/button-007"
import { Button008 } from "@/registry/components/button/button-008/button-008"
import { Button009 } from "@/registry/components/button/button-009/button-009"
import { Button010 } from "@/registry/components/button/button-010/button-010"
import { Button011 } from "@/registry/components/button/button-011/button-011"
import { Button012 } from "@/registry/components/button/button-012/button-012"
import { Button013 } from "@/registry/components/button/button-013/button-013"
import { Button014 } from "@/registry/components/button/button-014/button-014"
import { Button015 } from "@/registry/components/button/button-015/button-015"
import { Button016 } from "@/registry/components/button/button-016/button-016"
import { Button017 } from "@/registry/components/button/button-017/button-017"
import { Button018 } from "@/registry/components/button/button-018/button-018"
import { Button019 } from "@/registry/components/button/button-019/button-019"
import { Button020 } from "@/registry/components/button/button-020/button-020"
import { Button021 } from "@/registry/components/button/button-021/button-021"
import { Button022 } from "@/registry/components/button/button-022/button-022"
import { Button023 } from "@/registry/components/button/button-023/button-023"
import { Button024 } from "@/registry/components/button/button-024/button-024"
import { Button025 } from "@/registry/components/button/button-025/button-025"
import { Button026 } from "@/registry/components/button/button-026/button-026"
import { Button027 } from "@/registry/components/button/button-027/button-027"
import { Button028 } from "@/registry/components/button/button-028/button-028"
import { Button029 } from "@/registry/components/button/button-029/button-029"
import { Button030 } from "@/registry/components/button/button-030/button-030"
import { Button031 } from "@/registry/components/button/button-031/button-031"
import { Button032 } from "@/registry/components/button/button-032/button-032"
import { Button033 } from "@/registry/components/button/button-033/button-033"
import { Button034 } from "@/registry/components/button/button-034/button-034"
import { Button035 } from "@/registry/components/button/button-035/button-035"
import { Button036 } from "@/registry/components/button/button-036/button-036"
import { Button037 } from "@/registry/components/button/button-037/button-037"
import { Button038 } from "@/registry/components/button/button-038/button-038"
import { Button039 } from "@/registry/components/button/button-039/button-039"
import { Button040 } from "@/registry/components/button/button-040/button-040"
import { Button041 } from "@/registry/components/button/button-041/button-041"
import { Button042 } from "@/registry/components/button/button-042/button-042"
import { Button043 } from "@/registry/components/button/button-043/button-043"
import { Button044 } from "@/registry/components/button/button-044/button-044"
import { Button045 } from "@/registry/components/button/button-045/button-045"
import { Button046 } from "@/registry/components/button/button-046/button-046"
import { Button047 } from "@/registry/components/button/button-047/button-047"
import { Button048 } from "@/registry/components/button/button-048/button-048"
import { Button049 } from "@/registry/components/button/button-049/button-049"
import { Button050 } from "@/registry/components/button/button-050/button-050"
import { Button051 } from "@/registry/components/button/button-051/button-051"
import { Button052 } from "@/registry/components/button/button-052/button-052"
import { Button053 } from "@/registry/components/button/button-053/button-053"
import { Button054 } from "@/registry/components/button/button-054/button-054"
import { Button055 } from "@/registry/components/button/button-055/button-055"
import { Button056 } from "@/registry/components/button/button-056/button-056"
import { Button057 } from "@/registry/components/button/button-057/button-057"
import { Button058 } from "@/registry/components/button/button-058/button-058"
import { Button059 } from "@/registry/components/button/button-059/button-059"
import { Button060 } from "@/registry/components/button/button-060/button-060"
import { Button061 } from "@/registry/components/button/button-061/button-061"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 60513

export const CHECKS: LabCheck[] = [
  {
    name: "button-001",
    title: "Кнопка действия",
    notes: [
      "Подпись: Смена",
      "Тон: soft",
      "Размер: md",
      "Загрузка: true",
      "Акцент: #f7a319",
      "Цвет подписи: #140747",
    ],
    node: (
      <Button001
        tone="soft"
        size="md"
        loading={true}
        accent="#f7a319"
        accentForeground="#140747"
      >
        Смена
      </Button001>
    ),
  },
  {
    name: "button-002",
    title: "Кнопка с раздельным меню",
    notes: [
      "Подпись: Что дальше",
      "Подпись второй зоны: Что дальше",
      "Акцент: #7daa3a",
      "Цвет подписи: #0ad7f6",
    ],
    node: (
      <Button002
        menuLabel="Что дальше"
        accent="#7daa3a"
        accentForeground="#0ad7f6"
      >
        Что дальше
      </Button002>
    ),
  },
  {
    name: "button-003",
    title: "Притягивающаяся кнопка",
    notes: ["Подпись: Смена", "Акцент: #12550d", "Цвет подписи: #ef2254"],
    node: (
      <Button003 accent="#12550d" accentForeground="#ef2254">
        Смена
      </Button003>
    ),
  },
  {
    name: "button-004",
    title: "Тихая второстепенная кнопка",
    notes: ["Подпись: Смена", "Точка-маркер: false", "Цвет маркера: #78d5af"],
    node: (
      <Button004 marker={false} tint="#78d5af">
        Смена
      </Button004>
    ),
  },
  {
    name: "button-005",
    title: "Кнопка подтверждения",
    notes: [
      "Подпись: Подпись: тест",
      "Подпись подтверждения: Что дальше",
      "Окно подтверждения, мс: 6213",
      "Акцент: #7542d4",
    ],
    node: (
      <Button005 confirmLabel="Что дальше" timeout={6213} accent="#7542d4">
        Подпись: тест
      </Button005>
    ),
  },
  {
    name: "button-006",
    title: "Кнопка опасного действия",
    notes: ["Подпись: Проверка", "Цвет опасности: #43400a"],
    node: <Button006 danger="#43400a">Проверка</Button006>,
  },
  {
    name: "button-007",
    title: "Кнопка с социальным доводом",
    notes: [
      "Подпись: Проверка",
      "Строка количества: Смена",
      "Цвет аватаров: #8ec4f3",
    ],
    node: (
      <Button007 hint="Смена" accent="#8ec4f3">
        Проверка
      </Button007>
    ),
  },
  {
    name: "button-008",
    title: "Командная кнопка",
    notes: ["Подпись: Проверка", "Цвет клавиш: #d6107b"],
    node: <Button008 accent="#d6107b">Проверка</Button008>,
  },
  {
    name: "button-009",
    title: "Кнопка-пилюля",
    notes: [
      "Подпись включено: Подпись: тест",
      "Подпись выключено: Проверка",
      "Включено по умолчанию: false",
      "Акцент: #80ac12",
    ],
    node: (
      <Button009
        onLabel="Подпись: тест"
        offLabel="Проверка"
        defaultPressed={false}
        accent="#80ac12"
      />
    ),
  },
  {
    name: "button-010",
    title: "Кнопка скачивания",
    notes: [
      "Подпись: Смена",
      "Статус: done",
      "Прогресс, %: 49",
      "Подпись загрузки: Что дальше",
      "Подпись завершения: Проверка",
      "Акцент: #5eb493",
    ],
    node: (
      <Button010
        status="done"
        progress={49}
        loadingLabel="Что дальше"
        doneLabel="Проверка"
        accent="#5eb493"
      >
        Смена
      </Button010>
    ),
  },
  {
    name: "button-011",
    title: "Кнопка-ссылка без оформления",
    notes: ["Подпись: Черновик", "Стрелка: true", "Акцент: #6d4392"],
    node: (
      <Button011 arrow={true} accent="#6d4392">
        Черновик
      </Button011>
    ),
  },
  {
    name: "button-012",
    title: "Кнопка-иконка",
    notes: [
      "Действие: Подпись: тест",
      "Значок: search",
      "Форма: square",
      "Размер: sm",
      "Тон: accent",
      "Акцент: #e7eeda",
    ],
    node: (
      <Button012
        label="Подпись: тест"
        icon="search"
        shape="square"
        size="sm"
        tone="accent"
        accent="#e7eeda"
      />
    ),
  },
  {
    name: "button-013",
    title: "Сегментированный переключатель",
    notes: ["Название группы: Черновик", "Акцент: #4838d3"],
    node: <Button013 label="Черновик" accent="#4838d3" />,
  },
  {
    name: "button-014",
    title: "Раскрывающаяся плавающая кнопка",
    notes: ["Действие: Что дальше", "Акцент: #28fbb0"],
    node: <Button014 label="Что дальше" accent="#28fbb0" />,
  },
  {
    name: "button-015",
    title: "Кнопка копирования",
    notes: [
      "Подпись: Подпись: тест",
      "После копирования: Проверка",
      "Держать, мс: 2325",
    ],
    node: <Button015 label="Подпись: тест" doneLabel="Проверка" hold={2325} />,
  },
  {
    name: "button-016",
    title: "Кнопка-ссылка",
    notes: [
      "Подпись: Подпись: тест",
      "Внешняя ссылка: false",
      "Тон: accent",
      "Акцент: #838a3c",
    ],
    node: (
      <Button016
        label="Подпись: тест"
        external={false}
        tone="accent"
        accent="#838a3c"
      />
    ),
  },
  {
    name: "button-017",
    title: "Отправка один раз",
    notes: [
      "Подпись: Проверка",
      "Во время работы: Черновик",
      "После успеха: Подпись: тест",
      "Акцент: #40814c",
    ],
    node: (
      <Button017
        label="Проверка"
        pendingLabel="Черновик"
        doneLabel="Подпись: тест"
        accent="#40814c"
      />
    ),
  },
  {
    name: "button-018",
    title: "Счётчик количества",
    notes: ["Значение: 0", "Максимум: 10", "Единица: Ок", "Акцент: #49138e"],
    node: <Button018 defaultValue={0} max={10} unit="Ок" accent="#49138e" />,
  },
  {
    name: "button-019",
    title: "Кнопка реакции",
    notes: [
      "Подпись: Проверка",
      "Счётчик: 5573",
      "Акцент: #1dc105",
      "Отмечено: true",
    ],
    node: (
      <Button019
        label="Проверка"
        count={5573}
        accent="#1dc105"
        defaultPressed={true}
      />
    ),
  },
  {
    name: "button-020",
    title: "Полоса оформления на телефоне",
    notes: [
      "Действие: Проверка",
      "Сумма: Что дальше",
      "Пояснение: Проверка",
      "Акцент: #0f2e3f",
    ],
    node: (
      <Button020
        label="Проверка"
        price="Что дальше"
        hint="Проверка"
        accent="#0f2e3f"
      />
    ),
  },
  {
    name: "button-021",
    title: "Кнопка повтора",
    notes: [
      "Подпись: Черновик",
      "Подпись во время работы: Подпись: тест",
      "Подпись после сбоя: Что дальше",
      "Подпись после успеха: Подпись: тест",
      "Акцент: #4dc9b6",
    ],
    node: (
      <Button021
        label="Черновик"
        pendingLabel="Подпись: тест"
        errorLabel="Что дальше"
        doneLabel="Подпись: тест"
        accent="#4dc9b6"
      />
    ),
  },
  {
    name: "button-022",
    title: "Подтверждение удержанием",
    notes: ["Подпись: Смена", "Удержание, мс: 3398", "Цвет опасности: #c2d37e"],
    node: <Button022 label="Смена" hold={3398} danger="#c2d37e" />,
  },
  {
    name: "button-023",
    title: "Поле с секретом",
    notes: [
      "Значение: Что дальше",
      "Подтверждение, мс: 784",
      "Акцент: #69adce",
    ],
    node: <Button023 value="Что дальше" hold={784} accent="#69adce" />,
  },
  {
    name: "button-024",
    title: "Выбор из трёх состояний",
    notes: [
      "Подпись: Смена",
      "Всего элементов: 2",
      "Отмечено: 8",
      "Акцент: #f15e62",
    ],
    node: (
      <Button024 label="Смена" total={2} defaultSelected={8} accent="#f15e62" />
    ),
  },
  {
    name: "button-025",
    title: "Кнопка с горячей клавишей",
    notes: ["Подпись: Смена", "Сочетание: Проверка", "Акцент: #243628"],
    node: <Button025 label="Смена" combo="Проверка" accent="#243628" />,
  },
  {
    name: "button-026",
    title: "Ссылка на файл",
    notes: [
      "Название файла: Смена",
      "Вес файла: Подпись: тест",
      "Акцент: #5b369b",
    ],
    node: <Button026 label="Смена" size="Подпись: тест" accent="#5b369b" />,
  },
  {
    name: "button-027",
    title: "Повтор с отсчётом",
    notes: [
      "Подпись: Подпись: тест",
      "Пауза, секунды: 158",
      "Подпись ожидания: Смена",
      "Акцент: #8a33b8",
    ],
    node: (
      <Button027
        label="Подпись: тест"
        seconds={158}
        waitingLabel="Смена"
        accent="#8a33b8"
      />
    ),
  },
  {
    name: "button-028",
    title: "Кнопка-иконка с подсказкой",
    notes: [
      "Имя действия: Проверка",
      "Значок: trash",
      "Сторона подсказки: bottom",
      "Акцент: #3ac582",
    ],
    node: (
      <Button028 label="Проверка" icon="trash" side="bottom" accent="#3ac582" />
    ),
  },
  {
    name: "button-029",
    title: "Действия в подвале формы",
    notes: [
      "Основное действие: Что дальше",
      "Мелкая строка: Смена",
      "Второе действие: Проверка",
      "Акцент: #7ad01e",
    ],
    node: (
      <Button029
        label="Что дальше"
        note="Смена"
        secondaryLabel="Проверка"
        accent="#7ad01e"
      />
    ),
  },
  {
    name: "button-030",
    title: "Кнопка со счётчиком",
    notes: [
      "Имя кнопки: Что дальше",
      "Счётчик: 59",
      "Порог «99+»: 873",
      "Имя для скринридера: Подпись: тест",
      "Цвет бейджа: #e0ef6a",
    ],
    node: (
      <Button030
        label="Что дальше"
        count={59}
        cap={873}
        unreadText="Подпись: тест"
        badge="#e0ef6a"
      />
    ),
  },
  {
    name: "button-031",
    title: "Кнопка выбора файла",
    notes: [
      "Подпись: Смена",
      "Ограничения: Черновик",
      "Разрешённые форматы: Что дальше",
      "Подпись сброса: Черновик",
      "Акцент: #636dfb",
    ],
    node: (
      <Button031
        label="Смена"
        hint="Черновик"
        accept="Что дальше"
        resetLabel="Черновик"
        accent="#636dfb"
      />
    ),
  },
  {
    name: "button-032",
    title: "Кнопка меню действий",
    notes: [
      "Имя кнопки: Подпись: тест",
      "Выравнивание: start",
      "Опасный пункт: Что дальше",
      "Акцент: #b9668d",
    ],
    node: (
      <Button032
        label="Подпись: тест"
        align="start"
        dangerLabel="Что дальше"
        accent="#b9668d"
      />
    ),
  },
  {
    name: "button-033",
    title: "Призрачная кнопка",
    notes: [
      "Подпись: Проверка",
      "Активна: true",
      "Акцент: #c95a01",
      "Выключена: true",
    ],
    node: (
      <Button033 active={true} accent="#c95a01" disabled={true}>
        Проверка
      </Button033>
    ),
  },
  {
    name: "button-034",
    title: "Контурная кнопка",
    notes: ["Подпись: Черновик", "Толщина контура: heavy", "Акцент: #688114"],
    node: (
      <Button034 emphasis="heavy" accent="#688114">
        Черновик
      </Button034>
    ),
  },
  {
    name: "button-035",
    title: "Ссылка внутри текста",
    notes: [
      "Подпись: Что дальше",
      "Текст до: Подпись: тест",
      "Акцент: #4d093f",
      "Текст после: Подпись: тест",
    ],
    node: (
      <Button035 before="Подпись: тест" accent="#4d093f" after="Подпись: тест">
        Что дальше
      </Button035>
    ),
  },
  {
    name: "button-036",
    title: "Кнопка с двумя иконками",
    notes: [
      "Подпись: Смена",
      "Значок слева: search",
      "Значок справа: none",
      "Акцент: #21839d",
    ],
    node: (
      <Button036 leading="search" trailing="none" accent="#21839d">
        Смена
      </Button036>
    ),
  },
  {
    name: "button-037",
    title: "Плавающая кнопка с веером",
    notes: ["Имя кнопки: Черновик", "Раскрыта: true", "Акцент: #3ed95a"],
    node: <Button037 label="Черновик" defaultOpen={true} accent="#3ed95a" />,
  },
  {
    name: "button-038",
    title: "Кнопка с переносом подписи",
    notes: ["Подпись: Проверка", "Ширина, rem: 11", "Акцент: #2b329f"],
    node: (
      <Button038 width={11} accent="#2b329f">
        Проверка
      </Button038>
    ),
  },
  {
    name: "button-039",
    title: "Шкала размеров кнопки",
    notes: ["Подпись: Подпись: тест", "Размер: sm", "Акцент: #f064ad"],
    node: (
      <Button039 size="sm" accent="#f064ad">
        Подпись: тест
      </Button039>
    ),
  },
  {
    name: "button-040",
    title: "Кнопка во всю ширину",
    notes: [
      "Подпись: Смена",
      "Вторая строка: Смена",
      "Раскладка: between",
      "Акцент: #eea677",
    ],
    node: (
      <Button040 hint="Смена" align="between" accent="#eea677">
        Смена
      </Button040>
    ),
  },
  {
    name: "button-041",
    title: "Кнопка с градиентной рамкой",
    notes: [
      "Подпись: Смена",
      "Начало градиента: #8cc16f",
      "Конец градиента: #4c72a4",
    ],
    node: (
      <Button041 accent="#8cc16f" accentEnd="#4c72a4">
        Смена
      </Button041>
    ),
  },
  {
    name: "button-042",
    title: "Кнопка со срезанным углом",
    notes: ["Подпись: Проверка", "Срез, px: 14", "Акцент: #58c7ec"],
    node: (
      <Button042 cut={14} accent="#58c7ec">
        Проверка
      </Button042>
    ),
  },
  {
    name: "button-043",
    title: "Кнопка с подъёмом",
    notes: ["Подпись: Черновик", "Подъём, px: 0", "Акцент: #416690"],
    node: (
      <Button043 lift={0} accent="#416690">
        Черновик
      </Button043>
    ),
  },
  {
    name: "button-044",
    title: "Кнопка с бегущей рамкой",
    notes: ["Подпись: Проверка", "Оборот, с: 7", "Цвет сектора: #dbd51e"],
    node: (
      <Button044 speed={7} accent="#dbd51e">
        Проверка
      </Button044>
    ),
  },
  {
    name: "button-045",
    title: "Кнопка с глубоким нажатием",
    notes: ["Подпись: Смена", "Глубина, px: 7", "Акцент: #b92b79"],
    node: (
      <Button045 depth={7} accent="#b92b79">
        Смена
      </Button045>
    ),
  },
  {
    name: "button-046",
    title: "Кнопка «наверх»",
    notes: [
      "Имя кнопки: Подпись: тест",
      "Порог, px: 1868",
      "Прятать до порога: false",
      "Акцент: #3a9e61",
    ],
    node: (
      <Button046
        label="Подпись: тест"
        threshold={1868}
        autoHide={false}
        accent="#3a9e61"
      />
    ),
  },
  {
    name: "button-047",
    title: "Кнопка внешней ссылки",
    notes: [
      "Подпись: Черновик",
      "Адрес: Подпись: тест",
      "Показывать домен: true",
      "Строка про новую вкладку: Проверка",
      "Акцент: #442b89",
    ],
    node: (
      <Button047
        href="Подпись: тест"
        showHost={true}
        newTabHint="Проверка"
        accent="#442b89"
      >
        Черновик
      </Button047>
    ),
  },
  {
    name: "button-048",
    title: "Вход через сервис",
    notes: ["Провайдер: github"],
    node: <Button048 provider="github" />,
  },
  {
    name: "button-049",
    title: "Кнопка «в корзину»",
    notes: [
      "Подпись: Подпись: тест",
      "Подпись после добавления: Проверка",
      "Акцент: #421e37",
      "Объявление после добавления: Смена",
      "Уже в корзине: true",
    ],
    node: (
      <Button049
        addedLabel="Проверка"
        accent="#421e37"
        addedAnnounce="Смена"
        defaultAdded={true}
      >
        Подпись: тест
      </Button049>
    ),
  },
  {
    name: "button-050",
    title: "Кнопка «в избранное»",
    notes: [
      "Имя в покое: Черновик",
      "Имя во включённом: Подпись: тест",
      "Включена: true",
      "Акцент: #dbad76",
    ],
    node: (
      <Button050
        label="Черновик"
        activeLabel="Подпись: тест"
        defaultPressed={true}
        accent="#dbad76"
      />
    ),
  },
  {
    name: "button-051",
    title: "Кнопка подписки",
    notes: [
      "Подпись «подписаться»: Смена",
      "Подпись «подписан»: Что дальше",
      "Подпись «отписаться»: Черновик",
      "Уже подписан: false",
      "Акцент: #ea4bbc",
    ],
    node: (
      <Button051
        followLabel="Смена"
        followingLabel="Что дальше"
        unfollowLabel="Черновик"
        defaultFollowing={false}
        accent="#ea4bbc"
      />
    ),
  },
  {
    name: "button-052",
    title: "Кнопка звонка",
    notes: [
      "Подпись: Подпись: тест",
      "Номер: Черновик",
      "Часы работы: Что дальше",
      "Акцент: #3a2ddf",
    ],
    node: (
      <Button052 phone="Черновик" hint="Что дальше" accent="#3a2ddf">
        Подпись: тест
      </Button052>
    ),
  },
  {
    name: "button-053",
    title: "Кнопка печати",
    notes: ["Подпись: Смена", "Сочетание: Проверка", "Акцент: #b1f2f0"],
    node: (
      <Button053 hint="Проверка" accent="#b1f2f0">
        Смена
      </Button053>
    ),
  },
  {
    name: "button-054",
    title: "Кнопка «поделиться»",
    notes: [
      "Подпись: Подпись: тест",
      "Подпись после копирования: Проверка",
      "Ссылка: Смена",
      "Акцент: #868671",
    ],
    node: (
      <Button054 copiedLabel="Проверка" url="Смена" accent="#868671">
        Подпись: тест
      </Button054>
    ),
  },
  {
    name: "button-055",
    title: "Кнопка с модификатором",
    notes: [
      "Подпись действия: Проверка",
      "Клавиша: Alt",
      "Подпись в покое: Смена",
      "Цвет опасности: #0d49a5",
    ],
    node: (
      <Button055 modifier="Alt" lockedLabel="Смена" danger="#0d49a5">
        Проверка
      </Button055>
    ),
  },
  {
    name: "button-056",
    title: "Кнопка выбора языка",
    notes: [
      "Имя переключателя: Смена",
      "Выбранный язык: fr",
      "Акцент: #42cd63",
    ],
    node: <Button056 label="Смена" defaultValue="fr" accent="#42cd63" />,
  },
  {
    name: "button-057",
    title: "Кнопка со счётчиком просмотров",
    notes: [
      "Подпись: Что дальше",
      "Просмотров: 84080926",
      "Акцент: #f3c3a9",
      "Подсказка: Черновик",
    ],
    node: (
      <Button057 count={84080926} accent="#f3c3a9" titleText="Черновик">
        Что дальше
      </Button057>
    ),
  },
  {
    name: "button-058",
    title: "Кнопка показа пароля",
    notes: [
      "Подпись поля: Что дальше",
      "Подсказка: Подпись: тест",
      "Значение: Черновик",
      "Акцент: #558175",
    ],
    node: (
      <Button058
        label="Что дальше"
        placeholder="Подпись: тест"
        defaultValue="Черновик"
        accent="#558175"
      />
    ),
  },
  {
    name: "button-059",
    title: "Отправка после проверки",
    notes: [
      "Подпись поля: Что дальше",
      "Подпись кнопки: Смена",
      "Подсказка: Смена",
      "Акцент: #7126fd",
    ],
    node: (
      <Button059
        label="Что дальше"
        submitLabel="Смена"
        hint="Смена"
        accent="#7126fd"
      />
    ),
  },
  {
    name: "button-060",
    title: "Кнопка-чип фильтра",
    notes: [
      "Подпись: Проверка",
      "Совпадений: 669",
      "Включён: false",
      "Имя кнопки сброса: Подпись: тест",
      "Акцент: #dd3af8",
    ],
    node: (
      <Button060
        count={669}
        defaultActive={false}
        clearLabel="Подпись: тест"
        accent="#dd3af8"
      >
        Проверка
      </Button060>
    ),
  },
  {
    name: "button-061",
    title: "Отмена с таймером",
    notes: [
      "Подпись отмены: Подпись: тест",
      "Операция: Подпись: тест",
      "Выполняется: false",
      "Порог, с: 63",
      "Акцент: #ab5375",
    ],
    node: (
      <Button061
        task="Подпись: тест"
        running={false}
        slowAfter={63}
        accent="#ab5375"
      >
        Подпись: тест
      </Button061>
    ),
  },
]
