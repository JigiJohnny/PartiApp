import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OfferDetailsScreen({ route }) {
  const { offer } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.text}>{offer.description}</Text>
      <Text style={styles.text}>Kategorie: {offer.category}</Text>
      <Text style={styles.text}>Datum: {offer.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 5 },
});
