import { Button, Input, useToast } from 'native-base'
import React from 'react'
import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native'
import { MaterialIcons } from "@expo/vector-icons"
import DateTimePicker from '@react-native-community/datetimepicker';
import { primaryColor } from '../Welcome/styles'
import { fetchApi } from '../../functions'
import { useSelector } from 'react-redux'
import { userSelector } from '../../store/selectors/userSelector'

export default function Suicide() {
          const [projet, setProjet] = useState('')
          const [tache, setTache] = useState('')
          const [date, setDate] = useState(new Date())
          const [showDate, steShowDate] = useState(false);
          const [loading, setLoading] = useState(false)
          const onChangeDate = (event, selectedDate) => {
                    const currentDate = selectedDate || date;
                    steShowDate(Platform.OS === "ios");
                    setDate(currentDate);
          };
          const isValid = projet != '' && tache != '' && date != null
          const toast = useToast()
          const user = useSelector(userSelector)

          const submitForm = async () => {
                    setLoading(true)
                    Keyboard.dismiss()
                    try {
                              const newAffectation = await fetchApi('/suicides', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                                  collaboEmail: user.username,
                                                  projet,
                                                  tache
                                        }),
                                        headers: {
                                                  'Content-Type': 'application/json'
                                        }
                              });
                              setProjet('')
                              setTache('')
                              setDate(new Date())
                              toast.show({
                                        title: "Ajout d'une suicide réussi",
                                        placement: "bottom",
                                        status: 'success',
                                        duration: 2000
                              })
                    } catch (error) {
                              setProjet('')
                              setTache('')
                              setDate(new Date())
                              toast.show({
                                        title: "Suicide non ajouté",
                                        placement: "bottom",
                                        status: 'error',
                                        duration: 2000
                              })
                    }
                    setLoading(false)
          }
          return (
                    <View style={styles.container}>
                              <Input value={projet} onChangeText={(value) => setProjet(value)} mt={2} placeholder="Projet" size='lg' py={2} />
                              <Input value={tache} onChangeText={(value) => setTache(value)} mt={2} placeholder="Tâche" size='lg' py={2} />
                              <TouchableOpacity style={styles.datePickerButton}  onPress={() => steShowDate(true)}>
                                        <View style={styles.iconDebutName}>
                                                  <MaterialIcons name="calendar-today"  size={24} color="#777" style={styles.icon} />
                                                  <Text style={styles.debutName}>Date du suicide</Text>
                                        </View>
                                        <View style={styles.rightDate}>
                                                  {date && <Text style={styles.rightDateText}>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</Text>}
                                        </View>
                              </TouchableOpacity>
                              {showDate && (
                                        <DateTimePicker
                                                  testID="dateTimePicker"
                                                  value={date} mode='date'
                                                  is24Hour={true} display="default"
                                                  onChange={onChangeDate}
                                        />
                              )}
                              <View style={styles.actions}>
                                        <Button
                                                  isDisabled={!isValid}
                                                  isLoading={loading}
                                                  onPress={submitForm}
                                                  size='lg' w="full" mt={10}
                                                  style={styles.login} py={4} backgroundColor={primaryColor} _text={{ fontSize: 18}} borderRadius={10}
                                                  >Enregistrer</Button>
                              </View>
                    </View>
          )
}

const styles = StyleSheet.create({
          container: {
                    padding: 15,
                    backgroundColor: '#fff',
                    height: '100%',
          },
          datePickerButton: {
                    padding: 5,
                    borderWidth: 1,
                    borderColor: '#f1f1f1',
                    marginTop: 10,
                    borderRadius: 5,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
          },
          iconDebutName: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center'
          },
          icon: {
                    marginLeft: 2
          },
})