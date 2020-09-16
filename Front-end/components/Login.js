import React, { useEffect, useState, useReducer, useContext } from 'react'
import { View, StyleSheet, AsyncStorage } from 'react-native'
import { Button, Input, Text } from 'react-native-elements'
import axios from 'axios'
import { AuthContext } from '../App'

const Login = ({ navigation: { navigate } }) => {

    const dispatchFunct = useContext(AuthContext)

    const [loginState, setLoginState] = useState({ email: '', password: '', valid: true, userValid: true })

    const emailTextChange = (text) => {
        setLoginState(prevState => ({ ...prevState, email: text }))
    }

    const passwordTextChange = (text) => {
        setLoginState(prevState => ({ ...prevState, password: text }))
    }

    const submitLogin = async () => {
        if (validation()) {
            const reqBody =
            {
                email: loginState.email,
                password: loginState.password
            }

            axios.post('http://192.168.1.10:7000/login', reqBody)
                .then((res) => {
                    if (res.data.token) {
                        AsyncStorage.setItem('userToken', res.data.token)
                            .then(() => {
                                dispatchFunct.signIn(res.data.token)
                                    .then(() => {
                                        navigate('MAIN_HOME')
                                    })
                            })
                    }
                    else {
                        setLoginState(prevState => ({ ...prevState, userValid: false }))
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            setLoginState(prevState => ({ ...prevState, valid: false }))
        }
    }

    const navToSignUp = () => {
        navigate('MAIN_SIGNUP')
    }

    const validation = () => {

        let email = false
        let pass = false

        if (loginState.email.indexOf('@') !== -1) {
            email = true
        }
        if (loginState.password.length > 5) {
            pass = true
        }

        let validArray = [email, pass]

        for (let elem of validArray) {
            if (!elem) {
                return false
            }
        }
        return true
    }

    return (

        <View style={{ paddingTop: 100, alignItems: 'center' }}>

            {loginState.valid ? null : <Text >Invalid Input!</Text>}
            {loginState.userValid ? null : <Text >Invalid Login!</Text>}

            <Text >Email</Text>
            <Input value={loginState.email} onChangeText={emailTextChange} />
            <Text>Password</Text>
            <Input value={loginState.password} onChangeText={passwordTextChange} />
            <Button title="Login" buttonStyle={{ width: 100, margin: 10 }} onPress={submitLogin} />
            <Button title="Sign Up" buttonStyle={{ width: 100, margin: 10 }} onPress={navToSignUp} />

        </View>
    )
}

export default Login

