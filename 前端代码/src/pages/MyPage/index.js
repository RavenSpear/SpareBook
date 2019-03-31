import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableOpacity, Alert, ToastAndroid,ScrollView,RefreshControl} from 'react-native';
import Screen from "../../utils/Screen";
import icon from "../../common/icon";

type Props = {};
export default class MyPage extends Component<Props> {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            userid:0,
            avatar:'',
            nickname:'',
            isRefreshing:false
        };
        storage.load({
            key: 'hasLogined',
            autoSync: false,
            syncInBackground: false,
        }).then(ret => {
            // 发现有这个key，说明已登录过
            this.setState({username:ret.UserName,userid:ret.UserID,avatar:ret.Avatar,nickname:ret.NickName});
        }).catch(err => {
            // 没有登陆过，do nothing
        });
    }

    render() {
        let uName = this.state.username;
        if(this.state.username.length > 5){
            uName = this.state.username.substr(0,4)+"...";
        }
        let uNick = this.state.nickname;
        if(this.state.nickname.length > 7){
            uNick = this.state.nickname.substr(0,7)+"...";
        }
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{alignItems:'center'}}
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        tintColor="#FFF"
                        progressBackgroundColor="#58a0f6"
                    />
                }>
                <TouchableOpacity onPress={()=>this._goPersonInformation()}>
                <View style={{
                    width: Screen.width,
                    height: 0.20 * Screen.height,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 0.02*Screen.height,
                    backgroundColor:'#F0F0F0'
                }}>
                    <View style={{
                        width:0.16 * Screen.height,
                        height:0.16*Screen.height,
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor:'#969696',
                        borderRadius:0.08*Screen.height
                    }}>
                        <Image style={{height: 0.16 * Screen.height,width: 0.16 * Screen.height,borderRadius:0.08*Screen.height}} source={{uri:this.state.avatar}}/>
                    </View>
                    <View style={{
                        width:0.9*Screen.width - 0.2 * Screen.height,
                        height:0.20*Screen.height,
                        flexDirection: 'column',
                        justifyContent:'center',
                        marginLeft:0.02*Screen.height
                    }}>
                        <Text style={{fontSize:32,color:'#000000'}}>
                            {uName}
                        </Text>
                        <Text style={{fontSize:20,color:'#58a0f6'}}>
                            {uNick}
                        </Text>
                    </View>
                    <View style={{height: 0.20 * Screen.height,width:0.1*Screen.width,justifyContent:'center',alignItems:'flex-end'}}>
                        <Image style={{height: 0.03 * Screen.height,width: 0.03 * Screen.height,marginRight:0.06*Screen.height}} source={{uri:icon.right_black}}/>
                    </View>
                </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('MyReservation',{userid:this.state.userid})}>
                    <View style={{
                        backgroundColor:'#FFC125',
                        borderRadius:0.03*Screen.height,
                        height: 0.10 * Screen.height,
                        width:0.92*Screen.width,
                        flexDirection:'row',
                        marginTop:Screen.width*0.04,
                        marginBottom:Screen.width*0.04
                    }}>
                        <View style={{height: 0.10 * Screen.height,width:0.10*Screen.height,justifyContent:'center',alignItems:'center'}}>
                            <Image style={{height: 0.06 * Screen.height,width: 0.06 * Screen.height}} source={{uri:icon.book}}/>
                        </View>
                        <View style={{height: 0.10* Screen.height,width:0.80*Screen.width-0.07*Screen.height,justifyContent:'center'}}>
                            <Text style={{fontSize:25,color:'#FFFFFF'}}>
                                我的预订
                            </Text>
                        </View>
                        <View style={{height: 0.10 * Screen.height,width:0.10*Screen.width,justifyContent:'center',alignItems:'flex-end'}}>
                            <Image style={{height: 0.03 * Screen.height,width: 0.03 * Screen.height,marginRight:0.06*Screen.height}} source={{uri:icon.right}}/>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('MyRelease',{userid:this.state.userid})}>
                    <View style={{
                        backgroundColor:'#4EEE94',
                        borderRadius:0.03*Screen.height,
                        height: 0.10 * Screen.height,
                        width:0.92*Screen.width,
                        flexDirection:'row',
                        marginBottom:Screen.width*0.04
                    }}>
                        <View style={{height: 0.10 * Screen.height,width:0.10*Screen.height,justifyContent:'center',alignItems:'center'}}>
                            <Image style={{height: 0.06 * Screen.height,width: 0.06 * Screen.height}} source={{uri:icon.myrelease}}/>
                        </View>
                        <View style={{height: 0.10* Screen.height,width:0.80*Screen.width-0.07*Screen.height,justifyContent:'center'}}>
                            <Text style={{fontSize:25,color:'#FFFFFF'}}>
                                我的发布
                            </Text>
                        </View>
                        <View style={{height: 0.10 * Screen.height,width:0.10*Screen.width,justifyContent:'center',alignItems:'flex-end'}}>
                            <Image style={{height: 0.03 * Screen.height,width: 0.03 * Screen.height,marginRight:0.06*Screen.height}} source={{uri:icon.right}}/>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this.props.navigation.navigate('History',{userid:this.state.userid})}>
                    <View style={{
                        backgroundColor:'#FF6A6A',
                        borderRadius:0.03*Screen.height,
                        height: 0.10 * Screen.height,
                        width:0.92*Screen.width,
                        flexDirection:'row',
                        marginBottom:Screen.width*0.04
                    }}>
                        <View style={{height: 0.10 * Screen.height,width:0.10*Screen.height,justifyContent:'center',alignItems:'center'}}>
                            <Image style={{height: 0.06 * Screen.height,width: 0.06 * Screen.height}} source={{uri:icon.history}}/>
                        </View>
                        <View style={{height: 0.10* Screen.height,width:0.80*Screen.width-0.07*Screen.height,justifyContent:'center'}}>
                            <Text style={{fontSize:25,color:'#FFFFFF'}}>
                                交易历史
                            </Text>
                        </View>
                        <View style={{height: 0.10 * Screen.height,width:0.10*Screen.width,justifyContent:'center',alignItems:'flex-end'}}>
                            <Image style={{height: 0.03 * Screen.height,width: 0.03 * Screen.height,marginRight:0.06*Screen.height}} source={{uri:icon.right}}/>
                        </View>
                    </View>
                </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    _onRefresh() {
        setTimeout(() => {
            storage.load({
                key: 'hasLogined',
                autoSync: false,
                syncInBackground: false,
            }).then(ret => {
                // 发现有这个key，说明已登录过
                this.setState({username:ret.UserName,userid:ret.UserID,avatar:ret.Avatar,nickname:ret.NickName});
            }).catch(err => {
                // 没有登陆过，do nothing
            });
        }, 1000);
    }

    _goPersonInformation(){
        console.warn('1');
        socketUtil.sendAndReceive(
            "{\"type\":120,\"state\":0,\"data\":{" +
            "\"userid\":" + this.state.userid +
            "}}EOS",
            (msg) => {
                console.warn(msg);
                this.props.navigation.navigate('UserInformation', {
                    'userid': JSON.parse(msg).data[0].userid,
                    'nickname': JSON.parse(msg).data[0].nickname,
                    'phonenumber': JSON.parse(msg).data[0].phonenumber,
                    'qq':JSON.parse(msg).data[0].qq,
                    'address':JSON.parse(msg).data[0].address,
                    'avatar':JSON.parse(msg).data[0].avatar,
                    'username':JSON.parse(msg).data[0].username
                });
            }
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        marginTop:0,
        alignItems:'center'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});