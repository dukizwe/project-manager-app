import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import moment from 'moment';
import 'moment/locale/fr';
import { MyFromNow } from '../../functions';
moment.locale('fr')

export default function Activite({ activite: dafaultAct, setState}) {
          const navigation = useNavigation()
          const [activite, setActivite] = useState(dafaultAct)
          const handleActivitePress = () => {
                    navigation.navigate('ViewCra', { activite, setActivite, setState })
          }
          const finishedStyles = !activite.ActiviteFinie ? {} : {
                    backgroundColor: '#ddd'
          }

          const TouchOrView = (props) => {
                    if(activite.ActiviteFinie) {
                              return <View style={{...styles.activite, ...finishedStyles}}>{props.children}</View>
                    }
                    return <TouchableOpacity style={{...styles.activite, ...finishedStyles}} onPress={handleActivitePress}>{props.children}</TouchableOpacity>
          }
          return (
                    <TouchOrView>
                              <View style={styles.activiteNames}>
                                        <Text style={styles.activiteName} numberOfLines={3} >{ activite.Realisation }</Text>
                              </View>
                              <View style={styles.projetDate}>
                                        <Text style={styles.projetActiviteText} numberOfLines={1} >{ activite.Activite }</Text>
                                        <Text style={styles.projetDateText} numberOfLines={1} >{ MyFromNow(activite.DATE_SAISIE_CRA) }</Text>
                              </View>
                    </TouchOrView>
          )
}
const styles = StyleSheet.create({
          activite: {
                    backgroundColor: '#F2F5FE',
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 5
          },
          activiteNames: {
                    width: '95%',
                    color: '#333',
          },
          activiteName: {
                    color: '#333',
                    fontSize: 16,
                    fontWeight: 'bold'
          },
          projetDate: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 5,
                    paddingRight: 10
          },
          projetActiviteText: {
                    width: '80%',
                    opacity: 0.8
          },
          projetDateText: {
                    opacity: 0.5
          }
})