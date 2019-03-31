import React, {Component} from 'react';
import {
    View,
    StatusBar,
    ToastAndroid,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    ScrollView
} from 'react-native'
import Screen from "../../utils/Screen";
import icon from "../../common/icon";
import BRExpandableView from "../../component/BRExpandableView";

export default class SearchResult extends Component {
    static navigationOptions = {header: null,};

    constructor(props) {
        super(props);
        this.state={
            searchResult:this.props.navigation.state.params.searchResult
        }
    }

    render() {
        let items = [];
        for (let num = 0; num < this.state.searchResult.length; num++) {
            items.push(
                <BRExpandableView
                    key={num}
                    color={1}
                    initialShowing={1}
                    moduleImg={{uri: icon.itemslist}}
                    moduleName={this.state.searchResult[num].name}
                    moduleContent={
                        <View style={{
                            width: 0.96 * Screen.width,
                            height: 0.30 * Screen.height,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent:'center',
                            paddingLeft: 10,
                        }}>
                            <View style={{width:0.20 * Screen.height, height:0.3*Screen.height, alignItems:'center',justifyContent:'center'}}>
                                <Image style={{height: 0.20 * Screen.height,width: 0.20 * Screen.height}} source={{uri:this.state.searchResult[num].picture}}/>
                            </View>
                            <View style={{width:0.96 * Screen.width - 0.2 * Screen.height, height:0.3*Screen.height, flexDirection: 'column',alignItems:'center'}}>
                                <View style={{height:0.22*Screen.height,width:0.96 * Screen.width - 0.2 * Screen.height,alignItems:'center',justifyContent:'center'}}>
                                    <TouchableOpacity onPress={() => this.goInformation(num)} style={{height:0.22*Screen.height,width:0.96 * Screen.width - 0.2 * Screen.height,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={{color: '#000000', fontSize: 18}}>{this.state.searchResult[num].introduction}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{height:0.08*Screen.height,width:0.96 * Screen.width - 0.2 * Screen.height,alignItems:'center'}}>
                                    <View style={{
                                        width: 0.35 * Screen.width,
                                        height: 0.08 * Screen.height,
                                        backgroundColor: '#58a0f6',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{color: '#000000', fontSize: 18}}>{this.state.searchResult[num].state2}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                    contentViewStyle={{
                        height: 0.30 * Screen.height
                    }}
                />
            );
        }
        return (
            <View style={{height:Screen.height,width:Screen.width,flex:1,alignItems:'center'}}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this._goBack()} style={styles.iconStyle}>
                        <Image source={{uri: icon.goback}} style={styles.btn}/>
                    </TouchableOpacity>
                    <Text style={styles.titleText}>搜索结果</Text>
                    <Text style={styles.addText}>添加</Text>
                </View>
                <ScrollView contentContainerStyle={{paddingTop:3}}>
                    {items}
                </ScrollView>
            </View>
        );
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
                    'avatar':JSON.parse(msg).data[0].avatar
                });
            }
        );
    }

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
    addText: {
        color: '#58a0f6',
        fontSize: 17,
        fontWeight: 'bold'
    },
    btn: {
        height: 0.04 * Screen.height,
        width: 0.04 * Screen.height,
    },
});