# Project 1

[Open in Virtual Machine](http://129.241.104.125/project1/)

## Group info

Group No: 8
Participants: Ailin Anjadatter Tinglum, Cecilia Lie, Live Stamnes Dyrland, Nhung Pham

## Overview

This repository contains a website for viewing drink recipes.
When you open the website you are met with a main page where you can swipe between different recipe cards. These cards can be favorited by pressing the "star" button. This action adds the drink to a favorites list. You can also filter the search based on if the drink is alcoholic or non-alcoholic.

The project is built with:

* TypeScript
* React
* Vite
* Node v.24.6.X+
* npm v11.+.

## Project Structure

This repository contains a main folder `src` where the core functionality of the project is implemented. 

* [App.tsx](src/App.tsx) combines the different compoents onto a main webpage
* [App.css](src/App.css) styling for `App.tsx`
* [main.tsx](src/main.tsx) runs the app
* [index.css](src/index.css) styling for `main.tsx`

Inside the  `src` folder, we have different folders for the different parts of the app.

* api - calls on api and sets up methods for use in other files
  [coctails.ts](src/api/cocktails.ts)
* components - core logic and styling for the different components shown on the homepage
  [card.tsx](src/components/card.tsx)
  [Card.css](src/components/Card.css)
  [FilterBar.tsx](src/components/FilterBar.tsx)
  [filterBar.css](src/components/filterBar.css)
  [Swipe.tsx](src/components/Swipe.tsx)
  [swipe.css](src/components/swipe.css)
* hooks - saving users choices, for example filters and favorites
  [useLocalStorage.ts](src/hooks/useLocalStorage.ts)
  [useSessionStorage.ts](src/hooks/useSessionStorage.ts)

There are tests located in the folder [test](src/test)
  
## Development process

At our first group meeting we decided what our project was going to be by first brainstorming different topics and then looking up different REST Api's for these topics. When we found an accessible API for drink recipes, we started brainstorming what we wanted the webpage to look like and what features we wanted to implement.

To structure the workflow we set up a project on github, made todos, issues and milestones. The todos and issues are based on the features we decided to implement for this project.

During this first meeting we divided up the tasks so each person could start working on 

## Use of AI

As part of this project, we made use of AI-based tools to improve both efficiency and accuracy when working with complex features. In particular, we relied on Claude Sonnet 4 and Chat GPT to explore recommended approaches for implementing our app.

In the beginning we used AI

## Getting started

The project can be opened using the virtual machine, or by running these commands:

1. ensure you are in the `Prosjekt-1` folder:
   `cd Prosjekt-1`
2. download the necessary packages by running:
   `npm install`
   `npm install @tanstack/react-query`
   `npm install @tanstack/react-query-devtools`
  in your terminal
3. run the project using
   `npm run dev`

The tests can be run from the `test`folder.

1. ensure you are in the test folder by running:
   `cd test`
   from `Prosjekt-1`
2. run the tests using
   `npm run test`

<!-- Dokumentasjon i form av readme på git som dokumenterer og forklarer valg, dokumenterer hva som er testet og husk å dokumenter bruk av AI--!ß>
