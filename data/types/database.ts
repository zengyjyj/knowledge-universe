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
  question: string;
};

export type GuideNode = {
  id: number;
  definition: string;
  question: string;
};

export type NodePath = {
  subName: string;
  subTitle: string;
  catName: string;
  catTitle: string;
  cName: string;
  cTitle: string;
};

export type Profile = {
  user_id: number;
  username: string;
  mail: string;
};

export type GoalLite = {
  id: number;
  nodeId: number;
  title: string;
  introduction: string;
  difficulty: string;
};

export type Goal = {
  id: number;
  title: string;
  introduction: string;
  difficulty: string;
  description: string;
  period: string;
  information: string | null;
};
