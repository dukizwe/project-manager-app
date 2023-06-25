import { StyleSheet } from "react-native";

// export const primaryColor = "#007FFF"
export const primaryColor = "#f58424"
const styles = StyleSheet.create({
          card: {
                    width: '100%',
                    height: '70%',
                    borderRadius: 15,
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    shadowOffset: {
                              width: 0,
                              height: 1
                    },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 5
          },
          imageContainer: {
                    width: '50%',
                    height: 200,
                    // backgroundColor: 'red'
          },
          image: {
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain'
          },
          wrapText: {
                    width: '90%',
                    textAlign: 'center',
                    fontSize: 17
          },
          actions: {
                    width: '90%',
                    marginTop: 20
          },
          login: {
                    fontSize: 20
          },
          register: {
                    marginTop: 20,
                    color: 'red'
          }
})

export default styles