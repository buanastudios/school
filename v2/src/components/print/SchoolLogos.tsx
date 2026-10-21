import React from 'react';

export const TutWuriHandayaniLogo: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Shield Pentagon with Red Border and Blue/Golden Core */}
    <path
      d="M100 15 L175 60 L150 165 L100 190 L50 165 L25 60 Z"
      fill="#DC2626"
      stroke="#B91C1C"
      strokeWidth="4"
    />
    <path
      d="M100 25 L165 65 L142 155 L100 178 L58 155 L35 65 Z"
      fill="#FFFFFF"
    />
    {/* Golden Wings and Torch */}
    <circle cx="100" cy="85" r="14" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
    <path
      d="M93 85 L100 55 L107 85 Z"
      fill="#DC2626"
    />
    {/* Wings left and right */}
    <path
      d="M75 105 C60 85, 45 105, 40 125 C55 130, 70 120, 80 110 Z"
      fill="#FBBF24"
      stroke="#D97706"
      strokeWidth="1.5"
    />
    <path
      d="M125 105 C140 85, 155 105, 160 125 C145 130, 130 120, 120 110 Z"
      fill="#FBBF24"
      stroke="#D97706"
      strokeWidth="1.5"
    />
    {/* Open Book Base */}
    <path
      d="M60 140 C80 130, 95 135, 100 145 C105 135, 120 130, 140 140 L135 155 C120 145, 105 150, 100 158 C95 150, 80 145, 65 155 Z"
      fill="#FBBF24"
      stroke="#B45309"
      strokeWidth="2"
    />
    {/* Banner Ribbon */}
    <path
      d="M50 45 C75 32, 125 32, 150 45"
      stroke="#B91C1C"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <text
      x="100"
      y="42"
      textAnchor="middle"
      fontSize="9"
      fontWeight="900"
      fill="#B91C1C"
      fontFamily="sans-serif"
    >
      TUT WURI HANDAYANI
    </text>
  </svg>
);

export const MerdekaMengajarLogo: React.FC<{ className?: string }> = ({ className = 'w-24 h-8' }) => (
  <div className={`flex items-center gap-1.5 ${className}`}>
    <svg viewBox="0 0 50 60" className="w-6 h-8 shrink-0" fill="none">
      <circle cx="22" cy="14" r="7" fill="#F59E0B" />
      <path
        d="M12 25 C18 20, 32 20, 38 27 C34 38, 28 48, 24 55 C20 48, 14 38, 12 25 Z"
        fill="#4F46E5"
      />
    </svg>
    <div className="font-sans leading-tight">
      <div className="font-extrabold text-xs text-slate-900 tracking-tight">Merdeka</div>
      <div className="font-bold text-xs text-slate-700">Mengajar</div>
    </div>
  </div>
);
