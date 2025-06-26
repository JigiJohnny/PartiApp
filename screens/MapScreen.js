import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
    <View style={styles.container}>
      <ScrollView horizontal style={styles.categoryBar} contentContainerStyle={{ paddingHorizontal: 10 }}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <MapView
        style={StyleSheet.absoluteFillObject}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryBar: {
    position: 'absolute',
    top: 10,
    zIndex: 10,
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  categoryButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});