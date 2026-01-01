import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Rider } from '../types/auth';

// You'll need to get a Mapbox access token from https://account.mapbox.com/
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

interface RiderWithLocation extends Rider {
  // This interface is now just extending Rider since location is part of Rider type
  current_order?: string;
}

interface MapboxMapProps {
  riders: Rider[];
  selectedRider: string | null;
  onRiderSelect: (riderId: string) => void;
  className?: string;
}

export function MapboxMap({ riders, selectedRider, onRiderSelect, className }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Add fallback locations for riders without GPS data (for development/testing)
  const addFallbackLocations = (riders: Rider[]): RiderWithLocation[] => {
    const accraLocations = [
      { latitude: 5.6037, longitude: -0.1870 }, // Accra Central
      { latitude: 5.5502, longitude: -0.2174 }, // Kaneshie
      { latitude: 5.6691, longitude: -0.0266 }, // East Legon
      { latitude: 5.5850, longitude: -0.2420 }, // Dansoman
      { latitude: 5.6300, longitude: -0.1600 }, // Osu
      { latitude: 5.5800, longitude: -0.2000 }, // Tema Station
      { latitude: 5.6200, longitude: -0.1200 }, // Airport
      { latitude: 5.5400, longitude: -0.2300 }, // Mallam
    ];

    return riders.map((rider, index) => {
      // Check for GPS coordinates in the new backend format
      const hasRealLocation = rider.current_location?.coordinates?.latitude && 
                              rider.current_location?.coordinates?.longitude;

      let finalLocation;
      if (hasRealLocation) {
        finalLocation = {
          latitude: rider.current_location!.coordinates!.latitude,
          longitude: rider.current_location!.coordinates!.longitude
        };
      } else {
        // Use fallback location if no GPS coordinates
        finalLocation = accraLocations[index % accraLocations.length];
      }

      return {
        ...rider,
        location: finalLocation,
        current_order: rider.availability ? undefined : `ORD-${String(index + 1).padStart(3, '0')}`
      };
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Only initialize if we have a valid token
    if (MAPBOX_TOKEN === 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example' || !MAPBOX_TOKEN) {
      // Show message about Mapbox token
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
            <div class="text-center p-6">
              <div class="text-gray-400 mb-2">
                <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Map Unavailable</h3>
              <p class="text-sm text-gray-600 mb-4">
                Please add your Mapbox access token to display the interactive map.
              </p>
              <p class="text-xs text-gray-500">
                Set VITE_MAPBOX_TOKEN in your environment variables
              </p>
            </div>
          </div>
        `;
      }
      return;
    }

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map centered on Accra, Ghana
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-0.1870, 5.6037], // Accra coordinates
      zoom: 11
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when riders change
  useEffect(() => {
    if (!map.current || MAPBOX_TOKEN === 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example' || !MAPBOX_TOKEN) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Add fallback locations to riders when needed
    const ridersWithLocations = addFallbackLocations(riders);

    // Add markers for each rider
    ridersWithLocations.forEach((rider: RiderWithLocation) => {
      if (!rider.location?.latitude || !rider.location?.longitude) return;

      // Find the original rider to check if location is real or fallback
      const originalRider = riders.find(r => r.id === rider.id);
      const hasRealLocation = originalRider?.current_location?.coordinates?.latitude && 
                              originalRider?.current_location?.coordinates?.longitude;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'rider-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Set marker color based on rider status
      const getMarkerColor = (status: string) => {
        switch (status?.toUpperCase()) {
          case 'ACTIVE':
          case 'ONLINE':
            return '#10b981'; // green
          case 'BUSY':
          case 'DELIVERING':
            return '#3b82f6'; // blue
          case 'OFFLINE':
          case 'SUSPENDED':
            return '#6b7280'; // gray
          default:
            return '#f59e0b'; // yellow
        }
      };

      el.style.backgroundColor = getMarkerColor(rider.status);

      // Add pulse animation for selected rider
      if (selectedRider === rider.id) {
        el.style.animation = 'pulse 2s infinite';
        el.style.transform = 'scale(1.2)';
      }

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([rider.location.longitude, rider.location.latitude])
        .addTo(map.current!);

      // Add click event
      el.addEventListener('click', () => {
        onRiderSelect(rider.id);
      });

      // Create popup with rider info
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="p-2">
          <div class="font-semibold">${rider.name}</div>
          <div class="text-sm text-gray-600">Status: ${rider.status}</div>
          <div class="text-sm text-gray-600">Email: ${rider.email}</div>
          <div class="text-sm text-gray-600">Deliveries: ${rider.performance?.completed_deliveries || 0}</div>
          ${rider.current_order ? `<div class="text-sm text-blue-600">Order: ${rider.current_order}</div>` : ''}
          ${originalRider?.current_location?.address ? `<div class="text-sm text-green-600">Location: ${originalRider.current_location.address}</div>` : ''}
          <div class="text-xs text-gray-500 mt-1">
            ${hasRealLocation ? 'Live GPS Location' : 'Fallback Location'}
          </div>
        </div>
      `);

      marker.setPopup(popup);

      // Show popup on hover
      el.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });

      markers.current[rider.id] = marker;
    });
  }, [riders, selectedRider, onRiderSelect]);

  // Center map on selected rider
  useEffect(() => {
    if (!map.current || !selectedRider || MAPBOX_TOKEN === 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example' || !MAPBOX_TOKEN) return;

    const ridersWithLocations = addFallbackLocations(riders);
    const rider = ridersWithLocations.find((r: RiderWithLocation) => r.id === selectedRider);
    if (rider?.location?.latitude && rider?.location?.longitude) {
      map.current.flyTo({
        center: [rider.location.longitude, rider.location.latitude],
        zoom: 15,
        duration: 1000
      });
    }
  }, [selectedRider, riders]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Add CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        .rider-marker {
          transition: transform 0.2s ease;
        }
        .rider-marker:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
