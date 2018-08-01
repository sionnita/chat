import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import App from './Config/Router';

class Index extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar backgroundColor="#8e44ad" barStyle="light-content"/>
                <App/>
            </View>
        );
    }
}

export default Index;