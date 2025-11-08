import React from "react";
import { sdgIconMap } from "../utils/sdgMap";

interface SDG {
  id: number;
  value: string;
}

interface SdgBadgesProps {
  sdgs?: SDG[];
  layout?: "grid" | "inline"; // 👈 new prop
  columns?: number; // optional control for grid layout
}

export const SdgBadges: React.FC<SdgBadgesProps> = ({
  sdgs,
  layout,
  columns,
}) => {
  if (!sdgs || sdgs.length === 0) return null;

  const containerClass =
    layout === "grid"
      ? `grid grid-cols-${columns} gap-2`
      : "flex flex-wrap gap-2 items-center";

  return (
    <div className={containerClass}>
      {sdgs.map((goal) => {
        const goalPrefix = goal.value.split(" - ")[0];
        const iconFilename = sdgIconMap[goalPrefix];
        const iconPath = iconFilename
          ? `/images/sdg/${iconFilename}`
          : "/images/sdg/default.png";

        return (
          <div key={goal.id} className="flex flex-col items-center">
            <img
              src={iconPath}
              alt={goal.value}
              className="object-contain"
            />
          </div>
        );
      })}
    </div>
  );
};
