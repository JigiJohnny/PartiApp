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
import mqtt from 'mqtt';
import logo from '../assets/images/PartiApp_Logo.png';
import { styles } from '../styling/HomeScreen.style';
import { databases, account } from '../appwriteConfig';

const { width } = Dimensions.get('window');
const BUTTON_FONT_SIZE = width * 0.035;

const DATABASE_ID = '685ff7d300149bd01e90';
const PREFS_COLLECTION_ID = '685ff804002f2c6e4df9';

export default function HomeScreen({ navigation }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserCoords({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }

        try {
          const user = await account.get();
          const prefsResult = await databases.listDocuments(DATABASE_ID, PREFS_COLLECTION_ID);
          const myPrefs = prefsResult.documents.find(d =>
            d.$permissions.includes(`read("user:${user.$id}")`)
          );
          if (myPrefs) setInterests(myPrefs.categories);
        } catch (err) {
          console.log('⚠️ Kein Login oder keine Interessen:', err.message);
        }
      } catch (err) {
        console.error('Fehler beim Standort:', err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const client = mqtt.connect('ws://192.168.178.38:9001');

    client.on('connect', () => {
      console.log('✅ MQTT verbunden');
      client.subscribe('kinderapp/herne', err => {
        if (!err) console.log('🎉 Subscribed to kinderapp/herne');
      });
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        const scored = data.map(offer => {
          let score = 0;
          if (interests.includes(offer.category)) score += 20;
          if (userCoords) {
            const dist = getDistance(userCoords, {
              latitude: offer.latitude || 0,
              longitude: offer.longitude || 0,
            }) / 1000;
            score -= dist;
          }
          return { ...offer, score };
        });
        scored.sort((a, b) => b.score - a.score);
        setOffers(scored);
        setLoading(false);
      } catch (err) {
        console.error('❌ MQTT JSON Fehler:', err.message);
      }
    });

    return () => client.end();
  }, [interests, userCoords]);

  const formatDistance = (offer) => {
    if (!userCoords || !offer.latitude || !offer.longitude) return '';
    const dist = getDistance(userCoords, {
      latitude: offer.latitude,
      longitude: offer.longitude,
    });
    return dist < 1000 ? `${dist} m entfernt` : `${(dist / 1000).toFixed(1)} km entfernt`;
  };

  const shorten = (text, max) => (text && text.length > max ? text.substring(0, max) + '...' : text);

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
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Details', { offer: item })}
            >
              <Text style={styles.title}>{shorten(item.title, 60)}</Text>
              <Text style={styles.date}>{item.date}</Text>
              {item.location && <Text style={styles.location}>{item.location}</Text>}
              <Text style={styles.description}>{shorten(item.description, 100)}</Text>
              {item.tags?.length > 0 && (
                <View style={styles.tagContainer}>
                  {item.tags.slice(0, 4).map((tag, idx) => (
                    <Text key={idx} style={styles.tag}>{tag}</Text>
                  ))}
                </View>
              )}
              <Text style={styles.distance}>{formatDistance(item)}</Text>
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

/*
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 15 },
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
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontWeight: 'bold', fontSize: width * 0.045, marginBottom: 4 },
  date: { color: '#555', marginBottom: 2 },
  location: { color: '#777', marginBottom: 6 },
  description: { fontSize: 14, color: '#333' },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  tag: {
    backgroundColor: '#2196F3',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    fontSize: 12,
  },
  distance: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#888',
    fontSize: 12,
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
*/