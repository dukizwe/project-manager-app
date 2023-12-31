import React, { useRef, useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, ActivityIndicator, TouchableWithoutFeedback, TextInput } from "react-native";
import { TextField, FilledTextField, InputAdornment, OutlinedTextField } from 'rn-material-ui-textfield'
import { FontAwesome, Fontisto, EvilIcons, Feather, Ionicons, MaterialIcons, Foundation } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserAction } from "../../store/actions/userActions"
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { fetchApi } from '../../functions';
import { COLORS } from '../../styles/COLORS';
import ErrorModal from '../../components/app/ErrorModal';

export default function RegisterScreen() {
          const dispatch = useDispatch()
          const navigation = useNavigation()
          const [loading, setLoading] = useState(false);
          const nomInputRef = useRef(null)
          const prenomInputRef = useRef(null)
          const telRef = useRef(null)
          const emailInputRef = useRef(null)
          const passwordInputRef = useRef(null)
          const password_confirmInputRef = useRef(null)
          const [showModal, setShowModal] = useState(false)
          const [data, handleChange, setValue] = useForm({
                    nom: "",
                    prenom: "",
                    email: "",
                    telephone: "",
                    password: "",
                    password_confirm: "",

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
                    password: {
                              required: true,
                              length: [8]
                    },
                    telephone: {
                              required: true,
                              length: [8]
                    },
                    password_confirm: {
                              required: true,
                              length: [8],
                              match: "password"
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
                    },
                    password: {
                              required: "Le mot de passe est obligatoire",
                              length: "Mot de passe trop court"
                    },
                    password_confirm: {
                              required: "Ce champ est obligatoire",
                              length: "Mot de passe trop court",
                              match: "Les mots de passe ne correspondent pas"
                    }
          })

          const enregistrement = async () => {
                    setLoading(true)

                    try {
                              const res = await fetchApi("/auth/users", {
                                        method: 'POST',
                                        body: JSON.stringify({
                                                  NOM: data.nom,
                                                  PRENOM: data.prenom,
                                                  EMAIL: data.email,
                                                  TELEPHONE: data.telephone,
                                                  PASSWORD: data.password,
                                                  DEVICE: Platform.OS === 'ios' ? 1 : 0
                                        }),
                                        headers: { "Content-Type": "application/json" },
                              })
                              setShowModal(true)
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
                              {showModal && <ErrorModal type='success' title='Compte crée avec succès' body="Votre compte a été crée avec succès, l'administrateur va confirmer votre compte" handleTitle='Ok'  onClose={() => {
                                        setShowModal(false)
                                        navigation.goBack()
                                        navigation.navigate("LoginScreen")
                              }}/>}
                              <View style={styles.container}>
                                        <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: "#fff"}}>
                                                  <View>
                                                            <View style={styles.cardTitle}>
                                                                      <Text style={styles.Title}>Inscription</Text>
                                                            </View>
                                                            <View style={styles.inputCard}>
                                                                      <View>
                                                                                <OutlinedTextField
                                                                                          label="Nom"
                                                                                          fontSize={14}
                                                                                          baseColor={COLORS.smallBrown}
                                                                                          tintColor={COLORS.primary}
                                                                                          containerStyle={{ borderRadius: 20 }}
                                                                                          lineWidth={1}
                                                                                          activeLineWidth={1}
                                                                                          errorColor={COLORS.error}
                                                                                          renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('nom') ? COLORS.error : "#a2a2a2"} />}
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
                                                                      </View>

                                                            </View>

                                                            <View style={styles.inputCard}>
                                                                      <View>
                                                                                <OutlinedTextField
                                                                                          label="Prénom"
                                                                                          fontSize={14}
                                                                                          baseColor={COLORS.smallBrown}
                                                                                          tintColor={COLORS.primary}
                                                                                          lineWidth={1}
                                                                                          activeLineWidth={1}
                                                                                          errorColor={COLORS.error}
                                                                                          renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('prenom') ? COLORS.error : "#a2a2a2"} />}
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
                                                                      </View>
                                                            </View>
                                                            <View style={styles.inputCard}>
                                                                      <View>
                                                                                <OutlinedTextField
                                                                                          label="Téléphone"
                                                                                          fontSize={14}
                                                                                          baseColor={COLORS.smallBrown}
                                                                                          tintColor={COLORS.primary}
                                                                                          lineWidth={1}
                                                                                          activeLineWidth={1}
                                                                                          errorColor={COLORS.error}
                                                                                          renderRightAccessory={() => <Feather name="phone" size={24} color={hasError('telephone') ? COLORS.error : "#a2a2a2"} />}
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
                                                                      </View>
                                                            </View>

                                                            <View style={styles.inputCard}>
                                                                      <View>
                                                                                <OutlinedTextField
                                                                                          label="Adresse email"
                                                                                          fontSize={14}
                                                                                          baseColor={COLORS.smallBrown}
                                                                                          tintColor={COLORS.primary}
                                                                                          lineWidth={1}
                                                                                          activeLineWidth={1}
                                                                                          errorColor={COLORS.error}
                                                                                          renderRightAccessory={() => <Fontisto name="email" size={20} color={hasError('email') ? COLORS.error : "#a2a2a2"} />}
                                                                                          value={data.email}
                                                                                          onChangeText={(newValue) => handleChange('email', newValue)}
                                                                                          onBlur={() => checkFieldData('email')}
                                                                                          error={hasError('email') ? getError('email') : ''}
                                                                                          ref={emailInputRef}
                                                                                          onSubmitEditing={() => {
                                                                                                    passwordInputRef.current.focus()
                                                                                          }}
                                                                                          autoCompleteType='off'
                                                                                          returnKeyType="next"
                                                                                          blurOnSubmit={false}
                                                                                />
                                                                      </View>

                                                            </View>

                                                            <View style={styles.inputCard}>
                                                                      <View>
                                                                                <OutlinedTextField
                                                                                          label="Mot de passe"
                                                                                          fontSize={14}
                                                                                          baseColor={COLORS.smallBrown}
                                                                                          tintColor={COLORS.primary}
                                                                                          secureTextEntry
                                                                                          lineWidth={1}
                                                                                          activeLineWidth={1}
                                                                                          errorColor={COLORS.error}
                                                                                          renderRightAccessory={() => <EvilIcons name="lock" size={30} color={hasError('password') ? COLORS.error : "#a2a2a2"} />}
                                                                                          value={data.password}
                                                                                          onChangeText={(newValue) => handleChange('password', newValue)}
                                                                                          onBlur={() => checkFieldData('password')}
                                                                                          error={hasError('password') ? getError('password') : ''}
                                                                                          ref={passwordInputRef}
                                                                                          onSubmitEditing={() => {
                                                                                                    password_confirmInputRef.current.focus()
                                                                                          }}
                                                                                          autoCompleteType='off'
                                                                                          returnKeyType="next"
                                                                                          blurOnSubmit={false}
                                                                                />
                                                                      </View>

                                                            </View>

                                                            <View style={styles.inputCard}>
                                                                      <View>
                                                                                <OutlinedTextField
                                                                                          label="Confirmer le mot de passe"
                                                                                          fontSize={14}
                                                                                          baseColor={COLORS.smallBrown}
                                                                                          tintColor={COLORS.primary}
                                                                                          secureTextEntry
                                                                                          lineWidth={1}
                                                                                          activeLineWidth={1}
                                                                                          errorColor={COLORS.error}
                                                                                          renderRightAccessory={() => <EvilIcons name="lock" size={30} color={hasError('password_confirm') ? COLORS.error : "#a2a2a2"} />}
                                                                                          value={data.password_confirm}
                                                                                          onChangeText={(newValue) => handleChange('password_confirm', newValue)}
                                                                                          onBlur={() => checkFieldData('password_confirm')}
                                                                                          error={hasError('password_confirm') ? getError('password_confirm') : ''}
                                                                                          ref={password_confirmInputRef}
                                                                                />
                                                                      </View>

                                                            </View>
                                                            <TouchableWithoutFeedback
                                                                      disabled={!isValidate()}
                                                                      onPress={enregistrement}>
                                                                      <View style={[styles.button, !isValidate() && { opacity: 0.5 }]}>
                                                                                <Text style={styles.buttonText}>S'inscrire</Text>
                                                                      </View>
                                                            </TouchableWithoutFeedback>
                                                  </View>
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
                    backgroundColor: COLORS.primary,
                    marginHorizontal: 20
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
          },
          errorss: {
                    fontSize: 12,
                    color: "red"
          }
})