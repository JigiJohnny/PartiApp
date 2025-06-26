import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';

const allCategories = ['Sport', 'Kreativ', 'Outdoor', 'Technik', 'Kultur'];

export default function ProfileScreen({ navigation }) {
  const [selected, setSelected] = useState([]);

  const toggleCategory = (category) => {
    if (selected.includes(category)) {
      setSelected(selected.filter((item) => item !== category));
    } else {
      setSelected([...selected, category]);
    }
  };

  const savePreferences = () => {
    // TODO: Speichern z. B. in AsyncStorage oder Firebase
    Alert.alert('Gespeichert!', `Deine Interessen: ${selected.join(', ')}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wähle deine Interessen</Text>

      <View style={styles.categoryList}>
        {allCategories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => toggleCategory(category)}
            style={[
              styles.categoryButton,
              selected.includes(category) && styles.categorySelected,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selected.includes(category) && styles.categoryTextSelected,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Speichern" onPress={savePreferences} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryList: {
    marginBottom: 30,
  },
  categoryButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    marginBottom: 10,
  },
  categorySelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  categoryText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});