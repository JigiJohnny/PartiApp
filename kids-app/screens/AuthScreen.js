import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { account } from '../appwriteConfig';

export default function AuthScreen({ navigation, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const user = await account.get();
        console.log('✅ Schon eingeloggt als:', user);
        setUser(user);
      } catch (err) {
        console.log('ℹ️ Keine bestehende Session:', err.message);
      } finally {
        setCheckingSession(false);
      }
    };
    checkExistingSession();
  }, []);

  const handleAuth = async () => {
    try {
      if (isRegistering) {
        await account.create('unique()', email, password, name);
        Alert.alert('Registrierung erfolgreich', 'Du kannst dich jetzt einloggen.');
        setIsRegistering(false);
      } else {
        try {
          await account.deleteSession('current');
          console.log('✅ Alte Session entfernt');
        } catch (err) {
          console.log('ℹ️ Keine Session zu löschen:', err.message);
        }

        await account.createEmailPasswordSession(email, password);
        const user = await account.get();
        console.log('✅ Eingeloggt als:', user);
        setUser(user);
        Alert.alert('Login erfolgreich!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Fehler', error.message);
    }
  };

  const skipLogin = () => {
    console.log('⚠️ Login übersprungen (Gastmodus)');
    setUser({ guest: true });
  };

  if (checkingSession) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Prüfe Session...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isRegistering ? 'Registrieren' : 'Login'}
        </Text>

        {isRegistering && (
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        )}

        <TextInput
          placeholder="E-Mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Passwort"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button
          title={isRegistering ? 'Registrieren' : 'Einloggen'}
          onPress={handleAuth}
        />

        <Text
          style={styles.toggleText}
          onPress={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? 'Schon registriert? Jetzt einloggen!'
            : 'Noch kein Konto? Jetzt registrieren!'}
        </Text>

        <TouchableOpacity onPress={skipLogin} style={styles.skipButton}>
          <Text style={styles.skipText}>🚀 Überspringen (ohne Anmeldung)</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  toggleText: {
    marginTop: 15,
    color: '#0066cc',
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 30,
    alignSelf: 'center',
  },
  skipText: {
    color: 'gray',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
