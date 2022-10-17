import {createSlice} from "@reduxjs/toolkit";

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

export interface Category {
  categoryId: string;
  name: string;
  filters: Filter[];
  parentCategoryId?: string;
}

export function isCategory(object: any): object is Category {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['name'] === 'string' &&
    typeof object['categoryId'] === 'string' &&
    Array.isArray(object['filters']) &&
    object['filters'].every(item =>
      typeof item === 'object' &&
      typeof item['name'] === 'string'
    ) &&
    (
      typeof object['parentCategoryId'] === 'string' ||
      typeof object['parentCategoryId'] === undefined
    )
  );
}

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: new Array<Category>(),
  },
  reducers: {
    loadCategories: (state, action) => {
      state.categories = action.payload;
    },
    wipeCategories: (state) => {
      state.categories = new Array<Category>();
    }
  },
});

export const categoryActions = categoriesSlice.actions;
export default categoriesSlice.reducer;