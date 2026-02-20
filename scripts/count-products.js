const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function count() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  const total = await Product.countDocuments();
  console.log(`\n📊 Total products in database: ${total}`);

  // Count by category
  const byCategory = await Product.aggregate([
    { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  console.log('\n📦 Products by category:');
  for (const cat of byCategory) {
    console.log(`   ${cat._id}: ${cat.count}`);
  }

  await mongoose.connection.close();
}

count();
