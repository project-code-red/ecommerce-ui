export interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
  linkText?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

