import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, ActivityIndicator, RefreshControl, View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';


export default function ActionsCard({ liste }) {
        const navigation = useNavigation()
        const handleDetails = () =>{
                navigation.navigate("ActionViewScreen", {activite:liste})
        }
        return (
                <TouchableOpacity style={styles.cardDetails} onPress={handleDetails} >
                        <View style={styles.statutIcon}>
                                {/* <AntDesign name="checkcircle" size={24} color="#777" /> */}
                                {/* <Feather name="circle" size={24} color="#777" /> */}
                        </View>
                        <View style={styles.affectationNames}>
                                <Text style={styles.activiteName} numberOfLines={1} >{liste.Projet}</Text>
                                <View style={styles.affectationsDescription}>
                                        <View style={styles.projetHeure}>
                                                <Text style={styles.projetName} numberOfLines={1} >{liste.Taches}</Text>
                                        </View>
                                        <View style={styles.heures}>
                                                <Text style={styles.date} numberOfLines={1} >{moment (new Date(liste.DATE_INSERTION)).format('DD/MM/YYYY')}</Text>
                                        </View>
                                </View>
                        </View>
                </TouchableOpacity>
        )
}

const styles = StyleSheet.create({
        affectation: {
                backgroundColor: '#F2F5FE',
                padding: 20,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 5
        },
        cardDetails: {
                marginHorizontal: 10,
                padding: 15,
                backgroundColor: "#F2F5FE",
                borderRadius: 10,
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                marginVertical: 2
        },
        affectationNames: {
                width: '99%',
               
        },
        activiteName: {
                color: '#333',
                fontSize: 16,
                fontWeight: 'bold',
        },
        projetName: {
                color: '#333',
                opacity: 0.6,
                fontSize: 12,
        },
        affectationsDescription: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                // width: '100%',
                marginTop: 5,
        },
        nbreHeures: {
                opacity: 0.6,
                fontSize: 12
        },
        heures: {
                flexDirection: 'row',
        },
        date: {
                opacity: 0.6,
                fontSize: 12
        },
        projetHeure: {
                flexDirection: 'row',
                width: '60%'
        },
        plusIcon: {
                padding: 10
        }
})