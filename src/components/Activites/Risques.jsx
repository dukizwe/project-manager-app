import React, { useCallback, useContext, useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/core'
import Activite from './Activite'
import { addCrasAction, loadCrasAction } from '../../store/actions/craActions'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { crasLoadingSeletor, crasSeletor } from '../../store/selectors/crasSelector'
import { userSelector } from '../../store/selectors/userSelector'
import { primaryColor } from '../Welcome/styles'
import { Skeletons } from '../Affectations/Affectations'
import { fetchApi } from '../../functions'
import Risque from './Risque'

export default function Risques({risques, loadingRisques}) {
    const [state, setState] = useState(false)
    const user = useSelector(userSelector)
    console.log('render', risques)
          return (
            loadingRisques ? <Skeletons /> :
                              <FlatList
                                        // refreshControl={<RefreshControl
                                        //           colors={[primaryColor]}
                                        //           refreshing={refreshing} onRefresh={onRefresh} />}
                                        style={styles.activites}
                                        keyExtractor={(item, index) => index.toString()}
                                        data={risques} renderItem={({ item }) => (
                                                  <Risque activite={item} setState={setState} />
                              )} />
          )
}

const styles = StyleSheet.create({
          activites: {
                   
          },
})