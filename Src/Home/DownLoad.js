import React, {
    useState,
    useEffect,
    useContext
} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import config from '../Config'
import AppContext from '../constant'
import AntDesign from 'react-native-vector-icons/AntDesign'

const Realm = require('realm');

const productsSchema = {
    name: 'Products',
    properties: {
        id: 'string',
        code: 'string',
        name: 'string',
        shop: 'string',
        shop_name: 'string',
        section_name: 'string',
        category_name: 'string',
        sub_category_name: 'string',
        brand_name: 'string',
        price: 'string',
        tax: 'string',
        discount: 'string'

    }
};

const CustomerSchema = {
    name: 'Customers',
    properties: {
        id: 'string',
        name: 'string',
        phone: 'string',
        address: 'string'
    }
};

function DownLoad(props) {
    const { productData,
        setProductData,
        customerData,
        setCustomerData,
        syncinfo,
        shopsTask,
        customerTask,
        productTask,
        availableShops,
        selectedShop,
        setSelectedShop,
        downloading,
        setDownloading,
        onStartDownload,

        listingMode,
        setListingMode,
        onRequestWarehouse,
        availableWarehouses,
        setSelectedWareHose,
        selectedWareHose


    } = useContext(AppContext)
    const ip = config.ipAddress


    //##################################################################################
    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <View style={{ height: 350, backgroundColor: 'white', borderTopRightRadius: 10, borderTopLeftRadius: 10, padding: 15 }}>

                {downloading &&
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontFamily: config.regular, fontSize: 12, color: 'gray' }}>Downloading Customers...</Text>
                                {customerTask == 'waiting' || customerTask == 'Done' ?
                                    <Text style={{ fontFamily: config.regular, fontSize: 12, color: 'green' }}>{customerTask}</Text>
                                    :
                                    <ActivityIndicator size={15} color='orange' />
                                }
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontFamily: config.regular, color: 'gray', fontSize: 12 }}>Downloading Products...</Text>
                                {productTask == 'waiting' || productTask == 'Done' ?
                                    <Text style={{ fontFamily: config.regular, fontSize: 12, color: 'green' }}>{productTask}</Text>
                                    :
                                    <ActivityIndicator size={15} color='orange' />
                                }

                            </View>
                            <Text style={{ fontFamily: config.regular, fontSize: 12, color: config.themeColor }}>Please wait, it will take a few moments</Text>
                        </View>
                        {/* <TouchableOpacity
                            disabled
                            style={{ height: 50, backgroundColor: '#f0615b', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: config.bold, color: 'white' }}>STOP DOWNLOADING</Text>
                        </TouchableOpacity> */}
                    </View>}

                {!downloading && <View style={{ flex: 1 }}>



                    {listingMode == 'shops' &&
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: config.medium, fontSize: 18, color: config.themeColor }}>Select your Shop</Text>
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={availableShops}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={(({ item }) =>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedShop(item)
                                            }}
                                            style={{ height: 40, borderBottomWidth: 0.5, justifyContent: 'space-between', borderColor: 'gray', flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: config.medium, fontSize: 14, color: 'gray' }}>{item.name}</Text>
                                            {selectedShop == item && <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}>
                                                <AntDesign name='check' size={15} color='white' />
                                            </View>}
                                        </TouchableOpacity>)}
                                />
                            </View>
                            <TouchableOpacity
                                disabled={selectedShop == null ? true : false}
                                onPress={() => {
                                    setListingMode('warehouse')
                                    onRequestWarehouse(selectedShop.id)
                                }}
                                style={{ height: 50, backgroundColor: selectedShop == null ? 'gray' : 'green', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontFamily: config.bold, color: 'white' }}>CONTINUE</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {listingMode == 'warehouse' &&
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPressIn={() =>
                                        setListingMode('shops')
                                    }
                                >
                                    <AntDesign name='arrowleft' size={25} />
                                </TouchableOpacity>
                                <Text style={{ fontFamily: config.medium, fontSize: 18, color: config.themeColor, marginLeft: 10 }}>Select your Warehouse</Text>

                            </View>
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={availableWarehouses}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={(({ item }) =>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedWareHose(item)
                                            }}
                                            style={{ height: 40, borderBottomWidth: 0.5, justifyContent: 'space-between', borderColor: 'gray', flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: config.medium, fontSize: 14, color: 'gray' }}>{item.name}</Text>
                                            {selectedWareHose == item && <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}>
                                                <AntDesign name='check' size={15} color='white' />
                                            </View>}
                                        </TouchableOpacity>)}
                                />
                            </View>
                            <TouchableOpacity
                                disabled={selectedWareHose == null ? true : false}
                                onPress={() => {
                                    onStartDownload()
                                }}
                                style={{ height: 50, backgroundColor: selectedWareHose == null ? 'gray' : 'green', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontFamily: config.bold, color: 'white' }}>START DOWNLOADING</Text>
                            </TouchableOpacity>
                        </View>
                    }


                </View>
                }
            </View>
        </View >
    )
}

const styles = StyleSheet.create({})

export { DownLoad }
