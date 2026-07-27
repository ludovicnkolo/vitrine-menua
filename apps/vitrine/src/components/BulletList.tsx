import React from "react";
import { ChevronRight } from "lucide-react";

interface BulletListProps {
  items: string[];
  gridCols?: string;
  gapX?: string;
  gapY?: string;
  fontWeight?: string;
}

export default function BulletList({
  items,
  gridCols = "grid-cols-1",
  gapX = "gap-x-4",
  gapY = "gap-y-4",
  fontWeight = "font-normal",
}: BulletListProps) {
  if (!items || items.length === 0) return null;

  return (
    <ul className={`grid ${gridCols} ${gapX} ${gapY}`}>
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 group">
          <ChevronRight 
            size={18} 
            className="text-[#141824] mt-0.5 shrink-0 group-hover:translate-x-1 transition-transform" 
          />
          <span className={`text-[#6e7891] text-[0.95rem] ${fontWeight} leading-relaxed`}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
