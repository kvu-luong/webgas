export type FilterOneProduct = {
  product_shop: string;
  product_id: string;
};

export type TFindAllProduct = {
  limit: number;
  sort: string;
  page: number;
  filter: Record<string, string | boolean | number>;
  select?: string[];
};
