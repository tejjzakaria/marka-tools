/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */

export interface DBProductFeature {
  icon: string;
  title: string;
  description: string;
}

export interface DBProductOffer {
  icon: string;
  text: string;
  price: number;
}

export interface DBProductReview {
  reviewerName: string;
  reviewText: string;
  rating: number;
  date: string;
  verified: boolean;
  images?: string[];
}

export interface DBProduct {
  _id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  categoryId: string;
  badge?: "new" | "sale" | "bestseller";
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sku?: string;
  stockCount: number;
  soldCount: number;
  viewersCount: number;
  features: DBProductFeature[];
  highlights: string[];
  offers?: DBProductOffer[];
  guaranteeDays: number;
  reviews?: DBProductReview[];
  googleSheetId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  products: DBProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface SingleProductResponse {
  success: boolean;
  product: DBProduct;
  message?: string;
}
