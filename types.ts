export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: string;
  badge?: string;
  bgColor: string;
  gradient: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  emoji: string;
  timestamp: Date;
}

export enum TrackingStage {
  NOT_ORDERED = 'NOT_ORDERED',
  PLACED = 'PLACED',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  PACKED = 'PACKED',
  ASSIGNED = 'ASSIGNED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  NEARBY = 'NEARBY',
  DELIVERED = 'DELIVERED',
}

export interface TrackingStep {
  stage: TrackingStage;
  title: string;
  description: string;
  emoji: string;
  status: 'pending' | 'active' | 'completed';
}

export interface Coupon {
  code: string;
  discountType: 'flat' | 'percent' | 'free_delivery';
  discountValue: number;
  minOrderValue: number;
  description: string;
}

export type WeatherCondition = 'SUNNY' | 'CLOUDY' | 'RAINY' | 'STORMY';

export interface WeatherInfo {
  condition: WeatherCondition;
  label: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  delayMinutes: number;
  emoji: string;
}

export interface ChatMessage {
  id: string;
  sender: 'driver' | 'user';
  text: string;
  time: string;
  typing?: boolean;
}

export interface NotificationHistoryItem {
  id: string;
  text: string;
  time: string;
  unread: boolean;
}

export interface OrderReview {
  foodRating: number;
  partnerRating: number;
  packagingRating: number;
  feedback: string;
}

export interface SavedAddress {
  id: string;
  name: string; // Home, Work, Hostel, Grandma, Friend, etc.
  houseNumber: string;
  street: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  isDefault: boolean;
  isFavorite?: boolean;
  recentlyUsedAt?: number; // timestamp to sort by recently used
  latitude?: number;
  longitude?: number;
}


