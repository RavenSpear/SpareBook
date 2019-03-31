import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import icon from '../../common/icon';
import Screen from "../../utils/Screen";
import TabN from "./TabN";
import HeadBar from '../../component/HeadBar';
import ActionButton from 'react-native-action-button';

const MENU = {uri: icon.menu};

export default class MainPage extends Component {
    static navigationOptions = {header: null,gesturesEnabled: false};

    constructor(props) {
        super(props);
        this.state={
            selectedTab:'host',
            isOpen:false,
            selectedItem:'About',
            AdPics:[]
        }
    }

    toggle(){
        this.setState({ isOpen:!this.state.isOpen, });
    }

    onMenuItemSelected = (item) =>{
        this.setState({ isOpen: false , selectedItem:item , });
    }

    updateMenuState(isOpen){
        this.setState({ isOpen:isOpen, })
    }

    componentDidMount(){
        for (let i = 0; i < icon.length; i++) {
            this.state.AdPics.push(icon[i]);
        }
        this.setState({
            AdPics: this.state.AdPics
        })
    }

    updateState (data) {
        this.setState(data);
    }

    render(){
        return (
            <View style={styles.container}>
                <View styles={styles.headerContainer}>
                    <HeadBar title={this.state.selectedTab} headImg={MENU}  toggle={this.toggle.bind(this)}/>
                </View>
                <TabN updateParentState={this.updateState.bind(this)} {...this.props}/>
                <ActionButton
                    buttonColor="rgba(255,255,255,1)"
                    verticalOrientation="down"
                    size={36}
                    offsetX={10}
                    offsetY={10}
                    onPress={()=>this._goRelease()}
                    renderIcon={() => (<Image style={{width:Screen.width*0.06,height:Screen.width*0.06}} source={{uri:icon.add1}}/>)}
                />
            </View>
        );
    }


    _goRelease(){
        this.props.navigation.navigate('Release');
    }
}

const styles = StyleSheet.create({
    center:{
        justifyContent:'center',
        alignItems:'center'
    },
    img: {
        width: 40,
        height: 33,
    },
    headerContainer: {
        position:'absolute',
        paddingTop:0,
        height: 200,
        width:Screen.width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#58a0f6'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingTop:0,
        height:Screen.height - Screen.STATUSBAR_HEIGHT,
        width:Screen.width
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
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
});
