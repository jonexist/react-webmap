import mapboxgl from 'mapbox-gl';
import { addPopupEvents } from '../utils/addPopupEvents';

export const addPopupToMarker = (marker, pharmacyLoc, map, distance) => {
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setText(
      `${pharmacyLoc.place_name}` +
        (distance ? `\nDistance: ${distance.toFixed(2)} km` : '')
    )
    .addTo(map);

  addPopupEvents(marker, popup, map);
};
