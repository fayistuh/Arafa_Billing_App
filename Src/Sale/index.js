import React, { useState, useContext, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Modal, Alert, BackHandler, Platform, Linking } from 'react-native'
import config from '../Config'
import { Record } from './Record'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AddNewBill } from './AddNewBill'
import AppContext from '../constant'
import Toast from 'react-native-simple-toast'

import Share from "react-native-share";
import RNHTMLtoPDF from './react-native-html-to-pdf';
import { request, PERMISSIONS } from 'react-native-permissions';
// import Pdf from 'react-native-pdf';
import PDFView from 'react-native-view-pdf'
import RNShareFile from 'react-native-share-pdf';
import html from './config'



export default function index(props) {
    const { billArray,
        setBillArray, updateLocalBills, syncinfo } = useContext(AppContext)
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

    const [invoicePath, setInvoicePath] = useState()
    const [invoiceModal, setInvoiceModal] = useState(false)
    const [invoicePathIOS, setInvoicePathIOS] = useState()


    const checkPermission = (Data) => {
        request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
            if (result == 'granted') {
                createInvoice(Data)
                console.warn('grant')
            }
            else {
                console.warn('denied')
            }
        });
    }

    const d = new Date()
    const dl = d.toDateString()

    const loopProducts = (Data) => {
        var products = Data.sale_items
        var total = 0
        var pro_list = ''
        products.map((item) => {
            var billrow = `
            <tr class="item">
                <td>
                    ${item.product_code} 
                </td>
                <td>
                    ${item.name} 
                </td>
                <td>
                    ${item.cost} 
                </td>
                <td/>
                <td>
                    ${item.qty} 
                </td>

                <td>
                    ${item.discount} 
                </td>
                
                <td>
                    ${item.price}
                </td>
            </tr>`
            pro_list = pro_list + billrow

            total = total + item.price


        })
        return { list: pro_list, sub_total: total }

    }









    const createInvoice = async (Data) => {

        var inVoice = `
        <!doctype html>
        <html>
            ${html.head}
            <body>
                <div class="invoice-box">
                    <table cellpadding="0" cellspacing="0">
                        <tr class="top">
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td>
                                            Customer Name: ${Data.c_name}<br>
                                        </td>
            
                                        <td>
                                            Created: ${dl}<br>
                                        </td>
                                        
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        
                        
                        
                        
                        
                        
                        <tr class="heading">
                            <td>
                                Product code
                            </td>
                            <td>
                                Product Name
                            </td>
                            <td>
                                Cost
                            </td>
                            <td/>
                            <td>
                                Qty
                            </td>
                            <td>
                                Discount
                            </td>
                            
                            <td>
                                Price
                            </td>
                        </tr>
                        
                       ${loopProducts(Data).list}
                        
                        
                        
                        <tr class="total">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>

                            
                            <td>
                            Sub Total:  ${loopProducts(Data).sub_total}<br>
                            Discount:  ${Data.special_discount}<br>
                            Total: ${(loopProducts(Data).sub_total) - Data.special_discount}
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
        </html>`

        const options = {
            html: inVoice,
            fileName: 'ArafaBill',
            directory: 'Documents',
            bgColor: '#ffffff',
            height: '100%'
        };

        const file = await RNHTMLtoPDF.convert(options)
        // console.log(file.filePath);
        setInvoicePath(file.filePath)

        console.log('PDF PATH', file.filePath)
        Toast.show('Invoice downloaded to your Documents');
        //   alert(file.filePath);
        setInvoiceModal(true)
    }

    const resources = {
        file: Platform.OS === 'ios' ? invoicePathIOS + ".pdf" : invoicePath,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        base64: 'JVBERi0xLjMKJcfs...',
    };


    const shareInvoice = async () => {
        Share.open({
            title: "ArafaInvoice ",
            message: "Message:",
            url: 'file://' + invoicePath,
            subject: "Report",
        })
            .then((res) => { console.warn(res) })
            .catch((err) => { console.warn('ERRR') });
    }


    const textToWhatsapp = async (Data) => {
        var dum = Data.c_phone
        if (dum.length == 10) {
            var phoneNUmber = dum
        }
        else {
            var phoneNUmber = (dum).substring(2, 12)
        }


        var products = Data.sale_items
        var pro_list = ''
        var t = 0
        products.map((item) => {

            var billrow = `%0a${item.product_code} - ${item.name} - ${item.qty} - ₹${item.price - item.discount}`
            pro_list = pro_list + billrow
            t = t + item.price

        })


        var subTotal = t
        var billDiscount = Data.special_discount
        var Total = subTotal - billDiscount

        var summary = `%0a Total ₹${Total}`

        // var shopName = syncinfo.shop.shop_name
        var shopName = `${syncinfo.shop.shop_name}`
        var msg = `${pro_list}${summary}%0a%0a%0a${shopName}`
        // var msg = `AAANAAN`
        let url = "whatsapp://send?text=" +
            msg +
            "&phone=91" +
            phoneNUmber;

        console.warn(msg)


        Linking.openURL(url)
            .then(data => {
                console.log("WhatsApp Opened successfully " + data);  //<---Success
            })
            .catch(() => {
                alert("Make sure WhatsApp installed on your device");  //<---Error
            });
    }


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
                        <View style={{ flex: 2.5, justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
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
                                    props.navigation.navigate('adder', { index, key })
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
                                onPressPrint={(Data) => {
                                    console.warn(Data)
                                    checkPermission(Data)
                                }}
                                onPressWhatsapp={(data) => {
                                    if (data.c_phone.length == 10 || data.c_phone.length == 12) {
                                        textToWhatsapp(data)
                                    }
                                    else {
                                        Toast.show('This number is not Valid')
                                    }
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
                        props.navigation.navigate('adder', { index, key })
                        Toast.show('New Bill Genarated')

                    }}
                />

            </Modal>
            <Modal visible={invoiceModal} animationType='slide' onRequestClose={() => setInvoiceModal(false)}>
                <View style={{ flex: 1, }}>
                    <PDFView
                        fadeInDuration={250.0}
                        style={{ flex: 1 }}
                        resource={resources.file}
                        resourceType={'file'}
                        onLoad={() => console.warn(`PDF rendered from ${'file'}`)}
                        onError={(error) => console.warn('Cannot render PDF', error)}
                    />
                    <View style={{ height: 50, flexDirection: 'row', margin: 10 }}>
                        <TouchableOpacity onPress={() => setInvoiceModal(false)}
                            style={{ flex: 2, backgroundColor: 'red', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
                            <Text style={{ fontFamily: config.semi_bold, color: 'white' }}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => shareInvoice()}
                            style={{ flex: 1, backgroundColor: 'green', borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ fontFamily: config.semi_bold, color: 'white', marginHorizontal: 5 }}>share</Text>
                            {/* <Icon1 name='sharealt' size={20} color='white'/> */}
                        </TouchableOpacity>
                    </View>
                </View>
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