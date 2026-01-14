/// <reference types="../types/env" />
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { googleMapsLoader } from '../utils/googleMapsLoader';

interface GoogleMapSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (address: string, coordinates: { lat: number; lng: number }) => void;
  title: string;
  initialValue?: string;
}

export function GoogleMapSelector({ 
  isOpen, 
  onClose, 
  onLocationSelect, 
  title,
  initialValue = ""
}: GoogleMapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const [searchValue, setSearchValue] = useState(initialValue);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Default location (Accra, Ghana)
  const defaultLocation = { lat: 5.6037, lng: -0.1870 };

  useEffect(() => {
    const initializeMap = async () => {
      if (isOpen) {
        try {
          await googleMapsLoader.load();
          
          if (window.google?.maps && mapRef.current) {
            // Initialize map
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
              center: defaultLocation,
              zoom: 13,
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: false,
            });

            // Initialize geocoder
            if (window.google.maps.Geocoder) {
              geocoderRef.current = new window.google.maps.Geocoder();
            }

            // Add click listener to map
            mapInstanceRef.current.addListener('click', (event: any) => {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              
              setSelectedCoords({ lat, lng });
              updateMarker({ lat, lng });
              reverseGeocode({ lat, lng });
            });
          }
        } catch (error) {
          console.error('Failed to initialize Google Maps:', error);
        }
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [isOpen]);

  const updateMarker = (coords: { lat: number; lng: number }) => {
    if (!window.google?.maps) return;
    
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    markerRef.current = new window.google.maps.Marker({
      position: coords,
      map: mapInstanceRef.current,
      title: 'Selected Location',
      animation: window.google.maps.Animation?.DROP,
    });

    mapInstanceRef.current?.panTo(coords);
  };

  const reverseGeocode = async (coords: { lat: number; lng: number }) => {
    if (!geocoderRef.current || !window.google?.maps) return;

    try {
      const response = await new Promise((resolve, reject) => {
        geocoderRef.current.geocode(
          { location: coords },
          (results: any[], status: string) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0]);
            } else {
              reject(status);
            }
          }
        );
      });

      const address = (response as any).formatted_address;
      setSelectedAddress(address);
      setSearchValue(address);
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      setSelectedAddress(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim() || !geocoderRef.current || !window.google?.maps) return;

    setIsSearching(true);
    try {
      const response = await new Promise((resolve, reject) => {
        geocoderRef.current.geocode(
          { 
            address: searchValue,
            componentRestrictions: { country: 'GH' }
          },
          (results: any[], status: string) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0]);
            } else {
              reject(status);
            }
          }
        );
      });

      const result = response as any;
      const coords = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng()
      };

      setSelectedCoords(coords);
      setSelectedAddress(result.formatted_address);
      updateMarker(coords);
    } catch (error) {
      console.error('Geocoding failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleConfirm = () => {
    if (selectedCoords && selectedAddress) {
      onLocationSelect(selectedAddress, selectedCoords);
      onClose();
    }
  };

  const handleCancel = () => {
    setSearchValue(initialValue);
    setSelectedAddress('');
    setSelectedCoords(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex space-x-2">
            <Input
              placeholder="Search for a location..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchValue.trim()}
              size="sm"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Map Container */}
          <div 
            ref={mapRef} 
            className="w-full h-96 rounded-lg border border-gray-300"
            style={{ minHeight: '400px' }}
          />

          {/* Selected Address Display */}
          {selectedAddress && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Selected Location:</span>
              </div>
              <p className="text-sm text-green-700 mt-1">{selectedAddress}</p>
              {selectedCoords && (
                <p className="text-xs text-green-600 mt-1">
                  Coordinates: {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedCoords || !selectedAddress}
              className="bg-green-600 hover:bg-green-700"
            >
              Select This Location
            </Button>
          </div>

          {/* Instructions */}
          <p className="text-sm text-gray-500 text-center">
            Click anywhere on the map to select a location, or use the search bar above.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}