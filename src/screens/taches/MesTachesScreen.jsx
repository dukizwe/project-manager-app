import { Heading, ScrollView } from "native-base";
import React from "react";
import { ActivityIndicator, Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS } from "../../styles/COLORS";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../../components/Header/Header";
import { useCallback } from "react";
import { fetchApi } from "../../functions";
import { useState } from "react";
import moment from "moment";
import { Modalize } from "react-native-modalize";
import { useRef } from "react";
import { OutlinedTextField } from "rn-material-ui-textfield";
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import Slider from '@react-native-community/slider';
import Loading from "../../components/app/Loading";
import Tache from "../../components/app/Tache";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";
// import RangeSlider from 'rn-range-slider';

export default function TachesScreen() {
          const navigation = useNavigation()
          const [loadingTaches, setLoadingTaches] = useState(true)
          const [taches, setTaches] = useState([])
          const [showProgress, setShowProgress] = useState(null)
          const [loading, setLoading] = useState(false)
          const [progressionValue, setProgressionValue] = useState(0)
          const modalRef = useRef()
          const [data, handleChange] = useForm({
                    activite: ''
          })
          const user = useSelector(userSelector)

          const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                    activite: {
                              required: true,
                    }
          }, {
                    activite: {
                              required: "Ce champ est obligatoire"
                    }
          })

          const saveProgression = async () => {
                    try {
                              setLoading(true)
                              Keyboard.dismiss()
                              const res = await fetchApi(`/taches?ID_TACHE=${showProgress.ID_TACHE}`, {
                                        method: 'PUT',
                                        body: JSON.stringify({
                                                  PROGRESSION: progressionValue
                                        }),
                                        headers: { "Content-Type": "application/json" },
                              })
                              await fetchApi(`/taches_progression`, {
                                        method: 'POST',
                                        body: JSON.stringify({
                                                  ID_TACHE: showProgress.ID_TACHE,
                                                  PROGRESSION: progressionValue,
                                                  ACTIVITE: data.activite
                                        }),
                                        headers: { "Content-Type": "application/json" },
                              })
                              fetchData()
                              modalRef.current.close()
                    }
                    catch (error) {
                              console.log(error)
                    } finally {
                              setLoading(false);
                    }
          }

          const fetchData = async () => {
                    setLoadingTaches(true)
                    const res = await fetchApi(`/taches?ID_COLLABORATEUR=${user.ID_COLLABORATEUR}`)
                    setTaches(res.result)
                    setLoadingTaches(false)
          }
          useFocusEffect(useCallback(() => {
                    fetchData()
          }, []))
          return (
                    <>
                              <Header />
                              {loading && <Loading />}
                              <View style={styles.container}>
                                        <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                  <Heading>Mes taches</Heading>
                                                  {/* <TouchableOpacity onPress={() => navigation.navigate("NewTacheScreen")}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primary, padding: 10, borderRadius: 10 }}>
                                                                      <AntDesign name="plus" size={24} color="#fff" />
                                                                      <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 5 }}>Nouvelle</Text>
                                                            </View>
                                                  </TouchableOpacity> */}
                                        </View> 
                                        {loadingTaches ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                  <ActivityIndicator size={'large'} color={'#000'} animating />
                                        </View> : taches.length == 0 ?
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                  <Text style={{ }}>Aucune tâche trouvée</Text>
                                        </View>
                                         :<ScrollView style={{ paddingHorizontal: 10 }}>
                                                  {taches.map((tache, index) => {
                                                            return (
                                                                      <Tache tache={tache} setShowProgress={setShowProgress} modalRef={modalRef} isMesTaches />
                                                            )
                                                  })}
                                        </ScrollView>}
                              </View>
                              <Modalize adjustToContentHeight ref={modalRef} onClose={() => {
                                        setShowProgress(null)
                                        handleChange("activite", '')
                              }} scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}>
                                        <View style={{ paddingVertical: 20 }}>
                                                  <Text style={{ fontSize: 17, fontWeight: 'bold', paddingHorizontal: 15 }}>Progression</Text>
                                                  <Slider
                                                            style={{ width: '100%', height: 30 }}
                                                            minimumValue={showProgress?.PROGRESSION}
                                                            maximumValue={100}
                                                            minimumTrackTintColor="#000"
                                                            maximumTrackTintColor="#777"
                                                            // value={progressionValue}
                                                            onValueChange={value => setProgressionValue(parseInt(value))}
                                                  />
                                                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                                                            <Text style={{ color: '#777', fontSize: 12 }}>{showProgress?.PROGRESSION}%</Text>
                                                            <Text style={{ color: '#777', fontSize: 12 }}>{progressionValue ? progressionValue : showProgress?.PROGRESSION}</Text>
                                                            <Text style={{ color: '#777', fontSize: 12 }}>100%</Text>
                                                  </View>
                                                  <View style={{ paddingHorizontal: 10 }}>
                                                            <OutlinedTextField
                                                                      label="Activite du jour"
                                                                      fontSize={14}
                                                                      baseColor={COLORS.smallBrown}
                                                                      tintColor={COLORS.primary}
                                                                      containerStyle={{ borderRadius: 20, marginTop: 20 }}
                                                                      lineWidth={0.5}
                                                                      activeLineWidth={0.5}
                                                                      errorColor={COLORS.error}
                                                                      // renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('nom') ? COLORS.error : "#a2a2a2"} />}
                                                                      value={data.activite}
                                                                      onChangeText={(newValue) => handleChange('activite', newValue)}
                                                                      onBlur={() => checkFieldData('activite')}
                                                                      error={hasError('activite') ? getError('activite') : ''}
                                                                      autoCompleteType='off'
                                                                      autoFocus
                                                                      multiline
                                                            />
                                                            <TouchableOpacity
                                                                      disabled={!isValidate()}
                                                                      onPress={saveProgression}>
                                                                      <View style={[styles.button, !isValidate() && { opacity: 0.5 }]}>
                                                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                                                      </View>
                                                            </TouchableOpacity>
                                                  </View>
                                        </View>
                              </Modalize>
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