import * as Location from 'expo-location';

class LocationService {
  static async requestLocationPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      throw error;
    }
  }

  static async getCurrentLocation() {
    try {
      await this.requestLocationPermissions();
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  static async startLocationTracking(onLocationUpdate) {
    try {
      await this.requestLocationPermissions();
      
      return await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 5, // Update if moved by 5 meters
        },
        onLocationUpdate
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
      throw error;
    }
  }

  static async getLocationHistory() {
    // This is a placeholder for actual implementation
    // In a real app, this would fetch from local storage or an API
    return [
      {
        latitude: 37.7749,
        longitude: -122.4194,
        timestamp: new Date().getTime() - 3600000,
      },
      {
        latitude: 37.7748,
        longitude: -122.4193,
        timestamp: new Date().getTime() - 1800000,
      }
    ];
  }

  static async saveLocationToHistory(location) {
    // This is a placeholder for actual implementation
    // In a real app, this would save to local storage or an API
    try {
      console.log('Saving location to history:', location);
      return true;
    } catch (error) {
      console.error('Error saving location to history:', error);
      throw error;
    }
  }
}

export default LocationService;
