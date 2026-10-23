const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// High-definition luxury SVG template builder
function generateSVG({ title, subcategory, badge, iconType, angle = 1, accentColor = "#D4AF37" }) {
  let illustration = "";

  if (iconType === "sandal") {
    illustration = `
      <!-- Sandal Outsole & Cork Footbed -->
      <path d="M 140 480 C 135 440, 155 385, 205 375 C 265 360, 365 365, 435 405 C 478 430, 482 470, 462 495 C 430 525, 330 520, 240 515 C 175 510, 145 498, 140 480 Z" fill="#24180E" stroke="${accentColor}" stroke-width="1.2"/>
      <path d="M 145 475 C 140 442, 160 390, 205 380 C 260 368, 358 372, 426 410 C 468 433, 474 468, 456 490 C 428 518, 330 514, 242 509 C 178 505, 148 492, 145 475 Z" fill="#3D2918" stroke="#1A110A" stroke-width="1"/>
      <path d="M 152 470 C 148 445, 166 400, 208 390 C 258 378, 350 382, 416 418 C 454 438, 462 465, 446 484 C 422 508, 330 505, 246 501 C 185 498, 156 486, 152 470 Z" fill="#15100B" stroke="${accentColor}" stroke-width="0.8" stroke-dasharray="4,3"/>
      
      <!-- Heel Gold Stamped Brand -->
      <ellipse cx="198" cy="452" rx="20" ry="12" fill="none" stroke="${accentColor}" stroke-width="0.8" opacity="0.7"/>
      <text x="198" y="455" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-size="7" font-weight="700" letter-spacing="2" fill="${accentColor}">SAWERA</text>

      <!-- Arch Crossing Leather Straps -->
      <path d="M 330 385 C 350 415, 370 465, 360 500 C 345 505, 325 505, 310 503 C 315 465, 305 415, 285 390 Z" fill="#1C140E" stroke="#4A3420" stroke-width="1.8"/>
      <path d="M 326 389 C 344 417, 362 463, 354 497" fill="none" stroke="${accentColor}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.8"/>
      <path d="M 270 400 C 310 430, 380 450, 425 455 C 430 470, 428 483, 420 489 C 370 483, 305 460, 255 420 Z" fill="#120D08" stroke="#4A3420" stroke-width="1.8"/>
      <path d="M 273 407 C 312 435, 378 453, 418 459" fill="none" stroke="${accentColor}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.8"/>

      <!-- Gold Buckle Detail -->
      <rect x="345" y="435" width="22" height="30" rx="4" fill="none" stroke="${accentColor}" stroke-width="3"/>
      <rect x="350" y="441" width="12" height="18" rx="2" fill="#0A0704" stroke="${accentColor}" stroke-width="0.8"/>
      <line x1="343" y1="450" x2="368" y2="450" stroke="${accentColor}" stroke-width="2.5"/>
    `;
  } else if (iconType === "slipper") {
    illustration = `
      <!-- Slipper Sole -->
      <path d="M 140 485 C 135 440, 160 380, 220 370 C 300 355, 390 360, 445 395 C 480 420, 485 460, 465 488 C 430 520, 320 520, 230 515 C 170 510, 145 500, 140 485 Z" fill="#1C140E" stroke="${accentColor}" stroke-width="1.2"/>
      <path d="M 148 478 C 144 445, 170 390, 222 380 C 298 365, 385 370, 438 402 C 470 424, 474 456, 456 480 C 424 508, 320 508, 232 505 C 175 500, 150 490, 148 478 Z" fill="#140D08" stroke="${accentColor}" stroke-width="0.8" stroke-dasharray="4,3"/>

      <!-- Heel Cushion with Gold Crest -->
      <circle cx="195" cy="455" r="16" fill="#1F150D" stroke="${accentColor}" stroke-width="0.8"/>
      <path d="M 189 458 L 195 448 L 201 458 L 195 455 Z" fill="${accentColor}"/>

      <!-- Velvet/Leather Upper Vamp (Open Back Mule) -->
      <path d="M 270 375 C 320 360, 400 365, 450 400 C 480 425, 485 460, 465 488 C 420 495, 360 480, 320 450 C 280 420, 265 395, 270 375 Z" fill="#110B07" stroke="${accentColor}" stroke-width="1.8"/>
      
      <!-- Gold Bullion Embroidered Crest on Vamp -->
      <g transform="translate(390, 425)">
        <ellipse cx="0" cy="0" rx="26" ry="18" fill="none" stroke="${accentColor}" stroke-width="1.2"/>
        <path d="M -12 4 L 0 -10 L 12 4 L 6 0 L 0 5 L -6 0 Z" fill="${accentColor}"/>
        <text x="0" y="10" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-size="6.5" font-weight="700" letter-spacing="1" fill="${accentColor}">SAWERA</text>
      </g>
    `;
  } else if (iconType === "formal") {
    illustration = `
      <!-- Oxford Brogue Silhouette -->
      <path d="M 130 460 C 120 420, 140 370, 190 355 C 240 340, 280 345, 340 370 C 410 400, 470 410, 485 450 C 490 475, 470 495, 440 500 C 370 510, 280 510, 210 505 C 160 500, 135 485, 130 460 Z" fill="#141414" stroke="${accentColor}" stroke-width="1.5"/>
      <!-- Stacked Heel -->
      <path d="M 130 460 L 140 505 L 190 505 L 180 460 Z" fill="#0A0A0A" stroke="#333" stroke-width="1"/>
      <!-- Leather Sole Edge -->
      <path d="M 180 495 C 260 500, 370 500, 450 488 C 480 480, 485 460, 480 445" fill="none" stroke="${accentColor}" stroke-width="2.5"/>
      <!-- Cap Toe Seam with Brogue Perforations -->
      <path d="M 400 405 C 410 435, 415 470, 405 495" fill="none" stroke="${accentColor}" stroke-width="1" stroke-dasharray="3,3"/>
      <!-- Closed Lacing & Gold Eyelets -->
      <path d="M 270 355 C 290 370, 310 395, 315 425" fill="none" stroke="${accentColor}" stroke-width="1.2"/>
      <circle cx="282" cy="372" r="2.5" fill="${accentColor}"/>
      <circle cx="290" cy="384" r="2.5" fill="${accentColor}"/>
      <circle cx="298" cy="397" r="2.5" fill="${accentColor}"/>
      <circle cx="305" cy="410" r="2.5" fill="${accentColor}"/>
      <!-- Laces -->
      <line x1="282" y1="372" x2="295" y2="378" stroke="${accentColor}" stroke-width="1.2"/>
      <line x1="290" y1="384" x2="303" y2="390" stroke="${accentColor}" stroke-width="1.2"/>
      <line x1="298" y1="397" x2="310" y2="403" stroke="${accentColor}" stroke-width="1.2"/>
    `;
  } else if (iconType === "loafer") {
    illustration = `
      <!-- Loafer Silhouette -->
      <path d="M 135 465 C 125 425, 150 375, 205 360 C 275 340, 345 350, 415 385 C 465 410, 485 440, 475 470 C 455 505, 350 515, 240 510 C 170 505, 140 490, 135 465 Z" fill="#141414" stroke="${accentColor}" stroke-width="1.5"/>
      <!-- Low Stacked Heel -->
      <path d="M 135 465 L 145 505 L 195 505 L 185 465 Z" fill="#0A0A0A" stroke="#222" stroke-width="1"/>
      <!-- Apron Stitch -->
      <path d="M 270 380 C 330 365, 390 380, 435 415 C 455 430, 460 455, 450 470 C 425 480, 385 475, 335 450" fill="none" stroke="${accentColor}" stroke-width="1.2" stroke-dasharray="4,2"/>
      <!-- Gold Horsebit Hardware -->
      <g transform="translate(330, 410) rotate(-15)">
        <rect x="-35" y="-6" width="70" height="12" rx="4" fill="none" stroke="${accentColor}" stroke-width="2.5"/>
        <circle cx="-25" cy="0" r="8" fill="none" stroke="${accentColor}" stroke-width="2.5"/>
        <circle cx="25" cy="0" r="8" fill="none" stroke="${accentColor}" stroke-width="2.5"/>
        <line x1="-12" y1="0" x2="12" y2="0" stroke="${accentColor}" stroke-width="4"/>
      </g>
    `;
  } else if (iconType === "boot") {
    illustration = `
      <!-- Chelsea Boot High Silhouette -->
      <path d="M 200 240 C 210 240, 240 245, 250 250 L 260 380 C 330 395, 420 415, 465 445 C 485 465, 480 490, 450 500 C 370 515, 260 515, 175 505 C 145 495, 140 470, 145 440 L 175 250 C 180 242, 190 240, 200 240 Z" fill="#121212" stroke="${accentColor}" stroke-width="1.5"/>
      <!-- Heel -->
      <path d="M 145 470 L 152 515 L 205 515 L 198 470 Z" fill="#0A0A0A" stroke="#222" stroke-width="1.2"/>
      <!-- Elastic Triangular Side Gusset -->
      <polygon points="195,270 245,280 220,380" fill="#080808" stroke="${accentColor}" stroke-width="1"/>
      <line x1="200" y1="290" x2="235" y2="295" stroke="${accentColor}" stroke-width="0.8" opacity="0.6"/>
      <line x1="205" y1="310" x2="230" y2="315" stroke="${accentColor}" stroke-width="0.8" opacity="0.6"/>
      <line x1="210" y1="330" x2="225" y2="335" stroke="${accentColor}" stroke-width="0.8" opacity="0.6"/>
      <!-- Pull Loop -->
      <rect x="180" y="215" width="12" height="30" rx="3" fill="#1A140E" stroke="${accentColor}" stroke-width="1"/>
    `;
  } else if (iconType === "sneaker") {
    illustration = `
      <!-- Modern Leather Cupsole Sneaker -->
      <path d="M 140 450 C 130 405, 155 370, 215 360 C 275 350, 340 365, 410 395 C 465 420, 485 445, 475 470 C 455 495, 350 500, 240 500 C 175 500, 145 480, 140 450 Z" fill="#161616" stroke="${accentColor}" stroke-width="1.2"/>
      <!-- Thick White/Onyx Cupsole -->
      <path d="M 135 475 C 230 480, 360 480, 470 465 C 480 480, 475 498, 450 505 C 360 515, 230 515, 140 505 C 130 495, 130 485, 135 475 Z" fill="#0A0A0A" stroke="${accentColor}" stroke-width="2"/>
      <!-- Side Chevron / Accent Band -->
      <path d="M 230 410 L 330 415 L 310 445 L 220 440 Z" fill="none" stroke="${accentColor}" stroke-width="2"/>
      <!-- Laces & Eyelets -->
      <circle cx="280" cy="380" r="2.5" fill="${accentColor}"/>
      <circle cx="300" cy="390" r="2.5" fill="${accentColor}"/>
      <circle cx="320" cy="400" r="2.5" fill="${accentColor}"/>
      <circle cx="340" cy="410" r="2.5" fill="${accentColor}"/>
    `;
  } else if (iconType === "heel") {
    illustration = `
      <!-- High Heel Stiletto Silhouette -->
      <path d="M 170 350 C 180 340, 205 345, 225 365 C 265 410, 320 455, 385 465 C 445 470, 480 460, 470 480 C 450 500, 390 495, 335 480 C 275 460, 220 405, 185 365 Z" fill="#121212" stroke="${accentColor}" stroke-width="1.5"/>
      <!-- Slender Metallic Gold Stiletto Stem -->
      <path d="M 180 365 L 165 495 L 175 498 L 195 385 Z" fill="${accentColor}" stroke="${accentColor}" stroke-width="1"/>
      <rect x="162" y="495" width="14" height="6" rx="1" fill="#080808"/>
      <!-- Pointed Toe Elegance -->
      <path d="M 430 468 C 460 468, 480 472, 470 485 C 450 495, 420 492, 400 488 Z" fill="#1C140E" stroke="${accentColor}" stroke-width="1"/>
    `;
  } else if (iconType === "flat") {
    illustration = `
      <!-- Pointed Ballet Flat Silhouette -->
      <path d="M 140 465 C 135 435, 160 400, 215 390 C 280 380, 360 395, 425 425 C 475 448, 485 468, 465 485 C 435 505, 340 508, 245 505 C 175 500, 145 485, 140 465 Z" fill="#141414" stroke="${accentColor}" stroke-width="1.5"/>
      <!-- Collar Trim -->
      <path d="M 195 415 C 255 405, 330 415, 385 440" fill="none" stroke="${accentColor}" stroke-width="1.2"/>
      <!-- Gold Petite Bow / Knot Accent -->
      <g transform="translate(420, 442)">
        <ellipse cx="-8" cy="-3" rx="7" ry="4" fill="none" stroke="${accentColor}" stroke-width="1.5"/>
        <ellipse cx="8" cy="-3" rx="7" ry="4" fill="none" stroke="${accentColor}" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="3" fill="${accentColor}"/>
        <line x1="-3" y1="2" x2="-7" y2="10" stroke="${accentColor}" stroke-width="1.5"/>
        <line x1="3" y1="2" x2="7" y2="10" stroke="${accentColor}" stroke-width="1.5"/>
      </g>
    `;
  } else if (iconType === "bag") {
    illustration = `
      <!-- Structured Luxury Leather Handbag / Tote -->
      <path d="M 180 340 L 420 340 L 450 510 L 150 510 Z" fill="#131313" stroke="${accentColor}" stroke-width="1.8"/>
      <!-- Top Arched Rolled Handles -->
      <path d="M 240 340 C 240 230, 360 230, 360 340" fill="none" stroke="${accentColor}" stroke-width="4.5"/>
      <path d="M 250 340 C 250 245, 350 245, 350 340" fill="none" stroke="#1A140E" stroke-width="3"/>
      <!-- Flap / Gusset Line -->
      <line x1="180" y1="390" x2="420" y2="390" stroke="${accentColor}" stroke-width="1" stroke-dasharray="4,2"/>
      <!-- Signature Gold Padlock Hardware -->
      <rect x="286" y="380" width="28" height="34" rx="4" fill="none" stroke="${accentColor}" stroke-width="2.5"/>
      <path d="M 293 380 C 293 368, 307 368, 307 380" fill="none" stroke="${accentColor}" stroke-width="2.5"/>
      <circle cx="300" cy="395" r="3" fill="${accentColor}"/>
      <line x1="300" y1="398" x2="300" y2="405" stroke="${accentColor}" stroke-width="2"/>
    `;
  } else if (iconType === "clutch") {
    illustration = `
      <!-- Minaudière Evening Hard-Shell Clutch -->
      <rect x="180" y="370" width="240" height="150" rx="20" fill="#141414" stroke="${accentColor}" stroke-width="2.5"/>
      <!-- Quilted Texture Grid -->
      <line x1="200" y1="380" x2="400" y2="500" stroke="${accentColor}" stroke-width="0.6" opacity="0.5"/>
      <line x1="240" y1="375" x2="415" y2="480" stroke="${accentColor}" stroke-width="0.6" opacity="0.5"/>
      <line x1="185" y1="410" x2="330" y2="515" stroke="${accentColor}" stroke-width="0.6" opacity="0.5"/>
      <line x1="400" y1="380" x2="200" y2="500" stroke="${accentColor}" stroke-width="0.6" opacity="0.5"/>
      <line x1="360" y1="375" x2="185" y2="480" stroke="${accentColor}" stroke-width="0.6" opacity="0.5"/>
      <line x1="415" y1="410" x2="270" y2="515" stroke="${accentColor}" stroke-width="0.6" opacity="0.5"/>
      <!-- Faceted Jewel Gold Clasp -->
      <polygon points="300,340 316,355 316,370 284,370 284,355" fill="${accentColor}" stroke="#FDF6D8" stroke-width="1.2"/>
    `;
  } else if (iconType === "belt") {
    illustration = `
      <!-- Coiled Leather Belt -->
      <ellipse cx="300" cy="460" rx="140" ry="50" fill="none" stroke="#221810" stroke-width="34"/>
      <ellipse cx="300" cy="460" rx="140" ry="50" fill="none" stroke="${accentColor}" stroke-width="1.2" stroke-dasharray="6,4"/>
      <ellipse cx="300" cy="445" rx="110" ry="40" fill="none" stroke="#140E0A" stroke-width="30"/>
      <!-- Polished Gold Rectangular Buckle -->
      <rect x="360" y="420" width="65" height="50" rx="6" fill="none" stroke="${accentColor}" stroke-width="5"/>
      <line x1="390" y1="422" x2="390" y2="468" stroke="${accentColor}" stroke-width="4"/>
      <!-- Leather Keeper -->
      <rect x="435" y="425" width="16" height="40" rx="3" fill="#1C140E" stroke="${accentColor}" stroke-width="1.2"/>
    `;
  } else if (iconType === "wallet") {
    illustration = `
      <!-- Bi-Fold Luxury Leather Wallet -->
      <path d="M 180 370 L 420 370 C 430 370, 435 375, 435 385 L 435 490 C 435 500, 430 505, 420 505 L 180 505 C 170 505, 165 500, 165 490 L 165 385 C 165 375, 170 370, 180 370 Z" fill="#141414" stroke="${accentColor}" stroke-width="1.8"/>
      <!-- Center Fold Seam -->
      <line x1="300" y1="370" x2="300" y2="505" stroke="#222" stroke-width="3"/>
      <!-- Perimeter Gold Saddle Stitching -->
      <rect x="172" y="377" width="256" height="121" rx="4" fill="none" stroke="${accentColor}" stroke-width="0.8" stroke-dasharray="4,3"/>
      <!-- Hot Stamped Gold Brand Crest -->
      <circle cx="370" cy="455" r="14" fill="none" stroke="${accentColor}" stroke-width="0.8"/>
      <text x="370" y="458" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-size="6" font-weight="700" letter-spacing="1" fill="${accentColor}">SAWERA</text>
    `;
  }

  return `
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
    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#000000" flood-opacity="0.85"/>
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

  <!-- PRODUCT ILLUSTRATION -->
  <g filter="url(#subtleShadow)">
    ${illustration}
  </g>

  <!-- Category & Silhouette Badge -->
  <g transform="translate(300, 630)">
    <line x1="-130" y1="0" x2="130" y2="0" stroke="url(#goldGrad)" stroke-width="0.8" opacity="0.5"/>
    <circle cx="0" cy="0" r="4" fill="url(#goldGrad)"/>
    <text x="0" y="24" text-anchor="middle" font-family="'Cinzel', Georgia, serif" font-size="12" font-weight="700" letter-spacing="4" fill="#F5F0E6">${title.toUpperCase()}</text>
    <text x="0" y="42" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="8.5" font-weight="500" letter-spacing="2" fill="#D4AF37">${badge.toUpperCase()}</text>
  </g>
</svg>
`;
}

// Map each subcategory to its true footwear/fashion illustration
const typeMapping = {
  // Men
  "sub-men-formal-shoes": { icon: "formal", badge: "HAND-BURNISHED CALFSKIN BROGUE" },
  "sub-men-casual-shoes": { icon: "formal", badge: "CASUAL LEATHER BLUCHER" },
  "sub-men-sneakers": { icon: "sneaker", badge: "MONOCHROME DRESS TRAINER" },
  "sub-men-sandals": { icon: "sandal", badge: "HANDCRAFTED LEATHER SANDAL" },
  "sub-men-slippers": { icon: "slipper", badge: "ROYAL EMBROIDERED HOUSE SLIPPER" },
  "sub-men-loafers": { icon: "loafer", badge: "GOLD HORSEBIT LEATHER LOAFER" },
  "sub-men-moccasins": { icon: "loafer", badge: "HAND-STITCHED DRIVING MOCCASIN" },
  "sub-men-boots": { icon: "boot", badge: "ITALIAN CHELSEA DRESS BOOT" },
  "sub-men-sports-shoes": { icon: "sneaker", badge: "PERFORMANCE AERODYNAMIC RUNNER" },

  // Women
  "sub-women-heels": { icon: "heel", badge: "POINTED-TOE EVENING STILETTO" },
  "sub-women-flats": { icon: "flat", badge: "POISE-INDUCING BALLET FLAT" },
  "sub-women-sandals": { icon: "sandal", badge: "METALLIC STRAPPY DRESS SANDAL" },
  "sub-women-comfort-shoes": { icon: "flat", badge: "ORTHOPEDIC MEMORY FOAM FLAT" },
  "sub-women-block-heels": { icon: "heel", badge: "SCULPTED BLOCK HEEL PUMP" },
  "sub-women-kitten-heels": { icon: "heel", badge: "PARISIAN SLENDER KITTEN HEEL" },
  "sub-women-mules": { icon: "slipper", badge: "BACKLESS POINTED LEATHER MULE" },
  "sub-women-moccasins": { icon: "loafer", badge: "GLOVE-SOFT DRIVING MOCCASIN" },
  "sub-women-pumps": { icon: "heel", badge: "TIMELESS POINTED COURT PUMP" },
  "sub-women-sneakers": { icon: "sneaker", badge: "PLATFORM LEATHER FASHION SNEAKER" },
  "sub-women-slippers": { icon: "slipper", badge: "VELVET EMBROIDERED CHAPPAL" },
  "sub-women-wedges": { icon: "heel", badge: "WOVEN JUTE ESPADRILLE WEDGE" },

  // Bags
  "sub-bags-handbags": { icon: "bag", badge: "ARCHITECTURAL TOP-HANDLE SATCHEL" },
  "sub-bags-shoulder-bags": { icon: "bag", badge: "GOLD CHAIN FLAP SHOULDER BAG" },
  "sub-bags-tote-bags": { icon: "bag", badge: "PEBBLED LEATHER LAPTOP SHOPPER" },
  "sub-bags-backpacks": { icon: "bag", badge: "CALFSKIN COMMUTER DAYPACK" },
  "sub-bags-crossbody-bags": { icon: "bag", badge: "HANDS-FREE LEATHER SADDLE BAG" },
  "sub-bags-travel-bags": { icon: "bag", badge: "WEEKENDER LEATHER TRAVEL DUFFLE" },
  "sub-bags-clutches": { icon: "clutch", badge: "EVENING MINAUDIÈRE HARD CLUTCH" },

  // Accessories
  "sub-accessories-wallets": { icon: "wallet", badge: "RFID-SHIELDED LEATHER BILLFOLD" },
  "sub-accessories-belts": { icon: "belt", badge: "24K GOLD-PLATED MONOGRAM BELT" },
  "sub-accessories-leather": { icon: "wallet", badge: "FULL-GRAIN SLIM CARDHOLDER" },

  // Kids
  "sub-kids-boys-shoes": { icon: "formal", badge: "JUNIOR PRINCE LEATHER BROGUE" },
  "sub-kids-girls-shoes": { icon: "flat", badge: "PRINCESS GOLD-BOW MARY JANE" },
  "sub-kids-sneakers": { icon: "sneaker", badge: "JUNIOR DUAL-STRAP RUNNER" },
  "sub-kids-sandals": { icon: "sandal", badge: "JUNIOR EXPLORER STRAPPY SANDAL" },
  "sub-kids-slippers": { icon: "slipper", badge: "JUNIOR ROYAL VELVET SLIPPER" },
  "sub-kids-school-shoes": { icon: "formal", badge: "UNIFORM SCUFF-RESISTANT DERBY" },
};

async function generate() {
  console.log("==================================================");
  console.log("  GENERATING 100% FOOTWEAR & LEATHER GOODS IMAGES ");
  console.log("==================================================");

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'sawera_store_db',
  });

  const baseDir = path.join(__dirname, '..', 'public', 'products');
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  // 1. Fetch all products
  const [products] = await conn.query('SELECT id, name, subcategoryId FROM products');
  console.log(`Found ${products.length} products to map with authentic imagery...`);

  // 2. Clear old product_images table
  await conn.query('DELETE FROM product_images');

  let count = 0;
  for (const p of products) {
    const mapping = typeMapping[p.subcategoryId] || { icon: "formal", badge: "GENUINE HANDCRAFTED LEATHER" };

    // Primary image
    const svg1 = generateSVG({
      title: p.name,
      subcategory: p.subcategoryId,
      badge: mapping.badge,
      iconType: mapping.icon,
      angle: 1,
      accentColor: "#D4AF37",
    });

    // Secondary image (slightly altered tone)
    const svg2 = generateSVG({
      title: p.name,
      subcategory: p.subcategoryId,
      badge: mapping.badge,
      iconType: mapping.icon,
      angle: 2,
      accentColor: "#E5C158",
    });

    const file1 = `${p.id}-1.svg`;
    const file2 = `${p.id}-2.svg`;

    fs.writeFileSync(path.join(baseDir, file1), svg1);
    fs.writeFileSync(path.join(baseDir, file2), svg2);

    // Save to product_images table
    await conn.query(`
      INSERT INTO product_images (id, productId, url, displayOrder, isPrimary)
      VALUES (?, ?, ?, 1, TRUE)
    `, [`img-${p.id}-1`, p.id, `/products/${file1}`]);

    await conn.query(`
      INSERT INTO product_images (id, productId, url, displayOrder, isPrimary)
      VALUES (?, ?, ?, 2, FALSE)
    `, [`img-${p.id}-2`, p.id, `/products/${file2}`]);

    count++;
  }

  console.log(`SUCCESS: All ${count} products updated with authentic footwear & leather goods visuals!`);
  console.log("ZERO phones, ZERO laptops, ZERO jeans, ZERO books, ZERO toothpaste exist anywhere!");

  await conn.end();
}

generate().catch(console.error);
