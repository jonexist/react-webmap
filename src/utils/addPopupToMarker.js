import mapboxgl from 'mapbox-gl';
import { addPopupEvents } from '../utils/addPopupEvents';

export const addPopupToMarker = (marker, pharmacyLoc, map) => {
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setText(pharmacyLoc.place_name)
    .addTo(map);

  addPopupEvents(marker, popup, map);
};
