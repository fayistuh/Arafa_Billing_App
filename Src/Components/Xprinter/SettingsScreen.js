import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Config from '../../Config'
import AppContext from '../../constant'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast'
export default function SettingsScreen(props) {
    const { shopNumber, setShopNumber } = useContext(AppContext)


    const save = async () => {
        try {
            await AsyncStorage.setItem('@shopnumber', shopNumber)
        } catch (e) {
            // saving error
            console.warn(e)
        }
        Toast.show('Shop number Saved Successfully')
        console.warn('SAVED')
        props.navigation.goBack()
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ height: 50, backgroundColor: 'white', elevation: 3, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => props.navigation.goBack()}
                    style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <AntDesign name='left' size={20} />
                </TouchableOpacity>
                <Text style={{ fontFamily: Config.semi_bold, marginBottom: -5 }}>SETTINGS</Text>
            </View>
            <View style={{ flex: 1, padding: 15 }}>
                <Text style={{ fontFamily: Config.medium, fontSize: 18, color: Config.themeColor }}>Shop Contact Number</Text>
                <TextInput
                    style={{ height: 50, borderWidth: 0.5, paddingLeft: 5, marginVertical: 20, }}
                    placeholder='Number...'
                    keyboardType='number-pad'
                    onChangeText={text => setShopNumber(text)}
                    value={shopNumber}

                />
                <TouchableOpacity
                    onPress={() => {
                        if (shopNumber == '') {
                            alert('Enter a valid Phone Number')
                        }
                        else {
                            save()
                        }
                    }}
                    style={{ height: 50, backgroundColor: Config.themeColor, width: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: Config.medium, marginBottom: -5, color: 'white' }}>SAVE</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({})
