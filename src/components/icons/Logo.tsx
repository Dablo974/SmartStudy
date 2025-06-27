import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g>
        {/* Backpack Strap */}
        <path d="M 76 60 C 72 75, 58 80, 50 78" stroke="#E57E3D" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* Pencil */}
        <g transform="rotate(15 75 80)">
          <rect x="70" y="70" width="10" height="40" fill="#FECF44" stroke="#222F49" strokeWidth="1.5" rx="2" />
          <polygon points="70,70 75,60 80,70" fill="#F7B42F" stroke="#222F49" strokeWidth="1.5" />
          <polygon points="70,69.5 75,59.5 80,69.5" fill="#222F49" />
          <rect x="70" y="110" width="10" height="6" fill="#F6A290" stroke="#222F49" strokeWidth="1.5" rx="1" />
        </g>
        
        {/* Feet */}
        <path d="M 38 90 C 38 95, 43 95, 43 90" stroke="#F7B42F" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 43 90 C 43 95, 48 95, 48 90" stroke="#F7B42F" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 52 90 C 52 95, 57 95, 57 90" stroke="#F7B42F" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 57 90 C 57 95, 62 95, 62 90" stroke="#F7B42F" strokeWidth="3" fill="none" strokeLinecap="round"/>

        {/* Body */}
        <path d="M 50,30 C 20,30 15,65 20,88 C 25,100 75,100 80,88 C 85,65 80,30 50,30 Z" fill="#345D9D" />

        {/* Wing */}
        <path d="M 20,60 C 10,70 15,85 28,80 C 25,75 25,65 20,60 Z" fill="#4784C3" />
        
        {/* Chest feathers */}
        <path d="M 45 75 A 5 5 0 0 1 55 75" fill="none" stroke="#4784C3" strokeWidth="2" strokeLinecap="round" />
        <path d="M 55 75 A 5 5 0 0 1 65 75" fill="none" stroke="#4784C3" strokeWidth="2" strokeLinecap="round" />
        <path d="M 40 82 A 5 5 0 0 1 50 82" fill="none" stroke="#4784C3" strokeWidth="2" strokeLinecap="round" />
        <path d="M 50 82 A 5 5 0 0 1 60 82" fill="none" stroke="#4784C3" strokeWidth="2" strokeLinecap="round" />
        <path d="M 60 82 A 5 5 0 0 1 70 82" fill="none" stroke="#4784C3" strokeWidth="2" strokeLinecap="round" />
        
        {/* Glasses */}
        <circle cx="38" cy="55" r="15" fill="white" />
        <circle cx="62" cy="55" r="15" fill="white" />
        <circle cx="38" cy="55" r="16" stroke="#222F49" strokeWidth="3.5" fill="none" />
        <circle cx="62" cy="55" r="16" stroke="#222F49" strokeWidth="3.5" fill="none" />
        <line x1="54" y1="55" x2="46" y2="55" stroke="#222F49" strokeWidth="3.5" />
        
        {/* Happy eyes */}
        <path d="M 32,52 a 8,8 0 0,1 12,0" stroke="#222F49" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 56,52 a 8,8 0 0,1 12,0" stroke="#222F49" strokeWidth="3" fill="none" strokeLinecap="round" />
        
        {/* Beak */}
        <polygon points="47,66 53,66 50,72" fill="#F7B42F" />
        
        {/* Graduation Cap */}
        <polygon points="50,15 15,35 85,35" fill="#222F49" />
        <rect x="10" y="35" width="80" height="7" fill="#222F49" />
        
        {/* Tassel */}
        <line x1="68" y1="18" x2="68" y2="28" stroke="#FECF44" strokeWidth="2.5" />
        <path d="M 68,28 l 3,2 l-3,2 l -3,-2 z" fill="#FECF44" />
      </g>
    </svg>
  );
}
