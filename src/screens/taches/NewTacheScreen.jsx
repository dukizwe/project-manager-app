import React, { useRef, useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, ActivityIndicator, TouchableWithoutFeedback, TextInput, StatusBar } from "react-native";
import { TextField, FilledTextField, InputAdornment, OutlinedTextField } from 'rn-material-ui-textfield'
import { FontAwesome, Fontisto, EvilIcons, Feather, Ionicons, MaterialIcons, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserAction } from "../../store/actions/userActions"
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { fetchApi } from '../../functions';
import { COLORS } from '../../styles/COLORS';
import useFetch from '../../hooks/useFecth';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Modalize } from 'react-native-modalize';

export default function NewTacheScreen() {
          const dispatch = useDispatch()
          const navigation = useNavigation()
          const [loading, setLoading] = useState(false);
          const [showDebutCalendar, setShowDebutCalendar] = useState(null)
          const [showFinCalendar, setShowFinCalendar] = useState(null)
          const projetsRef = useRef(null)
          const collaborateursRef = useRef(null)
          const [data, handleChange, setValue] = useForm({
                    projet: null,
                    collaborateur: null,
                    nomTache: "",
                    desciptionTache: "",
                    debutTache: null,
                    finTache: null
          })

          const [loadingProjets, projets] = useFetch("/projets")
          const [loadingCollaborateurs, collaborateurs] = useFetch("/collaborateurs")

          const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                    projet: {
                              required: true,
                    },
                    collaborateur: {
                              required: true,
                    },
                    nomTache: {
                              required: true,
                              length: [1, 100]
                    },
                    desciptionTache: {
                              length: [0, 3000],
                    },
                    debutTache: {
                              required: true
                    },
                    finTache: {
                              required: true
                    }
          }, {
                    nomTache: {
                              required: "Ce champ est obligatoire",
                              length: "Tache invalide"
                    },
                    desciptionTache: {
                              length: "Description de la tache invalide",
                    }
          })

          const onChangeDateDebut = (event, selectedDate) => {
                  const currentDate = selectedDate || data.debutTache;
                  setShowDebutCalendar(Platform.OS === "ios");
                  handleChange('debutTache', currentDate);
                  handleChange('finTache', null);
          };
          
          const onChangeDateFin = (event, selectedDate) => {
                    const currentDate = selectedDate || data.finTache;
                    setShowFinCalendar(Platform.OS === "ios");
                    handleChange('finTache', currentDate);
            };

          const enregistrement = async () => {
                    try {
                              setLoading(true)
                              const res = await fetchApi("/taches", {
                                        method: 'POST',
                                        body: JSON.stringify({
                                                  ID_PROJET: data.projet.ID_PROJET,
                                                  ID_COLLABORATEUR: data.collaborateur.ID_COLLABORATEUR,
                                                  NOM_TACHE: data.nomTache,
                                                  DESCRIPTION_TACHE: data.desciptionTache,
                                                  DEBUT_TACHE: moment(data.debutTache).format('YYYY/MM/DD HH:mm:ss'),
                                                  FIN_TACHE: moment(data.finTache).format('YYYY/MM/DD HH:mm:ss'),
                                                  ID_STATUT_TACHE: 1
                                        }),
                                        headers: { "Content-Type": "application/json" },
                              })
                              navigation.navigate("TachesScreen")
                    }
                    catch (error) {
                              console.log(error)
                              if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
                                        setErrors({
                                                  nom: error.result.NOM,
                                                  prenom: error.result.PRENOM,
                                                  email: error.result.EMAIL,
                                                  telephone: error.result.TELEPHONE,
                                                  password: error.result.PASSWORD,
                                        })
                              }
                    } finally {
                              setLoading(false);
                    }
          }

          return (
                    <>
                              {loading && <Loading />}
                              <View style={styles.container}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                  <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.goBack()}>
                                                            <Ionicons name="arrow-back" size={24} color="black" />
                                                  </TouchableOpacity>
                                                  <Text style={{ marginLeft: 10, fontSize: 17, fontWeight: 'bold' }}>Nouvelle affectation de tache</Text>
                                        </View>
                                        <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: "#fff", paddingHorizontal: 10 }}>
                                                  <TouchableOpacity style={styles.selectContainer}
                                                            onPress={() => projetsRef.current.open()}
                                                  >
                                                            <View style={{}}>
                                                                      <Text style={[styles.selectLabel]}>
                                                                                Projet
                                                                      </Text>
                                                                      {data.projet ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                {data.projet.NOM_PROJET}
                                                                      </Text> : null}
                                                            </View>
                                                            <EvilIcons name="chevron-down" size={30} color="#777" />
                                                  </TouchableOpacity>
                                                  <TouchableOpacity style={styles.selectContainer}
                                                            onPress={() => collaborateursRef.current.open()}
                                                  >
                                                            <View style={{}}>
                                                                      <Text style={[styles.selectLabel]}>
                                                                                Collaborateur
                                                                      </Text>
                                                                      {data.collaborateur ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                {data.collaborateur.NOM} {data.collaborateur.PRENOM}
                                                                      </Text> : null}
                                                            </View>
                                                            <EvilIcons name="chevron-down" size={30} color="#777" />
                                                  </TouchableOpacity>
                                                  <OutlinedTextField
                                                            label="Tache"
                                                            fontSize={14}
                                                            baseColor={COLORS.smallBrown}
                                                            tintColor={COLORS.primary}
                                                            containerStyle={{ borderRadius: 20, marginTop: 20 }}
                                                            lineWidth={0.5}
                                                            activeLineWidth={0.5}
                                                            errorColor={COLORS.error}
                                                            // renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('nom') ? COLORS.error : "#a2a2a2"} />}
                                                            value={data.nomTache}
                                                            onChangeText={(newValue) => handleChange('nomTache', newValue)}
                                                            onBlur={() => checkFieldData('nomTache')}
                                                            error={hasError('nomTache') ? getError('nomTache') : ''}
                                                            autoCompleteType='off'
                                                  />
                                                  <OutlinedTextField
                                                            label="Description de la tache"
                                                            fontSize={14}
                                                            baseColor={COLORS.smallBrown}
                                                            tintColor={COLORS.primary}
                                                            containerStyle={{ borderRadius: 20, marginTop: 20 }}
                                                            lineWidth={0.5}
                                                            activeLineWidth={0.5}
                                                            errorColor={COLORS.error}
                                                            // renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('nom') ? COLORS.error : "#a2a2a2"} />}
                                                            value={data.desciptionTache}
                                                            onChangeText={(newValue) => handleChange('desciptionTache', newValue)}
                                                            onBlur={() => checkFieldData('desciptionTache')}
                                                            error={hasError('desciptionTache') ? getError('desciptionTache') : ''}
                                                            autoCompleteType='off'
                                                            multiline
                                                  />
                                                  <TouchableOpacity style={styles.selectContainer}
                                                            onPress={() => setShowDebutCalendar(true)}
                                                  >
                                                            <View style={{}}>
                                                                      <Text style={[styles.selectLabel]}>
                                                                                Date debut de la tache
                                                                      </Text>
                                                                      {data.debutTache ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                {moment(data.debutTache).format('DD/MM/YYYY')}
                                                                      </Text> : null}
                                                            </View>
                                                            <EvilIcons name="chevron-down" size={30} color="#777" />
                                                  </TouchableOpacity>
                                                  {data.debutTache ? <TouchableOpacity style={styles.selectContainer}
                                                            onPress={() => setShowFinCalendar(true)}
                                                  >
                                                            <View style={{}}>
                                                                      <Text style={[styles.selectLabel]}>
                                                                                Date fin de la tache
                                                                      </Text>
                                                                      {data.finTache ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                {moment(data.finTache).format('DD/MM/YYYY')}
                                                                      </Text> : null}
                                                            </View>
                                                            <EvilIcons name="chevron-down" size={30} color="#777" />
                                                  </TouchableOpacity> : null}
                                                  <TouchableWithoutFeedback
                                                            disabled={!isValidate()}
                                                            onPress={enregistrement}>
                                                            <View style={[styles.button, !isValidate() && { opacity: 0.5 }]}>
                                                                      <Text style={styles.buttonText}>Enregistrer</Text>
                                                            </View>
                                                  </TouchableWithoutFeedback>
                                        </ScrollView>
                              </View>
                              <Modalize ref={projetsRef} adjustToContentHeight>
                                        <View style={styles.modalContent}>
                                                  <Text style={styles.Title}>Choisir le projet</Text>
                                                  {!loadingProjets ? <View style={styles.modalList}>
                                                            {projets.result.map((projet, index) => {
                                                                      return (
                                                                                <TouchableOpacity key={index} onPress={() => {
                                                                                          projetsRef.current.close()
                                                                                          handleChange('projet', projet)
                                                                                }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ddd"}}>
                                                                                          <Text>{ projet.NOM_PROJET }</Text>
                                                                                          {projet.ID_PROJET == data.projet?.ID_PROJET ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                </TouchableOpacity>
                                                                      )
                                                            })}
                                                  </View> : null}
                                        </View>
                              </Modalize>
                              <Modalize ref={collaborateursRef} adjustToContentHeight>
                                        <View style={styles.modalContent}>
                                                  <Text style={styles.Title}>Choisir le collaborateur</Text>
                                                  {!loadingCollaborateurs ? <View style={styles.modalList}>
                                                            {collaborateurs.result.map((collaborateur, index) => {
                                                                      return (
                                                                                <TouchableOpacity key={index} onPress={() => {
                                                                                          collaborateursRef.current.close()
                                                                                          handleChange('collaborateur', collaborateur)
                                                                                }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ddd"}}>
                                                                                          <Text>{ collaborateur.NOM } { collaborateur.PRENOM }</Text>
                                                                                          {collaborateur.ID_COLLABORATEUR == data.collaborateur?.ID_COLLABORATEUR ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                </TouchableOpacity>
                                                                      )
                                                            })}
                                                  </View> : null}
                                        </View>
                              </Modalize>
                              {showDebutCalendar && (
                                        <DateTimePicker
                                                  testID="dateTimePicker"
                                                  value={data.debutTache ? data.debutTache : new Date()}
                                                  mode='date'
                                                  is24Hour={true}
                                                  display="default"
                                                  onChange={onChangeDateDebut}
                                                  minimumDate={new Date()}
                                        />
                              )}
                              
                              {(data.debutTache && showFinCalendar) && (
                                        <DateTimePicker
                                                  testID="dateTimePicker"
                                                  value={data.finTache ? data.finTache : data.debutTache}
                                                  mode='date'
                                                  is24Hour={true}
                                                  display="default"
                                                  onChange={onChangeDateFin}
                                                  minimumDate={data.debutTache}
                                        />
                              )}
                    </>
          )
}

const styles = StyleSheet.create({
          Title: {
                    fontSize: 18,
                    fontWeight: "bold"
          },
          description: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#1D8585"
          },
          cardTitle: {
                    flexDirection: "row",
                    marginTop: 30,
                    marginVertical: 20,
                    justifyContent: "center",
                    alignItems: "center"
          },
          inputCard: {
                    marginHorizontal: 20,
                    marginTop: 10
          },
          InputIcon: {
                    position: "absolute",
                    right: 15,
                    marginTop: 15
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
          cardButton: {
                    marginBottom: 20,
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 118
          },
          container: {
                    flex: 1,
                    backgroundColor: '#fff'
          },
          errorss: {
                    fontSize: 12,
                    color: "red"
          },
          selectLabel: {
              color: '#777',
              fontSize: 13
          },
          selectContainer: {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              // marginHorizontal: 10,
              backgroundColor: "#fff",
              padding: 13,
              borderRadius: 5,
              borderWidth: 0.5,
              borderColor: "#777",
              marginVertical: 10
          },
          modalContent: {
                    padding: 20
          }
})