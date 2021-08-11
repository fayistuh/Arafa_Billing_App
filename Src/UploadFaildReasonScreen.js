import React, { useContext } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import Config from './Config'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AppContext from './constant'



export default function UploadFaildReasonScreen(props) {
    const { userToken } = useContext(AppContext)
    const { data, res } = props.route.params
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ height: 50, backgroundColor: 'white', elevation: 3, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => props.navigation.goBack()}
                    style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <AntDesign name='left' size={20} />
                </TouchableOpacity>
                <Text style={{ fontFamily: Config.semi_bold, marginBottom: -5 }}>REASON</Text>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 15 }}>
                    <Text style={{
                        fontFamily: Config.medium
                    }}>Response</Text>
                    <View style={{ minHeight: 50, backgroundColor: 'darkred', padding: 10 }}>
                        <Text style={{ fontFamily: Config.regular, color: 'white' }}>Code: {res.StatusCodes}</Text>
                        <Text style={{ fontFamily: Config.regular, color: 'white' }}>Message: {res.message}</Text>
                    </View>

                    <Text style={{
                        fontFamily: Config.medium, marginTop: 20
                    }}>Api URL used</Text>
                    <View style={{ minHeight: 50, backgroundColor: 'darkred', padding: 10 }}>
                        <Text style={{ fontFamily: Config.light, color: 'white' }}>{Config.ipAddress + '/sales/create/'}</Text>
                    </View>

                    <Text style={{
                        fontFamily: Config.medium, marginTop: 20
                    }}>Body</Text>
                    <View style={{ minHeight: 50, backgroundColor: 'darkred', padding: 10 }}>
                        <Text style={{ fontFamily: Config.light, color: 'white' }}>
                            {`headers: {
                'Authorization': 'Bearer ${userToken},
            }
            `}
                        </Text>
                        <Text style={{ fontFamily: Config.light, color: 'white' }}>data:</Text>
                        <Text style={{ fontFamily: Config.light, color: 'white' }}>[</Text>
                        {data.map((item) =>
                            <Text style={{ fontFamily: Config.light, color: 'white' }}>
                                {JSON.stringify(item)}
                            </Text>

                        )}
                        <Text style={{ fontFamily: Config.light, color: 'white' }}>]</Text>

                        {/* <Text style={{ fontFamily: Config.light, color: 'white' }}>
                            {`data: ${JSON.stringify(data)}
            `}
                        </Text> */}
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
