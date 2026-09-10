import { getCatalogItems } from "@/registry/index"

/**
 * Имена реестра, медленно уезжающие в подвале.
 *
 * Не декоративный набор слов: строки собраны из настоящих item'ов каталога,
 * поэтому фон подвала — это и есть ассортимент. Слой чисто визуальный,
 * `aria-hidden`: читалке перечислять полторы тысячи имён незачем.
 *
 * Каждая строка выводится дважды подряд, а анимация сдвигает её ровно на
 * половину — так шов между концом и началом не виден и цикл выглядит
 * бесконечным.
 */
const ROWS = 4
const PER_ROW = 26

export function RegistryRain() {
  const names = getCatalogItems().map((item) => item.name)

  if (names.length === 0) return null

  const rows = Array.from({ length: ROWS }, (_, row) => {
    // Каждая строка берёт свой срез и свой шаг, иначе четыре ряда идут
    // одинаковыми именами и полоса читается как повтор, а не как каталог.
    const step = row + 2
    const line = Array.from({ length: PER_ROW }, (_, index) => {
      const at = (row * 37 + index * step * 13) % names.length

      return names[at]
    }).join("  ·  ")

    return `${line}  ·  ${line}  ·  `
  })

  return (
    <div className="registry-rain" aria-hidden="true">
      {rows.map((line, index) => (
        <span key={index}>{line}</span>
      ))}
    </div>
  )
}
