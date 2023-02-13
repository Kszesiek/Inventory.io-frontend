import axios from "axios";
import { serverAddress } from "./global";
import {Dispatch} from "react";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {Organization} from "../store/organizations";
import {Item, itemActions, itemFromTemplate, ItemTemplate} from "../store/items";
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

function getDemoItem(itemId: string): Item | null {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return null;
  return demoData[currentOrganizationId].items.find((item) => item.itemId === itemId) || null;
}

// ---------------------------------------------------------------------------------------------------------------------
// function checkCategoryAffiliation<CategoryId extends typeof categories[number]["id"]>(itemCategoryId: CategoryId, chosenCategoryId: CategoryId): boolean {
function checkCategoryAffiliation(itemCategoryId: number, chosenCategoryId: number): boolean {
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
  const items: Item[] | null = await basicGetItems(undefined, undefined, undefined, undefined, demoMode);
  if (!!items)
    await dispatch(itemActions.loadItems(items));
  return items;
}

export async function getFilteredItems(
  dispatch: Dispatch<AnyAction>,
  searchedText?: string,
  categoryId?: number,
  warehouseId?: number,
  rentalId?: number,
  demoMode: boolean = false
): Promise<null | Item[]> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 700));
    const items: Item[] = getDemoItems();
    const itemsCategorised = items.filter((item) => {
      if (categoryId === undefined)
        return true;
      else
        return checkCategoryAffiliation(item.categoryId, categoryId);
    });

    const itemsWarehoused: Item[] = itemsCategorised.filter((item) => {
      if (warehouseId === undefined)
        return true;
      else
        return item.warehouseId === warehouseId;
    });

    const itemsSearched: Item[] = itemsWarehoused.filter((item) => {
      if (searchedText === undefined)
        return true;
      else
        return item.name.toLowerCase().includes(searchedText.toLowerCase());
    });

    return itemsSearched;
  } else {
    const items: Item[] | null = await basicGetItems(searchedText, categoryId, warehouseId, rentalId, false);
    if (!!items)
      await dispatch(itemActions.loadItems(items));
    return items;
  }
}

export async function basicGetItems(searchedText?: string, categoryId?: number, warehouseId?: number, rentalId?: number, demoMode: boolean = false): Promise<null | Item[]> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 700));
    return getDemoItems();
  } else try {
    let url: string = getUrl();
    if (categoryId !== undefined || warehouseId !== undefined || rentalId !== undefined) {
      url += '?'
      if (categoryId !== undefined)
        url += `group_id=${categoryId.toString()}&`;
      if (warehouseId !== undefined)
        url += `warehouse_id=${warehouseId.toString()}&`;
      if (rentalId !== undefined)
        url += `rental_id=${rentalId.toString()}&`;
      if (searchedText !== undefined)
        url += `name_contains=${searchedText}&`;
      url = url.slice(0, -1);
    }
    const response = await axios.get(url, { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET ITEMS RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let items: Item[];

    if (response.status === 200) {
      items = (response.data as Array<any>).map((obj) => itemFromTemplate(obj, obj.id));
    } else if (response.status === 404) {
      items = [];
    } else return null;

    return items;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getItem(dispatch: Dispatch<AnyAction>, itemId: string, demoMode: boolean = false): Promise<null | Item> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 700));
    const item = getDemoItem(itemId);
    if (!item)
      return null;

    await dispatch(itemActions.loadItem(item));
    return item;
  } else try {
    const response = await axios.get(getUrl() + itemId, { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET ITEM RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let item: Item;

    if (response.status === 200) {
      item = itemFromTemplate(response.data, response.data.id);
    } else return null;

    await dispatch(itemActions.loadItem(item));
    return item;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function addItem(dispatch: Dispatch<AnyAction>, itemTemplate: ItemTemplate, demoMode: boolean = false): Promise<Item | false> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 700));
    const item: Item = itemFromTemplate(itemTemplate);
    await dispatch(itemActions.addItem({item: item}));
    return item;
  } else try {
    const response = await axios.post(getUrl(), itemTemplate);

    console.log("--- POST ITEM RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    const item: Item = itemFromTemplate(response.data, response.data.id);
    await dispatch(itemActions.loadItem(item));
    return item;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function modifyItem(dispatch: Dispatch<AnyAction>, itemId: string, itemTemplate: ItemTemplate, demoMode: boolean = false): Promise<Item | false> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 700));
    const item: Item = itemFromTemplate(itemTemplate, itemId);
    await dispatch(itemActions.modifyItem({item: item}));
    return item;
  } else try {
    const response = await axios.patch(getUrl() + itemId, itemTemplate);

    console.log("--- PATCH ITEM RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    const item: Item = itemFromTemplate(response.data, response.data.id);
    await dispatch(itemActions.loadItem(item));
    return item;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function addItemValue(itemId: string, propertyId: number, value: string, demoMode: boolean = false): Promise<boolean> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  } else try {
    console.log(value);
    const response = await axios.post(getUrl() + itemId + '/values', {"value": value, "property_id": propertyId}, {validateStatus: (status) => status >= 200 && status < 300 || status === 400});

    console.log("--- POST ITEM VALUE RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status === 400)
      return await updateItemValue(itemId, propertyId, value, demoMode);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function updateItemValue(itemId: string, propertyId: number, value: string, demoMode: boolean = false): Promise<boolean> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  } else try {
    console.log(value);
    const response = await axios.patch(getUrl() + itemId + '/values/' + propertyId, {"value": value});

    console.log("--- PATCH ITEM VALUE RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteItemValue(itemId: string, propertyId: number, demoMode: boolean = false): Promise<boolean> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  } else try {
    const response = await axios.delete(getUrl() + itemId + '/values/' + propertyId);

    console.log("--- DELETE ITEM VALUE RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}