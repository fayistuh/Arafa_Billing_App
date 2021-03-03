import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native'
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




function SeachEngine(props) {
    const { productData, DATABASE_OPERATION, filteredProducts } = useContext(AppContext)

    const [fitered, setFilterd] = useState(productData)
    const [filterKey, setFilterKey] = useState('')

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

    const readData = (code) => {
        var serchQuery = {
            type: 'pro',
            key: code
        }
        DATABASE_OPERATION(serchQuery)
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5}' }}>
            <View style={styles.mainContainer}>
                <View style={styles.headBox}>
                    <TouchableOpacity onPressIn={props.onClose}>
                        <Text style={{ fontFamily: config.semi_bold, color: 'white' }}>GO BACK</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: config.regular, color: 'white', marginRight: 10 }}>Code</Text>
                        <View style={{ height: 40, width: 150, borderRadius: 5, backgroundColor: 'white' }}>
                            <TextInput
                                placeholder='Enter code here...'
                                // keyboardType='number-pad'
                                autoFocus
                                onChangeText={text => { readData(text), setFilterKey(text) }}
                                autoCapitalize='characters'
                            />
                        </View>
                        <TouchableOpacity onPress={() => readData(filterKey)}
                            style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                            <AntDesign name='arrowright' size={20} color='white' />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={filteredProducts}
                        keyboardShouldPersistTaps
                        renderItem={(({ item }) =>
                            <TouchableOpacity
                                onPress={() => props.onSelect(item)}
                                style={styles.productContainer}>
                                <View style={{ flex: 1.2, justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: config.medium, color: config.themeColor }}>{item.code}</Text>
                                </View>
                                <View style={{ flex: 3, justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: config.light, fontSize: 12, color: 'gray' }}>{item.name}</Text>
                                </View>
                                <View style={{ flex: 1.2, justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: config.regular, }}>Rs {item.price}</Text>
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
        height: 50,
        backgroundColor: config.themeColor,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between'
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

export { SeachEngine }
