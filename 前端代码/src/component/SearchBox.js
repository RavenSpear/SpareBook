import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ToastAndroid,
    Platform,
    Alert
} from 'react-native';
import icon from '../common/icon';

export default class SearchBox extends Component<Props> {

    constructor(props) {
        super(props);
        this.state={
            searchTxt:"",
            searchResult:[]
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.searchClick}>
                    <Image style={styles.searchIcon} source={{uri: icon.search}}/>
                    <TextInput style={styles.searchText}
                               placeholder={"搜索"}
                               onSubmitEditing={()=>this.search()}
                               onChangeText={this.Changing}
                               multiline={false}/>
                </View>
            </View>
        );
    }

    search(){
        if(this.state.searchTxt===''){
            if(Platform.OS === 'ios'){
                Alert.alert('搜索的内容不能为空');
            }
            else{
                ToastAndroid.show("搜索的内容不能为空", ToastAndroid.SHORT);
            }
        }
        else{
            socketUtil.sendAndReceive(
                "{\"type\":115,\"state\":0,\"data\":{" +
                "\"keyword\":\"" + this.state.searchTxt +
                "\"}}EOS",
                (msg) => {
                    if (JSON.parse(msg).state === 0) {
                        let result=[];
                        for (let num = 0; num < JSON.parse(msg).data.ItemInfoList.length; num++) {
                            result.push({
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
                        this.props.navigate('SearchResult',{
                            "searchResult":result
                        })

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
        }
    }

    Changing = (txt) => {
        this.state.searchTxt = txt;
    };


};

const styles = StyleSheet.create({
    container: {
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
        color: '#000',
        fontSize: 15,
        marginLeft:5,
        height:15
    }
});