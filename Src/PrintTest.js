import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';

export default function PrintTest() {

    const printAll = async () => {

        let columnWidths = [12, 6, 6, 8];

        await BluetoothEscposPrinter.printColumn(columnWidths,
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
            ["aahdhhudusgcubic7dt7wcqvu", 'bb', 'cc', 'dd'], {});
    }

    const ss = () => {
        var datas = [{}, {}, {}, {}]
        datas.map((item) => {
            printAll()
        })
    }
    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    let columnWidths = [12, 6, 6, 8];
                    ss()
                }}
                style={{ height: 50, marginTop: 10, backgroundColor: 'red' }}>

            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({})
