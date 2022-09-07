/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import {LendingForEvent, LendingPrivate} from "./store/lendings";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends OldRootStackParamList {}
  }
}

// ROOT STACK

export type RootStackParamList = {
  Login: NavigatorScreenParams<LoginStackParamList>;
  Home: NavigatorScreenParams<HomeDrawerParamList>;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
  >;

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

// HOME DRAWER

export type HomeDrawerParamList = {
  OrganizationTabNavigator: undefined;
  SecondOrganizationTabNavigator: undefined;
  // Yeah, in the future this needs to be changed for sure
};

export type HomeDrawerScreenProps<Screen extends keyof HomeDrawerParamList> = DrawerScreenProps<
  HomeDrawerParamList,
  Screen
  >;

// HOME TAB

export type HomeTabParamList = {
  Homescreen: undefined;
  Inventory: undefined;
  LendingsNavigator: undefined;
  Members: undefined;
  Events: undefined;
  More: undefined;
  AppSettings: undefined;
  UserSettings: undefined;
};

export type HomeTabScreenProps<Screen extends keyof HomeTabParamList> = BottomTabScreenProps<
  HomeTabParamList,
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