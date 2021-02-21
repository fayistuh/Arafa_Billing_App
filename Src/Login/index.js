import React, { useState, useContext, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import config from '../Config'
import { CustomeButton } from '../Components/CustomeButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import AppContext from '../constant'
export default function index(props) {
    const { setSplash, setUserToken } = useContext(AppContext)
    const ip = config.ipAddress
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [activity, setActivity] = useState(false)

    const userLogin = () => {
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('user_name', userName);
        data.append('password', password);

        var config = {
            method: 'post',
            url: ip + '/api/v1/auth/login/',
            data: data
        };

        axios(config)
            .then(function (response) {
                if (response.data.StatusCode == 6000) {
                    Toast.show('Login Success')
                    storeUserToken(response.data.data.access)
                }
                else {
                    Toast.show('Login failed')
                }

            })
            .catch(function (error) {
                alert(error)
                setActivity(false)
            });

    }

    const storeUserToken = async (token) => {
        var data = {
            userToken: token,
        }
        try {
            await AsyncStorage.setItem('@user', JSON.stringify(data));
            setUserToken(token)
            Toast.show('Login Success')
            props.navigation.navigate('home')

        } catch (error) {
            // Error saving data
            console.warn("HAHAH", error)
        }
    }

    useEffect(() => {
        setSplash(false)
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ height: config.DevHeight, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, fontFamily: config.bold }}>ARAFA</Text>
                    <Text style={{ fontSize: 15, fontFamily: config.medium, marginBottom: 40 }}>LOGIN</Text>

                    <View style={styles.textField}>
                        <TextInput
                            style={{ fontFamily: config.regular, width: 200, textAlign: 'center', fontSize: 14 }}
                            placeholder='username'
                            onChangeText={text => setUserName(text)}
                            value={userName}
                        />
                    </View>

                    <View style={styles.textField}>
                        <TextInput
                            style={{ fontFamily: config.regular, width: 200, textAlign: 'center', fontSize: 14 }}
                            placeholder='password'
                            secureTextEntry
                            onChangeText={text => setPassword(text)}
                            value={password}
                        />
                    </View>

                    <View style={{ height: 70 }} />

                    <CustomeButton
                        onPress={() => {
                            if (userName == '') {
                                alert('Enter user name')
                            }
                            else if (password == '') {
                                alert('Enter password')
                            }
                            else {
                                setActivity(false)
                                userLogin()
                            }

                        }}
                        Content='LOGIN'
                    />
                    {activity && <View style={{ height: 20, width: 200, marginTop: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ fontFamily: config.regular, marginRight: 5 }}>Please wait...</Text>
                        <ActivityIndicator size={20} color={config.themeColor} />
                    </View>}

                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    textField: {
        height: 50,
        width: config.DevWidth - 50,
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    }
});