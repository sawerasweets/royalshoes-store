// Test SVG generator for Men Sandal
const fs = require('fs');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#1c1c1c"/>
      <stop offset="60%" stop-color="#0e0e0e"/>
      <stop offset="100%" stop-color="#060606"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5E0A9"/>
      <stop offset="35%" stop-color="#D4AF37"/>
      <stop offset="70%" stop-color="#AA820A"/>
      <stop offset="100%" stop-color="#D4AF37"/>
    </linearGradient>
    <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#3A2818"/>
      <stop offset="40%" stop-color="#1F160E"/>
      <stop offset="100%" stop-color="#120D08"/>
    </linearGradient>
    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="750" fill="url(#bgGlow)"/>

  <!-- Luxury Framing -->
  <rect x="24" y="24" width="552" height="702" fill="none" stroke="#262626" stroke-width="1"/>
  <rect x="30" y="30" width="540" height="690" fill="none" stroke="url(#goldGrad)" stroke-width="0.8" opacity="0.4"/>
  
  <!-- Corner Ornaments -->
  <path d="M 24 38 L 38 24 M 576 38 L 562 24 M 24 712 L 38 726 M 576 712 L 562 726" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.7"/>

  <!-- Top Brand Mark -->
  <text x="300" y="75" text-anchor="middle" font-family="'Cinzel', 'Playfair Display', Georgia, serif" font-size="16" font-weight="700" letter-spacing="7" fill="url(#goldGrad)">SAWERA</text>
  <text x="300" y="94" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="8.5" font-weight="600" letter-spacing="3" fill="#888888">STEP INTO ELEGANCE</text>

  <!-- Ground Shadow -->
  <ellipse cx="300" cy="510" rx="190" ry="22" fill="#000000" opacity="0.85" filter="blur(8px)"/>

  <!-- SANDAL ILLUSTRATION (Handcrafted Leather Sandal) -->
  <g filter="url(#subtleShadow)">
    <!-- Sandal Sole Base -->
    <path d="M 140 470 C 135 440, 155 385, 200 375 C 260 360, 360 365, 430 405 C 475 430, 480 470, 460 495 C 430 525, 330 520, 240 515 C 175 510, 145 495, 140 470 Z" fill="#24180E" stroke="url(#goldGrad)" stroke-width="1"/>
    <!-- Cork / Cushioned Midsole -->
    <path d="M 144 466 C 140 442, 160 390, 202 380 C 258 368, 355 372, 424 410 C 466 433, 472 468, 454 490 C 426 518, 330 514, 242 509 C 178 505, 148 490, 144 466 Z" fill="#3D2918" stroke="#1A110A" stroke-width="1.5"/>
    <!-- Insole Footbed Liner with Gold Stitching -->
    <path d="M 152 462 C 148 445, 166 400, 206 390 C 256 378, 348 382, 414 418 C 452 438, 460 465, 444 484 C 420 508, 330 505, 246 501 C 185 498, 156 484, 152 462 Z" fill="#18120C" stroke="url(#goldGrad)" stroke-width="0.8" stroke-dasharray="4,3"/>

    <!-- Gold Foil Logo on Heel Bed -->
    <ellipse cx="195" cy="450" rx="20" ry="12" fill="none" stroke="url(#goldGrad)" stroke-width="0.6" opacity="0.6"/>
    <text x="195" y="453" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-size="7" font-weight="700" letter-spacing="2" fill="url(#goldGrad)" opacity="0.85">SAWERA</text>

    <!-- Front Wide Leather Strap (Crossing Over Arch) -->
    <path d="M 330 380 C 350 410, 370 460, 360 495 C 345 500, 325 500, 310 498 C 315 460, 305 410, 285 385 Z" fill="url(#leatherGrad)" stroke="#4A3420" stroke-width="1.5"/>
    <path d="M 326 384 C 344 412, 362 458, 354 492" fill="none" stroke="url(#goldGrad)" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.8"/>

    <!-- Cross Strap Over Forefoot -->
    <path d="M 270 395 C 310 425, 380 445, 425 450 C 430 465, 428 478, 420 484 C 370 478, 305 455, 255 415 Z" fill="#1A120A" stroke="#4A3420" stroke-width="1.5"/>
    <path d="M 273 402 C 312 430, 378 448, 418 454" fill="none" stroke="url(#goldGrad)" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.8"/>

    <!-- Metallic Gold Buckle -->
    <rect x="345" y="430" width="22" height="30" rx="4" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
    <rect x="350" y="436" width="12" height="18" rx="2" fill="#0A0704" stroke="url(#goldGrad)" stroke-width="0.8"/>
    <line x1="343" y1="445" x2="368" y2="445" stroke="url(#goldGrad)" stroke-width="2.5"/>
  </g>

  <!-- Category & Silhouette Badge -->
  <g transform="translate(300, 630)">
    <line x1="-120" y1="0" x2="120" y2="0" stroke="url(#goldGrad)" stroke-width="0.8" opacity="0.5"/>
    <circle cx="0" cy="0" r="4" fill="url(#goldGrad)"/>
    <text x="0" y="24" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-size="12" font-weight="700" letter-spacing="4" fill="#F5F0E6">MEN'S LEATHER SANDAL</text>
    <text x="0" y="42" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="9" font-weight="500" letter-spacing="2" fill="#D4AF37">GENUINE HANDCRAFTED CALFSKIN</text>
  </g>
</svg>
`;

fs.writeFileSync('c:/antigravity/public/test-sandal.svg', svg);
console.log('Saved test-sandal.svg');
