import { StyleSheet } from "react-native";



const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, paddingHorizontal: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
    logo: {
      width: width * 0.5,
      height: width * 0.2,
      alignSelf: 'center',
      marginVertical: 15,
    },
  
    header: {
      fontSize: width * 0.06,
      marginBottom: 10,
      textAlign: 'center',
      fontWeight: 'bold',
    },
  
    card: {
      backgroundColor: '#f0f8ff',
      padding: 15,
      marginBottom: 10,
      borderRadius: 10,
    },
  
    title: {
      fontWeight: 'bold',
      fontSize: width * 0.045,
    },
  
    distance: {
      marginTop: 4,
      fontStyle: 'italic',
      color: '#555',
    },
  
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
    },
  
    footerButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
    },
  
    footerButtonText: {
      fontSize: BUTTON_FONT_SIZE,
      textAlign: 'center',
    },
  });
  
  export default styles