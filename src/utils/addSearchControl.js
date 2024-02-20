import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

const addSearchControl = (map, mapboxAccesstoken, geocoderRef) => {
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxAccesstoken,
    mapboxgl: mapboxgl,
    marker: true,
  });

  map.addControl(geocoder);
  geocoderRef.current = geocoder;
};

export default addSearchControl;
