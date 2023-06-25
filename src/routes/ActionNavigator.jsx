import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Header from "../components/Header/Header";
import ActionViewScreen from "../screens/CraTab/ActionViewScreen";
import DetailsActionsListes from "../screens/Settings/DetailsActionsListes";

const Stack = createStackNavigator()

export default function ActionNavigator (){
        return(
          <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }}>
                        <Stack.Screen name="DetailsActionsListes" component={DetailsActionsListes}  options={{ header: () => <Header />}} />
                        <Stack.Screen name="ActionViewScreen" component={ActionViewScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
        )
}