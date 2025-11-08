import React from "react";
import { sdgIconMap } from "../utils/sdgMap";

interface SDG {
  id: number;
  value: string;
}

interface SdgBadgesProps {
  sdgs?: SDG[];
  layout?: "grid" | "inline";
  columns?: number; // used only when layout === "grid"
  gap?: number; // tailwind spacing number (e.g., 2 -> 0.5rem); optional
}

export const SdgBadges: React.FC<SdgBadgesProps> = ({
  sdgs,
  layout = "inline",
  columns = 4,
  gap = 0,
}) => {
  if (!sdgs || sdgs.length === 0) return null;

  // clamp columns to at least 1 and at most number of sdgs (optional)
  const cols = Math.max(3, Math.min(columns, sdgs.length));

  // container base classes
  const baseClass = "w-full"; // allow parent to control width

  if (layout === "grid") {
    // inline style for dynamic columns — ensures the CSS is actually applied
    const style: React.CSSProperties = {
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: `${gap * 0.25}rem`, // tailwind spacing scale: 1->0.25rem, 2->0.5rem etc.
    };

    return (
      <div className={baseClass} style={style}>
        {sdgs.map((goal) => {
          const goalPrefix = goal.value.split(" - ")[0];
          const iconFilename = sdgIconMap[goalPrefix];
          const iconPath = iconFilename
            ? `/images/sdg/${iconFilename}`
            : "/images/sdg/default.png";

          return (
            <div
              key={goal.id}
              className="flex flex-col items-center justify-center p-2"
            >
              <img
                src={iconPath}
                alt={goal.value}
                className="object-contain max-w-full" 
                onError={(e) => {
                  // hide broken images gracefully (or set fallback src)
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // inline/flex layout
  return (
    <div className={`${baseClass} flex flex-wrap gap-2 items-center`}>
      {sdgs.map((goal) => {
        const goalPrefix = goal.value.split(" - ")[0];
        const iconFilename = sdgIconMap[goalPrefix];
        const iconPath = iconFilename
          ? `/images/sdg/${iconFilename}`
          : "/images/sdg/default.png";

        return (
          <div
            key={goal.id}
            className="flex flex-col items-center justify-center"
          >
            <img
              src={iconPath}
              alt={goal.value}
              className="object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
