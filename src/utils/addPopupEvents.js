export const addPopupEvents = (marker, popup, map) => {
  marker.getElement().addEventListener('mouseenter', () => {
    popup.setLngLat(marker.getLngLat()).addTo(map);
  });

  marker.getElement().addEventListener('mouseleave', () => {
    popup.remove();
  });
};
