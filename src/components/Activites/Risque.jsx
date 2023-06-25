import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import moment from 'moment';
import 'moment/locale/fr';
import { MyFromNow } from '../../functions';
moment.locale('fr')

export default function Risque({ activite, setState }) {
        const navigation = useNavigation()
        const [s, setActivite] = useState(null)
        const handleActivitePress = () => {
                navigation.navigate('Detail', { activite, setActivite, setState })
        }
        return (
                <TouchableOpacity onPress={handleActivitePress} style={styles.cardDetails}>
                        <View style={styles.activiteNames}>
                                <View >
                                        <Text style={styles.activiteName} numberOfLines={3} >{activite.RISQUE}</Text>
                                </View>
                                <View style={styles.projetDate}>
                                        <Text style={styles.projetActiviteText} numberOfLines={1} >{activite.PROJECTS}</Text>
                                        <Text style={styles.projetDateText} numberOfLines={1} >{MyFromNow(activite.DATE_INSERTION)}</Text>
                                </View>
                        </View>

                </TouchableOpacity>
        )
}
const styles = StyleSheet.create({
        activite: {
                backgroundColor: '#F2F5FE',
                padding: 10,
                borderRadius: 10,
                marginTop: 5
        },
        activiteNames: {
                width: '95%',
                color: '#333',
        },
        activiteName: {
                color: '#333',
                fontSize: 16,
                fontWeight: 'bold'
        },
        projetDate: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 5,
                paddingRight: 10
        },
        projetActiviteText: {
                width: '80%',
                opacity: 0.8
        },
        projetDateText: {
                opacity: 0.5
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
})