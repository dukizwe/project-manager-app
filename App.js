import 'react-native-reanimated'
import 'react-native-gesture-handler'
import React, { useRef } from 'react';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import AppContainer from './src/AppContainer';
import { store } from './src/store'
import { StatusBar } from 'expo-status-bar';
import { Host } from 'react-native-portalize';

let App = () => {

          const IntApp = () => {
                    return (
                              <NativeBaseProvider>
                                        <Host>
                                                  <AppContainer />
                                        </Host>
                              </NativeBaseProvider>
                    )
          }
          return (
                    <>
                              <StatusBar backgroundColor='#fff' barStyle='dark-content' hidden />
                              <Provider store={store}>
                                        <IntApp />
                              </Provider>
                    </>
          );
}

export default App