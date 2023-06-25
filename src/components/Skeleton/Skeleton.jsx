import React from 'react'
import { View } from 'react-native'

export default function Skeleton({style}) {
          const defaultStyle = {
                    backgroundColor: '#e8e7e7',
                    borderRadius: 10
          }
          return <View style={{...defaultStyle, ...style}}>

          </View>
}