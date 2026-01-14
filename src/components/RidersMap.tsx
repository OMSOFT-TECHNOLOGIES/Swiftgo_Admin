/// <reference types="../types/env" />
import React, { useEffect, useRef, useState } from 'react';
import { googleMapsLoader } from '../utils/googleMapsLoader';

interface RidersMapProps {
  pickupCoordinates: { lat: number; lng: number };
  riders: any[];
  className?: string;
}

export function RidersMap({ pickupCoordinates, riders, className = "" }: RidersMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        await googleMapsLoader.load();
        setIsGoogleLoaded(true);
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
      }
    };

    if (googleMapsLoader.isGoogleLoaded()) {
      setIsGoogleLoaded(true);
    } else {
      loadGoogleMaps();
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (isGoogleLoaded && mapRef.current && window.google?.maps && !mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: pickupCoordinates,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add pickup location marker
      if (window.google?.maps?.Marker) {
        new window.google.maps.Marker({
          position: pickupCoordinates,
          map: mapInstanceRef.current,
          title: 'Pickup Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#059669"/>
              </svg>
            `),
            scaledSize: new (window as any).google.maps.Size(32, 32),
            anchor: new (window as any).google.maps.Point(16, 32)
          }
        });
      }
    }
  }, [isGoogleLoaded, pickupCoordinates]);

  // Update rider markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps?.Marker) return;

    // Clear existing rider markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add rider markers
    riders.forEach((rider, index) => {
      if (rider.coordinates || (rider.latitude && rider.longitude)) {
        const position = rider.coordinates || { 
          lat: rider.latitude, 
          lng: rider.longitude 
        };

        if (window.google?.maps?.Marker) {
          const marker = new window.google.maps.Marker({
            position,
            map: mapInstanceRef.current,
            title: `${rider.name || `Rider ${index + 1}`} - ${rider.distance?.toFixed(1) || '?'}km away`,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#3B82F6"/>
                  <path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
              `),
              scaledSize: new (window as any).google.maps.Size(24, 24),
              anchor: new (window as any).google.maps.Point(12, 12)
            }
          });

          // Add info window
          if (window.google?.maps) {
            const infoWindow = new (window as any).google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${rider.name || `Rider ${index + 1}`}</h3>
                  <p style="margin: 0; font-size: 12px; color: #666;">
                    ${rider.distance ? `${rider.distance.toFixed(1)}km away` : 'Distance unknown'}<br/>
                    Status: ${rider.status || 'Available'}
                    ${rider.phone ? `<br/>Phone: ${rider.phone}` : ''}
                  </p>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current, marker);
            });
          }

          markersRef.current.push(marker);
        }
      }
    });

    // Adjust map bounds to include all markers if riders exist
    if (riders.length > 0 && window.google?.maps) {
      const bounds = new (window as any).google.maps.LatLngBounds();
      bounds.extend(pickupCoordinates);
      
      riders.forEach(rider => {
        if (rider.coordinates || (rider.latitude && rider.longitude)) {
          const position = rider.coordinates || { 
            lat: rider.latitude, 
            lng: rider.longitude 
          };
          bounds.extend(position);
        }
      });

      mapInstanceRef.current.fitBounds(bounds);
      
      // Don't zoom too close
      if (window.google?.maps?.event) {
        const listener = window.google.maps.event.addListenerOnce(mapInstanceRef.current, 'bounds_changed', () => {
          if (mapInstanceRef.current.getZoom() > 15) {
            mapInstanceRef.current.setZoom(15);
          }
        });
      }
    }
  }, [riders, pickupCoordinates]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg bg-gray-100"
        style={{ minHeight: '256px' }}
      />
      
      {!isGoogleLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}