import { ImageResponse } from "next/og"

// English share image for the /en tree (vibeui.club).
export const alt = "VibeUI — choose a design, give it to AI, ship your site"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#101010",
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width="72" height="72" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="7" fill="#ff5900" />
          <path
            d="M9 10.5 16 22l7-11.5"
            fill="none"
            stroke="#101010"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ color: "#fafafa", fontSize: 56, fontWeight: 700 }}>
          VibeUI
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ color: "#fafafa", fontSize: 68, lineHeight: 1.15 }}>
          Choose a design, give it to AI, ship your site
        </div>
        <div style={{ color: "#a1a1a1", fontSize: 34 }}>
          UI component library for vibe coding
        </div>
      </div>

      <div style={{ display: "flex", color: "#ff5900", fontSize: 32 }}>
        vibeui.club
      </div>
    </div>,
    size,
  )
}
