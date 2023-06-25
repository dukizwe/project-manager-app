import React, { useContext, useState } from 'react'
import { useNavigation, useRoute } from "@react-navigation/core"
import { MaterialIcons } from '@expo/vector-icons'; 
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Modal, Button, useToast } from 'native-base';
import { fetchApi } from '../../functions';
import { useDispatch, useSelector } from 'react-redux';
import { loadCrasAction } from '../../store/actions/craActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewCra from '../../components/NewCra/NewCra';
import { primaryColor } from '../../components/Welcome/styles';
import { crasSeletor } from '../../store/selectors/crasSelector';
import { userSelector } from '../../store/selectors/userSelector';
import { CraContext } from '../../context/CraContext';

export const ViewCraHeader = () => {
          const navigation = useNavigation()
          const { inEdit, setInEdit, setShowDeleteModal } = useContext(CraContext)
          return <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                              <MaterialIcons name="arrow-back" size={26} color="black" style={{ padding: 10, paddingLeft: 0}} />
                    </TouchableOpacity>
                    <View style={styles.actions}>
                              {!inEdit &&
                              <>
                              <TouchableOpacity style={styles.editAction} onPress={() => setInEdit(true)}>
                                        <MaterialIcons name="edit" size={24} color="#fff" />
                                        <Text style={styles.editText}>Editer</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.deleteAction} onPress={() => setShowDeleteModal(true)}>
                                        <MaterialIcons name="delete" size={24} color="#fff" />
                                        <Text style={styles.deleteText}>Supprimer</Text>
                              </TouchableOpacity>
                              </>}
                    </View>
          </View>
}

export const DeleteModal = () => {
          const { showDeleteModal, setShowDeleteModal } = useContext(CraContext)
          const route = useRoute()
          const navigation = useNavigation()
          const toast = useToast()
          const { activite } = route.params
          const [loading, setLoading] = useState(false)
          const cras = useSelector(crasSeletor)
          const dispatch = useDispatch()
          const user = useSelector(userSelector)
          
          const confirmDelete = async () => {
                    setLoading(true)
                    try {
                              let deleteActive = await fetchApi('/cras/'+activite.ID_CRA, {
                                        method: 'DELETE',
                              });
                              /* const newCras = cras.filter(cra => cra.ID_CRA != activite.ID_CRA)
                              await AsyncStorage.setItem('cras', JSON.stringify({ cras: newCras }))
                              dispatch(addCrasAction(newCras)) */
                              dispatch(loadCrasAction(user.collaboId))
                              navigation.goBack()
                              toast.show({
                                        title: "Suppression CRA réussi",
                                        placement: "bottom",
                                        status: 'success',
                                        duration: 2000
                              })
                    } catch(error) {
                              console.log(error)
                              toast.show({
                                        title: "Impossible de supprimer le CRA",
                                        placement: "bottom",
                                        status: 'error',
                                        duration: 2000
                              })
                    }
                    setLoading(false)
                    setShowDeleteModal(false)
          }

          return (
                    <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} size='xl'>
                              <Modal.Content maxWidth="400px">
                                        <Modal.CloseButton />
                                        <Modal.Header>Supprimer le CRA ?</Modal.Header>
                                        <Modal.Body>
                                                  {activite.Realisation}
                                        </Modal.Body>
                                        <Modal.Footer>
                                                  <Button.Group space={2}>
                                                            <Button
                                                                      variant="ghost"
                                                                      colorScheme="blueGray"
                                                                      onPress={() => {
                                                                                setShowDeleteModal(false)
                                                                      }}>Annuler</Button>
                                                            <Button isLoading={loading} onPress={confirmDelete} backgroundColor={primaryColor}>Supprimer</Button>
                                                  </Button.Group>
                                        </Modal.Footer>
                              </Modal.Content>
                    </Modal>
          )
}

export default function CraViewScreen() {
          const route = useRoute()
          const { activite, setActivite, setState } = route.params
          const [inEdit, setInEdit] = useState(false)
          const [showDeleteModal, setShowDeleteModal] = useState(false)
          return (
                    <CraContext.Provider value={{ inEdit, setInEdit, showDeleteModal, setShowDeleteModal }}>
                              <ViewCraHeader />
                              <NewCra activite={activite} setActivite={setActivite} setState={setState} />
                              <DeleteModal />
                    </CraContext.Provider>
          )
}

const styles = StyleSheet.create({
          header: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 30,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderBottomColor: '#ddd',
                    paddingVertical: 5,
                    borderBottomWidth: 1
          },
          actions: {
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
          },
          editAction: {
                    borderRadius: 10,
                    padding: 5,
                    paddingRight: 10,
                    backgroundColor: primaryColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
          },
          editText: {
                    color: '#fff'
          },
          deleteAction: {
                    borderRadius: 10,
                    padding: 5,
                    paddingRight: 10,
                    backgroundColor: '#c94f4f',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                    marginLeft: 5
          },
          deleteText: {
                    color: '#fff'
          },
})