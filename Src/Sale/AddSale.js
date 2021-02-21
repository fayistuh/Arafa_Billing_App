import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import config from '../Config'
import { Record } from './Record'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';

export default function index() {
    const [sales, setSales] = useState([{}, {}, {}, {}, {}])
    const [country, setCountry] = useState('uk')
    const [shop, setShop] = useState('usa')
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: config.bold, fontSize: 20, color: config.themeColor }}>ADD A SALE</Text>
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.headBox}>
                        <Text style={{ fontFamily: config.medium, color: 'white' }}>Sub Total : </Text>
                        <MaterialCommunityIcons name='currency-inr' size={15} color='white' style={{ marginTop: -5 }} />
                        <Text style={{ fontFamily: config.medium, color: 'white' }}>2000 </Text>
                    </View>

                    <DropDownPicker
                        items={[
                            { label: 'Whole sale', value: 'usa' },
                            { label: 'Retail', value: 'uk' },
                            { label: 'Piece sale', value: 'france' },
                        ]}
                        defaultValue={country}
                        containerStyle={{ height: 40, marginHorizontal: 20, marginTop: 10 }}
                        style={{ backgroundColor: 'white', }}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        labelStyle={{ fontFamily: config.regular }}
                        dropDownStyle={{ backgroundColor: 'white', }}
                        onChangeItem={item => setCountry(item.value)
                        }
                    />

                    <DropDownPicker
                        items={[
                            { label: 'Perinthalmanna', value: 'usa' },
                            { label: 'Malappuram', value: 'uk' },
                            { label: 'Thalasseri', value: 'france' },
                        ]}
                        defaultValue={shop}
                        containerStyle={{ height: 40, marginHorizontal: 20, marginTop: 10 }}
                        style={{ backgroundColor: 'white', }}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        labelStyle={{ fontFamily: config.regular }}
                        dropDownStyle={{ backgroundColor: 'white', }}
                        onChangeItem={item => setShop(item.value)
                        }
                    />
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


    }
});