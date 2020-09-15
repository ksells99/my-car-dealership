export interface Vehicle {
  id?: string;
  registration?: string;
  make?: string;
  model?: string;
  colour?: string;
  price?: number;
  status?: 'unsold' | 'sold' | null;
  saleDate?: any;
  userId?: any;
}
