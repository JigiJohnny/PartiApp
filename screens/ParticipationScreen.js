import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Share } from 'react-native';

export default function ParticipationScreen({ navigation }) {
  const [vote, setVote] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [topic, setTopic] = useState('');

  const handleSubmit = () => {
    Alert.alert('Danke!', 'Dein Beitrag wurde übermittelt.');
    setVote(null);
    setFeedback('');
    setTopic('');
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

      <Button title="Beitrag abschicken" onPress={handleSubmit} />
      <View style={{ height: 20 }} />
      <Button title="🔗 Veranstaltung teilen" onPress={handleShare} />
    </View>
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