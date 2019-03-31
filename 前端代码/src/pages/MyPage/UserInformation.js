import React, {Component} from 'react';
import {
    View,
    StatusBar,
    ToastAndroid,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    ScrollView,
    TextInput, Platform, Alert,
    KeyboardAvoidingView
} from 'react-native'
import Screen from "../../utils/Screen";
import icon from "../../common/icon";
import ModalDropdown from 'react-native-modal-dropdown';
import RNFS from 'react-native-fs';

import CameraButton from '../../component/CameraButton';

const common_url = 'http://47.102.141.201:9999/';  //服务器地址

export default class UserInformation extends Component {
    static navigationOptions = {header: null,};

    constructor(props) {
        super(props);
        this.address=this.props.navigation.state.params.address;
        this.state= {
            userid:this.props.navigation.state.params.userid,
            key:false,
            nickname:this.props.navigation.state.params.nickname,
            qq:this.props.navigation.state.params.qq,
            phonenumber:this.props.navigation.state.params.phonenumber,
            address:this.props.navigation.state.params.address,
            avatar:this.props.navigation.state.params.avatar,
            PicParams:{},
            uri:this.props.navigation.state.params.avatar,
            password:'',
            key2:false,
        }
        storage.load({
            key: 'hasLogined',
            autoSync: false,
            syncInBackground: false,
        }).then(ret => {
            if(ret.UserID===this.state.userid){
                this.setState({key2:true});
            }
            this.setState({password:ret.Password})
        }).catch(err => {
        });
    }

    render() {
        let address;
        let Avatar;
        let editbutton;
        if(!this.state.key){
            address=(<View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: Screen.width,
                height: 0.075 * Screen.height,
                backgroundColor: '#FFFFFF',
                marginBottom: 1,
                marginTop:10
            }}>
                <View style={styles.headView}>
                    <Text style={{fontSize:17,color:'#000'}}>地址</Text>
                </View>
                <TextInput// 绑定文本变化的回调函数
                    style={styles.input}
                    placeholderTextColor={'#D3D3D3'}// 提示文本的颜色
                    placeholder={''}// 提示文本的内容
                    defaultValue={this.address}
                    underlineColorAndroid={'transparent'}
                    editable={this.state.key}/>
            </View>);
            Avatar=(<View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: Screen.width,
                height: 0.3 * Screen.height,
                marginBottom: 1,
                marginTop:10,
                justifyContent:'center',
                backgroundColor:'#F0F0F0'
            }}>
                <Image source={{uri: this.state.uri}} style={styles.avatar}/>
            </View>);
            editbutton=(
                <TouchableOpacity onPress={() => {
                    let userid;
                    storage.load({
                        key: 'hasLogined',
                        autoSync: false,
                        syncInBackground: false,
                    }).then(ret => {
                        userid=ret.UserID;
                        if(userid===this.state.userid){
                            this.setState({key:true});
                        }
                    }).catch(err => {
                    });
                }
                }
                                  style={styles.iconStyle}>
                    <Text style={this.state.key2?styles.saveText:styles.saveText1}>编辑</Text>
                </TouchableOpacity>
            );
        }
        else{
            address=(<View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: Screen.width,
                height: 0.075 * Screen.height,
                backgroundColor: '#FFFFFF',
                marginBottom: 1,
                marginTop:10,
                justifyContent:'center'
            }}>
                <View style={styles.headView}>
                    <Text style={{fontSize:17,color:'#000'}}>地址</Text>
                </View>
                <ModalDropdown options={['梅1-4', '梅5-8', '梅9-10', '桃1-4', '桃5-8', '桃9-12', '橘1-4']}
                               dropdownStyle={{width:Screen.width*0.75,height:0.35*Screen.height}}
                               style={{width:Screen.width*0.77,height:0.075*Screen.height,justifyContent:'center'}}
                               textStyle={{fontSize:17}}
                               onSelect={this._selectType}
                               defaultValue={this.address}/>
            </View>);
            Avatar=(<View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: Screen.width,
                height: 0.3 * Screen.height,
                marginBottom: 1,
                marginTop:10,
                justifyContent:'center',
                backgroundColor:'#F0F0F0'
            }}>
                <CameraButton style={styles.avatar}
                              photos={[]}
                              onFileUpload={this.onFileUpload.bind(this)}
                              ImgUri={this.state.uri}/>
            </View>);
            editbutton=(
                <TouchableOpacity onPress={() => this._save()}
                                  style={styles.iconStyle}>
                    <Text style={styles.saveText}>保存</Text>
                </TouchableOpacity>
            );
        }
        return (
            <View style={{height:Screen.height,width:Screen.width,flex:1,alignItems:'center',backgroundColor:'#F0F0F0'}}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this._goBack()} style={styles.iconStyle}>
                        <Image source={{uri: icon.goback}} style={styles.btn}/>
                    </TouchableOpacity>
                    <Text style={styles.titleText}>用户详细信息</Text>
                    {editbutton}
                </View>
                <ScrollView contentContainerStyle={{paddingTop:3}}>
                    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset = {120}>
                    {Avatar}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: Screen.width,
                        height: 0.075 * Screen.height,
                        backgroundColor: '#FFFFFF',
                        marginBottom: 1,
                        marginTop:10
                    }}>
                        <View style={styles.headView}>
                            <Text style={{fontSize:17,color:'#000'}}>昵称</Text>
                        </View>
                        <TextInput
                            onChangeText={this.onNicknameChanged}// 绑定文本变化的回调函数
                            style={styles.input}
                            placeholderTextColor={'#D3D3D3'}// 提示文本的颜色
                            placeholder={''}// 提示文本的内容
                            defaultValue={this.props.navigation.state.params.nickname}
                            underlineColorAndroid={'transparent'}
                            editable={this.state.key}/>
                    </View>
                    <View style={styles.inputBox}>
                        <View style={styles.headView}>
                            <Text style={{fontSize:17,color:'#000'}}>QQ</Text>
                        </View>
                        <TextInput
                            onChangeText={this.onQQChanged}// 绑定文本变化的回调函数
                            style={styles.input}
                            placeholderTextColor={'#D3D3D3'}// 提示文本的颜色
                            placeholder={''}// 提示文本的内容
                            defaultValue={this.props.navigation.state.params.qq}
                            underlineColorAndroid={'transparent'}
                            editable={this.state.key}/>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: Screen.width,
                        height: 0.075 * Screen.height,
                        backgroundColor: '#FFFFFF',
                        marginBottom: 1,
                        marginTop:10
                    }}>
                        <View style={styles.headView}>
                            <Text style={{fontSize:17,color:'#000'}}>手机号</Text>
                        </View>
                        <TextInput
                            onChangeText={this.onPhoneNumberChanged}// 绑定文本变化的回调函数
                            style={styles.input}
                            placeholderTextColor={'#D3D3D3'}// 提示文本的颜色
                            placeholder={''}// 提示文本的内容
                            defaultValue={this.props.navigation.state.params.phonenumber}
                            underlineColorAndroid={'transparent'}
                            editable={this.state.key}/>
                    </View>
                    {address}
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        );
    }

    _save(){
        socketUtil.sendAndReceive(
            "{\"type\":121,\"state\":0,\"data\":{" +
            "\"userid\":\"" + this.state.userid +
            "\",\"qq\":\"" +this.state.qq+
            "\",\"nickname\":\"" + this.state.nickname +
            "\",\"phonenumber\":\"" + this.state.phonenumber +
            "\",\"address\":\"" + this.address +
            "\",\"avatar\":\"" + this.state.avatar +
            "\"}}EOS",
            (msg) => {

                this.setState({
                    userid:JSON.parse(msg).data[0].userid,
                    qq:JSON.parse(msg).data[0].qq,
                    nickname:JSON.parse(msg).data[0].nickname,
                    phonenumber:JSON.parse(msg).data[0].phonenumber,
                    address:JSON.parse(msg).data[0].address,
                });
                if(this.state.PicParams.uri) {
                    RNFS.readFile(this.state.PicParams.uri, 'base64')
                        .then((content) => {
                            // 得到的结果就可以 传给接口了 ，如果想要在网页上预览效果不要忘记格式转换
                            let formData = new FormData();
                            formData.append(this.state.PicParams.name, 'NMSLNMSLNMSL' + this.state.userid + 'NMSLNMSLNMSL' + 'data:image/jpeg;base64,' + content + 'NMSLNMSLNMSL');
                            this.setState({key:false});
                            storage.save({
                                key:'hasLogined',
                                data:{
                                    'Password': this.state.password,
                                    'UserName':this.props.navigation.state.params.username,
                                    'UserID': this.state.userid,
                                    'NickName': this.state.nickname,
                                    'PhoneNumber': this.state.phonenumber,
                                    'QQ':this.state.qq,
                                    'Address':this.state.address,
                                    'Avatar':this.state.PicParams.uri
                                }
                            })
                            fetch(common_url, {
                                method: 'POST',
                                body: formData
                            })
                                .then(res => res.text())
                        })
                        .catch((err) => {
                            if (Platform.OS === 'ios') {
                                Alert('图片读取失败');
                            }
                            else
                                ToastAndroid.show("图片读取失败", ToastAndroid.SHORT);
                        });
                }
                else{
                    this.setState({key:false});
                    storage.save({
                        key: 'hasLogined',
                        data: {
                            'Password': this.state.password,
                            'UserName':this.props.navigation.state.params.username,
                            'UserID': this.state.userid,
                            'NickName': this.state.nickname,
                            'PhoneNumber': this.state.phonenumber,
                            'QQ':this.state.qq,
                            'Address':this.state.address,
                            'Avatar':this.state.avatar
                        },
                        // 有效期30天
                        expires: 1000 * 3600 * 24 * 30
                    });
                }
            }
        );
    }

    onFileUpload(file, fileName){
        return this.uploadAvatar({
            id: '10000',
            type:'logo',
            obj:'user',
            corpId: '10000'
        }, file, fileName)
    }

    uploadAvatar(params, fileUrl, fileName) {
        this.setState({PicParams:{uri:fileUrl,type: 'application/octet-stream',name:fileName},
                        uri:fileUrl});
        return ;
    }

    _selectType = (index,value) => {
        this.address=value;
    }

    onNicknameChanged = (Nickname) => {
        this.state.nickname = Nickname;
    };
    onQQChanged = (qq) => {
        this.state.qq = qq;
    };
    onPhoneNumberChanged = (phonenumber) => {
        this.state.phonenumber = phonenumber;
    };

    onAddressChanged = (address) => {
        this.state.address = address;
    };

    _goBack() {
        this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#58a0f6',
        width:Screen.width
    },
    headImage: {
        width: 40,
        height: 40,
    },
    titleText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: 'bold'
    },
    saveText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: 'bold'
    },
    saveText1: {
        color: '#58a0f6',
        fontSize: 17,
        fontWeight: 'bold'
    },
    btn: {
        height: 0.04 * Screen.height,
        width: 0.04 * Screen.height,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: Screen.width,
        height: 0.075 * Screen.height,
        backgroundColor: '#FFFFFF',
        marginBottom: 1,
    },
    headView: {
        marginLeft: 0.014 * Screen.height,
        paddingRight: 0.01 * Screen.height,
        height: 0.075 * Screen.height,
        width:0.2 * Screen.width,
        justifyContent:'center',
        alignItems:'center'
    },
    input: {
        width: 0.8 * Screen.width,
        height: 0.075 * Screen.height,
        fontSize: 17,
        color: '#000000',// 输入框输入的文本为黑色
    },
    avatar:{
        width:Screen.height*0.25,
        height:Screen.height*0.25,
        borderRadius:Screen.height*0.125
    }
});