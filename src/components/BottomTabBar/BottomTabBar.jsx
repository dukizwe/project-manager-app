import React, { useState } from 'react'
import { Dimensions, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { primaryColor } from '../Welcome/styles';
import { useSelector } from 'react-redux'
import { uncompletedAffectationSelector } from '../../store/selectors/affectationsSelector'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export default function BottomTabBar({ state, descriptors, navigation }) {
          const uncompletedAffectations = useSelector(uncompletedAffectationSelector)
          const focusedRoute = getFocusedRouteNameFromRoute(state.routes[state.index])
          return (
                    <View style={{...styles.tabBar, display: focusedRoute == 'Scan' ? 'none': undefined}}>
                              {state.routes.map((route, index) => {
                                        const { options } = descriptors[route.key];
                                        const label = options.tabBarLabel !== undefined
                                                  ? options.tabBarLabel :
                                                  options.title !== undefined
                                                  ? options.title :
                                                  route.name;
                                        const isFocused = state.index === index;
                                        
                                        const onPress = () => {
                                                  const event = navigation.emit({
                                                            type: 'tabPress',
                                                            target: route.key,
                                                            canPreventDefault: true,
                                                  });
                                                  if (!isFocused && !event.defaultPrevented) {
                                                            // The `merge: true` option makes sure that the params inside the tab screen are preserved
                                                            navigation.navigate({ name: route.name, merge: true });
                                                  }
                                        };
                                        
                                        const onLongPress = () => {
                                                  navigation.emit({
                                                            type: 'tabLongPress',
                                                            target: route.key,
                                                  });
                                        };

                                        const Icon = () => {
                                                  if(route.name === 'AffectationTab') {
                                                            return <FontAwesome5 name="tasks" size={20} color={isFocused ? primaryColor : '#777'} />
                                                  }else if(route.name === 'CraTab') {
                                                            return <Entypo name="list" size={24} color={isFocused ? primaryColor : '#777'} />
                                                  } else if(route.name === 'ReportTab')  {
                                                            return <AntDesign name="barschart" size={24} color={isFocused ? primaryColor : '#777'} />
                                                  }
                                        }

                                        const Badge = () => {
                                                  return <View style={styles.badge}><Text style={styles.badgeText}>{uncompletedAffectations.length}</Text></View>
                                        }
                                        return (
                                                  <TouchableNativeFeedback
                                                            accessibilityRole="button"
                                                            accessibilityState={isFocused ? { selected: true } : {}}
                                                            accessibilityLabel={options.tabBarAccessibilityLabel}
                                                            testID={options.tabBarTestID}
                                                            onPress={onPress}
                                                            onLongPress={onLongPress}
                                                            // style={{...styles.tab, backgroundColor: 'red', height: '100%', padding: 10}}
                                                            background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}
                                                            key={route.key}
                                                  >
                                                            <View style={styles.tab}>
                                                                      <View>
                                                                                <Icon />
                                                                                {/* {route.name === 'AffectationTab' && <Badge />} */}
                                                                      </View>
                                                                      <Text style={{ color: isFocused ? primaryColor : '#777', fontWeight: 'bold' }}>
                                                                                {label}
                                                                      </Text>
                                                            </View>
                                                  </TouchableNativeFeedback>
                                        );
                              })}
                    </View>
          );
}
const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
          container: {
                    flex: 1
          },
          tabBar: {
                    backgroundColor: '#fff',
                    height: 70,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignContent: 'center',
                    padding: 0,
                    elevation: 1
          },
          tab: {
                    flex: 1,
                    width: width / 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10
          },
          badge: {
                    position: 'absolute',
                    right: -15,
                    top: -10,
                    backgroundColor: '#f53636',
                    minWidth: 20,
                    paddingHorizontal: 2,
                    height: 20,
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center'
          },
          badgeText: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 10
          }
})