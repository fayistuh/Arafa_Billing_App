import React, {
    useState,
    useEffect,
    useContext
} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import config from '../Config'
import AppContext from '../constant'
import AntDesign from 'react-native-vector-icons/AntDesign'


function Uploader(props) {
    const { userToken, billArray, updateLocalBills, setBillArray } = useContext(AppContext)

    useEffect(() => {
        onUploadData()
    }, [])

    const onUploadData = () => {
        console.warn('TTTOKE', userToken)
        var axios = require('axios');
        var data = billArray
        // data.append('data', JSON.stringify(billArray));

        var config = {
            method: 'post',
            url: 'http://arafamobiles.com/api/v1/sales/create/',
            headers: {
                'Authorization': 'Bearer ' + userToken,
            },
            data: data
        };

        console.warn(billArray)

        axios(config)
            .then(function (response) {
                console.warn(response.data)

                if (response.data.StatusCodes == 6000) {
                    console.warn('Success')
                    setBillArray([])
                    updateLocalBills([])
                    props.onUploadSuccess()

                }
                else {
                    props.onUploadFailed()

                }
            })
            .catch(function (error) {
                console.warn(error)
                props.onUploadFailed()

            });

    }


    //##################################################################################
    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <View style={{ height: 350, backgroundColor: 'white', borderTopRightRadius: 10, borderTopLeftRadius: 10, padding: 15 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontFamily: config.regular, fontSize: 12, color: 'gray' }}>Uploading <Text style={{ fontFamily: config.regular, fontSize: 12, color: 'green' }}>{billArray.length}</Text> Bills</Text>
                            <ActivityIndicator size={15} color='orange' />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            props.onUploadFailed()
                        }}
                        style={{ height: 50, backgroundColor: '#f0615b', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: config.bold, color: 'white' }}>STOP UPLOADING</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View >
    )
}

const styles = StyleSheet.create({})

export { Uploader }
