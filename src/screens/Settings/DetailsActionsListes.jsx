import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { useSelector } from "react-redux";
import ActionsCard from "../../components/Affectations/ActionsCard";
import Skeleton from "../../components/Skeleton/Skeleton";
import { fetchApi } from "../../functions";
import { userSelector } from "../../store/selectors/userSelector";
import moment from 'moment';
import { useFocusEffect } from "@react-navigation/native";

export const Skeletons = () => {
        const fakeElements = []
        for (let i = 1; i <= 20; i++) {
                fakeElements.push(i)
        }
        return (
                <View style={{ alignItems: "center", padding: 15 }}>
                        {fakeElements.map((fe, i) => <View key={i.toString()} style={{ backgroundColor: '#e8e7e7', padding: 10, width: '100%', borderRadius: 10, flexDirection: 'row', marginTop: i > 0 ? 10 : 0 }}>
                                <Skeleton style={{ width: 60, height: 60, borderRadius: 50, backgroundColor: '#fff' }} />
                                <View style={{ flex: 1, marginLeft: 5 }}>
                                        <Skeleton style={{ flex: 1, height: 40, borderRadius: 2, backgroundColor: '#fff' }} />
                                        <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 5 }}>
                                                <Skeleton style={{ width: '30%', height: 10, borderRadius: 2, backgroundColor: '#fff' }} />
                                                <Skeleton style={{ width: '30%', height: 10, borderRadius: 2, backgroundColor: '#fff' }} />
                                        </View>
                                </View>
                        </View>)}
                </View>
        )
}


export default function DetailsActionsListes() {
        const user = useSelector(userSelector)
        const [actionsListes, setActionsListes] = useState([])
        const [loading, setLoading] = useState(true)

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                const listes = await fetchApi(`/actions/${user.userid}`)
                                setActionsListes(listes)
                        }
                        catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, []))

        return (
                <View style={styles.container}>
                        <View style={styles.titleSearch}>
                                <Text style={styles.title}>Mes actions listes</Text>
                        </View>
                        <>
                                {loading ? <Skeletons /> :
                                        <FlatList
                                                keyExtractor={(item) => item.ID_ACTION.toString()}
                                                data={actionsListes} renderItem={({ item }) => (
                                                        <ActionsCard liste={item} />
                                                )}
                                        />}
                        </>

                </View>
        )
}

const styles = StyleSheet.create({
        container: {
                backgroundColor: '#fff',
                flex: 1
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
})