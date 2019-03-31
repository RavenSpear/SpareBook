import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Image,
    TouchableOpacity,
    ToastAndroid, Platform, Alert
} from 'react-native';
import Screen from '../../utils/Screen'

export default class SplashScene extends Component {
    static navigationOptions = {header: null,};

    constructor(props) {
        super(props);
        this.state = {  // 动画效果
            bounceValue: new Animated.Value(0),// 设置初始值
            time: 5,
            allowSkip: false,
            hasLogined: 0,
            loginInfo: {},
            SplashPic: "http://i2.bvimg.com/661327/b08a88cab56f94d6s.jpg",
        };
        storage.load({
            key: 'hasLogined',
            autoSync: false,
            syncInBackground: false,
        }).then(ret => {
            // 发现有这个key，说明已登录过
            this.setState({hasLogined:1,loginInfo:ret});
            this.state.hasLogined = 1;
            this.state.loginInfo = ret;
        }).catch(err => {
            // 没有登陆过，do nothing
        });
    }

    // 渲染前调用
    componentWillMount() {
        // 读取

    }

    render() {
        return (
            <Animated.View style={{
                width: Screen.width,
                height: Screen.height - Screen.STATUSBAR_HEIGHT,
                opacity: this.state.bounceValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0]
                })
            }}>
                <Image source={{uri: this.state.SplashPic}} style={{width: Screen.width, height: 0.7 * Screen.height}}/>
                <View style={styles.infoStyle}>
                    <Text style={{fontSize: 30, fontWeight: 'bold', color: '#58a0f6'}}>闲书</Text>
                    <Text style={{fontSize: 14}}>东南大学 校园二手交易平台</Text>
                    <Text style={{fontSize: 10, position: 'absolute', bottom: 8}}>Copy right @ 闲书 项目组</Text>
                </View>
                <TouchableOpacity onPress={() => this._pressSkip()} style={styles.button}>
                    <Text style={styles.btnText}>{"跳过 " + this.state.time}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    componentDidMount() {
        // 5s后自动跳过
        this.timer1 = setTimeout(() => {
            Animated.timing(
                this.state.bounceValue, // 初始值
                {toValue: 1, duration: 300}// 结束值
            ).start();// 开始
            this._pressSkip();
        }, 5100);
        // 刷新倒计时数字
        this.timer2 = setInterval(() => {
            this.setState({
                time: this.state.time - 1
            });
        }, 1000);
        // 1.5s后使跳过可用
        this.timer3 = setTimeout(() => {
            this.state.allowSkip = true;
        }, 1500);
    }

    // 跳过逻辑
    _pressSkip() {
        if (this.state.allowSkip === true) {
            if (this.state.hasLogined === 1) {
                storage.load({
                    key: 'hasLogined',
                    autoSync: false,
                    syncInBackground: false,
                }).then(ret => {
                    // 发现有这个key，说明已登录过
                    socketUtil.sendAndReceive(
                        "{\"type\":101,\"state\":0,\"data\":{\"UserName\":\"" + ret.UserName + "\",\"Psw\":\"" + ret.Password + "\"}}EOS",
                        (msg)=>{
                            if (JSON.parse(msg).state === 0) {
                                // 登陆成功
                                // 记录登录
                                storage.save({
                                    key: 'hasLogined',
                                    data: {
                                        'UserName': JSON.parse(msg).data[0].username,
                                        'Password': JSON.parse(msg).data[0].psw,
                                        'UserID': JSON.parse(msg).data[0].userid,
                                        'NickName': JSON.parse(msg).data[0].nickname,
                                        'PhoneNumber': JSON.parse(msg).data[0].phonenumber,
                                        'QQ':JSON.parse(msg).data[0].qq,
                                        'Address':JSON.parse(msg).data[0].address,
                                        'Avatar':JSON.parse(msg).data[0].avatar
                                    },
                                    // 有效期30天
                                    expires: 1000 * 3600 * 24 * 30
                                });
                                if(Platform.OS === 'ios'){
                                }
                                else
                                    ToastAndroid.show("欢迎回来，" + this.state.loginInfo.NickName, ToastAndroid.SHORT);
                                this.props.navigation.navigate('MainPage',{selectedTab:'host'});
                            } else if (JSON.parse(msg).state === 1) {
                                // 登录失败
                                if(Platform.OS === 'ios'){
                                    Alert.alert('自动登录失败！');
                                }
                                else
                                    ToastAndroid.show("自动登录失败！", ToastAndroid.SHORT);
                                this.props.navigation.navigate('LoginPage');
                            } else {
                                if(Platform.OS === 'ios'){
                                    Alert.alert('意料外的错误，请联系管理员！');
                                }
                                else
                                    ToastAndroid.show("意料外的错误，请联系管理员！", ToastAndroid.SHORT);
                            }
                        }
                    );
                }).catch(err => {
                    // 没有登陆过，do nothing
                });
            }
            else
                this.props.navigation.navigate('LoginPage');
            clearTimeout(this.timer1);
            clearInterval(this.timer2);
            clearTimeout(this.timer3);
        }
    }
}

// define your styles
const styles = StyleSheet.create({
    infoStyle: {
        width: Screen.width,
        height: 0.3 * Screen.height - Screen.STATUSBAR_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    // 跳过按钮
    button: {
        paddingLeft: 7,
        paddingRight: 7,
        position: 'absolute',
        right: 5,
        top: 0.7 * Screen.height + 0.5 * Screen.STATUSBAR_HEIGHT,
        height: 30,
        // width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#cccccc',
    },
    // 跳过文字按钮
    btnText: {
        color: '#000000',
        fontSize: 15,
        // fontWeight: 'bold'
    },
});