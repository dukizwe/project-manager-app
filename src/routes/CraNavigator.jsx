import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Header from '../components/Header/Header'
import CrasScreen from '../screens/CraTab/CrasScreen'
import CraViewScreen from '../screens/CraTab/CraViewScreen'

export default function CraNavigator() {
          const Stack = createStackNavigator()
          return (
                    <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }}>
                              <Stack.Screen name="Cras" component={CrasScreen} options={{ header: () => <Header />}} />
                              <Stack.Screen name="ViewCra" component={CraViewScreen} options={{ headerShown: false }} />
                    </Stack.Navigator>
          )
}