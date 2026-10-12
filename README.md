# Chef's Menu Manager

A simple React Native mobile app that helps a chef create and view menu items.

## Features

- Add a dish name, description, course, and price.
- Choose Starter, Main Course, or Dessert.
- See required-field and price validation messages.
- Get confirmation after adding a dish.
- View all added menu items in a live-updating list.
- Display prices in South African rand (R).

Menu items are stored in memory for this first version. They are cleared when the app is restarted; persistent storage is planned for a later version.

## Requirements

- Node.js LTS
- Expo Go on an Android phone
- A computer and phone connected to the same Wi-Fi network

## Run the app

1. Open this project folder in Visual Studio Code.
2. In the VS Code terminal, install the dependencies:

   ```bash
   npm install
   ```

3. Start Expo:

   ```bash
   npm start
   ```

4. Scan the QR code shown in the terminal using Expo Go.

If port 8081 is already in use, Expo can use another available port. Use the QR code and connection address printed by the active Expo terminal.

## Project structure

- `App.js` — app screens, menu form, validation, and menu list.
- `app.json` — Expo app name and Android package settings.
- `package.json` — project scripts and dependencies.

## Current scope

This version supports adding and viewing menu items. Editing, deleting, searching, filtering, statistics, and persistent storage are not included yet.

