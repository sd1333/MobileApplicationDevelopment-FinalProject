import React, { useState } from 'react'
import { View, KeyboardAvoidingView, ScrollView } from 'react-native'
import { Button, Input, Text } from 'react-native-elements'
import axios from 'axios'
import { color } from 'react-native-reanimated'

const NewUser = ({ navigation: { navigate } }) => {

    const [newUserState, setNewUserState] = useState({ firstName: '', lastName: '', email: '', password: '', password2: '', valid: true })

    const firstNameTextChange = (text) => {
        setNewUserState(prevState => ({ ...prevState, firstName: text }))
    }

    const lastNameTextChange = (text) => {
        setNewUserState(prevState => ({ ...prevState, lastName: text }))
    }

    const emailTextChange = (text) => {
        setNewUserState(prevState => ({ ...prevState, email: text }))
    }

    const phoneNumberChange = (text) => {
        setNewUserState(prevState => ({ ...prevState, phoneNumber: text }))
    }

    const passwordTextChange = (text) => {
        setNewUserState(prevState => ({ ...prevState, password: text }))
    }

    const password2TextChange = (text) => {
        setNewUserState(prevState => ({ ...prevState, password2: text }))
    }

    const validation = () => {
        let fname = false
        let lname = false
        let email = false
        let pass = false
        let pass2 = false

        if (newUserState.firstName.length) {
            fname = true
        }
        if (newUserState.lastName.length) {
            lname = true
        }
        if (newUserState.email.indexOf('@') !== -1) {
            email = true
        }
        if (newUserState.password.length > 5) {
            pass = true
        }
        if (newUserState.password2 === newUserState.password) {
            pass2 = true
        }

        let validArray = [fname, lname, email, pass, pass2]

        for (let elem of validArray) {
            if (!elem) {
                return false
            }
        }
        return true
    }

    const createNewAccount = () => {

        if (validation()) {
            const reqBody =
            {
                firstName: newUserState.firstName,
                lastName: newUserState.lastName,
                phoneNumber: newUserState.phoneNumber,
                email: newUserState.email,
                password: newUserState.password
            }

            axios.post('http://192.168.1.10:7000/signup', reqBody)
                .then((res) => {
                    setNewUserState(prevState => ({ ...prevState, firstName: '', lastName: '', email: '', phoneNumber: '', password: '', password2: '', valid: true }))
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            setNewUserState(prevState => ({ ...prevState, valid: false }))
        }
    }

    return (
        <KeyboardAvoidingView>
            <ScrollView>
                <View style={{ paddingTop: 100, alignItems: 'center' }}>

                    {newUserState.valid ? null : <Text >Invalid Input!</Text>}

                    <Text >First Name</Text>
                    <Input value={newUserState.firstName} onChangeText={firstNameTextChange} />

                    <Text >Last Name</Text>
                    <Input value={newUserState.lastName} onChangeText={lastNameTextChange} />

                    <Text >Email</Text>
                    <Input value={newUserState.email} onChangeText={emailTextChange} />

                    <Text>Phone Number</Text>
                    <Input value={newUserState.phoneNumber} onChangeText={phoneNumberChange} />

                    <Text>Password</Text>
                    <Input value={newUserState.password} onChangeText={passwordTextChange} />

                    <Text>Re-Enter Password</Text>
                    <Input value={newUserState.password2} onChangeText={password2TextChange} />

                    <Button title="Sign Up" buttonStyle={{ width: 100, margin: 10 }} onPress={createNewAccount} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>

    )
}

export default NewUser
