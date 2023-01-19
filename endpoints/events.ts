import axios from "axios";
import { serverAddress } from "./global";
import {Dispatch} from "react";
import {store as OGstore} from "../store/store";
import {AnyAction} from "@reduxjs/toolkit";
import {Organization} from "../store/organizations";
import {Event, eventActions} from "../store/events";
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
    return serverAddress + "organizations/" + store.getState().organizations.currentOrganization?.id + "/events/";
  } else {
    return ""
  }
}

function getDemoEvents(): Event[] {
  const currentOrganizationId: string | undefined = store.getState().organizations.currentOrganization?.id;
  if (!currentOrganizationId)
    return [];
  return demoData[currentOrganizationId].events;
}

export async function getLatestEvents (demoMode: boolean = false): Promise<null | Event[]> {
  const events = await basicGetEvents(demoMode);

  if (!events)
    return [];
  else
    return events.slice(0, 4);
}

export async function getAllEvents (dispatch: Dispatch<AnyAction>, demoMode: boolean = false): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 600));
  const events = await basicGetEvents(demoMode);
  if (!events)
    return false;

  await dispatch(eventActions.loadEvents(events));
  return true;
}

async function basicGetEvents(demoMode: boolean = false): Promise<null | Event[]> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getDemoEvents();
  } else try {
    const response = await axios.get(getUrl(), { validateStatus: (status) => status >= 200 && status < 300 || status === 404 });

    console.log("--- GET EVENTS RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    let events: Event[];

    if (response.status === 200) {
      events = (response.data as Array<any>).map((obj) => {return {
        eventId: obj.id,
        name: obj.name,
        short_name: obj.short_name,
        startDate: obj.start_date,
        endDate: obj.end_date,
        country: obj.country,
        city: obj.city,
        postalCode: obj.postal_code,
        street: obj.street,
        streetNumber: obj.street_number,
      } as Event});
    } else if (response.status === 404) {
      events = [];
    } else return null;

    return events;
  } catch (error) {
    console.log(error);
    return null;
  }
}
