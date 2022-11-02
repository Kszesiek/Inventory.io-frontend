import axios from "axios";
import { serverAddress } from "./global";
import {appWideActions} from "../store/appWide";
import {Dispatch} from "react";

const url: string = serverAddress + "auth/";

export async function createUser(dispatch: Dispatch<any>, username: string, password: string): Promise<boolean> {
  try {
    const response = await axios.post(url + "sign-up", {
      username: username,
      name: "Not yet implemented",  // TODO: implement missing variables
      surname: "Not yet implemented",
      email: Math.random().toPrecision(10).toString() + "@example.com",
      password: password,
    });

    console.log("--- SIGN-UP RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    response.data.forEach((item: any) => {
      console.log(item);
    })

    return response.status === 201;
  } catch (error) {
    return false;
  }
}

export async function logIn(dispatch: Dispatch<any>, username: string, password: string): Promise<boolean> {
  try {
    const response = await axios.post(url + "sign-in", {
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

    console.log("--- SIGN-IN RESPONSE ---");
    console.log("STATUS: " + response.status);
    console.log(response.data);

    if (response.status === 200) {
      axios.interceptors.request.use(
        async config => {
          config.headers!.Authorization = "Bearer " + response.data.access_token;  // TODO: check if this explodes
          return config;
        },
        error => {
          return Promise.reject(error);
        }
      );

      // const { payload, protectedHeader } = await jose.jwtVerify(response.data, Uint8Array.from('82403236322455368420703290157370899678555475376348799155608462394495384644410'.split('').map(letter => letter.charCodeAt(0))))
      // console.log(protectedHeader);
      // console.log(payload);
      return true;
    } else
      return false;
  } catch (error) {
    return false;
  }
}