import axios from "axios";
import { serverAddress } from "./global";
import {Organization, organizationsActions, OrganizationTemplate} from "../store/organizations";
import {Dispatch} from "react";
import {Category, CategoryTemplate} from "../store/categories";
import {AnyAction} from "@reduxjs/toolkit";

const url: string = serverAddress + "organizations/";

export async function getOrganizations(dispatch: Dispatch<any>): Promise<boolean> {
  try {
    const response = await axios.get(url, { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET ORGANIZATIONS RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let organizations: Organization[];

    if (response.status === 200) {
      organizations = response.data;
    } else if (response.status === 404) {
      organizations = [];
    } else return false;

    await dispatch(organizationsActions.setOrganizations(organizations));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function createOrganization(organizationTemplate: OrganizationTemplate): Promise<boolean | Organization> {
  try {
    const response = await axios.post(url, organizationTemplate);

    console.log("--- CREATE ORGANIZATION RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 201)
      return false;

    const organization: Organization = response.data as Organization;
    return organization !== undefined ? organization : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getOrganization(organizationId: string): Promise<Organization | false> {
  try {
    const response = await axios.get(url + organizationId);

    console.log("--- GET ORGANIZATION RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 200)
      return false;

    const organization: Organization = response.data;
    if (organization !== undefined)
      return organization;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function modifyOrganization(organizationId: string, categoryTemplate: CategoryTemplate, dispatch: Dispatch<AnyAction>): Promise<boolean | Category> {
  try {
    const response = await axios.patch(
      url + organizationId + "/",
      categoryTemplate,
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- MODIFY ORGANIZATION RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 200)
      return false;

    const organization: Organization = response.data as Organization;

    return organization !== undefined ? organization : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removeOrganization(organizationId: string, dispatch: Dispatch<AnyAction>): Promise<boolean> {
  try {
    const response = await axios.delete(
      url + organizationId + "/",
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- REMOVE ORGANIZATION RESPONSE ---");
    console.log("STATUS: " + response.status);

    if (response.status === 200)
    {
      dispatch(organizationsActions.removeOrganization(organizationId));
      return true;
    } else {
      return false;
    }

  } catch (error) {
    console.log(error);
    return false;
  }
}