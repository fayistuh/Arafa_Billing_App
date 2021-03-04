import React, { useState, useContext, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, BackHandler, Alert } from 'react-native'
import config from '../Config'
import { CustomeButton } from './CustomeButton'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DropDownPicker from 'react-native-dropdown-picker';
import { BillRecord } from '../Bill/BillRecord'
import { SeachEngine } from './SeachEngine'
import AppContext from '../constant'
import FontAwsome5 from 'react-native-vector-icons/FontAwesome5'
import Toast from 'react-native-simple-toast'


export default function indexX(props) {
    const { index,key } = props.route.params

    const { openedBill, setOpenedBill, billArray,
        setBillArray, syncinfo, updateLocalBills } = useContext(AppContext)
    const [showModal, setModal] = useState(false)
    const [code, setCode] = useState('')
    const [price, setPrice] = useState('')
    const [qty, setQty] = useState('')
    const [subTotal, setSubTotal] = useState('0.00')
    const [product, setProduct] = useState({})

    const [mode, setMode] = useState('')
    const [updateProductIndex, setUpdateProductIndex] = useState('')

    const billIndex = index
    const Bill = billArray[billIndex]
    const PRODUCTS = Bill.sale_items

    const [salesItems, setSaleItems] = useState(PRODUCTS)
    const [discount, setDiscount] = useState(Bill.special_discount)

    useEffect(()=>{
        if(key == 'new'){
            setModal(true)
        }
    },[])

    const addToBill = () => {
        if (code == '') {
            Toast.show('Product Code not given')
        }
        else if (qty == '') {
            Toast.show('Enter a quantity')
        }
        else {
            if (mode == 'add') {

                var arx = salesItems
                var found = arx.find(element => element.product_pk == product.id)
                if (found) {
                    alert('Alredy added')
                }
                else {
                    var pr = {
                        "product_pk": product.id,
                        "product_code": product.code,
                        "price": price * qty,
                        "cost": product.price,
                        "qty": qty,
                    }
                    console.warn(pr)
                    var arr = [...salesItems]
                    arr.push(pr)
                    setSaleItems(arr)
                    clearField()
                    Toast.show('New Product added')
                }

            }
            else {

                var pr = {
                    "product_pk": product.id,
                    "product_code": code,
                    "price": product.cost * qty,
                    "cost": product.cost,
                    "qty": qty,
                }

                var dummyProducts = [...salesItems]
                dummyProducts[updateProductIndex] = pr
                setSaleItems(dummyProducts)
                Toast.show('Product updated')
                clearField()

            }
        }

    }

    const billTotal = () => {
        var Total = 0
        salesItems.map((item) => {
            Total = Total + parseFloat(item.price)
        })
        return Total.toFixed(2)
    }



    const saveBill = () => {

        var updatedBillObj = {
            "shop_id": syncinfo.shop.shop_pk,
            "customer_pk": Bill.customer_pk,
            "warehouse_pk": Bill.warehouse_pk,
            "special_discount": discount == '' ? 0 : discount,
            "sale_items": salesItems,
            "c_name": Bill.c_name,
            "c_phone": Bill.c_phone,
        }


        var dummyBills = [...billArray]
        dummyBills[billIndex] = updatedBillObj
        setBillArray(dummyBills)
        updateLocalBills(dummyBills)
        Toast.show('Bill Saved')
        console.warn(updatedBillObj)


    }

    const clearField = () => {
        setCode('')
        setPrice('')
        setQty('')
    }

    const okButton = () => {
        if (code == '' || price == '' || qty == '') {
            return false
        }
        else return true
    }

    const saveInication = () => {
        if (salesItems == Bill.sale_items && discount == Bill.special_discount) {
            return true
        }
        else return false
    }





    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView keyboardShouldPersistTaps='always'>
                <View style={styles.mainContainer}>
                    <View style={styles.headBox}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '80%' }}>
                                <Text style={{ fontFamily: config.light, color: 'white', fontSize: 13 }}>Customer name: <Text style={{ fontFamily: config.regular }}>{Bill.c_name}</Text></Text>
                                <Text style={{ fontFamily: config.light, color: 'white', fontSize: 13 }}>Customer Mobile: <Text style={{ fontFamily: config.regular }}>{Bill.c_phone}</Text></Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    saveBill()
                                }}
                                disabled={saveInication() ? true : false}
                                activeOpacity={0.8}
                                style={{ flex: 1, alignItems: 'center', opacity: saveInication() ? 0.5 : 1 }}>
                                <FontAwsome5 name='save' color='white' size={20} />
                                <Text style={{ fontFamily: config.semi_bold, color: 'white' }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Text style={{ fontFamily: config.medium, color: 'white' }}>Total:</Text>
                            <MaterialCommunityIcons name='currency-inr' size={20} color='white' style={{ marginTop: -5, marginHorizontal: 5 }} />
                            <Text onPress={() => {
                                saveBill()
                                console.warn('OKKKK')
                            }} style={{ fontFamily: config.medium, color: 'white' }}>{billTotal()}</Text>
                        </View>


                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, }}>
                            <View style={{ height: 40, flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: config.regular, fontSize: 12, color: 'gray', marginHorizontal: 10 }}>Code</Text>
                                    <View style={{ height: 40, width: 90, borderRadius: 5, borderWidth: 0.5, justifyContent: 'center', borderColor: 'gray', alignItems: 'center' }}>
                                        <Text style={{ fontFamily: config.regular }}>{code}</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, }}>

                                </View>
                            </View>

                            <View style={{ height: 40, flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: config.regular, fontSize: 12, color: 'gray', marginHorizontal: 10 }}>Price</Text>
                                    <View style={{ height: 40, width: 90, borderRadius: 5, borderWidth: 0.5, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', flexDirection: 'row' }}>
                                        <MaterialCommunityIcons name='currency-inr' size={15} style={{ marginTop: -5 }} />
                                        <Text style={{ fontFamily: config.regular }}>{price}</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: config.regular, fontSize: 12, color: 'gray', marginHorizontal: 10 }}>Qty</Text>
                                    <View style={{ height: 40, width: 110, borderRadius: 5, borderWidth: 0.5, justifyContent: 'center', borderColor: 'gray', flexDirection: 'row' }}>
                                        <TextInput
                                            style={{width:50}}
                                            placeholder='Qty'
                                            keyboardType='numeric'
                                            autoFocus={key == 'new' ? true:false}
                                            onChangeText={text => setQty(text)}
                                            value={qty}
                                        />
                                    </View>
                                </View>
                            </View>


                            <View style={{ height: 60, flexDirection: 'row', marginHorizontal: 10, marginTop: 10, }}>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ fontFamily: config.regular, fontSize: 12, color: 'gray', marginHorizontal: 10 }}>Sub Total</Text>
                                    <View style={{ height: 40, width: 110, borderRadius: 20, borderWidth: 0.5, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', flexDirection: 'row', backgroundColor: config.themeColor }}>
                                        <MaterialCommunityIcons name='currency-inr' color='white' size={15} style={{ marginTop: -5 }} />
                                        <Text style={{ fontFamily: config.medium, color: 'white' }}>{price * qty}</Text>
                                    </View>

                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', }}>
                                    <TouchableOpacity
                                        disabled={!okButton()}
                                        onPressIn={() => addToBill()}
                                        style={{ height: 50, width: 80, backgroundColor: okButton() ? config.themeColor : 'gray', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontFamily: config.bold, color: 'white' }}>OK</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPressIn={() => {
                                            setMode('add')
                                            setModal(true)
                                        }}
                                        style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: config.themeColor, justifyContent: 'center', alignItems: 'center' }}>
                                        <AntDesign name='plus' size={35} color='white' />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ height: 40, marginHorizontal: 20, position: 'absolute', top: 10, right: 0, width: 150, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray' }}>
                                <TextInput
                                    placeholder={discount == 0 ? 'Bill Discount is 0' : discount}
                                    keyboardType='numeric'
                                    onChangeText={text => setDiscount(text)}
                                    value={discount}
                                    style={{ marginLeft: 10 }}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 2, paddingHorizontal: 10 }}>
                            <View style={styles.headBoxRow}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: config.semi_bold, color: 'black', fontSize: 12 }}>Code</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: config.semi_bold, color: 'black', fontSize: 12 }}>Qty</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: config.semi_bold, color: 'black', fontSize: 12 }}>Price</Text>
                                    <MaterialCommunityIcons name='currency-inr' size={15} color='white' />
                                </View>
                                <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
                                    <Text style={{ fontFamily: config.semi_bold, color: 'black', fontSize: 12 }}>Action</Text>
                                </View>
                            </View>
                            <FlatList
                                data={salesItems}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                renderItem={(({ item, index }) =>
                                    <BillRecord
                                        Data={item}
                                        onPressEdit={() => {
                                            setMode('update')
                                            setUpdateProductIndex(index)
                                            setCode(item.product_code)
                                            setPrice(item.cost)
                                            setSubTotal(item.price)
                                            setQty(item.qty)
                                            setProduct(item)
                                        }}
                                        onPressDelete={() => {
                                            Alert.alert(
                                                "Please confirm",
                                                "Are you sure want to delete this product from bill",
                                                [
                                                    {
                                                        text: "Cancel",
                                                        onPress: () => console.log("Cancel Pressed"),
                                                        style: "cancel"
                                                    },
                                                    {
                                                        text: "OK", onPress: () => {
                                                            var arr = [...salesItems]
                                                            arr.splice(index, 1)
                                                            setSaleItems(arr)
                                                        }
                                                    }
                                                ],
                                                { cancelable: false }
                                            );

                                        }}
                                    />
                                )}
                            />
                            {/* <FlatList
                            data={presses}
                            numColumns={3}
                            renderItem={(({ item }) =>
                                <CustomeButton
                                    Data={item}
                                />
                            )}
                        /> */}
                        </View>
                    </View>
                </View>
            </ScrollView>

            <Modal
                transparent
                visible={showModal}
                animationType='fade'
                onRequestClose={() => setModal(false)}
            >
                <SeachEngine
                    onClose={() => setModal(false)}
                    onSelect={(item) => {
                        setCode(item.code)
                        setPrice(item.price)
                        setSubTotal(item.price)
                        setQty(0)
                        setProduct(item)
                        setModal(false)
                        console.warn(item)
                    }}
                />

            </Modal>
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
        height: 100,
        backgroundColor: config.themeColor,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 15

    },
    headBoxRow: {
        height: 50,
        borderColor: 'gray',
        flexDirection: 'row',
        justifyContent: 'center', alignItems: 'center',
        borderBottomWidth: 1
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