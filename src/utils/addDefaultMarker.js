import mapboxgl from 'mapbox-gl';
import { addPopupToMarker } from './addPopupToMarker';

const addDefaultMarker = (map, locationProximity) => {
  const currentMarker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(locationProximity)
    .addTo(map);

  addPopupToMarker(
    currentMarker,
    { place_name: 'Concord, North Carolina, United States' },
    map
  );
};

export default addDefaultMarker;
