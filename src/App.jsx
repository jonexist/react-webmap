import './index.css';
import { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import fetchGeocodingApi from './lib/fetchGeocodingApi';
import addSearchControl from './utils/addSearchControl';
import getUserLocation from './utils/getUserLocation';
import addDefaultMarker from './utils/addDefaultMarker';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const App = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const geolocateRef = useRef(null);
  const markersRef = useRef([]);
  const [mapState, setMapState] = useState({
    lng: -80.5801,
    lat: 35.4091,
    zoom: 12,
  });

  // Memoize the locationProximity value to prevent unnecessary re-renders
  const locationProximity = useMemo(
    () => [mapState.lng, mapState.lat],
    [mapState.lat, mapState.lng]
  );

  useEffect(() => {
    // If the map is already initialized, exit early
    if (mapRef.current) return;
    // Initialize a new Mapbox map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
    });
    // Add a default marker to the map at the current location
    addDefaultMarker(map, locationProximity);
    // Update the map state whenever the map moves
    map.on('move', () => {
      setMapState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    // Store the map instance in a ref
    mapRef.current = map;
  }, [mapState, locationProximity]);

  useEffect(() => {
    // If the map is not initialized yet, exit early
    if (!mapRef.current) return;

    const map = mapRef.current;
    // Once the map has loaded, add the search and geolocate controls if they haven't been added yet
    map.on('load', () => {
      if (!geocoderRef.current && !geolocateRef.current) {
        addSearchControl(map, mapboxgl.accessToken, geocoderRef);
        getUserLocation(map, geolocateRef);
      }
    });
  }, []);

  useEffect(() => {
    // Create an AbortController for the fetch request
    const abortController = new AbortController();
    // If the map is initialized, fetch geocoding data
    if (mapRef.current) {
      fetchGeocodingApi(
        mapRef.current,
        locationProximity,
        mapboxgl.accessToken,
        markersRef,
        abortController
      );
    }
    // When the locationProximity changes, abort the fetch request
    return () => {
      abortController.abort();
    };
  }, [locationProximity]);

  return (
    <>
      <div className='sidebar'>
        Longitude: {mapState.lng} | Latitude: {mapState.lat} | Zoom:{' '}
        {mapState.zoom}
      </div>
      <div ref={mapContainerRef} className='map-container' />
    </>
  );
};

export default App;
