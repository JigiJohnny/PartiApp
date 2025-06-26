import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  ActivityIndicator,
} from 'react-native';

const mockOffers = [
  {
    id: '1',
    title: 'Abenteuer im Park',
    description: 'Schatzsuche im Stadtpark!',
    category: 'Outdoor',
    date: '2025-06-28',
  },
  {
    id: '2',
    title: 'Kinderkino',
    description: 'Filmspaß im Jugendzentrum.',
    category: 'Kultur',
    date: '2025-07-01',
  },
  {
    id: '3',
    title: 'Sport im Freien',
    description: 'Spiele und Bewegung auf dem Bolzplatz.',
    category: 'Sport',
    date: '2025-07-02',
  },
];

export default function HomeScreen({ navigation }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuliere asynchrones Laden (z. B. aus lokaler Datei oder API)
    const loadLocalOffers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // künstliche Ladezeit
      setOffers(mockOffers);
      setLoading(false);
    };

    loadLocalOffers();
  }, []);

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
      <Text style={styles.header}>Kinder-Angebote in deiner Stadt</Text>

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
  header: { fontSize: 22, marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'column', marginBottom: 20 },
  button: { marginBottom: 10 },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
  },
  title: { fontWeight: 'bold' },
});
