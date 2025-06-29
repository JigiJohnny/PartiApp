import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import logo from '../assets/images/PartiApp_Logo.png';
import { databases, account } from '../appwriteConfig';

const { width } = Dimensions.get('window');
const BUTTON_FONT_SIZE = width * 0.035;

const DATABASE_ID = '685ff7d300149bd01e90';
const PREFS_COLLECTION_ID = '685ff804002f2c6e4df9';

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
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Standort holen
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Standort nicht erlaubt');
          setOffers(mockOffers);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserCoords(coords);

        // Interessen laden
        try {
          const user = await account.get();
          const prefsResult = await databases.listDocuments(DATABASE_ID, PREFS_COLLECTION_ID);
          const myPrefs = prefsResult.documents.find(d =>
            d.$permissions.includes(`read("user:${user.$id}")`)
          );
          if (myPrefs) {
            setInterests(myPrefs.categories);
          }
        } catch (err) {
          console.log('⚠️ Kein Login oder keine Interessen:', err.message);
        }

        // Angebote mit Score berechnen
        const scored = mockOffers.map(offer => {
          let score = 0;
          if (interests.includes(offer.category)) score += 20;
          if (userCoords) {
            const dist = getDistance(coords, {
              latitude: offer.latitude,
              longitude: offer.longitude,
            }) / 1000;
            score -= dist; // weiter weg = weniger Punkte
          }
          return { ...offer, score };
        });

        // Sortieren nach Score
        scored.sort((a, b) => b.score - a.score);

        setOffers(scored);
      } catch (err) {
        console.error('Fehler:', err);
        setOffers(mockOffers);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  const FooterButton = ({ emoji, text, onPress, color }) => (
    <TouchableOpacity style={styles.footerButton} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.footerButtonText, { color }]}>{emoji}</Text>
      <Text style={[styles.footerButtonText, { color, marginTop: 2 }]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.header}>Empfohlene Angebote 🎯</Text>

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

        <View style={styles.footer}>
          <FooterButton
            emoji="🗳️"
            text="Mitmachen"
            onPress={() => navigation.navigate('Participation')}
            color="#2196F3"
          />
          <FooterButton
            emoji="🗺️"
            text="Karte"
            onPress={() => navigation.navigate('Map')}
            color="#FF9800"
          />
          <FooterButton
            emoji="👤"
            text="Profil"
            onPress={() => navigation.navigate('Profile')}
            color="#9C27B0"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: {
    width: width * 0.5,
    height: width * 0.2,
    alignSelf: 'center',
    marginVertical: 15,
  },
  header: {
    fontSize: width * 0.06,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  distance: {
    marginTop: 4,
    fontStyle: 'italic',
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  footerButtonText: {
    fontSize: BUTTON_FONT_SIZE,
    textAlign: 'center',
  },
});
