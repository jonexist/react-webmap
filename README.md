# Mapbox GL Project

This project is a web application built with React and Vite that uses Mapbox GL for interactive maps.

## Features

- Interactive map with Mapbox GL JS
- Geolocation control to track the user's location
- Search functionality with Mapbox Geocoder
- Displays the nearest pharmacy based on the user's current location or a specified location.
- Environment variables with Vite

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/jonexist/react-webmap.git

   ```

2. Navigate into the project directory:

   ```bash
   cd react-webmap

   ```

3. Install the dependencies

   ```bash
   npm install

   ```

4. Set up the environment variables:

   Create a .env file in the root of your project and add the following variables:

   ```bash
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   ```

   Replace your_mapbox_access_token with your actual Mapbox access token.

5. Start the development server:
   ```bash
   npm run dev
   ```
