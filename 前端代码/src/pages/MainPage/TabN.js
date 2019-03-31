import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Image,
    ToastAndroid,
    TouchableOpacity
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import HostPage from "../HostPage/index";
import MyPage from "../MyPage/index";
import Screen from "../../utils/Screen";
import icon from '../../common/icon';

const TAB_NORMAL_1 = {uri: icon.host};
const TAB_PRESS_1 = {uri: icon.host_on};
const TAB_NORMAL_2 = {uri: icon.friends};
const TAB_PRESS_2 = {uri: icon.friends_on};

export default class TabN extends PureComponent {
    static navigationOptions = {header: null,};

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "host",
        };
    }

    setParentState=(data)=>{
        this.props.updateParentState(data);
    }

    render() {
        if (this.state.selectedTab === "") {
            this.state.selectedTab = "host";
        }
        return (
            <View style={styles.pageContainer}>
                <TabNavigator tabBarPosition='bottom' tabBarStyle={{height: 0.075 * Screen.height}}>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'host'}
                        renderIcon={() => <Image style={styles.TabBtn} source={TAB_NORMAL_1}/>}
                        renderSelectedIcon={() => <Image style={styles.TabBtn} source={TAB_PRESS_1}/>}
                        onPress={() => {
                            this.setState({selectedTab:'host'});
                            this.setParentState({selectedTab:'host'});
                        }}>
                        <HostPage {...this.props}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'my'}
                        renderIcon={() => <Image style={styles.TabBtn} source={TAB_NORMAL_2}/>}
                        renderSelectedIcon={() => <Image style={styles.TabBtn} source={TAB_PRESS_2}/>}
                        onPress={() => {
                            this.setState({selectedTab:'my'});
                            this.setParentState({selectedTab:'my'});
                        }}>
                        <MyPage {...this.props}/>
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pageContainer: {
        height: Screen.height - Screen.STATUSBAR_HEIGHT-60,
    },
    TabBtn: {
        width: 0.045 * Screen.height,
        height: 0.045 * Screen.height,
        // resizeMode: 'stretch',
    },
});