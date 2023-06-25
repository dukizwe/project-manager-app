import React, { useContext, useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import Activite from './Activite'
import { addCrasAction, loadCrasAction } from '../../store/actions/craActions'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { crasLoadingSeletor, crasSeletor } from '../../store/selectors/crasSelector'
import { userSelector } from '../../store/selectors/userSelector'
import { primaryColor } from '../Welcome/styles'
import { Skeletons } from '../Affectations/Affectations'

export default function Activites() {
          const [refreshing, setRefreshing] = useState(false)
          const dispatch = useDispatch()
          const user = useSelector(userSelector)
          const [state, setState] = useState(false)
          useEffect(() => {
                    dispatch(loadCrasAction(user?.collaboId))
          }, [])
          const loading = useSelector(crasLoadingSeletor)

          const onRefresh = () => {
                    setRefreshing(true)
                    dispatch(loadCrasAction(user?.collaboId, undefined, false))
                    setRefreshing(false)
          }
          const activites = useSelector(crasSeletor)
          return (
                    loading ? <Skeletons /> :
                              <FlatList
                                        refreshControl={<RefreshControl
                                                  colors={[primaryColor]}
                                                  refreshing={refreshing} onRefresh={onRefresh} />}
                                        style={styles.activites}
                                        keyExtractor={(item, index) => index.toString()}
                                        data={activites} renderItem={({ item }) => (
                                                  <Activite activite={item} setState={setState} />
                              )} />
          )
}

const styles = StyleSheet.create({
          activites: {
                    paddingLeft: 15,
                    paddingRight: 15
          },
})