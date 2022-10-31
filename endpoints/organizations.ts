import axios from "axios";
import { serverAddress } from "./global";
import {Organization, organizationsActions} from "../store/organizations";
import {Dispatch} from "react";

const url: string = serverAddress + "organizations/";

export async function getOrganizations(dispatch: Dispatch<any>): Promise<boolean> {
  try {
    console.log(1);

    const response = await axios.get(url);

    console.log("--- GET ORGANIZATIONS RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 200)
      return false;

    const organizations: Organization[] = response.data;
    await dispatch(organizationsActions.setOrganizations(organizations));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}