// === screens/FeedbackScreen.js ===
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function FeedbackScreen({ navigation }) {
  const [feedbackSent, setFeedbackSent] = useState(false);

  const sendFeedback = () => {
    setFeedbackSent(true);
    Alert.alert('Danke!', 'Dein Feedback wurde gespeichert.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wie hat dir das Angebot gefallen?</Text>
      {!feedbackSent && (
        <>
          <Button title="👍 Super!" onPress={sendFeedback} />
          <Button title="😐 Ganz okay" onPress={sendFeedback} />
          <Button title="👎 Nicht so gut" onPress={sendFeedback} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
});