import React from 'react'
import HomeNavigator from './HomeNavigator';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingScreen from '../screens/Settings/SettingScreen';
import DrawerContent from '../components/DrawerContent/DrawerContent';
import ActionNavigator from './ActionNavigator';
import RisqueNavaigator from './RisqueNavaigator'; 
import MesTachesScreen from '../screens/taches/MesTachesScreen';
import Header from '../components/Header/Header';
import TachesScreen from '../screens/taches/TachesScreen';
import ProjetsScreen from '../screens/projets/ProjetsScreen';
import PostesScreen from '../screens/postes/PostesScreen';
import EquipesScreen from '../screens/equipes/EquipesScreen';
import CollaborateursScreen from '../screens/collaborateurs/CollaborateursScreen';

const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
          return (
                    <Drawer.Navigator screenOptions={{drawerPosition: 'right', lazy: true, unmountOnBlur: true,headerShown: false }} drawerContent={props => <DrawerContent {...props} /> }>
                              {/* <Drawer.Screen name="Home" component={HomeNavigator} /> */}
                              <Drawer.Screen name="MesTachesScreen" component={MesTachesScreen} />
                              <Drawer.Screen name="TachesScreen" component={TachesScreen} />
                              <Drawer.Screen name="ProjetsScreen" component={ProjetsScreen} />
                              <Drawer.Screen name="PostesScreen" component={PostesScreen} />
                              <Drawer.Screen name="EquipesScreen" component={EquipesScreen} />
                              <Drawer.Screen name="CollaborateursScreen" component={CollaborateursScreen} />
                              <Drawer.Screen name="Settings" component={SettingScreen} options={{ headerShown: false}} />
                    </Drawer.Navigator>
          )
}
