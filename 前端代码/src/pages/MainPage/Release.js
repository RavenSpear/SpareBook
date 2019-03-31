import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    TextInput,
    Alert,
    ToastAndroid,
    ScrollView
} from 'react-native';
import icon from '../../common/icon';
import Screen from "../../utils/Screen";

import RNFS from 'react-native-fs';

import CameraButton from '../../component/CameraButton';

const common_url = 'http://47.102.141.201:9999/';  //服务器地址

export default class Release extends Component {
    static navigationOptions = {header: null,};

    constructor(props) {
        super(props);
        this.state={
            isOpen:false,
            height: 0.3*Screen.height,
            Content:'',
            title:'',
            UserID: 0,
            PicParams:{},
            uri:'',
            price:0
        }
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
    cauculateHeight(e) {
        let height = e.nativeEvent.contentSize.height > 0.3*Screen.height ? e.nativeEvent.contentSize.height : this.state.height;
        if(height>0.4*Screen.height-60)
            height=0.4*Screen.height-60;
        this.setState({height:height});
    }

    render(){
        let image;
        if(this.state.uri!==''){
            image=(
                <CameraButton style={styles.btn}
                                 photos={[]}
                                 onFileUpload={this.onFileUpload.bind(this)}
                                 ImgUri={this.state.uri}/>
            );
        }else{
            image=(
                <CameraButton style={styles.btn}
                              photos={[]}
                              onFileUpload={this.onFileUpload.bind(this)}
                              ImgUri={icon.add}/>
            );
        }
        return (
            <View style={{height:Screen.height,width:Screen.width,flex:1,alignItems:'center',backgroundColor:'#F0F0F0'}}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this._goback()} style={styles.iconStyle}>
                        <Image source={{uri: icon.goback}} style={styles.iconStyle}/>
                    </TouchableOpacity>
                    <Text style={styles.titleText}>发布商品</Text>
                        <Text style={styles.addText}>发布</Text>
                </View>
                <ScrollView contentContainerStyle={{alignItems:'center'}}>
                    <View style={{alignItems:'center',height:0.70*Screen.height-60, width:Screen.width,flexDirection:'column',backgroundColor:'#FFFFFF'}}>
                    <View style={{height:0.62*Screen.height-60, width:Screen.width*0.9,flexDirection:'column',marginBottom:0.05*Screen.width}}>
                        <View style={{marginTop:Screen.height*0.01}}>
                            <TextInput
                                style={styles.textinput}
                                placeholder="主题"
                                clearButtonMode="while-editing"
                                onChangeText={this.onTitleChanged}
                            >

                            </TextInput>
                        </View>
                        <View style={{backgroundColor:'#F0F0F0',height:2,width:0.9*Screen.width}}></View>
                        <View style = {{alignItems:'flex-start',paddingLeft: 5,height: 0.4*Screen.height-60,marginBottom:Screen.width*0.05}}>
                            <TouchableOpacity
                                activeOpacity = {1}
                                onPress = {() => this.TextInput.focus()}
                                style = {{height: this.state.height}}
                            >
                                <TextInput
                                    placeholder = {'正文'}
                                    placeholderTextColor = {'#bbbbbb'}
                                    underlineColorAndroid = {'transparent'}
                                    multiline={true}
                                    ref = {textInput => this.TextInput = textInput}
                                    onContentSizeChange = {e => this.cauculateHeight(e)}
                                    style = {{fontSize: 16,height: this.state.height}}
                                    onChangeText={this.onContentChanged}
                                />
                            </TouchableOpacity>
                        </View>
                        {image}
                    </View>
                    </View>
                    <View style={{marginTop:0.05*Screen.width,width:Screen.width,backgroundColor:'#F0F0F0',height:0.3*Screen.height}}>
                    </View>
                </ScrollView>
                <View style={{position:'absolute',bottom:0,width:Screen.width,height:0.2*Screen.height,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: Screen.width,
                        height: 0.1 * Screen.height,
                        backgroundColor: '#FFFFFF',
                    }}>
                        <View style={{
                            marginLeft: 0.014 * Screen.height,
                            paddingRight: 0.01 * Screen.height,
                            height: 0.075 * Screen.height,
                            width:0.2 * Screen.width,
                            justifyContent:'center',
                            alignItems:'center'}}>
                            <Text style={{fontSize:17,}}>价格</Text>
                        </View>
                        <Text style={{marginRight:5,marginLeft:5,fontSize:17,color:'#000000'}}>￥</Text>
                        <TextInput
                            onChangeText={(text) => {
                                this.setState({price: text*100})
                            }}
                            style={styles.input}
                            placeholderTextColor={'#D3D3D3'}// 提示文本的颜色
                            placeholder={'0.00'}// 提示文本的内容
                            defaultValue={''}
                            underlineColorAndroid={'transparent'}
                            keyboardType='numeric'
                        />
                    </View>
                    <View style={{width:Screen.width,height:0.1*Screen.height,justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={() => this._release()}>
                            <View style={{width:Screen.width*0.9,height:0.07*Screen.height,alignItems:'center',justifyContent:'center',backgroundColor:'#58a0f6',borderRadius:0.02*Screen.width}}>
                                <Text style={{fontSize:17,color:'#FFF'}}>确认发布</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


        );
    }

    onPriceChanged = (price) => {
        this.state.price = price*100;
    };

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

    onTitleChanged = (txt) => {
        this.state.title = txt;
    };

    onContentChanged = (txt) => {
        this.state.Content = txt;
    };

    _goback(){
        this.props.navigation.goBack();
    }
    _release(){
        if(this.state.title===''){
            if(Platform.OS === 'ios'){
                Alert.alert('标题不能为空');
            }
            else
                ToastAndroid.show("标题不能为空", ToastAndroid.SHORT);
        }
        else{
            // 上传数据
            socketUtil.sendAndReceive(
                "{\"type\":103,\"state\":0,\"data\":{" +
                "\"title\":\"" + this.state.title +
                "\",\"price\":" + this.state.price +
                ",\"picture\":\"" + "" +
                "\",\"content\":\"" + this.state.Content +"\""+
                ",\"sellerid\":" + this.state.UserID +
                "}}EOS",
                (msg) => {
                    if(this.state.uri===''){
                    }
                    else{
                        RNFS.readFile(this.state.PicParams.uri, 'base64')
                            .then((content) => {
                                // 得到的结果就可以 传给接口了 ，如果想要在网页上预览效果不要忘记格式转换
                                let formData = new FormData();
                                formData.append(this.state.PicParams.name ,'NMSLNMSLNMSL'+JSON.parse(msg).data+'NMSLNMSLNMSL'+'data:image/jpeg;base64,'+content+'NMSLNMSLNMSL');
                                fetch(common_url, {
                                    method: 'POST',
                                    body: formData
                                })
                                    .then(res=>res.text())
                            })
                            .catch((err) => {
                                if(Platform.OS === 'ios'){
                                    Alert('图片读取失败');
                                }
                                else
                                    ToastAndroid.show("图片读取失败", ToastAndroid.SHORT);
                            });
                    }

                    this.props.navigation.navigate('MainPage', {selectedTab: 'host',WhetherRefresh:true});
                    if(Platform.OS === 'ios'){
                        Alert.alert('物品已发布');
                    }
                    else
                        ToastAndroid.show("物品已发布", ToastAndroid.SHORT);
                }
            );
        }
    }
}

const styles = StyleSheet.create({
    listItemContainer: {
        height: Screen.height*0.1,
        width:Screen.width*0.5,
        flexDirection: 'row',
        alignItems: 'center',

    },
    info: {
        height: 100,
        flexDirection: 'column',
    },
    nickName: {
        justifyContent:'center',
        alignItems: 'center',
        color: '#333',
        fontSize: 25,
        fontWeight: 'bold'
    },
    rowView: {
        flexDirection: 'row',
        paddingRight:50,
        alignItems: 'center'
    },
    signature: {
        width: Screen.width-120,
        color: '#999',
        fontSize: 16,
    },
    button:{
        width: 0.08 * Screen.height,
        height: 0.08 * Screen.height,
        margin:0.01*Screen.height
    },
    textinput:{
        width:Screen.width*0.9,
        height:Screen.height*0.08,
        fontSize:25,
        borderBottomWidth:0.05,
        paddingLeft:5,
        backgroundColor:'#FFFFFF',
    },

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
        height: 0.15 * Screen.height,
        width: 0.15 * Screen.height,
    },
    iconStyle: {
        height: 0.04 * Screen.height,
        width: 0.04 * Screen.height,
    },
    input: {
        width: 0.8 * Screen.width,
        height: 0.075 * Screen.height,
        fontSize: 17,
        color: '#000000',// 输入框输入的文本为黑色
    },
});