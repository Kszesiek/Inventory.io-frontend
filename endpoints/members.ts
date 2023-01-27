import axios from "axios";
import { serverAddress } from "./global";
import {Dispatch} from "react";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {Organization} from "../store/organizations";
import {Member, memberFromTemplate, membersActions} from "../store/members";
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

export function getDemoMember(memberId: string):  Member | null {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return null;
  return demoData[currentOrganizationId].users.find((member) => member.id === memberId) || null;
}

export async function getAllMembers (dispatch: Dispatch<AnyAction>, demoMode: boolean = false): Promise<boolean> {
  const members = await basicGetMembers(demoMode);
  if (!members)
    return false;

  await dispatch(membersActions.loadMembers(members));
  return true;
}

export async function getMembersByIds(dispatch: Dispatch<AnyAction>, membersIds: string[], demoMode: boolean = false): Promise<boolean> {
  const members = await basicGetMembers(demoMode); // TODO: This has to ask the server about specific user IDs
  if (!members)
    return false;

  await dispatch(membersActions.updateOrAddMembers(members));
  return true;
}

async function basicGetMembers(demoMode: boolean = false): Promise<null | undefined | Member[]> {
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
      members = (response.data as Array<any>).map((obj) => memberFromTemplate(obj, obj.id));
    } else if (response.status === 404) {
      members = [];
    } else return null;

    return members;
  } catch (error: any) {
    console.log(error.data);
    console.log(error);
    return undefined;
  }
}

export async function getMember(memberId: string, demoMode: boolean = false): Promise<null | undefined | Member> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getDemoMember(memberId);
  } else try {
    const response = await axios.get(getUrl() + memberId + '/');

    console.log("--- GET MEMBER RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let member: Member | null;

    if (response.status === 200) {
      const obj = response.data;
      member = memberFromTemplate(obj, obj.id);

      return member;
    } else return null;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function addMember(userId: string, roleId: number, demoMode: boolean = false): Promise<boolean> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } else try {
    const response = await axios.post(getUrl(), {user_id: userId, role_id: roleId});

    console.log("--- POST MEMBER RESPONSE ---");
    console.log("STATUS: " + response.status);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// export async function addMember(dispatch: Dispatch<AnyAction>, memberTemplate: MemberTemplate, demoMode: boolean = false): Promise<Member | undefined | null> {
//   if (demoMode) {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     const member = memberFromTemplate(memberTemplate);
//     await dispatch(membersActions.addMember(member));
//     return member;
//   } else try {
//     const response = await axios.post(getUrl(), memberTemplate);
//
//     console.log("--- POST MEMBER RESPONSE ---");
//     console.log("STATUS: " + response.status);
//     console.log(response.data);
//
//     return memberFromTemplate(response.data, response.data.id);
//   } catch (error) {
//     console.log(error);
//     return undefined;
//   }
// }
//
// export async function modifyMember(dispatch: Dispatch<AnyAction>, memberTemplate: MemberTemplate, memberId: string, demoMode: boolean = false): Promise<Member | undefined | null> {
//   if (demoMode) {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     const member: Member = memberFromTemplate(memberTemplate, memberId);
//     await dispatch(membersActions.modifyMember(member));
//     return member;
//   } else try {
//     const response = await axios.patch(getUrl() + "/" + memberId, memberTemplate);
//
//     console.log("--- PATCH MEMBER RESPONSE ---");
//     console.log("STATUS: " + response.status);
//     console.log(response.data);
//
//     return memberFromTemplate(response.data, response.data.id);
//   } catch (error) {
//     console.log(error);
//     return undefined;
//   }
// }