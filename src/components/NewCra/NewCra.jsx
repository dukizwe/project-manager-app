import React, { useContext } from 'react'

import { NativeBaseProvider, Button, TextArea, Icon, Switch, HStack, ScrollView, useToast, Modal,} from 'native-base'
import { View, Text, TouchableWithoutFeedback, ActivityIndicator, TouchableOpacity, TouchableNativeFeedback} from 'react-native'
import { MaterialIcons } from "@expo/vector-icons"
import { useNavigation, useRoute } from '@react-navigation/core'
import { useState } from 'react'
import planifieStyles from '../NonPlanifie/styles'
import { AntDesign } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker'
import { primaryColor } from '../Welcome/styles';
import { CraContext } from '../../context/CraContext'
import useFetch from '../../hooks/useFecth'
import { fetchApi } from '../../functions'
import { loadCrasAction } from '../../store/actions/craActions'
import { loadAffectations } from '../../store/actions/affectationsActions'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { crasSeletor } from '../../store/selectors/crasSelector'
import { userSelector } from '../../store/selectors/userSelector'
import styles from './styles'
import moment from 'moment'

export default function NewCra({ activite }) {
          const navigation = useNavigation()
          const route = useRoute()
          const toast = useToast()
          const { affectation } = route.params
          const dispatch = useDispatch()
          const cras = useSelector(crasSeletor)
          const user = useSelector(userSelector)

          const isView = activite ? true : false // determine if is to view or to add new

          const [loading, setLoading] = useState(false)

          const IDActivite = activite ? activite.IDActivite : affectation.IDActivite

          const dateToday = isView ? new Date(activite.DATE_SAISIE_CRA) : new Date();
          const [loadingActivite, selectedActivite] = useFetch('/cr_activite/'+IDActivite)
          const [realise, setRealise] = useState(activite ? activite.Realisation : '')
          const [reste, setReste] = useState(activite ? activite.RESTE_A_FAIRE : '')
          const inEdit = useContext(CraContext)?.inEdit
          const fakeheuresDebut = []
          const fakeheuresFin = []
          for(let i = 7; i <= 18; i++ ) {
                    const date = new Date()
                    date.setHours(i, 30)
                    // const value = date.toJSON().slice(0, 19).replace('T', ' ')
                    const heure = { label: `${i}:30:00`, value: date }
                    fakeheuresDebut.push(heure)
          }
          for(let i = 8; i <= 18; i++ ) {
                    const date = new Date()
                    date.setHours(i, 30)
                    // const value = date.toJSON().slice(0, 19).replace('T', ' ')
                    const heure = { label: `${i}:30:00`, value: date }
                    fakeheuresFin.push(heure)
          }

          //heures de debut
          const [showDebut, setShowDebut] = useState(false)
          const getLabel = date => (parseInt(date.substring(0, 2))).toString()
          const [selectedDebut, setSelectedDebut] = useState({
                    label: isView ? `${getLabel(activite.Debut)}:30:00` : '7:30:00',
                    value: activite ? (new Date()).setHours(getLabel(activite.Debut), 30) : (new Date()).setHours(7, 30)
          })

          // heures de fin
          const [showFin, setShowFin] = useState(false)
          const [selectedFin, setSelectedFin] = useState({
                    label: isView ? `${getLabel(activite.FIN)}:30:00` : '8:30:00',
                    value: activite ? (new Date()).setHours(getLabel(activite.FIN), 30) : (new Date()).setHours(8, 30)
          })

          const [statut, setStatut] = useState(false)

          const isValid = realise != '' && selectedDebut != '' && selectedFin != '' && (reste != '' || statut == true)
          
          const onSubmit = async () => {
                    setLoading(true)
                    const data = {
                              // EMAIL_COLLABO: 'email@gm.com',
                              // DATE_CRA: new Date().toJSON().slice(0, 19).replace('T', ' '),
                              // DATE_SAISIE_CRA: new Date().toJSON().slice(0, 19).replace('T', ' '),
                              ID_COLLABO: user.collaboId,
                              ID_ACTIVITE: IDActivite,
                              REALISATION: realise,
                              HEURE_DEBUT: (moment(selectedDebut.value).format('YYYY/MM/DD HH:mm:ss')),
                              HEURE_FIN: (moment(selectedFin.value).format('YYYY/MM/DD HH:mm:ss')),
                              RESTE_A_FAIRE: reste,
                              ACTIVITE_FINIE: statut
                    }
                    if(inEdit) {
                              try {
                                        let activiteResponse = await fetchApi('/cras/'+activite.ID_CRA, {
                                                  method: 'PUT',
                                                  body: JSON.stringify(data),
                                                  headers: {
                                                            'Content-Type': 'application/json'
                                                  }
                                        });
                                        activiteResponse.Activite = selectedActivite[0] ? selectedActivite[0].label : 'Activité',
                                        activiteResponse.ActiviteFinie = statut
                                        /* if(setActivite) {
                                                  setActivite(activiteResponse)
                                        } */
                                        /* await AsyncStorage.removeItem('cras')
                                        dispatch(prependCrasAction(activiteResponse)) */
                                        dispatch(loadCrasAction(user.collaboId))
                                        dispatch(loadAffectations(user.collaboId))
                                        navigation.navigate('CraTab')
                                        toast.show({
                                                  title: "Modification du CRA réussi",
                                                  placement: "bottom",
                                                  status: 'success',
                                                  duration: 2000
                                        })
                              } catch (error) {
                                        console.log(error)
                                        toast.show({
                                                  title: "CRA non modifié",
                                                  placement: "bottom",
                                                  status: 'error',
                                                  duration: 2000
                                        })
                              }
                    } else {
                              try {
                                        let activiteResponse = await fetchApi('/Enregistre_cra', {
                                                  method: 'POST',
                                                  body: JSON.stringify(data),
                                                  headers: {
                                                            'Content-Type': 'application/json'
                                                  }
                                        });
                                        activiteResponse.Activite = selectedActivite[0] ? selectedActivite[0].label : 'Activité',
                                        activiteResponse.DATE_SAISIE_CRA = new Date()
                                        activiteResponse.ActiviteFinie = statut
                                        /*  if(statut && setAffectation) {
                                                  setAffectation(aff => ({...aff, ActiviteFinie: 1}))
                                        }
                                        await AsyncStorage.setItem('cras', JSON.stringify({ cras: [activiteResponse, ...cras] }))
                                        */
                                        dispatch(loadCrasAction(user.collaboId))
                                        dispatch(loadAffectations(user.collaboId))
                                        navigation.navigate('CraTab')
                                        toast.show({
                                                  title: "Ajout du CRA réussi",
                                                  placement: "bottom",
                                                  status: 'success',
                                                  duration: 2000
                                        })
                              } catch (error) {
                                        console.log(error, data)
                                        toast.show({
                                                  title: "CRA non ajouté",
                                                  placement: "bottom",
                                                  status: 'error',
                                                  duration: 2000
                                        })
                              }
                    }
                    setLoading(false)
          }
          /**
           * Determiner si on peut activer ou non le bouton d'envoi
           * @returns { bool }
           */
          const canIDisabled = () => {
                    if(isView) {
                              if(inEdit && isValid) {
                                        return false
                              }
                              return true
                    } else {
                              if(!isValid) {
                                        return true
                              }
                    }
          }

          const DateDebutModal = () => {
                    const chooseDateDebut = (heure) => {
                              setSelectedDebut(heure)
                              setShowDebut(false)
                    }
                    return (
                              <Modal isOpen={showDebut} onClose={() => setShowDebut(false)} size='xl'>
                                        <Modal.Content maxWidth="400px">
                                                  <Modal.CloseButton />
                                                  <Modal.Body style={{marginTop: 15}}>
                                                            {fakeheuresDebut.map(heure =>
                                                                      <TouchableNativeFeedback
                                                                                key={heure.label}
                                                                                accessibilityRole="button"
                                                                                onPress={() => chooseDateDebut(heure)}
                                                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', false)}>
                                                                                          <View style={styles.heureModalItem}>
                                                                                                    <View style={styles.checkSqaure}>{selectedDebut.label == heure.label && <AntDesign name="check" size={15} color="black" />}</View>
                                                                                                    <Text style={styles.heureLabel}>{heure.label}</Text>
                                                                                                    {/* <Text>{ moment(heure.value).format() }</Text> */}
                                                                                          </View>
                                                                      </TouchableNativeFeedback>)}
                                                  </Modal.Body>
                                        </Modal.Content>
                              </Modal>
                    )
          }
          const DateFinModal = () => {
                    const chooseDateFin = (heure) => {
                              setSelectedFin(heure)
                              setShowFin(false)
                    }
                    return (
                              <Modal isOpen={showFin} onClose={() => setShowFin(false)} size='xl'>
                                        <Modal.Content maxWidth="400px">
                                                  <Modal.CloseButton />
                                                  <Modal.Body style={{marginTop: 15}}>
                                                            {fakeheuresFin.map(heure =>
                                                                      <TouchableNativeFeedback
                                                                                key={heure.label}
                                                                                accessibilityRole="button"
                                                                                onPress={() => chooseDateFin(heure)}
                                                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', false)}>
                                                                                          <View style={styles.heureModalItem}>
                                                                                                    <View style={styles.checkSqaure}>{selectedFin.label == heure.label && <AntDesign name="check" size={15} color="black" />}</View>
                                                                                                    <Text style={styles.heureLabel}>{heure.label}</Text>
                                                                                          </View>
                                                                      </TouchableNativeFeedback>)}
                                                  </Modal.Body>
                                        </Modal.Content>
                              </Modal>
                    )
          }
          return (
                   
                    <NativeBaseProvider>
                              <ScrollView style={planifieStyles.container} keyboardShouldPersistTaps='always'>
                                        <View style={planifieStyles.datePickerButton}>
                                                  <View style={planifieStyles.iconDebutName}>
                                                            <MaterialIcons name="calendar-today"  size={24} color="#777" style={planifieStyles.icon} />
                                                            <Text style={planifieStyles.debutName}>Date CRA</Text>
                                                  </View>
                                                  <View style={planifieStyles.rightDate}>
                                                            <Text style={planifieStyles.rightDateText}>{`${dateToday.getDate()}/${dateToday.getMonth() + 1}/${dateToday.getFullYear()}`}</Text>
                                                  </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                                <Text style={planifieStyles.label}>Activité</Text>
                                                {loadingActivite && <ActivityIndicator color={primaryColor} isLoading={loadingActivite}/>}
                                        </View>
                                        <DropDownPicker
                                                  items={selectedActivite}
                                                  placeholder={selectedActivite[0] ? selectedActivite[0].label : ''}
                                                  style={{...planifieStyles.selectContainer, zIndex: 1}}
                                                  showArrowIcon={true}
                                                  ArrowUpIconComponent={({ style }) => <AntDesign name="caretup" size={16} color="#777" />}
                                                  ArrowDownIconComponent={({ style }) => <AntDesign name="caretdown" size={16} color="#777" />}
                                                  dropDownContainerStyle={planifieStyles.dropdownBox}
                                                  itemSeparator={true}
                                                  itemSeparatorStyle={{ opacity: 0.1}}
                                                  listItemLabelStyle={{ fontSize: 16}}
                                                  disabled
                                        />
                                        <TextArea  isDisabled={isView && !inEdit}
                                                  value={realise} onChangeText={(newValue) => setRealise(newValue)}
                                                  mt={2} placeholder="Réalisées" size='lg' pt={0} InputLeftElement={
                                                  <Icon
                                                            as={<MaterialIcons name="list-alt" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <Text style={planifieStyles.label}>De</Text>
                                        {isView && !inEdit ? <View style={planifieStyles.openModalize}>
                                                  <Text style={planifieStyles.openModalizeLabel} numberOfLines={1}>{selectedDebut ? selectedDebut.label :  "Selectionner l'heure"}</Text>
                                                  <AntDesign name="caretdown" size={16} color="#777" />
                                        </View> :
                                        <TouchableOpacity onPress={() => setShowDebut(true)} style={planifieStyles.openModalize}>
                                                  <Text style={planifieStyles.openModalizeLabel} numberOfLines={1}>{selectedDebut ? selectedDebut.label :  "Selectionner l'heure"}</Text>
                                                  <AntDesign name="caretdown" size={16} color="#777" />
                                        </TouchableOpacity>}

                                        <Text style={planifieStyles.label}>À</Text>
                                        {isView && !inEdit ? <View style={planifieStyles.openModalize}>
                                                  <Text style={planifieStyles.openModalizeLabel} numberOfLines={1}>{selectedFin ? selectedFin.label :  "Selectionner l'heure"}</Text>
                                                  <AntDesign name="caretdown" size={16} color="#777" />
                                        </View>:
                                        <TouchableOpacity onPress={() => setShowFin(true)} style={planifieStyles.openModalize}>
                                                  <Text style={planifieStyles.openModalizeLabel} numberOfLines={1}>{selectedFin ? selectedFin.label :  "Selectionner l'heure"}</Text>
                                                  <AntDesign name="caretdown" size={16} color="#777" />
                                        </TouchableOpacity>}
                                        <HStack space={4} alignItems="center" style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                                                  <TouchableWithoutFeedback onPress={() => setStatut(e => !e)}>
                                                            <Text style={planifieStyles.label}>Activité finie</Text>
                                                  </TouchableWithoutFeedback>
                                                  <Switch isChecked={statut} onChange={() => setStatut(e => !e)} colorScheme="primary" />
                                        </HStack>
                                        {!statut && <TextArea isDisabled={isView && !inEdit}
                                                  value={reste}  onChangeText={(newValue) => setReste(newValue)}
                                                  mt={2} placeholder="Reste à faire" size='lg' pt={0} InputLeftElement={
                                                  <Icon
                                                            as={<MaterialIcons name="pending-actions" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />}
                                        <View style={planifieStyles.actions}>
                                                  <Button
                                                            isDisabled={canIDisabled()}
                                                            isLoading={loading}
                                                            onPress={onSubmit}
                                                            size='lg' w="full" mt={10}
                                                            style={planifieStyles.login} py={4} backgroundColor={primaryColor} _text={{ fontSize: 18}} borderRadius={10}
                                                            >Enregistrer</Button>
                                        </View>
                              </ScrollView>
                              <DateDebutModal />
                              <DateFinModal />
                    </NativeBaseProvider>
          )
}