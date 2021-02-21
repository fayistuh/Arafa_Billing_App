import React, { useState, useEffect, useContext } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native'
import config from '../Config'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import { BillRecord } from './BillRecord'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Picker } from '@react-native-picker/picker';
import AppContext from '../constant';


const CustomerSchema = {
    name: 'Customers',
    properties: {
        id: 'string',
        name: 'string',
        phone: 'string',
        address: 'string'
    }
};

const Realm = require('realm');

export default function index(props) {
    const { billArray,
        setBillArray } = useContext(AppContext)

    const { item, index } = props.route.params

    const products = billArray[index].sale_items





    useEffect(() => {
        // readShops()

    }, [])




    const [salesItems, setSaleItems] = useState(
        [
            {
                "product_pk": "9cc8ac97-bca8-4659-a58e-babee01c3028",
                "product_code": "4655",
                "unit_pk": "baaa66a2-d5b9-4589-aa3c-fbec3667b41b",
                "price": "200",
                "cost": "50",
                "qty": "2",
                "imei1": "45"
            },
        ])



    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ height: 80, backgroundColor: 'yellow', padding: 15 }}>
                    <Text style={{ fontFamily: config.light, fontSize: 12 }}>Customer Name: <Text style={{ fontFamily: config.regular }}>{item.c_name}</Text></Text>
                    <Text style={{ fontFamily: config.light, fontSize: 12 }}>Customer Mobile: <Text style={{ fontFamily: config.regular }}>{item.c_phone} </Text></Text>
                </View>


                <View style={styles.mainContainer}>
                    <View style={styles.headBox}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: config.semi_bold, color: 'white', fontSize: 12 }}>Code</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ fontFamily: config.semi_bold, color: 'white', fontSize: 12 }}>Qty</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ fontFamily: config.semi_bold, color: 'white', fontSize: 12 }}>Price</Text>
                            <MaterialCommunityIcons name='currency-inr' size={15} color='white' />
                        </View>
                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
                            <Text style={{ fontFamily: config.semi_bold, color: 'white', fontSize: 12 }}>Action</Text>
                        </View>
                    </View>
                    <FlatList
                        data={products}
                        renderItem={(({ item }) =>
                            <BillRecord
                                Data={item}
                            />
                        )}
                    />

                    <TouchableOpacity onPress={() => props.navigation.navigate('adder', { index })}
                        style={styles.Buttoncontainer}>
                        <AntDesign name='addfile' size={15} color='white' style={{ marginTop: -3 }} />
                        <Text style={{ fontFamily: config.semi_bold, color: 'white', marginLeft: 5 }}>ADD NEW PRODUCT</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        onPress={() => testDelete()}
                        style={styles.Buttoncontainer}>
                        <AntDesign name='printer' size={15} color='white' style={{ marginTop: -3 }} />
                        <Text style={{ fontFamily: config.semi_bold, color: 'white', marginLeft: 5 }}>PRINT</Text>
                    </TouchableOpacity> */}

                </View>

            </ScrollView>


        </View>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        minHeight: 500,
        backgroundColor: 'white',
        marginHorizontal: 10,
        borderWidth: 0.5,
        marginVertical: 10,
        borderRadius: 20,
        borderColor: 'gray'

    },
    headBox: {
        height: 50,
        backgroundColor: config.themeColor,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    Buttoncontainer: {
        height: 50,
        width: config.DevWidth - 50,
        borderRadius: 25,
        backgroundColor: '#3c4a8c',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        flexDirection: 'row'


    }
});