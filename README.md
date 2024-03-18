# Inventory.IO

###### *This repository contains only the mobile app. The app needs dedicated backend to work, which is not part of this repository.*

Inventory.io is a mobile app for managing inventory. It allows assigning items to categories, which are arranged in a tree structure. It was originally developed for use at Klub Studencki Amplitron at Warsaw University of Technology and potentially in other student organizations, unfortunately the project got stuck on production deployment phase due to network configuration at the university (firewalls, blocked ports and stuff).

### Features

* user authentication
* items, categories, warehouses, events, rentals, members
* assigning item to category, warehouse and lending
* tree of categories created dynamically by user
* events with location assignment (possibility to use user's location based on GPS reading)
* Searching for items by name, filtering by category
* Searching for items with barcode and QR code reader
* support for multiple organizations
* light mode and dark mode with automatic mode (according to system settings)

### Built With

[![TypeScript][TypeScript]][TypeScript-url]
[![ReactNative][ReactNative]][ReactNative-url]
[![Expo][Expo]][Expo-url]

[![ReactNavigation][ReactNavigation]][ReactNavigation-url]
[![ReactRedux][ReactRedux]][ReactRedux-url]
[![Reanimated][Reanimated]][Reanimated-url]
[![Axios][Axios]][Axios-url]

The app is created with React Native and TypeScript combined with Expo. It uses React Navigation for... well, navigation, Redux with combined reducers for state management and Axios for HTTP communication with server.

### Creators

This mobile app was developed exclusively by [Grzegorz Rusinek (Kszesiek)](https://github.com/kszesiek).

### Screenshots

<p align="center">
  <img alt="Main page" src="https://i.imgur.com/98ntYcy.jpg" width="24%">
  <img alt="Inventory" src="https://i.imgur.com/KYcs6Qw.jpg" width="24%">
  <img alt="Lendings" src="https://i.imgur.com/Kx8aqNJ.jpg" width="24%">
  <img alt="Events" src="https://i.imgur.com/glEAKpa.jpg" width="24%">
</p>


[TypeScript]: https://img.shields.io/badge/TypeScript-333333?logo=typescript&labelColor=ffffff
[TypeScript-url]: https://www.typescriptlang.org/
[ReactNative]: https://img.shields.io/badge/React%20Native-333333?logo=react&logoColor=26d9fd&labelColor=222222
[ReactNative-url]: https://reactnative.dev/
[Expo]: https://img.shields.io/badge/Expo-333333?logo=expo&logoColor=1172b6&labelColor=ffffff
[Expo-url]: https://expo.dev/
[ReactNavigation]: https://img.shields.io/badge/React%20Navigation-333333.svg?logo=data:image/png;base64,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&labelColor=242526
[ReactNavigation-url]: https://reactnavigation.org/
[ReactRedux]: https://img.shields.io/badge/React%20Redux-333333?logo=redux&labelColor=764abc
[ReactRedux-url]: https://react-redux.js.org/
[Axios]: https://img.shields.io/badge/Axios-333333?logo=axios&labelColor=5A29E4
[Axios-url]: https://axios-http.com/
[Reanimated]: https://img.shields.io/badge/React%20Native%20Reanimated-333333.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA2OSA0MiI+PHBhdGggZmlsbD0iI0Y4RjlGRiIgZD0iTTEgMjUuMnYtLjc3bDEuOTctMS41MlYyMC4xbC0uMzctLjYzczMuNTEtMi40IDMuNjgtMi41NWMuMTgtLjE3IDIuODItMS42OCAyLjgyLTEuNjhsMi4wNi0uNjVzMi4zNi0uMTEgMi43NSAwYy4zOS4xIDMuNzQuMSAzLjc0LjFsMS4wNy0uNiAzLjctMS44IDQuMTQtMS4xMmgzLjA3bDMuODguNzhoNS44N2w0Ljk4LS43OCAxLjczLTEgMS44Ni0uOTUtMS44NC0uMjEuNDgtLjgyYy4wNC0uMDcgMS4xNy0uNjggMS4xNy0uNjhsMS4zMi0uNzVoLTEuNjVzMS4wNy0uODcgMS4xNy0xLjA0Yy4xMS0uMTcuOC0uNDUuOC0uNDVMNTAuNjkgNWwxLjktLjk2IDEuMTgtMS42MnMxLjMtLjQ1IDEuNTEtLjQ1aC45NmMuMjEgMCAxLjQzLS44MiAxLjQzLS44MmwxLjA0Ljg2IDIuMjMgMS4xMyAyLjM2IDEuODMuNzMgMS40MSAzLjA0IDIuNjQuODIgMS40My0uNTQgMS41NS0uNjcuMjItMS4xMy4yOC0uOTctLjU2LTIuOS0uNjctMS4zNS0uNzgtMi4yMy0uMTctMS43OCAxLjAxLTEuODYgNC45MS0uMjggMi44LS40NSAxLjc5LS42OCAxLjEyIDUuNzkgMS45NyA0LjEzIDIuOTIgMy4zMiAyLjMuMS44OCAxLjUgMS4xNy4zOSAxLjMtMi40NS4zOC0xLjQtMi40Mkw2MyAyOS4xMmwtNC4wMy0yLjk2SDU3bC0uNTcgMi4xOC0yLjE4IDIuNjhINTMuMmwtMi4wOCAxLjJ2LTIuMWwuNTYtLjVoMS4zNGwxLjEzLTEuMDYuNjctLjk1di0xLjQ1bC0yLjU4LS43OC0zLjY0LjktMi4yLS40TDQ0IDI2LjlzLTcuNzMtMS40Ny03LjktMS41N2MtLjE4LS4xMS0yLjU4LS45LTIuNTgtLjlsLTEuMDYuMTJoLS42bDEuMjUgMi43NCAxLjY3IDIuNCA1Ljc4IDIuODYgMS4xOS43LjE3LjQ3IDEuOC43MS4zNy42My0xLjk3Ljc4LTEuNTgtLjk4cy0yLjA2LTEuMTYtMi4yMS0xLjJjLS4xOC0uMDctMi41OC0xLjU5LTIuNTgtMS41OXMtMy41LS42NS0zLjUtLjhjMC0uMTctMi4wOS0yLjc5LTIuMi0yLjk4LS4xLS4yLTIuMDMtMi43Ny0yLjAzLTIuNzdsLTEuMi0uNy0xLjIzIDQuMS0yLjY0IDMuOTEuMSAxLjQ1IDIuMDIgNC4yIDEuNyAxLjc5LS41LjU2SDIzLjlsLTEuMDYtMS44di0uODhsLTIuOTQtNS4xdi0xLjEzbC41Ni0uOTcgMS4zLTIuODguMjItMS44NHMtMi43NS0zLjA3LTIuOTMtMy4zYTUxLjcyIDUxLjcyIDAgMCAxLTEuMTItMy45MnYtMi4yM3MtLjc4IDAtLjk2LS4wNmMtLjE3LS4wNy0yLjIzLjg4LTIuMjMuODhoLS4zNGwtMi40Ny42MS0xLjc2IDEuMDItMS43NyAxLjMtMS45LS4yOS0xLjQyIDEuMjQtMS40IDIuNDItMS4zMyAxLjItMS4zNi4xWiIvPjxwYXRoIHN0cm9rZT0iI0Y4RjlGRiIgc3Ryb2tlLXdpZHRoPSIuNzEiIGQ9Ik0xIDQwLjg0aDY3LjI3TTEgMjUuMjF2LS43OGwxLjk3LTEuNTJWMjAuMWwtLjM3LS42M3MzLjUxLTIuNCAzLjY4LTIuNTVjLjE4LS4xNyAyLjgyLTEuNjggMi44Mi0xLjY4bDIuMDYtLjY1czIuMzYtLjExIDIuNzUgMGMuMzkuMSAzLjc0LjEgMy43NC4xbDEuMDctLjYgMy43LTEuOCA0LjE0LTEuMTJoMy4wN2wzLjg4Ljc4aDUuODdsNC45OC0uNzggMS43My0xIDEuODYtLjk1LTEuODQtLjIxLjQ4LS44MmMuMDQtLjA3IDEuMTctLjY4IDEuMTctLjY4bDEuMzItLjc1aC0xLjY1czEuMDctLjg3IDEuMTctMS4wNGMuMTEtLjE3LjgtLjQ1LjgtLjQ1TDUwLjY5IDVsMS45LS45NiAxLjE4LTEuNjJzMS4zLS40NSAxLjUxLS40NWguOTZjLjIxIDAgMS40My0uODIgMS40My0uODJsMS4wNC44NiAyLjIzIDEuMTMgMi4zNiAxLjgzLjczIDEuNDEgMy4wNCAyLjY0LjgyIDEuNDMtLjU0IDEuNTUtLjY3LjIyLTEuMTMuMjgtLjk3LS41Ni0yLjktLjY3LTEuMzUtLjc4LTIuMjMtLjE3LTEuNzggMS4wMS0xLjg2IDQuOTEtLjI4IDIuOC0uNDUgMS43OS0uNjggMS4xMiA1Ljc5IDEuOTcgNC4xMyAyLjkyIDMuMzIgMi4zLjEuODggMS41IDEuMTcuMzkgMS4zLTIuNDUuMzgtMS40LTIuNDJMNjMgMjkuMTJsLTQuMDMtMi45Nkg1N2wtLjU3IDIuMTgtMi4xOCAyLjY4SDUzLjJsLTIuMDggMS4ydi0yLjFsLjU2LS41aDEuMzRsMS4xMy0xLjA2LjY3LS45NXYtMS40NWwtMi41OC0uNzgtMy42NC45LTIuMi0uNEw0NCAyNi45cy03LjczLTEuNDctNy45LTEuNTdjLS4xOC0uMTEtMi41OC0uOS0yLjU4LS45bC0xLjA2LjEyaC0uNmwxLjI1IDIuNzQgMS42NyAyLjQgNS43OCAyLjg2IDEuMTkuNy4xNy40NyAxLjguNzEuMzcuNjMtMS45Ny43OC0xLjU4LS45OHMtMi4wNi0xLjE2LTIuMjEtMS4yYy0uMTgtLjA3LTIuNTgtMS41OS0yLjU4LTEuNTlzLTMuNS0uNjUtMy41LS44YzAtLjE3LTIuMDktMi43OS0yLjItMi45OC0uMS0uMi0yLjAzLTIuNzctMi4wMy0yLjc3bC0xLjItLjctMS4yMyA0LjEtMi42NCAzLjkxLjEgMS40NSAyLjAyIDQuMiAxLjcgMS43OS0uNS41NkgyMy45bC0xLjA2LTEuOHYtLjg4bC0yLjk0LTUuMXYtMS4xM2wuNTYtLjk3IDEuMy0yLjg4LjIyLTEuODRzLTIuNzUtMy4wNy0yLjkzLTMuM2E1MS43MiA1MS43MiAwIDAgMS0xLjEyLTMuOTJ2LTIuMjNzLS43OCAwLS45Ni0uMDZjLS4xNy0uMDctMi4yMy44OC0yLjIzLjg4aC0uMzRsLTIuNDcuNjEtMS43NiAxLjAyLTEuNzcgMS4zLTEuOS0uMjktMS40MiAxLjI0LTEuNCAyLjQyLTEuMzMgMS4yLTEuMzYuMVoiLz48L3N2Zz4=&labelColor=222222
[Reanimated-url]: https://docs.swmansion.com/react-native-reanimated/