import {serverAddress} from "./global";
import {Dispatch} from "react";
import axios from "axios";
import {
  Property,
  PropertyTemplate,
  PropertyUnit,
  PropertyType,
  propertyActions,
  propertyFromTemplate
} from "../store/properties";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {Organization} from "../store/organizations";
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
    return serverAddress + "organizations/" + store.getState().organizations.currentOrganization?.id + "/properties/";
  } else {
    return ""
  }
}

function getDemoProperties(): Property[] {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return [];
  return demoData[currentOrganizationId].properties;
}

export async function getAllProperties(dispatch: Dispatch<AnyAction>, demoMode: boolean = false): Promise<boolean> {
  const properties: Property[] | null = await basicGetProperties(undefined, undefined, undefined, demoMode);
  if (!properties)
    return false;

  await dispatch(propertyActions.loadProperties(properties));
  return true;
}

export async function getPropertiesForCategory(categoryId: number, demoMode: boolean = false): Promise<Property[] | null> {
  const properties: Property[] | null = await basicGetProperties(categoryId, undefined, undefined, demoMode);
  if (!properties)
    return null;

  return properties;
}

export async function basicGetProperties(categoryId?: number, unitId?: number, propertyTypeId?: number, demoMode: boolean = false): Promise<null | Property[]> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getDemoProperties();
  } else try {
    const response = await axios.get(getUrl(), { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET PROPERTIES RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let properties: Property[];

    if (response.status === 200) {
      properties = response.data;
    } else if (response.status === 404) {
      properties = [];
    } else return null;

    return properties;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createProperty(dispatch: Dispatch<AnyAction>, propertyTemplate: PropertyTemplate, demoMode: boolean = false): Promise<false | Property> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const property = propertyFromTemplate(propertyTemplate);
    await dispatch(propertyActions.addProperty(property));
    return property;
  } else try {
    const response = await axios.post(
      getUrl(),
      propertyTemplate,
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- CREATE PROPERTY RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 201)
      return false;

    const property: Property = propertyFromTemplate(response.data, response.data.id);
    if (!!property) {
      await dispatch(propertyActions.addProperty(property));
      return property;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getProperty(dispatch: Dispatch<AnyAction>, propertyId: number, demoMode: boolean = false): Promise<Property | undefined | null> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getDemoProperties().find((property) => property.id === propertyId);
  } else try {
    const response = await axios.get(getUrl() +  + propertyId, { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET PROPERTY RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 200)
      return null;

    const property: Property = propertyFromTemplate(response.data);
    if (property !== undefined)
      return property;
    else return null;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function modifyProperty(dispatch: Dispatch<AnyAction>, propertyId: number, propertyTemplate: PropertyTemplate, demoMode: boolean = false): Promise<false | Property> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const property = propertyFromTemplate(propertyTemplate, propertyId);
    await dispatch(propertyActions.modifyProperty(property));
    return property;
  } else try {
    const response = await axios.patch(
      getUrl() + propertyId + "/",
      propertyTemplate,
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- MODIFY PROPERTY RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 200)
      return false;

    const property: Property = propertyFromTemplate(response.data, response.data.id);

    if (!!property) {
      await dispatch(propertyActions.modifyProperty(property));
      return property;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removeProperty(dispatch: Dispatch<AnyAction>, propertyId: number, demoMode: boolean = false): Promise<boolean> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    await dispatch(propertyActions.removeProperty(propertyId));
    return true;
  } else try {
    const response = await axios.delete(getUrl() + propertyId, { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- REMOVE PROPERTY RESPONSE ---");
    console.log("STATUS: " + response.status);

    if (response.status === 200)
    {
      await dispatch(propertyActions.removeProperty(propertyId));
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function addPropertyToGroup(dispatch: Dispatch<AnyAction>, propertyId: number, groupId: number, demoMode: boolean) {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } else try {
    const response = await axios.post(
      getUrl() + propertyId + "/assignment",
      {
        group_id: groupId,
      },
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- ADD PROPERTY TO GROUP RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    return response.status === 201;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removePropertyFromGroup(dispatch: Dispatch<AnyAction>, propertyId: number, groupId: number, demoMode: boolean = false) {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } else try {
    const response = await axios.delete(
      getUrl() + propertyId + "/assignment",
      {
        data: {
          group_id: groupId,
        },
        validateStatus: (status) => status >= 200 && status < 300 || status === 404,
      });

    console.log("--- REMOVE PROPERTY FROM GROUP RESPONSE ---");
    console.log("STATUS: " + response.status);

    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getPropertyUnits(dispatch: Dispatch<AnyAction>) {
  try {
    const response = await axios.get(
      getUrl() + 'units',
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 },
    );

    console.log("--- GET PROPERTY UNITS RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let units: PropertyUnit[];

    if (response.status === 200) {
      units = response.data;
    } else if (response.status === 404) {
      units = [];
    } else return false;

    // await dispatch(propertyActions.loadUnits(units));
    return units;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getPropertyTypes(dispatch: Dispatch<AnyAction>) {
  try {
    const response = await axios.get(
      getUrl() + 'types',
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 },
    );

    console.log("--- GET PROPERTY TYPES RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let types: PropertyType[];

    if (response.status === 200) {
      types = response.data;
    } else if (response.status === 404) {
      types = [];
    } else return false;

    // await dispatch(propertyActions.loadUnits(units));
    return types;
  } catch (error) {
    console.log(error);
    return false;
  }
}