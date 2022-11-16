/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import { DrawerScreenProps } from '@react-navigation/drawer';
import {LendingForEvent, LendingPrivate} from "./store/lendings";
import {Event} from "./store/events";
import {Item} from "./store/items";

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
  CreateOrganization: { doesGoBack: boolean } | undefined;
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
  LendingNavigator: undefined;
  EventNavigator: undefined;
  More: undefined;
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
  AddEditItem: { item: Item } | undefined;
  ItemDetails: { itemId: string };
};

export type InventoryStackScreenProps<Screen extends keyof InventoryStackParamList> = NativeStackScreenProps<
  InventoryStackParamList,
  Screen
  >;

// LENDING STACK

export type LendingStackParamList = {
  Lendings: undefined;
  AddEditLending: { lending: LendingPrivate | LendingForEvent } | undefined;
  LendingDetails: { lendingId: string };
};

export type LendingStackScreenProps<Screen extends keyof LendingStackParamList> = NativeStackScreenProps<
  LendingStackParamList,
  Screen
>;

// EVENT STACK

export type EventStackParamList = {
  Events: undefined;
  AddEditEvent: { event: Event } | undefined;
  EventDetails: { eventId: string };
};

export type EventStackScreenProps<Screen extends keyof EventStackParamList> = NativeStackScreenProps<
  EventStackParamList,
  Screen
>;

// WELCOME STACK

export type WelcomeStackParamList = {
  Welcome: undefined;
  CreateOrganization: undefined;
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