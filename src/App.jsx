// Import necessary dependencies
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import './index.css'

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const App = () => {
  // Create references for the map container and the map itself
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Initialize state for longitude, latitude, and zoom level
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(1.5);
  
  useEffect(() => {
    // If the map is already initialized, don't do anything
    if (map.current) return;

    // Initialize the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  
    // Once the map is loaded, add controls
    map.current.on('load', () => {
      // Add geocoder control
      map.current.addControl(
        new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: true,
        })
      );
  
      // Add a default marker at the location of North Carolina
      new mapboxgl.Marker()
        .setLngLat([-79.3267, 35.5110]) // Longitude and latitude of North Carolina
        .addTo(map.current);

      // Add geolocation control
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      });
  
      map.current.addControl(geolocate);
  
      // When the geolocate control locates the user, add a marker at the user's location
      geolocate.on('geolocate', event => {
        const lon = event.coords.longitude;
        const lat = event.coords.latitude;
        const position = [lon, lat];
        new mapboxgl.Marker().setLngLat(position).addTo(map.current);
      });
  
      // Trigger the geolocate control to start tracking the user's location
      geolocate.trigger();
    });
  
    // When the map is moved, update the longitude, latitude, and zoom level in the state
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  // Render the map container and a sidebar with the current longitude, latitude, and zoom level
  return (
    <div>
      <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

// Export the App component
export default App;