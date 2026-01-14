// Centralized Google Maps loader to prevent duplicate script loading

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;
  private callbacks: Array<() => void> = [];

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async load(): Promise<void> {
    // If already loaded, return immediately
    if (this.isLoaded && window.google?.maps?.places) {
      return Promise.resolve();
    }

    // If already loading, return the existing promise
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    // If script exists but not fully loaded, wait for it
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript && !window.google?.maps?.places) {
      this.isLoading = true;
      this.loadPromise = new Promise((resolve) => {
        const checkLoaded = () => {
          if (window.google?.maps?.places) {
            this.isLoaded = true;
            this.isLoading = false;
            this.executeCallbacks();
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
      return this.loadPromise;
    }

    // Load the script
    this.isLoading = true;
    this.loadPromise = new Promise((resolve, reject) => {
      try {
        // Remove any existing scripts to prevent conflicts
        const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
        existingScripts.forEach(script => script.remove());

        // Clean up any existing global callbacks
        Object.keys(window).forEach(key => {
          if (key.startsWith('initGoogleMaps_')) {
            delete (window as any)[key];
          }
        });

        const script = document.createElement('script');
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCTziX21pEYzlq_Cm2Q1UZxkGUkLU7HC14';
        
        const callbackName = `initGoogleMaps_${Date.now()}`;
        
        (window as any)[callbackName] = () => {
          this.isLoaded = true;
          this.isLoading = false;
          this.executeCallbacks();
          delete (window as any)[callbackName];
          resolve();
        };
        
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
        script.async = true;
        script.defer = true;
        
        script.onerror = () => {
          this.isLoading = false;
          this.loadPromise = null;
          delete (window as any)[callbackName];
          reject(new Error('Failed to load Google Maps'));
        };
        
        document.head.appendChild(script);
      } catch (error) {
        this.isLoading = false;
        this.loadPromise = null;
        reject(error);
      }
    });

    return this.loadPromise;
  }

  onLoad(callback: () => void): void {
    if (this.isLoaded) {
      callback();
    } else {
      this.callbacks.push(callback);
    }
  }

  private executeCallbacks(): void {
    this.callbacks.forEach(callback => callback());
    this.callbacks = [];
  }

  isGoogleLoaded(): boolean {
    return this.isLoaded && !!window.google?.maps?.places;
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();