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
    addCategory: (state, action: PayloadAction<Category>) => {
      if (!state.categories.some(category => category.id === action.payload.id)) {
        state.categories.push(action.payload);
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
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