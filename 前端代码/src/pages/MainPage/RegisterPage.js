import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    ToastAndroid,
    KeyboardAvoidingView
} from 'react-native';
import Screen from '../../utils/Screen'
import icon from '../../common/icon'
import ModalDropdown from 'react-native-modal-dropdown';

export default class RegisterPage extends Component {
    static navigationOptions = {header: null,};

    constructor(props) {
        super(props);
        this.recvMsg = "null";
        this.username = "";
        this.nickname = "";
        this.phoneNumber = "";
        this.password = "";
        this.QQCode="";
        this.address='';
        this.state = {
            Psw2Img: {uri:icon.correct},
            Psw2Correct: true,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                
                <View style={styles.header}>
                    <Text style={styles.headText}>加入闲书</Text>
                </View>
<View style={{alignItems:'center'}}>
                <View style={styles.inputBox}>
                    <View style={styles.imgView}>
                        <Image style={styles.img} source={{uri:icon.user}}/>
                    </View>
                    <TextInput
                        onChangeText={this.onUsernameChanged}//绑定文本变化的回调函数
                        style={styles.input}
                        placeholderTextColor={'#58a0f6'}//提示文本的颜色
                        placeholder={'  请输入用户名'}//提示文本的内容
                        underlineColorAndroid={'transparent'}/>{/*设置下划线颜色为透明*/}
                </View>

                <View style={styles.inputBox}>
                    <View style={styles.imgView}>
                        <Image style={styles.img} source={{uri:icon.user}}/>
                    </View>
                    <TextInput
                        onChangeText={this.onNicknameChanged}//绑定文本变化的回调函数
                        style={styles.input}
                        placeholderTextColor={'#58a0f6'}//提示文本的颜色
                        placeholder={'  请输入昵称'}//提示文本的内容
                        underlineColorAndroid={'transparent'}/>{/*设置下划线颜色为透明*/}
                </View>

                <View style={styles.inputBox}>
                    <View style={styles.imgView}>
                        <Image style={styles.img} source={{uri:icon.phone}}/>
                    </View>
                    <TextInput
                        style={styles.input}
                        onChangeText={this.onPhoneNumberChanged}//绑定文本变化的回调函数
                        placeholderTextColor={'#58a0f6'}//提示文本的颜色
                        placeholder={'  请输入常用手机号'}//提示文本的内容
                        underlineColorAndroid={'transparent'}/>{/*设置下划线颜色为透明*/}
                </View>

                <View style={styles.inputBox}>
                    <View style={styles.imgView}>
                        <Image style={styles.img} source={{uri:icon.qq}}/>
                    </View>
                    <TextInput
                        style={styles.input}
                        onChangeText={this.onQQChanged}//绑定文本变化的回调函数
                        placeholderTextColor={'#58a0f6'}//提示文本的颜色
                        placeholder={'  请输入qq号'}//提示文本的内容
                        underlineColorAndroid={'transparent'}/>{/*设置下划线颜色为透明*/}
                </View>
                <View style={styles.inputBox}>
                    <View style={styles.imgView}>
                        <Image style={styles.img} source={{uri:icon.address}}/>
                    </View>
                    <ModalDropdown options={['梅1-4', '梅5-8', '梅9-10', '桃1-4', '桃5-8', '桃9-12', '橘1-4']}
                                   dropdownStyle={{width:Screen.width*0.75,height:0.35*Screen.height}}
                                   style={{marginLeft:0.02*Screen.width}}
                                   textStyle={{marginLeft:0.02*Screen.width,fontSize:13,color:'#58a0f6'}}
                    onSelect={this._selectType}/>
                </View>
                <KeyboardAvoidingView behavior="position" keyboardVerticalOffset = {120}>
                <View style={styles.inputBox}>
                    <View style={styles.imgView}>
                        <Image style={styles.img} source={{uri:icon.password}}/>
                    </View>
                    <TextInput
                        style={styles.input}
                        onChangeText={this.onPasswordChanged}//绑定文本变化的回调函数
                        secureTextEntry={true}
                        placeholderTextColor={'#58a0f6'}//提示文本的颜色
                        placeholder={'  请输入密码，6~16个字符'}//提示文本的内容
                        underlineColorAndroid={'transparent'}/>{/*设置下划线颜色为透明*/}
                </View>

                <View style={styles.inputBox}>
                    <View style={styles.imgView}>
                        <Image style={styles.img} source={{uri:icon.password}}/>
                    </View>
                    <TextInput
                        style={styles.input}
                        onChangeText={this.onPassword2Changed}//绑定文本变化的回调函数
                        secureTextEntry={true}
                        placeholderTextColor={'#58a0f6'}//提示文本的颜色
                        placeholder={'  请再次输入密码，区分大小写'}//提示文本的内容
                        underlineColorAndroid={'transparent'}/>{/*设置下划线颜色为透明*/}
                    <Image style={{
                        width: 0.04 * Screen.height,
                        height: 0.04 * Screen.height,
                        position: 'absolute',
                        right: 10,
                    }} source={this.state.Psw2Img}/>
                </View>
                </KeyboardAvoidingView>
</View>


                <TouchableOpacity
                    onPress={this._pressButton.bind(this)}//绑定点击事件
                    style={styles.button}>
                    <Text style={styles.btnText}>{"注    册"}</Text>
                </TouchableOpacity>

            </View>
        );
    }
    _selectType = (index,value) => {
        this.address=value;
    }

    _goBack() {
        this.props.navigation.goBack();
    }

    // 跳转界面
    _pressButton() {
        if (this.state.Psw2Correct) {
            // 注册
            this.preRegister();
        }
        else
            ToastAndroid.show('两次密码不一致！', ToastAndroid.SHORT);
    }

    dealMsg = (msg) => {
        this.recvMsg = msg;
        this.Register();
    };

    preRegister() {
        socketUtil.sendAndReceive(
            "{\"type\":100,\"state\":0,\"data\":{\"UserName\":\"" +
            this.username + "\",\"NickName\":\"" +
            this.nickname + "\",\"PhoneNumber\":\"" +
            this.phoneNumber + "\",\"Psw\":\"" +
            this.password + "\",\"qq\":\"" +
            this.QQCode + "\",\"address\":\"" +
            this.address + "\"}}EOS",
            this.dealMsg
        );
    }

    Register() {
        console.warn(this.recvMsg);
        if (JSON.parse(this.recvMsg).state === 0) {
            // 注册成功
            // 记录账户信息，视作自动登录成功
            storage.save({
                key: 'hasLogined',
                data: {
                    'UserName': this.username,
                    'Password': this.password,
                    'UserID': JSON.parse(this.recvMsg).userid,
                    'NickName': this.nickname,
                    'PhoneNumber': this.phoneNumber,
                    'QQ':this.QQCode,
                    'Address':this.address
                },
                // 有效期30天
                expires: 1000 * 3600 * 24 * 30
            });
            ToastAndroid.show('注册成功！', ToastAndroid.SHORT);
            // 跳转
            this.props.navigation.navigate('MainPage',{selectedTab:'host'});
        } else if (JSON.parse(this.recvMsg).state === 1) {
            // 注册失败
            ToastAndroid.show('用户名已被注册！', ToastAndroid.SHORT);
        } else {
            ToastAndroid.show('意料外的错误，请联系管理员', ToastAndroid.SHORT);
        }
    }

    onUsernameChanged = (newUsername) => {
        this.username = newUsername;
    };

    onNicknameChanged = (newNickname) => {
        this.nickname = newNickname;
    };

    onPhoneNumberChanged = (PhoneNumber) => {
        this.phoneNumber = PhoneNumber;
    };

    onQQChanged = (QQCode) => {
        this.QQCode = QQCode;
    };

    onPasswordChanged = (Password) => {
        this.password = Password;
    };

    onPassword2Changed = (Password2) => {
        if (this.password.toString() !== Password2.toString()) {
            this.setState({Psw2Img: {uri:icon.incorrect}});
            this.state.Psw2Correct = false;
        }
        else {
            this.setState({Psw2Img: {uri:icon.correct}});
            this.state.Psw2Correct = true;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#58a0f6',
        flex: 1
    },
    iconStyle: {
        marginTop: 0.01 * Screen.height,
        marginLeft: 0.01 * Screen.height,
        width: 0.045 * Screen.height,
        height: 0.045 * Screen.height,
    },
    headText: {
        marginTop: 0.05 * Screen.height,
        fontSize: 24,
        color: '#FFF',
    },
    header: {
        marginBottom: 0.05 * Screen.height,
        backgroundColor: '#58a0f6',
        width: Screen.width,
        height: 0.15 * Screen.height,
        justifyContent:'center',
        alignItems:'center'
    },
    imgView: {
        marginLeft: 0.014 * Screen.height,
        paddingRight: 0.01 * Screen.height,
        borderRightWidth: 1,
        borderColor: '#000000'
    },
    img: {
        width: 0.045 * Screen.height,
        height: 0.045 * Screen.height,
    },
    input: {
        width: 0.8 * Screen.width,
        height: 0.075 * Screen.height,
        fontSize: 13,
        color: '#58a0f6',// 输入框输入的文本为黑色
        marginLeft:0.02*Screen.width
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
    button: {
        marginTop: 0.05 * Screen.height,
        height: 0.075 * Screen.height,
        width: 0.9 * Screen.width,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#FFF',
    },
    btnText: {
        color: '#58a0f6',
        fontSize: 17,
        fontWeight: 'bold'
    }
});
