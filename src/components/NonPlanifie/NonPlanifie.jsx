import React, { useEffect, useState, useRef } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from './styles';
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from "@expo/vector-icons"
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { Button, Icon, Input, NativeBaseProvider, TextArea, useToast } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { primaryColor } from '../Welcome/styles';
import { useNavigation } from '@react-navigation/core';
import { fetchApi } from '../../functions'
import { useSelector, useDispatch } from 'react-redux'
import { userSelector } from '../../store/selectors/userSelector'
import { affectationsSeletor } from '../../store/selectors/affectationsSelector';
import { FontAwesome } from '@expo/vector-icons';
import { loadAffectations } from '../../store/actions/affectationsActions';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import Skeleton from '../Skeleton/Skeleton';
import moment from 'moment';


export const Skeletons = () => {
          const fakeElements = []
          for (let i = 1; i <= 20 ; i++) {
                    fakeElements.push(i)
          }
          return (
          <View style={{alignItems:"center", paddingTop: 15}}>
                    {fakeElements.map((fe, i) => <View key={i.toString()} style={{backgroundColor: '#e8e7e7', padding: 10, width: '100%', borderRadius: 10, flexDirection: 'row', marginTop: i > 0 ? 10 : 0}}>
                              <Skeleton style={{width:30, height: 30, borderRadius: 50, backgroundColor: '#fff'}} />
                              <View style={{flex: 1, marginLeft: 5}}>
                                        <Skeleton style={{flex: 1, height: 20, borderRadius: 2, backgroundColor: '#fff'}} />
                                        <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 5}}>
                                                  <Skeleton style={{width:'30%', height: 10, borderRadius: 2, backgroundColor: '#fff'}} />
                                                  <Skeleton style={{width:'30%', height: 10, borderRadius: 2, backgroundColor: '#fff'}} />
                                        </View>
                              </View>
                    </View>)}
          </View>
          )
}

export default function NonPlanifie() {
          const toast = useToast()
          const navigation = useNavigation()
          const [loading, setLoading] = useState(false)
          const user = useSelector(userSelector)
          const dispatch = useDispatch()
          const affectations = useSelector(affectationsSeletor)

          
          // projet select
          const projectModalizeRef = useRef(null);
          const [projet, setProjet] = useState(null);
          const openProjectModalize = () => {
                    projectModalizeRef.current?.open();
          };
          const setSelectedProject = (project) => {
                    projectModalizeRef.current?.close();
                    setProjet(project)
          }

          // tache select
          const tacheModalizeRef = useRef(null);
          const [tacheValue, setTacheValue] = useState(null); 
          const openTacheModalize = () => {
                    tacheModalizeRef.current?.open();
          };
          const setSelectedTache = (tache) => {
                    tacheModalizeRef.current?.close();
                    setTacheValue(tache)
          }

          // dateDebut datePicker
          const [dateDebut, setDateDebut] = useState(new Date()); 
          const [showDateDebut, setShowDateDebut] = useState(false);
          const onChangeDateDebut = (event, selectedDate) => {
                    const currentDate = selectedDate || dateDebut;
                    setShowDateDebut(Platform.OS === "ios");
                    setDateDebut(currentDate);
          };
          
          // dateFin datePicker
          const [dateFin, setDateFin] = useState(new Date()); 
          const [showDateFin, setShowDateFin] = useState(false);
          const onChangeDateFin = (event, selectedDate) => {
                    const currentDate = selectedDate || dateFin;
                    setShowDateFin(Platform.OS === "ios");
                    setDateFin(currentDate);
          };

          // activite, nbr heures, commentaire
          const [activite, setActivite] = useState('')
          const [NbHeures, setHeures] = useState('')
          const [comment, setComment] = useState('')

          const isValid = projet && projet != '' && tacheValue && tacheValue != '' && activite != '' && NbHeures != ''
          
          const submitForm = async () => {
                    setLoading(true)
                    try {
                              const affectationData = {
                                        IDTache: tacheValue.value,
                                        DescActivite: activite,
                                        DateDebutAct: (moment(dateDebut).format('YYYY/MM/DD HH:mm:ss')),
                                        DateFinPrev: (moment(dateFin).format('YYYY/MM/DD HH:mm:ss')),
                                        created_by: user.userid,
                                        NbHeureEstimees: NbHeures,
                                        Commentaires: comment,
                                        IDEmploye: user.collaboId,
                              }
                              const newAffectation = await fetchApi('/Enregistre_Activite', {
                                        method: 'POST',
                                        body: JSON.stringify(affectationData),
                                        headers: {
                                                  'Content-Type': 'application/json'
                                        }
                              });
                              const te = {...newAffectation, ...{
                                        DescActivite: activite,
                                        DateDebutAff: new Date(dateDebut),
                                        DateFin: new Date(dateFin),
                                        IDActivite: newAffectation.IDActivite
                               }}
                              // await AsyncStorage.setItem('affectations', JSON.stringify({ affectations: [te, ...affectations] }))
                              // dispatch(prependAffectationsAction(te))
                              dispatch(loadAffectations(user.collaboId))
                              setLoading(false)
                              navigation.goBack()
                              toast.show({
                                        title: "Ajout d'une affectation réussi",
                                        placement: "bottom",
                                        status: 'success',
                                        duration: 2000
                              })
                    } catch(error) {
                              console.log(error)
                              setLoading(false)
                              toast.show({
                                        title: "Affectation non ajouté",
                                        placement: "bottom",
                                        status: 'error',
                                        duration: 2000
                              })
                    }
          }

          const ProjectsList = () => {
                    const [projects, setProjects] = useState([])
                    const [loadingProjets, setLoadingProjets] = useState(true)
                    const [searchProject, setSearchProject] = useState('')
                    const [filtered, setFiltered] = useState([])
                    const componentMounted = useRef(true)
          
                    useEffect(() => {
                              (async function() {
                                        const projets = await fetchApi('/projet_get');
                                        if(componentMounted.current) {
                                                  setLoadingProjets(false)
                                                  setProjects(projets)
                                        }
                              })()
                              return () => {
                                        componentMounted.current = false;
                              }
                    }, [])
                    useEffect(() => {
                              if(searchProject != '') {
                                        const filtered = projects.filter(project => {
                                                  return project.label.toLowerCase().includes(searchProject.toLowerCase())
                                        })
                                        setFiltered(filtered)
                              }
                    }, [searchProject])
                    const itemsToShow = searchProject == '' ? projects : filtered
                    return (
                              <View style={styles.modalContent}>
                                        <View>
                                                  <Input value={searchProject} onChangeText={(value) => setSearchProject(value)} mt={2} placeholder="Chercher un projet" size='lg' py={2} InputLeftElement={
                                                            <Icon
                                                                      as={<Feather name="search" size={24} color="black" />}
                                                                      size={5}
                                                                      ml="2"
                                                                      color="muted.400"
                                                            />}
                                                  />
                                        </View>
                                        <View style={styles.modalList}>
                                                  {loadingProjets ? <Skeletons /> :
                                                   itemsToShow.map(project => {
                                                            return <TouchableOpacity onPress={() => setSelectedProject(project)} style={styles.modalItem} key={project.value}>
                                                                                <FontAwesome name="dot-circle-o" size={20} color="#777" />
                                                                                <Text numberOfLines={1} style={styles.modalText}>{project.label}</Text>
                                                                      </TouchableOpacity>
                                                  })}
                                        </View>
                              </View>
                    )
          }

          const TacheList = () => {
                    const [taches, setTacheItems] = useState([])
                    const [loadingTache, setLoadingTache] = useState(false)
                    const [searchTache, setSearchTache] = useState('')
                    const [filteredTaches, setFilteredTaches] = useState([])
                    const componentMounted = useRef(true)
          
                    useEffect(() => {
                              if(projet) {
                                        (async function() {
                                                  setLoadingTache(true)
                                                  const taches = await fetchApi(`/Taches_get/${projet.value}`);
                                                  if(componentMounted.current) {
                                                            setTacheItems(taches)
                                                            setLoadingTache(false)
                                                  }
                                        })()
                                        return () => {
                                                  componentMounted.current = false;
                                        }
                              }
                    }, [projet])
                    useEffect(() => {
                              if(searchTache != '') {
                                        const filtered = taches.filter(tahce => {
                                                  return tahce.label.toLowerCase().includes(searchTache.toLowerCase())
                                        })
                                        setFilteredTaches(filtered)
                              }
                    }, [searchTache])
                    const itemsToShow = searchTache == '' ? taches : filteredTaches
                    return (
                              <View style={styles.modalContent}>
                                        {!projet ? <View style={{height: '100%', alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}>
                                                  <AntDesign name="warning" size={24} color="black" />
                                                  <Text style={{fontSize: 16}}>Veuillez sélectionné le projet</Text>
                                                  </View>
                                                  :
                                        <>
                                        <View>
                                                  <Input value={searchTache} onChangeText={(value) => setSearchTache(value)} mt={2} placeholder="Chercher une tâche" size='lg' py={2} InputLeftElement={
                                                            <Icon
                                                                      as={<Feather name="search" size={24} color="black" />}
                                                                      size={5}
                                                                      ml="2"
                                                                      color="muted.400"
                                                            />}
                                                  />
                                        </View>
                                        <View style={styles.modalList}>
                                                  {loadingTache ? <Skeletons /> :
                                                  itemsToShow.map(tache => {
                                                            return <TouchableOpacity onPress={() => setSelectedTache(tache)} style={styles.modalItem} key={tache.value}>
                                                                                <FontAwesome name="dot-circle-o" size={20} color="#777" />
                                                                                <Text numberOfLines={1} style={styles.modalText}>{tache.label}</Text>
                                                                      </TouchableOpacity>
                                                  })}
                                        </View>
                                        </>}
                              </View>
                    )
          }

          return (
                    <NativeBaseProvider>
                              <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                                <Text style={styles.label}>Projet</Text>
                                        </View>
                                        <TouchableOpacity onPress={openProjectModalize} style={styles.openModalize}>
                                                  <Text style={styles.openModalizeLabel} numberOfLines={1}>{projet ? projet.label :  'Selectionner un projet'}</Text>
                                                  <AntDesign name="caretdown" size={16} color="#777" />
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                                <Text style={styles.label}>Tâche</Text>
                                        </View>
                                        <TouchableOpacity onPress={openTacheModalize} style={styles.openModalize}>
                                                  <Text style={styles.openModalizeLabel} numberOfLines={1}>{tacheValue ? tacheValue.label :  'Selectionner une tâche'}</Text>
                                                  <AntDesign name="caretdown" size={16} color="#777" />
                                        </TouchableOpacity>
                                        <Input value={activite} onChangeText={(value) => setActivite(value)} mt={2} placeholder="Activité" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<Feather name="activity" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <TouchableOpacity style={styles.datePickerButton}  onPress={() => setShowDateDebut(true)}>
                                                  <View style={styles.iconDebutName}>
                                                            <MaterialIcons name="calendar-today"  size={24} color="#777" style={styles.icon} />
                                                            <Text style={styles.debutName}>Date début</Text>
                                                  </View>
                                                  <View style={styles.rightDate}>
                                                            <Text style={styles.rightDateText}>{`${dateDebut.getDate()}/${dateDebut.getMonth() + 1}/${dateDebut.getFullYear()}`}</Text>
                                                  </View>
                                        </TouchableOpacity>
                                        {showDateDebut && (
                                                  <DateTimePicker
                                                            testID="dateTimePicker"
                                                            value={dateDebut}
                                                            mode='date'
                                                            is24Hour={true}
                                                            display="default"
                                                            onChange={onChangeDateDebut}
                                                  />
                                        )}
                                        <TouchableOpacity style={styles.datePickerButton}  onPress={() => setShowDateFin(true)}>
                                                  <View style={styles.iconDebutName}>
                                                            <MaterialIcons name="calendar-today"  size={24} color="#777" style={styles.icon} />
                                                            <Text style={styles.debutName}>Date fin</Text>
                                                  </View>
                                                  <View style={styles.rightDate}>
                                                            <Text style={styles.rightDateText}>{`${dateFin.getDate()}/${dateFin.getMonth() + 1}/${dateFin.getFullYear()}`}</Text>
                                                  </View>
                                        </TouchableOpacity>
                                        {showDateFin && (
                                                  <DateTimePicker
                                                            testID="dateTimePicker"
                                                            value={dateFin} mode='date'
                                                            is24Hour={true} display="default"
                                                            onChange={onChangeDateFin}
                                                  />
                                        )}
                                        <Input keyboardType='number-pad'  value={NbHeures} onChangeText={(value) => setHeures(value)} mt={2} placeholder="NbHeures estimés" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<MaterialIcons name="access-time" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <TextArea  value={comment} onChangeText={(value) => setComment(value)} mt={2} placeholder="Commentaire" size='lg' pt={0} InputLeftElement={
                                                  <Icon
                                                            as={<MaterialCommunityIcons name="comment-outline" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <View style={styles.actions}>
                                                  <Button
                                                            isDisabled={!isValid}
                                                            isLoading={loading}
                                                            onPress={submitForm}
                                                            size='lg' w="full" mt={10}
                                                            style={styles.login} py={4} backgroundColor={primaryColor} _text={{ fontSize: 18}} borderRadius={10}
                                                            >Enregistrer</Button>
                                        </View>
                              </ScrollView>
                              <Portal>
                                        <Modalize ref={projectModalizeRef}  >
                                                  <ProjectsList />
                                        </Modalize>
                              </Portal>
                              <Portal>
                                        <Modalize ref={tacheModalizeRef}  >
                                                  <TacheList />
                                        </Modalize>
                              </Portal>
                    </NativeBaseProvider>
                    )
}