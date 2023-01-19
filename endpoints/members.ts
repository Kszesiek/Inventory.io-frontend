import axios from "axios";
import { serverAddress } from "./global";
import {Dispatch} from "react";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {Organization} from "../store/organizations";
import {Member, membersActions} from "../store/members";
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
    return serverAddress + "organizations/" + store.getState().organizations.currentOrganization?.id + "/users/";
  } else {
    return ""
  }
}

function getDemoMembers(): Member[] {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return [];
  return demoData[currentOrganizationId].users;
}

export async function getAllMembers (dispatch: Dispatch<AnyAction>, demoMode: boolean = false): Promise<boolean> {
  const members = await basicGetMembers(demoMode);
  if (!members)
    return false;

  await dispatch(membersActions.loadMembers(members));
  return true;
}

async function basicGetMembers(demoMode: boolean = false): Promise<null | Member[]> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getDemoMembers();
  } else try {
    const response = await axios.get(getUrl(), { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET MEMBERS RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let members: Member[];

    if (response.status === 200) {
      members = (response.data as Array<any>).map((obj) => {return {
        id: obj.id,
        username: obj.username,
        name: obj.name,
        surname: obj.surname,
        email: obj.email,
      } as Member});
    } else if (response.status === 404) {
      members = [];
    } else return null;

    return members;
  } catch (error) {
    console.log(error);
    return null;
  }
}
