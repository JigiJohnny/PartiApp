import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { databases, account } from '../appwriteConfig';
import { Permission, ID } from 'appwrite';

const DATABASE_ID = '685ff7d300149bd01e90';
const PREFS_COLLECTION_ID = '685ff804002f2c6e4df9';
const PARTICIPATIONS_COLLECTION_ID = '68600db0000187a5eda8';

const CATEGORIES = ['Sport', 'Kultur', 'Outdoor'];

export default function ProfileScreen({ setUser }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [prefsDocId, setPrefsDocId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  const fetchData = async () => {
    try {
      const user = await account.get();
      setIsGuest(false);

      const prefsResult = await databases.listDocuments(DATABASE_ID, PREFS_COLLECTION_ID);
      const myPrefs = prefsResult.documents.find(d =>
        d.$permissions.includes(`read("user:${user.$id}")`)
      );
      if (myPrefs) {
        setSelectedCategories(myPrefs.categories);
        setPrefsDocId(myPrefs.$id);
      }

      const partResult = await databases.listDocuments(DATABASE_ID, PARTICIPATIONS_COLLECTION_ID);
      const myEntries = partResult.documents.filter(p => p.userId === user.$id);
      setParticipations(myEntries);

    } catch (err) {
      console.log('Keine Daten gefunden oder Gast:', err.message);
      setIsGuest(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const savePreferences = async () => {
    if (isGuest) {
      Alert.alert('Bitte anmelden', 'Du musst eingeloggt sein, um deine Interessen zu speichern.');
      return;
    }

    setSaving(true);
    try {
      const user = await account.get();
      if (prefsDocId) {
        await databases.updateDocument(
          DATABASE_ID,
          PREFS_COLLECTION_ID,
          prefsDocId,
          {
            categories: selectedCategories,
            feedback: 0,
            favorites: "none"
          }
        );
      } else {
        const newDoc = await databases.createDocument(
          DATABASE_ID,
          PREFS_COLLECTION_ID,
          ID.unique(),
          {
            userId: user.$id,
            categories: selectedCategories,
            feedback: 0,
            favorites: "none"
          },
          [
            Permission.read(`user:${user.$id}`),
            Permission.update(`user:${user.$id}`),
            Permission.delete(`user:${user.$id}`),
            Permission.write(`user:${user.$id}`)
          ]
        );
        setPrefsDocId(newDoc.$id);
      }
      Alert.alert('Gespeichert', 'Deine Interessen wurden gespeichert.');
    } catch (err) {
      console.error(err);
      Alert.alert('Fehler', 'Speichern nicht möglich: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (err) {
      console.log('Fehler beim Abmelden:', err.message);
      Alert.alert('Fehler', err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isGuest ? (
          <>
            <Text style={styles.sectionTitle}>👋 Hallo Gast!</Text>
            <Text style={{ textAlign: 'center', marginVertical: 20 }}>
              Melde dich an, um deine Interessen und Beiträge zu sehen.
            </Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setUser(null)}
            >
              <Text style={styles.saveButtonText}>Jetzt anmelden</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>🎯 Deine Interessen</Text>
            <View style={styles.divider} />

            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category) && styles.categoryButtonActive
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategories.includes(category) && styles.categoryTextActive
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={savePreferences}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Speichern...' : 'Interessen speichern'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { marginTop: 40 }]}>📝 Meine Beiträge</Text>
            <View style={styles.divider} />

            {participations.length > 0 ? (
              participations.map((p) => (
                <View key={p.$id} style={styles.card}>
                  {p.vote ? <Text style={styles.cardText}>✅ Stimme: {p.vote}</Text> : null}
                  {p.feedback ? <Text style={styles.cardText}>💬 Feedback: {p.feedback}</Text> : null}
                  {p.topic ? <Text style={styles.cardText}>💡 Idee: {p.topic}</Text> : null}
                  <Text style={styles.date}>{new Date(p.$createdAt).toLocaleString()}</Text>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: 'center', color: '#666', marginTop: 10 }}>
                Keine Beiträge gefunden.
              </Text>
            )}

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: '#E53935', marginTop: 30 }]}
              onPress={handleLogout}
            >
              <Text style={styles.saveButtonText}>Abmelden</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 20
  },
  categoryButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    marginBottom: 10
  },
  categoryButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2'
  },
  categoryText: { textAlign: 'center', fontSize: 16 },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  saveButtonText: { textAlign: 'center', color: '#fff', fontSize: 16 },
  buttonDisabled: { opacity: 0.6 },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  cardText: { fontSize: 15, marginBottom: 5 },
  date: {
    marginTop: 5,
    color: '#888',
    fontSize: 12,
    textAlign: 'right'
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
