import React, { useEffect, useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import config from './Config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContext from './constant'
import Toast from 'react-native-simple-toast'

export default function Splash(props) {
    const { productData, setProductData, setSyncInfo, setUserToken } = useContext(AppContext)
    useEffect(() => {
        getSyncInfo()
    }, [])

    const getSyncInfo = async () => {
        try {
            const value = await AsyncStorage.getItem('@syncinfo');

            if (value !== null) {
                // userdata=JSON.parse(value).userToken
                setSyncInfo(JSON.parse(value))
                console.warn('HAHAHA', JSON.parse(value))
            }
            else {
                console.warn('no data found')
            }
            getToken()


        } catch (error) {
            // Error retrieving data
            console.warn('noooo')
            Toast.show('Something went wrong')

        }
    }
    const getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('@user');

            if (value !== null) {
                // userdata=JSON.parse(value).userToken
                console.warn('HAHAHA', JSON.parse(value))
                setUserToken(JSON.parse(value).userToken)
                props.navigation.navigate('home')


            }
            else {
                console.warn('no token found')
                props.navigation.navigate('login')

            }


        } catch (error) {
            // Error retrieving data
            console.warn('noooo')
            Toast.show('Something went wrong')

        }
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <Text style={{ fontFamily: config.bold, fontSize: 18 }}>ARAFA</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
