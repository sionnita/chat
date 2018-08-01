import React, {Component} from 'react';
import {Container, Spinner} from 'native-base';
import Style from '../Components/Style';

class Loading extends Component {
    render() {
        return (
            <Container style={Style.centeredPage}>
                <Spinner color={Style.color}/>
            </Container>
        );
    }
}

export default Loading;