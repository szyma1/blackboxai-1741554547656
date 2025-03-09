import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import LocationService from '../services/locationService';

export default function HistoryScreen() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    loadLocationHistory();
  }, []);

  const loadLocationHistory = async () => {
    try {
      const history = await LocationService.getLocationHistory();
      setLocations(history);
    } catch (error) {
      console.error('Error loading location history:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLocationItem = ({ item }) => {
    const date = new Date(item.timestamp);
    return (
      <TouchableOpacity
        style={[
          styles.locationItem,
          selectedLocation?.timestamp === item.timestamp && styles.selectedItem,
        ]}
        onPress={() => setSelectedLocation(item)}
      >
        <View style={styles.locationInfo}>
          <Text style={styles.locationTime}>
            {date.toLocaleTimeString()}
          </Text>
          <Text style={styles.locationDate}>
            {date.toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.locationCoords}>
          <Text style={styles.coordsText}>
            Lat: {item.latitude.toFixed(4)}
          </Text>
          <Text style={styles.coordsText}>
            Long: {item.longitude.toFixed(4)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={selectedLocation ? {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          } : {
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
            />
          )}
        </MapView>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.title}>Location History</Text>
        {locations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No location history available</Text>
          </View>
        ) : (
          <FlatList
            data={locations}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.timestamp.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: Dimensions.get('window').height * 0.4,
  },
  map: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedItem: {
    backgroundColor: '#E0E7FF',
    borderColor: '#4F46E5',
    borderWidth: 1,
  },
  locationInfo: {
    flex: 1,
  },
  locationTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  locationDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  locationCoords: {
    alignItems: 'flex-end',
  },
  coordsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
