#!/usr/bin/env node
// Fail-fast перед долгим build-пайплайном: registry:build падает на shadcn
// build последним шагом, после indexes и meta:validate на ~1500 items.
// Эта проверка ловит отсутствие CLI сразу.
import { existsSync } from "node:fs"

if (!existsSync("node_modules/shadcn/package.json")) {
  console.error(
    "shadcn CLI не найден в node_modules. Запусти `npm install` перед build.",
  )
  process.exit(1)
}

if (!existsSync("registry.json")) {
  console.error("registry.json не найден в корне проекта — не то рабочее дерево.")
  process.exit(1)
}
