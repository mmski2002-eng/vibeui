import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Компоненты registry переносимы: они не имеют права зависеть от
    // next/image — их копируют в чужой проект, где Next может не быть.
    files: ["registry/**/*.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
])

export default eslintConfig
