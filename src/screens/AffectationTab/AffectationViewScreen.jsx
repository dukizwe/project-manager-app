import React from 'react'
import { useRoute } from '@react-navigation/core'
import { Text, StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { MyFromNow } from '../../functions';
import AddButton from '../../components/AddButton/AddButton'
import useFetch from '../../hooks/useFecth';
import { primaryColor } from '../../components/Welcome/styles';
import moment from 'moment';

export default function AffectationViewScreen() {
          const route = useRoute()
          const { affectation } = route.params
          const [loadingDetail, detail] = useFetch('/affectationsDetail/'+affectation.IDActivite)
          return (
                    <>
                    <ScrollView style={styles.affectationContainer}>
                              <Text style={styles.affectationName}>{affectation.DescActivite}</Text>
                              <View style={styles.projetTache}>
                                        <View style={styles.projet}>
                                                  <FontAwesome name="dot-circle-o" size={20} color="#777" />
                                                  <Text style={styles.projetName}>Projet : { affectation.Projet}</Text>
                                        </View>
                                        <View style={{...styles.projet, marginTop: 5}}>
                                                  <FontAwesome name="dot-circle-o" size={20} color="#777" />
                                                  <Text style={styles.projetName}>Tâche : {affectation.Taches}</Text>
                                        </View>
                              </View>
                              {affectation.Commentaire == '' ? <View style={styles.NoComment}>
                                        <MaterialCommunityIcons name="comment-remove-outline" size={24} color="#777" />
                                        <Text style={styles.itemName}>Pas de commentaire</Text>
                              </View> : 
                              <View style={styles.comment}>
                                        <Text style={styles.commentText}>{affectation.Commentaire}</Text>
                              </View>}
                              <View style={styles.affectationDescription}>
                                        <View style={styles.affectationItem}>
                                                  <View style={styles.iconName}>
                                                            <FontAwesome name="calendar" size={20} color="#777" />
                                                            <Text style={styles.itemName}>Date début</Text>
                                                  </View>
                                                  <View style={styles.itemValue}>
                                                            <Text style={styles.itemValueText}>{ MyFromNow(affectation.DateDebutAff) }</Text>
                                                  </View>
                                        </View>
                                        <View style={{...styles.affectationItem, borderTopWidth: 0}}>
                                                  <View style={styles.iconName}>
                                                  <FontAwesome name="calendar" size={20} color="#777" />
                                                            <Text style={styles.itemName}>Date fin</Text>
                                                  </View>
                                                  <View style={styles.itemValue}>
                                                            <Text style={styles.itemValueText}>{ MyFromNow(affectation.DateFin) }</Text>
                                                  </View>
                                        </View>
                                        <View style={{...styles.affectationItem, borderTopWidth: 0}}>
                                                  <View style={styles.iconName}>
                                                            <MaterialCommunityIcons name="clock-check-outline" size={24} color="#777" />
                                                            <Text style={styles.itemName}>Nombre d'heures estimés</Text>
                                                  </View>
                                                  <View style={styles.itemValue}>
                                                            <Text style={styles.itemValueText}>{affectation.NbHeureEstimees}</Text>
                                                  </View>
                                        </View>
                                        <View style={{...styles.affectationItem, borderTopWidth: 0}}>
                                                  <View style={styles.iconName}>
                                                            <Entypo name="list" size={24} color='#777' />
                                                            <Text style={styles.itemName}>CRA</Text>
                                                  </View>
                                                  <View style={styles.itemValue}>
                                                            {loadingDetail ? <ActivityIndicator color={primaryColor} isLoading={loadingDetail}/> :
                                                                      <Text style={styles.itemValueText}>{ detail.craCount }</Text>
                                                            }
                                                  </View>
                                        </View>
                                        <View style={{...styles.affectationItem, borderTopWidth: 0, borderBottomWidth: 0}}>
                                                  <View style={styles.iconName}>
                                                            <MaterialIcons name="pending-actions" size={24} color="#777" />
                                                            <Text style={styles.itemName}>Reste à faire</Text>
                                                  </View>
                                        </View>
                                        <Text>{ detail.reste }</Text>
                              </View>
                    </ScrollView>
                    {
                        moment(new Date()).get("hours")>=17 && moment(new Date()).get("hours")<=23 ?
                    <AddButton isForCra={true} affectation={affectation} />:null

                    }
                    </>
          )
}

const styles = StyleSheet.create({
          affectationContainer: {
                    paddingHorizontal: 15,
                    backgroundColor: '#fff'
          },
          affectationName: {
                    fontSize: 16,
                    fontWeight: 'bold',
          },
          projetTache: {
                    paddingVertical: 30
          },
          projet: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center'
          },
          projetName: {
                    color: '#777',
                    marginLeft: 15
          },
          comment: {
                    paddingBottom: 15,
          },
          commentText: {
                    color: '#333',
                    fontSize: 15
          },
          NoComment: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                    paddingBottom: 15
          },
          affectationItem: {
                    paddingVertical: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    borderTopColor: '#ddd',
                    borderTopWidth: 1,
                    borderBottomColor: '#ddd',
                    borderBottomWidth: 1
          },
          iconName: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center'
          },
          itemName: {
                    marginLeft: 15,
                    color: '#777'
          },
          itemValue: {
                    backgroundColor: '#dde1ed',
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10
          },
          itemValueText: {
                    fontSize: 13,
                    color: '#6e6e6e'
          }
})