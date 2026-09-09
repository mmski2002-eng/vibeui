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
  toggle: (itemName: string) => void
}

const FavoritesContext = createContext<Favorites>({
  items: null,
  pinned: null,
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

  useEffect(() => {
    let cancelled = false

    fetch("/api/favorites")
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then((data: { items: string[] }) => {
        if (!cancelled) {
          setItems(new Set(data.items))
          setPinned(new Set(data.items))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems(new Set())
          setPinned(new Set())
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const toggle = useCallback((itemName: string) => {
    // Сердце закрашивается сразу, запись идёт следом: ждать ответа сервера
    // ради переключения иконки незачем.
    setItems((current) => {
      const next = new Set(current ?? [])

      if (next.has(itemName)) {
        next.delete(itemName)
      } else {
        next.add(itemName)
      }

      return next
    })

    void toggleFavorite(itemName)
  }, [])

  return (
    <FavoritesContext.Provider value={{ items, pinned, toggle }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
