import React, { useState, useContext, useEffect } from 'react'
import { View, Text, ActivityIndicator, Modal, Alert, TouchableOpacity, ScrollView } from 'react-native'
import { CustomeButton } from '../Components/CustomeButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import config from '../Config'
import AppContext from '../constant'
import { DownLoad } from './DownLoad'
import x from './dm'
import { Uploader } from './UploaderView'
import Config from '../Config'
import HomeView from '../Components/Xprinter/HomeView'



export default function index(props) {
    const { productData,
        setProductData, DeleteAllCustomers, showDownloadBox, setDownloadBox, syncinfo, billArray, userToken, updateLocalBills, setBillArray, setSplash, setSyncInfo } = useContext(AppContext)
    const ip = config.ipAddress
    const [downloading, setDownloading] = useState(false)
    const [uploading, setUploading] = useState(false)

    const getTime = (d) => {
        var date = new Date(d)
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }


    const getDate = (dateData) => {
        var date = new Date(dateData)
        var x = date.toDateString()
        return x
    }

    useEffect(() => {
        setSplash(false)
    }, [])

    const onUploadData = () => {
        console.warn('TTTOKE', userToken)
        var axios = require('axios');
        var FormData = require('form-data');
        var data = new FormData();
        data.append('data', JSON.stringify(billArray));

        var config = {
            method: 'post',
            url: 'http://www.arafamobiles.com/api/v1/sales/create/',
            headers: {
                'Authorization': 'Bearer ' + userToken,
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                if (response.data.StatusCodes == 6000) {
                    console.warn('Success')
                    setBillArray([])
                    updateLocalBills([])

                }
                else {
                    console.warn('FAILD')
                    Toast.show('Uploading failed')
                }
                console.warn(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.warn(error);
                Toast.show('Uploading failed')

            });

    }

    const onLogout = async () => {
        try {
            await AsyncStorage.removeItem('@user')
        } catch (e) {
            // remove error
        }

        console.warn('Done.')
        props.navigation.navigate('login')
    }










    return (
        <View style={{ flex: 1, backgroundColor: 'white', }}>
            <View style={{ flex: 1 }}>
                {syncinfo != null &&

                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <View style={{ height: 50, backgroundColor: 'white', elevation: 3, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: Config.bold }}>ARAFA</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <ScrollView>
                                <View style={{ minHeight: 100, margin: 15 }}>
                                    <Text style={{ fontFamily: config.light, color: 'gray', }}>Synced with <Text style={{ fontFamily: config.medium, color: config.themeColor }}>{syncinfo.shop.shop_name}</Text></Text>
                                    <Text style={{ fontFamily: config.light, color: 'gray', }}>Warehouse <Text style={{ fontFamily: config.medium, color: config.themeColor }}>{syncinfo.warehouse.name}</Text></Text>
                                    <Text style={{ fontFamily: config.light, color: 'gray', }}>Last synced at <Text style={{ fontFamily: config.medium, color: config.themeColor }}>{getTime(syncinfo.lastSync)}</Text></Text>
                                    <Text style={{ fontFamily: config.light, color: 'gray', }}>On <Text style={{ fontFamily: config.medium, color: config.themeColor }}>{getDate(syncinfo.lastSync)}</Text></Text>
                                </View>
                                <HomeView
                                    onPressSettings={() => props.navigation.navigate('settings')}
                                />

                                <View style={{ alignItems: 'center' }}>
                                    <CustomeButton
                                        onPress={() => {
                                            Alert.alert(
                                                "Please confirm",
                                                "Are you sure want to download new data, It will clear all existing database",
                                                [
                                                    {
                                                        text: "Cancel",
                                                        onPress: () => console.log("Cancel Pressed"),
                                                        style: "cancel"
                                                    },
                                                    {
                                                        text: "OK", onPress: () => {
                                                            setSyncInfo(null)
                                                            DeleteAllCustomers()
                                                        }
                                                    }
                                                ],
                                                { cancelable: false }
                                            );
                                        }}
                                        MarginVertical={20}
                                        Content={"LOAD TODAY'S DATA"}
                                        Activity={downloading}
                                    />
                                    <CustomeButton
                                        MarginVertical={20}
                                        Content={"SALES"}
                                        onPress={() => props.navigation.navigate('sale')}
                                    />
                                    {billArray.length > 0 && <CustomeButton
                                        MarginVertical={20}
                                        onPress={() => setUploading(true)}
                                        Content={"UPLOAD DATA"}
                                    />}
                                    <CustomeButton
                                        MarginVertical={20}
                                        onPress={() => {
                                            Alert.alert(
                                                "Please confirm",
                                                "Are you sure want to Logout",
                                                [
                                                    {
                                                        text: "Cancel",
                                                        onPress: () => console.log("Cancel Pressed"),
                                                        style: "cancel"
                                                    },
                                                    {
                                                        text: "OK", onPress: () => onLogout()
                                                    }
                                                ],
                                                { cancelable: false }
                                            );
                                        }}
                                        Content={"LOGOUT"}
                                    />
                                </View>
                            </ScrollView>
                        </View>

                    </View>}

                {syncinfo == null &&
                    <View style={{ flex: 1, backgroundColor: config.themeColor, paddingBottom: 10, }}>
                        <View style={{ flex: 1, backgroundColor: 'white', borderBottomRightRadius: 150, borderBottomLeftRadius: 30, borderTopRightRadius: 50, padding: 20 }}>
                            <Text style={{ fontFamily: config.regular, fontSize: 30 }}>WELCOME</Text>
                            <Text style={{ fontFamily: config.regular, fontSize: 30, marginTop: -10 }}>TO <Text style={{ fontFamily: config.medium, fontSize: 30, color: config.themeColor }}>ARAFA</Text></Text>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ fontFamily: config.medium, color: 'gray', fontSize: 18 }}>You'r not synced yet</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            DeleteAllCustomers()
                                        }}
                                        activeOpacity={0.8}
                                        style={{ height: 50, width: 180, backgroundColor: config.themeColor, justifyContent: 'center', alignItems: 'center', borderRadius: 25 }}>
                                        <Text style={{ fontFamily: config.bold, color: 'white' }}>Sync Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                }
            </View>
            <Modal
                transparent
                visible={showDownloadBox}
                animationType='fade'
                onRequestClose={() => setDownloadBox(false)}
            >
                <DownLoad
                    onDownLoadSuccess={() => {
                        setDownloadBox(false)
                    }}
                    onDownLoadFailed={() => {
                        setDownloadBox(false)
                    }}
                />

            </Modal>
            <Modal
                transparent
                visible={uploading}
                animationType='fade'
                onRequestClose={() => setUploading(false)}
            >
                <Uploader
                    onUploadSuccess={() => {
                        setUploading(false)
                        Toast.show('Uploaded successfully')
                    }}
                    onUploadFailed={() => {
                        setUploading(false)
                        Toast.show('Upload failed')
                    }}
                />

            </Modal>
        </View>
    )
}
