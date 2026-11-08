import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem.js';

const sampleMenuItems = [
  {
    name: 'Cappuccino',
    description: 'Classic Italian espresso balanced with steamed milk and crowned with thick velvety foam and cacao dust.',
    price: 12.00,
    category: 'cappuccino',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: 4,
  },
  {
    name: 'Latte',
    description: 'Smooth espresso with chilled fresh milk served over crystal ice in our signature takeaway cup.',
    price: 15.00,
    category: 'latte',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: 4,
  },
  {
    name: 'Cold Coffee',
    description: 'Layered slow-steeped cold brew with textured sweet cream served in our fluted ripple glass.',
    price: 18.00,
    category: 'cold coffee',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: 3,
  },
  {
    name: 'Affogato',
    description: 'A scoop of artisanal Madagascar vanilla gelato drowned in a hot shot of freshly pulled double espresso.',
    price: 20.00,
    category: 'affogato',
    image: 'https://images.unsplash.com/photo-1594261956806-3af035d57b0c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: 3,
  },
  {
    name: 'Americano',
    description: 'Rich shots of espresso lengthened with hot mineral water for a clean, bold coffee flavor.',
    price: 10.00,
    category: 'hot coffee',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: 2,
  },
  {
    name: 'Mocha',
    description: 'Rich dark chocolate ganache infused with double shot espresso and topped with whipped chocolate drizzle.',
    price: 16.00,
    category: 'mocha',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: 5,
  },
  {
    name: 'Frappuccino',
    description: 'Blended icy coffee confection topped with generous vanilla swirl, caramel ribbon and chocolate flakes.',
    price: 17.00,
    category: 'frappuccino',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: 5,
  },
  {
    name: 'Flat White',
    description: 'Double ristretto poured with velvety micro-foam creating a silky, full-bodied espresso experience.',
    price: 14.00,
    category: 'flat white',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: 4,
  },
  {
    name: 'Iced Caramel Macchiato',
    description: 'Chilled whole milk marked with bold espresso shots, rich vanilla bean syrup, and buttery caramel drizzle.',
    price: 16.50,
    category: 'cold coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: 4,
  },
  {
    name: 'Nitro Cold Brew',
    description: 'Draft cold brew infused with pure nitrogen for a cascading creamy head and velvet smooth mouthfeel.',
    price: 18.50,
    category: 'cold coffee',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: 2,
  },
  {
    name: 'Artisan Butter Croissant',
    description: 'Flaky golden French pastry made with cultured Normandy butter and baked fresh every morning.',
    price: 6.50,
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: 2,
  },
  {
    name: 'Belgian Chocolate Brownie',
    description: 'Dense fudge brownie crafted with 70% dark chocolate and roasted walnuts with sea salt crystal finish.',
    price: 7.00,
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    isAvailable: false,
    preparationTime: 2,
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe_system';
    console.log('Connecting to database for seeding...');

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB successfully.');

    // Clear existing menu items and re-seed
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items.');

    const createdItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`Successfully seeded ${createdItems.length} menu items.`);

    createdItems.forEach((item, index) => {
      console.log(` [${index + 1}] ${item.name} - ₹${item.price.toFixed(2)} (${item.category})`);
    });

    await mongoose.disconnect();
    console.log('Database disconnected successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed menu database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
