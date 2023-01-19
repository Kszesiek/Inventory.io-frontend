import axios from "axios";
import { serverAddress } from "./global";
import {Dispatch} from "react";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {Organization} from "../store/organizations";
import {lendingActions, LendingForEvent, LendingPrivate} from "../store/lendings";
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
    return serverAddress + "organizations/" + store.getState().organizations.currentOrganization?.id + "/rentings/";
  } else {
    return ""
  }
}

function getDemoLendings(): (LendingForEvent | LendingPrivate)[]  {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return [];

  return demoData[currentOrganizationId].lendings;
}

export async function getLatestLendings (demoMode: boolean = false): Promise<null | (LendingForEvent | LendingPrivate)[]> {
  const lendings = await basicGetLendings(demoMode);
  if (!lendings)
    return [];
  else {
    return lendings.slice(0, 4);
  }
}

export async function getAllLendings (dispatch: Dispatch<AnyAction>, demoMode: boolean = false): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 700));
  const lendings = await basicGetLendings(demoMode);
  if (!lendings)
    return false;

  await dispatch(lendingActions.loadLendings(lendings));
  return true;
}

export async function basicGetLendings(demoMode: boolean = false): Promise<null | (LendingForEvent | LendingPrivate)[]> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return getDemoLendings();
  } else try {
    const response = await axios.get(getUrl(), { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET LENDINGS RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let lendings: (LendingForEvent | LendingPrivate)[];

    if (response.status === 200) {
      lendings = (response.data as Array<any>).map((obj) => {return {
        lendingId: obj.id,
        items: obj.items,
        startDate: obj.start_date,
        endDate: obj.end_date,
        notes: obj.notes,
        userId: obj.userId,
      } as LendingPrivate});
    } else if (response.status === 404) {
      lendings = [];
    } else return null;

    return lendings;
  } catch (error) {
    console.log(error);
    return null;
  }
}
