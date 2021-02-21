import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { useContext, component } from 'react'
import { enableScreens } from 'react-native-screens';



import Login from './Login/index'
import Sale from './Sale/index'
import Home from './Home/index'
import AddSale from './Sale/AddSale'
import Adder from './Adder/index'
import NewBill from './Bill/index'
import Splash from './Splash'
import AppContext from './constant';

enableScreens();
const Stack = createNativeStackNavigator();

const MyStack = () => {
    const { splash } = useContext(AppContext)


    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                {splash && <Stack.Screen name='splash' component={Splash} />}
                <Stack.Screen name="login" component={Login} />
                <Stack.Screen name="sale" component={Sale} />
                <Stack.Screen name='home' component={Home} />
                <Stack.Screen name='addsale' component={AddSale} />
                <Stack.Screen name='adder' component={Adder} />
                <Stack.Screen name='newbill' component={NewBill} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MyStack