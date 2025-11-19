export interface Products {
  id: number;
  _id?: number; // Keep for backward compatibility
  name: string;
  title?: string; // Keep for backward compatibility
  isNew?: boolean;
  oldPrice?: number;
  price: number;
  description: string;
  category: string;
  brand?: string;
  image?: string;
  imageData?: string; // Base64 image from Spring Boot
  rating?: number;
  quantity: number;
  stockQuantity?: number;
  productAvailable?: boolean;
}

export interface ItemProps {
  item: Products;
}

export interface StateProps {
  shopping: {
    productData: [];
    userInfo: {};
    orderData: {
      order: Products[];
    };
  };
}
