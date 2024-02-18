export const createCustomMarker = (icon) => {
  const el = document.createElement('div');
  el.className = 'custom-marker';
  el.style.backgroundImage = `url(${icon})`;

  return el;
};
