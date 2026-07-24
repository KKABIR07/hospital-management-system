import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card, generated at request time — no static asset to maintain. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #04121f 0%, #062b45 45%, #065f5b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              background: "linear-gradient(135deg, #1565c0, #10b981)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 700,
            }}
          >
            +
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
            Compassion Meets Advanced Healthcare
          </div>
          <div style={{ fontSize: 34, color: "rgba(255,255,255,0.75)" }}>
            24/7 Emergency · Expert Doctors · Trusted Care
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 26, color: "rgba(255,255,255,0.6)" }}>
          <span>JCI Accredited</span>
          <span>·</span>
          <span>35 Years of Care</span>
          <span>·</span>
          <span>4.9 / 5 · 12,400+ patients</span>
        </div>
      </div>
    ),
    size,
  );
}
