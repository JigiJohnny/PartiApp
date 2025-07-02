import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';

const offers = [
  {
    id: '1',
    title: 'Abenteuer im Park',
    description: 'Schatzsuche im Stadtpark!',
    category: 'Outdoor',
    latitude: 51.5363,
    longitude: 7.2005,
    date: '2025-06-28',
  },
  {
    id: '2',
    title: 'Kinderkino',
    description: 'Filmspaß im Jugendzentrum.',
    category: 'Kultur',
    latitude: 51.5309,
    longitude: 7.2145,
    date: '2025-07-01',
  },
  {
    id: '3',
    title: 'Sport im Freien',
    description: 'Bewegung und Spiele auf dem Bolzplatz.',
    category: 'Sport',
    latitude: 51.5340,
    longitude: 7.2090,
    date: '2025-07-02',
  },
];

const categories = ['Alle', 'Outdoor', 'Kultur', 'Sport'];

export default function MapScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [userLocation, setUserLocation] = useState(null);

  const filteredOffers =
    selectedCategory === 'Alle'
      ? offers
      : offers.filter((o) => o.category === selectedCategory);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 51.5350,
            longitude: 7.2100,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
        >
          {filteredOffers.map((offer) => (
            <Marker
              key={offer.id}
              coordinate={{ latitude: offer.latitude, longitude: offer.longitude }}
            >
              <Callout onPress={() => navigation.navigate('Details', { offer })}>
                <View style={{ maxWidth: 200 }}>
                  <Text style={{ fontWeight: 'bold' }}>{offer.title}</Text>
                  <Text>{offer.description}</Text>
                  <Text style={{ fontStyle: 'italic' }}>{offer.category}</Text>
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

        {/* Chips-Bar über der Map */}
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
