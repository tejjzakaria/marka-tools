/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Product model schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  categoryId: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  stockCount: { type: Number, default: 100 },
  badge: { type: String, enum: ['new', 'sale', 'bestseller', ''] },
  guaranteeDays: { type: Number, default: 30 },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  viewersCount: { type: Number, default: 0 },
  image: String,
  images: [String],
  highlights: [String],
  features: [{
    icon: String,
    title: String,
    description: String
  }],
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Helper function to generate slug
function generateSlug(name, index) {
  // Transliteration map for Arabic to Latin
  const arabicToLatin = {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa',
    'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
    'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
    'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
    'ة': 'a', 'ئ': 'e', 'ء': 'a'
  };

  let slug = name.toLowerCase();

  // Replace Arabic characters
  for (const [arabic, latin] of Object.entries(arabicToLatin)) {
    slug = slug.replace(new RegExp(arabic, 'g'), latin);
  }

  slug = slug
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // If slug is empty or too short, use index
  if (!slug || slug.length < 3) {
    slug = `product-${index}`;
  }

  return slug;
}

// Helper function to categorize products
function categorizeProduct(name) {
  const nameLower = name.toLowerCase();

  if (nameLower.includes('بروجكتور') || nameLower.includes('طابعة') || nameLower.includes('printer') || nameLower.includes('projector')) {
    return 'electronics';
  }
  if (nameLower.includes('قبّعة') || nameLower.includes('سترة') || nameLower.includes('soutien') || nameLower.includes('helmet')) {
    return 'fashion';
  }
  if (nameLower.includes('مصباح') || nameLower.includes('منظّم') || nameLower.includes('مقعد') || nameLower.includes('sensor') || nameLower.includes('door')) {
    return 'home';
  }
  if (nameLower.includes('brosse') || nameLower.includes('مشبك')) {
    return 'beauty';
  }
  if (nameLower.includes('كرة') || nameLower.includes('لعبة صيد') || nameLower.includes('wrist ball') || nameLower.includes('boxing')) {
    return 'sports';
  }
  if (nameLower.includes('لعبة للقطط') || nameLower.includes('وسادة الأطفال') || nameLower.includes('كاس للأطفال')) {
    return 'toys';
  }
  if (nameLower.includes('سِكين') || nameLower.includes('كماشات') || nameLower.includes('فلتر')) {
    return 'kitchen';
  }
  if (nameLower.includes('حزام') || nameLower.includes('مدفئ') || nameLower.includes('knee massager') || nameLower.includes('posture')) {
    return 'beauty';
  }
  if (nameLower.includes('دفتر') || nameLower.includes('كرة كريستال') || nameLower.includes('مجهر')) {
    return 'books';
  }
  if (nameLower.includes('إنذار') || nameLower.includes('أداة الطوارئ') || nameLower.includes('موزّع أغطية')) {
    return 'automotive';
  }

  return 'electronics'; // default
}

// Generate description based on product name
function generateDescription(name, price) {
  const templates = {
    default: `منتج ${name} عالي الجودة بسعر مناسب. يتميز بالمتانة والأداء الممتاز. مناسب للاستخدام اليومي ويأتي مع ضمان 30 يوم. احصل عليه الآن بسعر ${price} درهم فقط مع توصيل مجاني لجميع أنحاء المغرب.`
  };

  return templates.default;
}

// Generate highlights based on category
function generateHighlights(categoryId, name) {
  const common = ['توصيل مجاني', 'ضمان 30 يوم', 'جودة عالية'];

  const categorySpecific = {
    electronics: ['تقنية حديثة', 'موفر للطاقة'],
    fashion: ['تصميم عصري', 'مريح للارتداء'],
    home: ['سهل الاستخدام', 'متين وطويل الأمد'],
    beauty: ['آمن على البشرة', 'نتائج سريعة'],
    sports: ['مقاوم للصدمات', 'خفيف الوزن'],
    toys: ['آمن للأطفال', 'ألوان زاهية'],
    kitchen: ['سهل التنظيف', 'مقاوم للصدأ'],
    books: ['محتوى قيم', 'تصميم جذاب'],
    automotive: ['موثوق', 'سهل التركيب']
  };

  return [...common, ...(categorySpecific[categoryId] || ['منتج مميز'])];
}

// Generate features based on category
function generateFeatures(categoryId, name) {
  const commonFeatures = [
    { icon: 'truck', title: 'شحن سريع', description: 'توصيل سريع لجميع المدن المغربية' },
    { icon: 'shield', title: 'ضمان الجودة', description: 'ضمان 30 يوم على جميع المنتجات' }
  ];

  const categoryFeatures = {
    electronics: [
      { icon: 'battery', title: 'بطارية طويلة', description: 'عمر بطارية يدوم لساعات طويلة' },
      { icon: 'wifi', title: 'اتصال موثوق', description: 'أداء ثابت وموثوق' }
    ],
    fashion: [
      { icon: 'shirt', title: 'قماش ممتاز', description: 'خامات عالية الجودة ومريحة' },
      { icon: 'star', title: 'تصميم مميز', description: 'تصميم عصري يناسب جميع الأذواق' }
    ],
    home: [
      { icon: 'home', title: 'للمنزل', description: 'مثالي للاستخدام المنزلي اليومي' },
      { icon: 'tool', title: 'متين', description: 'صنع من مواد قوية وطويلة الأمد' }
    ],
    beauty: [
      { icon: 'heart', title: 'آمن', description: 'آمن على البشرة والجسم' },
      { icon: 'star', title: 'فعال', description: 'نتائج ملموسة وسريعة' }
    ],
    sports: [
      { icon: 'droplet', title: 'مقاوم للماء', description: 'يمكن استخدامه في جميع الظروف' },
      { icon: 'gift', title: 'متعدد الاستخدام', description: 'مناسب لمختلف التمارين' }
    ]
  };

  return [...commonFeatures, ...(categoryFeatures[categoryId] || [
    { icon: 'star', title: 'جودة ممتازة', description: 'منتج عالي الجودة' },
    { icon: 'gift', title: 'قيمة رائعة', description: 'سعر مناسب مقابل الجودة' }
  ])];
}

async function importProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Read JSON file
    const jsonPath = path.join(__dirname, '../public/scraped-products.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const scrapedProducts = JSON.parse(rawData);

    console.log(`📦 Found ${scrapedProducts.length} products to import`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 0; i < scrapedProducts.length; i++) {
      const item = scrapedProducts[i];

      try {
        const name = item['اسم المنتج'];
        const image = item['صورة المنتج'];
        const price = parseFloat(item['السعر (درهم مغربي)']);
        const originalPriceStr = item['السعر قبل الخصم (درهم مغربي)'];
        const originalPrice = originalPriceStr && originalPriceStr.trim() ? parseFloat(originalPriceStr) : null;

        if (!name || !price || !image) {
          console.log(`⚠️  Skipping product ${i + 1}: Missing required fields`);
          skipped++;
          continue;
        }

        const slug = generateSlug(name, i + 1);
        const categoryId = categorizeProduct(name);
        const sku = `SKU-${Date.now()}-${i}`;

        // Check if product already exists
        const existing = await Product.findOne({ $or: [{ slug }, { name }] });
        if (existing) {
          console.log(`⚠️  Skipping "${name}": Already exists`);
          skipped++;
          continue;
        }

        const productData = {
          name,
          slug,
          sku,
          categoryId,
          description: generateDescription(name, price),
          shortDescription: name,
          price,
          originalPrice,
          stockCount: 100,
          badge: originalPrice ? 'sale' : '',
          guaranteeDays: 30,
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 50) + 10,
          soldCount: Math.floor(Math.random() * 100) + 20,
          viewersCount: Math.floor(Math.random() * 200) + 50,
          image,
          images: [image],
          highlights: generateHighlights(categoryId, name),
          features: generateFeatures(categoryId, name)
        };

        await Product.create(productData);
        console.log(`✅ Imported: ${name} (${categoryId})`);
        imported++;

      } catch (error) {
        console.error(`❌ Error importing product ${i + 1}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Import Summary:');
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📦 Total: ${scrapedProducts.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Done! Database connection closed.');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

importProducts();
