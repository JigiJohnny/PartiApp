import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

const mockOffers = [
  {
    id: '1',
    title: 'Abenteuer im Park',
    description: 'Schatzsuche im Stadtpark!',
    category: 'Outdoor',
    date: '2025-06-28',
    latitude: 51.5363,
    longitude: 7.2005,
  },
  {
    id: '2',
    title: 'Kinderkino',
    description: 'Filmspaß im Jugendzentrum.',
    category: 'Kultur',
    date: '2025-07-01',
    latitude: 51.5309,
    longitude: 7.2145,
  },
  {
    id: '3',
    title: 'Sport im Freien',
    description: 'Spiele auf dem Bolzplatz.',
    category: 'Sport',
    date: '2025-07-02',
    latitude: 51.534,
    longitude: 7.209,
  },
];

export default function HomeScreen({ navigation }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    const loadAndSort = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Standort nicht erlaubt – keine Sortierung möglich.');
          setOffers(mockOffers);
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserCoords(coords);

        const sorted = [...mockOffers].sort((a, b) => {
          const distA = getDistance(coords, {
            latitude: a.latitude,
            longitude: a.longitude,
          });
          const distB = getDistance(coords, {
            latitude: b.latitude,
            longitude: b.longitude,
          });
          return distA - distB;
        });

        setOffers(sorted);
      } catch (error) {
        console.error('Fehler bei Standort oder Sortierung:', error);
        setOffers(mockOffers);
      } finally {
        setLoading(false);
      }
    };

    loadAndSort();
  }, []);

  const formatDistance = (offer) => {
    if (!userCoords) return '';
    const dist = getDistance(userCoords, {
      latitude: offer.latitude,
      longitude: offer.longitude,
    });
    if (dist < 1000) return `${dist} m entfernt`;
    return `${(dist / 1000).toFixed(1)} km entfernt`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Lade Angebote...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kinder-Angebote in deiner Nähe 🎈</Text>

      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button
            title="💬 Feedback geben"
            onPress={() => navigation.navigate('Feedback')}
            color="#4CAF50"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="🗳️ Mitmachen & Abstimmen"
            onPress={() => navigation.navigate('Participation')}
            color="#2196F3"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="🗺️ Stadtkarte mit Angeboten"
            onPress={() => navigation.navigate('Map')}
            color="#FF9800"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="👤 Interessen festlegen"
            onPress={() => navigation.navigate('Profile')}
            color="#9C27B0"
          />
        </View>
      </View>

      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Details', { offer: item })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.date}</Text>
            <Text>{item.category}</Text>
            <Text style={styles.distance}>{formatDistance(item)}</Text>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  button: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: { fontWeight: 'bold', fontSize: 18 },
  distance: { marginTop: 4, fontStyle: 'italic', color: '#555' },
});
