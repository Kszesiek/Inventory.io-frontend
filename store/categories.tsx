import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface Filter {
  name: string;
}

export function isFilter(object: any): object is Filter {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['name'] === 'string'
  )
}

export interface CategoryTemplate {
  name: string;
  short_name: string;
  parent_group_id?: string;
}

export interface Category {
  id: string;
  name: string;
  short_name: string;
  parent_category_id?: string;
}

export function isCategory(object: any): object is Category {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['name'] === 'string' &&
    typeof object['short_name'] === 'string' &&
    typeof object['id'] === 'string' &&
    // Array.isArray(object['filters']) &&
    // object['filters'].every(item =>
    //   typeof item === 'object' &&
    //   typeof item['name'] === 'string'
    // ) &&
    (
      typeof object['parent_category_id'] === 'string' ||
      typeof object['parent_category_id'] === undefined
    )
  );
}

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: new Array<Category>(),
  },
  reducers: {
    loadCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    wipeCategories: (state) => {
      state.categories = new Array<Category>();
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((category) => category.id !== action.payload);
    },
  },
});

export const categoryActions = categoriesSlice.actions;
export default categoriesSlice.reducer;