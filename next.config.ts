import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Самодостаточный сервер для деплоя на собственный VPS:
  // .next/standalone содержит node_modules, нужные в рантайме.
  output: "standalone",
}

export default nextConfig
