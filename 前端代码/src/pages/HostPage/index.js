import React, {Component} from 'react';
import {
    Platform, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, RefreshControl,
    Alert, ToastAndroid
} from 'react-native';
import Screen from "../../utils/Screen";
import icon from "../../common/icon";
import BRExpandableView from "../../component/BRExpandableView";
import SearchBox from "../../component/SearchBox"

type Props = {};
export default class HostPage extends Component<Props> {

    constructor(props) {
        super(props);
        this.state={
            searchResult:[],
            isRefreshing:false,
            WhetherRefresh:false,
        }
        socketUtil.sendAndReceive(
            "{\"type\":105,\"state\":0}EOS",
            (msg) => {
                if (JSON.parse(msg).state === 0) {
                    let result=[];
                    for (let num = 0; num < JSON.parse(msg).data.ItemInfoList.length; num++) {
                        result.push({
                            key:num,
                            name: JSON.parse(msg).data.ItemInfoList[num].title,
                            price: JSON.parse(msg).data.ItemInfoList[num].price,
                            introduction:JSON.parse(msg).data.ItemInfoList[num].content,
                            picture:JSON.parse(msg).data.ItemInfoList[num].picture,
                            state:JSON.parse(msg).data.ItemInfoList[num].state,
                            itemid:JSON.parse(msg).data.ItemInfoList[num].itemid,
                            sellerid:JSON.parse(msg).data.ItemInfoList[num].sellerid,
                            state2:'可交易'
                        })
                    }
                    this.setState({searchResult:result});
                }
                else {
                    if(Platform.OS === 'ios'){
                        Alert('拉取商品信息失败');
                    }
                    else
                        ToastAndroid.show("拉取商品信息失败", ToastAndroid.SHORT);
                }
            }
        );
    }

    componentWillMount(){

    }

    render() {
        if(this.props.navigation.state.params.WhetherRefresh===true||this.state.WhetherRefresh===true){
            this.props.navigation.state.params.WhetherRefresh=false;
            this.state.WhetherRefresh=false;
            this._onRefresh();
        }
        let items = [];
        for (let num = this.state.searchResult.length-1; num >= 0; num--) {
            let intro = this.state.searchResult[num].introduction;
            if(this.state.searchResult[num].introduction.length > 28)
                intro= this.state.searchResult[num].introduction.substr(0, 28)+"...";
            items.push(
                <BRExpandableView
                    key={num}
                    color={1}
                    initialShowing={1}
                    moduleImg={{uri: icon.itemslist}}
                    moduleName={this.state.searchResult[num].name}
                    moduleContent={
                        <TouchableOpacity
                            onPress={() => this.goInformation(num)}
                            style={{
                            width: 0.96 * Screen.width,
                            height: 0.34 * Screen.height,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent:'center',
                        }}>
                            <View style={{width:0.32 * Screen.height, height:0.32*Screen.height, alignItems:'center',justifyContent:'center',marginBottom:0.02*Screen.height}}>
                                <Image style={{height: 0.28 * Screen.height,width: 0.28 * Screen.height,borderRadius:0.03* Screen.width}} source={{uri:this.state.searchResult[num].picture}}/>
                            </View>
                            <View style={{width:0.96 * Screen.width - 0.32 * Screen.height, height:0.32*Screen.height, flexDirection: 'column'}}>
                                <View style={{height:0.20*Screen.height,alignItems:'center',justifyContent:'center'}}>
                                    <View style={{height:0.20*Screen.height,alignItems:'center',justifyContent:'center',marginRight:0.05*Screen.width}}>
                                        <Text style={{color: '#000000', fontSize: 18}}>{intro}</Text>
                                    </View>
                                </View>
                                <View style={{height:0.12*Screen.height,width:0.96 * Screen.width - 0.32 * Screen.height,justifyContent: 'center',marginBottom:0.03*Screen.height}}>
                                        <View style={{
                                            width: 0.35 * Screen.width,
                                            height: 0.08 * Screen.height,
                                            backgroundColor: '#58a0f6',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius:0.03 * Screen.width,
                                            marginBottom:0.03 * Screen.width
                                        }}>
                                            <Text style={{color: '#FFFFFF', fontSize: 18}}>{this.state.searchResult[num].price/100+'元'}</Text>
                                        </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                    contentViewStyle={{
                        height: 0.33 * Screen.height
                    }}
                />
            );
        }
        if(this.state.searchResult.length===0){
            items.push(
                <Text style={{color:'#CFCFCF',fontSize:20}}>哎呀，这里空空如也哦~</Text>
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.searchBox}>
                    <SearchBox navigate={this.props.navigation.navigate}/>
                </View>
                    <ScrollView
                        contentContainerStyle={{paddingTop:3}}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                tintColor="#FFF"
                                progressBackgroundColor="#58a0f6"
                            />
                        }
                    >
                        {items}
                    </ScrollView>
            </View>
        );
    }

    returnData(Whether) {
        this.setState({WhetherRefresh: Whether});
    }

    _onRefresh() {
        this.setState({isRefreshing:true});
        setTimeout(() => {
            // prepend 10 items
            socketUtil.sendAndReceive(
                "{\"type\":105,\"state\":0}EOS",
                (msg) => {
                    if (JSON.parse(msg).state === 0) {
                        let result=[];
                        for (let num = 0; num < JSON.parse(msg).data.ItemInfoList.length; num++) {
                            result.push({
                                key:num,
                                name: JSON.parse(msg).data.ItemInfoList[num].title,
                                price: JSON.parse(msg).data.ItemInfoList[num].price,
                                introduction:JSON.parse(msg).data.ItemInfoList[num].content,
                                picture:JSON.parse(msg).data.ItemInfoList[num].picture,
                                state:JSON.parse(msg).data.ItemInfoList[num].state,
                                itemid:JSON.parse(msg).data.ItemInfoList[num].itemid,
                                sellerid:JSON.parse(msg).data.ItemInfoList[num].sellerid,
                                state2:'可交易'
                            })
                        }
                        console.warn(result);
                        this.setState({searchResult:result,isRefreshing:false});
                    }
                    else {
                        if(Platform.OS === 'ios'){
                            Alert('拉取商品信息失败');
                        }
                        else
                            ToastAndroid.show("拉取商品信息失败", ToastAndroid.SHORT);
                    }
                }
            );
        }, 1000);
    }

    goInformation(number){
        socketUtil.sendAndReceive(
            "{\"type\":120,\"state\":0,\"data\":{" +
            "\"userid\":" + this.state.searchResult[number].sellerid +
            "}}EOS",
            (msg) => {
                this.props.navigation.navigate('Information',{
                    "name":this.state.searchResult[number].name,
                    "price":this.state.searchResult[number].price,
                    "introduction":this.state.searchResult[number].introduction,
                    "state":this.state.searchResult[number].state,
                    "picture":this.state.searchResult[number].picture,
                    "itemid":this.state.searchResult[number].itemid,
                    "sellerid":this.state.searchResult[number].sellerid,
                    "state2":'预订',
                    'nickname': JSON.parse(msg).data[0].nickname,
                    'phonenumber': JSON.parse(msg).data[0].phonenumber,
                    'qq':JSON.parse(msg).data[0].qq,
                    'address':JSON.parse(msg).data[0].address,
                    'avatar':JSON.parse(msg).data[0].avatar,
                    returnData: this.returnData.bind(this)
                });
            }
        );

    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        paddingTop:0
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color:'#333333',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    searchBox:{
        paddingBottom:0,
        width:Screen.width,
        height:30,
        marginBottom:25
    },
    scontainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderBottomColor: '#DDD',
        borderBottomWidth: 1
    },
    searchClick: {
        height: 35,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        borderRadius: 4,
        flexDirection: 'row',
        padding:5
    },
    searchIcon: {
        width: 15,
        height: 15,
        paddingLeft:5,
    },
    searchText: {
        color: '#999',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft:5,
        alignItems: 'center',
        justifyContent: 'center',
        width:200,
    }
});