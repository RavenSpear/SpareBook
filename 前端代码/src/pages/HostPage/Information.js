import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ScrollView,
    ToastAndroid,
    Alert
} from 'react-native';
import icon from '../../common/icon';
import Screen from "../../utils/Screen";

export default class FriendInfo extends Component {
    static navigationOptions = {header: null,};

    constructor(props) {
        super(props);
        this.state= {
            UserID: 0,
        };
        storage.load({
            key: 'hasLogined',
            autoSync: false,
            syncInBackground: false,
        }).then(ret => {
            this.setState({
                UserID: ret.UserID,
            });
        }).catch(err => {
            // shouldnt go here
        });
    }

    render(){
        return (
            <View style={{height:Screen.height,width:Screen.width,flex:1,justifyContent:'center'}}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this._goback()} style={styles.iconStyle}>
                        <Image source={{uri: icon.goback}} style={styles.btn}/>
                    </TouchableOpacity>
                    <Text style={styles.titleText}>商品信息</Text>
                    <Text style={styles.addText}>添加</Text>
                </View>
                <ScrollView contentContainerStyle={{alignItems:'center'}}>
                    <View style={{height:Screen.height*0.1,alignItems:'center',justifyContent:'center',width:Screen.width,backgroundColor:'#F0F0F0',width:Screen.width}}>
                        <TouchableOpacity onPress={() => this._goUserInfo()} style={{width:0.95*Screen.width,height:Screen.height*0.08,flexDirection:'row'}}>
                            <Image source={{uri: this.props.navigation.state.params.avatar}} style={{height:Screen.height*0.08,width:Screen.height*0.08,borderRadius:0.04*Screen.height}}/>
                            <View style={{marginLeft:5,height:Screen.height*0.08,width:Screen.width*0.5,flexDirection:'column',justifyContent:'center'}}>
                                <Text style={{fontSize:21,color:'#000000'}}>{this.props.navigation.state.params.nickname}</Text>
                            </View>
                            <View style={{height: 0.08 * Screen.height,width:0.4*Screen.width,justifyContent:'center',alignItems:'flex-end'}}>
                                <Image style={{height: 0.03 * Screen.height,width: 0.03 * Screen.height,marginRight:0.06*Screen.height}} source={{uri:icon.right_black}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:Screen.width*0.9,justifyContent:'center',marginTop:0.05*Screen.width}}>
                        <Text style={{
                            fontSize:30,
                            color:'#000000',
                            fontWeight:'bold'}}>
                            {this.props.navigation.state.params.name}
                        </Text>
                    </View>
                    <View style={{width:Screen.width*0.9,alignItems:'center',marginTop:0.05*Screen.width}}>
                        <Text style={styles.txt}>
                            {this.props.navigation.state.params.introduction}
                        </Text>
                    </View>
                    <View style={styles.img}>
                        <Image style={{height:0.9*Screen.width,width: 0.9*Screen.width}} source={{uri:this.props.navigation.state.params.picture}}/>
                    </View>
                </ScrollView>
                <View style={{flexDirection: 'row', width: Screen.width, height: 0.08 * Screen.height}}>
                    <View style={{
                        width: 0.65 * Screen.width,
                        height: 0.08 * Screen.height,
                        backgroundColor: "#CDCDCD",
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            width: 0.65 * Screen.width,
                            height: 0.04 * Screen.height,
                            alignItems: 'center',
                            paddingLeft: 20
                        }}>
                            <Text style={{color: '#000000', fontSize: 22}}>{"价格："}</Text>
                            <Text
                                style={{
                                    color: '#CD2626',
                                    fontSize: 22,
                                    position: 'absolute',
                                    right: 40,
                                    fontWeight:'bold',
                                    marginRight:0.03*Screen.width
                                }}>{this.props.navigation.state.params.price / 100}</Text>
                            <Text
                                style={{color: '#000000', fontSize: 22, position: 'absolute', right: 20}}>{"元"}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={()=>this._gohost()}>
                        <View style={{
                            width: 0.35 * Screen.width,
                            height: 0.08 * Screen.height,
                            backgroundColor: '#58a0f6',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{color: '#FFF', fontSize: 25,fontWeight:'bold'}}>{this.props.navigation.state.params.state2}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _goUserInfo(){
        this.props.navigation.navigate('UserInformation', {
            'userid': this.props.navigation.state.params.sellerid,
            'nickname': this.props.navigation.state.params.nickname,
            'phonenumber': this.props.navigation.state.params.phonenumber,
            'qq':this.props.navigation.state.params.qq,
            'address':this.props.navigation.state.params.address,
            'avatar':this.props.navigation.state.params.avatar
        });
    }

    _goback(){
        this.props.navigation.goBack();
    }

    _gohost(){
        if(this.props.navigation.state.params.state2==='不卖了'){
            socketUtil.sendAndReceive(
                "{\"type\":106,\"state\":0,\"data\":{"+
                "\"itemid\":" + this.props.navigation.state.params.itemid+"}}EOS",
                (msg) => {
                }
            );
            this.props.navigation.state.params.returnData(true);
            this.props.navigation.goBack();
        }
        else if(this.props.navigation.state.params.state2==='不买了'){
            socketUtil.sendAndReceive(
                "{\"type\":114,\"state\":0,\"data\":{"+
                "\"itemid\":" + this.props.navigation.state.params.itemid+"}}EOS",
                (msg) => {
                }
            );
            this.props.navigation.state.params.returnData(true);
            this.props.navigation.goBack();
        }
        else if(this.props.navigation.state.params.state2==='预订'){
            socketUtil.sendAndReceive(
                "{\"type\":119,\"state\":0,\"data\":{"+
                "\"itemid\":" + this.props.navigation.state.params.itemid+
                ",\"userid\":" + this.state.UserID +
                "}}EOS",
                (msg) => {
                    if (JSON.parse(msg).state === 2) {
                        if(Platform.OS === 'ios'){
                            Alert.alert('不能预订自己发布的商品');
                        }
                        else
                            ToastAndroid.show("不能预订自己发布的商品", ToastAndroid.SHORT);
                    }
                    else if (JSON.parse(msg).state === 0) {
                        if(Platform.OS === 'ios'){
                            Alert.alert('预订成功');
                        }
                        else
                            ToastAndroid.show("预订成功", ToastAndroid.SHORT);
                    }
                    else {
                        if(Platform.OS === 'ios'){
                            Alert.alert('未知错误');
                        }
                        else
                            ToastAndroid.show("未知错误", ToastAndroid.SHORT);
                    }
                }
            );
            this.props.navigation.state.params.returnData(true);
            this.props.navigation.goBack();
        }
        else if(this.props.navigation.state.params.state2==='交易已完成'){
            if(Platform.OS === 'ios'){
                Alert.alert('交易已完成');
            }
            else
                ToastAndroid.show("交易已完成", ToastAndroid.SHORT);
        }
        else{
            this.props.navigation.navigate('MainPage',{selectedTab:"host"});
        }
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
    addText: {
        color: '#58a0f6',
        fontSize: 17,
        fontWeight: 'bold'
    },
    btn: {
        height: 0.04 * Screen.height,
        width: 0.04 * Screen.height,
    },
    img:{
        height:Screen.width,
        width:Screen.width,
        justifyContent:'center',
        alignItems:'center'
    },
    txt:{
        fontSize:20,
        color:'#000',
        width:0.9*Screen.width,
    }
});