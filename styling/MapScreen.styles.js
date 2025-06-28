import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    // ScrollView
    categoryBar: {
      position: 'absolute',
      top: 10,
      zIndex: 10,
      flexDirection: 'row',
    },
    categoryBarContent: {
      paddingHorizontal: 10,
    },
  
    categoryButton: {
      backgroundColor: '#fff',
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 20,
      marginRight: 10,
      borderWidth: 1,
      borderColor: '#aaa',
    },
    categoryButtonActive: {
      backgroundColor: '#2196F3',
      borderColor: '#1976D2',
    },
  
    
    categoryText: {
      fontSize: 14,
      color: '#333',
    },
    categoryTextActive: {
      color: '#fff',
      fontWeight: 'bold',
    },
  
    // 📍 
    calloutBox: {
      maxWidth: 200,
    },
    calloutTitle: {
      fontWeight: 'bold',
    },
    calloutCategory: {
      fontStyle: 'italic',
    },
    calloutDate: {
      color: '#888',
    },
    calloutLink: {
      color: 'blue',
      marginTop: 5,
    },
  });
  
  export default styles;
  

