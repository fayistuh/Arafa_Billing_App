import React, { useState, useContext, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Modal, Alert, BackHandler } from 'react-native'
import config from '../Config'
import { Record } from './Record'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AddNewBill } from './AddNewBill'
import AppContext from '../constant'
import Toast from 'react-native-simple-toast'



export default function index(props) {
    const { billArray,
        setBillArray, updateLocalBills } = useContext(AppContext)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (props.navigation.isFocused()) {
            const backAction = () => {
                props.navigation.goBack()
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );

            return () => backHandler.remove();
        }
        else false
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: config.bold, fontSize: 20, color: config.themeColor }}>SALES</Text>
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.headBox}>
                        <View style={{ flex: 2, justifyContent: 'center', paddingLeft: 10 }}>
                            <Text style={{ fontFamily: config.semi_bold, color: 'white', fontSize: 12 }}>Customer</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ fontFamily: config.semi_bold, color: 'white', fontSize: 12 }}>Item Count</Text>
                            {/* <MaterialCommunityIcons name='currency-inr' size={15} color='white' /> */}
                        </View>
                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
                            <Text style={{ fontFamily: config.semi_bold, color: 'white', fontSize: 12 }}>Action</Text>
                        </View>
                    </View>

                    <FlatList
                        data={billArray}
                        renderItem={(({ item, index }) =>
                            <Record
                                Data={item}
                                onEditPress={() => {
                                    var key = 'old'
                                    props.navigation.navigate('adder', { index,key })
                                }}
                                onPressRemove={() => {
                                    Alert.alert(
                                        "Wait",
                                        "Are you sure want to delete this bill",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "OK", onPress: () => {
                                                    var arr = [...billArray]
                                                    arr.splice(index, 1)
                                                    setBillArray(arr)
                                                    updateLocalBills(arr)
                                                    console.warn('Deleted')
                                                    Toast.show('Bill Deleted successfully')
                                                }
                                            }
                                        ],
                                        { cancelable: false }
                                    );

                                }}
                            />
                        )}
                    />

                    <TouchableOpacity onPress={() => {
                        setShowModal(true)
                    }}
                        style={styles.Buttoncontainer}>
                        <AntDesign name='addfile' size={15} color='white' style={{ marginTop: -3 }} />
                        <Text style={{ fontFamily: config.semi_bold, color: 'white', marginLeft: 5 }}>ADD NEW BILL</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>

            <Modal
                transparent
                visible={showModal}
                animationType='fade'
                onRequestClose={() => setShowModal(false)}
            >
                <AddNewBill
                    onClose={() => setShowModal(false)}
                    OnCreateNewBill={(index) => {
                        setShowModal(false)
                        var key = 'new'
                        props.navigation.navigate('adder', { index,key })
                        Toast.show('New Bill Genarated')

                    }}
                />

            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        minHeight: 400,
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
        flexDirection: 'row'
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