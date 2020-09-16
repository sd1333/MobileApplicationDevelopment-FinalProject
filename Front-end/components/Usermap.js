import React, { useEffect, useState, useContext } from 'react'
import { View, AsyncStorage, StyleSheet, Dimensions } from 'react-native'
import { Button, Input, Text, Header } from 'react-native-elements'
import axios from 'axios'
import MapView, { Marker, Callout } from 'react-native-maps'
import geolib from 'geolib'
import * as Location from 'expo-location'

import Navbar from './NavBarComponents/Navbar'

import { AuthContext } from '../App'

const Usermap = ({ navigation: { navigate } }) => {

    const [mapState, setMapState] = useState({ user: null, volunteers: null, loading: true })

    const dispatchFunct = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            const token = dispatchFunct.getToken()

            const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true, timeInterval: 300, distanceInterval: 0 });

            let coords = [location.coords.longitude, location.coords.latitude]
            setMapState((prevState) => ({ ...prevState, user: coords }))

            axios.get('http://192.168.1.10:7000/getallusers',
                {
                    headers: { authorization: `Bearer ${token}` }
                })
                .then((allUsers) => {
                    setMapState((prevState) => ({ ...prevState, volunteers: allUsers.data.data }))
                })
        })()
    }, [])

    const navToVolunteerInfo = (itemId) => {
        navigate('MAIN_VOLUNTEER', { userId: itemId })
    }

    return (
        <View >
            <Navbar></Navbar>
            {mapState.user && mapState.volunteers && <MapView style={styles.mapStyle}
                initialRegion={{
                    latitude: mapState.user[1],
                    longitude: mapState.user[0],
                    latitudeDelta: .05,
                    longitudeDelta: .05
                }}
            >

                <Marker
                    draggable
                    coordinate={{ latitude: mapState.user[1], longitude: mapState.user[0] }}
                    pinColor="red"
                />

                {mapState.volunteers.filter(item => item.volunteerStatus == true).map((item) => {
                    return <Marker draggable
                        key={item._id}
                        coordinate={{ latitude: item.location[1], longitude: item.location[0] }}
                        pinColor="blue"
                    >
                        <Callout
                            title={item.firstName + ' ' + item.lastName}
                            onPress={() => navToVolunteerInfo(item._id)}
                        >
                            <Text>{item.firstName + ' ' + item.lastName}</Text>
                        </Callout>
                    </Marker>
                })}

            </MapView>
            }
        </View>
    )
}

export default Usermap

const styles = StyleSheet.create({
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }

})


