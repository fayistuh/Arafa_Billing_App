import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import config from '../Config'

function CustomeButton(props) {
    const { Data } = props
    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: Data.val == 'update' ? config.themeColor : 'white' }]}>
            <Text style={{ fontFamily: Data.val == 'update' ? config.medium : config.regular, fontSize: Data.val == 'update' ? 12 : 25, color: Data.val == 'update' ? 'white' : 'black' }}>{Data.name}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 1,
        marginHorizontal: 25,
        marginVertical: 10,
        borderColor: '#abc',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
export { CustomeButton }
