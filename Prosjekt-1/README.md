# Project 1: Drink Recipe Viewer
This project was developed by my team and I for the course IT2810 Web Development. You can read more about the application and process below.

[Open in Virtual Machine](http://129.241.104.125/project1/)

## Group Information

- **Group No:** 8
- **Participants:** Ailin Anjadatter Tinglum, Cecilia Lie, Live Stamnes Dyrland, Nhung Pham

## Overview

This repository contains a web application for viewing drink recipes. Users can swipe between different recipe cards, favorite drinks by pressing the "star" button, and filter drinks based on their alcoholic content.

### Key Features

- **Swipeable Recipe Cards:** Easily browse through various drink recipes.
- **Favorites List:** Save your favorite drinks for quick access.
- **Filtering Options:** Search for drinks based on alcoholic or non-alcoholic categories.

## Technology Stack

The project is built with:

- TypeScript
- CSS
- React
- Vite
- Node v.24.6.X+
- npm v11.+.

## Project Structure

The core functionality of the project is implemented in the `src` folder, which contains the following structure:

- **api**: Contains API calls and methods for data fetching.
  [coctails.ts](src/api/cocktails.ts)
- **assets**: Contains images used on the website
- **core**: Contains logic for the webpage
  [DrinksContainer.tsx] fetches and filters drinks, pages through results, shows    details, and saves favorites.
- **components**: Core logic and styling for the different components displayed on the homepage.
  [Card.tsx](src/components/card.tsx)
  [card.css](src/components/Card.css)
  [FilterBar.tsx](src/components/FilterBar.tsx)
  [filterBar.css](src/components/filterBar.css)
- **hooks**: Custom hooks for managing user choices, such as filters and favorites.
  [useLocalStorage.ts](src/hooks/useLocalStorage.ts)
  [useSessionStorage.ts](src/hooks/useSessionStorage.ts)

- **tests**: Contains unit tests for various components and functionalities.
  [test](src/test)

In the parent folder, we have files connecting main functionality to a main webpage which is run from the `main.tsx`

- [App.tsx](src/App.tsx) combines the different compoents onto a main webpage
- [App.css](src/App.css) styling for `App.tsx`
- [main.tsx](src/main.tsx) runs the app
- [index.css](src/index.css) styling for `main.tsx`

## Development process

During our initial group meeting, we brainstormed project ideas and explored various REST APIs. After selecting an API for drink recipes, we discussed the desired features and layout for the webpage. In our second group meeting we realized that the API we had chosen needed an access key, so we decided to change to an accessible API and did the necessary changes in the code.

To structure our workflow, we set up a GitHub project with todos, issues, and milestones based on the features we aimed to implement. Tasks were divided among group members to facilitate parallel development.

## Use of AI

We utilized AI-based tools, including Claude Sonnet 4 and ChatGPT, to enhance our efficiency and accuracy while implementing complex features. AI assistance was particularly beneficial during the initial stages of the project for exploring recommended approaches.

## Getting started

To run the project locally, follow these steps:

1. Navigate to the `Prosjekt-1` folder:

   ```bash
   cd Prosjekt-1
   ```

2. Install the necessary packages:

   ```bash
   npm install
   npm install @tanstack/react-query
   npm install @tanstack/react-query-devtools
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

### Running tests

To run the test, follow these steps:

1. Navigate to the `test` folder:

   ```bash
   cd test
   ```

2. Execute the tests

   ```bash
   npm run test
   ```
