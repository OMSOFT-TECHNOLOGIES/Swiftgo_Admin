/// <reference types="../types/env" />
import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { googleMapsLoader } from '../utils/googleMapsLoader';

interface GooglePlacesInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void;
  onMapClick?: () => void;
  className?: string;
}

export function GooglePlacesInput({ 
  id, 
  placeholder, 
  value, 
  onChange, 
  onMapClick,
  className = "" 
}: GooglePlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  // Sync local value with prop value when it changes externally
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value || '');
      console.log(`${id} external value change:`, value);
    }
  }, [value, localValue, id]);

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

  useEffect(() => {
    if (isGoogleLoaded && inputRef.current && window.google?.maps?.places) {
      // Cleanup existing autocomplete
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }

      // Initialize autocomplete
      if (window.google.maps.places?.Autocomplete) {
        try {
          autocompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ['establishment', 'geocode'],
              fields: ['place_id', 'geometry', 'name', 'formatted_address', 'vicinity', 'address_components'],
              componentRestrictions: { country: 'gh' }, // Restrict to Ghana
            }
          );

          console.log(`${id} autocomplete initialized`);
        } catch (error) {
          console.error(`${id} autocomplete initialization failed:`, error);
          return;
        }

        try {
          // Listen for place selection - simplified approach
          const placeChangedListener = autocompleteRef.current.addListener('place_changed', () => {
            // Small delay to ensure place data is fully loaded
            setTimeout(() => {
              const place = autocompleteRef.current.getPlace();
              
              console.log(`${id} place_changed event fired, place:`, place);
              
              // Check if we have valid place data
              if (!place || !place.geometry || !place.geometry.location) {
                console.log(`${id} invalid place data, skipping`);
                return;
              }
              
              // Extract coordinates
              let lat = null;
              let lng = null;
              
              if (place.geometry.location) {
                lat = typeof place.geometry.location.lat === 'function' 
                  ? place.geometry.location.lat() 
                  : place.geometry.location.lat;
                lng = typeof place.geometry.location.lng === 'function' 
                  ? place.geometry.location.lng() 
                  : place.geometry.location.lng;
              }
              
              // Get address
              let selectedAddress = place.formatted_address || place.name || place.vicinity || '';
              
              if (selectedAddress && lat !== null && lng !== null) {
                console.log(`${id} place selected successfully:`, { 
                  address: selectedAddress, 
                  coordinates: { lat, lng } 
                });
                
                // Update local value immediately
                setLocalValue(selectedAddress);
                
                // Call onChange to update parent state
                onChange(selectedAddress, { lat, lng });
              } else {
                console.log(`${id} place selection failed - missing data:`, {
                  address: selectedAddress,
                  lat,
                  lng,
                  place
                });
              }
            }, 50); // Small delay to ensure place data is ready
          });

          return () => {
            if (placeChangedListener && window.google?.maps?.event) {
              window.google.maps.event.removeListener(placeChangedListener);
            }
          };
        } catch (error) {
          console.error(`${id} listener attachment failed:`, error);
        }
      }
    }
  }, [isGoogleLoaded, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    console.log(`${id} manual input change:`, newValue);
    
    // Update local value for immediate UI feedback
    setLocalValue(newValue);
    
    // Call onChange for manual typing (without coordinates)
    onChange(newValue);
  };

  const handleMapClick = () => {
    if (onMapClick) {
      setIsLoading(true);
      onMapClick();
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      <Input
        ref={inputRef}
        id={id}
        placeholder={placeholder}
        value={localValue}
        onChange={handleInputChange}
        className="flex-1"
        disabled={!isGoogleLoaded}
      />
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleMapClick}
        disabled={isLoading || !isGoogleLoaded}
        type="button"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}