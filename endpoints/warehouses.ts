import axios from "axios";
import { serverAddress } from "./global";
import {Dispatch} from "react";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {Organization} from "../store/organizations";
import {Warehouse, warehouseFromTemplate, warehousesActions, WarehouseTemplate} from "../store/warehouses";
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

export function getDemoWarehouse(warehouseId: number): Warehouse | null {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return null;
  return demoData[currentOrganizationId].warehouses.find((warehouse) => warehouse.id === warehouseId) || null;
}

export async function getAllWarehouses (dispatch: Dispatch<AnyAction>, demoMode: boolean = false): Promise<boolean> {
  const warehouses = await basicGetWarehouses(demoMode);
  if (!warehouses)
    return false;

  await dispatch(warehousesActions.loadWarehouses(warehouses));
  return true;
}

export async function getWarehouse (dispatch: Dispatch<AnyAction>, warehouseId: number, demoMode: boolean = false): Promise<null | undefined | Warehouse> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getDemoWarehouse(warehouseId);
  } else try {
    const response = await axios.get(getUrl() + warehouseId);

    console.log("--- GET WAREHOUSE RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let warehouse: Warehouse | null;

    const obj = response.data;
    if (response.status === 200) {
      warehouse = warehouseFromTemplate(obj, obj.id);

      await dispatch(warehousesActions.loadWarehouse(warehouse));
      return warehouse;
    } else return null;
  } catch (error) {
    console.log(error);
    return undefined;
  }
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
      warehouses = (response.data as Array<any>).map((obj) => warehouseFromTemplate(obj, obj.id));
    } else if (response.status === 404) {
      warehouses = [];
    } else return null;

    return warehouses;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createWarehouse(dispatch: Dispatch<AnyAction>, warehouseTemplate: WarehouseTemplate, demoMode: boolean = false) {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 700));
    await dispatch(warehousesActions.addWarehouse(warehouseFromTemplate(warehouseTemplate)));
  } else try {
    const response = await axios.post(getUrl(), warehouseTemplate);

    console.log("--- POST WAREHOUSE RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 201)
      return false;

    const warehouse: Warehouse = warehouseFromTemplate(response.data, response.data.id);
    await dispatch(warehousesActions.addWarehouse(warehouse));
    return warehouse !== undefined ? warehouse : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function modifyWarehouse(dispatch: Dispatch<AnyAction>, warehouseId: number, warehouseTemplate: WarehouseTemplate, demoMode: boolean = false) {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 700));
    await dispatch(warehousesActions.modifyWarehouse(warehouseFromTemplate(warehouseTemplate, warehouseId)));
  } else try {
    const response = await axios.patch(getUrl() + warehouseId, warehouseTemplate);

    console.log("--- PATCH WAREHOUSE RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 200)
      return false;

    const warehouse: Warehouse = warehouseFromTemplate(response.data, response.data.id);
    await dispatch(warehousesActions.modifyWarehouse(warehouse));
    return warehouse !== undefined ? warehouse : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}