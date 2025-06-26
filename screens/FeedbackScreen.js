import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

export default function FeedbackScreen({ navigation }) {
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (feedbackType) => {
    setSubmitted(true);
    Alert.alert('Danke für dein Feedback!', `Du hast ausgewählt: ${feedbackType}`);
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wie hat dir das Angebot gefallen?</Text>

      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button title="👍 Super!" onPress={() => handleFeedback('👍')} color="#4CAF50" />
        </View>
        <View style={styles.button}>
          <Button title="😐 Ganz okay" onPress={() => handleFeedback('😐')} color="#FFC107" />
        </View>
        <View style={styles.button}>
          <Button title="👎 Nicht so gut" onPress={() => handleFeedback('👎')} color="#F44336" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 20 },
  buttonRow: { flexDirection: 'column', gap: 15 },
  button: { marginBottom: 10 },
});
