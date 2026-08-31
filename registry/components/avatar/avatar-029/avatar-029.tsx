"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar029Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  name?: string
  src?: string
  size?: "sm" | "md" | "lg"
}

// Идея компонента: подмена фотографии инициалами по настоящей ошибке загрузки.
// Соседний вариант кладёт инициалы подложкой и обходится без JS, но платит за
// это пустым alt: фотография там обязана молчать. Здесь ошибка ловится onError,
// поэтому у картинки остаётся честный alt с именем, а после сбоя вместо неё
// появляются инициалы — не значок сломанного изображения и не дырка в строке.
// Пустой src считается тем же случаем: проверять «есть ли фото» дважды незачем.
const STYLES = `
:where([data-vibeui-block="avatar-029"]){
--vibeui-avatar-029-size:2.75rem;
--vibeui-avatar-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-029"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
overflow:hidden;
width:var(--vibeui-avatar-029-size);height:var(--vibeui-avatar-029-size);
border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-029-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-029-hue,265));
font-family:var(--vibeui-avatar-029-font);
font-size:calc(var(--vibeui-avatar-029-size) * 0.34);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-029"] [data-part="photo"]{
width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="avatar-029"][data-size="sm"]{--vibeui-avatar-029-size:2rem}
[data-vibeui-block="avatar-029"][data-size="lg"]{--vibeui-avatar-029-size:4rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-029"] *{animation:none!important;transition:none!important}}
`

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Аватар, который сам переходит на инициалы по ошибке загрузки фотографии.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar029({
  name = "Илья Мохов",
  src = "",
  size = "md",
  className,
  style,
  ...props
}: Avatar029Props) {
  const [failed, setFailed] = useState(false)
  const showPhoto = src !== "" && !failed

  const palette = {
    "--vibeui-avatar-029-hue": hue(name),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-029" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="avatar-029"
        data-size={size}
        data-fallback={!showPhoto}
        className={className}
        style={palette}
        role={showPhoto ? undefined : "img"}
        aria-label={showPhoto ? undefined : name}
      >
        {showPhoto ? (
          // Настоящий alt: фотография не обязана молчать, как в вариантах без JS.
          <img
            data-part="photo"
            src={src}
            alt={name}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <span aria-hidden="true">{initials(name)}</span>
        )}
      </span>
    </>
  )
}
