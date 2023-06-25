import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, ActivityIndicator, RefreshControl, View, Text } from 'react-native'
import Affectation from './Affectation'
import { useDispatch, useSelector } from 'react-redux'
import { loadAffectations } from '../../store/actions/affectationsActions'
import { affectationsLoadingSelector, affectationsSeletor } from '../../store/selectors/affectationsSelector'
import { userSelector } from '../../store/selectors/userSelector'
import { primaryColor } from '../Welcome/styles'
import Skeleton from "../Skeleton/Skeleton"

export const Skeletons = () => {
          const fakeElements = []
          for (let i = 1; i <= 20 ; i++) {
                    fakeElements.push(i)
          }
          return (
          <View style={{alignItems:"center", padding: 15}}>
                    {fakeElements.map((fe, i) => <View key={i.toString()} style={{backgroundColor: '#e8e7e7', padding: 10, width: '100%', borderRadius: 10, flexDirection: 'row', marginTop: i > 0 ? 10 : 0}}>
                              <Skeleton style={{width:60, height: 60, borderRadius: 50, backgroundColor: '#fff'}} />
                              <View style={{flex: 1, marginLeft: 5}}>
                                        <Skeleton style={{flex: 1, height: 40, borderRadius: 2, backgroundColor: '#fff'}} />
                                        <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 5}}>
                                                  <Skeleton style={{width:'30%', height: 10, borderRadius: 2, backgroundColor: '#fff'}} />
                                                  <Skeleton style={{width:'30%', height: 10, borderRadius: 2, backgroundColor: '#fff'}} />
                                        </View>
                              </View>
                    </View>)}
          </View>
          )
}

export default function Affectations() {
          const [refreshing, setRefreshing] = useState(false)
          const dispatch = useDispatch()
          const user = useSelector(userSelector)
          useEffect(() => {
                    dispatch(loadAffectations(user?.collaboId))
          }, [])

          const loading = useSelector(affectationsLoadingSelector)
          const onRefresh = () => {
                    setRefreshing(true)
                    dispatch(loadAffectations(user.collaboId, undefined, false))
                    setRefreshing(false)
          }
          const affectations = useSelector(affectationsSeletor)
          return (
                    
                    loading ? <Skeletons /> :
                              <FlatList
                                        refreshControl={<RefreshControl
                                                  colors={[primaryColor]} refreshing={refreshing}
                                                  onRefresh={onRefresh} />}
                                        style={styles.affectations}
                                        keyExtractor={(item) => item.IDAffectation.toString()}
                                        data={affectations} renderItem={({ item }) => (
                                                  <Affectation affectation={item} />
                                        )}
                              />
          )
}

const styles = StyleSheet.create({
          affectations: {
                    paddingLeft: 15,
                    paddingRight: 15
          }
})