import React, {Component} from 'react';
import {FlatList, AsyncStorage} from 'react-native';
import {Container, Left, Body, Text, View, Card, CardItem} from 'native-base';
import Style from '../Components/Style';
import Loading from "../Components/Loading";
import SocketIOClient from 'socket.io-client';
import PushController from '../Components/notficationControl';
import PushNotification from 'react-native-push-notification';

class Home extends Component {
    static navigationOptions = {
        title: 'conversation'
    };
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            data: [],
            isLoading: true,
        };
        console.ignoredYellowBox = ['Setting a timer'];
        this.socket = SocketIOClient(Style.host);
        this.socket.on('refresh conversation', data => {
            this.setState({userId: this.state.userId}, () => {
                fetch(Style.host + '/api/chat/' + this.state.userId).then(res => this.setState({data: JSON.parse(res._bodyText)}, ()=> console.log(JSON.parse(res._bodyText)) )).catch(err => alert(err));
            });
            if (data.recipient === this.state.userId) {
                PushNotification.localNotificationSchedule({
                    message: data.data,
                    date: new Date(Date.now())
                });
            }
        });
        this.socket.on('refresh messages', data => {
            if (data[0].recipient === this.state.userId) {
                PushNotification.localNotificationSchedule({
                    message: `${data[0].user.name} : ${data[0].text}`,
                    date: new Date(Date.now())
                });
            }
        });
    }

    componentWillMount() {
        AsyncStorage.getItem('userId').then(id => {
            this.setState({userId: id}, () => {
                fetch(Style.host + '/api/chat/' + this.state.userId).then(res => this.setState({data: JSON.parse(res._bodyText)}, ()=> console.log(JSON.parse(res._bodyText)) )).catch(err => alert(err));
            });
        }).catch(err => alert(err));
        this.setState({isLoading: false});
    }

    renderConversations() {
        if (this.state.data.length === 0) {
            return (
                <View style={Style.centeredPage}>
                    <Text>No Conversation</Text>
                </View>
            );
        } else {
            return (
                <FlatList
                    data = {this.state.data.fullConversations}
                    keyExtractor = {(item, index) => index}
                    renderItem = {({item, index}) =>
                        <Card>
                            <CardItem onPress={() => this.props.navigation.navigate('ChatRoom', {id: item[0].conversationId})} button style={{height: 66}}>
                                <Left><Text style={{fontWeight: '700'}}>{item[0].author.profile.name}: </Text></Left>
                                <Body style={{flex: 3, paddingTop: 10, overflow: 'hidden'}}><Text>{item[0].body}...</Text></Body>
                            </CardItem>
                        </Card>
                    }
                />
            );
        }
    }

    render() {
        if(!this.state.isLoading) {
            return(
                <Container style={{padding: 8}}>
                    {this.renderConversations()}
                    <PushController />
                </Container>
            );
        } else {
            return <Loading/>
        }
    }
}

export default Home;