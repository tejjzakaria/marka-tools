/**
 * @author Zakaria Tejjani
 * @date 2025-12-30
 *
 * Script to fix the SKU index issue by dropping the old non-sparse unique index
 * and allowing Mongoose to recreate it as a sparse unique index.
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fixSkuIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    console.log('\nChecking existing indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));

    // Find the SKU index
    const skuIndex = indexes.find(idx => idx.name === 'sku_1');

    if (skuIndex) {
      console.log('\nFound SKU index:', skuIndex);

      // Check if it's already sparse
      if (skuIndex.sparse) {
        console.log('✓ SKU index is already sparse and unique. No changes needed.');
      } else {
        console.log('✗ SKU index is not sparse. Dropping old index...');
        await collection.dropIndex('sku_1');
        console.log('✓ Old index dropped successfully!');

        console.log('\nCreating new sparse unique index...');
        await collection.createIndex({ sku: 1 }, { unique: true, sparse: true });
        console.log('✓ New sparse unique index created!');
      }
    } else {
      console.log('\nNo SKU index found. Creating sparse unique index...');
      await collection.createIndex({ sku: 1 }, { unique: true, sparse: true });
      console.log('✓ Sparse unique index created!');
    }

    console.log('\n✓ SKU index fix completed successfully!');
    console.log('You can now create products without providing a SKU.');

  } catch (error) {
    console.error('Error fixing SKU index:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
}

fixSkuIndex();
