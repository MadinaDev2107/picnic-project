export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  discount?: number;
  rating?: number;
  category: string;
  images: string[];
};
export type Category = {
  id: string;
  name: string;
};
export type CartItem = Product & {
  quantity: number;
  addedAt: Date;
  images: string;
};
export interface OrderItem {
  id: string;
  name: string;
  phone: string;
  address: string;
  message: string;
  items: { title: string; quantity: number; price: number }[];
  totalPrice: number;
  delivered?: boolean;
}

export type Aloqa = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: string;
};
export type Blog = {
  id: string;
  title: string;
  author: string;
  description: string;
  thubnail: string;
  image: string;
  createdAt?: string;
};
