import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
          header: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignContent: 'center',
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderBottomColor: '#ddd',
                    paddingVertical: 5,
                    borderBottomWidth: 1,
          },
          craText: {
                    fontSize: 25,
                    fontWeight: 'bold'
          },
          logoImage: {
                    width: 50,
                    height: 50
          },
          image: {
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain'
          },
          connectedUser: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#ddd',
                    marginBottom: 5,
                    borderRadius: 10,
                    padding: 5
          },
          userIcon: {
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    alignItems: 'center',
                    justifyContent: 'center',
          },
          username: {
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginLeft: 5
          },
          largeUser: {
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomColor: '#ddd',
                    borderBottomWidth: 1
          },
          userNames: {
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: 5,
                    textAlign: 'center'
          }
})

export default styles