/**
 * ZERO DEGREE CAFE - Premium Backend API Server Engine
 * Location: RR Nagar, Bengaluru
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory data persistence structure for table reservations
const localReservationsMemory = [];

// COMPREHENSIVE EXPANDED MENU SCHEMA WITH ACCURATE CATEGORY MAPPING
const MENU_DATA = [
  // ==========================================
  // BREWERY SPECIAL (Craft Beer & Taps)
  // ==========================================
  {
    id: 1,
    name: "Classic Brewed Pitcher",
    price: "₹450",
    description: "House-crafted signature crisp malt blend with subtle aromatic citrus profiles.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: false
  },
  {
    id: 4,
    name: "Zero Degree Witbier",
    price: "₹380",
    description: "Traditional Belgian-style wheat beer brewed with fresh coriander seeds and sweet orange peel.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: true
  },
  {
    id: 5,
    name: "Roasted Stout Draft",
    price: "₹395",
    description: "A dark, rich pour boasting bold notes of espresso, organic cacao, and a smooth, creamy finish.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: false
  },
  {
    id: 101,
    name: "Rooftop Session IPA",
    price: "₹420",
    description: "A light, highly drinkable India Pale Ale bursting with tropical mosaic and citra hop notes.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1555658636-6e4a36218be7?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: true
  },
  {
    id: 102,
    name: "Crimson Amber Ale",
    price: "₹410",
    description: "Rich toasted malt flavor balanced perfectly with a mild, earthy hop bitterness and clean finish.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1584225065152-4a1454aa3d4e?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: false
  },
  {
    id: 109,
    name: "Double Hazy IPA",
    price: "₹460",
    description: "An unfiltered, thick pour loaded with Nelson Sauvin hops, offering an intense mango and stone-fruit character.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: false
  },
  {
    id: 110,
    name: "Smoked Honey Lager",
    price: "₹390",
    description: "Crisp, bottom-fermented lager conditioned with local forest honey and beechwood-smoked malt threads.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: true
  },
  {
    id: 201,
    name: "Imperial Chocolate Stout",
    price: "₹490",
    description: "Deep, intense dark ale brewed with locally sourced roasted cacao nibs and Madagascar vanilla pods.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: false
  },
  {
    id: 202,
    name: "Copperhead West Coast DIPA",
    price: "₹475",
    description: "Bold bitterness with aggressive pine resin and grapefruit zest aromas for deep hop enthusiasts.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: true
  },

  // ==========================================
  // SIGNATURE COCKTAILS (Fine Mixology)
  // ==========================================
  {
    id: 6,
    name: "Hill Deck Botanical G&T",
    price: "₹520",
    description: "Premium gin cold-infused with cucumber ribbons, rosemary sprigs, elderflower liqueur, and artisan tonic.",
    category: "Signature Cocktails",
    image: "https://images.unsplash.com/photo-1524361189360-1e5c2677c57e?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: true
  },
  {
    id: 7,
    name: "Smoked Bourbon Sour",
    price: "₹560",
    description: "Oak-smoked bourbon shaken raw with fresh lime juice, aromatic bitters, and integrated simple syrup over clear ice blocks.",
    category: "Signature Cocktails",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: false
  },
  {
    id: 103,
    name: "Midnight Passion Martini",
    price: "₹495",
    description: "Vibrant passionfruit nectar shaken vigorously with vanilla vodka, fresh lime juice, and a sparkling wine float.",
    category: "Signature Cocktails",
    image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: false
  },
  {
    id: 104,
    name: "Hibiscus Mezcal Paloma",
    price: "₹540",
    description: "Smoky artisanal mezcal paired with wild hibiscus reduction, fresh pink grapefruit, and a black lava salt rim.",
    category: "Signature Cocktails",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: true
  },
  {
    id: 111,
    name: "Spiced Apple Toddy",
    price: "₹480",
    description: "Warm bourbon base stewed with dark apple cider, star anise, cinnamon quills, and a dash of clove honey.",
    category: "Signature Cocktails",
    image: "https://images.unsplash.com/photo-1540182890923-f7960d750d05?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: false
  },
  {
    id: 112,
    name: "Elderflower Rosemary Spritz",
    price: "₹510",
    description: "Artisanal dry prosecco balanced with wild elderflower extract, botanical gin infusion, and fresh slapped rosemary.",
    category: "Signature Cocktails",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: true
  },
  {
    id: 203,
    name: "Espresso Cold Brew Negroni",
    price: "₹550",
    description: "Our signature gin, sweet vermouth, and Campari custom-steeped with single-origin Ethiopian cold brew blocks.",
    category: "Signature Cocktails",
    image: "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: false
  },

  // ==========================================
  // MERCHANDISE (Premium Lifestyle Gear)
  // ==========================================
  {
    id: 10,
    name: "Zero Degree Street Hoodie",
    price: "₹1,899",
    description: "Ultra-heavyweight 450 GSM organic cotton hoodie with minimalist geometric branding. Perfect for chilly rooftop evenings.",
    category: "Merchandise",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: false
  },
  {
    id: 11,
    name: "Insulated Matte Brewer Mug",
    price: "₹850",
    description: "Double-walled stainless steel growler mug designed to keep your craft brews sub-zero on hot days.",
    category: "Merchandise",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: false
  },
  {
    id: 105,
    name: "Cyberpunk Cargo Cap",
    price: "₹699",
    description: "Deconstructed matte black ripstop cap featuring an adjustable utility strap and embroidered coordinates of the deck.",
    category: "Merchandise",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: true
  },
  {
    id: 106,
    name: "Barista Edition Canvas Apron",
    price: "₹1,250",
    description: "Heavy-duty waxed canvas apron accented with genuine split-leather straps and modular brass hardware loops.",
    category: "Merchandise",
    image: "https://images.unsplash.com/photo-1617870905525-4299b66ba373?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: false
  },
  {
    id: 113,
    name: "Distressed Denim Brewer Jacket",
    price: "₹2,499",
    description: "Rugged, vintage-wash denim utility jacket featuring internal hidden pockets for your flask and custom iron-on coordinates patches.",
    category: "Merchandise",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: false
  },
  {
    id: 114,
    name: "Thermal Iso-Flask (750ml)",
    price: "₹1,150",
    description: "Military-grade powder-coated container engineered to store temperature-sensitive nitro cold brews safely for up to 36 hours.",
    category: "Merchandise",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: false
  },
  {
    id: 204,
    name: "Minimalist Leather Coaster Set",
    price: "₹499",
    description: "Set of 4 heavy full-grain leather coasters hot-stamped with the premium Zero Degree logo layout.",
    category: "Merchandise",
    image: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: false
  },

  // ==========================================
  // LEARN & DO COFFEE (Coffee Academy Masterclasses)
  // ==========================================
  {
    id: 12,
    name: "Pour-Over Mastery Workshop",
    price: "₹1,200",
    description: "A 90-minute live interactive session with our head barista. Learn bean geometry, water chemistry, and take home a 250g single-origin roast.",
    category: "Learn & Do Coffee",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: true
  },
  {
    id: 13,
    name: "Manual Espresso & Latte Art",
    price: "₹1,500",
    description: "Get behind our commercial manual espresso rig. Learn extraction diagnostics, milk micro-foaming, and master pouring patterns.",
    category: "Learn & Do Coffee",
    image: "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6f?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: false
  },
  {
    id: 107,
    name: "Coffee Roasting & Cupping Fundamentals",
    price: "₹2,200",
    description: "Track the journey from green bean to drinkable cup. Hand-roast a micro-batch sample and learn professional sensory scoring charts.",
    category: "Learn & Do Coffee",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: true
  },
  {
    id: 108,
    name: "Cold Brew Science Laboratory",
    price: "₹990",
    description: "Master slow-drip towers and nitrogen charging. Experiment with alternative infusing techniques over a comprehensive afternoon crash-course.",
    category: "Learn & Do Coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: false
  },
  {
    id: 115,
    name: "Sensory Cupping & Flavor Profiling",
    price: "₹1,350",
    description: "Train your olfactory senses. Blind-taste micro-lots from around the world and map out specialized tasting wheel analytics with our master tasters.",
    category: "Learn & Do Coffee",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: true
  },
  {
    id: 116,
    name: "Advanced Latte Art Patterns Masterclass",
    price: "₹1,800",
    description: "Take your basic milk texturing to pro tier. Learn the physics behind complex swans, multi-layered rosettas, and reverse-stack pours.",
    category: "Learn & Do Coffee",
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80",
    isBestSeller: true,
    isChefRecommended: false
  },
  {
    id: 205,
    name: "Rooftop AeroPress Immersion Course",
    price: "₹1,100",
    description: "Deconstruct flavor extraction variations using both traditional and inverted AeroPress brewing rules.",
    category: "Learn & Do Coffee",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    isBestSeller: false,
    isChefRecommended: false
  }
];

// --- API ENDPOINTS ---

app.get('/api/menu', (req, res) => {
  res.status(200).json({ success: true, menu: MENU_DATA });
});

app.get('/api/brewery-tanks', (req, res) => {
  res.status(200).json({
    success: true,
    tanks: [
      { id: "t1", name: "Premium Apple Cider", level: 85, status: "Flowing Fresh" },
      { id: "t2", name: "Zero Degree Lager", level: 35, status: "Running Low" },
      { id: "t3", name: "Belgian Witbier", level: 92, status: "Optimal Maturation" }
    ]
  });
});

app.get('/api/hill-weather', (req, res) => {
  res.status(200).json({
    success: true,
    temperature: "24°C",
    condition: "Clear Sky",
    visibility: "Perfect Horizon View",
    isSunsetHour: true
  });
});

app.post('/api/reservations', (req, res) => {
  const { name, email, guests, time } = req.body;
  
  if (!name || !email || !guests || !time) {
    return res.status(400).json({ success: false, message: 'All form elements required.' });
  }

  const newReservation = { 
    id: localReservationsMemory.length + 1, 
    name, 
    email, 
    guests, 
    time, 
    createdAt: new Date() 
  };
  
  localReservationsMemory.push(newReservation);
  console.log(` Table Registered for: ${name} (${guests} at ${time})`);
  
  res.status(201).json({ success: true, message: 'Reservation secured successfully!' });
});

app.listen(PORT, () => {
  console.log(` Zero Degree Premium Engine operational on http://localhost:${PORT}`);
});