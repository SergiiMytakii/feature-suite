export interface Feature {
    id: string;
    name: string;
    subFeatures?: Feature[];
    isActive?: boolean;
  }