import './index.css';
import { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { addPopupToMarker } from './utils/addPopupToMarker';
import fetchGeocodingApi from './lib/fetchGeocodingApi';

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

  const locationProximity = useMemo(
    () => [mapState.lng, mapState.lat],
    [mapState.lat, mapState.lng]
  );

  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
    });

    const currentMarker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat(locationProximity)
      .addTo(map);

    addPopupToMarker(
      currentMarker,
      { place_name: 'Concord, North Carolina, United States' },
      map
    );

    map.on('move', () => {
      setMapState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    mapRef.current = map;
  }, [mapState, locationProximity]);

  useEffect(() => {
    const abortController = new AbortController();

    if (mapRef.current) {
      fetchGeocodingApi(
        mapRef.current,
        locationProximity,
        mapboxgl.accessToken,
        markersRef,
        abortController
      );
    }

    return () => {
      abortController.abort();
    };
  }, [locationProximity]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const addGeocoderControl = () => {
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: true,
      });

      map.addControl(geocoder);
      geocoderRef.current = geocoder;
    };

    const addGeolocateControl = () => {
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

    map.on('load', () => {
      if (!geocoderRef.current && !geolocateRef.current) {
        addGeocoderControl();
        addGeolocateControl();
      }
    });
  }, []);

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
