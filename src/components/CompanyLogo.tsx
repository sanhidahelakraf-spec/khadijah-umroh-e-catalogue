import React from "react";

interface CompanyLogoProps {
  variant?: "full" | "icon" | "compact" | "white";
  className?: string;
  iconSize?: "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark";
}

export default function CompanyLogo({
  variant = "full",
  className = "",
  iconSize = "md",
  theme = "light",
}: CompanyLogoProps) {
  // Sizing of the icon SVG
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const selectedSize = sizeMap[iconSize];

  // Theme support
  const isDarkTheme = theme === "dark";
  const charcoalColor = isDarkTheme ? "#f8fafc" : "#1a1a1a";
  const subtitleTextColorClass = isDarkTheme ? "text-slate-200" : "text-[#1a1a1a]";
  const separatorColorClass = isDarkTheme ? "bg-slate-300/40" : "bg-[#1a1a1a]";

  // Colors
  const goldColor = "#d5a81e"; // Mustard Gold
  const darkGreenColor = "#0f5132"; // Deep emerald logo fallback

  const renderIconSvg = () => (
    <svg
      className={`${selectedSize} overflow-visible`}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Flight Orbit Arc (Circled around Kaaba) */}
      <path
        d="M 125 158 C 55 158, 38 102, 53 60 C 63 24, 110 20, 138 20"
        fill="none"
        stroke={charcoalColor}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Structured 3D Kaaba Block */}
      {/* 1. Left Face */}
      <polygon
        points="110,140 70,120 70,60 110,80"
        fill="#262626"
      />
      {/* 2. Right Face */}
      <polygon
        points="110,140 150,120 150,60 110,80"
        fill="#0a0a0a"
      />
      {/* 3. Top Face */}
      <polygon
        points="110,80 70,60 110,40 150,60"
        fill="#141414"
      />

      {/* Kiswa Golden Embroidered Band */}
      {/* Kiswa Left Band */}
      <polygon
        points="70,70 110,90 110,97 70,77"
        fill={goldColor}
      />
      {/* Left Band Calligraphic Dash Detail */}
      <path
        d="M 70,73.5 L 110,93.5"
        stroke="#141414"
        strokeWidth="1.2"
        strokeDasharray="2,2"
      />

      {/* Kiswa Right Band */}
      <polygon
        points="110,90 150,70 150,77 110,97"
        fill={goldColor}
      />
      {/* Right Band Calligraphic Dash Detail */}
      <path
        d="M 110,93.5 L 150,73.5"
        stroke="#141414"
        strokeWidth="1.2"
        strokeDasharray="2,2"
      />

      {/* Extra Gold Accents on the Kaaba (e.g., Door ornament outline) */}
      <path
        d="M 122,126 L 122,102 C 122,101 123,100 124,100 L 134,100 C 135,100 136,101 136,102 L 136,126"
        stroke={goldColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.85"
      />

      {/* Orbit Jet Airplane Silhouette at the end of sweep, beautifully angled */}
      <g transform="translate(142, 20) rotate(12)">
        <path
          d="M -15,0 L 10,0 L 14,0 C 16,0 17,1 18,1 L 19,-1 L 18,-1 C 17,-1 16,0 14,0 Z"
          fill={charcoalColor}
        />
        {/* Main Swept Wings */}
        <path
          d="M -2,0 L -7,-14 L -2,-14 L 3,0 L -2,14 L -7,14 Z"
          fill={charcoalColor}
        />
        {/* Tail Stabilizers */}
        <path
          d="M -11,0 L -13,-5 L -11,-5 L -9,0 L -11,5 L -13,5 Z"
          fill={charcoalColor}
        />
      </g>
    </svg>
  );

  if (variant === "icon") {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderIconSvg()}</div>;
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {renderIconSvg()}
        <div className="flex flex-col">
          <div className="flex items-center gap-0.5 relative">
            {/* khädïjäh brand lettering with actual golden double dots matching the image */}
            <span 
              className="font-serif text-xl font-bold lowercase tracking-wide text-[#d5a81e] select-none"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              kh
              <span className="relative inline-block">
                a
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-[#d5a81e] rounded-full scale-50"></span>
                  <span className="w-1.5 h-1.5 bg-[#d5a81e] rounded-full scale-50"></span>
                </span>
              </span>
              d
              <span className="relative inline-block">
                i
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-[#d5a81e] rounded-full scale-50"></span>
                  <span className="w-1.5 h-1.5 bg-[#d5a81e] rounded-full scale-50"></span>
                </span>
              </span>
              j
              <span className="relative inline-block">
                a
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-[#d5a81e] rounded-full scale-50"></span>
                  <span className="w-1.5 h-1.5 bg-[#d5a81e] rounded-full scale-50"></span>
                </span>
              </span>
              h
            </span>
          </div>
          <span className={`text-[9px] uppercase font-black tracking-widest ${subtitleTextColorClass} -mt-1 font-sans`}>
            Travel Indonesia
          </span>
        </div>
      </div>
    );
  }

  // Large centered fully aligned visual logo (exactly matches uploaded image)
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Icon portion (Kaaba, Orbit, Airplane) */}
      <div className="p-2 select-none">
        {renderIconSvg()}
      </div>

      {/* Main Brand Typography khädïjäh */}
      <div className="mt-1 relative flex flex-col items-center">
        {/* Render khädïjäh text with its distinctive golden dual Umlaut dots on the three vowels */}
        <h1 
          className="text-4xl sm:text-5xl font-extrabold lowercase tracking-wide text-[#d5a81e] select-none"
          style={{ 
            fontFamily: "'Playfair Display', 'Georgia', serif",
            letterSpacing: "0.02em"
          }}
        >
          kh
          <span className="relative inline-block">
            a
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
              <span className="w-2 h-2 bg-[#d5a81e] rounded-full scale-60"></span>
              <span className="w-2 h-2 bg-[#d5a81e] rounded-full scale-60"></span>
            </span>
          </span>
          d
          <span className="relative inline-block col-span-1">
            i
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
              <span className="w-2 h-2 bg-[#d5a81e] rounded-full scale-60"></span>
              <span className="w-2 h-2 bg-[#d5a81e] rounded-full scale-60"></span>
            </span>
          </span>
          j
          <span className="relative inline-block">
            a
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
              <span className="w-2 h-2 bg-[#d5a81e] rounded-full scale-60"></span>
              <span className="w-2 h-2 bg-[#d5a81e] rounded-full scale-60"></span>
            </span>
          </span>
          h
        </h1>

        {/* Separator Line */}
        <div className={`w-48 sm:w-56 h-[1.5px] ${separatorColorClass} mt-3.5 mb-2.5 opacity-80`} />

        {/* Subtitle wording exactly matching the block */}
        <h2 className={`text-xs sm:text-sm font-extrabold uppercase tracking-widest font-sans ${subtitleTextColorClass}`}>
          Khadijah Travel Indonesia
        </h2>
      </div>
    </div>
  );
}
