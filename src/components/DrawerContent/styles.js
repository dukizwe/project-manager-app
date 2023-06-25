import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
          bottomSection: {
                    marginBottom: 15,
                    borderTopColor: '#f4f4f4',
                    borderTopWidth: 1
          },
          userSection: {
                    paddingRight: 0
          },
          emailNames: {
                    marginLeft: -20,
                    width: 200
          },
          names: {
                    fontWeight: 'bold',
                    fontSize: 16,
          },
          email: {
                    color: '#777',
                    marginTop: 5,
                    fontSize: 12
          },
          userImage: {
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    alignItems: 'center',
                    justifyContent: 'center',
          },
          preference: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                    width: '100%'
          },
          affectationLabel: {
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
          },
          uncompletedAffectations: {
                    paddingHorizontal: 15
          },
          affectation: {
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    width: '100%',
                    paddingVertical: 10,
                    paddingHorizontal: 5,
          },
          affectationText: {
                    color: '#777',
                    marginLeft: 10,
                    width: '90%'
          }
})

export default styles