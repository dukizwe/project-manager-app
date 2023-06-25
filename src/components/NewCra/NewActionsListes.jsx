import React, { useEffect, useState, useRef, useContext, useCallback } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button, Icon, Input, NativeBaseProvider, TextArea, useToast } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Modalize } from 'react-native-modalize';
import { Host, Portal } from 'react-native-portalize';
import moment from 'moment';
import { AntDesign, Feather, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { primaryColor } from '../Welcome/styles';
import { fetchApi } from '../../functions';
import Skeleton from '../Skeleton/Skeleton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import { ActionContext } from '../../context/ActionContext';

export const Skeletons = () => {
        const fakeElements = []
        for (let i = 1; i <= 20; i++) {
                fakeElements.push(i)
        }
        return (
                <View style={{ alignItems: "center", paddingTop: 15 }}>
                        {fakeElements.map((fe, i) => <View key={i.toString()} style={{ backgroundColor: '#e8e7e7', padding: 10, width: '100%', borderRadius: 10, flexDirection: 'row', marginTop: i > 0 ? 10 : 0 }}>
                                <Skeleton style={{ width: 30, height: 30, borderRadius: 50, backgroundColor: '#fff' }} />
                                <View style={{ flex: 1, marginLeft: 5 }}>
                                        <Skeleton style={{ flex: 1, height: 20, borderRadius: 2, backgroundColor: '#fff' }} />
                                        <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 5 }}>
                                                <Skeleton style={{ width: '30%', height: 10, borderRadius: 2, backgroundColor: '#fff' }} />
                                                <Skeleton style={{ width: '30%', height: 10, borderRadius: 2, backgroundColor: '#fff' }} />
                                        </View>
                                </View>
                        </View>)}
                </View>
        )
}

export default function NewActionsListes({ activite }) {
        const toast = useToast()
        const navigation = useNavigation()
        const user = useSelector(userSelector)
        const dispatch = useDispatch()

        const isView = activite ? true : false // determine if is to view or to add new
        const inEdit = useContext(ActionContext)?.inEdit

        const [client, setClient] = useState(activite ? activite.CLIENT : '')
        const [origine, setOrigine] = useState(activite ? activite.ORIGINE : '')
        const [etat, setEtat] = useState(activite ? parseInt(activite.ETAT) : '')
        const [livrable, setLivrable] = useState(activite ? activite.LIVRABLE : '')
        const [priorite, setPriorite] = useState(activite ? activite.PRIORITE : '')
        const [partenaire, setPartenaire] = useState(activite ? activite.PARTENAIRE : '')
        const [personne, setPersonne] = useState(activite ? activite.PERSONE_DE_CONTACT : '')
        const [telephone, setTelephone] = useState(activite ? parseInt(activite.TELEPHONE) : '')
        const [comment, setComment] = useState(activite ? activite.COMMENTAIRE : '')
        const [loading, setLoading] = useState(false)

        // dateDebut datePicker
        const [dateDebut, setDateDebut] = useState( new Date() );
        const [showDateDebut, setShowDateDebut] = useState(false);
        const onChangeDateDebut = (event, selectedDate) => {
                const currentDate = selectedDate || dateDebut;
                setShowDateDebut(Platform.OS === "ios");
                setDateDebut(currentDate);
        };

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

        // Equipe select
        const equipeModalizeRef = useRef(null);
        const [equipe, setEquipe] = useState(null);
        const openEquipeModalize = () => {
                equipeModalizeRef.current?.open();
        };
        const setSelectedEquipe = (project) => {
                equipeModalizeRef.current?.close();
                setEquipe(project)
        }


        // Responsable select
        const responsableModalizeRef = useRef(null);
        const [responsable, setResponsable] = useState(null);
        const openResponsableModalize = () => {
                responsableModalizeRef.current?.open();
        };
        const setSelectedResponsable = (project) => {
                responsableModalizeRef.current?.close();
                setResponsable(project)
        }

        // const isValid = projet && projet != '' && tacheValue && tacheValue != '' && equipe && equipe != '' && responsable && responsable != '' && client != '' && origine != '' && etat != '' && livrable != '' && priorite != '' && partenaire != '' && personne != '' && telephone != ''

        const submitActions = useCallback(
                async () => {
                        setLoading(true)
                        try {
                                const actionsData = {
                                        IDProjet: projet ? projet.value : activite.IDProjet,
                                        CLIENT: client ? client : activite.CLIENT,
                                        IDTACHE: tacheValue ? tacheValue.value : activite.IDTACHE ,
                                        ORIGINE: origine ? origine : activite.ORIGINE,
                                        IDEmploye: responsable ? responsable.value : activite.IDEmploye ,
                                        ID_EQUIPE: equipe ? equipe.value : activite.ID_EQUIPE ,
                                        DEADLINE: (moment(dateDebut).format('YYYY/MM/DD HH:mm:ss')),
                                        LIVRABLE: livrable ? livrable : activite.LIVRABLE,
                                        PRIORITE: priorite ? priorite : activite.PRIORITE,
                                        PARTENAIRE: partenaire ? partenaire : activite.PARTENAIRE ,
                                        PERSONE_DE_CONTACT: personne ? personne : activite.PERSONE_DE_CONTACT,
                                        TELEPHONE: telephone ? telephone : activite.TELEPHONE,
                                        ETAT: etat ? etat : activite.ETAT,
                                        COMMENTAIRE: comment ? comment : activite.comment,
                                        userid: user.userid
                                }
                                const newAffectation = await fetchApi(`/actions/update/${activite.ID_ACTION}`, {
                                        method: 'PUT',
                                        body: JSON.stringify(actionsData),
                                        headers: {
                                                'Content-Type': 'application/json'
                                        }
                                });
                                setLoading(false)
                                navigation.goBack()
                                navigation.navigate('Home')
                                toast.show({
                                        title: "La modification de l'action est faite avec réussi",
                                        placement: "bottom",
                                        status: 'success',
                                        duration: 2000
                                })
                        }
                        catch (error) {
                                console.log(error)
                                setLoading(false)
                                toast.show({
                                        title: "Affectation non ajouté",
                                        placement: "bottom",
                                        status: 'error',
                                        duration: 2000
                                })
                        }
                },[client,origine,etat,livrable,priorite,partenaire,personne,telephone,comment,projet,tacheValue,equipe,responsable]
        ) 
      

        const ProjectsList = () => {
                const [projects, setProjects] = useState([])
                const [loadingProjets, setLoadingProjets] = useState(true)
                const [searchProject, setSearchProject] = useState('')
                const [filtered, setFiltered] = useState([])
                const componentMounted = useRef(true)

                useEffect(() => {
                        (async function () {
                                const projets = await fetchApi('/projet_get');
                                if (componentMounted.current) {
                                        setLoadingProjets(false)
                                        setProjects(projets)
                                }
                        })()
                        return () => {
                                componentMounted.current = false;
                        }
                }, [])
                useEffect(() => {
                        if (searchProject != '') {
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
                        if (projet) {
                                (async function () {
                                        setLoadingTache(true)
                                        const taches = await fetchApi(`/Taches_get/${projet.value}`);
                                        if (componentMounted.current) {
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
                        if (searchTache != '') {
                                const filtered = taches.filter(tahce => {
                                        return tahce.label.toLowerCase().includes(searchTache.toLowerCase())
                                })
                                setFilteredTaches(filtered)
                        }
                }, [searchTache])
                const itemsToShow = searchTache == '' ? taches : filteredTaches
                return (
                        <View style={styles.modalContent}>
                                {!projet ? <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                                        <AntDesign name="warning" size={24} color="black" />
                                        <Text style={{ fontSize: 16 }}>Veuillez sélectionné le projet</Text>
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

        const EquipeList = () => {
                const [projects, setProjects] = useState([])
                const [loadingProjets, setLoadingProjets] = useState(true)
                const [searchProject, setSearchProject] = useState('')
                const [filtered, setFiltered] = useState([])
                const componentMounted = useRef(true)

                useEffect(() => {
                        (async function () {
                                const projets = await fetchApi('/equipe_get');
                                if (componentMounted.current) {
                                        setLoadingProjets(false)
                                        setProjects(projets)
                                }
                        })()
                        return () => {
                                componentMounted.current = false;
                        }
                }, [])
                useEffect(() => {
                        if (searchProject != '') {
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
                                                        return <TouchableOpacity onPress={() => setSelectedEquipe(project)} style={styles.modalItem} key={project.value}>
                                                                <FontAwesome name="dot-circle-o" size={20} color="#777" />
                                                                <Text numberOfLines={1} style={styles.modalText}>{project.label}</Text>
                                                        </TouchableOpacity>
                                                })}
                                </View>
                        </View>
                )
        }

        const ResponsableList = () => {
                const [projects, setProjects] = useState([])
                const [loadingProjets, setLoadingProjets] = useState(true)
                const [searchProject, setSearchProject] = useState('')
                const [filtered, setFiltered] = useState([])
                const componentMounted = useRef(true)

                useEffect(() => {
                        (async function () {
                                const projets = await fetchApi('/responsable_get');
                                if (componentMounted.current) {
                                        setLoadingProjets(false)
                                        setProjects(projets)
                                }
                        })()
                        return () => {
                                componentMounted.current = false;
                        }
                }, [])
                useEffect(() => {
                        if (searchProject != '') {
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
                                        <Input value={searchProject} onChangeText={(value) => setSearchProject(value)} mt={2} placeholder="Chercher un responsable" size='lg' py={2} InputLeftElement={
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
                                                        return <TouchableOpacity onPress={() => setSelectedResponsable(project)} style={styles.modalItem} key={project.value}>
                                                                <FontAwesome name="dot-circle-o" size={20} color="#777" />
                                                                <Text numberOfLines={1} style={styles.modalText}>{project.label} {project.Prenom}</Text>
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
                                        {isView && !inEdit ? <View style={styles.openModalize}>
                                                <Text style={styles.openModalizeLabel} numberOfLines={1}>{activite ? activite.Projet :'Selectionner un projet'}</Text>
                                                <AntDesign name="caretdown" size={16} color="#777" />
                                        </View>:
                                        <TouchableOpacity onPress={openProjectModalize} style={styles.openModalize}>
                                                <Text style={styles.openModalizeLabel} numberOfLines={1}>{projet ? projet.label : activite.Projet}</Text>
                                                <AntDesign name="caretdown" size={16} color="#777" />
                                        </TouchableOpacity>}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                                <Text style={styles.label}>Equipe</Text>
                                        </View>
                                        {isView && !inEdit ? <View style={styles.openModalize}>
                                                <Text style={styles.openModalizeLabel} numberOfLines={1}>{activite ? activite.NOM_EQUIPE : 'Selectionner une equipe'}</Text>
                                                <AntDesign name="caretdown" size={16} color="#777" />
                                        </View>:
                                        <TouchableOpacity onPress={openEquipeModalize} style={styles.openModalize}>
                                                <Text style={styles.openModalizeLabel} numberOfLines={1}>{equipe ? equipe.label : activite.NOM_EQUIPE}</Text>
                                                <AntDesign name="caretdown" size={16} color="#777" />
                                        </TouchableOpacity>}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                                <Text style={styles.label}>Tâche</Text>
                                        </View>
                                        {isView && !inEdit ? <View style={styles.openModalize}>
                                                <Text style={styles.openModalizeLabel} numberOfLines={1}>{activite ? activite.Taches : 'Selectionner une tâche'}</Text>
                                                <AntDesign name="caretdown" size={16} color="#777" />
                                        </View> :
                                        <TouchableOpacity onPress={openTacheModalize} style={styles.openModalize}>
                                                <Text style={styles.openModalizeLabel} numberOfLines={1}>{tacheValue ? tacheValue.label : activite.Taches}</Text>
                                                <AntDesign name="caretdown" size={16} color="#777" />
                                        </TouchableOpacity>}

                                        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDateDebut(true)}>
                                                <View style={styles.iconDebutName}>
                                                        <MaterialIcons name="calendar-today" size={24} color="#777" style={styles.icon} />
                                                        <Text style={styles.debutName}>Deadline</Text>
                                                </View>
                                                <View style={styles.rightDate}>
                                                        {isView && !inEdit ? <Text style={styles.rightDateText}>{(moment(activite.DEADLINE).format('DD/MM/YYYY'))}</Text>:
                                                        <Text style={styles.rightDateText}>{`${dateDebut.getDate()}/${dateDebut.getMonth() + 1}/${dateDebut.getFullYear()}`}</Text>}
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
                                                        minimumDate={new Date()}
                                                />
                                        )}


                                        <Input isDisabled={isView && !inEdit} value={client} onChangeText={(value) => setClient(value)} mt={2} placeholder="Client" size='lg' py={2} InputLeftElement={
                                                <Icon
                                                        as={<AntDesign name="user" size={24} color="black" />}
                                                        size={5}
                                                        ml="2"
                                                        color="muted.400"
                                                />}
                                        />

                                        <Input isDisabled={isView && !inEdit} value={livrable} onChangeText={(value) => setLivrable(value)} mt={2} placeholder="Livrable" size='lg' py={2} InputLeftElement={
                                                <Icon
                                                        as={<MaterialIcons name="delivery-dining" size={24} color="black" />}
                                                        size={5}
                                                        ml="2"
                                                        color="muted.400"
                                                />}
                                        />
                                        <Input isDisabled={isView && !inEdit} value={origine} onChangeText={(value) => setOrigine(value)} mt={2} placeholder="Origine" size='lg' py={2} InputLeftElement={
                                                <Icon
                                                        as={<MaterialCommunityIcons name="origin" size={24} color="black" />}
                                                        size={5}
                                                        ml="2"
                                                        color="muted.400"
                                                />}
                                        />

                                        <Input isDisabled={isView && !inEdit} value={priorite} onChangeText={(value) => setPriorite(value)} mt={2} placeholder="Priorite" size='lg' py={2} InputLeftElement={
                                                <Icon
                                                        as={<MaterialIcons name="low-priority" size={24} color="black" />}
                                                        size={5}
                                                        ml="2"
                                                        color="muted.400"
                                                />}
                                        />
                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                                <Text style={styles.label}>Responsable</Text>
                                        </View>
                                        {isView && !inEdit ? <View style={styles.openModalize}>
                                                <Text style={styles.openModalizeLabel} numberOfLines={1}>{activite ? `${activite.Nom} ${activite.Prenom}`: 'Selectionner un responsable'}</Text>
                                                <AntDesign name="caretdown" size={16} color="#777" />
                                        </View>:
                                        <TouchableOpacity onPress={openResponsableModalize} style={styles.openModalize}>
                                                <Text style={styles.openModalizeLabel} numberOfLines={1}>{responsable ? `${responsable.label} ${responsable.Prenom}` : `${activite.Nom} ${activite.Prenom}`}</Text>
                                                <AntDesign name="caretdown" size={16} color="#777" />
                                        </TouchableOpacity>}
                                        <Input isDisabled={isView && !inEdit} value={partenaire} onChangeText={(value) => setPartenaire(value)} mt={2} placeholder="Partenaire" size='lg' py={2} InputLeftElement={
                                                <Icon
                                                        as={<AntDesign name="user" size={24} color="black" />}
                                                        size={5}
                                                        ml="2"
                                                        color="muted.400"
                                                />}
                                        />
                                        <Input keyboardType='number-pad' isDisabled={isView && !inEdit} value={etat.toString()} onChangeText={(value) => setEtat(value)} mt={2} placeholder="Etat" size='lg' py={2} InputLeftElement={
                                                <Icon
                                                        as={<MaterialCommunityIcons name="origin" size={24} color="black" />}
                                                        size={5}
                                                        ml="2"
                                                        color="muted.400"
                                                />}
                                        />

                                        <Input isDisabled={isView && !inEdit} value={personne} onChangeText={(value) => setPersonne(value)} mt={2} placeholder="Personne de contact" size='lg' py={2} InputLeftElement={
                                                <Icon
                                                        as={<AntDesign name="user" size={24} color="black" />}
                                                        size={5}
                                                        ml="2"
                                                        color="muted.400"
                                                />}
                                        />
                                        <Input isDisabled={isView && !inEdit} keyboardType='number-pad' value={telephone.toString()} onChangeText={(value) => setTelephone(value)} mt={2} placeholder="Telephone" size='lg' py={2} InputLeftElement={
                                                <Icon
                                                        as={<Feather name="phone" size={24} color="black" />}
                                                        size={5}
                                                        ml="2"
                                                        color="muted.400"
                                                />}
                                        />
                                        <Input multiline isDisabled={isView && !inEdit} value={comment} onChangeText={(value) => setComment(value)} mt={2} placeholder="Commentaire" size='lg' py={2} InputLeftElement={
                                                <Icon
                                                        as={<MaterialCommunityIcons name="comment-outline" size={24} color="black" />}
                                                        size={5}
                                                        ml="2"
                                                        color="muted.400"
                                                />}
                                        />
                                        <View style={styles.actions}>
                                                <Button
                                                        isDisabled={isView && !inEdit}
                                                        isLoading={loading}
                                                        onPress={submitActions}
                                                        size='lg' w="full" mt={10}
                                                        style={styles.login} py={4} backgroundColor={primaryColor} _text={{ fontSize: 18 }} borderRadius={10}
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
                                        <Modalize ref={equipeModalizeRef}  >
                                                <EquipeList />
                                        </Modalize>
                                </Portal>
                                <Portal>
                                        <Modalize ref={responsableModalizeRef}  >
                                                <ResponsableList />
                                        </Modalize>
                                </Portal>
                        </NativeBaseProvider>
                </Host>
        )
}

const styles = StyleSheet.create({
        label: {
                fontSize: 16,
                fontWeight: 'bold'
        },
        container: {
                padding: 15,
                backgroundColor: '#fff',
                height: "100%",
        },
        openModalize: {
                backgroundColor: '#dde1ed',
                padding: 10,
                borderRadius: 5,
                marginTop: 5,
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'space-between'
        },
        openModalizeLabel: {
                color: '#555',
                fontSize: 14,
        },
        actions: {
                paddingBottom: 30
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
        debutName: {
                color: '#000',
                fontSize: 16,
                marginLeft: 5,
                opacity: 0.4
        },
        rightDate: {
                backgroundColor: '#F2F5FE',
                borderRadius: 10,
                padding: 5,
        },
        rightDateText: {
                opacity: 0.5
        },
        modalContent: {
                paddingHorizontal: 10,
                paddingVertical: 15
        },
        modalList: {
                marginTop: 10,
        },
        modalItem: {
                paddingVertical: 10,
                paddingHorizontal: 5,
                marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center'
        },
        modalText: {
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 10
        },
})