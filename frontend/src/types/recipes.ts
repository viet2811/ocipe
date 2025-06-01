export interface Recipe {
  id: number;
  name: string;
  meat_type: string;
  longevity: number;
  frequency: string;
  note: string;
  state: "active" | "used";
  ingredients: {
    name: string;
    quantity: string;
  }[];
}
