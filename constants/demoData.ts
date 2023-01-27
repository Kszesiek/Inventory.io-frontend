import {Organization} from "../store/organizations";
import {Event} from "../store/events";
import {Rental} from "../store/rentals";
import {Item} from "../store/items";
import {CategoryExtended} from "../store/categories";
import {Member} from "../store/members";
import {Warehouse} from "../store/warehouses";
import {Property} from "../store/properties";

const propTypes = {
  STRING: 1,
  NUMBER: 2,
  BOOL: 3,
  DATE: 4,
}

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
  users: Array<Member>,
  lendings: Array<Rental>,
  events: Array<Event>,
  items: Array<Item>,
  categories: Array<CategoryExtended>,
  warehouses: Array<Warehouse>,
  properties: Array<Property>,
}

export const demoData: Record<typeof demoOrganizations[number]["id"], demoBatch> = {
  "86519777-5cf5-4af5-8e56-d5640cb26c8c": { // Amplitron
    users: new Array<Member>(
      {
        id: "eed0be02-f83e-46c8-a4aa-2dcae02dc12f",
        username: "itsmejohndoe",
        name: "John",
        surname: "Doe",
        email: "johndoe@amplitron.pw",
      },
      {
        id: "b517ed77-5ce5-4457-ba1e-b8a1fba4d376",
        username: "JustClarence",
        name: "Clarence",
        surname: "Walter",
        email: "justclarence@amplitron.pw",
      },{
        id: "f141ec5f-3d2b-4e71-a4ba-1a72f872c4ab",
        username: "YourGuyRoy",
        name: "Roy",
        surname: "Whitings",
        email: "yourguyroy@amplitron.pw",
      },{
        id: "7f7feb57-d63d-4fc4-b60c-8281c5c8109c",
        username: "TheRealGlobetrotterGrover",
        name: "Grover",
        surname: "Globetrotter",
        email: "globetrotter.grover@amplitron.pw",
      },
    ),
    lendings: new Array<Rental>(
      {
        rentalId: 501,
        name: "Impreza w ogrodzie",
        // items: [
        //   { itemId: "3db9ddee-7b21-41d9-82ce-f20c663588da",
        //     name: "kula dyskotekowa",},
        //   { itemId: "78256661-1189-45cb-9d4d-6253c654a652",
        //     name: "rozdzielnica",},
        //   { itemId: "3e9f4923-8530-4d14-ae31-c4a7b9733374",
        //     name: "kabel trójfazowy 10m",},
        //   { itemId: "79a9d7a6-8e0b-4162-87a5-fa200afeabbd",
        //     name: "drabina",},
        // ],
        userId: "f141ec5f-3d2b-4e71-a4ba-1a72f872c4ab",
        startDate: new Date(2022, 8 - 1, 30, 0).toISOString(),
        endDate: new Date(2022, 8 - 1, 30, 24).toISOString(),
        description: "Weekendowa impreza w ogródku",
      },
      {
        rentalId: 502,
        name: "Naprawa bezpieczników",
        // items: [
        //   { itemId: "39aa06e5-a718-43a8-9e20-bd91e33bc7d8",
        //     name: "półka",},
        //   { itemId: "c43a0a80-757f-4442-98f8-8e8a69201ff6",
        //     name: "zmiotka",},
        //   { itemId: "405b2f73-81af-444e-8f2b-5f944feffdca",
        //     name: "lutownica",},
        // ],
        userId: "7f7feb57-d63d-4fc4-b60c-8281c5c8109c",
        startDate: new Date(2022, 7 - 1, 12, 9).toISOString(),
        endDate: new Date(2022, 7 - 1, 12, 20, 15).toISOString(),
        description: "Wcale nie włożyłem widelca do gniazdka 230V",
      },
      {
        rentalId: 503,
        name: "Indywidualne szkolenie z obsługi sprzętu",
        // items: [
        //   { itemId: "3befe3ce-d9e4-4809-9c79-cdfc416cd90a",
        //     name: "subwoofer",},
        //   { itemId: "6022b27e-7dfd-46e3-b8b3-c1e92cfcd4a1",
        //     name: "tweeter x4",},
        //   { itemId: "4dfddab4-5bbd-4563-9411-e4f0e5435e74",
        //     name: "instrukcja montażu zestawu 5.1",},
        //   { itemId: "5ecc0d86-d8e8-4589-8986-e835fadc36e8",
        //     name: "mikrofon strojeniowy Shure",},
        //   { itemId: "185525b4-127c-45d2-a4e0-6f4789a43f23",
        //     name: "mikser",},
        //   { itemId: "3b88939c-6316-4dfb-ad28-9b91bb44a671",
        //     name: "kabel XLR 10m x2",},
        //   { itemId: "5da853fe-548f-4e19-ae54-f4e42e26acf6",
        //     name: "kabel XLR 5m x4",},
        // ],
        userId: "eed0be02-f83e-46c8-a4aa-2dcae02dc12f",
        startDate: new Date(2022, 7 - 1, 12).toISOString(),
        endDate: new Date(2022, 7 - 1, 22).toISOString(),
        description: "Zróbmy więc prywatkę jakiej nie przeżył nikt,\nNiech sąsiedzi walą, walą, walą, walą do drzwi...",
      },
      {
        rentalId: 504,
        name: "Wypad za miasto",
        // items: [
        //   { itemId: "acee73a8-3e8b-41e4-a2d3-ce6c3e870de5",
        //     name: "głośnik bluetooth",},
        //   { itemId: "991e10ba-9ec9-418e-9b5f-f393f80f4c75",
        //     name: "słuchawki bluetooth",},
        //   { itemId: "4c4900ed-84e4-421b-9828-4871181cef8d",
        //     name: "kabel minijack 2m",},
        // ],
        userId: "b517ed77-5ce5-4457-ba1e-b8a1fba4d376",
        startDate: new Date(2022, 9 - 1, 1).toISOString(),
        endDate:  new Date(2022, 9 - 1, 15).toISOString(),
        description: "Tylko ty, ja, łódka mojego szwagra, zapasik dobrze zmrożonego mojito i dwa tygodnie nic tylko - wędkujemy!",
      },
    ),
    events: new Array<Event>(
      {
        eventId: "a2b114f3-0b2c-4fb3-98a8-762d87c161ee",
        name: "Annual Garage Band Competition",
        startDate: new Date(2022, 9 - 1, 2, 14).toISOString(),
        endDate: new Date(2022, 9 - 1, 2, 22).toISOString(),
        country: 'Polska',
        city: 'Warszawa',
        postalCode: '00-636',
        street: 'Ludwika Waryńskiego',
        streetNumber: '12a',
      },
      {
        eventId: "e97982f8-7dd1-49cb-b207-60957aadb7d3",
        name: "Elka Country Music Festival",
        startDate: new Date(2022, 9 - 1, 8, 10).toISOString(),
        endDate: new Date(2022, 9 - 1, 11, 2).toISOString(),
        country: 'Polska',
        city: 'Warszawa',
        postalCode: '00-665',
        street: 'Nowowiejska',
        streetNumber: '15/19',
      },
      {
        eventId: "5e509adc-dd63-4312-9db8-e4c02f5a4bbb",
        name: "Open Doors at Amplitron",
        startDate: new Date(2022, 8 - 1, 3).toISOString(),
        endDate: new Date(2022, 8 - 1, 3).toISOString(),
        country: 'Polska',
        city: 'Warszawa',
        postalCode: '00-665',
        street: 'Nowowiejska',
        streetNumber: '15/19',
      },
      {
        eventId: "ca70b980-157e-47d2-8f0c-9e884e5291c7",
        name: "AmpliGranie 2k22 - otwarcie roku akademickiego",
        startDate: new Date(2022, 10 - 1, 23, 18).toISOString(),
        endDate: new Date(2022, 10 - 1, 23, 22).toISOString(),
        country: 'Polska',
        city: 'Warszawa',
        postalCode: '00-665',
        street: 'Nowowiejska',
        streetNumber: '15/19',
      },
    ),
    items: new Array<Item>(
      {
        itemId: "c7e3af12-7f15-45bb-8c3f-385fc365da62",
        name: "statyw 'Athletic'",
        categoryId: 498,
        warehouseId: 101,
      },
      {
        itemId: "3db9ddee-7b21-41d9-82ce-f20c663588da",
        name: "kula dyskotekowa",
        categoryId: 421,
        warehouseId: 102,
      },
      {
        itemId: "78256661-1189-45cb-9d4d-6253c654a652",
        name: "rozdzielnica",
        categoryId: 232,
        warehouseId: 101,
      },
      {
        itemId: "3e9f4923-8530-4d14-ae31-c4a7b9733374",
        name: "kabel trójfazowy 10m",
        categoryId: 137,
        warehouseId: 101,
      },
      {
        itemId: "79a9d7a6-8e0b-4162-87a5-fa200afeabbd",
        name: "drabina",
        categoryId: 75,
        warehouseId: 102,
      },
      {
        itemId: "39aa06e5-a718-43a8-9e20-bd91e33bc7d8",
        name: "półka",
        categoryId: 75,
      },
      {
        itemId: "c43a0a80-757f-4442-98f8-8e8a69201ff6",
        name: "zmiotka",
        categoryId: 75,
        warehouseId: 102,
      },
      {
        itemId: "405b2f73-81af-444e-8f2b-5f944feffdca",
        name: "lutownica",
        categoryId: 140,
        warehouseId: 102,
      },
      {
        itemId: "3befe3ce-d9e4-4809-9c79-cdfc416cd90a",
        name: "subwoofer HK",
        categoryId: 218,
        warehouseId: 101,
      },
      {
        itemId: "65959144-e4f2-4264-9f70-7032f4eb597c",
        name: "subwoofer HK",
        categoryId: 218,
        warehouseId: 101,
      },
      {
        itemId: "e1574b83-8153-4acb-b292-f737c589faa4",
        name: "subwoofer HK",
        categoryId: 218,
        warehouseId: 101,
      },
      {
        itemId: "ce9f74b1-0388-4675-b462-b607a7ffd698",
        name: "subwoofer HK",
        categoryId: 218,
        warehouseId: 101,
      },
      {
        itemId: "acc59901-d7a6-40d9-8992-e5b3b50efe51",
        name: "kolumna HK",
        categoryId: 218,
        warehouseId: 101,
      },
      {
        itemId: "de186fa7-1242-46ef-af0e-447758eda249",
        name: "kolumna HK",
        categoryId: 218,
        warehouseId: 101,
      },
      {
        itemId: "6022b27e-7dfd-46e3-b8b3-c1e92cfcd4a1",
        name: "tweeter",
        categoryId: 502,
        warehouseId: 101,
      },
      {
        itemId: "4dfddab4-5bbd-4563-9411-e4f0e5435e74",
        name: "instrukcja montażu zestawu 5.1",
        categoryId: 131,
      },
      {
        itemId: "5ecc0d86-d8e8-4589-8986-e835fadc36e8",
        name: "mikrofon strojeniowy Shure",
        categoryId: 439,
        warehouseId: 102,
      },
      {
        itemId: "185525b4-127c-45d2-a4e0-6f4789a43f23",
        name: "SI Impact",
        categoryId: 132,
        warehouseId: 101,
      },
      {
        itemId: "3b88939c-6316-4dfb-ad28-9b91bb44a671",
        name: "kabel XLR 10m",
        categoryId: 133,
      },
      {
        itemId: "5da853fe-548f-4e19-ae54-f4e42e26acf6",
        name: "kabel XLR 5m",
        categoryId: 133,
      },
      {
        itemId: "acee73a8-3e8b-41e4-a2d3-ce6c3e870de5",
        name: "głośnik bluetooth JBL Charge 3",
        categoryId: 502,
      },
      {
        itemId: "991e10ba-9ec9-418e-9b5f-f393f80f4c75",
        name: "słuchawki bluetooth",
        categoryId: 131,
      },
      {
        itemId: "4c4900ed-84e4-421b-9828-4871181cef8d",
        name: "kabel minijack 2m",
        categoryId: 133,
      },
    ),
    categories: new Array<CategoryExtended>(
      {
        name: "nagłośnienie",
        short_name: "AUDIO",
        id: 131,
        properties: [],
      },
      {
        name: "oświetlenie",
        short_name: "LIGHT",
        id: 421,
        properties: [],

      },
      {
        name: "zasilanie",
        short_name: "POWER",
        id: 232,
        properties: [],

      },
      {
        name: "pozostałe",
        short_name: "OTHER",
        id: 75,
        properties: [],

      },
      // nagłośnienie
      {
        name: "mikrofony",
        short_name: "MIC",
        id: 439,
        parent_category_id: 131,
        properties: [
          {
            id: 1,
            name: 'Producent',
            property_type_id: propTypes.STRING,
          },
          {
            id: 2,
            name: 'charakterystyka',
            property_type_id: propTypes.STRING,
          },
        ],
      },
      {
        name: "głośniki",
        short_name: "SPKR",
        id: 502,
        parent_category_id: 131,
        properties: [
          {
            id: 1,
            name: 'Producent',
            property_type_id: propTypes.STRING,
          },
          {
            id: 3,
            name: 'min. częstotliwość [Hz]',
            property_type_id: propTypes.NUMBER,
          },
          {
            id: 4,
            name: 'max. częstotliwość [Hz]',
            property_type_id: propTypes.NUMBER,
          },
          {
            id: 5,
            name: 'moc szczytowa [W]',
            property_type_id: propTypes.NUMBER,
          },
        ],
      },
      {
        name: "subwoofery",
        short_name: "SUB",
        id: 218,
        parent_category_id: 502,
        properties: [],
      },
      {
        name: "górki",
        short_name: "TWEET",
        id: 497,
        parent_category_id: 502,
        properties: [],
      },
      {
        name: "statywy mikrofonowe",
        short_name: "MIC-STND",
        id: 498,
        parent_category_id: 131,
        properties: [
          {
            id: 6,
            name: 'przeznaczenie',
            property_type_id: propTypes.STRING,
          },
        ],
      },
      {
        name: "statywy głośnikowe",
        short_name: "SPKR-STND",
        id: 499,
        parent_category_id: 131,
        properties: [
          {
            id: 7,
            name: 'udźwig [kg]',
            property_type_id: propTypes.NUMBER,
          },
          {
            id: 8,
            name: 'waga [kg]',
            property_type_id: propTypes.NUMBER,
          },
        ],
      },
      {
        name: "miksery",
        short_name: "MIX",
        id: 132,
        parent_category_id: 131,
        properties: [
          {
            id: 9,
            name: 'liczba wejść',
            property_type_id: propTypes.NUMBER,
          },
          {
            id: 10,
            name: 'liczba wyjść',
            property_type_id: propTypes.NUMBER,
          },
        ],
      },
      {
        name: "kable audio",
        short_name: "CABLE_A",
        id: 133,
        parent_category_id: 131,
        properties: [
          {
            id: 11,
            name: 'długość',
            property_type_id: propTypes.NUMBER,
          },
          {
            id: 12,
            name: "wtyczka",
            property_type_id: propTypes.STRING,
          },
        ],
      },
      // oświetlenie
      {
        name: "głowy",
        short_name: "HEAD",
        id: 134,
        parent_category_id: 421,
        properties: [
          {
            id: 5,
            name: 'moc szczytowa [W]',
            property_type_id: propTypes.NUMBER,
          },
        ],
      },
      {
        name: "żarowe",
        short_name: "HEAT",
        id: 135,
        parent_category_id: 421,
        properties: [
          {
            id: 5,
            name: 'moc szczytowa [W]',
            property_type_id: propTypes.NUMBER,
          },
        ],
      },
      {
        name: "kable do oświetlenia",
        short_name: "CABLE-L",
        id: 136,
        parent_category_id: 421,
        properties: [
          {
            id: 12,
            name: "wtyczka",
            property_type_id: propTypes.STRING,
          },
        ],
      },
      // zasilanie
      {
        name: "kable elektryczne",
        short_name: "CABLE-PWR",
        id: 137,
        parent_category_id: 232,
        properties: [],
      },
      // kable
      {
        name: "IEC",
        short_name: "IEC",
        id: 138,
        parent_category_id: 232,
        properties: [],
      },
      {
        name: "IEC 'podaj dalej'",
        short_name: "IEC-FWD",
        id: 139,
        parent_category_id: 232,
        properties: [],
      },
      // różne
      {
        name: "sprzęt elektryczny",
        short_name: "ELCTR",
        id: 140,
        parent_category_id: 75,
        properties: [],
      },
    ),
    warehouses: new Array<Warehouse>(
      {
        id: 101,
        name: "Ciemnia",
        country: "Polska",
        city: "Warszawa",
        postalCode: "00-665",
        street: "Nowowiejska",
        streetNumber: "15/19",
      },
      {
        id: 102,
        name: "Sala klubowa",
        country: "Polska",
        city: "Warszawa",
        postalCode: "00-665",
        street: "Nowowiejska",
        streetNumber: "15/19",
      },
      {
        id: 103,
        name: "Magazyn na scenę",
        country: "Polska",
        city: "Warszawa",
        postalCode: "00-614",
        street: "Rektorska",
        streetNumber: "2",
      },
    ),
    properties: new Array<Property>(
      {
        id: 1,
        name: 'Producent',
        property_type_id: propTypes.STRING,
      },
      {
        id: 2,
        name: 'charakterystyka',
        property_type_id: propTypes.STRING,
      },
      {
        id: 3,
        name: 'min. częstotliwość [Hz]',
        property_type_id: propTypes.NUMBER,
      },
      {
        id: 4,
        name: 'max. częstotliwość [Hz]',
        property_type_id: propTypes.NUMBER,
      },
      {
        id: 5,
        name: 'moc szczytowa [W]',
        property_type_id: propTypes.NUMBER,
      },
      {
        id: 6,
        name: 'przeznaczenie',
        property_type_id: propTypes.STRING,
      },
      {
        id: 7,
        name: 'udźwig [kg]',
        property_type_id: propTypes.NUMBER,
      },
      {
        id: 8,
        name: 'waga [kg]',
        property_type_id: propTypes.NUMBER,
      },
      {
        id: 9,
        name: 'liczba wejść',
        property_type_id: propTypes.NUMBER,
      },
      {
        id: 10,
        name: 'liczba wyjść',
        property_type_id: propTypes.NUMBER,
      },
      {
        id: 11,
        name: 'długość',
        property_type_id: propTypes.NUMBER,
      },
      {
        id: 12,
        name: "wtyczka",
        property_type_id: propTypes.STRING,
      },
    ),
  },
  "e9391d5f-3b6b-48b3-bcb0-1022369dceb1": { // Antykwariat
    users: new Array<Member>(
      {
        id: "eed0be02-f83e-46c8-a4aa-2dcae02dc12f",
        username: "itsmejohndoe",
        name: "John",
        surname: "Doe",
        email: "johndoe@onet.pl",
      },
      {
        id: "e429468d-6f08-4b46-9682-0a70be6983fb",
        username: "EmployerOfTheMonth",
        name: "Harry",
        surname: "Grease",
        email: "henry.g@wp.pl",
      },{
        id: "2bbd2eda-6b62-40de-b122-e6c036bef7b3",
        username: "TheNewGirl",
        name: "Hannah",
        surname: "Hendry",
        email: "hannah_h@gmail.com",
      },
    ),
    lendings: new Array<Rental>(
      {
        rentalId: 601,
        name: "czytanie dla dzieci w przedszkolu",
        // items: [
        //   { itemId: "1f8b55e5-c5eb-4706-b6e2-fc2c103e94f5",
        //     name: "Kubuś Puchatek: historia Stumilowego Lasu",},
        //   { itemId: "c44b0b61-db5b-494e-b1ed-fc9c0607ad52",
        //     name: "Pingwin Obieżyświat",},
        // ],
        userId: "e429468d-6f08-4b46-9682-0a70be6983fb",
        startDate: new Date(2022, 8 - 1, 30, 10).toISOString(),
        endDate: new Date(2022, 8 - 1, 30, 14).toISOString(),
        description: "",
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
        categoryId: 2,
      },
      {
        itemId: "c44b0b61-db5b-494e-b1ed-fc9c0607ad52",
        name: "Pingwin Obieżyświat",
        categoryId: 2,
      },
      {
        itemId: "f139e39a-313e-406d-b360-67167efd2722",
        name: "Podręcznik do przedmiotu Historia i Teraźniejszość",
        categoryId: 3,
      },
      {
        itemId: "aa0d8294-0aed-43e7-a6f5-4fec14f5e3bd",
        name: "Atlas Świata",
        categoryId: 3,
      },
      {
        itemId: "13b04492-443e-4b70-9892-0971b1ab7526",
        name: "Klaser ze znaczkami pocztowymi z lat 1992-1994",
        categoryId: 1,
      },
    ),
    categories: new Array<CategoryExtended>(
      {
        name: "książki",
        short_name: "BOOK",
        id: 1,
        properties: [
          {
            id: 1,
            name: "autor",
            property_type_id: propTypes.STRING,
          },
          {
            id: 2,
            name: "rok wydania",
            property_type_id: propTypes.STRING,
          },
        ],
      },
      // książki
      {
        name: "dla dzieci",
        short_name: "CHILD",
        id: 2,
        parent_category_id: 1,
        properties: [],
      },
      {
        name: "podręczniki",
        short_name: "COURSE",
        id: 3,
        parent_category_id: 1,
        properties: [
          {
            id: 3,
            name: "przedmiot",
            property_type_id: propTypes.STRING,
          },
        ],
      },
    ),
    warehouses: new Array<Warehouse>(
      {
        id: 201,
        name: "Zaplecze",
        country: "Polska",
        city: "Warszawa",
        postalCode: "00-234",
        street: "Rydygiera",
        streetNumber: "23/4",
      },
      {
        id: 202,
        name: "Magazyn pod Warszawą",
        country: "Polska",
        city: "Pruszków",
        postalCode: "05-800",
        street: "3 maja",
        streetNumber: "8",
      },
    ),
    properties: new Array<Property>(
      {
        id: 1,
        name: "autor",
        property_type_id: propTypes.STRING,
      },
      {
        id: 2,
        name: "rok wydania",
        property_type_id: propTypes.STRING,
      },
      {
        id: 3,
        name: "przedmiot",
        property_type_id: propTypes.STRING,
      },
    )
  },
  "a787df42-7513-4f4a-a94a-e5ae6eb4b4eb": { // "The Engineers Basement"
    users: [],
    lendings: [],
    events: [],
    items: [],
    categories: [],
    warehouses: [],
    properties: [],
  },
}