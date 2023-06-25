import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, StatusBar, Platform } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { Ionicons, EvilIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { fetchApi } from '../../functions';
import { COLORS } from '../../styles/COLORS';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewProjetScreen() {
          const dispatch = useDispatch()
          const navigation = useNavigation()
          const [loading, setLoading] = useState(false);
          const prenomInputRef = useRef(null)
          const route = useRoute()
          const { editProjet } = route.params || {}
          const [showCalendar, setShowCalendar] = useState(false)
          const [data, handleChange, setValue] = useForm({
                    nom: editProjet ? editProjet.NOM_PROJET : "",
                    dateFin: editProjet ? editProjet.DATE_FIN : null,
          })
          const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                    nom: {
                              required: true,
                              length: [1, 50]
                    },
                    dateFin: {
                              required: true
                    },
          }, {
                    nom: {
                              required: 'Le nom du projet est obligatoire',
                              length: "Nom du projet invalide"
                    }
          })

          const onChangeDateDebut = (event, selectedDate) => {
                  const currentDate = selectedDate || data.dateFin;
                  setShowCalendar(Platform.OS === "ios");
                  handleChange('dateFin', currentDate);
          };

          const enregistrement = async () => {
                    try {
                              setLoading(true)
                              const url = editProjet ? `/projets?ID_PROJET=${editProjet.ID_PROJET}` : "/projets"
                              const method = editProjet ? 'PUT' : 'POST'
                              const res = await fetchApi(url, {
                                        method,
                                        body: JSON.stringify({
                                                  NOM_PROJET: data.nom,
                                                  DATE_FIN: moment(data.dateFin).format('YYYY/MM/DD HH:mm:ss')
                                        }),
                                        headers: { "Content-Type": "application/json" },
                              })
                              navigation.navigate("ProjetsScreen")
                    }
                    catch (error) {
                              console.log(error)
                    } finally {
                              setLoading(false);
                    }
          }

          return (
                    <>
                              {loading && <Loading />}
                              {showCalendar && (
                                        <DateTimePicker
                                                  testID="dateTimePicker"
                                                  value={data.dateFin ? data.dateFin : new Date()}
                                                  mode='date'
                                                  is24Hour={true}
                                                  display="default"
                                                  onChange={onChangeDateDebut}
                                                  minimumDate={new Date()}
                                        />
                              )}
                              <View style={styles.container}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                  <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.goBack()}>
                                                            <Ionicons name="arrow-back" size={24} color="black" />
                                                  </TouchableOpacity>
                                                  <Text style={{ marginLeft: 10, fontSize: 17, fontWeight: 'bold' }}>{editProjet ? "Modification du projet" : "Nouveau projet" }</Text>
                                        </View>
                                        <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: "#fff", paddingHorizontal: 10 }}>
                                                  <OutlinedTextField
                                                            label="Nom du projet"
                                                            fontSize={14}
                                                            baseColor={COLORS.smallBrown}
                                                            tintColor={COLORS.primary}
                                                            containerStyle={{ borderRadius: 20, marginTop: 20 }}
                                                            lineWidth={0.5}
                                                            activeLineWidth={0.5}
                                                            errorColor={COLORS.error}
                                                            // renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('nom') ? COLORS.error : "#a2a2a2"} />}
                                                            value={data.nom}
                                                            onChangeText={(newValue) => handleChange('nom', newValue)}
                                                            onBlur={() => checkFieldData('nom')}
                                                            error={hasError('nom') ? getError('nom') : ''}
                                                            onSubmitEditing={() => {
                                                                      prenomInputRef.current.focus()
                                                            }}
                                                            autoCompleteType='off'
                                                            returnKeyType="next"
                                                            blurOnSubmit={false}
                                                  />
                                                  <TouchableOpacity style={styles.selectContainer}
                                                            onPress={() => setShowCalendar(true)}
                                                  >
                                                            <View style={{}}>
                                                                      <Text style={[styles.selectLabel]}>
                                                                                Date de fin du projet
                                                                      </Text>
                                                                      {data.dateFin ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                {moment(data.dateFin).format('DD/MM/YYYY')}
                                                                      </Text> : null}
                                                            </View>
                                                            <EvilIcons name="chevron-down" size={30} color="#777" />
                                                  </TouchableOpacity>
                                                  <TouchableWithoutFeedback
                                                            disabled={!isValidate()}
                                                            onPress={enregistrement}>
                                                            <View style={[styles.button, !isValidate() && { opacity: 0.5 }]}>
                                                                      <Text style={styles.buttonText}>
                                                                                {editProjet ? "Modifier" : "Enregistrer"}
                                                                      </Text>
                                                            </View>
                                                  </TouchableWithoutFeedback>
                                        </ScrollView>
                              </View>
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
})