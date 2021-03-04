import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import config from '../Config'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'

function Record(props) {
    const { Data } = props
    return (
        <View style={{ minHeight: 50, borderBottomWidth: 0.5, borderColor: 'gray', flexDirection: 'row' }}>
            <View style={{ flex: 2, justifyContent: 'center', paddingLeft: 10 }}>
                <Text style={{ fontFamily: config.medium, fontSize: 12, color: 'black' }}>{Data.c_name}</Text>
                <Text style={{ fontFamily: config.medium, fontSize: 12, color: 'gray' }}>{Data.c_phone}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: config.medium, fontSize: 12 }}>{(Data.sale_items).length}</Text>
            </View>
            <View style={{ flex: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', marginRight: 10 }}>
                <TouchableOpacity
                    onPress={props.onEditPress}
                    style={{ height: 30, width: 30, backgroundColor: 'white', elevation: 3, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Feather name='edit' size={15} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={props.onPressRemove}
                    style={{ height: 30, width: 30, backgroundColor: 'white', elevation: 3, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <AntDesign name='delete' size={15} />
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>props.onPressPrint(Data)}
                style={{ height: 30, width: 30, backgroundColor: 'white', elevation: 3, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <AntDesign name='printer' size={15} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export { Record }
