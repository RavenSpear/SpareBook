import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ToastAndroid, Platform, Alert,KeyboardAvoidingView,Keyboard
} from 'react-native';

import Screen from '../../utils/Screen'
import icon from '../../common/icon'

const img_userName = {uri:icon.user};
const img_Psw = {uri:icon.password};

export default class LoginPage extends Component {
    static navigationOptions = {header: null,};

    recvMsg = "null";

    constructor(props) {
        super(props);
        this.state = {
            username: "null",
            password: "null",
            keyposition:0
        };
    }

    componentDidMount() {
        // keyboardWillShow：软键盘将要显示
        // keyboardDidShow：软键盘显示完毕
        // keyboardWillHide：软键盘将要收起
        // keyboardDidHide：软键盘收起完毕
        // keyboardWillChangeFrame：软件盘的 frame 将要改变
        // keyboardDidChangeFrame：软件盘的 frame 改变完毕
        Keyboard.addListener('keyboardDidShow', (event) => {
            // console.log('keyboard:', event)
            this.setState({
                keyposition: isIphoneX() ? event.duration + 80 : event.duration,
            })
        })
        Keyboard.addListener('keyboardDidHide', (event) => {
            this.setState({
                keyposition: 0
            })
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView behavior="position" keyboardVerticalOffset = {120}>
                    <View style={{alignItems: 'center'}}>
                <Image source={{uri:icon.logo}} style={{marginTop:0.1*Screen.height,width:0.4*Screen.width,height:0.4*Screen.width}}/>
                <View style={styles.welcomeStyle}>
                    <Text style={{fontSize: 24,color:'#FFF'}}>Welcome to 闲书</Text>
                </View>
                    </View>

                <View style={styles.inputBox}>
                    <View style={styles.imgView}>
                        <Image style={styles.img} source={img_userName}/>
                    </View>

                    <TextInput
                        onChangeText={this.onUsernameChanged}// 绑定文本变化的回调函数
                        style={styles.input}
                        placeholderTextColor={'#58a0f6'}// 提示文本的颜色
                        placeholder={'  请输入用户名'}// 提示文本的内容
                        underlineColorAndroid={'transparent'}/>{/*设置下划线颜色为透明*/}

                </View>

                <View style={styles.inputBox}>
                    <View style={styles.imgView}>
                        <Image style={styles.img} source={img_Psw}/>
                    </View>
                    <TextInput
                        style={styles.input}
                        onChangeText={this.onPasswordChanged}// 绑定文本变化的回调函数
                        secureTextEntry={true}
                        placeholderTextColor={'#58a0f6'}// 提示文本的颜色
                        placeholder={'  请输入密码，6~16个字符'}// 提示文本的内容
                        underlineColorAndroid={'transparent'}/>{/*设置下划线颜色为透明*/}
                </View>
                </KeyboardAvoidingView>

                <TouchableOpacity
                    onPress={() => this.prelogin()}// 绑定点击事件
                    style={styles.button}>
                    <Text style={styles.btnText}>{"登    录"}</Text>
                </TouchableOpacity>

                <View style={{flexDirection: 'row', marginTop: 10, width: Screen.width}}>
                    <View style={{flexDirection: 'row', width: 0.5 * Screen.width}}>
                        <View style={{width: 0.075 * Screen.width, height: 10}}/>
                        <TouchableOpacity onPress={() => this.goFindPsw()}>
                            <Text style={styles.fontStyle}>忘记密码</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: 'row-reverse', width: 0.5 * Screen.width}}>
                        <View style={{width: 0.075 * Screen.width, height: 10}}/>
                        <TouchableOpacity onPress={() => this.goRegister()}>
                            <Text style={styles.fontStyle}>新用户</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    componentDidMount() {
        // 自动登录的 逻辑改动了
        // // 取GuideScene的传参
        // if (this.props.navigation.getParam("hasLogined") === 1) {
        //     this.state.username = this.props.navigation.getParam("loginInfo", "null").UserName;
        //     this.state.password = this.props.navigation.getParam("loginInfo", "null").Password;
        //     // console.warn(this.state.username);
        //     this.prelogin();
        // }
    }

    onUsernameChanged = (Username) => {
        this.state.username = Username;
    };

    onPasswordChanged = (Password) => {
        this.state.password = Password;
    };

    dealMsg = (msg) => {
        // alert(JSON.parse(msg).type);
        this.recvMsg = msg;
        this.login();
    };

    prelogin() {
        socketUtil.sendAndReceive(
            "{\"type\":101,\"state\":0,\"data\":{\"UserName\":\"" + this.state.username + "\",\"Psw\":\"" + this.state.password + "\"}}EOS",
            this.dealMsg
        );


    }

    login() {
        if (JSON.parse(this.recvMsg).state === 0) {
            // 登陆成功
            // 记录登录
            storage.save({
                key: 'hasLogined',
                data: {
                    'UserName': this.state.username,
                    'Password': this.state.password,
                    'UserID': JSON.parse(this.recvMsg).data[0].userid,
                    'NickName': JSON.parse(this.recvMsg).data[0].nickname,
                    'PhoneNumber': JSON.parse(this.recvMsg).data[0].phonenumber,
                    'QQ':JSON.parse(this.recvMsg).data[0].qq,
                    'Address':JSON.parse(this.recvMsg).data[0].address,
                    'Avatar':JSON.parse(this.recvMsg).data[0].avatar
                },
                // 有效期30天
                expires: 1000 * 3600 * 24 * 30
            });
            if(Platform.OS === 'ios'){
            }
            else
                ToastAndroid.show("登录成功！", ToastAndroid.SHORT);
            this.props.navigation.navigate('MainPage',{selectedTab:'host'});
        } else if (JSON.parse(this.recvMsg).state === 1) {
            // 登录失败
            if(Platform.OS === 'ios'){
                Alert.alert('用户名或密码错误！');
            }
            else
                ToastAndroid.show("用户名或密码错误！", ToastAndroid.SHORT);
        } else {
            if(Platform.OS === 'ios'){
                Alert.alert('意料外的错误，请联系管理员！');
            }
            else
                ToastAndroid.show("意料外的错误，请联系管理员！", ToastAndroid.SHORT);
        }
    }

    goRegister() {
        this.props.navigation.navigate('RegisterPage');
    }

    goFindPsw() {
        //
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#58a0f6',
        paddingTop: Screen.STATUSBAR_HEIGHT,
        height: Screen.height,
        width: Screen.width
    },
    // 欢迎文字风格
    welcomeStyle: {
        marginTop: 0.05 * Screen.height,
        marginBottom: 0.1 * Screen.height,
    },
    fontStyle: {
        textDecorationLine: 'underline',
        color:'#FFF'
    },
    imgView: {
        marginLeft: 0.014 * Screen.height,
        paddingRight: 0.01 * Screen.height,
        borderRightWidth: 1,
        borderColor: '#FFF'
    },
    img: {
        width: 0.045 * Screen.height,
        height: 0.045 * Screen.height,
    },
    button: {
        marginTop: 0.05 * Screen.height,
        height: 0.075 * Screen.height,
        width: 0.9 * Screen.width,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#FFF',
        marginBottom: 8,
    },
    btnText: {
        color: '#58a0f6',
        fontSize: 17,
        fontWeight: 'bold'
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 0.9 * Screen.width,
        height: 0.075 * Screen.height,
        borderRadius: 8,
        backgroundColor: '#FFF',
        marginBottom: 8,
    },
    input: {
        width: 0.8 * Screen.width,
        height: 0.075 * Screen.height,
        fontSize: 13,
        color: '#58a0f6',// 输入框输入的文本为黑色
    },
});
