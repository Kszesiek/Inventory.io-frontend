import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {isProperty, Property} from "./properties";

export interface CategoryTemplate {
  name: string;
  short_name: string;
  parent_group_id?: number;
}

export interface Category {
  id: number;
  name: string;
  short_name: string;
  parent_category_id?: number;
}

export interface CategoryExtended extends Category {

  properties: Property[]
}

export function isCategory(object: any): object is Category {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['name'] === 'string' &&
    typeof object['short_name'] === 'string' &&
    typeof object['id'] === 'number' &&
    ('parent_category_id' in object ? typeof object['parent_category_id'] === 'number' : true)
  );
}

export function isCategoryExtended(object: any): object is CategoryExtended {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['name'] === 'string' &&
    typeof object['short_name'] === 'string' &&
    typeof object['id'] === 'number' &&
    ('parent_category_id' in object ? (
      object['parent_category_id'] === undefined ||
      object['parent_category_id'] === null ||
      typeof object['parent_category_id'] === 'number'
    ) : true) &&
    Array.isArray(object["properties"]) &&
    object["properties"].every(item => isProperty(item))
  )
}

export function categoryFromTemplate(categoryTemplate: CategoryTemplate, categoryId: string | undefined = undefined): Category {
  return {
    id: categoryId || Math.random(),
    name: categoryTemplate.name,
    parent_category_id: categoryTemplate.parent_group_id,
    short_name: categoryTemplate.short_name,
  } as Category;
}

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: new Array<Category | CategoryExtended>(),
  },
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      if (!state.categories.some(category => category.id === action.payload.id)) {
        state.categories.push(action.payload);
      }
    },
    removeCategory: (state, action: PayloadAction<number>) => {
      if (state.categories.find(category => category.id === action.payload)) {
        state.categories = state.categories.filter(category => category.id !== action.payload);
      }
    },
    modifyCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(category => category.id === action.payload.id);
      if (index >= 0) {
        state.categories[index] = action.payload;
      }
    },
    addOrModifyCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(category => category.id === action.payload.id);
      if (index >= 0)
        state.categories[index] = action.payload;
      else
        state.categories.push(action.payload);
    },
    loadCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    wipeCategories: (state) => {
      state.categories = new Array<Category>();
    },
  },
});

export const categoryActions = categoriesSlice.actions;
export default categoriesSlice.reducer;