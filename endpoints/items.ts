import axios from "axios";
import { serverAddress } from "./global";
import {Dispatch} from "react";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {Organization} from "../store/organizations";
import {Item} from "../store/items";
import {demoData} from "../constants/demoData";
import {Category} from "../store/categories";
import {getDemoCategories} from "./categories";

let store: typeof OGstore;
let dispatch: Dispatch<AnyAction>;


export function injectStore (__store: typeof OGstore) {
  store = __store;
}
export function injectDispatch (__dispatch: Dispatch<AnyAction>) {
  dispatch = __dispatch;
}

function getUrl(): string {
  const currentOrganization: Organization | undefined = store.getState().organizations.currentOrganization;
  if (!!currentOrganization) {
    return serverAddress + "organizations/" + store.getState().organizations.currentOrganization?.id + "/items/";
  } else {
    return ""
  }
}

function getDemoItems(): Item[] {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return [];
  return demoData[currentOrganizationId].items;
}

// ---------------------------------------------------------------------------------------------------------------------
// function checkCategoryAffiliation<CategoryId extends typeof categories[number]["id"]>(itemCategoryId: CategoryId, chosenCategoryId: CategoryId): boolean {
function checkCategoryAffiliation(itemCategoryId: string, chosenCategoryId: string): boolean {
  const categories = getDemoCategories();
  let currentCategory: Category | undefined = categories.find((category: Category) => category.id === itemCategoryId);

  while (currentCategory !== undefined) {
    if (currentCategory.id === chosenCategoryId) {
      return true;
    }

    currentCategory = categories.find((category: Category) => category.id === currentCategory!.parent_category_id);
  }
  return false;
}

// ---------------------------------------------------------------------------------------------------------------------

export async function getAllItems(dispatch: Dispatch<AnyAction>, demoMode: boolean = false): Promise<null | Item[]> {
  return await basicGetItems(demoMode);
}

export async function getFilteredItems(dispatch: Dispatch<AnyAction>, searchedText: string | undefined = undefined, categoryId: string | undefined = undefined, demoMode: boolean = false): Promise<null | Item[]> {
  if (demoMode) {
    const items: Item[] = getDemoItems();

    const itemsCategorised = items.filter((item) => {
      if (categoryId === undefined)
        return true;
      else
        return checkCategoryAffiliation(item.categoryId, categoryId);
    });

    const itemsFiltered: Item[] = itemsCategorised;

    const itemsSearched: Item[] = itemsFiltered.filter((item) => {
      if (searchedText === undefined)
        return true;
      else
        return item.name.toLowerCase().includes(searchedText.toLowerCase());
    });

    return itemsSearched;
  } else {
    return await basicGetItems(false);
  }
}

export async function basicGetItems(demoMode: boolean = false): Promise<null | Item[]> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 700));
    return getDemoItems();
  } else try {
    const response = await axios.get(getUrl(), { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET ITEMS RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let items: Item[];

    if (response.status === 200) {
      items = (response.data as Array<any>).map((obj) => {return {
        itemId: obj.id,
        name: obj.name,
        categoryId: obj.groupId,
        warehouseId: obj.warehouseId,
      } as Item});
    } else if (response.status === 404) {
      items = [];
    } else return null;

    return items;
  } catch (error) {
    console.log(error);
    return null;
  }
}
