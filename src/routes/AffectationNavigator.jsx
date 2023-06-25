import { Menu } from 'native-base'
import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Header from '../components/Header/Header'
import AffectationsScreen from '../screens/AffectationTab/AffectationsScreen'
import AffectationViewScreen from '../screens/AffectationTab/AffectationViewScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import NonPlanifie from '../components/NonPlanifie/NonPlanifie'
import NewCraScreen from '../screens/AffectationTab/NewCraScreen'
import { useNavigation, useRoute } from '@react-navigation/core'
import Suicide from '../components/Suicide/Suicide'
import ScanScreen from '../screens/AffectationTab/ScanScreen'
import { useSelector } from 'react-redux'
import { userSelector } from '../store/selectors/userSelector'
import ActionsListes from '../components/NonPlanifie/ActionsListes'
import Risque from '../components/NonPlanifie/Risque'
import moment from 'moment';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'

const AffectationMenu = ({navigation, route}) => {
          const { affectation, setAffectation } = route.params
          return <Menu style={styles.menu} placement='bottom' trigger={(triggerProps) => {
                              return (
                              <TouchableOpacity {...triggerProps}>
                                        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
                              </TouchableOpacity>
                    )
          }}
          >
         
            { moment(new Date()).get("hours")>=17 && moment(new Date()).get("hours")<=23 ? 
              <Menu.Item style={styles.menuItem} onPress={() => navigation.navigate('NewCra', { affectation, setAffectation })}>Ajouter CRA</Menu.Item>:null
            }
          <Menu.Item style={styles.menuItem} /* onPress={} */>Modifier</Menu.Item>
          <Menu.Item style={styles.menuItem} /* onPress={} */>Supprimer</Menu.Item>
</Menu>
}

export default function AffectationNavigator() {
          const Stack = createStackNavigator()
          const user = useSelector(userSelector)
          return (
                    <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }}>
                              <Stack.Screen name="Affectations" component={AffectationsScreen} options={{ header: () => <Header />}} />
                              <Stack.Screen name="AffectationView" component={AffectationViewScreen} options={({ navigation, route}) => ({
                                        title: '',
                                        headerShadowVisible: false,
                                        headerRight: () => <AffectationMenu navigation={navigation} route={route} />,
                                        headerStyle: {backgroundColor: '#fff'}})}  />
                              <Stack.Screen name="Risque" component={Risque} options={{ title: 'Risque du projet' }}/>
                              <Stack.Screen name="NonPlanifie" component={NonPlanifie} options={{ title: 'Activité non planifié' }}/>
                              <Stack.Screen name="Suicide" component={Suicide} options={{ title: 'Déclarer une suicide' }}/>
                              <Stack.Screen name="NewCra" component={NewCraScreen} options={{ title: 'Ajouter un CRA' }}/>
                              <Stack.Screen name='ActionsListes' component={ActionsListes} options={{ title: 'Ajouter une nouvelle action' }}/>
                              {!user.presence && <Stack.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }}/>}
                    </Stack.Navigator>
          )
}


const styles = StyleSheet.create({
          menu: {
                    marginRight: 20
          },
          menuItem: {
          }
})