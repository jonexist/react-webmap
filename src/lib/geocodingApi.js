import mapboxgl from 'mapbox-gl';
import icon from '../assets/location-pin.png';

const fetchMapBoxApi = async (
  mapRef,
  unCoordinates,
  token,
  markersRef,
  abortController
) => {
  const map = mapRef;
  const [lng, lat] = unCoordinates;
  const radius = 20000;
  const placeType = 'pharmacy';
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${placeType}.json?proximity=${lng},${lat}&radius=${radius}&access_token=${token}`;

  // Remove the previous markers
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];

  try {
    const response = await fetch(url, { signal: abortController.signal });
    const data = await response.json();

    data.features.forEach((pharmacyLoc) => {
      const { coordinates } = pharmacyLoc.geometry;

      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundImage = `url(${icon})`;

      const marker = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map);

      // Add the marker to the markersRef
      markersRef.current.push(marker);

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
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Error fetching data: ', error);
    }
  }
};

export default fetchMapBoxApi;
