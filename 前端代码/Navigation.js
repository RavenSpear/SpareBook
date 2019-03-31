import {
    createAppContainer,
    createStackNavigator
} from 'react-navigation';

import MainPage from "./src/pages/MainPage/index";
import SearchResult from "./src/pages/HostPage/SearchResult";
import Information from "./src/pages/HostPage/Information";
import MyReservation from  "./src/pages/MyPage/MyReservation";
import MyRelease from  "./src/pages/MyPage/MyRelease";
import History from "./src/pages/MyPage/History";
import Release from "./src/pages/MainPage/Release";
import RegisterPage from "./src/pages/MainPage/RegisterPage";
import LoginPage from "./src/pages/MainPage/LoginPage";
import SplashScene from "./src/pages/MainPage/SplashScene";
import UserInformation from "./src/pages/MyPage/UserInformation";




const MainNavigator = createStackNavigator({
        MainPage: {screen: MainPage},
        SearchResult:{screen:SearchResult},
        Information:{screen :Information},
        MyReservation:{screen:MyReservation},
        MyRelease:{screen:MyRelease},
        History:{screen:History},
        Release:{screen:Release},
        RegisterPage:{screen:RegisterPage},
        LoginPage:{screen:LoginPage},
        SplashScene:{screen:SplashScene},
        UserInformation:{screen:UserInformation}
    },

    {
        initialRouteName: 'SplashScene', // 默认先加载的页面组件
        mode: 'modal',       // 定义跳转风格(card、modal)
        // initialRouteParams:{
        //     selectedTab:"host"
        // }
    }
);
const App = createAppContainer(MainNavigator);

export default App;