import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import LocationService from '../services/locationService';

const INITIAL_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function DashboardScreen({ navigation }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const locationSubscription = useRef(null);

  useEffect(() => {
    fetchCurrentLocation();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const fetchCurrentLocation = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      setCurrentLocation(location);
      mapRef.current?.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (err) {
      setError('Unable to get current location');
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const toggleTracking = async () => {
    try {
      if (isTracking) {
        if (locationSubscription.current) {
          locationSubscription.current.remove();
        }
        setIsTracking(false);
      } else {
        const subscription = await LocationService.startLocationTracking(
          (location) => {
            const newLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: location.timestamp,
            };
            setCurrentLocation(newLocation);
            LocationService.saveLocationToHistory(newLocation);
          }
        );
        locationSubscription.current = subscription;
        setIsTracking(true);
      }
    } catch (err) {
      setError('Failed to toggle tracking');
      Alert.alert('Error', 'Failed to toggle location tracking');
    }
  };

  const navigateToHistory = () => {
    navigation.navigate('History');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
      >
        {currentLocation && (
          <>
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Current Location"
            />
            <Circle
              center={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              radius={100}
              fillColor="rgba(79, 70, 229, 0.2)"
              strokeColor="rgba(79, 70, 229, 0.5)"
            />
          </>
        )}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Live Tracking</Text>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isTracking && styles.buttonActive]}
            onPress={toggleTracking}
          >
            <Text style={styles.buttonText}>
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={navigateToHistory}
          >
            <Text style={styles.buttonText}>View History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={navigateToSettings}
          >
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {currentLocation && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Last Updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  error: {
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 100,
  },
  buttonActive: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    color: '#6B7280',
    fontSize: 12,
  },
});
