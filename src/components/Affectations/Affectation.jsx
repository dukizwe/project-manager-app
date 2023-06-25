import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'; 
import moment from 'moment';

export default function Affectation({ affectation: defaultAFf }) {
          const [affectation, setAffectation] = useState(defaultAFf)
          // console.log(affectation)
          const navigation = useNavigation()
          // affectation.ActiviteFinie = 0
          const handleAffectationPress = () => {
                    !affectation.ActiviteFinie && navigation.navigate('AffectationView', { affectation })
          }
          const handleNewCraPress = () => {
                    navigation.navigate('NewCra', { affectation })
          }

          const decDate = date => {
                    const newDate = new Date(date)
                    return newDate.getDate() + '/' + (parseInt(newDate.getMonth(), 10)+1)
          }
          const finishedStyles = !affectation.ActiviteFinie ? {} : {
                    backgroundColor: '#ddd'
          }
          const TouchOrView = (props) => {
                    if(affectation.ActiviteFinie) {
                              return <View style={{...styles.affectation, ...finishedStyles}}>{props.children}</View>
                    } else {
                              return <TouchableOpacity style={{...styles.affectation}} onPress={handleAffectationPress}>{props.children}</TouchableOpacity>
                    }
          }
          return (
                    <TouchOrView  >
                              <View style={styles.circleName}>
                                        
                                        <View style={styles.statutIcon}>
                                                  {affectation.ActiviteFinie ? 
                                                            <AntDesign name="checkcircle" size={24} color="#777" /> :
                                                            <Feather name="circle" size={24} color="#777" />
                                                  }
                                        </View>
                                        <View style={styles.affectationNames}>
                                                  <Text style={styles.activiteName} numberOfLines={1} >{ affectation.DescActivite }</Text>
                                                  <View style={styles.affectationsDescription}>
                                                            <View style={styles.projetHeure}>
                                                                      <Text style={styles.projetName} numberOfLines={1} >{ affectation.Taches }</Text>
                                                                      <Text style={styles.nbreHeures} numberOfLines={1} > | { affectation.NbHeureEstimees } </Text>
                                                            </View>
                                                            <View style={styles.heures}>
                                                                      <Text style={styles.date} numberOfLines={1} >{ decDate(affectation.DateDebutAff) } -</Text>
                                                                      <Text style={styles.date} numberOfLines={1} > { decDate(affectation.DateFin) }</Text>
                                                            </View>
                                                  </View>
                                        </View>
                              </View>
                              {!affectation.ActiviteFinie && moment(new Date()).get("hours")>=17 && moment(new Date()).get("hours")<=23 ?
                                    <TouchableOpacity style={styles.plusIcon} onPress={handleNewCraPress}>
                                                <AntDesign name="pluscircleo" size={24} color="#777" />
                                    </TouchableOpacity>:
                                    null
                                }
                              {/* <AffectationDate dateDebut={affectation.dateDebut} dateFin={affectation.dateFin} /> */}
                    </TouchOrView>
          )
}
const styles = StyleSheet.create({
          affectation: {
                    backgroundColor: '#F2F5FE',
                    padding: 20,
                    paddingLeft: 10,
                    paddingRight: 0,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 5
          },
          circleName: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1
          },
          affectationNames: {
                    paddingHorizontal: 10,
                    width: '90%',
          },
          activiteName: {
                    color: '#333',
                    fontSize: 16,
                    fontWeight: 'bold',
          },
          projetName: {
                    color: '#333',
                    opacity: 0.6,
                    fontSize: 12,
          },
          affectationsDescription: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // width: '100%',
                    marginTop: 5,
          },
          nbreHeures: {
                    opacity: 0.6,
                    fontSize: 12
          },
          heures: {
                    flexDirection: 'row',
          },
          date: {
                    opacity: 0.6,
                    fontSize: 12
          },
          projetHeure: {
                    flexDirection: 'row',
                    width: '40%'
          },
          plusIcon: {
                    padding: 10
          }
})