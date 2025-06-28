import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { account } from './appwriteConfig';
import { ActivityIndicator, View } from 'react-native';

import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import OfferDetailsScreen from './screens/OfferDetailsScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import ParticipationScreen from './screens/ParticipationScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setChecking(false);
      }
    };
    checkSession();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!user ? (
          <Stack.Screen
            name="Auth"
            options={{ headerShown: false }}
          >
            {(props) => <AuthScreen {...props} setUser={setUser} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={OfferDetailsScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
            <Stack.Screen name="Participation" component={ParticipationScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} setUser={setUser} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
