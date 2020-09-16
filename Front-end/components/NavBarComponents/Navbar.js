import React, { useContext } from 'react'
import { View } from 'react-native'
import { Button, Input, Text, Header } from 'react-native-elements'
import { AuthContext } from '../../App'
import { useNavigation } from '@react-navigation/native'

const Navbar = () => {

    const dispatchFunct = useContext(AuthContext)

    const logOutButton = () => {
        dispatchFunct.signOut()
    }
    const navToHome = () => {
        const navigation = useNavigation();
        navigation.navigate('MAIN_HOME')
    }

    return (
        <Header

            centerComponent={<Button buttonStyle={{ width: 100 }} title="Home" onPress={navToHome} />}

            rightComponent={<Button buttonStyle={{ width: 100 }} title="Logout" onPress={logOutButton} />}
        />
    )
}

export default Navbar
