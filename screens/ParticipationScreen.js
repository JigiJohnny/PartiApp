import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
  Share,
  Keyboard
} from 'react-native';
import { account, databases } from '../appwriteConfig';
import { ID, Permission } from 'appwrite';

const DATABASE_ID = '685ff7d300149bd01e90';
const PARTICIPATIONS_COLLECTION_ID = '68600db0000187a5eda8';

export default function ParticipationScreen({ navigation }) {
  const [vote, setVote] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [topic, setTopic] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!vote && !feedback && !topic) {
      Alert.alert('Bitte fülle mindestens ein Feld aus.');
      return;
    }

    setSaving(true);
    try {
      const user = await account.get();

      await databases.createDocument(
        DATABASE_ID,
        PARTICIPATIONS_COLLECTION_ID,
        ID.unique(),
        {
          vote: vote ?? "",
          feedback,
          topic,
          userId: user.$id
        },
        [
          Permission.read(`user:${user.$id}`),
          Permission.update(`user:${user.$id}`),
          Permission.delete(`user:${user.$id}`),
          Permission.write(`user:${user.$id}`)
        ]
      );

      Alert.alert('Danke!', 'Dein Beitrag wurde gespeichert.');
      setVote(null);
      setFeedback('');
      setTopic('');
      navigation.navigate('Profile'); // Direkt ins Profil

    } catch (err) {
      console.error(err);
      Alert.alert('Fehler', 'Konnte nicht gespeichert werden: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Schau dir diese tolle Veranstaltung für Jugendliche in Herne an!',
      });
    } catch (error) {
      Alert.alert('Fehler beim Teilen', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>🎯 Abstimmung: Was findest du am besten?</Text>
        <View style={styles.voteOptions}>
          {['Workshops', 'Sportangebote', 'Digitale Spiele', 'Kreativprojekte'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                vote === option && styles.selectedOption,
              ]}
              onPress={() => setVote(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.header}>📝 Dein Feedback:</Text>
        <TextInput
          placeholder="Was hat dir gefallen? Was fehlt?"
          value={feedback}
          onChangeText={setFeedback}
          multiline
          style={styles.textArea}
        />

        <Text style={styles.header}>💡 Deine Ideen für neue Themen:</Text>
        <TextInput
          placeholder="Was würdest du dir wünschen?"
          value={topic}
          onChangeText={setTopic}
          style={styles.input}
        />

        <Button title={saving ? 'Speichere...' : 'Beitrag abschicken'} onPress={handleSubmit} disabled={saving} />

        <View style={{ height: 20 }} />
        <Button title="🔗 Veranstaltung teilen" onPress={handleShare} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 18,
    marginVertical: 12,
    fontWeight: 'bold',
  },
  voteOptions: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#a5d6a7',
  },
  optionText: {
    fontSize: 16,
  },
  textArea: {
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
});
