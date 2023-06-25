import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'; 
import { Input, Menu } from 'native-base';
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import { useDispatch } from 'react-redux';
import { loadCrasAction } from '../../store/actions/craActions';
import Risques from '../../components/Activites/Risques';
import { useFocusEffect } from '@react-navigation/native';
import { fetchApi } from '../../functions';

export default function RisqueScreen() {
          const [search, setSearch] = useState('')
          const [risques, setRisques] = useState([])
          const [loadingRisques, setLoadingRisques] = useState(true)
          const user = useSelector(userSelector)
          const dispatch = useDispatch()
         
          useFocusEffect(useCallback(()=>{
                (async()=>{
                    try{
                        const risques=await fetchApi(`/risque/${user.userid}`)
                        setRisques(risques)
                      }
                      catch(error){
                          console.log(error)
                      }
                      finally{
                          setLoadingRisques(false)
                       }
                })()
        },[]))
          return (
                    <View style={styles.container}>
                              <View style={styles.titleSearch}>
                                        <Text style={styles.other}>Les risques</Text>
                              </View>
                              <Risques  risques={risques} loadingRisques={loadingRisques}/>
                    </View>
          )
}


const styles = StyleSheet.create({
          container: {
                    backgroundColor: '#fff',
                    height: '100%',
                    // marginTop: StatusBar.currentHeight
          },
          titleSearch: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignContent: 'center',
          },
          other: {
                    color: '#333',
                    fontSize: 20,
                    fontWeight: 'bold',
                    paddingLeft: 15,
          },
          searchButton: {
                    padding: 20
          },
          other: {
                    color: '#333',
                    fontSize: 20,
                    fontWeight: 'bold',
                    paddingLeft: 15,
                    paddingRight: 15,
                    marginVertical: 10
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
                    width: 280
          }
});
