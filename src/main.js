import './style.css'

// Safely get the API key
const MAPS_API_KEY = typeof GOOGLE_MAPS_API_KEY !== 'undefined' ? GOOGLE_MAPS_API_KEY : '';

// Debug log (remove in production)
console.log('API Key status:', MAPS_API_KEY ? 'Present' : 'Missing');

const mapConfig = {
  initializeMap: function() {
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
      if (!map) return;

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
  }
};

function loadGoogleMapsAPI() {
  return new Promise((resolve, reject) => {
    if (!MAPS_API_KEY) {
      console.error('Missing API Key. Checking environment:', {
        hasKey: !!GOOGLE_MAPS_API_KEY,
        envVars: Object.keys(import.meta.env)
      });
      reject(new Error('Google Maps API key is not defined'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=maps,marker&v=beta`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));

    document.head.appendChild(script);
  });
}

async function initialize() {
  try {
    await loadGoogleMapsAPI();
    mapConfig.initializeMap();
  } catch (error) {
    console.error('Initialization error:', error);
    // Add visible error message for users
    document.body.innerHTML += `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3>Map loading error</h3>
        <p>Please try refreshing the page. If the problem persists, contact support.</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', initialize);