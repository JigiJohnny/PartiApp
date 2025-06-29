import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContainer: { padding: 20 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 20
  },
  categoryButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    marginBottom: 10
  },
  categoryButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2'
  },
  categoryText: { textAlign: 'center', fontSize: 16 },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  saveButtonText: { textAlign: 'center', color: '#fff', fontSize: 16 },
  buttonDisabled: { opacity: 0.6 },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  cardText: { fontSize: 15, marginBottom: 5 },
  date: {
    marginTop: 5,
    color: '#888',
    fontSize: 12,
    textAlign: 'right'
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
