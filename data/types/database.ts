export type Cloud = {
  id: number;
  name: string;
  title: string;
  description: string;
};

export type Categories = {
  id: number;
  cloud_id: number;
  name: string;
  title: string;
  description: string;
  order_index: number;
};
