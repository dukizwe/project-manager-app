import { Heading } from "native-base";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from "../../styles/COLORS";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useFetch from "../../hooks/useFecth";
import { fetchApi } from "../../functions";
import moment from "moment";
import { Modalize } from "react-native-modalize";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useRef } from "react";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import { useForm } from "../../hooks/useForm";
import Header from "../../components/Header/Header";
import Loading from "../../components/app/Loading";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";

export default function CollaborateursScreen() {
          const navigation = useNavigation()
          const [loadingCollbs, setLoadingCollabs] = useState(true)
          const [collaborateurs, setCollaborateurs] = useState([])
          const newModalRef = useRef()
          const [loading, setLoading] = useState(false);
          const user = useSelector(userSelector)

          const fetchData = async () => {
                    setLoadingCollabs(true)
                    const res = await fetchApi("/collaborateurs")
                    setCollaborateurs(res.result)
                    setLoadingCollabs(false)
          }

          const deleteRow = (id) => {
                    Alert.alert('Supprimer le poste', 'Voulez-vous vraiment supprimer ce collaborateur ?', [
                              {
                                        text: 'Non',
                                        style: 'cancel',
                              },
                              { text: 'Oui', onPress: async () => {
                                        setLoading(true)
                                        const res = await fetchApi(`/collaborateurs?ID_COLLABORATEUR=${id}`, {
                                                  method: 'DELETE',
                                        })
                                        setLoading(false)
                                        fetchData()
                              }},
                    ])
          }

          useFocusEffect(useCallback(() => {
                    fetchData()
          }, []))
          return (
                    <>
                              {loading && <Loading />}
                              <Header />
                              <View style={styles.container}>
                                        <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                  <Heading>Les collabarateurs</Heading>
                                                  {user.ID_POSTE != 7 ? <TouchableOpacity onPress={() => {
                                                            navigation.navigate("NewCollaborateurScreen")
                                                  }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primary, padding: 10, borderRadius: 10 }}>
                                                                      <AntDesign name="plus" size={24} color="#fff" />
                                                                      <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 5 }}>Nouveau</Text>
                                                            </View>
                                                  </TouchableOpacity> : null}
                                        </View>
                                        {loadingCollbs ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                  <ActivityIndicator size={'large'} color={'#000'} animating />
                                        </View> : <ScrollView style={{ paddingHorizontal: 10 }}>
                                                  {collaborateurs.map((collaborateur, index) => {
                                                            return (
                                                                      <View style={styles.affectation} key={index}>
                                                                                <View style={styles.affectationNames}>
                                                                                          <Text style={styles.activiteName} numberOfLines={2} >{collaborateur.NOM} {collaborateur.PRENOM}</Text>
                                                                                </View>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center',  marginTop: 2 }}>
                                                                                          <MaterialCommunityIcons name="email-outline" size={12} color="#777" />
                                                                                          <Text style={{ color: "#777", fontSize: 12, marginLeft: 5  }}>{ collaborateur.EMAIL }</Text>
                                                                                </View>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                                                                                          <View style={{ flexDirection: 'row', alignItems: 'center',  marginTop: 2 }}>
                                                                                                    <MaterialCommunityIcons name="post" size={12} color="#777"  />
                                                                                                    <Text style={{ color: "#777", fontSize: 12, marginLeft: 5  }}>{ collaborateur.NOM_POSTE }</Text>
                                                                                          </View>
                                                                                          <Text style={{ color: "#777", fontSize: 12 }}>{ collaborateur.NOM_EQUIPE }</Text>
                                                                                </View>
                                                                                {user.ID_POSTE != 7 ? <View style={styles.actions}>
                                                                                          <TouchableOpacity style={[styles.action, { backgroundColor: COLORS.primaryPicker }]} onPress={() => {
                                                                                                    navigation.navigate("NewCollaborateurScreen", { editCollaborateur: collaborateur })
                                                                                          }}>
                                                                                                    <AntDesign name="edit" size={20} color="white" />
                                                                                                    {/* <Text style={styles.actionText}>Modifier</Text> */}
                                                                                          </TouchableOpacity>
                                                                                          <TouchableOpacity style={[styles.action, { backgroundColor: COLORS.ecommerceRed, marginLeft: 10 }]} onPress={() => deleteRow(collaborateur.ID_COLLABORATEUR)}>
                                                                                                    <Feather name="trash" size={20} color="white" />
                                                                                                    {/* <Text style={styles.actionText}>Supprimer</Text> */}
                                                                                          </TouchableOpacity>
                                                                                </View> : null}
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
                    backgroundColor: '#F2F5FE',
                    padding: 20,
                    paddingLeft: 10,
                    paddingRight: 0,
                    borderRadius: 10,
                    marginTop: 5
          },
          circleName: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1
          },
          affectationNames: {
                    // paddingHorizontal: 10,
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
          button: {
                    marginTop: 10,
                    borderRadius: 8,
                    paddingVertical: 14,
                    paddingHorizontal: 10,
                    backgroundColor: COLORS.primary
          },
          buttonText: {
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 16,
                    textAlign: "center"
          },
})