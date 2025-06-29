// styling/OfferDetailsScreen.style.js

import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 5 },
  map: {
    width: '100%',
    height: Dimensions.get('window').height * 0.25,
    marginVertical: 20,
    borderRadius: 10,
  },
  feedbackContainer: { marginTop: 10 },
  feedbackTitle: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  buttonGroup: {
    gap: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
