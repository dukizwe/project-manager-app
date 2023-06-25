import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet } from "react-native";
import MesTachesScreen from "../screens/taches/MesTachesScreen";
import DrawerNavigator from "./DrawerNavigator";
import NewTacheScreen from "../screens/taches/NewTacheScreen";
import NewProjetScreen from "../screens/projets/NewProjetScreen";
import NewEquipeScreen from "../screens/equipes/NewEquipeScreen";
import NewCollaborateurScreen from "../screens/collaborateurs/NewCollaborateurScreen";
export default function RootNavigator() {
          const Stack = createStackNavigator()
          return (
                    <Stack.Navigator screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
                              <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
                              <Stack.Screen name="NewTacheScreen" component={NewTacheScreen} />
                              <Stack.Screen name="NewProjetScreen" component={NewProjetScreen} />
                              <Stack.Screen name="NewEquipeScreen" component={NewEquipeScreen} />
                              <Stack.Screen name="NewCollaborateurScreen" component={NewCollaborateurScreen} />
                    </Stack.Navigator>
          )
}