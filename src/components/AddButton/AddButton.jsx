import React from 'react'

import { StyleSheet, TouchableOpacity } from 'react-native'

import { AntDesign } from '@expo/vector-icons'; 
import { useNavigation, useRoute } from '@react-navigation/core';
import { primaryColor } from '../Welcome/styles';

export default function AddButton({ isForCra, affectation }) {
          const navigation = useNavigation()
          const handleNavigation = () => {
                    if(isForCra) {
                              navigation.navigate('NewCra', { affectation })
                    } else {
                              navigation.navigate('NonPlanifie')
                    }
          }
          return <TouchableOpacity style={styles.addBtn} onPress={() => handleNavigation()}>
                    <AntDesign name="plus" size={20} color="white" />
          </TouchableOpacity>
}

const styles = StyleSheet.create({
          addBtn: {
                    backgroundColor: primaryColor,
                    padding: 20,
                    width: 58,
                    height: 58,
                    borderRadius: 100,
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
          }
})