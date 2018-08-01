import {StackNavigator, TabNavigator} from 'react-navigation';
import Style from '../Components/Style';
import {
     Header,
     
  } from "native-base";
import HomeScreen from '../Screens/Home';
import LoginScreen from '../Screens/Session/Login';
import RegisterScreen from '../Screens/Session/Register';
import ChatRoomScreen from '../Screens/ChatRoom';
import NewChat from '../Screens/NewChat';

const Main = TabNavigator({
    Home: {screen: HomeScreen},
    NewChat: {screen: NewChat}
}, {
    tabBarOptions: {
        labelStyle: {fontSize: 15},
        style: {backgroundColor: Style.color, paddingBottom: 13},
        inactiveTintColor: 'rgba(255,255,255, 0.7)',
        activeTintColor: '#fff',
        indicatorStyle: {backgroundColor: '#fff', height: 4}
    }
});

const App = StackNavigator({
    Login: {screen: LoginScreen},
    Register: {screen: RegisterScreen},
    Main: {screen: Main},
    ChatRoom: {screen: ChatRoomScreen}
}, {
    navigationOptions: {
        title: 'Chat',
        headerStyle: {backgroundColor: Style.color, elevation: 0},
        headerTintColor: '#fff',
    }
});

export default App;