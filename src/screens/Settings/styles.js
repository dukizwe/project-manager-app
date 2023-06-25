import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
          settingsContent: {
                    paddingTop: 30,
          },
          header: {
                    padding: 15,
                    paddingRight: 5,
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
          },
          goBack: {
                    paddingVertical: 10
          },
          headerTitle: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginLeft: 20
          },
          settingItem: {
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    width: '100%',
                    paddingVertical: 10,
                    paddingHorizontal: 15
          },
          settingName: {
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    marginLeft: 15,
                    flex: 1,
                    width: '100%',
          },
          settingTitle: {
                    fontSize: 16
          },
          settingDescription: {
                    opacity: 0.7,
          },
          messageModalItem: {
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                    marginTop: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
          },
          checkSqaure: {
                    width: 15,
                    height: 15,
                    borderWidth: 1,
                    borderColor: '#777',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center'
          },
          messageLabel: {
                    marginLeft: 5,
                    width: '90%'
          },
          textInput: {
                    backgroundColor: '#ddd',
                    borderColor: '#f1f1f1',
                    borderWidth: 1,
                    fontSize: 16,
                    borderRadius: 5,
                    padding: 10,
                    maxHeight: 150
          },
          maxInput: {
                    bottom: 0,
                    fontSize: 12,
                    color: '#878A8C',
                    alignSelf: 'flex-end'
          }
})

export default styles