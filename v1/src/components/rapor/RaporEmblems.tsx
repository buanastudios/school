import React from 'react';

/**
 * Tut Wuri Handayani official emblem (Kemendikbud / Kemendikdasmen)
 * As seen on Page 1 of the official Report Card
 */
export const KemendikbudCoverLogo: React.FC<{ className?: string }> = ({ className = 'w-28 h-28' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Radiant Burst */}
    <g opacity="0.35" stroke="#38bdf8" strokeWidth="1">
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const x1 = 100 + Math.cos(angle) * 75;
        const y1 = 100 + Math.sin(angle) * 75;
        const x2 = 100 + Math.cos(angle) * 98;
        const y2 = 100 + Math.sin(angle) * 98;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>

    {/* Blue Outer Ring */}
    <circle cx="100" cy="100" r="70" fill="#0284c7" stroke="#0369a1" strokeWidth="3" />
    
    {/* Inner White Arc for Text */}
    <path
      id="tutwuriPath"
      d="M 45 100 A 55 55 0 0 1 155 100"
      fill="none"
    />
    <text fill="#ffffff" fontSize="12" fontWeight="900" letterSpacing="2.5" fontFamily="sans-serif">
      <textPath href="#tutwuriPath" startOffset="50%" textAnchor="middle">
        TUT WURI HANDAYANI
      </textPath>
    </text>

    {/* Center White Core */}
    <circle cx="100" cy="100" r="46" fill="#ffffff" />

    {/* Garuda / Flame Shape in Blue */}
    <path
      d="M100 62 C108 72, 118 78, 126 88 C132 95, 128 108, 120 115 C114 120, 107 122, 100 135 C93 122, 86 120, 80 115 C72 108, 68 95, 74 88 C82 78, 92 72, 100 62 Z"
      fill="#0284c7"
    />

    {/* Internal Gold Candle / Star Motif */}
    <circle cx="100" cy="94" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
    <path d="M100 74 L103 86 L97 86 Z" fill="#ef4444" />

    {/* Open Book in Base */}
    <path
      d="M82 124 C90 120, 96 122, 100 128 C104 122, 110 120, 118 124 L116 130 C109 126, 104 127, 100 132 C96 127, 91 126, 84 130 Z"
      fill="#fbbf24"
      stroke="#b45309"
      strokeWidth="1"
    />
  </svg>
);

/**
 * Watermark Background of Muhammadiyah (12 rays sun with Arabic calligraphy)
 * Used as the authentic watermark on every page of the official report book
 */
export const MuhammadiyahWatermark: React.FC<{ className?: string }> = ({ className = 'w-96 h-96' }) => (
  <svg viewBox="0 0 300 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 12 Radiant Sunburst Rays */}
    <g fill="#10b981" fillOpacity="0.08" stroke="#059669" strokeWidth="0.8" strokeOpacity="0.15">
      {Array.from({ length: 12 }).map((_, i) => {
        const rot = i * 30;
        return (
          <path
            key={i}
            d="M150 150 L142 40 L150 20 L158 40 Z"
            transform={`rotate(${rot} 150 150)`}
          />
        );
      })}
    </g>

    {/* Center Double Circles */}
    <circle cx="150" cy="150" r="64" fill="#ffffff" fillOpacity="0.6" stroke="#059669" strokeWidth="1.5" strokeOpacity="0.2" />
    <circle cx="150" cy="150" r="58" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.25" />
    <circle cx="150" cy="150" r="44" fill="#10b981" fillOpacity="0.07" stroke="#059669" strokeWidth="1.2" strokeOpacity="0.2" />

    {/* Center Calligraphic Sun Symbol */}
    <g transform="translate(150, 150) scale(0.7) translate(-150, -150)">
      <path
        d="M130 145 C135 130, 165 130, 170 145 C165 160, 135 160, 130 145 Z"
        fill="#047857"
        fillOpacity="0.2"
      />
      <circle cx="150" cy="150" r="12" fill="#047857" fillOpacity="0.25" />
      <path
        d="M142 135 C146 128, 154 128, 158 135 C154 142, 146 142, 142 135 Z"
        fill="#047857"
        fillOpacity="0.2"
      />
    </g>
  </svg>
);

/**
 * Repeating Text Watermark Pattern: "SD MUHAMMADIYAH 2 KOTA BANDUNG"
 * This matches the authentic paper texture of SD Muhammadiyah 2 Bandung report card.
 */
export const RepeatingWatermarkBackground: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{
        backgroundImage: `radial-gradient(circle at center, transparent 40%, rgba(255,255,255,0.7) 100%)`,
      }}
    >
      {/* Tiled Watermark Text Lines */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-[0.09] text-[10px] sm:text-[11px] font-extrabold text-teal-800 tracking-wider uppercase leading-loose py-2">
        {Array.from({ length: 34 }).map((_, rIdx) => (
          <div
            key={rIdx}
            className="whitespace-nowrap flex justify-around select-none"
            style={{
              transform: rIdx % 2 === 0 ? 'translateX(-15px)' : 'translateX(15px)',
            }}
          >
            <span>SD MUHAMMADIYAH 2 KOTA BANDUNG</span>
            <span>SD MUHAMMADIYAH 2 KOTA BANDUNG</span>
            <span>SD MUHAMMADIYAH 2 KOTA BANDUNG</span>
            <span>SD MUHAMMADIYAH 2 KOTA BANDUNG</span>
          </div>
        ))}
      </div>

      {/* Central Emblem Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <MuhammadiyahWatermark className="w-[380px] h-[380px] sm:w-[440px] sm:h-[440px]" />
      </div>
    </div>
  );
};

/**
 * Authentic School Stamp (Cap Stempel Sekolah Dasar Muhammadiyah 2 Kota Bandung)
 * In official Indonesian purple-indigo rubber ink with slight slant (-6deg)
 */
export const SchoolOfficialStamp: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => (
  <div className={`relative inline-block select-none pointer-events-none transform -rotate-6 ${className}`}>
    <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-800" fill="none">
      {/* Outer Double Circle */}
      <circle cx="100" cy="100" r="92" stroke="#4338ca" strokeWidth="2.5" strokeOpacity="0.85" />
      <circle cx="100" cy="100" r="86" stroke="#4338ca" strokeWidth="1.2" strokeOpacity="0.85" />

      {/* Arched text: SEKOLAH DASAR (top) */}
      <path id="stampTopPath" d="M 32 100 A 68 68 0 0 1 168 100" fill="none" />
      <text fill="#4338ca" fontSize="13" fontWeight="bold" letterSpacing="2.5" fontFamily="sans-serif">
        <textPath href="#stampTopPath" startOffset="50%" textAnchor="middle">
          SEKOLAH DASAR
        </textPath>
      </text>

      {/* Stars on sides */}
      <text x="25" y="105" fill="#4338ca" fontSize="14" fontWeight="bold" textAnchor="middle">★</text>
      <text x="175" y="105" fill="#4338ca" fontSize="14" fontWeight="bold" textAnchor="middle">★</text>

      {/* Arched text: KOTA BANDUNG (bottom) */}
      <path id="stampBottomPath" d="M 168 100 A 68 68 0 0 1 32 100" fill="none" />
      <text fill="#4338ca" fontSize="13" fontWeight="bold" letterSpacing="3" fontFamily="sans-serif">
        <textPath href="#stampBottomPath" startOffset="50%" textAnchor="middle">
          KOTA BANDUNG
        </textPath>
      </text>

      {/* Inner Box */}
      <rect
        x="36"
        y="82"
        width="128"
        height="36"
        rx="2"
        stroke="#4338ca"
        strokeWidth="1.8"
        fill="none"
        strokeOpacity="0.85"
      />
      <text
        x="100"
        y="98"
        fill="#4338ca"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        letterSpacing="0.8"
        fontFamily="sans-serif"
      >
        SEKOLAH DASAR
      </text>
      <text
        x="100"
        y="111"
        fill="#4338ca"
        fontSize="11"
        fontWeight="900"
        textAnchor="middle"
        letterSpacing="1"
        fontFamily="sans-serif"
      >
        MUHAMMADIYAH 2
      </text>
    </svg>
  </div>
);

/**
 * Realistic Teacher / Homeroom Signature SVG (Syamsul Bahri, S.Pd.I., Gr.)
 */
export const WaliKelasSignatureSvg: React.FC<{ className?: string }> = ({ className = 'w-36 h-16' }) => (
  <svg viewBox="0 0 180 80" className={className} fill="none">
    <path
      d="M 25 55 C 35 25, 45 15, 52 35 C 55 45, 58 60, 68 30 C 74 15, 80 45, 92 40 C 105 35, 110 20, 118 48 C 122 55, 130 50, 142 45 C 150 42, 160 38, 168 35"
      stroke="#1e293b"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 45 42 L 155 42"
      stroke="#1e293b"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M 70 20 L 78 62"
      stroke="#1e293b"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Realistic Principal Signature SVG (Tete Rohaeni, S.Pd., M.M.)
 */
export const PrincipalSignatureSvg: React.FC<{ className?: string }> = ({ className = 'w-36 h-16' }) => (
  <svg viewBox="0 0 180 80" className={className} fill="none">
    <path
      d="M 20 60 C 40 18, 65 12, 85 45 C 95 62, 102 25, 112 18 C 120 12, 126 55, 134 50 C 145 42, 165 38, 172 35"
      stroke="#1e293b"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 50 32 L 135 32"
      stroke="#1e293b"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M 98 15 C 105 30, 100 50, 102 65"
      stroke="#1e293b"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
