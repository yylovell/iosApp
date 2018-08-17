/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    DeviceEventEmitter,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import PopularPage from "./PopularPage";
import TrendingPage from './TrendingPage';
import MyPage from './MyPage';
import WebViewTest from '../../WebViewTest';

import Toast, {DURATION} from 'react-native-easy-toast';


export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'tb_popular',
        }

    }


    /**
     * 全局的一个Toast提示
     */
    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('showToast', (text => {
            this.toast.show(text, DURATION.LENGTH_SHORT);
        }));
    }


    /**
     * 移除Toast的监听
     */
    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    _renderTab(Component, selectTab, title, icon){
        return <TabNavigator.Item
            selected={this.state.selectedTab === selectTab}
            title={title}
            renderIcon={() => <Image style={styles.image} source={icon} />}
            renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'#2196f3'}]} source={icon} />}
            onPress={() => this.setState({ selectedTab: selectTab})}>
            <Component {...this.props}/>
        </TabNavigator.Item>
    }


    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this._renderTab(PopularPage, 'tb_popular', '最热', require('../../res/images/ic_polular.png'))}
                    {this._renderTab(TrendingPage, 'tb_trending', '趋势', require('../../res/images/ic_trending.png'))}
                    {this._renderTab(WebViewTest, 'tb_favorite', '收藏', require('../../res/images/ic_favorite.png'))}
                    {this._renderTab(MyPage, 'tb_my', '我的', require('../../res/images/ic_my.png'))}
                </TabNavigator>
                <Toast ref={toast => this.toast = toast}/>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page: {
        flex:1,
        backgroundColor:'red'
    },
    page2:{
        flex:1,
        backgroundColor:'green'
    },
    page3: {
        flex:1,
        backgroundColor:'yellow'
    },
    page4:{
        flex:1,
        backgroundColor:'pink'
    },
    image:{
        height:22,
        width:22
    }
});