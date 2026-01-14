/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Google Maps global types
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: any;
        Map?: any;
        Marker?: any;
        Geocoder?: any;
        event?: any;
        Animation?: any;
      };
    };
    [key: string]: any; // Allow dynamic properties for Google Maps callbacks
  }
}

// This empty export makes this file a module
export {};
