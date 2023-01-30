import axios from "axios";
import { serverAddress } from "./global";
import {Dispatch} from "react";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {Organization} from "../store/organizations";
import {rentalsActions, Rental, RentalTemplate, rentalFromTemplate} from "../store/rentals";
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
    return serverAddress + "organizations/" + store.getState().organizations.currentOrganization?.id + "/rentals/";
  } else {
    return ""
  }
}

function getDemoRentals(): Rental[] {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return [];

  return demoData[currentOrganizationId].lendings;
}

function getDemoRental(rentalId: number): Rental | null {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return null;

  return demoData[currentOrganizationId].lendings.find((rental) => rental.rentalId === rentalId) || null;
}

export async function getLatestRentals (demoMode: boolean = false): Promise<null | Rental[]> {
  const rentals = await basicGetRentals(demoMode);
  if (!rentals)
    return [];
  else {
    return rentals.slice(0, 4);
  }
}

export async function getAllRentals (dispatch: Dispatch<AnyAction>, demoMode: boolean = false): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 700));
  const rentals = await basicGetRentals(demoMode);
  if (!rentals)
    return false;

  await dispatch(rentalsActions.loadRentals(rentals));
  return true;
}

export async function basicGetRentals(demoMode: boolean = false): Promise<null | Rental[]> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return getDemoRentals();
  } else try {
    const response = await axios.get(getUrl(), { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET RENTALS RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let rentals: Rental[];

    if (response.status === 200) {
      rentals = (response.data as Array<any>).map((obj) => rentalFromTemplate(obj, obj.id));
    } else if (response.status === 404) {
      rentals = [];
    } else return null;

    return rentals;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getRental(dispatch: Dispatch<AnyAction>, rentalId: number, demoMode: boolean = false): Promise<Rental | null | undefined> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getDemoRental(rentalId);
  } else try {
    const response = await axios.get(getUrl() + rentalId);

    console.log("--- GET RENTAL RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let rental: Rental | null;
    const obj = response.data;
    if (response.status === 200) {
      rental = rentalFromTemplate(obj, obj.id);
      await dispatch(rentalsActions.loadRental(rental));
      return rental;
    } else return null;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function addRental(dispatch: Dispatch<AnyAction>, rentalTemplate: RentalTemplate, demoMode: boolean = false): Promise<Rental | false> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 600));
    const rental: Rental = rentalFromTemplate(rentalTemplate);
    await dispatch(rentalsActions.addRental(rental));
    return rental;
  } else try {
    const response = await axios.post(getUrl(), rentalTemplate);

    console.log("--- POST RENTAL RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    const rental: Rental = rentalFromTemplate(response.data, response.data.id);
    if (!!rental) {
      await dispatch(rentalsActions.addRental(rental));
      return rental;
    }
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function modifyRental(dispatch: Dispatch<AnyAction>, rentalTemplate: RentalTemplate, rentalId: number, demoMode: boolean = false): Promise<Rental | false> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 600));
    const rental: Rental = rentalFromTemplate(rentalTemplate, rentalId)
    await dispatch(rentalsActions.modifyRental(rental));
    return rental;
  } else try {
    const response = await axios.patch(getUrl() + rentalId, rentalTemplate);

    console.log("--- PATCH RENTAL RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status === 200 || response.status === 201)
    {
      const rental = rentalFromTemplate(response.data, response.data.id);
      await dispatch(rentalsActions.modifyRental(rental));
      return rental;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function addItemToRental(rentalId: number, itemId: string, demoMode: boolean = false): Promise<boolean> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 600));
    // await dispatch(rentalsActions.addRental(rentalFromTemplate(rentalTemplate)));
    return true;
  } else try {
    const response = await axios.post(getUrl() + rentalId + '/assignment/' + itemId);

    console.log("--- POST ITEM TO RENTAL RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removeItemFromRental(rentalId: number, itemId: string, demoMode: boolean = false): Promise<boolean> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return true;
  } else try {
    const response = await axios.delete(getUrl() + rentalId + '/assignment/' + itemId);

    console.log("--- DELETE ITEM FROM RENTAL RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removeRental(dispatch: Dispatch<AnyAction>, rentalId: number, demoMode: boolean = false): Promise<boolean> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 600));
    await dispatch(rentalsActions.removeRental(rentalId));
    return true;
  } else try {
    const response = await axios.delete(getUrl() + rentalId);

    console.log("--- DELETE RENTAL RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status === 200)
    {
      await dispatch(rentalsActions.removeRental(rentalId));
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}