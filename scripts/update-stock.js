/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function updateStock() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products to update`);

    let updated = 0;

    for (const product of products) {
      // Generate random stock between 70 and 130
      const randomStock = Math.floor(Math.random() * (130 - 70 + 1)) + 70;

      await Product.updateOne(
        { _id: product._id },
        { $set: { stockCount: randomStock, inStock: true } }
      );

      console.log(`✅ Updated "${product.name}": ${randomStock} units in stock`);
      updated++;
    }

    console.log(`\n📊 Summary: Updated ${updated} products with stock ranging from 70-130`);

    await mongoose.connection.close();
    console.log('✅ Done! Database connection closed.');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateStock();
