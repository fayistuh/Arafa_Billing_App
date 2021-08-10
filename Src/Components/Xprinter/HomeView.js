import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Platform, FlatList, ActivityIndicator, } from 'react-native'
import Config from '../../Config'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { useBluetoothStatus } from 'react-native-bluetooth-status';
import Toast from 'react-native-simple-toast'
import Fontisto from 'react-native-vector-icons/Fontisto'
import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
} from "react-native-thermal-receipt-printer";
import AppContext from '../../constant'
import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';

import AsyncStorage from '@react-native-async-storage/async-storage';
function HomeView(props) {
    const { currentPrinter, setCurrentPrinter, shopNumber, setShopNumber } = useContext(AppContext)
    const [showModal, setShowModal] = useState(false)
    const [btStatus, isPending, setBluetooth] = useBluetoothStatus();
    const [printers, setPrinters] = useState([]);

    // const [currentPrinter, setCurrentPrinter] = useState();
    const [connecting, setConnecting] = useState(false)


    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@shopnumber')
            if (value !== null) {
                // value previously stored
                setShopNumber(value)
            }
        } catch (e) {
            // error reading value
        }
    }


    //1. Check wheather the BLUETOOTH is ON/OFF
    const checkBTisON = () => {
        BluetoothManager.isBluetoothEnabled().then((enabled) => {
            // alert(enabled) // enabled ==> true /false
            getAllDevices()
        }, (err) => {
            alert(err)
        });
    }
    //2. Search Devices
    const getAllDevices = () => {
        BluetoothManager.enableBluetooth().then((r) => {
            var paired = [];
            if (r && r.length > 0) {
                for (var i = 0; i < r.length; i++) {
                    try {
                        paired.push(JSON.parse(r[i])); // NEED TO PARSE THE DEVICE INFORMATION
                    } catch (e) {
                        //ignore
                    }
                }
            }

            setPrinters(paired)
            console.warn(paired)
            setShowModal(true)
        }, (err) => {
            alert(err)
        });
    }


    //3. Connect to Device
    const connectprinter = (printer) => {
        setConnecting(true)
        setShowModal(false)
        BluetoothManager.connect(printer.address) // the device address scanned.
            .then((s) => {
                console.warn('CONNECTION SUCCESS', s)
                saveConnectedDevice(printer)
                setConnecting(false)

            }, (e) => {
                console.warn('Conn ERR', error)
                Toast.show('failed to Connect')
                setConnecting(false)

                alert(e);
            })
    }




    const saveConnectedDevice = async (device) => {
        try {
            await AsyncStorage.setItem('@printer', JSON.stringify(device))
            setCurrentPrinter(device)
        } catch (e) {
            // saving error
        }
    }

    const printText = `<C>ARAFA</C>\nhellow ARAFA how are you\n`

    const printTextTest = () => {
        currentPrinter && BLEPrinter.printBill(printText);
    }
    return (
        <View>
            <View style={styles.container}>
                <TouchableOpacity
                    // onPress={() => printTextTest()}
                    disabled
                    style={{ alignItems: 'center' }}>
                    <AntDesign name='printer' size={30} color={Config.themeColor} />
                    <Text style={{ fontFamily: Config.regular, fontSize: 18 }}>Xprinter</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 20 }}>
                    <Text style={{ fontFamily: Config.regular, color: currentPrinter ? 'green' : 'red' }}>{currentPrinter ? 'Connected' : 'Not Connected'}</Text>
                    {currentPrinter
                        ?
                        <View>
                            <Text style={{ fontFamily: Config.regular, fontSize: 12 }}>Name: {currentPrinter.name}</Text>
                        </View>
                        :
                        <TouchableOpacity
                            onPress={() => checkBTisON()}
                            style={{ height: 25, backgroundColor: 'green', width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                            <Text style={{ fontFamily: Config.medium, color: 'white', fontSize: 12 }}>Connect</Text>
                        </TouchableOpacity>
                    }
                    {connecting && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'green', marginRight: 2 }}>Connecting...</Text>
                    </View>}
                </View>
                {<TouchableOpacity
                    onPress={props.onPressSettings}
                    style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <Fontisto name='player-settings' size={25} />
                </TouchableOpacity>}
            </View>








            <Modal
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
                transparent
                animationType='fade'
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <View style={{ flex: 1, backgroundColor: 'white', margin: 20, borderRadius: 10, padding: 15 }}>
                        <Text style={{ fontFamily: Config.medium, fontSize: 20, color: Config.themeColor }}>Available Devices</Text>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={printers}
                                renderItem={(({ item }) =>
                                    <BLEDevice
                                        Data={item}
                                        onPressConnect={() => connectprinter(item)}
                                        connected={currentPrinter}
                                        connecting={connecting}
                                    />
                                )}
                            />
                        </View>
                    </View>
                </View>

            </Modal>
        </View >
    )
}

function BLEDevice(props) {
    const { Data, onPressConnect, connected, connecting } = props
    return (
        <TouchableOpacity
            onPress={onPressConnect}
            style={{ flexDirection: 'row', marginVertical: 5 }}>
            <View style={{ justifyContent: 'center' }}>
                <Feather name='bluetooth' size={30} color='#133ebf' />
            </View>
            <View style={{ marginLeft: 20 }}>
                <Text style={{ fontFamily: Config.medium }}>{Data.name}</Text>
                <Text style={{ fontFamily: Config.regular, fontSize: 12, color: 'gray' }}>{Data.address}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {

        margin: 15, padding: 15,
        borderWidth: 0.5,
        borderColor: Config.themeColor,
        borderRadius: 10,
        flexDirection: 'row'
    },
    bleButton: {
        height: 30, width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#133ebf',
        borderRadius: 30

    }
})

export default HomeView
