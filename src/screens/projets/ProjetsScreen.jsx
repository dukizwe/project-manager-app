import { Heading } from "native-base";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, Feather } from '@expo/vector-icons'; 
import { COLORS } from "../../styles/COLORS";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useFetch from "../../hooks/useFecth";
import { fetchApi } from "../../functions";
import moment from "moment";
import Header from "../../components/Header/Header";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";

export default function ProjetsScreen() {
          const navigation  = useNavigation()
          const [loadingProjets, setLoadingProjets] = useState(true)
          const [projets, setProjets] = useState([])
          const user = useSelector(userSelector)
          useFocusEffect(useCallback(() => {
                    (async () => {
                              const res = await fetchApi("/projets")
                              setProjets(res.result)
                              setLoadingProjets(false)
                    })()
          }, []))
          return (
                    <>
                    <Header />
                    <View style={styles.container}>
                              <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Heading>Projets</Heading>
                                        {user.ID_POSTE != 7 ? <TouchableOpacity onPress={() => navigation.navigate("NewProjetScreen")}>
                                                  <View style={{ flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primary, padding: 10, borderRadius: 10}}>
                                                            <AntDesign name="plus" size={24} color="#fff" />
                                                            <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 5 }}>Nouveau</Text>
                                                  </View>
                                        </TouchableOpacity> : null}
                              </View>
                              {loadingProjets ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                        <ActivityIndicator size={'large'} color={'#000'} animating />
                              </View> : <ScrollView style={{ paddingHorizontal: 10 }}>
                                        {projets.map((projet, index) => {
                                                  const IS_TERMINE = projet.PROGRESSION_GROBALE >= 100
                                                  return (
                                                            <View style={[styles.affectation, IS_TERMINE && { backgroundColor: "#ddd"}]} key={index}>
                                                                      <View style={styles.statutIcon}>
                                                                                {IS_TERMINE ? 
                                                                                          <AntDesign name="checkcircle" size={24} color="#777" /> :
                                                                                          <Feather name="circle" size={24} color="#777" />
                                                                                }
                                                                      </View>
                                                                      <View style={styles.affectationNames}>
                                                                                <Text style={styles.activiteName} numberOfLines={2} >{ projet.NOM_PROJET }</Text>
                                                                                <View style={styles.affectationsDescription}>
                                                                                          <View style={styles.projetProgress}>
                                                                                                    <View style={styles.progression}>
                                                                                                              <View style={[styles.progressionValue, { width: `${projet.PROGRESSION_GROBALE}%` }, projet.PROGRESSION_GROBALE == 100  && { backgroundColor: COLORS.primary}]} />
                                                                                                    </View>
                                                                                                    <Text style={styles.progressionPercentage}>{projet.PROGRESSION_GROBALE}%</Text>
                                                                                          </View>
                                                                                          <View style={styles.heures}>
                                                                                                    <Text style={styles.date} numberOfLines={1} >{moment(projet.DATE_FIN).format('DD/MM/YYYY')}</Text>
                                                                                                    {!IS_TERMINE ? <Text style={styles.leftDays}> -{moment(projet.DATE_FIN).diff(moment(), 'days') } jours</Text> : null}
                                                                                          </View>
                                                                                </View>
                                                                                {user.ID_POSTE != 7 && !IS_TERMINE ? <View style={styles.actions}>
                                                                                          <TouchableOpacity style={[styles.action, { backgroundColor: COLORS.primaryPicker }]} onPress={() => {
                                                                                                    navigation.navigate("NewProjetScreen", { editProjet: projet })
                                                                                          }}>
                                                                                                    <AntDesign name="edit" size={20} color="white" />
                                                                                                    {/* <Text style={styles.actionText}>Modifier</Text> */}
                                                                                          </TouchableOpacity>
                                                                                          {false && <TouchableOpacity style={[styles.action, { backgroundColor: COLORS.ecommerceRed, marginLeft: 10 }]} onPress={() => deleteRow(collaborateur.ID_COLLABORATEUR)}>
                                                                                                    <Feather name="trash" size={20} color="white" />
                                                                                                    {/* <Text style={styles.actionText}>Supprimer</Text> */}
                                                                                          </TouchableOpacity>}
                                                                                </View> : null}
                                                                      </View>
                                                            </View>
                                                  )
                                        })}
                              </ScrollView>}
                    </View>
                    </>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1
          },
          affectation: {
                    backgroundColor: '#e1e8fc',
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
          leftDays: {
                    fontSize: 12,
                    color: COLORS.primary
          },
          projetProgress: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '40%'
          },
          progression: {
                    height: 5,
                    width: '100%',
                    backgroundColor: '#c4c4c4',
                    borderRadius: 10
          },
          progressionValue: {
                    height: '100%',
                    backgroundColor: '#000',
                    borderRadius: 10,
          },
          progressionPercentage: {
                    marginLeft: 10,
                    fontSize: 12,
          },
          plusIcon: {
                    padding: 10
          },
          actions: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10
          },
          action: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 10
          },
          actionText: {
                    marginLeft: 5,
                    fontSize: 12
          },
})