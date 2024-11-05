import './style.css'

// Get API key from environment
const MAPS_API_KEY = GOOGLE_MAPS_API_KEY;

// Verify API key is available
if (!MAPS_API_KEY) {
  console.error('Google Maps API key is not configured');
}

// Load Google Maps API
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&callback=initMap&libraries=maps,marker&v=beta`;
script.async = true;
script.defer = true;
document.head.appendChild(script);

// Initialize map first
window.initMap = function() {
  const mapElement = document.querySelector('gmp-map');
  
  if (!mapElement) {
    console.error('Map element not found');
    return;
  }

  const sriLankaBounds = {
    north: 9.9,
    south: 5.9,
    east: 82.0,
    west: 79.4
  };

  mapElement.addEventListener('gmp-map-initialized', () => {
    const map = mapElement.innerMap;
    if (!map) {
      console.error('Map not initialized properly');
      return;
    }

    map.setOptions({
      restriction: {
        latLngBounds: sriLankaBounds,
        strictBounds: true
      },
      mapTypeId: 'terrain',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true
    });
  });

  const cities = [
    { name: "Colombo", lat: 6.9271, lng: 79.8612, population: "752,993" },
    { name: "Kandy", lat: 7.2906, lng: 80.6337, population: "125,400" },
    { name: "Galle", lat: 6.0535, lng: 80.2210, population: "93,118" },
    { name: "Jaffna", lat: 9.6615, lng: 80.0255, population: "88,138" },
    { name: "Trincomalee", lat: 8.5874, lng: 81.2152, population: "108,420" }
  ];

  cities.forEach(city => {
    try {
      const marker = document.createElement('gmp-advanced-marker');
      marker.position = { lat: city.lat, lng: city.lng };
      marker.title = `${city.name} - Population: ${city.population}`;
      marker.setAttribute('background', '#FF0000');
      marker.setAttribute('scale', '1.2');
      marker.setAttribute('type', 'circle');

      marker.addEventListener('mouseover', () => {
        marker.setAttribute('scale', '1.5');
      });
      marker.addEventListener('mouseout', () => {
        marker.setAttribute('scale', '1.2');
      });

      mapElement.appendChild(marker);
    } catch (error) {
      console.error(`Error creating marker for ${city.name}:`, error);
    }
  });
};

// Load Google Maps API with error handling
function loadGoogleMapsAPI() {
  if (!MAPS_API_KEY) {
    console.error('Google Maps API key is not defined');
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&callback=initMap&libraries=maps,marker&v=beta`;
  script.async = true;
  script.defer = true;
  
  script.onerror = function() {
    console.error('Failed to load Google Maps API');
  };
  
  document.head.appendChild(script);
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', loadGoogleMapsAPI);