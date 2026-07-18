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

// EXPANDED LUXURY MENU SCHEMA WITH HOSTED ASSET LINKS
const MENU_DATA = [
  // --- MICROBREWERY CRAFT SELECTIONS ---
  {
    id: 1,
    name: "Classic Brewed Pitcher",
    price: "₹450",
    description: "House-crafted signature crisp malt blend with subtle aromatic citrus profiles.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80" 
  },
  {
    id: 4,
    name: "Zero Degree Witbier",
    price: "₹380",
    description: "Traditional Belgian-style wheat beer brewed with fresh coriander seeds and sweet orange peel.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Roasted Stout Draft",
    price: "₹395",
    description: "A dark, rich pour boasting bold notes of espresso, organic cacao, and a smooth, creamy finish.",
    category: "Brewery Special",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&auto=format&fit=crop&q=80"
  },

  // --- SIGNATURE ROOFTOP MIXOLOGY ---
  {
    id: 6,
    name: "Hill Deck Botanical G&T",
    price: "₹520",
    description: "Premium gin cold-infused with cucumber ribbons, rosemary sprigs, elderflower liqueur, and artisan tonic.",
    category: "Signature Cocktails",
    image: "https://images.unsplash.com/photo-1524361189360-1e5c2677c57e?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    name: "Smoked Bourbon Sour",
    price: "₹560",
    description: "Oak-smoked bourbon shaken raw with fresh lime juice, aromatic bitters, and integrated simple syrup over clear ice blocks.",
    category: "Signature Cocktails",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80"
  },

  // --- ARTISAN MAIN KITCHEN ---
  {
    id: 2,
    name: "Smoked Peri Peri Pizza",
    price: "₹580",
    description: "Woodfired sourdough crust layered with hand-torn mozzarella, fire-roasted chicken cubes, and house peri-peri drizzle.",
    category: "Main Kitchen",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 8,
    name: "Four-Cheese Truffle Sourdough",
    price: "₹620",
    description: "Artisan white base featuring gorgonzola, aged parmesan, fresh mozzarella, and fontina, drizzled with raw honey.",
    category: "Main Kitchen",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80"
  },

  // --- ELEVATED PUB FARE ---
  {
    id: 3,
    name: "Truffle Parmesan Fries",
    price: "₹320",
    description: "Golden shoestring fries tossed in white truffle oil and freshly grated aged Parmigiano-Reggiano.",
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 9,
    name: "Ghee Roast Prawn Skewers",
    price: "₹490",
    description: "Succulent jumbo prawns pan-seared in classic Kundapur-style spiced ghee, served with a refreshing mint yogurt dip.",
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80"
  }
];

// --- API ENDPOINTS ---

/**
 * @route   GET /api/menu
 * @desc    Returns complete food, beer, and cocktail lists with cloud image vectors
 */
app.get('/api/menu', (req, res) => {
  res.status(200).json({ success: true, menu: MENU_DATA });
});

/**
 * @route   GET /api/brewery-tanks
 * @desc    Live craft brewery storage level updates
 */
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

/**
 * @route   GET /api/hill-weather
 * @desc    Real-time weather metrics matching RR Nagar's viewport deck conditions
 */
app.get('/api/hill-weather', (req, res) => {
  res.status(200).json({
    success: true,
    temperature: "24°C",
    condition: "Clear Sky",
    visibility: "Perfect Horizon View",
    isSunsetHour: true
  });
});

/**
 * @route   POST /api/reservations
 * @desc    Validates and registers guest table placement requests
 */
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
  console.log(`🎉 Table Registered for: ${name} (${guests} at ${time})`);
  
  res.status(201).json({ success: true, message: 'Reservation secured successfully!' });
});

// Launch server architecture
app.listen(PORT, () => {
  console.log(`🚀 Zero Degree Premium Engine operational on http://localhost:${PORT}`);
});