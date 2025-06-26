import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// Uncomment these when you enable Firebase auth
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebaseConfig';

const ENABLE_AUTH = false; // toggle this when you add Firebase auth back

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    if (!ENABLE_AUTH) {
      Alert.alert('Info', 'Authentication is currently disabled.');
      return;
    }
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      Alert.alert('Fehler', error.message);
    }
  };

  // New helper to navigate to Home screen
  const goToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? 'Registrieren' : 'Anmelden'}</Text>
      <TextInput
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={isRegister ? 'Registrieren' : 'Anmelden'} onPress={handleAuth} />
      <Text style={styles.switchText} onPress={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Schon registriert? Jetzt anmelden!' : 'Noch kein Konto? Jetzt registrieren!'}
      </Text>

      {/* New button to manually navigate to Home */}
      <View style={{ marginTop: 20 }}>
        <Button title="Go to Home (skip auth)" onPress={goToHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  switchText: {
    marginTop: 10,
    textAlign: 'center',
    color: 'blue',
  },
});