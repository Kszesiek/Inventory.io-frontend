import axios from "axios";

const API_KEY: string = 'AIzaSyA64mL4J7xP00WmdcGCnBgAo8S6XikFfVw'

export async function authenticate(mode: 'signUp' | 'signInWithPassword', email: string, password: string) {
  console.log("authenticate called");

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=` + API_KEY;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true
  })

  return response.data;
}

export async function createUser(email: string, password: string) {
  const response = await authenticate('signUp', email, password);
}

export async function logIn(email: string, password: string): Promise< null | {
  username: string
  token: string
  userId: string
}> {
  const response = await authenticate('signInWithPassword', email, password);

  if (response.idToken) {
    return {username: response.email as string, token: response.idToken as string, userId: response.localId as string};
  } else
    return null;
}