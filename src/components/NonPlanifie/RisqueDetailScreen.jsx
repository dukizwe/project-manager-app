import React, { useEffect, useState, useRef } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, FlatList } from "react-native";
import styles from './styles';
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from "@expo/vector-icons"
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadAffectations } from '../../store/actions/affectationsActions';
import { Modalize } from 'react-native-modalize';
import { Host, Portal } from 'react-native-portalize';
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

export default function RisqueDetailScreen() {
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

           // responsable select
           const responsableModalizeRef = useRef(null);
           const [responsable, setResponsable] = useState(null);
           const openResponsableModalize = () => {
            responsableModalizeRef.current?.open();
           };
           const setSelectedResponsable = (responsable) => {
            responsableModalizeRef.current?.close();
            setResponsable(responsable)
           }

           // equipe select
           const equipeModalizeRef = useRef(null);
           const [equipe, setEquipe] = useState(null);
           const openEquipeModalize = () => {
            equipeModalizeRef.current?.open();
           };
           const setSelectedEquipe = (equipe) => {
            equipeModalizeRef.current?.close();
            setEquipe(equipe)
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
          const [client, setClient] = useState('')
          const [partenaire, setPartenaire] = useState('')
          const [contact, setContact] = useState('')
          const [telephone, setTelephone] = useState('')
          const [avancement, setAvencement] = useState('')
          const [risque, setRisque] = useState('')
          const [impact, setImpact] = useState('')
          const [degre, setDegre] = useState('')
          const [action, setAction] = useState('')
          const [origin, setOrigin] = useState('')
          const [abandon, setAbandon] = useState('')
          const [livrable, setLivrable] = useState('')
          const [commentaire, setCommentaire] = useState('')
          const [priorite, setPriorite] = useState('')

          const isValid = projet && projet != '' && tacheValue && tacheValue != '' && client!='' && partenaire !='' &&  contact!='' && telephone!='' && avancement!='' && risque!=''
                         && impact!='' && degre!='' && action!='' && origin!='' && abandon!='' && livrable!='' && commentaire!='' && priorite!=''
          
          const submitForm = async () => {
                    setLoading(true)
                    try {
                              const risqueData = {
                                        ID_PROJET:projet.value,
                                        CLIENT:client,
                                        IDEmploye:user.userid,
                                        ID_EQUIPE:equipe.value,
                                        ID_TACHE:tacheValue.value,
                                        ORIGINE_DEMANDE:origin,
                                        DEADLINE :(moment(dateDebut).format('YYYY-MM-DD')),
                                        LIVRABLE:livrable,
                                        PRIORITE:priorite,
                                        PARTENAIRE:partenaire,
                                        PERSONE_DE_CONTACT:contact,
                                        TELEPHONE:telephone,
                                        ETAT_AVANCEMENT:avancement,
                                        RISQUE:risque,
                                        DEGRE_RISQUE:degre,
                                        IMPACT:impact,
                                        ACTION:action,
                                        ABANDON:abandon,
                                        COMMENTAIRE:commentaire,
                              }
                              const newRisque = await fetchApi('/risque/add', {
                                        method: 'POST',
                                        body: JSON.stringify(risqueData),
                                        headers: {
                                                  'Content-Type': 'application/json'
                                        }
                              });
                              setLoading(false)
                              navigation.goBack()
                              toast.show({
                                        title: "Ajout d'une risque réussi",
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
//RESPONSABLE
const ResponsableList = () => {
    const [responsables, setResponsables] = useState([])
    const [loadingResponsables, setLoadingResponsables] = useState(true)
    const [searchResponsable, setSearchResponsable] = useState('')
    const [filtered, setFiltered] = useState([])
    const componentMounted = useRef(true)

    useEffect(() => {
              (async function() {
                        const responsables = await fetchApi('/responsable_get');
                        if(componentMounted.current) {
                            setLoadingResponsables(false)
                             setResponsables(responsables)
                        }
              })()
              return () => {
                        componentMounted.current = false;
              }
    }, [])
    useEffect(() => {
              if(searchResponsable != '') {
                        const filtered = responsables.filter(responsable => {
                                  return responsable.label.toLowerCase().includes(searchResponsable.toLowerCase())
                        })
                        setFiltered(filtered)
              }
    }, [searchResponsable])
    const itemsToShow = searchResponsable == '' ? responsables : filtered
    return (
              <View style={styles.modalContent}>
                        <View>
                                  <Input value={searchResponsable} onChangeText={(value) => setSearchResponsable(value)} mt={2} placeholder="Chercher un responsable" size='lg' py={2} InputLeftElement={
                                            <Icon
                                                      as={<Feather name="search" size={24} color="black" />}
                                                      size={5}
                                                      ml="2"
                                                      color="muted.400"
                                            />}
                                  />
                        </View>
                        <View style={styles.modalList}>
                                  {loadingResponsables ? <Skeletons /> :
                                   itemsToShow.map(responsable => {
                                            return <TouchableOpacity onPress={() => setSelectedResponsable(responsable)} style={styles.modalItem} key={responsable.value}>
                                                                <FontAwesome name="dot-circle-o" size={20} color="#777" />
                                                                <Text numberOfLines={1} style={styles.modalText}>{responsable.label}  {responsable.Prenom}</Text>
                                                      </TouchableOpacity>
                                  })}
                        </View>
              </View>
    )
}

//EQUIPE
const EquipeList = () => {
    const [equipes, setEquipes] = useState([])
    const [loadingEquipes, setloadingEquipes] = useState(true)
    const [searchEquipe, setSearchEquipe] = useState('')
    const [filtered, setFiltered] = useState([])
    const componentMounted = useRef(true)

    useEffect(() => {
              (async function() {
                        const equipes = await fetchApi('/equipe_get');
                        if(componentMounted.current) {
                            setloadingEquipes(false)
                             setEquipes(equipes)
                        }
              })()
              return () => {
                        componentMounted.current = false;
              }
    }, [])
    useEffect(() => {
              if(searchEquipe != '') {
                        const filtered = equipes.filter(equipe => {
                                  return equipe.label.toLowerCase().includes(searchEquipe.toLowerCase())
                        })
                        setFiltered(filtered)
              }
    }, [searchEquipe])
    const itemsToShow = searchEquipe == '' ? equipes : filtered
    return (
              <View style={styles.modalContent}>
                        <View>
                                  <Input value={searchEquipe} onChangeText={(value) => setSearchEquipe(value)} mt={2} placeholder="Chercher une equipe " size='lg' py={2} InputLeftElement={
                                            <Icon
                                                      as={<Feather name="search" size={24} color="black" />}
                                                      size={5}
                                                      ml="2"
                                                      color="muted.400"
                                            />}
                                  />
                        </View>
                        <View style={styles.modalList}>
                                  {loadingEquipes ? <Skeletons /> :
                                   itemsToShow.map(equipe => {
                                            return <TouchableOpacity onPress={() => setSelectedEquipe(equipe)} style={styles.modalItem} key={equipe.value}>
                                                                <FontAwesome name="dot-circle-o" size={20} color="#777" />
                                                                <Text numberOfLines={1} style={styles.modalText}>{equipe.label}</Text>
                                                      </TouchableOpacity>
                                  })}
                        </View>
              </View>
    )
}
return (
                   <Host>
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
                                        <Input value={client} onChangeText={(value) => setClient(value)} mt={2} placeholder="Client" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<AntDesign name="user" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <Input value={partenaire} onChangeText={(value) => setPartenaire(value)} mt={2} placeholder="Partenaire" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<AntDesign name="user" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                         <Input value={contact} onChangeText={(value) => setContact(value)} mt={2} placeholder="Personne de contact" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<AntDesign name="user" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                         <Input value={telephone} onChangeText={(value) => setTelephone(value)} mt={2} placeholder="Téléphone" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<Feather name="phone" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                                <Text style={styles.label}>Responsable</Text>
                                        </View>
                                        <TouchableOpacity onPress={openResponsableModalize} style={styles.openModalize}>
                                                  <Text style={styles.openModalizeLabel} numberOfLines={1}>{responsable ? responsable.label :  'Selectionner un responsable'}</Text>
                                                  <AntDesign name="caretdown" size={16} color="#777" />
                                        </TouchableOpacity>
                                        <Input value={avancement} onChangeText={(value) => setAvencement(value)} mt={2} placeholder="Etat d'avancement" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<AntDesign name="arrowsalt" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                                <Text style={styles.label}>Equipe</Text>
                                        </View>
                                        <TouchableOpacity onPress={openEquipeModalize} style={styles.openModalize}>
                                                  <Text style={styles.openModalizeLabel} numberOfLines={1}>{equipe ? equipe.label :  'Selectionner une équipe'}</Text>
                                                  <AntDesign name="caretdown" size={16} color="#777" />
                                        </TouchableOpacity>
                                        <Input value={risque} onChangeText={(value) => setRisque(value)} mt={2} placeholder="Risque" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<MaterialIcons name="dangerous" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <TouchableOpacity style={styles.datePickerButton}  onPress={() => setShowDateFin(true)}>
                                                  <View style={styles.iconDebutName}>
                                                            <MaterialIcons name="calendar-today"  size={24} color="#777" style={styles.icon} />
                                                            <Text style={styles.debutName}>Deadline</Text>
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
                                        <Input value={impact} onChangeText={(value) => setImpact(value)} mt={2} placeholder="Impact" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<Feather name="activity" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <Input value={degre} onChangeText={(value) => setDegre(value)} mt={2} placeholder="Dégre  risque" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<FontAwesome5 name="temperature-low" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <Input value={action} onChangeText={(value) => setAction(value)} mt={2} placeholder="Action" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<MaterialIcons name="call-to-action" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <Input value={origin} onChangeText={(value) => setOrigin(value)} mt={2} placeholder="Origine de demande" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<MaterialCommunityIcons name="origin" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <Input value={abandon} onChangeText={(value) => setAbandon(value)} mt={2} placeholder="Abandon" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<MaterialCommunityIcons name="origin" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <Input value={livrable} onChangeText={(value) => setLivrable(value)} mt={2} placeholder="Livrable" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<MaterialIcons name="delivery-dining" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                         <Input value={priorite} onChangeText={(value) => setPriorite(value)} mt={2} placeholder="Priorité" size='lg' py={2} InputLeftElement={
                                                  <Icon
                                                            as={<MaterialIcons name="low-priority" size={24} color="black" />}
                                                            size={5}
                                                            ml="2"
                                                            color="muted.400"
                                                  />}
                                        />
                                        <TextArea  value={commentaire} onChangeText={(value) => setCommentaire(value)} mt={2} placeholder="Commentaire" size='lg' pt={0} InputLeftElement={
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
                              <Portal>
                                        <Modalize ref={responsableModalizeRef}  >
                                                  <ResponsableList />
                                        </Modalize>
                              </Portal>
                              <Portal>
                                        <Modalize ref={equipeModalizeRef}  >
                                                  <EquipeList />
                                        </Modalize>
                              </Portal>
                    </NativeBaseProvider>
                    </Host>
                    )
}