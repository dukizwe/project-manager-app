import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState }  from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RootNavigator from './routes/RootNavigator'
import LoginScreen from "./screens/LoginScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import { setUserAction } from "./store/actions/userActions";
import { userSelector } from "./store/selectors/userSelector";
import { fetchApi } from './functions'
import UpdatingScreen from "./screens/UpdatingScreen";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "./screens/welcome/RegisterScreen";

const Stack = createStackNavigator()

export default function AppContainer() {
          const dispatch = useDispatch()
          const [userLoading, setUserLoading] = useState(true)
          useEffect(() => {
                    (async function() {
                              const user = await AsyncStorage.getItem('user')
                              // await AsyncStorage.removeItem('user')
                              const freshUser = JSON.parse(user)
                              dispatch(setUserAction(freshUser))
                              setUserLoading(false)
                    })()
          }, [dispatch])
          const user = useSelector(userSelector)
          
          return (
                <>
                {/* <UpdatingScreen /> */}
                   { userLoading ?
                    <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                              <ActivityIndicator color="#007BFF" animating={userLoading} size='large' />
                    </View> :
                    <NavigationContainer >
                              {user ?
                                        <RootNavigator />:
                              <>
                              <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
                                        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false}}/>
                                        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: '', headerShadowVisible: false, headerStyle: {backgroundColor: '#F2F5FE'}}} />
                                        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: '', headerShadowVisible: false, headerStyle: {backgroundColor: '#fff'}}} />
                              </Stack.Navigator>
                              </>}
                    </NavigationContainer>}
                </>
          )
}