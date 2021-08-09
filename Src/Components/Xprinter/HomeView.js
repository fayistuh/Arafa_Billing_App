import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Platform, FlatList } from 'react-native'
import Config from '../../Config'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { useBluetoothStatus } from 'react-native-bluetooth-status';
import Toast from 'react-native-simple-toast'
import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
} from "react-native-thermal-receipt-printer";
import AppContext from '../../constant'

import AsyncStorage from '@react-native-async-storage/async-storage';
function HomeView() {
    const { currentPrinter, setCurrentPrinter } = useContext(AppContext)
    const [showModal, setShowModal] = useState(false)
    const [btStatus, isPending, setBluetooth] = useBluetoothStatus();
    const [printers, setPrinters] = useState([]);
    // const [currentPrinter, setCurrentPrinter] = useState();
    // const [connecting,setConnecting] = useState(null)


    useEffect(() => {
        // getSavedPrinter()
    }, [])

    const getSavedPrinter = async () => {
        try {
            const value = await AsyncStorage.getItem('@printer')
            if (value !== null) {
                // value previously stored
                var printer = JSON.parse(value)
                if (printers.length) {
                    connectprinter(printer)
                }
            }
        } catch (e) {
            // error reading value
        }
    }



    const searchDevices = () => {
        if (btStatus || isPending) {
            BLEPrinter.init().then(() => {
                BLEPrinter.getDeviceList().then(setPrinters);
                setShowModal(true)
            });
        }
        else {
            alert('Turn ON your Bluetooth')
        }
    }

    const connectprinter = (printer) => {
        BLEPrinter.init().then(() => {
            BLEPrinter.connectPrinter(printer.inner_mac_address).then(
                res => {
                    console.warn('CONNECTION SUCCESS', res)
                    saveConnectedDevice(res)
                    setShowModal(false)

                },
                error => {
                    console.warn('Conn ERR', error)
                    Toast.show('failed to Connect')
                })
        });

    }

    useEffect(() => {
        if (!btStatus || !isPending) {
            setCurrentPrinter()
        }
    }, [btStatus, isPending])


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
                    onPress={() => printTextTest()}
                    style={{ alignItems: 'center' }}>
                    <AntDesign name='printer' size={30} color={Config.themeColor} />
                    <Text style={{ fontFamily: Config.regular, fontSize: 18 }}>Xprinter</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 20 }}>
                    <Text>Status: {(currentPrinter && (btStatus || isPending)) ? 'Connected' : 'Not Connected'}</Text>
                    {(currentPrinter && (btStatus || isPending))
                        ?
                        <View>
                            <Text>{currentPrinter.device_name}</Text>
                        </View>
                        :
                        <TouchableOpacity
                            onPress={() => searchDevices()}
                            style={{ height: 25, backgroundColor: 'green', width: 80, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                            <Text style={{ fontFamily: Config.medium, color: 'white', fontSize: 12 }}>Connect</Text>
                        </TouchableOpacity>}
                </View>
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
    const { Data, onPressConnect, connected } = props
    return (
        <TouchableOpacity
            onPress={onPressConnect}
            style={{ flexDirection: 'row', marginVertical: 5 }}>
            <View style={{ justifyContent: 'center' }}>
                <Feather name='bluetooth' size={30} color='#133ebf' />
            </View>
            <View style={{ marginLeft: 20 }}>
                <Text style={{ fontFamily: Config.medium }}>{Data.device_name}</Text>
                <Text style={{ fontFamily: Config.regular, fontSize: 12, color: 'gray' }}>{connected?.inner_mac_address == Data.inner_mac_address ? 'Connected' : Data.inner_mac_address}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 100,
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
