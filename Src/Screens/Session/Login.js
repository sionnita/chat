import React, {Component} from 'react';
import {Modal,AsyncStorage} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {Container, Content, Form, Item,Left,Icon, Label, Input, Button, Text} from 'native-base';
import Style from '../../Components/Style';
import Loading from '../../Components/Loading';
import firebase from 'react-native-firebase'

var conp;
class Login extends Component {
    static navigationOptions = {
        title: "Login"
    };

    constructor(props) {
        super(props);
        this.state = {
            hp: "",
            password: "",
            code:"",
            isLoading: true,
            disabled: false,
            modalVisible:false
        };
        this.loginSuccess = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Main'})
            ]
        });
    }

    componentWillMount() {
        AsyncStorage.getItem('isLogin').then(data => {
            if(data !== null) {
                let user = JSON.parse(data);
                fetch(Style.host + '/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({hp: user.hp, password: user.password})
                }).then(res => res.json()).then(res => {
                    if(res.login === 1) {
                        AsyncStorage.setItem('userId', res.id);
                        this.cek_firebase(user);
                        // this.props.navigation.dispatch(this.loginSuccess);
                    } else {
                        AsyncStorage.removeItem('isLogin');
                        this.setState({isLoading: false, disabled: false});
                    }
                }) .catch(function (error) {
                    alert(error);
                    // this.setState({isLoading: false, disabled: false});
                });
            } else {
                this.setState({isLoading: false, disabled: false});
            }
        });
    }

    login() {
        this.setState({disabled: true});
        let state = this.state;
        if (state.hp !== '' || state.password !=='') {
            let user = {
                hp: state.hp,
                password: state.password
            };
            fetch(Style.host + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({hp: user.hp, password: user.password})
            }).then(res => res.json()).then(res => {
                if(res.login === 1) {
                    AsyncStorage.setItem('isLogin', JSON.stringify(user));
                    AsyncStorage.setItem('userId', res.id);
                    // this.cek_firebase(user);
                    this.props.navigation.dispatch(this.loginSuccess);

                } else {
                    alert('Invalid phone number or password');
                    this.setState({disabled: false});
                }
            }).catch(function (error) {
                alert(error);
                this.setState({disabled: false});
            });
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
          var sukses = false;
          var y =false;
        firebase.auth().signInWithPhoneNumber(user.hp)
        .then( (confirmationResult)=> {
        if(confirmationResult._auth._user){

        firebase.auth()
            .onAuthStateChanged(user => {
                if (user) {
                    this.props.navigation.dispatch(this.loginSuccess);
                }else{
                    alert(user)
                }
            })
        }else{
            conp = confirmationResult;
            // alert('conp');
            sukses =true;
            this.setState({modalVisible:true});
            this.setState({isLoading: false});
        }

        })
        .catch( (error)=> {
            alert(error);
            // this.setState({isLoading: false, disabled: false});
        });

      }
    

    render() {
        if(!this.state.isLoading) {
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
                                <Label style={Style.input.label}>Phone Number</Label>
                                <Input value={this.state.hp} keyboardType="phone-pad" onChangeText={text => this.setState({hp: text})} autoCapitalize='none' autoCorrect={false}/>
                            </Item>
                            <Item style={Style.input.item} floatingLabel last>
                                <Label style={Style.input.label}>Password</Label>
                                <Input value={this.state.password} onChangeText={text => this.setState({password: text})} autoCorrect={false} secureTextEntry={true}/>
                            </Item>
                            <Button onPress={() => this.login()} block style={{backgroundColor: Style.color, marginTop: 45}}>
                                <Text style={{color: '#fff'}}>Login</Text>
                            </Button>
                            <Button onPress={() => this.props.navigation.navigate('Register')} block style={{backgroundColor: Style.color, marginTop: 25}}>
                                <Text style={{color: '#fff'}}>Register</Text>
                            </Button>
                        </Form>
                    </Content>
                </Container>
            );
        } else {
            return (
                <Loading/>
            );
        }
    }
}

export default Login;