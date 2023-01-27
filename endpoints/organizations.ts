import axios from "axios";
import { serverAddress } from "./global";
import {
  isOrganization,
  Organization,
  organizationFromTemplate,
  organizationsActions,
  OrganizationTemplate
} from "../store/organizations";
import {Dispatch} from "react";
import {AnyAction} from "@reduxjs/toolkit";
import {demoOrganizations} from "../constants/demoData";

const url: string = serverAddress + "organizations/";

export async function getOrganizations(dispatch: Dispatch<any>, demoMode: boolean = false): Promise<boolean> {
  if (demoMode) {
    await dispatch(organizationsActions.setOrganizations(demoOrganizations));
    return true;
  } else try {
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

export async function createOrganization(dispatch: Dispatch<AnyAction>, organizationTemplate: OrganizationTemplate, demoMode: boolean = false): Promise<boolean | Organization> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const organization = organizationFromTemplate(organizationTemplate)
    dispatch(organizationsActions.addOrganization(organization));
    return organization;
  } else try {
    const response = await axios.post(url, organizationTemplate);

    console.log("--- CREATE ORGANIZATION RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 201)
      return false;

    const organization: Organization = response.data as Organization;
    if (isOrganization(organization)) {
      await dispatch(organizationsActions.addOrganization(organization));
      return organization;
    } else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getOrganization(organizationId: string): Promise<Organization | null> {
  try {
    const response = await axios.get(url + organizationId);

    console.log("--- GET ORGANIZATION RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 200)
      return null;

    const organization: Organization = response.data;
    if (organization !== undefined)
      return organization;
    else return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function modifyOrganization(organizationId: string, organizationTemplate: OrganizationTemplate, dispatch: Dispatch<AnyAction>): Promise<null | Organization> {
  try {
    const response = await axios.patch(
      url + organizationId + "/",
      organizationTemplate,
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- MODIFY ORGANIZATION RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 200)
      return null;

    const organization: Organization = response.data as Organization;

    return organization !== undefined ? organization : null;
  } catch (error) {
    console.log(error);
    return null;
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