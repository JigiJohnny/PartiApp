import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { databases, account } from '../appwriteConfig';
import { Permission } from 'appwrite';

export default function FavoritesScreen({ route, navigation }) {
  const { offer } = route.params;

  const saveFavorite = async () => {
    try {
      const user = await account.get();

      await databases.createDocument(
        '685ff7d300149bd01e90',  // deine DB ID
        '685ff804002f2c6e4df9',  // preferences Collection ID
        'unique()',
        {
          categories: [],       // leer, da hier nicht wichtig
          feedback: 0,           // neutral, default
          favorites: offer.title // speichere Titel als Favorit
        },
        [
          Permission.read(`user:${user.$id}`),
          Permission.update(`user:${user.$id}`),
          Permission.delete(`user:${user.$id}`),
          Permission.write(`user:${user.$id}`)
        ]
      );

      Alert.alert('Gespeichert', `${offer.title} wurde zu deinen Favoriten hinzugefügt!`);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Fehler', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Willst du {offer.title} als Favorit speichern?</Text>
      <Button title="Als Favorit speichern ❤️" onPress={saveFavorite} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 18, textAlign: 'center', marginBottom: 20 }
});
