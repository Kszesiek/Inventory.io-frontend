import axios from "axios";
import { serverAddress } from "./global";
import {appWideActions} from "../store/appWide";
import {Dispatch} from "react";
import jwt_decode from 'jwt-decode';
import {getOrganizations} from "./organizations";
import {UserTemplate} from "../store/users";

const url: string = serverAddress + "auth/";

export async function createUser(dispatch: Dispatch<any>, userTemplate: UserTemplate, demoMode: boolean = false): Promise<boolean> {
  if (demoMode) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  } else try {
    const response = await axios.post(url + "sign-up", userTemplate);

    console.log("--- SIGN-UP RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    return response.status === 201;
  } catch (error) {
    return false;
  }
}

export async function logIn(dispatch: Dispatch<any>, username: string, password: string, demoMode: boolean = false): Promise<boolean> {
  if (!demoMode) try {
    const response = await axios.post(url + "sign-in", {
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

    console.log("--- SIGN-IN RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(jwt_decode(response.data.access_token));
    // console.log(JSON.parse(Buffer.from(response.data["access_token"].split('.')[1], 'base64').toString()));

    // const { payload, protectedHeader } = await jose.jwtVerify(response.data, Uint8Array.from('82403236322455368420703290157370899678555475376348799155608462394495384644410'.split('').map(letter => letter.charCodeAt(0))))
    // console.log(protectedHeader);
    // console.log(payload);

    if (response.status !== 200)
      return false;

    axios.interceptors.request.use(async config => {
        config.headers!.Authorization = "Bearer " + response.data.access_token;
        return config;
      },
      error => Promise.reject(error)
    );
  } catch (error) {
    return false;
  }

  const getOrganizationsOutcome = await getOrganizations(dispatch, demoMode);
  if (!getOrganizationsOutcome)
    return false;

  await dispatch(appWideActions.signIn({  // TODO: Change this to real data
    username: 'itsmejohndoe',
    name: 'John',
    surname: 'Doe',
    email: 'johndoe@example.com',
  }));
  return true;
}