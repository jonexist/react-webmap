import mapboxgl from 'mapbox-gl';
import { addPopupToMarker } from './addPopupToMarker';

const getUserLocation = (map, geolocateRef) => {
  const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  });

  const marker = new mapboxgl.Marker();

  geolocate.on('geolocate', (e) => {
    const { longitude, latitude } = e.coords;
    marker.setLngLat([longitude, latitude]).addTo(map);
  });

  addPopupToMarker(marker, { place_name: 'Your current location' }, map);

  map.addControl(geolocate);
  geolocateRef.current = geolocate;
};

export default getUserLocation;
