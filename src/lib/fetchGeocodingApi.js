import mapboxgl from 'mapbox-gl';
import icon from '../assets/location-pin.png';
import { createCustomMarker } from '../utils/createCustomMarker';
import { addPopupToMarker } from '../utils/addPopupToMarker';

const constructApiUrl = (lng, lat, radius, placeType, token) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeType}.json?proximity=${lng},${lat}&radius=${radius}&access_token=${token}`;

const processLocation = (pharmacyLoc, map, markersRef) => {
  const { coordinates } = pharmacyLoc.geometry;

  const el = createCustomMarker(icon);

  const marker = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map);

  markersRef.current.push(marker);

  addPopupToMarker(marker, pharmacyLoc, map);
};

const fetchGeocodingApi = async (
  mapRef,
  locationCoordinates,
  token,
  markersRef,
  abortController
) => {
  const [lng, lat] = locationCoordinates;
  const radius = 20000;
  const placeType = 'pharmacy';

  const url = constructApiUrl(lng, lat, radius, placeType, token);

  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];

  try {
    const response = await fetch(url, { signal: abortController.signal });
    const data = await response.json();

    data.features.forEach((pharmacyLoc) =>
      processLocation(pharmacyLoc, mapRef, markersRef)
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
