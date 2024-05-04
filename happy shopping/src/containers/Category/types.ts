export type CategoryAndTagResponseType = {
  success: boolean;
  data: {
    category: Array<{
      id: string;
      name: string
    }>;
    tag: Array<string>
  };
}

export type ProductType = {
  id: string;
  imgUrl: string;
  title: string;
  price: number;
  sales: number;
}

export type ProductResponseType = {
  success: boolean;
  data: Array<ProductType>
}

export type CartType = {
  id: string;
  title: string;
  imgUrl: string,
  price: string,
  count: number
}

export type CartResponseType = {
  success: boolean;
  data: CartType
}
