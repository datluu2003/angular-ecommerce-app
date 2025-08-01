export interface Category {
  _id: string;
  name: string;
  image: string;
}

export interface Product {
  _id: string;
  name: string;
  image: string;
  image_cover?: string;
  description: string;
  price: number;
  slug?: string;
  type?: string;
  category?: Category;
}
