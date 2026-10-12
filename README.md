# Chef's Menu Manager

A simple React Native mobile app with browser support that helps a chef create and view menu items.

## Features

- Add a dish name, description, course, and price.
- Choose Starter, Main Course, or Dessert.
- See required-field and price validation messages.
- Get confirmation after adding a dish.
- View all added menu items in a live-updating list.
- Display prices in South African rand (R).
- Run the app on Android with Expo Go or in a desktop browser.

Menu items are stored in memory for this first version. They are cleared when the app is restarted; persistent storage is planned for a later version.

## Requirements

- Node.js LTS
- For Android: Expo Go on an Android phone
- For Android device testing: computer and phone connected to the same Wi-Fi network

## Install dependencies

Open this project folder in Visual Studio Code and run:

```bash
npm install
```

## Run in a desktop browser

```bash
npm run web
```

Expo starts the web version and opens it in your browser. If it does not open automatically, use the local address printed in the terminal.

## Run on Android

```bash
npm start
```

Scan the QR code shown in the terminal using Expo Go. If port 8081 is already in use, use the QR code and address printed by the active Expo terminal.

## Project structure

- `App.js` — app screens, menu form, validation, and menu list.
- `app.json` — Expo app name, Android package, and Metro web bundler settings.
- `package.json` — project scripts and dependencies, including the `web` script.

## Current scope

This version supports adding and viewing menu items. Editing, deleting, searching, filtering, statistics, and persistent storage are not included yet.

