export interface Recipe {
  id: number;
  name: string;
  meat_type: string;
  longevity: number;
  frequency: "weekday" | "weekend" | "rarely";
  note: string;
  state: "active" | "used";
  ingredient_list: {
    name: string;
    quantity?: string;
  }[];
  accuracy: number;
}

export interface RecipeInput {
  name: string;
  meat_type: string;
  longevity: number;
  frequency: "weekday" | "weekend" | "rarely";
  note?: string;
  state: "active" | "used";
  ingredients: {
    name: string;
    quantity?: string;
  }[];
}

type Ingredient = {
  id: number;
  name: string;
};

export type IngredientInput = {
  name: string;
  group: string;
};

export type IngredientGroup = {
  [groupName: string]: Ingredient[];
};

export type FridgeResponse = {
  ingredient_list: IngredientGroup;
};
