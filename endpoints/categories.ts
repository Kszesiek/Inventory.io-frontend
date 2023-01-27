import {serverAddress} from "./global";
import {Dispatch} from "react";
import axios from "axios";
import {Category, categoryActions, CategoryExtended, categoryFromTemplate, CategoryTemplate} from "../store/categories";
import {Organization} from "../store/organizations";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {demoData} from "../constants/demoData";

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
    return serverAddress + "organizations/" + store.getState().organizations.currentOrganization?.id + "/groups/";
  } else {
    return ""
  }
}

export function getDemoCategories(): CategoryExtended[] {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return [];
  return demoData[currentOrganizationId].categories;
}

export async function getAllCategories (dispatch: Dispatch<AnyAction>, demoMode: boolean = false): Promise<boolean> {
  const categories: Category[] | null = await basicGetCategories(demoMode);
  if (!categories)
    return false;

  await dispatch(categoryActions.loadCategories(categories));
  return true;
}

export async function getCategory (dispatch: Dispatch<AnyAction>, categoryId: number, demoMode: boolean = false): Promise<CategoryExtended | null | undefined> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getDemoCategories().find((category) => category.id === categoryId) || null;
  } else try {
    const response = await axios.get(getUrl() + categoryId.toString(), { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET CATEGORY RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status === 200) {
      const category: CategoryExtended = {
        id: response.data.id,
        name: response.data.name,
        short_name: response.data.short_name,
        parent_category_id: response.data.parent_group_id,
        properties: response.data.properties,
      } as CategoryExtended;

      await dispatch(categoryActions.addOrModifyCategory(category));
      return category;
    } else return null;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function basicGetCategories(demoMode: boolean = false): Promise<null | Category[]> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 700));
    return getDemoCategories();
  } else try {
    const response = await axios.get(getUrl(), { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET CATEGORIES RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let categories: Category[];

    if (response.status === 200) {
      categories = (response.data as Array<any>).map((obj) => ({
        id: obj.id,
        name: obj.name,
        short_name: obj.short_name,
        parent_category_id: obj.parent_group_id || undefined,
      } as Category));
    } else if (response.status === 404) {
      categories = [];
    } else return null;

    return categories;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createCategory(dispatch: Dispatch<AnyAction>, categoryTemplate: CategoryTemplate, demoMode: boolean = false) {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    await dispatch(categoryActions.addCategory(categoryFromTemplate(categoryTemplate)));
  } else try {
    console.log("I'm here");
    const url = getUrl();
    console.log(url);
    console.log(categoryTemplate);
    const response = await axios.post(getUrl(), categoryTemplate);

    console.log("--- POST CATEGORY RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 201)
      return false;

    const category: Category = categoryFromTemplate(response.data, response.data.id);
    await dispatch(categoryActions.addCategory(category));
    return category !== undefined ? category : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function modifyCategory(dispatch: Dispatch<AnyAction>, categoryId: number, categoryTemplate: CategoryTemplate, demoMode: boolean) {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 700));
    await dispatch(categoryActions.addCategory(categoryFromTemplate(categoryTemplate)));
  } else try {
    const url: string = getUrl() + categoryId + "/";
    const response = await axios.patch(url, categoryTemplate);
      // { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- PATCH CATEGORY RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 200)
      return false;

    const category: Category = categoryFromTemplate(response.data, response.data.id);
    await dispatch(categoryActions.modifyCategory(category));
    return category !== undefined ? category : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removeCategory(categoryId: number, dispatch: Dispatch<AnyAction>): Promise<boolean> {
  try {
    const response = await axios.delete(
      getUrl() + categoryId + "/",
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- REMOVE CATEGORY RESPONSE ---");
    console.log("STATUS: " + response.status);

    if (response.status === 200)
    {
      dispatch(categoryActions.removeCategory(categoryId));
      return true;
    } else {
      return false;
    }

  } catch (error) {
    console.log(error);
    return false;
  }
}