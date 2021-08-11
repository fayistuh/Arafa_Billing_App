import React from 'react'
import { View, Text, Dimensions } from 'react-native'



export default {
    DevHeight: Dimensions.get('window').height,
    DevWidth: Dimensions.get('window').width,
    bold: 'Poppins-Bold',
    semi_bold: 'Poppins-SemiBold',
    medium: 'Poppins-Medium',
    regular: 'Poppins-Regular',
    light: 'Poppins-Light',
    border_color: '#ded5d5',
    ipAddress: 'https://www.arafamobiles.com/api/v1',
    themeColor: '#3c4a8c'


}


//**************IMPORTANT FIXING****************************** */

//react-native-bluetooth-escpos-printer

//YOUR_PROJECT/node_modules/react-native-bluetooth-escpos-printer/android/build.gradle
//android {
   // compileSdkVersion 28
   // buildToolsVersion "28.0.3"   
//}

