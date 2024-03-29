/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {Event} from "./store/events";
import {Property} from "./store/properties";

// declare global {
//   namespace ReactNavigation {
//     interface RootParamList extends OldRootStackParamList {}
//   }
// }

// LOGIN STACK

export type LoginStackParamList = {
  SignIn: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  AppSettings: undefined;
};

export type LoginStackScreenProps<Screen extends keyof LoginStackParamList> = NativeStackScreenProps<
  LoginStackParamList,
  Screen
  >;

// HOME STACK

export type HomeStackParamList = {
  HomeDrawer: undefined;
  CreateOrganizationHome: { doesGoBack: boolean } | undefined;
  JoinOrganization: undefined;
}

export type HomeStackScreenProps<Screen extends keyof HomeStackParamList> = NativeStackScreenProps<
  HomeStackParamList,
  Screen
>;

// HOME DRAWER

// export type HomeDrawerParamList = {
//   OrganizationTabNavigator: undefined;
//   SecondOrganizationTabNavigator: undefined;
//   // Yeah, in the future this needs to be changed for sure
// };
//
// export type HomeDrawerScreenProps<Screen extends keyof HomeDrawerParamList> = DrawerScreenProps<
//   HomeDrawerParamList,
//   Screen
// >;

// HOME TAB

export type HomeTabParamList = {
  HomescreenNavigator: undefined;
  InventoryNavigator: undefined;
  RentalNavigator: undefined;
  EventNavigator: undefined;
  MoreNavigator: undefined;
  // Members: undefined;
  // AppSettings: undefined;
  // UserSettings: undefined;
};

export type HomeTabScreenProps<Screen extends keyof HomeTabParamList> = BottomTabScreenProps<
  HomeTabParamList,
  Screen
  >;

// HOMESCREEN STACK

export type HomescreenStackParamList = {
  Homescreen: undefined;
  BarcodeScanner: undefined;
};

export type HomescreenStackScreenProps<Screen extends keyof HomescreenStackParamList> = NativeStackScreenProps<
  HomescreenStackParamList,
  Screen
  >;

// INVENTORY STACK

export type InventoryStackParamList = {
  Inventory: { searchPhrase: string } | undefined;
  ItemDetails: { itemId: string };
  AddEditItem: { itemId: string } | undefined;
  EditItemProperties: { itemId: string, categoryId: number };
};

export type InventoryStackScreenProps<Screen extends keyof InventoryStackParamList> = NativeStackScreenProps<
  InventoryStackParamList,
  Screen
  >;

// LENDING STACK

export type RentalStackParamList = {
  Rentals: undefined;
  RentalDetails: { rentalId: number };
  AddEditRental: { rentalId: number } | undefined;
  AddItemsToRental: { rentalId: number };
};

export type RentalStackScreenProps<Screen extends keyof RentalStackParamList> = NativeStackScreenProps<
  RentalStackParamList,
  Screen
>;

// EVENT STACK

export type EventStackParamList = {
  Events: undefined;
  EventDetails: { event: Event };
  AddEditEvent: { event: Event } | undefined;
};

export type EventStackScreenProps<Screen extends keyof EventStackParamList> = NativeStackScreenProps<
  EventStackParamList,
  Screen
>;

// MORE STACK

export type MoreStackParamList = {
  More: undefined;
  MembersNavigator: undefined;
  WarehousesNavigator: undefined;
  CategoriesNavigator: undefined;
  PropertiesNavigator: undefined;
  HenryStickmin: undefined;
};

export type MoreStackScreenProps<Screen extends keyof MoreStackParamList> = NativeStackScreenProps<
  MoreStackParamList,
  Screen
>;

// MEMBERS STACK

export type MembersStackParamList = {
  Members: undefined;
  MemberDetails: { memberId: string };
  AddEditMember: { memberId: string } | undefined;
};

export type MembersStackScreenProps<Screen extends keyof MembersStackParamList> = NativeStackScreenProps<
  MembersStackParamList,
  Screen
>;

// CATEGORIES STACK

export type CategoriesStackParamList = {
  Categories: undefined;
  CategoryDetails: { categoryId: number };
  AddEditCategory: { categoryId: number } | undefined;
  EditCategoryProperties: {categoryId: number, properties: Property[]};
};

export type CategoriesStackScreenProps<Screen extends keyof CategoriesStackParamList> = NativeStackScreenProps<
  CategoriesStackParamList,
  Screen
>;

// WAREHOUSES STACK

export type WarehousesStackParamList = {
  Warehouses: undefined;
  WarehouseDetails: { warehouseId: number };
  AddEditWarehouse: { warehouseId: number } | undefined;
};

export type WarehousesStackScreenProps<Screen extends keyof WarehousesStackParamList> = NativeStackScreenProps<
  WarehousesStackParamList,
  Screen
>;

// PROPERTIES STACK

export type PropertiesStackParamList = {
  Properties: undefined;
  PropertyDetails: { propertyId: number };
  AddEditProperty: { propertyId: number } | undefined;
};

export type PropertiesStackScreenProps<Screen extends keyof PropertiesStackParamList> = NativeStackScreenProps<
  PropertiesStackParamList,
  Screen
>;

// WELCOME STACK

export type WelcomeStackParamList = {
  Welcome: undefined;
  CreateOrganizationWelcome: undefined;
  JoinOrganization: undefined;
};

export type WelcomeStackScreenProps<Screen extends keyof WelcomeStackParamList> = NativeStackScreenProps<
  WelcomeStackParamList,
  Screen
  >;

















// OLD ROOT STACK

export type OldRootStackParamList = {
  Root: NavigatorScreenParams<OldRootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type OldRootStackScreenProps<Screen extends keyof OldRootStackParamList> = NativeStackScreenProps<
  OldRootStackParamList,
  Screen
>;

// ROOT TAB

export type OldRootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type RootTabScreenProps<Screen extends keyof OldRootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<OldRootTabParamList, Screen>,
  NativeStackScreenProps<OldRootStackParamList>
>;