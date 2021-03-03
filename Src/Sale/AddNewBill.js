import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native'
import config from '../Config'
import AppContext from '../constant'
import AntDesign from 'react-native-vector-icons/AntDesign'
const Realm = require('realm');

const CustomerSchema = {
    name: 'Customers',
    properties: {
        id: 'string',
        name: 'string',
        phone: 'string',
        address: 'string'
    }
};



function AddNewBill(props) {

    const { syncinfo, billArray,
        setBillArray, updateLocalBills, DATABASE_OPERATION, filteredCustomers } = useContext(AppContext)

    const [fitered, setFilterd] = useState([])


    const [searchMobile, setSearchMobile] = useState('')
    const [searchName,setSearchName] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    useEffect(() => {
        // setFilterd(productData)
    }, [])

    const requiredMediaByName = (code) => {
        console.warn('se')
        var x = productData.find(data => data.code == 'ZXIOX X7');
        if (x) {
            console.warn(x)
        }
        else {
            console.warn('nop')
        }
    };

    const readDatawithMobile = (mobile) => {
        var serchQuery = {
            type: 'cus',
            key: mobile
        }
        DATABASE_OPERATION(serchQuery)
    }

    const readDatawithName = (name) => {
        var serchQuery = {
            type: 'cus_name',
            key: name
        }
        DATABASE_OPERATION(serchQuery)
    }



    const onPressCreate = (Customer) => {
        console.warn(syncinfo.shop.shop_pk)

        var billObj = {
            "shop_id": syncinfo.shop_pk,
            "customer_pk": Customer.id,
            "warehouse_pk": syncinfo.warehouse.id,
            "special_discount": "0",
            "sale_items": [],
            "c_name": Customer.name,
            "c_phone": Customer.phone,
        }
        console.warn(billObj)

        var arr = [...billArray]
        arr.push(billObj)
        setBillArray(arr)
        updateLocalBills(arr)
        var index = arr.indexOf(billObj)
        props.OnCreateNewBill(index)

        // props.onSelect(item)
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5}' }}>
            <View style={styles.mainContainer}>
                <View style={styles.headBox}>
                    <TouchableOpacity
                        style={{ height: 50, justifyContent: 'center', width: 100 }}
                        onPressIn={props.onClose}>
                        <Text style={{ fontFamily: config.semi_bold, color: 'white' }}>GO BACK</Text>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: config.regular, color: 'white', marginRight: 10 }}>Select your Customer</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: config.regular, color: 'white', marginRight: 10 }}>Mobile</Text>
                        <View style={{ height: 40, width: 200, borderRadius: 5, backgroundColor: 'white' }}>
                            <TextInput
                                placeholder='Enter Customer Mobile...'
                                keyboardType='number-pad'
                                autoFocus
                                onChangeText={text => { readDatawithMobile(text), setSearchMobile(text) }}
                                value={searchMobile}
                            />
                        </View>
                        <TouchableOpacity onPress={() => readDatawithMobile(searchMobile)}
                            style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                            <AntDesign name='arrowright' size={20} color='white' />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:5 }}>
                        <Text style={{ fontFamily: config.regular, color: 'white', marginRight: 10 }}>Name </Text>
                        <View style={{ height: 40, width: 200, borderRadius: 5, backgroundColor: 'white' }}>
                            <TextInput
                                placeholder='Enter Customer Name...'
                                onChangeText={text => { readDatawithName(text), setSearchName(text) }}
                                value={searchName}
                            />
                        </View>
                        <TouchableOpacity onPress={() => readDatawithMobile(searchMobile)}
                            style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                            <AntDesign name='arrowright' size={20} color='white' />
                        </TouchableOpacity>
                    </View>



                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={filteredCustomers}
                        keyboardShouldPersistTaps='always'
                        renderItem={(({ item }) =>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedCustomer(item)
                                    Alert.alert(
                                        "Please Confirm",
                                        "Need to create a new Bill with this Customer?",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            { text: "OK", onPress: () => onPressCreate(item) }
                                        ],
                                        { cancelable: false }
                                    );
                                }}
                                style={styles.productContainer}>
                                <View style={{ flex: 1.2, justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: config.medium, color: config.themeColor }}>{item.phone}</Text>
                                </View>
                                <View style={{ flex: 3, justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: config.light, fontSize: 12, color: 'gray', marginLeft: 5 }}>{item.name}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: config.light, fontSize: 12, color: 'gray' }}>{item.address}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        height: config.DevHeight - 50,
        backgroundColor: 'white',
        marginHorizontal: 10,
        elevation: 3,
        marginVertical: 10,
        borderRadius: 20,

    },
    headBox: {
        backgroundColor: config.themeColor,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,

        padding: 10,

    },
    productContainer: {
        minHeight: 50,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#abc',
        marginHorizontal: 10,
        paddingVertical: 5
    }
})

export { AddNewBill }
