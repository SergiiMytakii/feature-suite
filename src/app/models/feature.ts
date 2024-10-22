export interface Feature {
    id: string;
    name: string;
    subFeatures?: Feature[];
    level: number;
  }