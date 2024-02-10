import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import './index.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const App = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(1.5);
  
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  
    map.current.on('load', () => {
      map.current.addControl(
        new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: true,
        })
      );
  
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      });
  
      map.current.addControl(geolocate);
  
      geolocate.on('geolocate', event => {
        const lon = event.coords.longitude;
        const lat = event.coords.latitude;
        const position = [lon, lat];
        new mapboxgl.Marker().setLngLat(position).addTo(map.current);
      });
  
      // Trigger the geolocate control when it starts tracking the user's location
      geolocate.trigger();
    });
  
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
      <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default App;