import {serverAddress} from "./global";
import {Dispatch} from "react";
import axios from "axios";
import {Property, PropertyTemplate, PropertyUnit, PropertyType, propertyActions} from "../store/properties";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {Organization} from "../store/organizations";

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

export async function getProperties(dispatch: Dispatch<AnyAction>): Promise<boolean> {
  try {
    const response = await axios.get(getUrl(), { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET PROPERTIES RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let properties: Property[];

    if (response.status === 200) {
      properties = response.data;
    } else if (response.status === 404) {
      properties = [];
    } else return false;

    await dispatch(propertyActions.loadProperties(properties));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function createProperty(propertyTemplate: PropertyTemplate): Promise<boolean | Property> {
  try {
    const response = await axios.post(
      getUrl(),
      propertyTemplate,
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- CREATE PROPERTY RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 201)
      return false;

    const property: Property = response.data as Property;
    return property !== undefined ? property : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getProperty(propertyId: string): Promise<Property | boolean> {
  try {
    const response = await axios.get(getUrl() +  + propertyId, { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET PROPERTY RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    const property: Property = response.data;

    if (response.status !== 200)
      return false;

    if (property !== undefined)
      return property;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function modifyProperty(propertyId: string, propertyTemplate: PropertyTemplate, dispatch: Dispatch<AnyAction>): Promise<boolean | Property> {
  try {
    const response = await axios.patch(
      getUrl() + propertyId + "/",
      propertyTemplate,
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- MODIFY PROPERTY RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status !== 200)
      return false;

    const property: Property = response.data as Property;

    return property !== undefined ? property : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removeProperty(propertyId: string, dispatch: Dispatch<AnyAction>): Promise<boolean> {
  try {
    const response = await axios.delete(
      getUrl() + propertyId + "/",
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- REMOVE PROPERTY RESPONSE ---");
    console.log("STATUS: " + response.status);

    if (response.status === 200)
    {
      dispatch(propertyActions.removeProperty(propertyId));
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function addPropertyToGroup(propertyId: string, groupId: string, dispatch: Dispatch<AnyAction>) {
  try {
    const response = await axios.post(
      getUrl() + propertyId + "/assignment",
      {
        group_id: groupId,
      },
      { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- ADD PROPERTY TO GROUP RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status === 200)
    {
      // TODO: jakiś dispatch kurde ten?
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removePropertyFromGroup(propertyId: string, groupId: string, dispatch: Dispatch<AnyAction>) {
  try {
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

    if (response.status === 200)
    {
      // TODO: jakiś dispatch kurde ten?
      return true;
    } else {
      return false;
    }
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

    // await dispatch(propertyActions.loadProperties(properties));
    return true;
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

    // await dispatch(propertyActions.loadProperties(properties));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}