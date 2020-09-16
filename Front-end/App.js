import React, { useReducer, createContext, useContext } from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';

import Login from './components/Login'
import NewUser from './components/NewUser'
import Home from './components/Home'
import Usermap from './components/Usermap'
import VolunteerInfo from './components/VolunteerInfo'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

export const AuthContext = createContext()

const initialValue = {
  isLoading: true,
  userToken: 'meow',
}

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN': return { ...prevState, userToken: action.token, isLoading: false };

    case 'SIGN_IN': return { ...prevState, userToken: action.token, isLoading: false };

    case 'SIGN_OUT': return { ...prevState, userToken: null };
  }
}

export default function App() {

  const [tokenState, dispatch] = useReducer(reducer, initialValue)

  const authcontext = ({
    signIn: async (data) => {
      await dispatch({ type: 'SIGN_IN', token: data })
    },

    signOut: () => {
      dispatch({ type: 'SIGN_OUT' })
    },

    restore: async (data) => {
      await dispatch({ type: 'RESTORE_TOKEN', token: data })
    },

    checkToken: () => {
      console.log(tokenState.userToken)
    },

    getToken: () => {
      return tokenState.userToken
    }
  })

  return (
    <NavigationContainer>
      <AuthContext.Provider value={authcontext} >
        <Stack.Navigator>
          {tokenState.userToken == null ? (
            <>
              <Stack.Screen name="MAIN_LOGIN" component={Login} options={{ title: 'Login' }} />
              <Stack.Screen name="MAIN_SIGNUP" component={NewUser} options={{ title: 'Sign up' }} />
            </>
          ) : (
              <>
                <Stack.Screen name="MAIN_HOME" component={Home} options={{ title: 'Home' }} />
                <Stack.Screen name="MAIN_MAP" component={Usermap} options={{ title: 'Map' }} />
                <Stack.Screen name="MAIN_VOLUNTEER" component={VolunteerInfo} options={{ title: 'Volunteer Info' }} />

              </>
            )
          }
        </Stack.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
