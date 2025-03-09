import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    geofencing: true,
    emergencyAlerts: true,
    trackingInterval: '5',
    geofenceRadius: '100',
    emergencyContact1: '',
    emergencyContact2: '',
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // This is a placeholder for actual implementation
    // In a real app, this would save to storage or an API
    Alert.alert(
      'Success',
      'Settings saved successfully',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => updateSetting('notifications', value)}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Geofencing</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Enable Geofencing</Text>
          <Switch
            value={settings.geofencing}
            onValueChange={(value) => updateSetting('geofencing', value)}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Geofence Radius (meters)</Text>
          <TextInput
            style={styles.input}
            value={settings.geofenceRadius}
            onChangeText={(value) => updateSetting('geofenceRadius', value)}
            keyboardType="numeric"
            placeholder="Enter radius"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Settings</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Emergency Alerts</Text>
          <Switch
            value={settings.emergencyAlerts}
            onValueChange={(value) => updateSetting('emergencyAlerts', value)}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Tracking Interval (minutes)</Text>
          <TextInput
            style={styles.input}
            value={settings.trackingInterval}
            onChangeText={(value) => updateSetting('trackingInterval', value)}
            keyboardType="numeric"
            placeholder="Enter interval"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Primary Contact</Text>
          <TextInput
            style={styles.input}
            value={settings.emergencyContact1}
            onChangeText={(value) => updateSetting('emergencyContact1', value)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Secondary Contact</Text>
          <TextInput
            style={styles.input}
            value={settings.emergencyContact2}
            onChangeText={(value) => updateSetting('emergencyContact2', value)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 8,
    width: 150,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
