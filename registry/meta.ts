import type { RegistryItem } from "shadcn/schema"

import type { ItemGroup, ItemKind } from "@/registry/categories"

/**
 * Поле `meta` registry item'а. Доезжает в `/r/<name>.json`, то есть агент
 * видит его при установке.
 *
 * `kind` и `group` здесь необязательны и служат точечным исключением:
 * по умолчанию `kind` берётся из объявившего item реестра, а `group` — из
 * категории (см. `registry/categories.ts`). Проставлять их руками у каждого
 * item'а не нужно и не следует — это было бы дублирование metadata.
 */
/**
 * Настраиваемый атрибут item'а. Контролы — машиночитаемая форма `ai.adapt`:
 * объявлять контрол можно только для того, что инструкция и так разрешает
 * менять. Для того, что лежит в `ai.preserve`, контрола быть не может —
 * иначе интерфейс предлагает сломать то, что промпт запрещает трогать.
 *
 * Контрол настраивает **проп**, а не исходник: установленный файл обязан
 * оставаться побайтово равным тому, что раздаёт реестр (см. docs/CONTROLS.md).
 */
export type ItemControl = {
  /** Имя пропа компонента. `children` — тоже контрол. */
  prop: string
  label: string
} & (
  | { type: "text"; default: string; maxLength?: number }
  | { type: "select"; default: string; options: string[] }
  | { type: "color"; default: string }
  | { type: "boolean"; default: boolean }
  | { type: "number"; default: number; min?: number; max?: number }
)

export type ControlValue = string | number | boolean

/** Переопределения контрола на другом языке. Тип контрола не меняется. */
export type LocalizedControl = {
  label?: string
  default?: ControlValue
}

/**
 * Что у item'а отличается на другом языке. Всё опционально: непереведённое
 * поле берётся из русского оригинала.
 */
export type LocalizedMeta = {
  title?: string
  description?: string
  ai?: {
    summary?: string
    preserve?: string[]
    adapt?: string[]
    notes?: string[]
    usage?: string
  }
  controls?: Record<string, LocalizedControl>
}

export type CatalogMeta = {
  tags: string[]
  ai: {
    summary: string
    preserve: string[]
    adapt: string[]
    notes?: string[]
    /**
     * Имя экспорта компонента (`Hero001`). Путь установки выводится из
     * `files[0].target`, а символ — нет, поэтому его приходится объявлять.
     */
    export?: string
    /**
     * Канонический пример использования — JSX, который агент вставит
     * в разметку. Единственное поле, которое нельзя вывести: это
     * дизайнерское решение автора компонента.
     *
     * Для `kind: component` обязательно по соглашению — без него агент не
     * знает, с какими пропсами ставить мелкий компонент. Для `kind: block`
     * опционально: секция ставится целиком и агент прочитает установленный
     * файл.
     */
    usage?: string
  }
  /**
   * Что пользователь может настроить на витрине до выдачи агенту. Значения
   * едут в ссылке `/c/<name>?prop=value` и подставляются в сниппет
   * использования. Обязательны по соглашению для `kind: component`.
   */
  controls?: ItemControl[]
  /**
   * Переводы. Русский — базовый и лежит в обычных полях; здесь только то,
   * что отличается. Незаполненное поле откатывается к русскому: лучше
   * честно показать оригинал, чем машинный перевод.
   *
   * Подписи по умолчанию у компонента остаются русскими — они в исходнике,
   * который пользователь устанавливает, и менять его нельзя. Английская
   * витрина задаёт их через `controls.<prop>.default`: значение уезжает в
   * сниппет явным пропом, файл не трогается (см. docs/CONTROLS.md).
   */
  i18n?: Partial<Record<"en", LocalizedMeta>>
  kind?: ItemKind
  group?: ItemGroup
  internal?: boolean
  featured?: boolean
}

export type CatalogItem = RegistryItem & { meta?: CatalogMeta }
