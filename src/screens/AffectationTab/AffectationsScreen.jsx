import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, Button, BackHandler } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { Input, Menu, useToast } from 'native-base';
import Affectations from '../../components/Affectations/Affectations';
import AddButton from '../../components/AddButton/AddButton';
import { useDispatch, useSelector } from 'react-redux';
import { loadAffectations } from '../../store/actions/affectationsActions';
import { userSelector } from '../../store/selectors/userSelector';
import { FloatingAction } from "react-native-floating-action";
import { primaryColor } from '../../components/Welcome/styles';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

export default function AffectationsScreen() {
  
          const [search, setSearch] = useState('')
          const user = useSelector(userSelector)
          const dispatch = useDispatch()
          const navigation = useNavigation()
          const toast = useToast()
          const onChange = (value) => {
                    setSearch(value)
                    dispatch(loadAffectations(user?.collaboId, value))
          }
          const Action = ({ title, image }) => {
                    return (
                              <View style={styles.action}>
                                        <Text style={styles.actionLabel}>{ title }</Text>
                                        <View style={styles.actionIcon}>
                                                  <Image source={image} style={{tintColor: '#fff', maxWidth: '50%', maxHeight: '50%', minWidth: '50%', minHeight: '50%'}} />
                                        </View>
                              </View>
                    )
          }
          const [actions, setActions] = useState([
                    {
                              text: "Activité non planifié",
                              icon: require("../../../assets/affectation.png"),
                              name: "activite",
                              position: 1,
                              render: () => <Action title={"Activité non planifié"} image={require("../../../assets/affectation.png")} key={"key1"} />
                    },
                    {
                              text: "Suicide",
                              icon: require("../../../assets/suicide.png"),
                              name: "suicide",
                              position: 2,
                              render: () => <Action title={"Suicide"} image={require("../../../assets/suicide.png")} key={"key2"} />
                    },
                    {
                                text: "Actions",
                                icon: require("../../../assets/asterisque.png"),
                                name: "Actions",
                                position: 3,
                                render: () => <Action title={"Action list"} image={require("../../../assets/asterisque.png")} key={"key2"} />
                },
                    {
                              text: "Risque",
                              icon: require("../../../assets/risque.png"),
                              name: "Risque",
                              position: 2,
                              render: () => <Action title={"Risque"} image={require("../../../assets/risque.png")} key={"key2"} />
                    },
          ])
          useEffect(() => {
                    if(!user.presence) {
                              setActions(t => [...t, {
                                        text: "Présence",
                                        icon: require("../../../assets/suicide.png"),
                                        name: "presence",
                                        position: 3,
                                        render: () => <Action title={"Présence"} image={require("../../../assets/qr-code.png")} key={"key3"} />
                              }])
                    } else {
                              setActions(t => t.filter(t => t.name != 'presence'))
                              toast.show({
                                        title: "Présence pris en compte",
                                        placement: "bottom",
                                        status: 'success',
                                        duration: 2000,
                                        maxWidth: '80%'
                              })
                    }
          }, [user])

          return (<>
                    <View style={styles.container}>
                              <View style={styles.titleSearch}>
                                        <Text style={styles.title}>Mes affectations</Text>
                                        {/* <Menu onClose={() => onChange('')} placement='left' style={styles.searchMenu} w="300" trigger={(triggerProps) => {return (
                                                            <TouchableOpacity style={styles.searchButton} {...triggerProps}>
                                                                      <AntDesign name="search1" size={24} color="black" />
                                                            </TouchableOpacity>
                                                            )
                                                  }}
                                                  >
                                                  <Menu.Item>
                                                            <Input autoFocus style={styles.searchInput}  value={search} onChangeText={ onChange} mt={2} placeholder="Recherche..." size='lg' py={2} />
                                                  </Menu.Item>
                                        </Menu> */}
                              </View>
                              <Affectations />
                              <FloatingAction
                                        actions={actions}
                                        onPressItem={name => {
                                                  if(name == 'suicide') {
                                                            navigation.navigate('Suicide')
                                                  }else if(name == 'presence') {
                                                            navigation.navigate('Scan')
                                                  }else if(name == 'Actions'){
                                                        navigation.navigate('ActionsListes')
                                                  }
                                                  
                                                   else if(name == 'Risque') {
                                                            navigation.navigate('Risque')
                                                  }
                                                  else {
                                                    navigation.navigate('NonPlanifie')
                                          }
                                        }}
                                        color={primaryColor}
                              />
                              {/* <AddButton /> */}
                    </View>
          </>)
}

const styles = StyleSheet.create({
          container: {
                    backgroundColor: '#fff',
                    height: '100%',
          },
          titleSearch: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignContent: 'center',
          },
          title: {
                    color: '#333',
                    fontSize: 20,
                    fontWeight: 'bold',
                    paddingLeft: 15,
                    marginVertical: 10
          },
          searchButton: {
                    padding: 20
          },
          input: {
                    borderBottomWidth: 2,
                    borderBottomColor: '#ddd',
          },
          fakeElement: {
                    position: 'absolute',
                    zIndex: 2,
                    backgroundColor: '#00000096',
                    width: '100%',
                    height: '100%'
          },
          searchMenu: {
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                    margin: 0,
                    paddingTop: 0,
          },
          searchInput: {
                    backgroundColor: '#fff',
                    width: '100%'
          },
          action: {
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center'
          },
          actionLabel: {
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    padding : 5,
                    marginRight: 10,
                    fontWeight: 'bold',
          },
          actionIcon: {
                    width: 40,
                    height: 40,
                    backgroundColor: primaryColor,
                    borderRadius: 50,
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center'
          }
});
