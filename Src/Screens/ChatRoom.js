import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {Container} from 'native-base';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import Style from '../Components/Style';
import Loading from "../Components/Loading";
import SocketIOClient from 'socket.io-client';

class ChatRoom extends Component {
    static navigationOptions = {
        title: 'Chatting'
    };

    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            data: [],
            messages: [],
            conversationId: this.props.navigation.state.params.id
        };
        this.renderBubble = this.renderBubble.bind(this);
        this.socket = SocketIOClient(Style.host);
        this.socket.on('refresh messages', message => {
            this.setState((previousState) => ({
                messages: GiftedChat.append(previousState.messages, message),
            }));
        });
        console.disableYellowBox = true;
    }

    componentWillMount() {
        AsyncStorage.getItem('userId').then(id => {
            fetch(Style.host + '/api/chat/single/' + this.state.conversationId)
                .then(res => this.setState({userId: id, data: JSON.parse(res._bodyText)}, () => {
                    let messagesArray = [],
                        messageItem;
                    this.state.data[0].conversation.map(message => {
                        messageItem = {
                            _id: message._id,
                            text: message.body,
                            createdAt: message.createdAt,
                            user: {
                                _id: message.author._id,
                                name: message.author.profile.name
                            }
                        };
                        messagesArray.push(messageItem);
                    });
                    this.setState({messages: messagesArray});
                }))
                .catch(err => alert(err));
        }).catch(err => alert(err));
    }

    onSend(messages = []) {
        let state = this.state;
        fetch(Style.host + '/api/chat/send/' + state.userId + '/' + state.conversationId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: messages[0].text})
        }).then(res => JSON.parse(res._bodyText)).then(res => {
            let newMessage = [{_id: res.msg._id, text: res.msg.body, createdAt: res.msg.createdAt, user: {_id: res.msg.author, name: res.name}, recipient: res.recipient }],
                newNotification = {recipient: res.recipient};

            this.socket.emit('new message', newMessage);
            this.socket.emit('new notification', newNotification);
        }).catch(err => alert(err));
    }

    renderBubble(props) {
        return (
            <Bubble{...props}
                wrapperStyle={{
                    right: {backgroundColor: Style.color}
                }}/>
        );
    }

    render() {
        if(this.state.data.length > 0) {
            return (
                <Container>
                    <GiftedChat
                        messages={this.state.messages}
                        onSend={(messages) => this.onSend(messages)}
                        placeholder='Type a message...'
                        renderBubble={this.renderBubble}
                        user={{_id: this.state.userId}}
                    />
                </Container>
            );
        } else {
            return <Loading/>;
        }
    }
}

export default ChatRoom;