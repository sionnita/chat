import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {Container, Picker, Item,  List, ListItem, Left, Body, Right, Thumbnail, Text,Content} from 'native-base';
import {GiftedChat} from 'react-native-gifted-chat';
import Style from '../Components/Style';
import Loading from "../Components/Loading";
import SocketIOClient from 'socket.io-client';
var Contacts = require('react-native-contacts')

class NewChat extends Component {
    static navigationOptions = {
        title: 'New Chat'
    };

    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            users: [],
            messages: [],
            selectedUser: '',
            userName: '',
            selectedItem:[]
        };
        this.socket = SocketIOClient(Style.host);
        Contacts.checkPermission((err, permission) => {
            if (err) throw err;
          
            // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
            if (permission === 'undefined') {
              Contacts.requestPermission((err, permission) => {
                // ...
              })
            }
            if (permission === 'authorized') {
              // yay!
            }
            if (permission === 'denied') {
              // x.x
            }
          });
    }

    componentWillMount() {
        let userArray = [{_id: 'Select user', profile:{name: 'Select user'}, hp:""}];
        let selectArray = [false];

            AsyncStorage.getItem('userId').then(id => {
                fetch(Style.host + '/api/user/get/all').then(res => {
                    JSON.parse(res._bodyText).users.map(item => {
                        // console.warn(JSON.stringify(item));
                        if(item._id !== id ) {
                            // userArray.push(item);
                            Contacts.getAll((err, contacts) => {
                                if (err) throw err;
                                contacts.map(contact =>{
                                    
                                    contact.phoneNumbers.map(contacti =>{
                                    // let phones = contact.phoneNumbers[0];
                                    // console.warn(contacti.number+" cek "+item.hp);
                                        if(contacti.number == item.hp){
                                            console.warn(" sama ");
                                            userArray.push(item);
                                            selectArray.push(false);
                                            this.setState({users: userArray, userId: id, isLoading: false, selectedItem:selectArray});
                    
                                        }
                                        // console.warn(JSON.stringify(contact.phoneNumbers));
                                    });
                                });
                               
                                // contacts returned
                                // console.log(contacts)
                              })
                                
               
                        } else {
                            this.setState({userName: item.profile.name});
                        }
                    });
                    // console.warn(JSON.stringify(userArray));
                }).catch(err => alert(err));
            }).catch(err => alert(err));
      
          
      
        
    }

    onSend(messages = []) {
        let state = this.state;
        if(state.selectedUser === 'Select user'|| user === '') {
            alert('Select a user');
        } else {
            fetch(Style.host + '/api/chat/new/' + state.userId + '/' + state.selectedUser, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: messages[0].text})
            }).then(res => {
                this.socket.emit('create message', {data: `${state.userName} : ${messages[0].text}`, recipient: JSON.parse(res._bodyText).recipient});
                this.props.navigation.navigate('ChatRoom', {id: JSON.parse(res._bodyText).conversationId});
            }).catch(err => alert(err));
        }
    }

    pickerOnChange(user) {
       
        if(user !== 'Select user' || user !== '') {
           

            fetch(Style.host + '/api/chat/exist/' + this.state.userId + '/' + user).then(res => {
                if(JSON.parse(res._bodyText).length == 1) {
                    // console.warn("keluar");
                    this.props.navigation.navigate('ChatRoom', {id: JSON.parse(res._bodyText).conversationId});
                } else {
                    // console.warn("masuk");
                    this.setState({selectedUser: user});
                }
            }).catch(err => alert(err));
          
          
        }
    }

    renderChat() {
        if(this.state.users.length > 0) {
            return (
                <Container style = {{backgroundColor: '#f2f2f2'}}>
                  
                    <Content>
                    <List
                        dataArray={this.state.users}
                        renderRow={item =>
                       
              
                              <ListItem thumbnail onPress={() => this.pickerOnChange(item._id)} style = {{backgroundColor: (this.state.selectedUser == item._id) ? 'green' : '#f2f2f2'}}>
                              {item._id == "Select user" ? null:
                                <Left>
                                <Thumbnail square source={{ uri: 'http://112.78.37.121/repok/assets/images/icon-myrepo.png' }} />
                                </Left>
                                }
                                <Body>
                                <Text>{item.profile.name}</Text>
                                <Text note numberOfLines={1}>{item.hp}</Text>
                                </Body>
                            
                            </ListItem>
                      
                           
                          
                        }/> 
                    </Content>
                    <GiftedChat
                        messages={this.state.messages}
                        onSend={(messages) => this.onSend(messages)}
                        placeholder='Type a message...'
                        user={{_id: this.state.userId}}
                    />
                </Container>
            );
        } else {
            return (
                <Container style={Style.centeredPage}>
                    <Text>No user</Text>
                </Container>
            );
        }
    }

    render() {
        if (this.state.users.length > 0) {
            return (this.renderChat());
        } else {
            return <Loading/>;
        }
    }
}

export default NewChat;