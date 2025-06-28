import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { databases, account } from '../appwriteConfig';
import { Permission } from 'appwrite';
import { styles } from '../styling/FeedbackScreen.style';


export default function FeedbackScreen({ route, navigation }) {
  const { offer } = route.params;

  const sendFeedback = async (value) => {
    try {
      const user = await account.get();

      await databases.createDocument(
        '685ff7d300149bd01e90',
        '685ff804002f2c6e4df9',
        'unique()',
        {
          categories: [],
          feedback: value, // 1 = 👍, 0 = 😐, -1 = 👎
          favorites: "none"
        },
        [
          Permission.read(`user:${user.$id}`),
          Permission.update(`user:${user.$id}`),
          Permission.delete(`user:${user.$id}`),
          Permission.write(`user:${user.$id}`)
        ]
      );

      Alert.alert('Danke!', 'Dein Feedback wurde gespeichert.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Fehler', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Wie hat dir {offer?.title || 'dieses Angebot'} gefallen?
      </Text>

      <Button title="👍 Super!" onPress={() => sendFeedback(1)} />
      <Button title="😐 Ganz okay" onPress={() => sendFeedback(0)} />
      <Button title="👎 Nicht so gut" onPress={() => sendFeedback(-1)} />
    </View>
  );
}

/*
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { fontSize: 20, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
});
*/