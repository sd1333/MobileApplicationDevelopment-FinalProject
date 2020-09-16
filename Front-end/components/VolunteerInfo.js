import React, { useEffect, useState, useReducer, useContext } from 'react'
import { View, StyleSheet, AsyncStorage } from 'react-native'
import { Button, Input, Text } from 'react-native-elements'
import axios from 'axios'
import * as SMS from 'expo-sms'
import Navbar from '../components/NavBarComponents/Navbar'

import { AuthContext } from '../App'

const VolunteerInfo = ({ route, navigation: { navigate } }) => {

    const [volunteerInfo, setVolunteerInfo] = useState({ data: null })
    const [smsState, setSmsState] = useState({ message: null })

    const dispatchFunct = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            const token = dispatchFunct.getToken()
            axios.post('http://192.168.1.10:7000/getVolunteer', { volId: route.params.userId },
                {
                    headers: { authorization: `Bearer ${token}` }
                })
                .then((vol) => {
                    setVolunteerInfo((prevState) => ({ ...prevState, data: vol.data.data }))
                })
                .catch((err) => {
                    console.log(err)
                })
        })()
    }, [])

    const smsInputChange = (text) => {
        setSmsState(prevState => ({ ...prevState, message: text }))
    }

    const sendSms = async () => {
        const { result } = await SMS.sendSMSAsync(
            [volunteerInfo.data.phoneNumber],
            smsState.message
        )
        setSmsState(prevState => ({ ...prevState, message: '' }))
    }

    return (
        <View>
            <Navbar></Navbar>
            <View style={{ paddingTop: 100, alignItems: 'center' }}>

                {volunteerInfo.data && <View style={{ paddingBottom: 50, alignItems: 'center' }}>

                    <Text>Volunteer: {volunteerInfo.data.firstName + ' ' + volunteerInfo.data.lastName}</Text>
                    <Text>email: {volunteerInfo.data.email}</Text>
                    <Text>Phone number: {volunteerInfo.data.phoneNumber}</Text>
                </View>
                }

                <Input style={{ height: 500 }} onChangeText={smsInputChange} value={smsState.message} />
                <Button title="Send SMS" onPress={sendSms} />

            </View>
        </View>
    )

}

export default VolunteerInfo

