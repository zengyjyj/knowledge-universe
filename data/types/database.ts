export type Cloud = {
  id: number;
  name: string;
  title: string;
  description: string;
};

export type Category = {
  id: number;
  cloud_id: number;
  name: string;
  title: string;
  description: string;
  order_index: number;
};

export type SubCategory = {
  id: number;
  category_id: number;
  name: string;
  title: string;
  description: string;
  order_index: number;
  intro: string;
};

export type Node = {
  id: number;
  subCategory_id: number;
  title: string;
  definition: string;
  detail: string;
};

export type NodePath = {
  subName: string;
  subTitle: string;
  catName: string;
  catTitle: string;
  cName: string;
  cTitle: string;
};
