import React, { useEffect, useState, useContext } from 'react'
import { View, AsyncStorage } from 'react-native'
import { Button, Input, Text, Header } from 'react-native-elements'
import axios from 'axios'
import * as Location from 'expo-location'
import Navbar from './NavBarComponents/Navbar'

import { AuthContext } from '../App'

const Home = ({ navigation: { navigate } }) => {

    const [userState, setUserState] = useState({ volOnDuty: false })

    const dispatchFunct = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            let userToken = await AsyncStorage.getItem('userToken')
            dispatchFunct.restore(userToken)

            const token = dispatchFunct.getToken()

            await axios.get('http://192.168.1.10:7000/getuser',
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                .then((user) => {
                    console.log(user.data)
                    // setUserState((prevState) => ({ ...prevState, volOnDuty: user.data.data.volunteerStatus }))
                })

            const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true, timeInterval: 300, distanceInterval: 0 });

            let coords = [location.coords.longitude, location.coords.latitude]
            await axios.post('http://192.168.1.10:7000/savelocation', {
                userLocation: coords
            },
                {
                    headers: { authorization: `Bearer ${token}` }
                }
            )
        })()

    }, [])

    dutyStatusChange = async () => {
        const token = dispatchFunct.getToken()
        const result = await axios.patch('http://192.168.1.10:7000/dutychange', {},
            {
                headers: { authorization: `Bearer ${token}` }
            })

        const user = await axios.get('http://192.168.1.10:7000/getuser', {
            headers: { authorization: `Bearer ${token}` }
        })
        setUserState((prevState) => ({ ...prevState, volOnDuty: user.data.data.volunteerStatus }))
    }

    navToMap = () => {
        navigate('MAIN_MAP')
    }

    return (
        <View >
            <Navbar></Navbar>
            <View style={{ paddingTop: 10, alignItems: 'center' }}>

                <Button buttonStyle={{ width: 200, margin: 10 }} title="Volunteer Status On-Duty/Off-Duty" onPress={dutyStatusChange} />

                {userState.volOnDuty ? <Text>Volunteer Status: True</Text> : <Text>Volunteer Status: False</Text>}

                <Button buttonStyle={{ width: 200, margin: 10 }} title="View Volunteers within 1 mile" onPress={navToMap} />
            </View>
        </View>
    )
}

export default Home

