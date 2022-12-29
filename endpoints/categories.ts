import {serverAddress} from "./global";
import {Dispatch} from "react";
import axios from "axios";
import {Category, CategoryTemplate, categoryActions} from "../store/categories";
import {Organization} from "../store/organizations";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";

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

export async function getCategories(dispatch: Dispatch<AnyAction>): Promise<boolean> {
  try {
    const response = await axios.get(getUrl(), { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET CATEGORIES RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let categories: Category[];

    if (response.status === 200) {
      categories = (response.data as Array<any>).map((obj) => {return {
        id: obj.id,
        name: obj.name,
        short_name: obj.short_name,
        parent_category_id: obj.parent_group_id,
      }});
    } else if (response.status === 404) {
      categories = [];
    } else return false;

    await dispatch(categoryActions.loadCategories(categories));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function createCategory(categoryTemplate: CategoryTemplate): Promise<boolean | Category> {
  try {
    const response = await axios.post(
      getUrl(),
      categoryTemplate,
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- CREATE CATEGORY RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 201)
      return false;

    const category: Category = response.data as Category;
    return category !== undefined ? category : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function modifyCategory(categoryId: string, categoryTemplate: CategoryTemplate, dispatch: Dispatch<AnyAction>): Promise<boolean | Category> {
  try {
    const response = await axios.patch(
      getUrl() + categoryId + "/",
      categoryTemplate,
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- MODIFY CATEGORY RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 200)
      return false;

    const category: Category = response.data as Category;

    return category !== undefined ? category : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removeCategory(categoryId: string, dispatch: Dispatch<AnyAction>): Promise<boolean> {
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