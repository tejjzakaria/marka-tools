/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

export interface ProductFeature {
  iconKey: string;
  titleKey: string;
  descriptionKey: string;
}

export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey?: string;
  shortDescriptionKey?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  categoryId: string;
  badge?: "new" | "sale" | "bestseller";
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sku?: string;
  // Hook data for product page
  stockCount?: number;
  soldCount?: number;
  viewersCount?: number;
  features?: ProductFeature[];
  highlightsKeys?: string[];
  guaranteeDays?: number;
}

export const allProducts: Product[] = [
  {
    id: "1",
    slug: "wireless-earbuds-pro",
    nameKey: "products.wirelessEarbuds",
    descriptionKey: "products.wirelessEarbudsDesc",
    shortDescriptionKey: "products.wirelessEarbudsShort",
    price: 299,
    originalPrice: 399,
    image: "/images/products/placeholder.jpg",
    images: ["/images/products/placeholder.jpg", "/images/products/placeholder.jpg", "/images/products/placeholder.jpg"],
    categoryId: "electronics",
    badge: "sale",
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 12,
    soldCount: 847,
    viewersCount: 23,
    guaranteeDays: 30,
    highlightsKeys: [
      "productPage.highlights.wireless",
      "productPage.highlights.battery",
      "productPage.highlights.noiseCancel",
      "productPage.highlights.waterproof",
    ],
  },
  {
    id: "2",
    slug: "smart-watch-series-5",
    nameKey: "products.smartWatch",
    descriptionKey: "products.smartWatchDesc",
    shortDescriptionKey: "products.smartWatchShort",
    price: 599,
    image: "/images/products/placeholder.jpg",
    images: ["/images/products/placeholder.jpg", "/images/products/placeholder.jpg"],
    categoryId: "electronics",
    badge: "bestseller",
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    stockCount: 8,
    soldCount: 1234,
    viewersCount: 45,
    guaranteeDays: 14,
    highlightsKeys: [
      "productPage.highlights.smartFeatures",
      "productPage.highlights.healthTrack",
      "productPage.highlights.longBattery",
      "productPage.highlights.waterproof",
    ],
  },
  {
    id: "3",
    slug: "leather-handbag",
    nameKey: "products.leatherHandbag",
    price: 450,
    originalPrice: 550,
    image: "/images/products/placeholder.jpg",
    categoryId: "fashion",
    badge: "sale",
    rating: 4.7,
    reviewCount: 56,
    inStock: true,
  },
  {
    id: "4",
    slug: "organic-face-serum",
    nameKey: "products.faceSerum",
    price: 189,
    image: "/images/products/placeholder.jpg",
    categoryId: "beauty",
    badge: "new",
    rating: 4.6,
    reviewCount: 34,
    inStock: true,
  },
  {
    id: "5",
    slug: "yoga-mat-premium",
    nameKey: "products.yogaMat",
    price: 149,
    image: "/images/products/placeholder.jpg",
    categoryId: "sports",
    rating: 4.5,
    reviewCount: 78,
    inStock: true,
  },
  {
    id: "6",
    slug: "ceramic-dinner-set",
    nameKey: "products.dinnerSet",
    price: 399,
    originalPrice: 499,
    image: "/images/products/placeholder.jpg",
    categoryId: "home",
    badge: "sale",
    rating: 4.8,
    reviewCount: 45,
    inStock: true,
  },
  {
    id: "7",
    slug: "bluetooth-speaker",
    nameKey: "products.bluetoothSpeaker",
    price: 249,
    image: "/images/products/placeholder.jpg",
    categoryId: "electronics",
    badge: "new",
    rating: 4.7,
    reviewCount: 67,
    inStock: true,
  },
  {
    id: "8",
    slug: "cotton-dress",
    nameKey: "products.cottonDress",
    price: 199,
    image: "/images/products/placeholder.jpg",
    categoryId: "fashion",
    rating: 4.4,
    reviewCount: 92,
    inStock: true,
  },
  {
    id: "9",
    slug: "gaming-headset",
    nameKey: "products.gamingHeadset",
    price: 349,
    originalPrice: 449,
    image: "/images/products/placeholder.jpg",
    categoryId: "electronics",
    badge: "sale",
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
  },
  {
    id: "10",
    slug: "running-shoes",
    nameKey: "products.runningShoes",
    price: 399,
    image: "/images/products/placeholder.jpg",
    categoryId: "sports",
    badge: "bestseller",
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
  },
  {
    id: "11",
    slug: "makeup-brush-set",
    nameKey: "products.makeupBrushSet",
    price: 129,
    image: "/images/products/placeholder.jpg",
    categoryId: "beauty",
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
  },
  {
    id: "12",
    slug: "decorative-lamp",
    nameKey: "products.decorativeLamp",
    price: 179,
    originalPrice: 229,
    image: "/images/products/placeholder.jpg",
    categoryId: "home",
    badge: "sale",
    rating: 4.3,
    reviewCount: 45,
    inStock: true,
  },
  {
    id: "13",
    slug: "mens-watch-classic",
    nameKey: "products.mensWatch",
    price: 499,
    image: "/images/products/placeholder.jpg",
    categoryId: "fashion",
    badge: "new",
    rating: 4.7,
    reviewCount: 67,
    inStock: true,
  },
  {
    id: "14",
    slug: "fitness-tracker",
    nameKey: "products.fitnessTracker",
    price: 199,
    image: "/images/products/placeholder.jpg",
    categoryId: "electronics",
    rating: 4.4,
    reviewCount: 178,
    inStock: true,
  },
  {
    id: "15",
    slug: "perfume-collection",
    nameKey: "products.perfumeCollection",
    price: 299,
    originalPrice: 399,
    image: "/images/products/placeholder.jpg",
    categoryId: "beauty",
    badge: "sale",
    rating: 4.9,
    reviewCount: 112,
    inStock: true,
  },
  {
    id: "16",
    slug: "kids-toy-set",
    nameKey: "products.kidsToySet",
    price: 149,
    image: "/images/products/placeholder.jpg",
    categoryId: "toys",
    badge: "bestseller",
    rating: 4.6,
    reviewCount: 203,
    inStock: true,
  },
  {
    id: "17",
    slug: "kitchen-blender",
    nameKey: "products.kitchenBlender",
    price: 279,
    image: "/images/products/placeholder.jpg",
    categoryId: "kitchen",
    badge: "new",
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
  },
  {
    id: "18",
    slug: "baby-stroller",
    nameKey: "products.babyStroller",
    price: 899,
    originalPrice: 1099,
    image: "/images/products/placeholder.jpg",
    categoryId: "baby",
    badge: "sale",
    rating: 4.8,
    reviewCount: 56,
    inStock: true,
  },
  {
    id: "19",
    slug: "laptop-backpack",
    nameKey: "products.laptopBackpack",
    price: 199,
    image: "/images/products/placeholder.jpg",
    categoryId: "fashion",
    rating: 4.6,
    reviewCount: 134,
    inStock: true,
  },
  {
    id: "20",
    slug: "wireless-charger",
    nameKey: "products.wirelessCharger",
    price: 99,
    image: "/images/products/placeholder.jpg",
    categoryId: "electronics",
    rating: 4.3,
    reviewCount: 267,
    inStock: true,
  },
  {
    id: "21",
    slug: "sunglasses-premium",
    nameKey: "products.sunglasses",
    price: 249,
    image: "/images/products/placeholder.jpg",
    categoryId: "fashion",
    badge: "new",
    rating: 4.5,
    reviewCount: 78,
    inStock: false,
  },
  {
    id: "22",
    slug: "hair-dryer-pro",
    nameKey: "products.hairDryer",
    price: 199,
    originalPrice: 259,
    image: "/images/products/placeholder.jpg",
    categoryId: "beauty",
    badge: "sale",
    rating: 4.4,
    reviewCount: 145,
    inStock: true,
  },
  {
    id: "23",
    slug: "dumbbells-set",
    nameKey: "products.dumbbellsSet",
    price: 349,
    image: "/images/products/placeholder.jpg",
    categoryId: "sports",
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
  },
  {
    id: "24",
    slug: "coffee-maker",
    nameKey: "products.coffeeMaker",
    price: 449,
    image: "/images/products/placeholder.jpg",
    categoryId: "kitchen",
    badge: "bestseller",
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
  },
  // Products from tecnologia.ma
  {
    id: "25",
    slug: "electric-heating-belt",
    nameKey: "products.electricHeatingBelt",
    descriptionKey: "products.electricHeatingBeltDesc",
    shortDescriptionKey: "products.electricHeatingBeltShort",
    price: 239,
    originalPrice: 399,
    image: "/images/products/placeholder.jpg",
    images: ["/images/products/placeholder.jpg", "/images/products/placeholder.jpg", "/images/products/placeholder.jpg"],
    categoryId: "beauty",
    badge: "sale",
    rating: 4.7,
    reviewCount: 86,
    inStock: true,
    stockCount: 15,
    soldCount: 523,
    viewersCount: 18,
    guaranteeDays: 14,
    highlightsKeys: [
      "productPage.highlights.heating",
      "productPage.highlights.vibration",
      "productPage.highlights.portable",
      "productPage.highlights.painRelief",
    ],
  },
  {
    id: "26",
    slug: "rotating-ring-box",
    nameKey: "products.rotatingRingBox",
    descriptionKey: "products.rotatingRingBoxDesc",
    shortDescriptionKey: "products.rotatingRingBoxShort",
    price: 249,
    originalPrice: 350,
    image: "/images/products/placeholder.jpg",
    images: ["/images/products/placeholder.jpg", "/images/products/placeholder.jpg", "/images/products/placeholder.jpg"],
    categoryId: "home",
    badge: "sale",
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    stockCount: 20,
    soldCount: 312,
    viewersCount: 12,
    guaranteeDays: 14,
    highlightsKeys: [
      "productPage.highlights.rotating",
      "productPage.highlights.elegant",
      "productPage.highlights.giftReady",
      "productPage.highlights.unique",
    ],
  },
];

export const featuredProducts = allProducts.slice(0, 8);

export const newArrivals = allProducts.filter((p) => p.badge === "new");

export const onSaleProducts = allProducts.filter((p) => p.badge === "sale");

export const bestSellers = allProducts.filter((p) => p.badge === "bestseller");

export const getProductsByCategory = (categoryId: string) =>
  allProducts.filter((p) => p.categoryId === categoryId);

export const getProductBySlug = (slug: string) =>
  allProducts.find((p) => p.slug === slug);

export const priceRanges = [
  { id: "0-100", min: 0, max: 100, labelKey: "shop.filters.price.under100" },
  { id: "100-300", min: 100, max: 300, labelKey: "shop.filters.price.100to300" },
  { id: "300-500", min: 300, max: 500, labelKey: "shop.filters.price.300to500" },
  { id: "500+", min: 500, max: Infinity, labelKey: "shop.filters.price.over500" },
];

export const sortOptions = [
  { id: "featured", labelKey: "shop.sort.featured" },
  { id: "newest", labelKey: "shop.sort.newest" },
  { id: "price-asc", labelKey: "shop.sort.priceAsc" },
  { id: "price-desc", labelKey: "shop.sort.priceDesc" },
  { id: "rating", labelKey: "shop.sort.rating" },
];
