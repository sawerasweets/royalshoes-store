const mysql = require('mysql2/promise');

async function populate() {
  console.log("==================================================");
  console.log("  POPULATING 6 PRODUCTS PER SUBCATEGORY (ALL 37)  ");
  console.log("==================================================");

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'sawera_store_db',
    multipleStatements: true,
  });

  // Available real product photos from POS recovery
  const recoveredImages = [
    "/products/1618825646.jpg",
    "/products/1618825870.jpg",
    "/products/1618826402.jpg",
    "/products/1618826514.jpg",
    "/products/1618826643.jpeg",
    "/products/1618826786.JPG",
    "/products/1618826914.png",
    "/products/1618827036.jpg",
    "/products/1618827118.jpg",
    "/products/1618827333.jpg",
    "/products/1618827428.jpg",
    "/products/1618827581.png",
    "/products/1618827642.jpg",
    "/products/1618827714.jpg",
    "/products/1683458548.png",
    "/products/1683458611.jpg",
    "/products/1683458633.jpg",
    "/products/1683458711.png",
    "/products/1683458723.png",
  ];

  // Complete data matrix: 37 subcategories, each with exactly 6 products
  const catalogData = {
    // ------------------------------------------------------------------------
    // 1. MEN (9 subcategories * 6 = 54 products)
    // ------------------------------------------------------------------------
    "sub-men-formal-shoes": {
      category: "cat-men",
      type: "shoes_men",
      products: [
        {
          name: "Imperial Black Oxford Brogues",
          price: 8950,
          originalPrice: 10500,
          desc: "Hand-selected full-grain Italian calfskin with Goodyear-welted construction. Finished in deep onyx black with signature gold-foil insole stamping.",
          colors: ["Onyx Black", "Rich Burgundy"],
        },
        {
          name: "Sovereign Wholecut Oxford",
          price: 9450,
          originalPrice: 11200,
          desc: "Seamless single piece of box calfskin, mirror hand-burnished toe cap, natural vegetable-tanned leather sole with rubber heel lift.",
          colors: ["Midnight Black", "Cognac Brown"],
        },
        {
          name: "Monarch Double Monk Strap",
          price: 8750,
          originalPrice: 10200,
          desc: "Dual solid brass gold-tone buckles, vegetable-tanned leather sole, breathable goat leather lining and cushioned footbed.",
          colors: ["Onyx Black", "Deep Mahogany"],
        },
        {
          name: "Royal Cap-Toe Derby Shoes",
          price: 7950,
          originalPrice: 9500,
          desc: "Classic open-lacing Derby silhouette, memory foam leather footbed, channel-stitched sole for lasting boardroom elegance.",
          colors: ["Classic Black", "Espresso Tan"],
        },
        {
          name: "Aureus Patent Leather Tuxedo Shoe",
          price: 9850,
          originalPrice: 12000,
          desc: "High-gloss patent calf leather, grosgrain collar piping, cushioned evening insole designed for formal galas and weddings.",
          colors: ["Mirror Black"],
        },
        {
          name: "Regent Wingtip Semi-Brogue",
          price: 8250,
          originalPrice: 9900,
          desc: "Perforated medallion toe, breathable leather lining, anti-skid rubber insert embedded in leather sole for confident all-day traction.",
          colors: ["Midnight Black", "Oxblood"],
        },
      ],
    },

    "sub-men-casual-shoes": {
      category: "cat-men",
      type: "shoes_men",
      products: [
        {
          name: "Kensington Handcrafted Casual Derby",
          price: 6450,
          originalPrice: 7500,
          desc: "Oiled pull-up cowhide leather, contrast welt stitching, flexible crepe rubber sole engineered for effortless urban commuting.",
          colors: ["Vintage Brown", "Onyx Black"],
        },
        {
          name: "Riviera Leather Boat Shoe",
          price: 5850,
          originalPrice: 6900,
          desc: "360-degree rawhide lacing, siped non-marking rubber outsole, water-resistant oiled nubuck upper with rust-resistant brass eyelets.",
          colors: ["Navy / Tan", "Cognac Brown"],
        },
        {
          name: "Milano Suede Casual Slip-on",
          price: 6250,
          originalPrice: 7400,
          desc: "Velvety Italian suede upper, padded collar, arch-supporting memory insole and lightweight EVA traction sole.",
          colors: ["Tobacco Suede", "Midnight Navy"],
        },
        {
          name: "Nomad Burnished Oxford Casual",
          price: 5950,
          originalPrice: 7000,
          desc: "Hand-burnished tumbled cowhide, lightweight EVA wedge sole, breathable moisture-wicking lining.",
          colors: ["Chestnut Brown", "Jet Black"],
        },
        {
          name: "Heritage Penny Casual Shoe",
          price: 6750,
          originalPrice: 7800,
          desc: "Classic beefroll hand-stitching, soft leather sockliner, durable daily rubber sole with flexible forefoot groove.",
          colors: ["Warm Tan", "Onyx Black"],
        },
        {
          name: "Urban Edge Commuter Shoe",
          price: 6150,
          originalPrice: 7200,
          desc: "Supple Nappa leather, shock-absorbing midsole, all-day comfort profile with padded tongue and collar.",
          colors: ["Matte Black", "Dark Mocha"],
        },
      ],
    },

    "sub-men-sneakers": {
      category: "cat-men",
      type: "shoes_men",
      products: [
        {
          name: "Monochrome Minimalist Dress Sneakers",
          price: 6990,
          originalPrice: 7990,
          desc: "Clean low-top sneakers in pristine Italian box calf leather with discreet gold eyelets, waxed cotton laces, and durable cupsoles.",
          colors: ["Obsidian Black", "Warm Ivory"],
        },
        {
          name: "Sovereign Low-Top Leather Trainer",
          price: 7450,
          originalPrice: 8800,
          desc: "Multi-panel smooth and perforated leather, Margom rubber sole, gold foil lettering on padded tongue.",
          colors: ["Black / Gold", "Pure White"],
        },
        {
          name: "Apex Chunky Luxury Runner",
          price: 8250,
          originalPrice: 9800,
          desc: "Mixed leather and suede panels, sculpted architectural midsole, breathable mesh lining with high-rebound cushioning.",
          colors: ["Onyx / Charcoal", "Sand / Black"],
        },
        {
          name: "Royal Suede Court Sneaker",
          price: 6750,
          originalPrice: 7900,
          desc: "Buttery calf suede upper, padded collar, vulcanized rubber sole with reinforced toe cap and gold aglet accents.",
          colors: ["Jet Black", "Forest Green"],
        },
        {
          name: "Prestige Slip-On Skate Sneaker",
          price: 5950,
          originalPrice: 6950,
          desc: "Elasticated gussets, smooth grain leather, memory foam cushioned footbed and waffle textured anti-slip outsole.",
          colors: ["Midnight Black", "Warm White"],
        },
        {
          name: "Vanguard High-Top Leather Sneaker",
          price: 8950,
          originalPrice: 10500,
          desc: "Ankle-height support, padded collar, side zip for effortless wear, dual-tone leather panels and gold hardware.",
          colors: ["Black & Gold", "Oxblood"],
        },
      ],
    },

    "sub-men-sandals": {
      category: "cat-men",
      type: "shoes_men",
      products: [
        {
          name: "Sovereign Handcrafted Leather Sandal",
          price: 4850,
          originalPrice: 5800,
          desc: "Full-grain cowhide cross-straps, ergonomic cork footbed, rust-proof gold buckles and durable anti-skid rubber base.",
          colors: ["Onyx Black", "Cognac Brown"],
        },
        {
          name: "Imperial Peshawari Chappal Sandal",
          price: 5450,
          originalPrice: 6500,
          desc: "Handcrafted traditional semi-pointed toe, double-soled tyre grip, pure buffalo leather with gold-embossed insole.",
          colors: ["Classic Black", "Rich Mustard Brown"],
        },
        {
          name: "Riviera Buckled Slide Sandal",
          price: 4250,
          originalPrice: 4950,
          desc: "Dual adjustable straps, oiled leather upper, moisture-wicking suede footbed with deep heel cup.",
          colors: ["Dark Brown", "Jet Black"],
        },
        {
          name: "Aristocrat Roman Strapped Sandal",
          price: 4950,
          originalPrice: 5900,
          desc: "Multi-strap ankle wrap design, soft calfskin lining, durable grooved rubber outsole for warm-weather elegance.",
          colors: ["Midnight Black", "Antique Tan"],
        },
        {
          name: "Artisanal Kolhapuri Leather Sandal",
          price: 3950,
          originalPrice: 4800,
          desc: "Hand-braided leather cord, vegetable-tanned leather sole, authentic artisanal stitching with cushioned heel pad.",
          colors: ["Natural Brown", "Burnished Black"],
        },
        {
          name: "Signature Nubuck Comfort Sandal",
          price: 4650,
          originalPrice: 5500,
          desc: "Velvet nubuck leather, contoured arch support, shock-dispersing rubber base with adjustable hook-and-loop heel strap.",
          colors: ["Onyx Black", "Olive Suede"],
        },
      ],
    },

    "sub-men-slippers": {
      category: "cat-men",
      type: "shoes_men",
      products: [
        {
          name: "Imperial Velvet Embroidered House Slipper",
          price: 4950,
          originalPrice: 5900,
          desc: "Midnight plush velvet with hand-embroidered gold crest, quilted satin lining, low leather heel with rubber tap.",
          colors: ["Midnight Black", "Royal Burgundy"],
        },
        {
          name: "Sovereign Calfskin Mules Slipper",
          price: 4450,
          originalPrice: 5200,
          desc: "Backless slide in ultra-soft sheepskin, cushioned leather insole, outdoor-grade textured rubber sole.",
          colors: ["Onyx Black", "Cognac Brown"],
        },
        {
          name: "Monarch Leather Slide Slipper",
          price: 3850,
          originalPrice: 4600,
          desc: "Wide grain-leather vamp, memory foam footbed, embossed SAWERA gold insignia, water-resistant non-slip base.",
          colors: ["Classic Black", "Espresso Tan"],
        },
        {
          name: "Royal Orthopedic Leather Chappal Slipper",
          price: 3950,
          originalPrice: 4700,
          desc: "Medically contoured arch support, breathable soft leather, non-skid textured base for daily comfort.",
          colors: ["Onyx Black", "Dark Brown"],
        },
        {
          name: "Heritage Hand-Stitched Leather Slipper",
          price: 3650,
          originalPrice: 4300,
          desc: "Traditional open-back silhouette, natural oil-treated leather, supple daily comfort with reinforced toe post.",
          colors: ["Black", "Mustard Brown"],
        },
        {
          name: "Aureus Shearling Indoor Slipper",
          price: 5250,
          originalPrice: 6200,
          desc: "Genuine sheep shearling interior, smooth calfskin exterior, quiet EVA indoor-outdoor sole.",
          colors: ["Jet Black", "Chestnut"],
        },
      ],
    },

    "sub-men-loafers": {
      category: "cat-men",
      type: "shoes_men",
      products: [
        {
          name: "Aureus Gold Bit Velvet Loafers",
          price: 7450,
          originalPrice: 8800,
          desc: "Opulent evening loafers in plush midnight black velvet crowned with a brushed gold horsebit ornament. Lined in breathable goat leather.",
          colors: ["Midnight Black", "Antique Brown"],
        },
        {
          name: "Sovereign Penny Calfskin Loafers",
          price: 8250,
          originalPrice: 9600,
          desc: "Hand-sewn saddle strap with classic penny cutout, burnished crust leather, full leather insole and stacked heel.",
          colors: ["Onyx Black", "Rich Burgundy"],
        },
        {
          name: "Windsor Tassel Suede Loafers",
          price: 7850,
          originalPrice: 9200,
          desc: "Dual hand-rolled tassels, rich chocolate Italian suede, Blake-stitched sole construction with padded footbed.",
          colors: ["Chocolate Brown", "Onyx Black"],
        },
        {
          name: "Kensington Woven Leather Loafers",
          price: 8950,
          originalPrice: 10500,
          desc: "Intricately hand-interlaced leather vamp, flexible moc construction, soft goat leather lining.",
          colors: ["Tan Woven", "Black Woven"],
        },
        {
          name: "St. James Formal Evening Loafers",
          price: 8450,
          originalPrice: 9900,
          desc: "Polished box calf, grosgrain collar trim, low stacked leather heel with rubber tap, gold embossed crest on footbed.",
          colors: ["Mirror Black"],
        },
        {
          name: "Amalfi Casual Driving Loafers",
          price: 6950,
          originalPrice: 8200,
          desc: "Pebbled leather, flexible split rubber sole, effortless slip-on elegance with contrast apron stitching.",
          colors: ["Navy Blue", "Cognac Brown"],
        },
      ],
    },

    "sub-men-moccasins": {
      category: "cat-men",
      type: "shoes_men",
      products: [
        {
          name: "Sovereign Grain Leather Driving Moccasins",
          price: 6850,
          originalPrice: 7900,
          desc: "Supple tumbled leather driving shoes with hand-stitched apron toe and flexible studded rubber soles.",
          colors: ["Cognac Tan", "Onyx Black"],
        },
        {
          name: "Aristocrat Nubuck Tie Moccasins",
          price: 6450,
          originalPrice: 7600,
          desc: "Soft nubuck leather, functional 360-degree lace tie with gold eyelets, padded footbed and driver rubber pods.",
          colors: ["Espresso Brown", "Midnight Black"],
        },
        {
          name: "Belgravia Horsebit Moccasins",
          price: 7250,
          originalPrice: 8500,
          desc: "Antique gold hardware bit, glove-soft leather lining, reinforced heel counter and shock-absorbing insole.",
          colors: ["Onyx Black", "Deep Mahogany"],
        },
        {
          name: "Capri Perforated Summer Moccasins",
          price: 5950,
          originalPrice: 6950,
          desc: "Laser-perforated breathable leather, moisture-absorbing insole, ultra-light rubber sole for warm days.",
          colors: ["Warm Tan", "Slate Gray"],
        },
        {
          name: "Heritage Penny Moccasins",
          price: 6650,
          originalPrice: 7800,
          desc: "Unlined glove calfskin for maximum barefoot softness, hand-stitched moccasin seam, flexible driving outsole.",
          colors: ["Dark Brown", "Jet Black"],
        },
        {
          name: "Viceroy Suede Driving Moccasins",
          price: 6750,
          originalPrice: 7950,
          desc: "Water-repellent suede, segmented rubber driving outsole, embossed logo crest on padded tongue.",
          colors: ["Tobacco Suede", "Navy Suede"],
        },
      ],
    },

    "sub-men-boots": {
      category: "cat-men",
      type: "shoes_men",
      products: [
        {
          name: "Black & Gold Chelsea Dress Boots",
          price: 11500,
          originalPrice: 13900,
          desc: "Streamlined Chelsea boots featuring elasticated side gussets woven with subtle gold lurex threads and a hand-burnished Italian leather silhouette.",
          colors: ["Onyx Black"],
        },
        {
          name: "Sovereign Wingtip Brogue Boots",
          price: 12850,
          originalPrice: 14900,
          desc: "High-ankle brogued silhouette, speed hooks, storm welt, Commando lug sole for rugged all-weather luxury.",
          colors: ["Rich Cognac", "Onyx Black"],
        },
        {
          name: "Royal Jodhpur Strap Boots",
          price: 11950,
          originalPrice: 13800,
          desc: "Wrap-around ankle strap with gold buckle, single-piece vamp, stacked leather heel and channel-stitched sole.",
          colors: ["Midnight Black", "Oxblood"],
        },
        {
          name: "Knightsbridge Leather Chukka Boots",
          price: 9850,
          originalPrice: 11500,
          desc: "3-eyelet desert boot profile, supple calf suede, natural crepe sole, comfortable padded insole.",
          colors: ["Dark Snuff Suede", "Black Suede"],
        },
        {
          name: "Vanguard Combat Dress Boots",
          price: 13500,
          originalPrice: 15900,
          desc: "Inside zipper for easy entry, reinforced toe cap, heavy-duty rubber sole with gold eyelets and waxed laces.",
          colors: ["Matte Black"],
        },
        {
          name: "Mayfair Zip Ankle Boots",
          price: 10950,
          originalPrice: 12800,
          desc: "Clean minimalist lines, inside brass zipper, tapered almond toe, polished crust leather and Blake-stitched sole.",
          colors: ["Onyx Black", "Mahogany"],
        },
      ],
    },

    "sub-men-sports-shoes": {
      category: "cat-men",
      type: "shoes_men",
      products: [
        {
          name: "Velocity Pro Aerodynamic Runners",
          price: 6450,
          originalPrice: 7600,
          desc: "High-tenacity breathable knit upper, responsive nitrogen-infused foam midsole, high-traction rubber outsole.",
          colors: ["Black / Gold", "Smoke Gray"],
        },
        {
          name: "Apex Leather Court Tennis Shoes",
          price: 6850,
          originalPrice: 8000,
          desc: "Reinforced lateral leather support, non-marking herringbone grip, padded heel cup and high-density foam insole.",
          colors: ["Onyx Black", "White / Navy"],
        },
        {
          name: "Carbon Strider Performance Trainers",
          price: 7250,
          originalPrice: 8500,
          desc: "Lightweight carbon-plate propulsion, breathable mesh panels, reflective gold accents and moisture-wicking sockliner.",
          colors: ["Stealth Black", "Solar Gold"],
        },
        {
          name: "Stealth All-Terrain Trail Shoes",
          price: 6950,
          originalPrice: 8200,
          desc: "Ripstop water-resistant upper, deep cleated rubber lugs, protective rock plate and speed-lacing system.",
          colors: ["Onyx Black", "Army Olive"],
        },
        {
          name: "Kinetic High-Bounce Gym Trainers",
          price: 5950,
          originalPrice: 6950,
          desc: "Seamless sock-fit collar, multi-directional traction, shock-absorbing insole for gym and athletic training.",
          colors: ["Jet Black", "White / Gold"],
        },
        {
          name: "Quantum Ultra-Light Walking Shoes",
          price: 5450,
          originalPrice: 6400,
          desc: "Ergonomic arch support, ultra-breathable flyknit, featherlight EVA outsole engineered for high daily step counts.",
          colors: ["All Black", "Charcoal Gray"],
        },
      ],
    },

    // ------------------------------------------------------------------------
    // 2. WOMEN (12 subcategories * 6 = 72 products)
    // ------------------------------------------------------------------------
    "sub-women-heels": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Lumina Pointed-Toe Stiletto 100mm",
          price: 7850,
          originalPrice: 9200,
          desc: "Onyx satin calfskin, polished gold stiletto stem, cushioned leather arch pad and red-accented slip-resistant sole.",
          colors: ["Onyx Black", "Metallic Gold"],
        },
        {
          name: "Empress D'Orsay Metallic Pumps",
          price: 8450,
          originalPrice: 9900,
          desc: "Open waist cut, champagne gold metallic leather, padded memory insole and 85mm tapered stiletto heel.",
          colors: ["Champagne Gold", "Black Patent"],
        },
        {
          name: "Sovereign Strappy Evening Stiletto",
          price: 7950,
          originalPrice: 9400,
          desc: "Delicate ankle criss-cross straps, crystal gold buckle, anti-slip leather sole, 95mm high heel.",
          colors: ["Onyx Black", "Rose Gold"],
        },
        {
          name: "Cleo Sculptural Heel Sandal",
          price: 8250,
          originalPrice: 9600,
          desc: "Asymmetric geometric gold heel, supple Nappa leather straps, square toe with arch support.",
          colors: ["Jet Black", "Warm Ivory"],
        },
        {
          name: "Majestic Satin Ankle-Tie Stilettos",
          price: 7650,
          originalPrice: 8900,
          desc: "Black duchess satin ribbons, gold aglets, pointed toe silhouette, 90mm heel for formal gala evenings.",
          colors: ["Midnight Black", "Ruby Red"],
        },
        {
          name: "Mirage Clear Perspex Stiletto",
          price: 7450,
          originalPrice: 8700,
          desc: "Breathable clear vinyl upper, metallic gold insole, sleek 90mm stiletto with cushioned ball-of-foot.",
          colors: ["Gold / Clear", "Silver / Clear"],
        },
      ],
    },

    "sub-women-flats": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Elegance Quilted Leather Ballet Flats",
          price: 5650,
          originalPrice: 6800,
          desc: "Supple lambskin diamond quilting, polished gold logo toe cap, ultra-flexible sole and plush foam insole.",
          colors: ["Onyx Black", "Cream Ivory"],
        },
        {
          name: "Aristocrat Pointed D'Orsay Flats",
          price: 5250,
          originalPrice: 6200,
          desc: "Two-piece silhouette, butter-soft goat leather, padded heel counter and non-skid rubber sole.",
          colors: ["Midnight Black", "Blush Nude"],
        },
        {
          name: "Sovereign Embellished Khussa Flats",
          price: 4850,
          originalPrice: 5800,
          desc: "Handcrafted Zardozi gold thread embroidery, pure cowhide sole, cushioned insole with traditional festive craftsmanship.",
          colors: ["Black / Gold", "Maroon / Gold"],
        },
        {
          name: "Verona Square-Toe Loafer Flats",
          price: 5450,
          originalPrice: 6500,
          desc: "Modern square toe, delicate gold horsebit accent, foldable travel design with supple goat lining.",
          colors: ["Classic Black", "Cognac Tan"],
        },
        {
          name: "Bella Ankle-Strap Ballerina",
          price: 5150,
          originalPrice: 6100,
          desc: "Minimalist cross-ankle strap, smooth calfskin leather, anti-skid rubber sole, cushioned heel cup.",
          colors: ["Onyx Black", "Rose Gold"],
        },
        {
          name: "Riviera Woven Leather Flats",
          price: 5850,
          originalPrice: 6900,
          desc: "Hand-interlaced soft leather vamp, breathable construction, arch-support footbed and flexible sole.",
          colors: ["Warm Tan", "Onyx Black"],
        },
      ],
    },

    "sub-women-sandals": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Golden Solstice Strappy Flat Sandals",
          price: 4450,
          originalPrice: 5200,
          desc: "Multi-strand metallic gold leather, padded footbed, rubberized grip base, delicate ankle buckle.",
          colors: ["Gold & Black", "Metallic Rose"],
        },
        {
          name: "Capri T-Strap Buckle Sandal",
          price: 4250,
          originalPrice: 4950,
          desc: "Elegant central T-strap, adjustable ankle fastener, smooth nappa leather with cushioned insole.",
          colors: ["Onyx Black", "Warm Camel"],
        },
        {
          name: "Sovereign Slide Sandal with Gold Ring",
          price: 4650,
          originalPrice: 5500,
          desc: "Wide band leather, architectural gold hoop emblem, contoured sole with non-slip traction.",
          colors: ["Jet Black", "Ivory White"],
        },
        {
          name: "Athena Gladiatrix Wrap Sandal",
          price: 4950,
          originalPrice: 5900,
          desc: "Extended ankle ties with gold tassels, premium oil-pull leather, flexible low-profile sole.",
          colors: ["Midnight Black", "Tan Leather"],
        },
        {
          name: "St. Tropez Braided Thong Sandal",
          price: 3950,
          originalPrice: 4700,
          desc: "Soft toe post, hand-braided leather strap, flexible low-profile sole with cushioned heel pad.",
          colors: ["Black", "Cognac Brown"],
        },
        {
          name: "Serena Flatform Leather Sandal",
          price: 5250,
          originalPrice: 6200,
          desc: "30mm lightweight flatform, padded footbed, twin buckle closure with gold-tone hardware.",
          colors: ["Onyx Black", "Pure White"],
        },
      ],
    },

    "sub-women-comfort-shoes": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Ortho-Cloud Flexible Leather Slip-on",
          price: 5850,
          originalPrice: 6900,
          desc: "Medically developed arch support, memory foam core, stretch leather side panels and shock-absorbing outsole.",
          colors: ["Onyx Black", "Taupe Gray"],
        },
        {
          name: "Serenita Padded Walking Loafer",
          price: 5650,
          originalPrice: 6700,
          desc: "Glove-soft tumbled leather, shock-absorbing air cushion heel, removable anatomic footbed.",
          colors: ["Classic Black", "Burgundy"],
        },
        {
          name: "Arch-Support Daily Wedge",
          price: 5950,
          originalPrice: 7100,
          desc: "Low 35mm stable wedge, perforated breathable leather, high-density foam base for long working hours.",
          colors: ["Midnight Black", "Beige Tan"],
        },
        {
          name: "Zen Padded Work Ballerina",
          price: 5250,
          originalPrice: 6200,
          desc: "Seamless inner lining prevents rubbing, reinforced arch cushion, non-slip rubber grip.",
          colors: ["Jet Black", "Navy Blue"],
        },
        {
          name: "Flexi-Sole Commuter Pump",
          price: 5750,
          originalPrice: 6800,
          desc: "Elasticated topline, butter-soft leather, anti-fatigue insole for standing and walking ease.",
          colors: ["Onyx Black", "Deep Brown"],
        },
        {
          name: "Pure Comfort Cushioned Flat",
          price: 4950,
          originalPrice: 5850,
          desc: "Wide toe box, plush pillowed lining, ultra-light flexible EVA outsole for daily ease.",
          colors: ["Classic Black", "Soft Sand"],
        },
      ],
    },

    "sub-women-block-heels": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Sovereign Suede Block Heel Pumps 60mm",
          price: 6950,
          originalPrice: 8200,
          desc: "Stable wrapped block heel, gold trimmed heel cap, pointed toe, padded ball-of-foot cushioning.",
          colors: ["Onyx Black", "Deep Wine"],
        },
        {
          name: "Valencia Two-Tone Block Heel",
          price: 7250,
          originalPrice: 8500,
          desc: "Black toe cap with ivory leather body, mid 55mm block heel, memory padding and leather sole.",
          colors: ["Black / Ivory", "Black / Tan"],
        },
        {
          name: "Portofino Strappy Block Heel Sandal",
          price: 6750,
          originalPrice: 7900,
          desc: "Ankle strap, chunky 65mm stable heel, soft lambskin cross-straps and gold buckle closure.",
          colors: ["Jet Black", "Champagne Gold"],
        },
        {
          name: "Empress Gold-Inset Block Heel",
          price: 7650,
          originalPrice: 9000,
          desc: "Architectural cut-out heel with metallic gold mirror inlay, round toe and cushioned leather lining.",
          colors: ["Midnight Black", "Emerald Green"],
        },
        {
          name: "Cordoba Mary Jane Block Heel",
          price: 6850,
          originalPrice: 8100,
          desc: "Retro Mary Jane strap with gold button, glossy patent finish, 50mm comfortable block heel.",
          colors: ["Black Patent", "Burgundy Patent"],
        },
        {
          name: "Riviera Mule Block Heel",
          price: 6550,
          originalPrice: 7700,
          desc: "Slip-on square toe mule, stacked leather block heel, cushioned footbed, effortless chic.",
          colors: ["Onyx Black", "Warm Tan"],
        },
      ],
    },

    "sub-women-kitten-heels": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Parisian Pointed Kitten Heel 45mm",
          price: 6850,
          originalPrice: 8100,
          desc: "Graceful 45mm slender kitten heel, pointed toe, supple calfskin upper and cushioned arch pillow.",
          colors: ["Onyx Black", "Ivory Cream"],
        },
        {
          name: "Belle Slingback Kitten Heel",
          price: 7150,
          originalPrice: 8400,
          desc: "Elasticated slingback strap, gold buckle detail, Italian box leather, pointed toe elegance.",
          colors: ["Midnight Black", "Nude Beige"],
        },
        {
          name: "Audrey Leopard Accent Kitten Heel",
          price: 6950,
          originalPrice: 8200,
          desc: "Subtle pony-hair texture, sleek low heel, luxurious evening profile with gold-trimmed insole.",
          colors: ["Leopard / Black", "Black Suede"],
        },
        {
          name: "Sovereign Patent Kitten Heel",
          price: 6750,
          originalPrice: 7950,
          desc: "Mirror-shine black patent, memory foam ball-of-foot cushion, leather sole with rubber tap.",
          colors: ["Mirror Black", "Scarlet Red"],
        },
        {
          name: "Chantilly Lace Kitten Heel",
          price: 7450,
          originalPrice: 8800,
          desc: "Intricate lace overlay on satin, delicate pointed toe, ideal for weddings and formal parties.",
          colors: ["Black Lace", "Gold Lace"],
        },
        {
          name: "Milano Mules Kitten Heel",
          price: 6650,
          originalPrice: 7850,
          desc: "Backless slide, gold micro-buckle on vamp, effortlessly chic low height and goat leather lining.",
          colors: ["Jet Black", "Champagne Gold"],
        },
      ],
    },

    "sub-women-mules": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Aureus Backless Gold Bit Mules",
          price: 6850,
          originalPrice: 8100,
          desc: "Slip-on ease with iconic gold horsebit clasp, premium black box leather and cushioned footbed.",
          colors: ["Midnight Black", "Cognac Brown"],
        },
        {
          name: "Sofia Pointed Velvet Mules",
          price: 6450,
          originalPrice: 7600,
          desc: "Midnight plush velvet, gold piping trim, padded interior and low stacked heel.",
          colors: ["Midnight Black", "Royal Burgundy"],
        },
        {
          name: "Casablanca Woven Leather Mules",
          price: 6950,
          originalPrice: 8200,
          desc: "Hand-braided leather upper, square toe silhouette, flexible leather sole and breathable sockliner.",
          colors: ["Tan Woven", "Black Woven"],
        },
        {
          name: "Siena Low-Heel Dress Mules",
          price: 6750,
          originalPrice: 7950,
          desc: "30mm stacked heel, wide foot band, gold foil branding and soft lambskin lining.",
          colors: ["Onyx Black", "Olive Green"],
        },
        {
          name: "Ophelia Knotted Satin Mules",
          price: 6250,
          originalPrice: 7400,
          desc: "Sculpted front knot, shimmering midnight fabric, cushioned insole and elegant slip-on profile.",
          colors: ["Jet Black", "Emerald Satin"],
        },
        {
          name: "Zahra Embroidered Bridal Mules",
          price: 7450,
          originalPrice: 8800,
          desc: "Delicate floral zardozi threadwork, rich black and gold accents, cushioned heel pad.",
          colors: ["Black & Gold", "Ivory & Gold"],
        },
      ],
    },

    "sub-women-moccasins": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Sovereign Driving Moccasins",
          price: 5950,
          originalPrice: 7000,
          desc: "Nubuck leather with hand-sewn apron stitch, rubberized pebble sole and padded insole.",
          colors: ["Onyx Black", "Powder Pink"],
        },
        {
          name: "Venezia Tassel Leather Moccasins",
          price: 6250,
          originalPrice: 7400,
          desc: "Dual front tassels, supple cowhide leather, shock-absorbing insole and non-slip traction.",
          colors: ["Cognac Brown", "Jet Black"],
        },
        {
          name: "Amalfi Penny Moccasin",
          price: 5850,
          originalPrice: 6900,
          desc: "Classic penny cutout saddle, glove leather lining, all-day comfort with arch contouring.",
          colors: ["Classic Black", "Navy Blue"],
        },
        {
          name: "Bellissima Perforated Moccasins",
          price: 5650,
          originalPrice: 6700,
          desc: "Laser-cut decorative perforations, breathable summer construction, soft suede footbed.",
          colors: ["Warm Sand", "Onyx Black"],
        },
        {
          name: "Monte Carlo Horsebit Moccasins",
          price: 6450,
          originalPrice: 7600,
          desc: "Brushed gold horsebit, padded arch insole, flexible driving pads on outsole.",
          colors: ["Midnight Black", "Burgundy"],
        },
        {
          name: "Portofino Soft Suede Moccasins",
          price: 5950,
          originalPrice: 7100,
          desc: "Water-treated suede, contrast hand-stitching, ultra-plush walking comfort with studded sole.",
          colors: ["Tobacco Suede", "Rose Suede"],
        },
      ],
    },

    "sub-women-pumps": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Royal Classic Black Leather Pumps 85mm",
          price: 7650,
          originalPrice: 9000,
          desc: "Timeless pointed toe, 85mm leather-covered stiletto heel, calfskin upper with cushioned arch support.",
          colors: ["Onyx Black", "Nude Beige"],
        },
        {
          name: "Sovereign Nude & Black Cap-Toe Pumps",
          price: 7950,
          originalPrice: 9400,
          desc: "Elegant two-tone contrasting toe cap, padded insole, non-slip sole, 75mm heel height.",
          colors: ["Nude / Black Cap", "Ivory / Black Cap"],
        },
        {
          name: "Aureus Gold-Trimmed Court Pumps",
          price: 8250,
          originalPrice: 9700,
          desc: "Gold metallic collar trim, high-shine finish, cushioned arch pillow and leather sole.",
          colors: ["Mirror Black", "Burgundy"],
        },
        {
          name: "Victoria Patent Evening Pumps",
          price: 7450,
          originalPrice: 8800,
          desc: "Ultra-glossy patent leather, tapered silhouette, leather sole with rubber tip for confident stride.",
          colors: ["Jet Black", "Navy Patent"],
        },
        {
          name: "Windsor Suede Pointed Pumps",
          price: 7150,
          originalPrice: 8400,
          desc: "Deep black Italian suede, soft goat leather lining, 75mm mid-heel height with reinforced heel counter.",
          colors: ["Black Suede", "Emerald Suede"],
        },
        {
          name: "Duchess Sculpted Collar Pumps",
          price: 7850,
          originalPrice: 9200,
          desc: "Asymmetrical sweetheart collar line, pure luxury craftsmanship, 85mm heel and memory foam footbed.",
          colors: ["Onyx Black", "Metallic Pewter"],
        },
      ],
    },

    "sub-women-sneakers": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Sovereign Gold-Accent Leather Sneakers",
          price: 6750,
          originalPrice: 7950,
          desc: "Pristine white/black leather with metallic gold backstay and eyelets, cushioned cupsole.",
          colors: ["White & Gold", "Black & Gold"],
        },
        {
          name: "Stella Platform Leather Trainers",
          price: 7250,
          originalPrice: 8600,
          desc: "40mm lightweight platform sole, cushioned footbed, smooth calfskin upper with padded collar.",
          colors: ["Onyx Black", "Warm White"],
        },
        {
          name: "Luna Slip-On Laceless Sneakers",
          price: 5950,
          originalPrice: 7000,
          desc: "Elastic side gore, quilted leather vamp, easy slip-on convenience and durable traction.",
          colors: ["Jet Black", "Blush Nude"],
        },
        {
          name: "Mirage Perforated Court Sneaker",
          price: 6450,
          originalPrice: 7600,
          desc: "Breathable side perforations, cupsole construction, memory foam insole and gold logo stamping.",
          colors: ["White / Navy", "All Black"],
        },
        {
          name: "Nova Mixed-Media Fashion Sneaker",
          price: 7450,
          originalPrice: 8800,
          desc: "Suede, leather and metallic nylon panels, sculpted rubber sole with high energy return.",
          colors: ["Black / Silver", "Cream / Gold"],
        },
        {
          name: "Royale Minimalist Low-Top",
          price: 6250,
          originalPrice: 7350,
          desc: "Clean unbranded lines, butter-soft leather, vulcanized rubber traction and waxed laces.",
          colors: ["Obsidian Black", "Pure White"],
        },
      ],
    },

    "sub-women-slippers": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Royal Velvet Embroidered Chappal Slipper",
          price: 4250,
          originalPrice: 5000,
          desc: "Plush velvet with gold bullion embroidery, cushioned flat base and anti-skid rubber bottom.",
          colors: ["Midnight Black", "Maroon Red"],
        },
        {
          name: "Sovereign Leather Slide Slipper",
          price: 3850,
          originalPrice: 4600,
          desc: "Wide band calfskin, molded comfort footbed, outdoor-safe rubber bottom with gold-embossed logo.",
          colors: ["Onyx Black", "Cognac Tan"],
        },
        {
          name: "Cleo Gold Medallion Slipper",
          price: 4450,
          originalPrice: 5300,
          desc: "Central gold coin ornament, supple sheepskin, padded leather sockliner and low heel.",
          colors: ["Jet Black", "Warm Ivory"],
        },
        {
          name: "Bella Padded Quilted Slide",
          price: 3950,
          originalPrice: 4700,
          desc: "Puffy pillow leather cross-strap, cloud-like step insole and flexible walking base.",
          colors: ["Onyx Black", "Rose Nude"],
        },
        {
          name: "Noor Artisanal Leather Khussa Slipper",
          price: 3650,
          originalPrice: 4300,
          desc: "Open-back traditional cut, vegetable-tanned leather, hand-stitched with padded heel bed.",
          colors: ["Black / Gold", "Mustard Leather"],
        },
        {
          name: "Imperial Shearling Fur Slippers",
          price: 4850,
          originalPrice: 5800,
          desc: "Ultra-soft plush shearling lining, smooth black outer leather, cozy comfort with indoor/outdoor sole.",
          colors: ["Black Shearling", "Chestnut"],
        },
      ],
    },

    "sub-women-wedges": {
      category: "cat-women",
      type: "shoes_women",
      products: [
        {
          name: "Sovereign Espadrille Jute Wedge 80mm",
          price: 6450,
          originalPrice: 7600,
          desc: "Natural woven jute wedge rope, black leather ankle wrap strap and cushioned footbed.",
          colors: ["Black & Jute", "Gold & Jute"],
        },
        {
          name: "Riviera Leather Closed-Toe Wedge",
          price: 6750,
          originalPrice: 7950,
          desc: "Almond toe, supple cowhide, lightweight cork wedge foundation with 65mm incline.",
          colors: ["Onyx Black", "Warm Tan"],
        },
        {
          name: "Capri Metallic Strappy Wedge",
          price: 6250,
          originalPrice: 7400,
          desc: "Champagne gold and black straps, 60mm comfortable mid-wedge height with arch support.",
          colors: ["Gold / Black", "Rose Gold"],
        },
        {
          name: "Valencia Low-Wedge Everyday Sandal",
          price: 5650,
          originalPrice: 6700,
          desc: "40mm gentle incline, cushioned footbed, elastic back strap and non-slip rubber tread.",
          colors: ["Jet Black", "Nude Blush"],
        },
        {
          name: "Sorrento Crisscross Leather Wedge",
          price: 5950,
          originalPrice: 7100,
          desc: "Soft wide straps, padded suede insole, ribbed traction outsole and lightweight PU core.",
          colors: ["Dark Brown", "Midnight Black"],
        },
        {
          name: "Portofino Peep-Toe Platform Wedge",
          price: 6850,
          originalPrice: 8100,
          desc: "Peep toe, 85mm wedge with 20mm front platform for optimal balance and stability.",
          colors: ["Onyx Black", "Ivory Cream"],
        },
      ],
    },

    // ------------------------------------------------------------------------
    // 3. BAGS (7 subcategories * 6 = 42 products)
    // ------------------------------------------------------------------------
    "sub-bags-handbags": {
      category: "cat-bags",
      type: "bags",
      products: [
        {
          name: "Sovereign Structured Leather Handbag",
          price: 12500,
          originalPrice: 14800,
          desc: "Architectural silhouette in palmellato calfskin, structured top handle, gold turnlock and protective base feet.",
          colors: ["Onyx Black", "Burgundy Red"],
        },
        {
          name: "Aureus Top-Handle Satchel",
          price: 11850,
          originalPrice: 13900,
          desc: "Dual rolled handles, detachable shoulder strap, gold metal feet, interior zipper partition.",
          colors: ["Midnight Black", "Warm Camel"],
        },
        {
          name: "Imperial Padlock Leather Handbag",
          price: 13200,
          originalPrice: 15500,
          desc: "Signature engraved gold padlock, key clochette, interior zippered partitions, grain leather.",
          colors: ["Jet Black", "Forest Green"],
        },
        {
          name: "Milan Trapeze Wing Handbag",
          price: 12900,
          originalPrice: 15200,
          desc: "Expandable side wings, smooth box calf, suede-lined interior with zip security pockets.",
          colors: ["Onyx Black", "Cognac Tan"],
        },
        {
          name: "Royale Embossed Croc Handbag",
          price: 13950,
          originalPrice: 16500,
          desc: "Glossy croc-embossed calfskin, structured gold bar hardware and detachable leather strap.",
          colors: ["Glossy Black", "Emerald Croc"],
        },
        {
          name: "Verona Compact City Handbag",
          price: 9850,
          originalPrice: 11500,
          desc: "Ideal daily proportion, front slip pocket with gold magnetic closure, top zipper security.",
          colors: ["Classic Black", "Taupe Gray"],
        },
      ],
    },

    "sub-bags-shoulder-bags": {
      category: "cat-bags",
      type: "bags",
      products: [
        {
          name: "Aureus Gold Chain Shoulder Bag",
          price: 9450,
          originalPrice: 11200,
          desc: "Diamond quilted lambskin, heavy-gauge gold chain strap, turnlock flap closure with dual pockets.",
          colors: ["Onyx Black", "Ivory Cream"],
        },
        {
          name: "Sovereign Flap Shoulder Bag",
          price: 8950,
          originalPrice: 10500,
          desc: "Smooth calfskin, adjustable leather shoulder strap, gold push-lock and suede inner lining.",
          colors: ["Midnight Black", "Warm Tan"],
        },
        {
          name: "Kensington Baguette Shoulder Bag",
          price: 7850,
          originalPrice: 9200,
          desc: "Retro 90s baguette silhouette, comfortable underarm fit, top zipper with gold medallion pull.",
          colors: ["Jet Black", "Chocolate Brown"],
        },
        {
          name: "St. Germain Slouchy Leather Shoulder Bag",
          price: 10500,
          originalPrice: 12400,
          desc: "Relaxed soft tumbled leather, magnetic closure, spacious interior with zippered organizer.",
          colors: ["Onyx Black", "Olive Green"],
        },
        {
          name: "Royale Crescent Moon Shoulder Bag",
          price: 8450,
          originalPrice: 9900,
          desc: "Curved architectural form, gold buckle detail, stiff leather finish, modern luxury statement.",
          colors: ["Black Patent", "Burgundy"],
        },
        {
          name: "Monaco Leather Chain Hobo Bag",
          price: 9950,
          originalPrice: 11800,
          desc: "Slouchy grain leather with intertwined leather-and-chain shoulder strap, magnetic snap clasp.",
          colors: ["Charcoal Black", "Blush Nude"],
        },
      ],
    },

    "sub-bags-tote-bags": {
      category: "cat-bags",
      type: "bags",
      products: [
        {
          name: "Grand Palais Black Leather Shopper Tote",
          price: 11900,
          originalPrice: 13900,
          desc: "Supple pebbled cowhide, fits A4 leather portfolios, notebooks, and travel essentials with interior zip pouch.",
          colors: ["Onyx Black", "Cognac Brown"],
        },
        {
          name: "Sovereign Reversible Leather Tote",
          price: 10850,
          originalPrice: 12800,
          desc: "Dual-tone Black and Gold interior, unlined raw leather finish, matching detachable wristlet pouch.",
          colors: ["Black / Gold", "Black / Tan"],
        },
        {
          name: "Executive Zippered Work Tote",
          price: 12450,
          originalPrice: 14600,
          desc: "Full top zipper security, padded document sleeve, reinforced base with gold studs and key leash.",
          colors: ["Jet Black", "Deep Navy"],
        },
        {
          name: "St. Tropez Canvas & Leather Trim Tote",
          price: 8950,
          originalPrice: 10500,
          desc: "Heavyweight black canvas with rich leather trims, gold rivets and magnetic tab closure.",
          colors: ["Black Canvas", "Natural / Black"],
        },
        {
          name: "Bel-Air Structured Book Tote",
          price: 11200,
          originalPrice: 13200,
          desc: "Rigid jacquard and leather construction, embroidered SAWERA logo, spacious body for travel and office.",
          colors: ["Black & Gold Jacquard"],
        },
        {
          name: "Riviera Perforated Daily Tote",
          price: 9850,
          originalPrice: 11600,
          desc: "Intricate laser cutwork pattern, magnetic snap closure, lightweight carry with leather drop handles.",
          colors: ["Onyx Black", "Warm Sand"],
        },
      ],
    },

    "sub-bags-backpacks": {
      category: "cat-bags",
      type: "bags",
      products: [
        {
          name: "Sovereign Leather City Backpack",
          price: 11450,
          originalPrice: 13500,
          desc: "Full-grain calf leather, two-way gold zippers, spacious padded document and folio compartment.",
          colors: ["Onyx Black", "Dark Mocha"],
        },
        {
          name: "Aureus Mini Quilted Backpack",
          price: 8950,
          originalPrice: 10500,
          desc: "Compact daypack in quilted lambskin, front zipper pocket, gold chain accents and top handle.",
          colors: ["Midnight Black", "Warm Ivory"],
        },
        {
          name: "Executive Commuter Leather Backpack",
          price: 12950,
          originalPrice: 15200,
          desc: "Ergonomic padded shoulder straps, luggage trolley pass-through, water-resistant luxury calfskin shell.",
          colors: ["Jet Black"],
        },
        {
          name: "Nomad Drawstring Leather Rucksack",
          price: 10750,
          originalPrice: 12600,
          desc: "Flap with magnetic buckles, interior drawstring cord, vintage brass hardware and side pockets.",
          colors: ["Vintage Tan", "Onyx Black"],
        },
        {
          name: "Apex Sleek Waterproof Backpack",
          price: 9450,
          originalPrice: 11000,
          desc: "Matte full-grain leather, stormproof zips, minimalist urban silhouette with breathable back padding.",
          colors: ["All Black"],
        },
        {
          name: "Royale Studded Leather Backpack",
          price: 9850,
          originalPrice: 11500,
          desc: "Discreet gold micro-stud accents, top grab handle, secure back anti-theft zip pocket.",
          colors: ["Midnight Black", "Burgundy"],
        },
      ],
    },

    "sub-bags-crossbody-bags": {
      category: "cat-bags",
      type: "bags",
      products: [
        {
          name: "Sovereign Camera Bag Crossbody",
          price: 6850,
          originalPrice: 8100,
          desc: "Structured box shape, front slip pocket with gold logo, wide webbing strap and perimeter zip.",
          colors: ["Onyx Black", "Cognac Tan"],
        },
        {
          name: "Aureus Saddle Flap Crossbody",
          price: 7450,
          originalPrice: 8800,
          desc: "Equestrian-inspired curved silhouette, magnetic gold ring lock, adjustable shoulder strap.",
          colors: ["Midnight Black", "Rich Brown"],
        },
        {
          name: "Milan Slim Leather Crossbody Pouch",
          price: 4650,
          originalPrice: 5500,
          desc: "Designed for compact daily essentials, rear credit card slots, slim leather lanyard with gold clasp.",
          colors: ["Jet Black", "Emerald Green"],
        },
        {
          name: "Kensington Double-Zip Crossbody",
          price: 7250,
          originalPrice: 8500,
          desc: "Two independent zippered compartments, polished gold pullers, compact everyday profile.",
          colors: ["Onyx Black", "Warm Taupe"],
        },
        {
          name: "Sovereign Accordion Crossbody",
          price: 8250,
          originalPrice: 9700,
          desc: "Multi-compartment interior for effortless organization, soft Nappa leather, gold push-lock.",
          colors: ["Midnight Black", "Burgundy"],
        },
        {
          name: "Riviera Half-Moon Crossbody",
          price: 6950,
          originalPrice: 8200,
          desc: "Smooth curved shape, gold zip closure, lightweight and hands-free with adjustable strap.",
          colors: ["Onyx Black", "Ivory Cream"],
        },
      ],
    },

    "sub-bags-travel-bags": {
      category: "cat-bags",
      type: "bags",
      products: [
        {
          name: "Sovereign Leather Weekender Duffle 50cm",
          price: 16500,
          originalPrice: 19500,
          desc: "Premium full-grain cowhide, separate shoe compartment, detachable padded strap and brass hardware.",
          colors: ["Onyx Black", "Cognac Brown"],
        },
        {
          name: "Imperial Overnight Leather Holdall",
          price: 15200,
          originalPrice: 17900,
          desc: "Spacious cabin-approved luggage size, heavy-duty gold brass hardware, interior zip security pockets.",
          colors: ["Midnight Black", "Dark Walnut"],
        },
        {
          name: "Monarch Garment Travel Duffle",
          price: 17800,
          originalPrice: 21000,
          desc: "2-in-1 suit garment carrier folds into weekend duffle, wrinkle-free interior and tie holder.",
          colors: ["Jet Black"],
        },
        {
          name: "St. James Classic Leather Suitcase",
          price: 18500,
          originalPrice: 22000,
          desc: "Rigid vintage case with leather corner guards, dual combination locks and silk jacquard lining.",
          colors: ["Onyx Black / Gold", "Tan Leather"],
        },
        {
          name: "Riviera Canvas & Leather Duffle",
          price: 12900,
          originalPrice: 15200,
          desc: "Water-repellent heavy canvas with bridle leather straps and brass base feet.",
          colors: ["Black / Black Leather", "Olive / Brown Leather"],
        },
        {
          name: "Voyageur Leather Toiletry Kit / Dopp Bag",
          price: 4850,
          originalPrice: 5800,
          desc: "Spill-resistant lined interior, dual zip wide mouth opening, leather grab handle.",
          colors: ["Onyx Black", "Vintage Brown"],
        },
      ],
    },

    "sub-bags-clutches": {
      category: "cat-bags",
      type: "bags",
      products: [
        {
          name: "Aura Minaudière Evening Clutch",
          price: 7200,
          originalPrice: 8500,
          desc: "Hard-shell clutch wrapped in black satin leather with jewel-faceted gold clasp and detachable box chain.",
          colors: ["Black & Gold"],
        },
        {
          name: "Sovereign Envelope Leather Clutch",
          price: 5850,
          originalPrice: 6900,
          desc: "Sleek V-flap envelope with magnetic gold emblem, detachable wristlet, internal card slots.",
          colors: ["Onyx Black", "Gold Metallic"],
        },
        {
          name: "Aureus Woven Leather Pouch Clutch",
          price: 6450,
          originalPrice: 7600,
          desc: "Soft-structured cloud pouch with magnetic frame, intrecciato woven leather and hideaway chain.",
          colors: ["Jet Black", "Ivory Cream"],
        },
        {
          name: "Royale Crystal-Buckle Evening Clutch",
          price: 7850,
          originalPrice: 9200,
          desc: "Black silk velvet, sparkling baguette-crystal buckle, hideaway gold chain, satin interior.",
          colors: ["Midnight Black", "Ruby Red"],
        },
        {
          name: "Milan Slim Zip Pouch Clutch",
          price: 4950,
          originalPrice: 5800,
          desc: "Minimalist flat leather pouch, fits evening essentials and cosmetics, gold foil logo stamping.",
          colors: ["Onyx Black", "Emerald Green"],
        },
        {
          name: "Cleopatra Gold Metal-Frame Clutch",
          price: 7500,
          originalPrice: 8900,
          desc: "Polished high-shine gold frame, black Italian leather body, opulent evening staple.",
          colors: ["Gold & Black"],
        },
      ],
    },

    // ------------------------------------------------------------------------
    // 4. ACCESSORIES (3 subcategories * 6 = 18 products)
    // ------------------------------------------------------------------------
    "sub-accessories-wallets": {
      category: "cat-accessories",
      type: "accessories",
      products: [
        {
          name: "Savoy Slim Leather Card Billfold",
          price: 2450,
          originalPrice: 2950,
          desc: "Ultra-slim bi-fold wallet featuring RFID shielding, 8 credit card slots, and hot-stamped gold foil logo signature.",
          colors: ["Onyx Black", "Forest Green"],
        },
        {
          name: "Sovereign Long Continental Zipper Wallet",
          price: 4250,
          originalPrice: 5000,
          desc: "Full perimeter zip, central coin pocket, 12 card slots, calfskin leather with gold metal zip.",
          colors: ["Jet Black", "Burgundy"],
        },
        {
          name: "Aureus Tri-Fold Compact Wallet",
          price: 2850,
          originalPrice: 3400,
          desc: "Pocket-sized tri-fold, coin snap pouch, bill compartment, gold metal SAWERA emblem.",
          colors: ["Onyx Black", "Cognac Brown"],
        },
        {
          name: "Executive Leather Bifold with Money Clip",
          price: 2650,
          originalPrice: 3150,
          desc: "Integrated spring-steel gold money clip, 6 card slots, sleek pocket profile with turned edges.",
          colors: ["Midnight Black", "Dark Tan"],
        },
        {
          name: "Milan Flap Wallet with Gold Stud",
          price: 3450,
          originalPrice: 4100,
          desc: "Snap flap closure, dual bill sections, textured Saffiano leather with gold pyramid stud.",
          colors: ["Classic Black", "Blush Nude"],
        },
        {
          name: "Sovereign Cardholder Lanyard Wallet",
          price: 2250,
          originalPrice: 2700,
          desc: "Detachable leather neck strap, clear ID window, 4 card slots, top zip coin compartment.",
          colors: ["Jet Black", "Navy Blue"],
        },
      ],
    },

    "sub-accessories-belts": {
      category: "cat-accessories",
      type: "belts",
      products: [
        {
          name: "Reversible Monogram Dress Belt 35mm",
          price: 3850,
          originalPrice: 4500,
          desc: "Two-in-one luxury belt featuring smooth black calf on one side and embossed rich brown on reverse. Sculpted SAWERA buckle in 24k gold-plated brass.",
          colors: ["Black / Brown Reversible"],
        },
        {
          name: "Sovereign Automatic Ratchet Belt",
          price: 3450,
          originalPrice: 4100,
          desc: "Micro-adjustable ratchet track, sleek black buckle with gold laser edge, no holes needed.",
          colors: ["Onyx Black", "Coffee Brown"],
        },
        {
          name: "Aristocrat Feathered Edge Dress Belt 30mm",
          price: 3250,
          originalPrice: 3850,
          desc: "Tapered edges, hand-burnished finish, solid brass gold buckle, ideal for tailored suit trousers.",
          colors: ["Classic Black", "Burgundy"],
        },
        {
          name: "Kensington Casual Nubuck Leather Belt 38mm",
          price: 2950,
          originalPrice: 3500,
          desc: "Rugged soft nubuck cowhide, brushed antique gold roller buckle with contrast hand-stitching.",
          colors: ["Vintage Tan", "Dark Charcoal"],
        },
        {
          name: "Milan Saffiano Leather Dress Belt",
          price: 3650,
          originalPrice: 4300,
          desc: "Scratch-resistant cross-grain leather, polished mirror gold buckle, hand-painted edges.",
          colors: ["Jet Black", "Navy Blue"],
        },
        {
          name: "Royale Braided Stretch Leather Belt",
          price: 3150,
          originalPrice: 3750,
          desc: "Hand-interlaced leather with micro-stretch core, prong goes through anywhere for custom fit.",
          colors: ["Black Braided", "Cognac Braided"],
        },
      ],
    },

    "sub-accessories-leather": {
      category: "cat-accessories",
      type: "accessories",
      products: [
        {
          name: "Sovereign Minimalist 6-Slot Cardholder",
          price: 1850,
          originalPrice: 2200,
          desc: "Full-grain calfskin, central cash pocket, thumb-slide card extraction and gold foil branding.",
          colors: ["Onyx Black", "Whiskey Tan"],
        },
        {
          name: "Aureus Leather Passport Travel Wallet",
          price: 2850,
          originalPrice: 3400,
          desc: "Accommodates passport, boarding pass, SIM ejector tool, and currency with gold snap closure.",
          colors: ["Midnight Black", "Burgundy"],
        },
        {
          name: "Imperial Leather Key Clochette & Fob",
          price: 1450,
          originalPrice: 1750,
          desc: "Solid brass gold carabiner ring, enclosed leather jacket prevents pocket scratches.",
          colors: ["Jet Black", "Warm Tan"],
        },
        {
          name: "Executive Roll-Up Leather Watch Case",
          price: 4850,
          originalPrice: 5800,
          desc: "Suede-lined 3-watch storage roll with flexible cushions and gold snap buttons.",
          colors: ["Onyx Black", "Chocolate Brown"],
        },
        {
          name: "Artisanal Leather Valet Catchall Tray",
          price: 2450,
          originalPrice: 2950,
          desc: "Collapsible corner gold snap buttons, vegetable-tanned thick leather for bedside or desk.",
          colors: ["Classic Black", "Cognac Brown"],
        },
        {
          name: "Sovereign Executive Leather Document Folio",
          price: 3850,
          originalPrice: 4500,
          desc: "Elasticated pen loops, zippered document sleeve, premium calf leather with gold zip.",
          colors: ["Jet Black"],
        },
      ],
    },

    // ------------------------------------------------------------------------
    // 5. KIDS (6 subcategories * 6 = 36 products)
    // ------------------------------------------------------------------------
    "sub-kids-boys-shoes": {
      category: "cat-kids",
      type: "shoes_kids",
      products: [
        {
          name: "Junior Prince Brogued Loafers",
          price: 3650,
          originalPrice: 4200,
          desc: "Miniature formal brogues, genuine breathable leather, cushioned ankle collars and non-slip rubber soles.",
          colors: ["Classic Black", "Tan"],
        },
        {
          name: "Little Gentleman Oxford Dress Shoes",
          price: 3850,
          originalPrice: 4500,
          desc: "Classic cap-toe lacing, soft memory insole, flexible non-slip rubber outsole for boys' formal events.",
          colors: ["Onyx Black", "Dark Brown"],
        },
        {
          name: "Monarch Slip-On Penny Loafers",
          price: 3450,
          originalPrice: 4100,
          desc: "Easy slip-on design, padded leather sock, lightweight wear and flexible forefoot.",
          colors: ["Jet Black", "Chestnut"],
        },
        {
          name: "Royal Cadet Leather Monk Strap",
          price: 3750,
          originalPrice: 4400,
          desc: "Single hook-and-loop faux buckle strap for easy independence, breathable leather lining.",
          colors: ["Classic Black", "Oxblood"],
        },
        {
          name: "Junior Derby Casual Leather Shoes",
          price: 3350,
          originalPrice: 3950,
          desc: "Padded collar, flexible sole for growing feet, premium leather upper with reinforced toe.",
          colors: ["Navy Blue", "Tan Brown"],
        },
        {
          name: "Prince Tassel Festive Shoes",
          price: 3550,
          originalPrice: 4200,
          desc: "Traditional gold tassel embellishment, soft leather, ideal for Eid, weddings and celebrations.",
          colors: ["Black / Gold", "Maroon / Gold"],
        },
      ],
    },

    "sub-kids-girls-shoes": {
      category: "cat-kids",
      type: "shoes_kids",
      products: [
        {
          name: "Princess Gold-Bow Ballerina Flats",
          price: 3450,
          originalPrice: 4100,
          desc: "Shimmering leather with petite gold bow, elasticized instep strap, soft lining and rubber grip.",
          colors: ["Black & Gold", "Blush Pink"],
        },
        {
          name: "Little Duchess Patent Mary Jane",
          price: 3650,
          originalPrice: 4300,
          desc: "High-gloss patent leather, button closure, cushioned arch support and non-marking sole.",
          colors: ["Black Patent", "Ruby Patent"],
        },
        {
          name: "Royal Blossom Floral Embroidered Flat",
          price: 3250,
          originalPrice: 3850,
          desc: "Hand-embroidered floral motifs, pure leather sole, soft velvet finish for festive occasions.",
          colors: ["Midnight Black", "Gold Floral"],
        },
        {
          name: "Aureus Glitter Party Shoes",
          price: 3750,
          originalPrice: 4400,
          desc: "Gentle non-slip 15mm low heel, gold sparkle finish, padded footbed with secure strap.",
          colors: ["Sparkle Gold", "Rose Gold"],
        },
        {
          name: "Little Ballerina Quilted Flats",
          price: 3350,
          originalPrice: 3950,
          desc: "Diamond quilting, patent cap toe, flexible rubber grip and breathable cotton lining.",
          colors: ["Onyx Black", "Ivory Cream"],
        },
        {
          name: "Sofia Ankle-Strap Dress Shoes",
          price: 3550,
          originalPrice: 4200,
          desc: "Delicate ankle buckle strap, pearl and gold accent, smooth leather with cushioned insole.",
          colors: ["Classic Black", "Pure White"],
        },
      ],
    },

    "sub-kids-sneakers": {
      category: "cat-kids",
      type: "shoes_kids",
      products: [
        {
          name: "Junior Aero Light-Speed Runners",
          price: 3250,
          originalPrice: 3850,
          desc: "Breathable mesh with leather overlays, shock-absorbing EVA foam sole and elastic laces.",
          colors: ["Black / Gold", "Gray / Neon"],
        },
        {
          name: "Little Champ Dual-Strap Leather Sneaker",
          price: 3450,
          originalPrice: 4100,
          desc: "Double velcro hook-and-loop straps, reinforced rubber toe cap and non-marking tread.",
          colors: ["All Black", "White / Navy"],
        },
        {
          name: "Royal Low-Top Court Sneakers",
          price: 3350,
          originalPrice: 3950,
          desc: "Minimalist white and black leather, gold eyelets, cushioned ankle collar and vulcanized sole.",
          colors: ["White / Gold", "Black / White"],
        },
        {
          name: "Speedster High-Top Street Sneakers",
          price: 3650,
          originalPrice: 4300,
          desc: "Padded ankle support, side zipper closure, durable rubber traction with gold details.",
          colors: ["Jet Black", "Red / Black"],
        },
        {
          name: "Slip-On Flexible Play Trainers",
          price: 2950,
          originalPrice: 3500,
          desc: "Breathable stretch knit upper, machine washable, ultra-lightweight with anti-slip grip.",
          colors: ["Onyx Black", "Navy Blue"],
        },
        {
          name: "Apex Chunky Fashion Sneaker",
          price: 3550,
          originalPrice: 4200,
          desc: "Multi-panel durable upper, grippy lug sole, comfortable all-day wear for school and active play.",
          colors: ["Black / Charcoal", "White / Pastel"],
        },
      ],
    },

    "sub-kids-sandals": {
      category: "cat-kids",
      type: "shoes_kids",
      products: [
        {
          name: "Junior Explorer Strappy Adventure Sandal",
          price: 2950,
          originalPrice: 3500,
          desc: "Water-friendly quick-dry webbing, triple velcro adjusters, toe guard and rugged rubber base.",
          colors: ["All Black", "Navy / Orange"],
        },
        {
          name: "Little Prince Leather Peshawari Sandal",
          price: 3250,
          originalPrice: 3850,
          desc: "Traditional handcrafted leather chappal, soft tyre-sole grip, cushioned inner pad.",
          colors: ["Classic Black", "Mustard Tan"],
        },
        {
          name: "Golden Princess T-Strap Flat Sandal",
          price: 2850,
          originalPrice: 3400,
          desc: "Metallic gold leather strap, cushioned insole, soft ankle buckle for girls' summer wear.",
          colors: ["Gold", "Rose Gold"],
        },
        {
          name: "Little Mariner Leather Fisherman Sandal",
          price: 3150,
          originalPrice: 3750,
          desc: "Interlaced cage protects toes, breathable leather footbed and secure buckle strap.",
          colors: ["Dark Brown", "Tan Leather"],
        },
        {
          name: "Seaside Two-Strap Cork Sandal",
          price: 2750,
          originalPrice: 3300,
          desc: "Ergonomic molded footbed, dual buckle straps, anti-skid bottom and lightweight cork sole.",
          colors: ["Jet Black", "Brown"],
        },
        {
          name: "Sparkle Butterfly Summer Sandal",
          price: 2950,
          originalPrice: 3500,
          desc: "Embroidered butterfly accent, soft ankle padding, flexible sole with non-slip texture.",
          colors: ["Gold & White", "Pink Sparkle"],
        },
      ],
    },

    "sub-kids-slippers": {
      category: "cat-kids",
      type: "shoes_kids",
      products: [
        {
          name: "Junior Royal Velvet House Slipper",
          price: 2650,
          originalPrice: 3150,
          desc: "Soft black velvet with embroidered gold crown, plush padded interior and quiet indoor/outdoor sole.",
          colors: ["Midnight Black", "Royal Red"],
        },
        {
          name: "Little Champ Leather Slide Slipper",
          price: 2450,
          originalPrice: 2950,
          desc: "Genuine cowhide leather upper, contoured footbed, durable daily wear with water-resistant base.",
          colors: ["Onyx Black", "Chestnut"],
        },
        {
          name: "Cozy Bear Shearling Indoor Slipper",
          price: 2850,
          originalPrice: 3400,
          desc: "Warm faux fur lining, non-slip rubber bottom, easy slip-on fit for home comfort.",
          colors: ["Black / Gray", "Beige"],
        },
        {
          name: "Princess Gold-Trim Slide Slipper",
          price: 2550,
          originalPrice: 3050,
          desc: "Shimmering gold strap, cushioned footbed, lightweight construction and flexible tread.",
          colors: ["Gold", "Silver / Black"],
        },
        {
          name: "Little Heritage Kolhapuri Chappal Slipper",
          price: 2350,
          originalPrice: 2800,
          desc: "Authentic soft leather, hand-braided strap, traditional Pakistani footwear with soft heel pad.",
          colors: ["Natural Tan", "Black"],
        },
        {
          name: "Cloudfoam Comfort Daily Slipper",
          price: 2150,
          originalPrice: 2600,
          desc: "Ultra-cushioned footbed, waterproof upper, non-skid textured grip for easy daily wear.",
          colors: ["All Black", "Navy Blue"],
        },
      ],
    },

    "sub-kids-school-shoes": {
      category: "cat-kids",
      type: "shoes_kids",
      products: [
        {
          name: "Academy Black Leather Velcro School Shoes",
          price: 3250,
          originalPrice: 3850,
          desc: "Tough scuff-resistant box leather, dual velcro straps, non-marking sole and breathable antibacterial insole.",
          colors: ["Uniform Black"],
        },
        {
          name: "Scholars Lace-Up Formal School Shoes",
          price: 3350,
          originalPrice: 3950,
          desc: "Traditional lace-up uniform shoe, reinforced heel counter, arch support and oil-resistant rubber sole.",
          colors: ["Classic Black"],
        },
        {
          name: "Classic Mary Jane Uniform School Shoes",
          price: 3150,
          originalPrice: 3750,
          desc: "Buckle strap, breathable leather lining, durable daily rubber sole with padded collar for girls.",
          colors: ["Black Patent", "Matte Black"],
        },
        {
          name: "Tough-Wear Padded Collar School Derby",
          price: 3450,
          originalPrice: 4100,
          desc: "Anti-bacterial odor-resistant insole, flexible rubber sole, scuff guard on toe for rigorous school yard use.",
          colors: ["Onyx Black"],
        },
        {
          name: "Junior Cadet Brogued School Shoes",
          price: 3550,
          originalPrice: 4200,
          desc: "Smart perforated wingtip detailing, soft inner lining, sturdy construction with long-lasting sole.",
          colors: ["Black Leather"],
        },
        {
          name: "Sport-Flex Uniform Slip-On Shoes",
          price: 2950,
          originalPrice: 3500,
          desc: "Elasticated gusset for quick wear, lightweight shock-absorbing midsole, scuff-resistant leather.",
          colors: ["All Black"],
        },
      ],
    },
  };

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  const skuMap = {
    "sub-men-formal-shoes": "SW-M-FS",
    "sub-men-casual-shoes": "SW-M-CS",
    "sub-men-sneakers": "SW-M-SN",
    "sub-men-sandals": "SW-M-SD",
    "sub-men-slippers": "SW-M-SL",
    "sub-men-loafers": "SW-M-LF",
    "sub-men-moccasins": "SW-M-MC",
    "sub-men-boots": "SW-M-BT",
    "sub-men-sports-shoes": "SW-M-SP",

    "sub-women-heels": "SW-W-HL",
    "sub-women-flats": "SW-W-FL",
    "sub-women-sandals": "SW-W-SD",
    "sub-women-comfort-shoes": "SW-W-CF",
    "sub-women-block-heels": "SW-W-BH",
    "sub-women-kitten-heels": "SW-W-KH",
    "sub-women-mules": "SW-W-ML",
    "sub-women-moccasins": "SW-W-MC",
    "sub-women-pumps": "SW-W-PM",
    "sub-women-sneakers": "SW-W-SN",
    "sub-women-slippers": "SW-W-SL",
    "sub-women-wedges": "SW-W-WG",

    "sub-bags-handbags": "SW-B-HB",
    "sub-bags-shoulder-bags": "SW-B-SB",
    "sub-bags-tote-bags": "SW-B-TT",
    "sub-bags-backpacks": "SW-B-BP",
    "sub-bags-crossbody-bags": "SW-B-CB",
    "sub-bags-travel-bags": "SW-B-TB",
    "sub-bags-clutches": "SW-B-CL",

    "sub-accessories-wallets": "SW-A-WL",
    "sub-accessories-belts": "SW-A-BL",
    "sub-accessories-leather": "SW-A-LA",

    "sub-kids-boys-shoes": "SW-K-BY",
    "sub-kids-girls-shoes": "SW-K-GL",
    "sub-kids-sneakers": "SW-K-SN",
    "sub-kids-sandals": "SW-K-SD",
    "sub-kids-slippers": "SW-K-SL",
    "sub-kids-school-shoes": "SW-K-SC",
  };

  // Clean products tables for pristine rebuild
  console.log("Clearing prior product tables...");
  await conn.query("DELETE FROM product_images");
  await conn.query("DELETE FROM product_variants");
  await conn.query("DELETE FROM products");

  let totalInserted = 0;
  let imageCounter = 0;

  for (const [subId, subData] of Object.entries(catalogData)) {
    const catId = subData.category;
    const type = subData.type;
    console.log(`Processing subcategory: ${subId} (${subData.products.length} products)...`);

    let prodIdx = 1;
    for (const item of subData.products) {
      const prodId = `prod-${subId.replace('sub-', '')}-${prodIdx}`;
      const slug = `${slugify(item.name)}-${subId.replace('sub-', '')}`;
      const skuPrefix = skuMap[subId] || `SW-${subId.replace('sub-', '').toUpperCase().slice(0, 6)}`;
      const sku = `${skuPrefix}-${String(prodIdx).padStart(3, '0')}`;

      const isFeatured = prodIdx === 1 || prodIdx === 2;
      const isNewArrival = prodIdx === 2 || prodIdx === 3 || prodIdx === 6;
      const isBestseller = prodIdx === 1 || prodIdx === 4;

      // Insert product
      await conn.query(`
        INSERT INTO products (
          id, categoryId, subcategoryId, name, slug, sku, description,
          price, originalPrice, isPublished, isFeatured, isNewArrival, isBestseller
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?)
      `, [
        prodId, catId, subId, item.name, slug, sku, item.desc,
        item.price, item.originalPrice, isFeatured, isNewArrival, isBestseller
      ]);

      // Assign exact category luxury footwear/leather illustration
      const img1 = `/products/${prodId}-1.svg`;
      const img2 = `/products/${prodId}-2.svg`;

      await conn.query(`
        INSERT INTO product_images (id, productId, url, displayOrder, isPrimary)
        VALUES (?, ?, ?, 1, TRUE)
        ON DUPLICATE KEY UPDATE url=VALUES(url), isPrimary=TRUE;
      `, [`img-${prodId}-1`, prodId, img1]);

      await conn.query(`
        INSERT INTO product_images (id, productId, url, displayOrder, isPrimary)
        VALUES (?, ?, ?, 2, FALSE)
        ON DUPLICATE KEY UPDATE url=VALUES(url), isPrimary=FALSE;
      `, [`img-${prodId}-2`, prodId, img2]);

      // Determine variants (Sizes & Colors)
      let sizes = [];
      if (type === "shoes_men") {
        sizes = ["39", "40", "41", "42", "43", "44", "45"];
      } else if (type === "shoes_women") {
        sizes = ["36", "37", "38", "39", "40", "41"];
      } else if (type === "shoes_kids") {
        sizes = ["28", "29", "30", "31", "32", "33", "34"];
      } else if (type === "belts") {
        sizes = ["32", "34", "36", "38", "40"];
      } else {
        sizes = ["Standard"];
      }

      for (const size of sizes) {
        for (const color of item.colors) {
          const cleanColor = color.replace(/[^\w]/g, '');
          const varId = `var-${prodId}-${size}-${cleanColor}`;
          const varSku = `${sku}-${size}-${cleanColor.slice(0, 3).toUpperCase()}`;
          const stock = 12; // In stock for immediate checkout

          await conn.query(`
            INSERT INTO product_variants (id, productId, size, color, sku, stock, additionalPrice)
            VALUES (?, ?, ?, ?, ?, ?, 0.00)
            ON DUPLICATE KEY UPDATE stock=VALUES(stock);
          `, [varId, prodId, size, color, varSku, stock]);
        }
      }

      totalInserted++;
      prodIdx++;
    }
  }

  console.log("--------------------------------------------------");
  console.log(`SUCCESS: Total products populated: ${totalInserted}`);

  // Verification count
  const [counts] = await conn.query(`
    SELECT c.name as categoryName, s.name as subcategoryName, count(p.id) as productCount
    FROM subcategories s
    JOIN categories c ON s.categoryId = c.id
    LEFT JOIN products p ON p.subcategoryId = s.id
    GROUP BY c.name, s.name, s.displayOrder
    ORDER BY c.name, s.displayOrder;
  `);

  console.log("Subcategory verification sample:");
  console.table(counts.slice(0, 15));
  console.log(`Total verified subcategories: ${counts.length}`);

  const [totalProducts] = await conn.query('SELECT count(*) as total FROM products');
  console.log(`Total Products in Database: ${totalProducts[0].total}`);

  const [totalVariants] = await conn.query('SELECT count(*) as total FROM product_variants');
  console.log(`Total Active Variants in Database: ${totalVariants[0].total}`);

  await conn.end();
}

if (require.main === module) {
  populate().catch(console.error);
}

module.exports = { populate };
