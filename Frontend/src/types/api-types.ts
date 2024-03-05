import { Product, User } from "./types";

export type MessageResponse = {
    success: boolean,
    message: string
}

export type CustomError = {
  status: number;
  data: {
      error: string;
      success: boolean;
    };
  };

  export type userResponse = {
      success: boolean,
      user: User
  }

  export type AllProductResponse = {
      success: boolean,
      products: Product[]
  }
  export type categoriesResponse = {
      success: boolean,
      categories: string[]
  }

  export type searchProductResponse = AllProductResponse & {
    totalPage: number;
}
  
export type searchProductsRequest = {
    price: number;
    page: number;
    category: string;
    sort: string;
    search: string
}

export type ProductResponse = {
    success: boolean,
    product: Product
}

export type NewProductRequest = {
    id: string;
    formData: FormData;
  };

export type updateProductRequest = {
    userId: string;
    productId: string;
    formData: FormData;
}
export type deleteProductRequest = {
    userId: string;
    productId: string;
}