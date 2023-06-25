import React from 'react';
import { StyleSheet, View } from 'react-native';
import CraTab from '../screens/CraTab/CraTab';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AffectationTab from '../screens/AffectationTab/AffectationTab';
import ReportTab from '../screens/ReportTab/ReportTab';
import BottomTabBar from '../components/BottomTabBar/BottomTabBar';
import { Host } from 'react-native-portalize';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export default function HomeNavigator() {
          const BottomTab = createBottomTabNavigator()

          return (
                    <View style={styles.container}>
                              {/* <TopTab.Navigator screenOptions={{ tabBarPressColor: '#f1f1f1', tabBarLabelStyle: { textTransform: 'none', fontWeight: 'bold',  fontSize: 16}}}>
                                        <TopTab.Screen name="AffectationTab" options={{ title: 'Mes affectations'}} component={AffectationTab} />
                                        <TopTab.Screen name="CraTab" options={{ title: 'Mes CRA'}} component={CraTab} />
                              </TopTab.Navigator> */}
                              <Host>
                                        <BottomTab.Navigator tabBar={props => <BottomTabBar {...props} />} screenOptions={{headerShown: false}}>
                                                  <BottomTab.Screen name="AffectationTab" options={({ route}) => ({
                                                            title: 'Affectations'
                                                  })} component={AffectationTab} />
                                                  <BottomTab.Screen name="CraTab" options={{ title: 'Mes CRA'}}  component={CraTab} />
                                                  <BottomTab.Screen name="ReportTab" options={{ title: 'Rapport'}}  component={ReportTab} />
                                        </BottomTab.Navigator>
                              </Host>
                    </View>
          );
}

const styles = StyleSheet.create({
          container: {
                    flex: 1
          }
})