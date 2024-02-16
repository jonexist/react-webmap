import './index.css';
import { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import geocodingApi from './lib/geocodingApi';

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

  const unCoordinates = useMemo(
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
      .setLngLat(unCoordinates)
      .addTo(map);

    const currentPopup = new mapboxgl.Popup({ offset: 20 }).setText(
      'Concord, North Carolina, United States'
    );

    currentMarker.getElement().addEventListener('mouseenter', () => {
      currentPopup.setLngLat(currentMarker.getLngLat()).addTo(map);
    });

    currentMarker.getElement().addEventListener('mouseleave', () => {
      currentPopup.remove();
    });

    map.on('move', () => {
      setMapState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    mapRef.current = map;
  }, [mapState, unCoordinates]);

  useEffect(() => {
    const abortController = new AbortController();

    if (mapRef.current) {
      geocodingApi(
        mapRef.current,
        unCoordinates,
        mapboxgl.accessToken,
        markersRef,
        abortController
      );
    }

    return () => {
      abortController.abort();
    };
  }, [unCoordinates]);

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

      // Create a marker with no location, to be added on 'geolocate' event
      const marker = new mapboxgl.Marker();

      geolocate.on('geolocate', (e) => {
        // Set the marker location to the user's location
        const { longitude, latitude } = e.coords;
        marker.setLngLat([longitude, latitude]).addTo(map);
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        'Your current location'
      );

      marker.getElement().addEventListener('mouseenter', () => {
        popup.setLngLat(marker.getLngLat()).addTo(map);
      });

      marker.getElement().addEventListener('mouseleave', () => {
        popup.remove();
      });

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
    <div>
      <div className='sidebar'>
        Longitude: {mapState.lng} | Latitude: {mapState.lat} | Zoom:{' '}
        {mapState.zoom}
      </div>
      <div ref={mapContainerRef} className='map-container' />
    </div>
  );
};

export default App;
