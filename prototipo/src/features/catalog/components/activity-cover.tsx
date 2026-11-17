const themes: Record<string, string> = {
  Design: "mint",
  Programação: "blue",
  "Desenvolvimento web": "blue",
  "Banco de dados": "lilac",
  Matemática: "sand",
  "Comunicação científica": "sand",
  "Inteligência artificial": "lilac",
  "Desenvolvimento profissional": "mint",
};
export function ActivityCover({
  area,
  compact = false,
}: {
  area: string;
  compact?: boolean;
}) {
  const theme = themes[area] ?? "blue";
  return (
    <div
      className={`activity-cover cover-${theme} ${compact ? "cover-compact" : ""}`}
      aria-hidden="true"
    >
      <span className="cover-label">
        MINDShare <span>EXPLORAR / CRIAR / COMPARTILHAR</span>
      </span>
      <svg viewBox="0 0 400 190" fill="none" focusable="false">
        <path
          d="M0 155H400M0 115H400M0 75H400M0 35H400M40 0V190M80 0V190M120 0V190M160 0V190M200 0V190M240 0V190M280 0V190M320 0V190M360 0V190"
          stroke="currentColor"
          opacity=".08"
        />
        {theme === "mint" ? (
          <>
            <rect
              x="116"
              y="35"
              width="112"
              height="112"
              rx="24"
              stroke="currentColor"
              strokeWidth="22"
              transform="rotate(-12 172 91)"
            />
            <circle cx="245" cy="106" r="48" fill="currentColor" opacity=".3" />
            <path
              d="m235 93 12 12 25-28"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </>
        ) : theme === "blue" ? (
          <>
            <path
              d="m135 50-46 45 46 45M265 50l46 45-46 45"
              stroke="currentColor"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m221 35-40 120"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinecap="round"
              opacity=".45"
            />
            <circle cx="313" cy="35" r="9" fill="currentColor" opacity=".5" />
          </>
        ) : theme === "lilac" ? (
          <>
            <ellipse
              cx="200"
              cy="95"
              rx="92"
              ry="42"
              stroke="currentColor"
              strokeWidth="3"
              transform="rotate(-35 200 95)"
            />
            <ellipse
              cx="200"
              cy="95"
              rx="92"
              ry="42"
              stroke="currentColor"
              strokeWidth="3"
              transform="rotate(35 200 95)"
            />
            <circle cx="200" cy="95" r="24" fill="currentColor" opacity=".6" />
            <circle cx="275" cy="58" r="10" fill="currentColor" />
          </>
        ) : (
          <>
            <rect
              x="116"
              y="34"
              width="120"
              height="120"
              rx="5"
              stroke="currentColor"
              strokeWidth="3"
              transform="rotate(-10 176 94)"
            />
            <rect
              x="168"
              y="43"
              width="120"
              height="120"
              rx="5"
              fill="currentColor"
              opacity=".16"
            />
            <path
              d="M188 78h62M188 99h48M188 120h35"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
      <span className="cover-index">APRENDER JUNTOS.</span>
    </div>
  );
}
