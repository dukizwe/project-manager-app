import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Header from '../components/Header/Header'
import RisqueDetailScreen from '../components/NonPlanifie/RisqueDetailScreen'
import RisqueViewScreen from '../screens/CraTab/RisqueViewScreen'
import RisqueScreen from '../screens/Profile/RisqueScreen'


export default function RisqueNavaigator() {
          const Stack = createStackNavigator()
          return (
                    <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }}>
                              <Stack.Screen name="Risque" component={RisqueScreen} options={{ header: () => <Header />}} />
                              <Stack.Screen name="Detail" component={RisqueViewScreen} options={{ headerShown: false }}  />
                    </Stack.Navigator>
          )
}