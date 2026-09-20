"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import { toggleFavorite } from "@/lib/account-actions"

type Favorites = {
  /** null, пока список не загружен: сердца не мигают из пустого в полное. */
  items: Set<string> | null
  /**
   * Набор на момент открытия страницы. По нему сетка решает, кого поднять
   * наверх: если считать по актуальному, карточка уезжала бы вверх прямо
   * из-под курсора в момент нажатия.
   */
  pinned: Set<string> | null
  /** Сколько раз item добавили в избранное все пользователи. */
  counts: Record<string, number>
  /** Счётчики на момент открытия страницы — для сортировки, см. `pinned`. */
  pinnedCounts: Record<string, number> | null
  toggle: (itemName: string) => void
}

const FavoritesContext = createContext<Favorites>({
  items: null,
  pinned: null,
  counts: {},
  pinnedCounts: null,
  toggle: () => {},
})

/**
 * Отметки избранного для всей витрины. Запрос один на страницу, а не на
 * карточку: страниц каталога полторы тысячи, и каждая рендерится заранее —
 * персональные данные в них попасть не могут, поэтому список приезжает
 * отдельным запросом уже в браузере.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Set<string> | null>(null)
  const [pinned, setPinned] = useState<Set<string> | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [pinnedCounts, setPinnedCounts] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/favorites")
      .then((response) =>
        response.ok ? response.json() : { items: [], counts: {} },
      )
      .then((data: { items: string[]; counts?: Record<string, number> }) => {
        if (!cancelled) {
          setItems(new Set(data.items))
          setPinned(new Set(data.items))
          setCounts(data.counts ?? {})
          setPinnedCounts(data.counts ?? {})
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems(new Set())
          setPinned(new Set())
          setPinnedCounts({})
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const toggle = useCallback(
    (itemName: string) => {
      // Сердце закрашивается сразу, запись идёт следом: ждать ответа сервера
      // ради переключения иконки незачем.
      const removing = items?.has(itemName) ?? false
      const next = new Set(items ?? [])

      if (removing) {
        next.delete(itemName)
      } else {
        next.add(itemName)
      }

      setItems(next)
      setCounts((totals) => ({
        ...totals,
        [itemName]: Math.max(0, (totals[itemName] ?? 0) + (removing ? -1 : 1)),
      }))

      void toggleFavorite(itemName)
    },
    [items],
  )

  return (
    <FavoritesContext.Provider value={{ items, pinned, counts, pinnedCounts, toggle }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
