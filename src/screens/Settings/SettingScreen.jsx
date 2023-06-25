import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, TouchableNativeFeedback, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/core';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Modal } from 'native-base'
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import * as Notifications from 'expo-notifications';
import { primaryColor } from '../../components/Welcome/styles';

export default function SettingScreen() {
          const navigation = useNavigation()
          const [showMessagesModal, setShowModal] = useState(false)
          const [settings, setSettings] = useState({})
          const [prevSettings, setPrevSettings] = useState({})
          const [customMessage, setCustomMessage] = useState(null)
          const MAX_LENGTH = 200
          const handleChange = (newValue) => {
                    setCustomMessage(newValue.slice(0, MAX_LENGTH))
          }
          useEffect(() => {
                    (async () => {
                              // await AsyncStorage.removeItem('settings')
                              const previousSettings = await AsyncStorage.getItem('settings')
                              if(previousSettings) {
                                        setSettings(JSON.parse(previousSettings))
                                        setPrevSettings(JSON.parse(previousSettings))
                              } else {
                                        setSettings({
                                                  notification: true,
                                                  isCustomMessage: false,
                                                  notificationMessage: "C'est déjà 17h, rappelez-vous de compléter ce que vous avez réalisés aujourd'hui"
                                        })
                              }
                    })()
          }, [])
          const toggleNotification = async () => {
                    setSettings(st => ({...st, notification: !st.notification}))
                    if(settings.notification) {
                              // ntazo dushaka
                              await Notifications.cancelAllScheduledNotificationsAsync()
                    } else {
                              // turazishaka
                              await Notifications.cancelAllScheduledNotificationsAsync()
                              await Notifications.scheduleNotificationAsync({
                                        content: {
                                                  title: 'Complétez le CRA',
                                                  body: settings.notificationMessage,
                                                  sticky: true
                                        },
                                        trigger: {
                                                  hour: 17,
                                                  minute: 0,
                                                  repeats: true,
                                        },
                              })
                    }
                    await AsyncStorage.removeItem('settings')
                    await AsyncStorage.setItem('settings', JSON.stringify({...settings, notification: !settings.notification}))
          }
          const TouchOrView = (props) => {
                    if(!settings.notification) {
                              return <View style={{opacity: 0.5}}>{props.children}</View>
                    } else {
                              return <TouchableNativeFeedback
                                        accessibilityRole="button"
                                        background={TouchableNativeFeedback.Ripple('#c9c5c5', false)}
                                        onPress={() => setShowModal(true)}
                              >{props.children}
                              </TouchableNativeFeedback>
                    }
          }
          
          const setMessage = async (message, isCustomMessage = false) => {
                    setShowModal(false)
                    setCustomMessage(null)
                    setSettings(st => ({...st, notificationMessage: message, isCustomMessage}))
                    setPrevSettings(st => ({...st, notificationMessage: message, isCustomMessage}))
                    await Notifications.cancelAllScheduledNotificationsAsync()
                    await Notifications.scheduleNotificationAsync({
                              content: {
                                        title: 'Complétez le CRA',
                                        body: message,
                                        sticky: true
                              },
                              trigger: {
                                        hour: 17,
                                        minute: 0,
                                        repeats: true,
                              },
                    })
                    await AsyncStorage.removeItem('settings')
                    await AsyncStorage.setItem('settings', JSON.stringify({...settings, notificationMessage: message, isCustomMessage}))
          }

          const MessagesModal = () => {
                    const user = useSelector(userSelector)
                    const messages = [
                              "C'est déjà 17h, rappelez-vous de compléter ce que vous avez réalisés aujourd'hui",
                              "Coucou! Il est temps de compléter le CRA",
                              "Bonsoir "+user.lname + ", Rappelez-vous de complétez le CRA"
                    ]
                    return (<Modal isOpen={showMessagesModal} onClose={() => setShowModal(false)} size='xl'>
                              <Modal.Content maxWidth="400px">
                                        <Modal.CloseButton />
                                        <Modal.Body style={{marginTop: 25}}>
                                                  {messages.map((message, i) =>
                                                            <TouchableNativeFeedback
                                                                      key={i.toString()}
                                                                      accessibilityRole="button"
                                                                      onPress={() => {
                                                                                setCustomMessage(null)
                                                                                setMessage(message)
                                                                      }}
                                                                      background={TouchableNativeFeedback.Ripple('#c9c5c5', false)}>
                                                                                <View style={styles.messageModalItem}>
                                                                                          <View style={styles.checkSqaure}>{customMessage == null && settings.notificationMessage == message && <AntDesign name="check" size={15} color="black" />}</View>
                                                                                          <Text style={styles.messageLabel} numberOfLines={2}>{message}</Text>
                                                                                </View>
                                                            </TouchableNativeFeedback>)}
                                                            <TouchableNativeFeedback
                                                                      accessibilityRole="button"
                                                                      onPress={() => {
                                                                                setShowModal(false)
                                                                                if(settings.isCustomMessage) {
                                                                                          setCustomMessage(settings.notificationMessage)
                                                                                } else {
                                                                                          setCustomMessage('')
                                                                                }
                                                                      }}
                                                                      background={TouchableNativeFeedback.Ripple('#c9c5c5', false)}>
                                                                                <View style={styles.messageModalItem}>
                                                                                          <View style={styles.checkSqaure}>{(customMessage != null || settings.isCustomMessage) && <AntDesign name="check" size={15} color="black" />}</View>
                                                                                          <View style={{ flex: 1}}>
                                                                                                    <Text style={styles.messageLabel} numberOfLines={1}>Mon message {prevSettings.isCustomMessage ? `(${prevSettings.notificationMessage})` : ''}</Text>
                                                                                                    {prevSettings.isCustomMessage && <Text style={{fontSize: 12, color: primaryColor, marginLeft: 5}}>Cliquer pour le modifier</Text>}
                                                                                          </View>
                                                                                </View>
                                                            </TouchableNativeFeedback>
                                        </Modal.Body>
                              </Modal.Content>
                    </Modal>)
          }
          return (
                    <View style={styles.settingsContent}>
                              <View  style={styles.header}>
                                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBack}>
                                                  <Ionicons name="arrow-back-outline" size={24} color="black" />
                                        </TouchableOpacity>
                                        <Text style={styles.headerTitle}>Paramètres</Text>
                              </View>
                              <View style={styles.settings}>
                                        <TouchableNativeFeedback
                                                  accessibilityRole="button"
                                                  background={TouchableNativeFeedback.Ripple('#c9c5c5', false)}
                                                  onPress={() => toggleNotification()}
                                        >
                                                  <View style={styles.settingItem}>
                                                            {settings.notification ? <Feather name="bell" size={24} color="black" /> : <Feather name="bell-off" size={24} color="black" />}
                                                            <View style={styles.settingName}>
                                                                      <View style={styles.title}>
                                                                                <Text style={styles.settingTitle}>Notification</Text>
                                                                                <Text numberOfLines={1} style={styles.settingDescription}>Activer ou désactiver les notifications</Text>
                                                                      </View>
                                                            </View>
                                                  </View>
                                        </TouchableNativeFeedback>
                                        <TouchOrView>
                                                  <View>
                                                            <View style={styles.settingItem}>
                                                                      <MaterialCommunityIcons name="comment-outline" size={24} color="#777" />
                                                                      <View style={styles.settingName}>
                                                                                <View style={styles.title}>
                                                                                          <Text style={styles.settingTitle}>Message de notification</Text>
                                                                                          <Text numberOfLines={1} style={styles.settingDescription}>{settings.notificationMessage}</Text>
                                                                                </View>
                                                                      </View>
                                                            </View>
                                                  </View>
                                        </TouchOrView>
                                        {customMessage != null && <View style={{paddingHorizontal: 15, position: 'relative'}}>
                                                  <TextInput value={customMessage} onChangeText={handleChange} style={styles.textInput} placeholder="Ecrivez votre message" multiline  />
                                                  <Text style={styles.maxInput}>{customMessage.length}/{MAX_LENGTH}</Text>
                                                                      <Button isDisabled={customMessage == ''} onPress={t => setMessage(customMessage, true)} size='lg' w="full" style={styles.login} py={3} mt={2} backgroundColor={primaryColor} _text={{ fontSize: 18}} borderRadius={10}>
                                                                                Enregistrer
                                                                      </Button>
                                                  </View>}
                              </View>
                              <MessagesModal />
                    </View>
          )
}