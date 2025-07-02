import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Dimensions, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { styles } from '../styling/OfferDetailsScreen.style';

export default function OfferDetailsScreen({ route, navigation }) {
  const { offer } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      const userCoords = location.coords;
      setUserLocation(userCoords);

      if (offer.latitude && offer.longitude) {
        const dist = Location.getDistance(
          { latitude: offer.latitude, longitude: offer.longitude },
          { latitude: userCoords.latitude, longitude: userCoords.longitude }
        );
        setDistance(dist);
      }
    })();
  }, []);

  const handleFeedback = (type) => {
    Alert.alert('Danke!', `Du hast "${type}" gewählt.`);
    navigation.goBack();
  };

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${offer.latitude},${offer.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.text}>{offer.description}</Text>
      <Text style={styles.text}>Kategorie: {offer.category}</Text>
      <Text style={styles.text}>Datum: {offer.date}</Text>
      {distance && (
        <Text style={styles.text}>
          📍 Ca. {(distance / 1000).toFixed(2)} km von deinem Standort entfernt
        </Text>
      )}

      {offer.latitude && offer.longitude && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: offer.latitude,
            longitude: offer.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{ latitude: offer.latitude, longitude: offer.longitude }}
            title={offer.title}
            description="Tippe für Navigation"
            onCalloutPress={openMaps}
          />
        </MapView>
      )}

      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>Wie findest du dieses Angebot?</Text>
        <View style={styles.buttonGroup}>
          <Button title="👍 Super" onPress={() => handleFeedback('👍')} color="#4CAF50" />
          <Button title="😐 Okay" onPress={() => handleFeedback('😐')} color="#FFC107" />
          <Button title="👎 Schlecht" onPress={() => handleFeedback('👎')} color="#F44336" />
        </View>
      </View>
    </View>
  );
}

/*
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 5 },
  map: {
    width: '100%',
    height: Dimensions.get('window').height * 0.25,
    marginVertical: 20,
    borderRadius: 10,
  },
  feedbackContainer: { marginTop: 10 },
  feedbackTitle: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  buttonGroup: {
    gap: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
*/