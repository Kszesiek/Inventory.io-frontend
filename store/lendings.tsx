import {createSlice} from "@reduxjs/toolkit";

interface Lending {
  lendingId: string;
  itemNames: string[];
  startDate: string;
  endDate: string;
  notes: string;
}

export function isLending(object: any): object is Lending {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['lendingId'] === 'string' &&
    typeof object['startDate'] === 'string' &&
    typeof object['endDate'] === 'string' &&
    typeof object['notes'] === 'string'
  );
}

export interface LendingPrivate extends Lending {
  username: string;
}

export function isLendingPrivate(object: any): object is LendingPrivate {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['username'] === 'string' &&
    isLending(object)
  );
}

export interface LendingForEvent extends Lending {
  eventName: string;
}

export function isLendingForEvent(object: any): object is LendingForEvent {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['eventName'] === 'string' &&
    isLending(object)
  );
}

export const lendingsSlice = createSlice({
  name: 'lendings',
  initialState: {
    lendings: new Array<LendingPrivate | LendingForEvent>(
      {
        lendingId: "c1544eea-b3a0-4680-ad62-4778fc3c1893",
        itemNames: ["mic stand"],
        startDate: new Date(2022, 8 - 1, 3).toISOString(),
        endDate: new Date(2022, 8 - 1, 3).toISOString(),
        eventName: "Open Doors at Amplitron",
        notes: "Drzwi otwarte",
      },
      {
        lendingId: "65c50cf0-390a-484f-9c3a-efb073a50dfc",
        itemNames: ["metal box", "rozdzielnica", "kabel trójfazowy 10m", "drabina"],
        username: "YourGuyRoy",
        startDate: new Date(2022, 8 - 1, 30, 0).toISOString(),
        endDate: new Date(2022, 8 - 1, 30, 24).toISOString(),
        notes: "Impreza w ogrodzie",
      },
      {
        lendingId: "b4b10fb9-35db-45b7-9729-c07152c57e4a",
        itemNames: ["półka", "zmiotka", "lutownica"],
        username: "TheRealGlobetrotterGrover",
        startDate: new Date(2022, 7 - 1, 12, 9).toISOString(),
        endDate: new Date(2022, 7 - 1, 12, 20, 15).toISOString(),
        notes: "Wcale nie włożyłem widelca do gniazdka 230V",
      },
      {
        lendingId: "5f53cb97-93b3-40c0-84c2-59e2ecbf1169",
        itemNames: ["subwoofer", "tweeter x4", "instrukcja montażu zestawu 5.1", "mikrofon strojeniowy Shure", "mikser", "kabel XLR 10m x2", "kabel XLR 5m x4"],
        username: "itsmejohndoe",
        startDate: new Date(2022, 7 - 1, 12).toISOString(),
        endDate: new Date(2022, 7 - 1, 22).toISOString(),
        notes: "Zróbmy więc prywatkę jakiej nie przeżył nikt,\nNiech sąsiedzi walą, walą, walą, walą do drzwi...",
      },
      {
        lendingId: "4a172d51-06ca-4495-8c8a-b4dce974c630",
        itemNames: ["głośnik bluetooth", "słuchawki bluetooth", "kabel minijack 2m"],
        username: "JustClarence",
        startDate: new Date(2022, 9 - 1, 1).toISOString(),
        endDate:  new Date(2022, 9 - 1, 15).toISOString(),
        notes: "Tylko ty, ja, łódka mojego szwagra, zapasik dobrze zmrożonego mojito i dwa tygodnie nic tylko - wędkujemy!",
      },
    ),
    total: 5,
  },
  reducers: {
    addLending: (state, action) => {
      if (!state.lendings.some(item => item.lendingId === action.payload.lending.lendingId)) {
        state.lendings.push(action.payload.lending);
        state.total += 1;
      }
    },
    removeLending: (state, action) => {
      if (state.lendings.find(item => item.lendingId === action.payload.lendingId)) {
        state.lendings = state.lendings.filter(item => item.lendingId !== action.payload.lendingId);
        state.total -= 1;
      }
    },
    modifyLending: (state, action) => {
      const index = state.lendings.findIndex(item => item.lendingId === action.payload.lending.lendingId);
      if (index >= 0) {
        state.lendings[index] = action.payload.lending;
      }
    },
  },
});


export const lendingActions = lendingsSlice.actions;
export default lendingsSlice.reducer;