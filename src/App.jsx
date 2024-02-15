/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import './index.css';
import icon from './assets/location-pin.png';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const App = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const geolocateRef = useRef(null);
  const [mapState, setMapState] = useState({
    lng: -80.5801,
    lat: 35.4091,
    zoom: 13,
  });

  const uncCoordinates = [mapState.lng, mapState.lat];

  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
    });

    const currentMarker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat(uncCoordinates)
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
  }, [mapState]);

  useEffect(() => {
    const fetchData = async () => {
      if (!mapRef.current) return;

      const map = mapRef.current;
      const [lng, lat] = uncCoordinates;
      const radius = 20000;
      const placeType = 'pharmacy';
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeType}.json?proximity=${lng},${lat}&radius=${radius}&access_token=${mapboxgl.accessToken}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        data.features.forEach((pharmacyLoc) => {
          const { coordinates } = pharmacyLoc.geometry;

          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.backgroundImage = `url(${icon})`;

          const marker = new mapboxgl.Marker(el)
            .setLngLat(coordinates)
            .addTo(map);

          const popup = new mapboxgl.Popup({ offset: 25 })
            .setText(pharmacyLoc.place_name)
            .addTo(map);

          marker.getElement().addEventListener('mouseenter', () => {
            popup.setLngLat(marker.getLngLat()).addTo(map);
          });

          marker.getElement().addEventListener('mouseleave', () => {
            popup.remove();
          });
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

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
