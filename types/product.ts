export type Gender = "men" | "women" | "unisex";

export type ProductCategory = "clothing" | "accessories";

export interface ProductImage {
  url: string; // e.g. /uploads/products/abc123.webp
  alt?: string;
}

export interface ProductVariantOption {
  color?: string;
  size?: string;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  category: ProductCategory;
  gender: Gender;
  brand?: string;
  tags: string[];
  colors: string[];
  sizes: string[];
  images: ProductImage[];
  stock: number;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  category: ProductCategory;
  gender: Gender;
  brand?: string;
  tags: string[];
  colors: string[];
  sizes: string[];
  images: ProductImage[];
  stock: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface ProductFilters {
  category?: ProductCategory;
  gender?: Gender;
  size?: string;
  color?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "popularity";
  page?: number;
  limit?: number;
}
