import {Organization} from "../store/organizations";
import {User} from "../store/users";
import {Event} from "../store/events";
import {LendingForEvent, LendingPrivate} from "../store/lendings";
import {Item} from "../store/items";
import {Category} from "../store/categories";

export const demoOrganizations: Organization[] = [
  {
    id: "86519777-5cf5-4af5-8e56-d5640cb26c8c",
    name: 'Amplitron',
    short_name: 'AMP',
    description: 'Klub Studencki Amplitron. Est. 1970.',
  },
  {
    id: "e9391d5f-3b6b-48b3-bcb0-1022369dceb1",
    name: 'Antykwariat',
    short_name: 'ANTIQ',
    description: 'Antykwariat ANTIQUE. Twoje miejsce z antykami.',
  },
  {
    id: "a787df42-7513-4f4a-a94a-e5ae6eb4b4eb",
    name: 'The Engineers Basement',
    short_name: 'TEB-RENT',
    description: 'Wypożyczalnia sprzętu estradowego "The Engineers Basement"',
  },
];

type demoBatch = {
  users: Array<User>,
  lendings: Array<LendingPrivate | LendingForEvent>,
  events: Array<Event>,
  items: Array<Item>,
  categories: Array<Category>,
}

export const demoData: Record<typeof demoOrganizations[number]["id"], demoBatch> = {
  "86519777-5cf5-4af5-8e56-d5640cb26c8c": { // Amplitron
    users: new Array<User>(
      {
        userId: "eed0be02-f83e-46c8-a4aa-2dcae02dc12f",
        username: "itsmejohndoe",
        name: "John",
        surname: "Doe",
      },
      {
        userId: "b517ed77-5ce5-4457-ba1e-b8a1fba4d376",
        username: "JustClarence",
        name: "Clarence",
        surname: "Walter",
      },{
        userId: "f141ec5f-3d2b-4e71-a4ba-1a72f872c4ab",
        username: "YourGuyRoy",
        name: "Roy",
        surname: "Whitings",
      },{
        userId: "7f7feb57-d63d-4fc4-b60c-8281c5c8109c",
        username: "TheRealGlobetrotterGrover",
        name: "Grover",
        surname: "Globetrotter",
      },
    ),
    lendings: new Array<LendingPrivate | LendingForEvent>(
      {
        lendingId: "c1544eea-b3a0-4680-ad62-4778fc3c1893",
        items: [
          { itemId: "c7e3af12-7f15-45bb-8c3f-385fc365da62",
            name: "mic stand",},
        ],
        startDate: new Date(2022, 8 - 1, 3).toISOString(),
        endDate: new Date(2022, 8 - 1, 3).toISOString(),
        eventName: "Open Doors at Amplitron",
        eventId: "5e509adc-dd63-4312-9db8-e4c02f5a4bbb",
        notes: "Drzwi otwarte",
      },
      {
        lendingId: "65c50cf0-390a-484f-9c3a-efb073a50dfc",
        items: [
          { itemId: "3db9ddee-7b21-41d9-82ce-f20c663588da",
            name: "kula dyskotekowa",},
          { itemId: "78256661-1189-45cb-9d4d-6253c654a652",
            name: "rozdzielnica",},
          { itemId: "3e9f4923-8530-4d14-ae31-c4a7b9733374",
            name: "kabel trójfazowy 10m",},
          { itemId: "79a9d7a6-8e0b-4162-87a5-fa200afeabbd",
            name: "drabina",},
        ],
        username: "YourGuyRoy",
        userId: "f141ec5f-3d2b-4e71-a4ba-1a72f872c4ab",
        startDate: new Date(2022, 8 - 1, 30, 0).toISOString(),
        endDate: new Date(2022, 8 - 1, 30, 24).toISOString(),
        notes: "Impreza w ogrodzie",
      },
      {
        lendingId: "b4b10fb9-35db-45b7-9729-c07152c57e4a",
        items: [
          { itemId: "39aa06e5-a718-43a8-9e20-bd91e33bc7d8",
            name: "półka",},
          { itemId: "c43a0a80-757f-4442-98f8-8e8a69201ff6",
            name: "zmiotka",},
          { itemId: "405b2f73-81af-444e-8f2b-5f944feffdca",
            name: "lutownica",},
        ],
        username: "TheRealGlobetrotterGrover",
        userId: "7f7feb57-d63d-4fc4-b60c-8281c5c8109c",
        startDate: new Date(2022, 7 - 1, 12, 9).toISOString(),
        endDate: new Date(2022, 7 - 1, 12, 20, 15).toISOString(),
        notes: "Wcale nie włożyłem widelca do gniazdka 230V",
      },
      {
        lendingId: "5f53cb97-93b3-40c0-84c2-59e2ecbf1169",
        items: [
          { itemId: "3befe3ce-d9e4-4809-9c79-cdfc416cd90a",
            name: "subwoofer",},
          { itemId: "6022b27e-7dfd-46e3-b8b3-c1e92cfcd4a1",
            name: "tweeter x4",},
          { itemId: "4dfddab4-5bbd-4563-9411-e4f0e5435e74",
            name: "instrukcja montażu zestawu 5.1",},
          { itemId: "5ecc0d86-d8e8-4589-8986-e835fadc36e8",
            name: "mikrofon strojeniowy Shure",},
          { itemId: "185525b4-127c-45d2-a4e0-6f4789a43f23",
            name: "mikser",},
          { itemId: "3b88939c-6316-4dfb-ad28-9b91bb44a671",
            name: "kabel XLR 10m x2",},
          { itemId: "5da853fe-548f-4e19-ae54-f4e42e26acf6",
            name: "kabel XLR 5m x4",},
        ],
        username: "itsmejohndoe",
        userId: "eed0be02-f83e-46c8-a4aa-2dcae02dc12f",
        startDate: new Date(2022, 7 - 1, 12).toISOString(),
        endDate: new Date(2022, 7 - 1, 22).toISOString(),
        notes: "Zróbmy więc prywatkę jakiej nie przeżył nikt,\nNiech sąsiedzi walą, walą, walą, walą do drzwi...",
      },
      {
        lendingId: "4a172d51-06ca-4495-8c8a-b4dce974c630",
        items: [
          { itemId: "acee73a8-3e8b-41e4-a2d3-ce6c3e870de5",
            name: "głośnik bluetooth",},
          { itemId: "991e10ba-9ec9-418e-9b5f-f393f80f4c75",
            name: "słuchawki bluetooth",},
          { itemId: "4c4900ed-84e4-421b-9828-4871181cef8d",
            name: "kabel minijack 2m",},
        ],
        username: "JustClarence",
        userId: "b517ed77-5ce5-4457-ba1e-b8a1fba4d376",
        startDate: new Date(2022, 9 - 1, 1).toISOString(),
        endDate:  new Date(2022, 9 - 1, 15).toISOString(),
        notes: "Tylko ty, ja, łódka mojego szwagra, zapasik dobrze zmrożonego mojito i dwa tygodnie nic tylko - wędkujemy!",
      },
    ),
    events: new Array<Event>(
      {
        eventId: "a2b114f3-0b2c-4fb3-98a8-762d87c161ee",
        name: "Annual Garage Band Competition",
        startDate: new Date(2022, 9 - 1, 2, 14).toISOString(),
        endDate: new Date(2022, 9 - 1, 2, 22).toISOString(),
      },
      {
        eventId: "e97982f8-7dd1-49cb-b207-60957aadb7d3",
        name: "Elka Country Music Festival",
        startDate: new Date(2022, 9 - 1, 8, 10).toISOString(),
        endDate: new Date(2022, 9 - 1, 11, 2).toISOString(),
      },
      {
        eventId: "5e509adc-dd63-4312-9db8-e4c02f5a4bbb",
        name: "Open Doors at Amplitron",
        startDate: new Date(2022, 8 - 1, 3).toISOString(),
        endDate: new Date(2022, 8 - 1, 3).toISOString(),
      },
      {
        eventId: "ca70b980-157e-47d2-8f0c-9e884e5291c7",
        name: "AmpliGranie 2k22 - otwarcie roku akademickiego",
        startDate: new Date(2022, 10 - 1, 23, 18).toISOString(),
        endDate: new Date(2022, 10 - 1, 23, 22).toISOString(),
      },
    ),
    items: new Array<Item>(
      {
        itemId: "c7e3af12-7f15-45bb-8c3f-385fc365da62",
        name: "statyw 'Athletic'",
        categoryId: "f096f654-2bd6-4fe2-a635-0346083acdca",
      },
      {
        itemId: "3db9ddee-7b21-41d9-82ce-f20c663588da",
        name: "kula dyskotekowa",
        categoryId: "b64e44ac-7447-4922-859e-1df0a273db43",
      },
      {
        itemId: "78256661-1189-45cb-9d4d-6253c654a652",
        name: "rozdzielnica",
        categoryId: "7a776a11-de96-4702-b4df-b4157a07780d",
      },
      {
        itemId: "3e9f4923-8530-4d14-ae31-c4a7b9733374",
        name: "kabel trójfazowy 10m",
        categoryId: "0887400d-8a7c-4aec-a162-82a510d3a148",
      },
      {
        itemId: "79a9d7a6-8e0b-4162-87a5-fa200afeabbd",
        name: "drabina",
        categoryId: "8b10c898-7617-4226-91d3-5b9b2edb45ae",
      },
      {
        itemId: "39aa06e5-a718-43a8-9e20-bd91e33bc7d8",
        name: "półka",
        categoryId: "8b10c898-7617-4226-91d3-5b9b2edb45ae",
      },
      {
        itemId: "c43a0a80-757f-4442-98f8-8e8a69201ff6",
        name: "zmiotka",
        categoryId: "8b10c898-7617-4226-91d3-5b9b2edb45ae",
      },
      {
        itemId: "405b2f73-81af-444e-8f2b-5f944feffdca",
        name: "lutownica",
        categoryId: "f7b1dc41-6cb8-4bad-836d-d48667e61507",
      },
      {
        itemId: "3befe3ce-d9e4-4809-9c79-cdfc416cd90a",
        name: "subwoofer HK",
        categoryId: "31eed529-b22a-4b40-aa72-67b6dc14a725",
      },
      {
        itemId: "6022b27e-7dfd-46e3-b8b3-c1e92cfcd4a1",
        name: "tweeter",
        categoryId: "6c620a38-9f44-4648-9202-fa7fc9ca1f43",
      },
      {
        itemId: "4dfddab4-5bbd-4563-9411-e4f0e5435e74",
        name: "instrukcja montażu zestawu 5.1",
        categoryId: "383e8344-8af2-4f88-9c66-91309b073bfb",
      },
      {
        itemId: "5ecc0d86-d8e8-4589-8986-e835fadc36e8",
        name: "mikrofon strojeniowy Shure",
        categoryId: "480fa84c-b559-48fe-8cf1-d4a22b322ea5",
      },
      {
        itemId: "185525b4-127c-45d2-a4e0-6f4789a43f23",
        name: "SI Impact",
        categoryId: "8ce76808-6d36-420b-89bd-3baf3f972153",
      },
      {
        itemId: "3b88939c-6316-4dfb-ad28-9b91bb44a671",
        name: "kabel XLR 10m",
        categoryId: "7bb4d313-d747-4218-9017-890799192efe",
      },
      {
        itemId: "5da853fe-548f-4e19-ae54-f4e42e26acf6",
        name: "kabel XLR 5m",
        categoryId: "7bb4d313-d747-4218-9017-890799192efe",
      },
      {
        itemId: "acee73a8-3e8b-41e4-a2d3-ce6c3e870de5",
        name: "głośnik bluetooth JBL Charge 3",
        categoryId: "6c620a38-9f44-4648-9202-fa7fc9ca1f43",
      },
      {
        itemId: "991e10ba-9ec9-418e-9b5f-f393f80f4c75",
        name: "słuchawki bluetooth",
        categoryId: "383e8344-8af2-4f88-9c66-91309b073bfb",
      },
      {
        itemId: "4c4900ed-84e4-421b-9828-4871181cef8d",
        name: "kabel minijack 2m",
        categoryId: "a02759a0-bb2d-4d22-aaa8-14d5a3fe0855",
      },
    ),
    categories: new Array<Category>(
      {
        name: "nagłośnienie",
        short_name: "AUDIO",
        id: "383e8344-8af2-4f88-9c66-91309b073bfb",
        // filters: [],
      },
      {
        name: "oświetlenie",
        short_name: "LIGHT",
        id: "b64e44ac-7447-4922-859e-1df0a273db43",
        // filters: [],

      },
      {
        name: "zasilanie",
        short_name: "POWER",
        id: "7a776a11-de96-4702-b4df-b4157a07780d",
        // filters: [],

      },
      {
        name: "pozostałe",
        short_name: "OTHER",
        id: "8b10c898-7617-4226-91d3-5b9b2edb45ae",
        // filters: [],

      },
      // nagłośnienie
      {
        name: "mikrofony",
        short_name: "MIC",
        id: "480fa84c-b559-48fe-8cf1-d4a22b322ea5",
        parent_category_id: "383e8344-8af2-4f88-9c66-91309b073bfb",
        // filters: [
        //   {
        //     name: 'Producent',
        //   },
        //   {
        //     name: 'typ',
        //   },
        // ],
      },
      {
        name: "głośniki",
        short_name: "SPKR",
        id: "6c620a38-9f44-4648-9202-fa7fc9ca1f43",
        parent_category_id: "383e8344-8af2-4f88-9c66-91309b073bfb",
        // filters: [
        //   {
        //     name: 'Producent',
        //   },
        //   {
        //     name: 'min. częstotliwość [Hz]',
        //   },
        //   {
        //     name: 'max. częstotliwość [Hz]',
        //   },
        // ],
      },
      {
        name: "subwoofery",
        short_name: "SUB",
        id: "31eed529-b22a-4b40-aa72-67b6dc14a725",
        parent_category_id: "6c620a38-9f44-4648-9202-fa7fc9ca1f43",
        // filters: [],
      },
      {
        name: "górki",
        short_name: "TWEET",
        id: "a4271407-86db-415d-afa1-2cd024cd51c5",
        parent_category_id: "6c620a38-9f44-4648-9202-fa7fc9ca1f43",
        // filters: [],
      },
      {
        name: "statywy mikrofonowe",
        short_name: "MIC-STND",
        id: "f096f654-2bd6-4fe2-a635-0346083acdca",
        parent_category_id: "383e8344-8af2-4f88-9c66-91309b073bfb",
        // filters: [
        //   {
        //     name: 'przeznaczenie',
        //   }
        // ],
      },
      {
        name: "statywy głośnikowe",
        short_name: "SPKR-STND",
        id: "98b9dc9d-4749-4b60-b0f2-268a3af25f5c",
        parent_category_id: "383e8344-8af2-4f88-9c66-91309b073bfb",
        // filters: [
        //   {
        //     name: 'udźwig',
        //   },
        //   {
        //     name: 'masa',
        //   }
        // ],
      },
      {
        name: "miksery",
        short_name: "MIX",
        id: "8ce76808-6d36-420b-89bd-3baf3f972153",
        parent_category_id: "383e8344-8af2-4f88-9c66-91309b073bfb",
        // filters: [
        //   {
        //     name: 'liczba wejść',
        //   },
        //   {
        //     name: "liczba wyjść",
        //   },
        // ],
      },
      {
        name: "kable audio",
        short_name: "CABLE_A",
        id: "7bb4d313-d747-4218-9017-890799192efe",
        parent_category_id: "383e8344-8af2-4f88-9c66-91309b073bfb",
        // filters: [
        //   {
        //     name: 'długość',
        //   },
        //   {
        //     name: "wtyczka",
        //   },
        // ],
      },
      // oświetlenie
      {
        name: "głowy",
        short_name: "HEAD",
        id: "67abcb4b-04df-4fb8-bc82-761d07c977ac",
        parent_category_id: "b64e44ac-7447-4922-859e-1df0a273db43",
        // filters: [],
      },
      {
        name: "żarowe",
        short_name: "HEAT",
        id: "c3bcc320-dfa0-4658-bdd6-fc7a31036097",
        parent_category_id: "b64e44ac-7447-4922-859e-1df0a273db43",
        // filters: [],
      },
      {
        name: "kable do oświetlenia",
        short_name: "CABLE-L",
        id: "fb3f07b5-81c8-4ec0-b01d-460bf21cfafc",
        parent_category_id: "b64e44ac-7447-4922-859e-1df0a273db43",
        // filters: [
        //   {
        //     name: "wtyczka",
        //   },
        // ],
      },
      // zasilanie
      {
        name: "kable elektryczne",
        short_name: "CABLE-PWR",
        id: "0887400d-8a7c-4aec-a162-82a510d3a148",
        parent_category_id: "7a776a11-de96-4702-b4df-b4157a07780d",
        // filters: [],
      },
      // kable
      {
        name: "IEC",
        short_name: "IEC",
        id: "35625e42-e888-4f7a-a981-c25a0c5158ba",
        parent_category_id: "7a776a11-de96-4702-b4df-b4157a07780d",
        // filters: [],
      },
      {
        name: "IEC 'podaj dalej'",
        short_name: "IEC-FWD",
        id: "3816255e-03be-44d6-b04a-1611252e03ba",
        parent_category_id: "7a776a11-de96-4702-b4df-b4157a07780d",
        // filters: [],
      },
      // różne
      {
        name: "sprzęt elektryczny",
        short_name: "ELCTR",
        id: "f7b1dc41-6cb8-4bad-836d-d48667e61507",
        parent_category_id: "8b10c898-7617-4226-91d3-5b9b2edb45ae",
        // filters: [],
      },
    ),
  },
  "e9391d5f-3b6b-48b3-bcb0-1022369dceb1": { // Antykwariat
    users: new Array<User>(
      {
        userId: "eed0be02-f83e-46c8-a4aa-2dcae02dc12f",
        username: "itsmejohndoe",
        name: "John",
        surname: "Doe",
      },
      {
        userId: "e429468d-6f08-4b46-9682-0a70be6983fb",
        username: "EmployerOfTheMonth",
        name: "Harry",
        surname: "Grease",
      },{
        userId: "2bbd2eda-6b62-40de-b122-e6c036bef7b3",
        username: "TheNewGirl",
        name: "Hannah",
        surname: "Hendry",
      },
    ),
    lendings: new Array<LendingPrivate | LendingForEvent>(
      {
        lendingId: "3d1d83c6-57f1-4045-8c1b-bbd6e4164c28",
        items: [
          { itemId: "f139e39a-313e-406d-b360-67167efd2722",
            name: "Podręcznik do przedmiotu Historia i Teraźniejszość",},
          { itemId: "aa0d8294-0aed-43e7-a6f5-4fec14f5e3bd",
            name: "Atlas Świata",},
        ],
        startDate: new Date(2022, 9 - 1, 2).toISOString(),
        endDate: new Date(2022, 9 - 1, 9).toISOString(),
        eventName: "Tournee z podręcznikami po szkołach",
        eventId: "10752b4d-ff5b-4b87-9591-83be2db0d986",
      },
      {
        lendingId: "d179c87e-efae-4ec8-8b85-2ad25c977ca8",
        items: [
          { itemId: "1f8b55e5-c5eb-4706-b6e2-fc2c103e94f5",
            name: "Kubuś Puchatek: historia Stumilowego Lasu",},
          { itemId: "c44b0b61-db5b-494e-b1ed-fc9c0607ad52",
            name: "Pingwin Obieżyświat",},
        ],
        username: "EmployerOfTheMonth",
        userId: "e429468d-6f08-4b46-9682-0a70be6983fb",
        startDate: new Date(2022, 8 - 1, 30, 10).toISOString(),
        endDate: new Date(2022, 8 - 1, 30, 14).toISOString(),
        notes: "czytanie dla dzieci w przedszkolu",
      },
    ),
    events: new Array<Event>(
      {
        eventId: "10752b4d-ff5b-4b87-9591-83be2db0d986",
        name: "Tournee z podręcznikami po szkołach",
        startDate: new Date(2022, 9 - 1, 2).toISOString(),
        endDate: new Date(2022, 9 - 1, 9).toISOString(),
      },
      {
        eventId: "36ca28b7-24d8-41e6-8827-2c3da6bdcdaa",
        name: 'Sympozjum "Jak wyciągnąć nos z książki?"',
        startDate: new Date(2022, 10 - 1, 8, 12).toISOString(),
        endDate: new Date(2022, 10 - 1, 8, 15).toISOString(),
      },
    ),
    items: new Array<Item>(
      {
        itemId: "1f8b55e5-c5eb-4706-b6e2-fc2c103e94f5",
        name: "Kubuś Puchatek: historia Stumilowego Lasu",
        categoryId: "f5a5995c-ad6c-4560-b655-0dd346323e92",
      },
      {
        itemId: "c44b0b61-db5b-494e-b1ed-fc9c0607ad52",
        name: "Pingwin Obieżyświat",
        categoryId: "f5a5995c-ad6c-4560-b655-0dd346323e92",
      },
      {
        itemId: "f139e39a-313e-406d-b360-67167efd2722",
        name: "Podręcznik do przedmiotu Historia i Teraźniejszość",
        categoryId: "5e03f517-ca77-403e-b252-a07a8f016c8c",
      },
      {
        itemId: "aa0d8294-0aed-43e7-a6f5-4fec14f5e3bd",
        name: "Atlas Świata",
        categoryId: "5e03f517-ca77-403e-b252-a07a8f016c8c",
      },
      {
        itemId: "13b04492-443e-4b70-9892-0971b1ab7526",
        name: "Klaser ze znaczkami pocztowymi z lat 1992-1994",
        categoryId: "7654e89e-0065-4670-93c1-72ca4c694eb1",
      },
    ),
    categories: new Array<Category>(
      {
        name: "książki",
        short_name: "BOOK",
        id: "7654e89e-0065-4670-93c1-72ca4c694eb1",
        // filters: [
        //   {
        //     name: "autor",
        //   },
        //   {
        //     name: "rok wydania",
        //   },
        // ],
      },
      // książki
      {
        name: "dla dzieci",
        short_name: "CHILD",
        id: "f5a5995c-ad6c-4560-b655-0dd346323e92",
        parent_category_id: "7654e89e-0065-4670-93c1-72ca4c694eb1",
        // filters: [],
      },
      {
        name: "podręczniki",
        short_name: "COURSE",
        id: "5e03f517-ca77-403e-b252-a07a8f016c8c",
        parent_category_id: "7654e89e-0065-4670-93c1-72ca4c694eb1",
        // filters: [
        //   {
        //     name: "przedmiot",
        //   },
        // ],
      },
    )
  },
  "a787df42-7513-4f4a-a94a-e5ae6eb4b4eb": { // "The Engineers Basement"
    users: [],
    lendings: [],
    events: [],
    items: [],
    categories: [],
  },
}