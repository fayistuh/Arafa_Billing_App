import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import config from '../Config'

function CustomeButton(props) {
    return (
        <TouchableOpacity
            disabled={props.disabled}
            onPress={props.onPress}
            style={[styles.container, { marginVertical: props.MarginVertical ? props.MarginVertical : 0 }]}>
            <Text style={{ fontFamily: config.semi_bold, color: 'white', }}>{props.Content}</Text>
            {props.Activity && <ActivityIndicator size={20} color='white' />}
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 50,
        width: config.DevWidth - 50,
        borderRadius: 25,
        backgroundColor: '#3c4a8c',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'

    }
});

export { CustomeButton }
