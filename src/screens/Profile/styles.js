import { StyleSheet } from 'react-native'
import { primaryColor } from '../../components/Welcome/styles'
const styles = StyleSheet.create({
          profileContent: {
                    padding: 15,
                    paddingTop: 30,
          },
          header: {
                    paddingVertical: 15,
                    paddingRight: 5,
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center'
          },
          goBack: {
                    paddingVertical: 10
          },
          dashboard: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
          },
          countContainer: {
                    backgroundColor: '#2095c1', //ebf6ff
                    borderRadius: 15,
                    padding: 15,
          },
          description: {
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
          },
          affectationCount: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#ebf6ff',
                    marginTop: 5
          },
          affectationLabel: {
                    textAlign: 'center',
                    color: '#ebf6ff',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: 5
          },
          mutedText: {
                    color: '#ebf6ff',
                    opacity: 0.8,
                    fontSize: 13,
                    marginTop: 5
          },
          chartTitle: {
                    fontSize: 16,
                    paddingTop: 15,
                    color: '#777',
                    fontWeight: 'bold'
          }
})

export default styles