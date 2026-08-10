export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  currency: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  heroImage: string; // URL, e.g. /api/images/<id> — shown behind the homepage hero
}
