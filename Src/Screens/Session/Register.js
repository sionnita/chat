import React, {Component} from 'react';

import {Modal,AsyncStorage} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {Container, Content, Form, Item,Left,Icon, Label, Input, Button, Text} from 'native-base';
import Style from '../../Components/Style';
import firebase from 'react-native-firebase';


class Register extends Component {
    static navigationOptions = {
        title: 'Register'
    };

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            hp: '',
            password: '',
            repassword: '',
            code:'',
            disabled: false,
            modalVisible:false
        };
        this.loginSuccess = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'Main'})
            ]
        });
    }

    register() {
        this.setState({disabled: true});
        let state = this.state;
        if (state.name !== "" && state.hp !== "" && state.password !== "") {
            if (state.password === state.repassword) {
                let user = {
                    name: state.name,
                    hp: state.hp,
                    password: state.password
                };
                fetch(Style.host + '/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({hp: state.hp, password: state.password, name: state.name})
                }).then(res => res.json()).then(res => {
                    // alert(res);
                    if (res.exist == 1) {
                        alert('That phone number is already in use.');
                        this.setState({disabled: false});
                    } else {
                        AsyncStorage.setItem('isLogin', JSON.stringify({hp: user.hp, password: user.password}));
                        AsyncStorage.setItem('userId', res.id);
                        alert(res.id);
                        this.cek_firebase(user);
                        // this.props.navigation.dispatch(this.loginSuccess);
                    }
                }).catch(err => alert(err));
            } else {
                alert('Passwords are not the same');
                this.setState({disabled: false});
            }
        } else {
            alert('Do not leave fields blank');
            this.setState({disabled: false});
        }
    }
    masuk() {
        alert("masuk");
        // this.setState({disabled: true});
        conp.confirm(this.state.code)
        .then((user) => {
          if (user) {
            
            this.props.navigation.dispatch(this.loginSuccess);
          }else{
            alert('Wrong');
          }
        })
        .catch((error) => {
          // const { code, message } = error;
          alert("error");
        });
    
       
      }

      cek_firebase(user){
          let sukses = false;
          let y =false;
        firebase.auth().signInWithPhoneNumber(user.hp)
        .then( (confirmationResult)=> {
        if(confirmationResult._auth._user){
            firebase.auth()
            .onAuthStateChanged(user => {
                if (user) {
                    alert("masuki");
                    // this.masuk();
                    // y = true;
                    this.props.navigation.dispatch(this.loginSuccess); 
                }
            })
      
        }else{
            conp = confirmationResult;
            // alert('conp');
            sukses =true;
            this.setState({modalVisible:true});
            // this.setState({isLoading: false, disabled: false});
        }

        })
        .catch( (error)=> {
            alert(error);
            // this.setState({isLoading: false, disabled: false});
        });

      

      }

      authen(){
        firebase.auth()
        .onAuthStateChanged(user => {
            if (user) {
                alert("masuki");
                // this.masuk();
                // y = true;
                this.props.navigation.dispatch(this.loginSuccess); 
            }
        })
      }
    

    render() {
            return (
                <Container>
                    <Modal animationType = {"slide"} transparent = {false}
               visible = {this.state.modalVisible}
               onRequestClose = {()=> { console.log("Modal has been closed.") } }>
              
          <Left>
            <Button transparent onPress={() => this.setState({modalVisible:!this.state.modalVisible})}>
              <Icon active name="arrow-back" />
            </Button>
          </Left>
          <Content padder>
                        <Form>
                            <Item style={Style.input.item} floatingLabel last>
                                <Label style={Style.input.label}>Kode Verifikasi</Label>
                                <Input value={this.state.code} keyboardType="phone-pad" onChangeText={text => this.setState({code: text})} autoCapitalize='none' autoCorrect={false}/>
                            </Item>
                          
                            <Button onPress={() => this.masuk()} block style={{backgroundColor: Style.color, marginTop: 45}}>
                                <Text style={{color: '#fff'}}>Verifikasi</Text>
                            </Button>
                          
                        </Form>
                    </Content>
    </Modal>
                <Content padder>
                    <Form>
                        <Item style={Style.input.item} floatingLabel last>
                            <Label style={Style.input.label}>Name</Label>
                            <Input value={this.state.name} onChangeText={text => this.setState({name: text})} autoCorrect={false}/>
                        </Item>
                        <Item style={Style.input.item} floatingLabel last>
                            <Label style={Style.input.label}>Phone Number</Label>
                            <Input value={this.state.hp} keyboardType="phone-pad" onChangeText={text => this.setState({hp: text})} autoCorrect={false} autoCapitalize='none'/>
                        </Item>
                        <Item style={Style.input.item} floatingLabel last>
                            <Label style={Style.input.label}>Password</Label>
                            <Input value={this.state.password} onChangeText={text => this.setState({password: text})} autoCorrect={false}secureTextEntry={true}/>
                        </Item>
                        <Item style={Style.input.item} floatingLabel last>
                            <Label style={Style.input.label}>Again Password</Label>
                            <Input value={this.state.repassword}
                                   onChangeText={text => this.setState({repassword: text})} secureTextEntry={true}/>
                        </Item>
                        <Button onPress={() => this.register()} disabled={this.state.disabled} block style={{backgroundColor: Style.color, marginTop: 45}}>
                            <Text style={{color: '#fff'}}>Register</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.goBack()} block style={{backgroundColor: Style.color, marginTop: 25}}>
                            <Text style={{color: '#fff'}}>Login</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default Register;