import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import moment from "moment";
import { Modalize } from "react-native-modalize";
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import { fetchApi } from "../../functions";
import { OutlinedTextField } from "rn-material-ui-textfield";
import Slider from '@react-native-community/slider';
import { COLORS } from "../../styles/COLORS";
import { useRef } from "react";

export default function Tache({ tache, index, setShowProgress, modalRef, isMesTaches = false }) {
          const [data, handleChange] = useForm({
                    activite: ''
          })

          const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                    activite: {
                              required: true,
                    }
          }, {
                    activite: {
                              required: "Ce champ est obligatoire"
                    }
          })
          return (
                    <>
                    <TouchableOpacity style={[styles.affectation, tache.PROGRESSION == 100 && { backgroundColor: "#ddd"}]} disabled={tache.PROGRESSION == 100} onPress={() => {
                              setShowProgress(tache)
                              modalRef.current.open()
                    }}>
                              <View style={styles.statutIcon}>
                                        {tache.PROGRESSION == 100 ?
                                                  <AntDesign name="checkcircle" size={24} color="#777" /> :
                                                  <Feather name="circle" size={24} color="#777" />
                                        }
                              </View>
                              <View style={styles.affectationNames}>
                                        <Text style={styles.activiteName} numberOfLines={2} >{tache.NOM_TACHE}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                  <MaterialCommunityIcons name="post" size={12} color="#777" />
                                                  <Text style={{ color: "#777", fontSize: 12, marginLeft: 5 }}>{tache.NOM_PROJET}</Text>
                                        </View>
                                        {!isMesTaches ? <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                  <Ionicons name="person-outline" size={12} color="#777" />
                                                  <Text style={{ color: "#777", fontSize: 12, marginLeft: 5 }}>{tache.NOM} {tache.PRENOM}</Text>
                                        </View> : null}
                                        <View style={styles.affectationsDescription}>
                                                  <View style={styles.projetProgress}>
                                                            <View style={styles.progression}>
                                                                      <View style={[styles.progressionValue, { width: `${tache.PROGRESSION}%` }, tache.PROGRESSION == 100  && { backgroundColor: COLORS.primary}]} />
                                                            </View>
                                                            <Text style={styles.progressionPercentage}>{tache.PROGRESSION}%</Text>
                                                  </View>
                                                  <View style={styles.heures}>
                                                            <Text style={styles.date} numberOfLines={1} >{moment(tache.FIN_TACHE).format('DD/MM/YYYY')}</Text>
                                                            {tache.PROGRESSION < 100 ? <Text style={styles.leftDays}> -{moment(tache.FIN_TACHE).diff(moment(), 'days')} jours</Text> : null}
                                                  </View>
                                        </View>
                              </View>
                    </TouchableOpacity>
                              </>
          )
}

const styles = StyleSheet.create({
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