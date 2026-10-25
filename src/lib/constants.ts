export const BRAND = {
  name: "ROYAL SHOES",
  edition: "BLACK & GOLD EDITION",
  tagline: "STEP INTO ELEGANCE",
  domain: "royalshoes.store",
  description: "Curators of refined international footwear, handcrafted leather goods, and timeless accessories.",
  contact: {
    phoneDisplay: "03481702710",
    phoneTel: "tel:+923481702710",
    whatsappIntl: "923481702710",
    whatsappUrl: "https://wa.me/923481702710",
    country: "Pakistan",
    cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Jhang", "Nationwide Delivery"],
  },
  colors: {
    primaryBlack: "#F5F0E6",
    secondaryBlack: "#FFFFFF",
    gold: "#795548",
    warmIvory: "#F5F0E6",
    subtleBorder: "#E4DDD3",
  },
  commerce: {
    currency: "PKR",
    currencySymbol: "Rs.",
    freeShippingThreshold: 5000,
    standardShippingFee: 250,
  },
} as const;

export interface CategorySeedDef {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
  subcategories: {
    name: string;
    slug: string;
    description?: string;
  }[];
}

export const MAIN_CATEGORIES: CategorySeedDef[] = [
  {
    name: "ALL",
    slug: "all",
    description: "Discover the complete ROYAL SHOES collection of exquisite footwear, leather bags, and accessories.",
    displayOrder: 1,
    subcategories: [],
  },
  {
    name: "MEN",
    slug: "men",
    description: "Refined gentlemen's footwear crafted from rich leathers and engineered for commanding elegance.",
    displayOrder: 2,
    subcategories: [
      { name: "Formal Shoes", slug: "men-formal-shoes", description: "Classic Oxfords, Derbies, and polished evening shoes." },
      { name: "Casual Shoes", slug: "men-casual-shoes", description: "Refined everyday footwear combining comfort and prestige." },
      { name: "Sneakers", slug: "men-sneakers", description: "Minimalist luxury leather trainers." },
      { name: "Sandals", slug: "men-sandals", description: "Hand-stitched leather sandals for discerning style." },
      { name: "Slippers", slug: "men-slippers", description: "Premium leather slip-ons and slides." },
      { name: "Loafers", slug: "men-loafers", description: "Penny loafers, tassel loafers, and horsebit silhouettes." },
      { name: "Moccasins", slug: "men-moccasins", description: "Supple leather driving moccasins." },
      { name: "Boots", slug: "men-boots", description: "Chelsea boots, chukkas, and lace-up leather dress boots." },
      { name: "Sports Shoes", slug: "men-sports-shoes", description: "High-performance luxury athletic shoes." },
    ],
  },
  {
    name: "WOMEN",
    slug: "women",
    description: "Sophisticated footwear silhouettes crafted with delicate artistry and timeless grace.",
    displayOrder: 3,
    subcategories: [
      { name: "Heels", slug: "women-heels", description: "Statuesque stilettos and statement evening heels." },
      { name: "Flats", slug: "women-flats", description: "Effortless pointed and ballet flats for all-day poise." },
      { name: "Sandals", slug: "women-sandals", description: "Strappy leather sandals with gold hardware accents." },
      { name: "Comfort Shoes", slug: "women-comfort-shoes", description: "Cushioned memory-foam luxury soles." },
      { name: "Block Heels", slug: "women-block-heels", description: "Stable, elegant elevation for work and soirée." },
      { name: "Kitten Heels", slug: "women-kitten-heels", description: "Petite heights with uncompromising luxury charm." },
      { name: "Mules", slug: "women-mules", description: "Backless slip-ons in velvety suedes and full-grain leathers." },
      { name: "Moccasins", slug: "women-moccasins", description: "Hand-tailored feminine driving shoes." },
      { name: "Pumps", slug: "women-pumps", description: "Iconic court shoes with streamlined contours." },
      { name: "Sneakers", slug: "women-sneakers", description: "Chic leather dress trainers." },
      { name: "Slippers", slug: "women-slippers", description: "Opulent leather indoor and lounge mules." },
      { name: "Wedges", slug: "women-wedges", description: "Architectural wedge heels for warm-weather panache." },
    ],
  },
  {
    name: "BAGS",
    slug: "bags",
    description: "Structured handbags and artisanal leather travel accessories designed for life on the move.",
    displayOrder: 4,
    subcategories: [
      { name: "Handbags", slug: "bags-handbags", description: "Structured top-handle signature silhouettes." },
      { name: "Shoulder Bags", slug: "bags-shoulder-bags", description: "Curved shoulder bags with gold chain straps." },
      { name: "Tote Bags", slug: "bags-tote-bags", description: "Spacious everyday leather shoppers." },
      { name: "Backpacks", slug: "bags-backpacks", description: "Executive leather rucksacks." },
      { name: "Crossbody Bags", slug: "bags-crossbody-bags", description: "Compact hands-free statement carriers." },
      { name: "Travel Bags", slug: "bags-travel-bags", description: "Duffels and weekenders in grain leather." },
      { name: "Clutches", slug: "bags-clutches", description: "Minimalist evening clutches with gold clasps." },
    ],
  },
  {
    name: "ACCESSORIES",
    slug: "accessories",
    description: "Impeccably tailored leather belts, wallets, and fine accents to complete the ensemble.",
    displayOrder: 5,
    subcategories: [
      { name: "Wallets", slug: "accessories-wallets", description: "Bi-fold, tri-fold, and zip-around card holders." },
      { name: "Belts", slug: "accessories-belts", description: "Reversible dress belts with brushed gold buckles." },
      { name: "Leather Accessories", slug: "accessories-leather", description: "Key fobs, passport folios, and watch rolls." },
    ],
  },
  {
    name: "KIDS",
    slug: "kids",
    description: "Premium heirloom footwear crafted with the same dedication for the younger generation.",
    displayOrder: 6,
    subcategories: [
      { name: "Boys' Shoes", slug: "kids-boys-shoes", description: "Miniature formal brogues and loafers." },
      { name: "Girls' Shoes", slug: "kids-girls-shoes", description: "Sparkling party flats and Mary Janes." },
      { name: "Sneakers", slug: "kids-sneakers", description: "Durable leather activity trainers." },
      { name: "Sandals", slug: "kids-sandals", description: "Breathable vacation sandals." },
      { name: "Slippers", slug: "kids-slippers", description: "Cozy leather slip-ons." },
      { name: "School Shoes", slug: "kids-school-shoes", description: "Polished black uniform shoes built to last." },
    ],
  },
];
