import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
          card: {
                    width: '100%',
                    height: height / 1.5,
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
          form: {
                    width: '90%'
          },
          actions: {
                    width: '90%',
                    marginTop: 20
          },
})

export default styles