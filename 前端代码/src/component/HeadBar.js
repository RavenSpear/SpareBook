import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export default class HeadBar extends Component {

    constructor(props){
        super(props);
    }

    toggle=()=>{
        this.props.toggle();
    }

    transfer(title){
        if(title==='host'){
            return "闲书";
        }
        else if(title==='my'){
            return "我的";
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.headImage}/>
                <Text style={styles.titleText}>{this.transfer(this.props.title)}</Text>
                <Text style={styles.addText}>添加</Text>
            </View>
        )
    }

};

class Button extends Component{
    _handlePress(e){
        if(this.props.onPress){
            this.props.onPress(e);
        }
    }
    render(){
        return (
            <TouchableOpacity onPress={this._handlePress.bind(this)} style={this.props.style}>
                <Text>{this.props.children}</Text>
            </TouchableOpacity> );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#58a0f6'
    },
    headImage: {
        width: 40,
        height: 40,
    },
    titleText: {
        color: '#FFF',
        fontSize: 30,
        fontWeight: 'bold'
    },
    addText: {
        color: '#58a0f6',
        fontSize: 17,
        fontWeight: 'bold'
    },

});