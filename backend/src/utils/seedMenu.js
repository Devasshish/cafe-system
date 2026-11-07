import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem.js';

const sampleMenuItems = [
  {
    name: 'Signature Caramel Macchiato',
    description: 'Freshly steamed velvety milk with Madagascar vanilla syrup, marked with rich espresso and finished with buttery caramel drizzle.',
    price: 4.95,
    category: 'hot coffee',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTime: 5,
  },
  {
    name: 'Double Shot Espresso',
    description: 'A bold, full-bodied espresso with a dense layer of rich hazelnut crema, brewed from single-origin Ethiopian beans.',
    price: 3.25,
    category: 'hot coffee',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTime: 3,
  },
  {
    name: 'Vanilla Bean Flat White',
    description: 'Micro-foamed whole milk delicately poured over a double ristretto shot, infused with real vanilla bean extract.',
    price: 4.65,
    category: 'hot coffee',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTime: 4,
  },
  {
    name: 'Cold Brew Reserve',
    description: 'Steeped for 20 hours in cold filtered water for an ultra-smooth, naturally sweet, low-acidity coffee experience.',
    price: 4.85,
    category: 'cold coffee',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTime: 2,
  },
  {
    name: 'Iced Hazelnut Latte',
    description: 'Chilled espresso and milk poured over crystal clear ice cubes with toasted hazelnut praline syrup.',
    price: 5.20,
    category: 'cold coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTime: 4,
  },
  {
    name: 'Nitro Cold Brew',
    description: 'Cold brew coffee infused with food-grade nitrogen on draft for a cascading velvety head and creamy mouthfeel.',
    price: 5.45,
    category: 'cold coffee',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTime: 2,
  },
  {
    name: 'Ceremonial Matcha Latte',
    description: 'Stone-ground Uji green tea whisked with creamy oat milk and a touch of raw organic wildflower honey.',
    price: 5.50,
    category: 'tea',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTime: 5,
  },
  {
    name: 'Spiced Chai Latte',
    description: 'Slow-brewed black tea steeped with whole cinnamon, cardamom, cloves, and fresh ginger, blended with steamed milk.',
    price: 4.75,
    category: 'tea',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTime: 4,
  },
  {
    name: 'Artisan Butter Croissant',
    description: 'Traditional French croissant folded with pure cultured Normandy butter, baked to a golden flaky perfection.',
    price: 3.85,
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTime: 2,
  },
  {
    name: 'Triple Chocolate Brownie',
    description: 'Decadent fudge brownie made with 70% dark Belgian chocolate, milk chocolate chunks, and a dusting of sea salt.',
    price: 4.25,
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTime: 2,
  },
  {
    name: 'Wild Blueberry Muffin',
    description: 'Moist and tender crumb studded with wild Maine blueberries and crowned with a crunchy cinnamon streusel top.',
    price: 3.95,
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    preparationTime: 2,
  },
  {
    name: 'Tiramisu Cake Slice',
    description: 'Layers of espresso-soaked ladyfingers and whipped mascarpone cream dusted with Dutch cocoa powder.',
    price: 6.50,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    isAvailable: false, // Testing Sold Out badge
    preparationTime: 3,
  },
];

const seedDatabase = async () => {
  let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error('Missing MONGODB_URI in environment!');
    process.exit(1);
  }

  if (uri.startsWith('mongodb://mongodb+srv://')) {
    uri = uri.replace('mongodb://mongodb+srv://', 'mongodb+srv://');
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas for seeding.');

    // Remove existing menu items and replace with the sample collection
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items.');

    const inserted = await MenuItem.insertMany(sampleMenuItems);
    console.log(`Successfully seeded ${inserted.length} cafe menu items!`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedDatabase();

