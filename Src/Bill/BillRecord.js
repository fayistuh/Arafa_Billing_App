import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import config from '../Config'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'

function BillRecord(props) {
    const { Data } = props
    return (
        <View style={{ height: 50, borderBottomWidth: 0.5, borderColor: 'gray', flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: config.medium, fontSize: 12, color: 'black' }}>{Data.product_code}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: config.medium, fontSize: 12, color: 'black' }}>{Data.qty}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {Data.discount == 0 ? <Text style={{ fontFamily: config.medium, fontSize: 12 }}>{(Data.price).toFixed(2)}</Text> :
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontFamily: config.medium, fontSize: 12 }}>{(Data.price - Data.discount).toFixed(2)}</Text>
                        <Text style={{ fontFamily: config.light, fontSize: 10 }}>({(Data.price).toFixed(2)})</Text>
                    </View>}
            </View>
            <View style={{ flex: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', marginRight: 10 }}>
                <TouchableOpacity
                    onPress={props.onPressEdit}
                    style={{ height: 30, width: 30, backgroundColor: 'white', elevation: 3, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Feather name='edit' size={15} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={props.onPressDelete}
                    style={{ height: 30, width: 30, backgroundColor: 'white', elevation: 3, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <AntDesign name='delete' size={15} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export { BillRecord }
