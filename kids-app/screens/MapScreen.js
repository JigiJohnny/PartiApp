import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import mqtt from 'mqtt';

const categories = ['Alle', 'Outdoor', 'Kultur', 'Sport', 'Medizin', 'Bildung', 'Freizeit'];

export default function MapScreen({ navigation }) {
  const [offers, setOffers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [userLocation, setUserLocation] = useState(null);

  const filteredOffers =
    selectedCategory === 'Alle'
      ? offers
      : offers.filter((o) =>
          (o.category || '').toLowerCase().includes(selectedCategory.toLowerCase())
        );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Standort deaktiviert', 'Bitte erlaube den Standortzugriff.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    const client = mqtt.connect('ws://192.168.178.38:9001');
    client.on('connect', () => {
      console.log('✅ MQTT verbunden');
      client.subscribe('kinderapp/herne', (err) => {
        if (!err) console.log('🎉 Subscribed to kinderapp/herne');
      });
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        setOffers(data);
      } catch (err) {
        console.error('❌ MQTT JSON Fehler:', err.message);
      }
    });

    return () => client.end();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation?.latitude || 51.5350,
            longitude: userLocation?.longitude || 7.2100,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
        >
          {filteredOffers.map((offer, idx) => (
            <Marker
              key={idx}
              coordinate={{
                latitude: offer.latitude || 51.5350,
                longitude: offer.longitude || 7.2100,
              }}
            >
              <Callout onPress={() => navigation.navigate('Details', { offer })}>
                <View style={{ maxWidth: 220 }}>
                  <Text style={{ fontWeight: 'bold' }}>{offer.title}</Text>
                  <Text>{offer.description || offer.allText || ''}</Text>
                  <Text style={{ fontStyle: 'italic' }}>{offer.category || ''}</Text>
                  <Text style={{ color: '#888' }}>{offer.date}</Text>
                  <Text style={{ color: 'blue', marginTop: 5 }}>➤ Details anzeigen</Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Du bist hier"
              pinColor="blue"
            />
          )}
        </MapView>

        <View style={styles.chipContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.chip,
                  selectedCategory === cat && styles.chipActive
                ]}
              >
                <Text style={[
                  styles.chipText,
                  selectedCategory === cat && styles.chipTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  map: { flex: 1 },

  chipContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    paddingVertical: 6,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  chipActive: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
