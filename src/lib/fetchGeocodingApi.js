import mapboxgl from 'mapbox-gl';
import icon from '../assets/location-pin.png';
import { createCustomMarker } from '../utils/createCustomMarker';
import { addPopupToMarker } from '../utils/addPopupToMarker';
import { distance } from '@turf/turf';

// Function to construct the URL for the MapBox Geocoding API request
const constructApiUrl = (lng, lat, placeType, token) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeType}.json?proximity=${lng},${lat}&access_token=${token}`;

// Function to process each location from the API response
const processLocation = (pharmacyLoc, map, markersRef, locationProximity) => {
  // Extract the coordinates from the location's geometry
  const { coordinates } = pharmacyLoc.geometry;

  const from = locationProximity;
  const to = coordinates;
  const options = { units: 'kilometers' };
  const distanceBetween = distance(from, to, options);
  console.log(distanceBetween);

  // Create a custom marker using the provided icon
  const el = createCustomMarker(icon);
  // Create a new marker at the location's coordinates and add it to the map
  const marker = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map);
  // Add the new marker to the markers reference array
  markersRef.current.push(marker);
  // Add a popup to the marker with the location's information
  addPopupToMarker(marker, pharmacyLoc, map, distanceBetween);
};

// Function to fetch data from MapBox GL JS Geocoding API
const fetchGeocodingApi = async (
  mapRef,
  locationCoordinates,
  token,
  markersRef,
  abortController
) => {
  const [lng, lat] = locationCoordinates;
  // Construct the URL for the API request using the given longitude, latitude, and place type
  const url = constructApiUrl(lng, lat, 'pharmacy', token);
  // Remove the previous markers from the map
  markersRef.current.forEach((marker) => marker.remove());
  // Reset the markers reference array
  markersRef.current = [];

  try {
    // Fetch data from the API
    const response = await fetch(url, { signal: abortController.signal });
    // Parse the response as JSON
    const data = await response.json();
    // Process each location from the API response
    // This involves adding a marker to the map for each location
    data.features.forEach((pharmacyLoc) =>
      processLocation(pharmacyLoc, mapRef, markersRef, locationCoordinates)
    );
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Error fetching data: ', error);
    }
  }
};

export default fetchGeocodingApi;
