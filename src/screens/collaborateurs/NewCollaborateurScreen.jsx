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

export default function NewCollaborateurScreen() {
          const dispatch = useDispatch()
          const navigation = useNavigation()
          const [loading, setLoading] = useState(false);
          const prenomInputRef = useRef(null)
          const postesModalRef = useRef(null)
          const equipesAdjModalRef = useRef(null)
          const telRef = useRef(null)
          const emailInputRef = useRef(null)
          const route = useRoute()
          const { editCollaborateur } = route.params || {}
          const [data, handleChange, setValue] = useForm({
                    nom: editCollaborateur ? editCollaborateur.NOM : "",
                    prenom: editCollaborateur ? editCollaborateur.PRENOM : "",
                    email: editCollaborateur ? editCollaborateur. EMAIL : "",
                    telephone: editCollaborateur ? editCollaborateur.TELEPHONE : "",
                    poste: (editCollaborateur && editCollaborateur.ID_POSTE) ?{
                              ID_POSTE: editCollaborateur.ID_POSTE,
                              NOM_POSTE: editCollaborateur.NOM_POSTE
                    } : null,
                    equipe: (editCollaborateur && editCollaborateur.ID_EQUIPE) ? {
                              ID_EQUIPE: editCollaborateur.ID_EQUIPE,
                              NOM_EQUIPE: editCollaborateur.NOM_EQUIPE
                    } : null
          })
          const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                    nom: {
                              required: true,
                              length: [1, 50]
                    },
                    prenom: {
                              required: true,
                              length: [1, 50]
                    },
                    email: {
                              required: true,
                              email: true
                    },
                    telephone: {
                              required: true,

                    },
                    telephone: {
                              required: true,
                              length: [8]
                    },
                    poste: {
                              required: true
                    }
          }, {
                    nom: {
                              required: 'Le nom est obligatoire',
                              length: "Nom invalide"
                    },
                    prenom: {
                              required: 'Le prénom est obligatoire',
                              length: "Prénom invalide"
                    },
                    email: {
                              required: "L'email est obligatoire",
                              email: "Email invalide"
                    },
                    telephone: {
                              required: "Le Telephone est obligatoire",
                              length: "Numero de telephone invalide"
                    }
          })
          
          const [loadingPostes, postes] = useFetch("/postes")
          const [loadingEquipes, equipes] = useFetch("/equipes")

          const enregistrement = async () => {
                    try {
                              setLoading(true)
                              const url = editCollaborateur ? `/collaborateurs?ID_COLLABORATEUR=${editCollaborateur.ID_COLLABORATEUR}` : "/collaborateurs"
                              const method = editCollaborateur ? 'PUT' : 'POST'
                              const res = await fetchApi(url, {
                                        method,
                                        body: JSON.stringify({
                                                  NOM: data.nom,
                                                  PRENOM: data.prenom,
                                                  TELEPHONE: data.telephone,
                                                  EMAIL: data.email,
                                                  ID_POSTE: data.poste.ID_POSTE,
                                                  ID_EQUIPE: data.equipe.ID_EQUIPE
                                        }),
                                        headers: { "Content-Type": "application/json" },
                              })
                              navigation.navigate("CollaborateursScreen")
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
                                                  <Text style={{ marginLeft: 10, fontSize: 17, fontWeight: 'bold' }}>{editCollaborateur ? "Modifier un collaborateur" : "Nouveau collaborateur"}</Text>
                                        </View>
                                        <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: "#fff", paddingHorizontal: 10 }}>
                                                  <OutlinedTextField
                                                            label="Nom"
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
                                                  <OutlinedTextField
                                                            label="Prénom"
                                                            fontSize={14}
                                                            baseColor={COLORS.smallBrown}
                                                            tintColor={COLORS.primary}
                                                            lineWidth={0.5}
                                                            containerStyle={{ borderRadius: 20, marginTop: 20 }}
                                                            activeLineWidth={0.5}
                                                            errorColor={COLORS.error}
                                                            // renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('prenom') ? COLORS.error : "#a2a2a2"} />}
                                                            value={data.prenom}
                                                            onChangeText={(newValue) => handleChange('prenom', newValue)}
                                                            onBlur={() => checkFieldData('prenom')}
                                                            error={hasError('prenom') ? getError('prenom') : ''}
                                                            ref={prenomInputRef}
                                                            onSubmitEditing={() => {
                                                                      telRef.current.focus()
                                                            }}
                                                            autoCompleteType='off'
                                                            returnKeyType="next"
                                                            blurOnSubmit={false}
                                                  />
                                                  <OutlinedTextField
                                                            label="Téléphone"
                                                            fontSize={14}
                                                            containerStyle={{ borderRadius: 20, marginTop: 20 }}
                                                            baseColor={COLORS.smallBrown}
                                                            tintColor={COLORS.primary}
                                                            lineWidth={0.5}
                                                            activeLineWidth={0.5}
                                                            errorColor={COLORS.error}
                                                            // renderRightAccessory={() => <Feather name="phone" size={24} color={hasError('telephone') ? COLORS.error : "#a2a2a2"} />}
                                                            value={data.telephone}
                                                            onChangeText={(newValue) => handleChange('telephone', newValue)}
                                                            onBlur={() => checkFieldData('telephone')}
                                                            error={hasError('telephone') ? getError('telephone') : ''}
                                                            ref={telRef}
                                                            onSubmitEditing={() => {
                                                                      emailInputRef.current.focus()
                                                            }}
                                                            autoCompleteType='off'
                                                            returnKeyType="next"
                                                            blurOnSubmit={false}
                                                            keyboardType='number-pad'
                                                  />
                                                  <OutlinedTextField
                                                            label="Adresse email"
                                                            fontSize={14}
                                                            baseColor={COLORS.smallBrown}
                                                            containerStyle={{ borderRadius: 20, marginTop: 20 }}
                                                            tintColor={COLORS.primary}
                                                            lineWidth={0.5}
                                                            activeLineWidth={0.5}
                                                            errorColor={COLORS.error}
                                                            // renderRightAccessory={() => <Fontisto name="email" size={20} color={hasError('email') ? COLORS.error : "#a2a2a2"} />}
                                                            value={data.email}
                                                            onChangeText={(newValue) => handleChange('email', newValue)}
                                                            onBlur={() => checkFieldData('email')}
                                                            error={hasError('email') ? getError('email') : ''}
                                                            ref={emailInputRef}
                                                            onSubmitEditing={() => {
                                                                      // passwordInputRef.current.focus()
                                                            }}
                                                            autoCompleteType='off'
                                                            // returnKeyType="next"
                                                            // blurOnSubmit={false}
                                                  />
                                                  <TouchableOpacity style={styles.selectContainer}
                                                            onPress={() => postesModalRef.current.open()}
                                                  >
                                                            <View style={{}}>
                                                                      <Text style={[styles.selectLabel]}>
                                                                                Fonction
                                                                      </Text>
                                                                      {data.poste ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                {data.poste.NOM_POSTE}
                                                                      </Text> : null}
                                                            </View>
                                                            <EvilIcons name="chevron-down" size={30} color="#777" />
                                                  </TouchableOpacity>
                                                  <TouchableOpacity style={styles.selectContainer}
                                                            onPress={() => equipesAdjModalRef.current.open()}
                                                  >
                                                            <View style={{}}>
                                                                      <Text style={[styles.selectLabel]}>
                                                                                Equipe
                                                                      </Text>
                                                                      {data.equipe ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                                                {data.equipe.NOM_EQUIPE}
                                                                      </Text> : null}
                                                            </View>
                                                            <EvilIcons name="chevron-down" size={30} color="#777" />
                                                  </TouchableOpacity>
                                                  <TouchableWithoutFeedback
                                                            disabled={!isValidate()}
                                                            onPress={enregistrement}>
                                                            <View style={[styles.button, !isValidate() && { opacity: 0.5 }]}>
                                                                      <Text style={styles.buttonText}>{editCollaborateur ? "Modifier" : 'Enregistrer'}</Text>
                                                            </View>
                                                  </TouchableWithoutFeedback>
                                        </ScrollView>
                              </View>
                              <Modalize ref={postesModalRef} adjustToContentHeight>
                                        <View style={styles.modalContent}>
                                                  <Text style={styles.Title}>Choisir la fonction</Text>
                                                  {!loadingPostes ? <View style={styles.modalList}>
                                                            {postes.result.map((poste, index) => {
                                                                      return (
                                                                                <TouchableOpacity key={index} onPress={() => {
                                                                                          postesModalRef.current.close()
                                                                                          handleChange('poste', poste)
                                                                                }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ddd"}}>
                                                                                          <Text>{ poste.NOM_POSTE }</Text>
                                                                                          {poste.ID_POSTE == data.poste?.ID_POSTE ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                </TouchableOpacity>
                                                                      )
                                                            })}
                                                  </View> : null}
                                        </View>
                              </Modalize>
                              <Modalize ref={equipesAdjModalRef} adjustToContentHeight>
                                        <View style={styles.modalContent}>
                                                  <Text style={styles.Title}>Choisir l'equipe</Text>
                                                  {!loadingEquipes ? <View style={styles.modalList}>
                                                            {equipes.result.map((equipe, index) => {
                                                                      return (
                                                                                <TouchableOpacity key={index} onPress={() => {
                                                                                          equipesAdjModalRef.current.close()
                                                                                          handleChange('equipe', equipe)
                                                                                }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ddd"}}>
                                                                                          <Text>{ equipe.NOM_EQUIPE }</Text>
                                                                                          {equipe.ID_EQUIPE == data.equipe?.ID_EQUIPE ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
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