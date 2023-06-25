import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, StatusBar, Platform } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { Ionicons, EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { fetchApi } from '../../functions';
import { COLORS } from '../../styles/COLORS';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import useFetch from '../../hooks/useFecth';
import { Modalize } from 'react-native-modalize';

export default function NewEquipeScreen() {
          const dispatch = useDispatch()
          const navigation = useNavigation()
          const [loading, setLoading] = useState(false);
          const prenomInputRef = useRef(null)
          const responsableModalRef = useRef(null)
          const responsableAdjModalRef = useRef(null)
          const route = useRoute()
          const { editEquipe } = route.params || {}
          const [data, handleChange, setValue] = useForm({
                    nom: editEquipe ? editEquipe.NOM_EQUIPE : '',
                    responsable: (editEquipe && editEquipe.ID_RESPONSABLE) ? {
                              ID_COLLABORATEUR: editEquipe.ID_RESPONSABLE,
                              NOM: editEquipe.NOM,
                              PRENOM: editEquipe.PRENOM,
                    } : null,
                    responsableAdjoint: (editEquipe && editEquipe.ID_RESPONSABLE_ADJOINT) ? {
                              ID_COLLABORATEUR: editEquipe.ID_RESPONSABLE_ADJOINT,
                              NOM: editEquipe.NOM_RES_ADJOINT,
                              PRENOM: editEquipe.PRENOM_RES_ADJOINT,
                    } : null
          })
          const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                    nom: {
                              required: true,
                              length: [1, 50]
                    },
          }, {
                    nom: {
                              required: "Le nom de l'equipe est obligatoire",
                              length: "Nom de l'equipe invalide"
                    }
          })

          const [loadingCollaborateurs, collaborateurs] = useFetch('/collaborateurs')

          const enregistrement = async () => {
                    try {
                              setLoading(true)
                              const url = editEquipe ? `/equipes?ID_EQUIPE=${editEquipe.ID_EQUIPE}` : "/equipes"
                              const method = editEquipe ? 'PUT' : 'POST'
                              const res = await fetchApi(url, {
                                        method,
                                        body: JSON.stringify({
                                                  NOM_EQUIPE: data.nom,
                                                  ID_RESPONSABLE: data.responsable ? data.responsable.ID_COLLABORATEUR : null,
                                                  ID_RESPONSABLE_ADJOINT: data.responsableAdjoint ? data.responsableAdjoint.ID_COLLABORATEUR : null
                                        }),
                                        headers: { "Content-Type": "application/json" },
                              })
                              navigation.navigate("EquipesScreen")
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
                              <View style={styles.container}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                  <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.goBack()}>
                                                            <Ionicons name="arrow-back" size={24} color="black" />
                                                  </TouchableOpacity>
                                                  <Text style={{ marginLeft: 10, fontSize: 17, fontWeight: 'bold' }}>Nouvelle equipe</Text>
                                        </View>
                                        <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: "#fff", paddingHorizontal: 10 }}>
                                                  <OutlinedTextField
                                                            label="Nom de l'equipe"
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
                                                            onPress={() => responsableModalRef.current.open()}
                                                  >
                                                            <View style={{}}>
                                                                      <Text style={[styles.selectLabel]}>
                                                                                Responsable
                                                                      </Text>
                                                                      {data.responsable ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                {data.responsable.NOM} {data.responsable.PRENOM}
                                                                      </Text> : null}
                                                            </View>
                                                            <EvilIcons name="chevron-down" size={30} color="#777" />
                                                  </TouchableOpacity>
                                                  <TouchableOpacity style={styles.selectContainer}
                                                            onPress={() => responsableAdjModalRef.current.open()}
                                                  >
                                                            <View style={{}}>
                                                                      <Text style={[styles.selectLabel]}>
                                                                                Responsable adjoint
                                                                      </Text>
                                                                      {data.responsableAdjoint ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                {data.responsableAdjoint.NOM} {data.responsable.PRENOM}
                                                                      </Text> : null}
                                                            </View>
                                                            <EvilIcons name="chevron-down" size={30} color="#777" />
                                                  </TouchableOpacity>
                                                  <TouchableWithoutFeedback
                                                            disabled={!isValidate()}
                                                            onPress={enregistrement}>
                                                            <View style={[styles.button, !isValidate() && { opacity: 0.5 }]}>
                                                                      <Text style={styles.buttonText}>{editEquipe ? "Modifier" : 'Enregistrer'}</Text>
                                                            </View>
                                                  </TouchableWithoutFeedback>
                                        </ScrollView>
                              </View>
                              <Modalize ref={responsableModalRef} adjustToContentHeight>
                                        <View style={styles.modalContent}>
                                                  <Text style={styles.Title}>Choisir le responsable de l'equipe</Text>
                                                  {!loadingCollaborateurs ? <View style={styles.modalList}>
                                                            {collaborateurs.result.map((collaborateur, index) => {
                                                                      return (
                                                                                <TouchableOpacity key={index} onPress={() => {
                                                                                          responsableModalRef.current.close()
                                                                                          handleChange('responsable', collaborateur)
                                                                                }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ddd"}}>
                                                                                          <Text>{ collaborateur.NOM } { collaborateur.PRENOM }</Text>
                                                                                          {collaborateur.ID_COLLABORATEUR == data.responsable?.ID_COLLABORATEUR ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                </TouchableOpacity>
                                                                      )
                                                            })}
                                                  </View> : null}
                                        </View>
                              </Modalize>
                              <Modalize ref={responsableAdjModalRef} adjustToContentHeight>
                                        <View style={styles.modalContent}>
                                                  <Text style={styles.Title}>Choisir le responsable adjoint de l'equipe</Text>
                                                  {!loadingCollaborateurs ? <View style={styles.modalList}>
                                                            {collaborateurs.result.map((collaborateur, index) => {
                                                                      return (
                                                                                <TouchableOpacity key={index} onPress={() => {
                                                                                          responsableAdjModalRef.current.close()
                                                                                          handleChange('responsableAdjoint', collaborateur)
                                                                                }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ddd"}}>
                                                                                          <Text>{ collaborateur.NOM } { collaborateur.PRENOM }</Text>
                                                                                          {collaborateur.ID_COLLABORATEUR == data.responsableAdjoint?.ID_COLLABORATEUR ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                </TouchableOpacity>
                                                                      )
                                                            })}
                                                  </View> : null}
                                        </View>
                              </Modalize>
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
          modalContent: {
                    padding: 20
          }
})