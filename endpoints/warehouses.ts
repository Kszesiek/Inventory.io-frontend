import axios from "axios";
import { serverAddress } from "./global";
import {Dispatch} from "react";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {Organization} from "../store/organizations";
import {Warehouse, warehousesActions} from "../store/warehouses";
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
    return serverAddress + "organizations/" + store.getState().organizations.currentOrganization?.id + "/warehouses/";
  } else {
    return ""
  }
}

export function getDemoWarehouses(): Warehouse[] {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return [];
  return demoData[currentOrganizationId].warehouses;
}

export async function getAllWarehouses (dispatch: Dispatch<AnyAction>, demoMode: boolean = false): Promise<boolean> {
  const warehouses = await basicGetWarehouses(demoMode);
  if (!warehouses)
    return false;

  await dispatch(warehousesActions.loadWarehouses(warehouses));
  return true;
}

async function basicGetWarehouses(demoMode: boolean = false): Promise<null | Warehouse[]> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getDemoWarehouses();
  } else try {
    const response = await axios.get(getUrl(), { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET WAREHOUSES RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let warehouses: Warehouse[];

    if (response.status === 200) {
      warehouses = (response.data as Array<any>).map((obj) => {return {
        id: obj.id,
        name: obj.name,
        country: obj.country,
        city: obj.city,
        postalCode: obj.postal_code,
        street: obj.street,
        streetNumber: obj.street_number,
      } as Warehouse});
    } else if (response.status === 404) {
      warehouses = [];
    } else return null;

    return warehouses;
  } catch (error) {
    console.log(error);
    return null;
  }
}
