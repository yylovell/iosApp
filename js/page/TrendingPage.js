/**
 * Created by Cai Wei on 4/6/2017.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    RefreshControl,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

import NavigationBar from "../common/NavigationBar";
import GitHubTrending from 'GitHubTrending'
import ScrollableTabView from "react-native-scrollable-tab-view";
import DetailPage from './DetailPage';
import Popover from "../common/Popover";
import TrendingProjectRow from "../common/TrendingProjectRow";
import MenuMore from "../common/MenuMore";
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import DataRepository, {FLOG_STORAGE} from '../expand/dao/DataRepository';

const TIME_MAP = new Map([
    ["Toady", "since=daily"],
    ["This Week", "since=weekly"],
    ["This month", "since=monthly"]
]);

export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            languages: [],
            isVisible: false,
            buttonRect: [],
            timeSpan: {key: 'Toady', value: "since=daily"}
        };
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    languages: result
                })
            })
            .catch(error => {
                console.log(error)
            });
    }

    showPopover = ()=> {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    };

    closePopover = ()=> {
        this.setState({isVisible: false});
    };

    renderTitleView = ()=> {
        return <TouchableOpacity
            ref="button"
            activeOpacity={0.5}
            onPress={this.showPopover}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{color:'#FFF',fontSize:16}}>Trending {this.state.timeSpan.key}</Text>
                <Image source={require('../../res/images/ic_spinner_triangle.png')}
                       style={{width:12,height:12,marginLeft:5}}/>
            </View>
        </TouchableOpacity>;
    };

    renderRightBtn = () => {
        return <View style={styles.rightBtn} ref="moreMenuButton">
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={()=>this.refs.moreMenu.showPopover()}>
                <Image source={require('../../res/images/ic_more_vert_white_48pt.png')} style={styles.navBtn}/>
            </TouchableOpacity>
        </View>
    };

    handleTimeSelect = (k, v)=> {
        this.setState({timeSpan: {key: k, value: v}});
        this.closePopover();
    };

    renderTimeMap = ()=> {
        var views = [];
        for (let [key,value] of TIME_MAP) {
            views.push(<TouchableOpacity
                key={`pop_${value}`}
                onPress={()=>this.handleTimeSelect(key,value)}
            >
                <Text style={{fontSize:18,color:'#FFF',padding:8}}>{key}</Text>
            </TouchableOpacity>);
        }
        return <View style={{alignItems:'center'}}>
            {views}
        </View>;
    };

    render() {
        return <View style={styles.container}>
            <NavigationBar
                titleView={this.renderTitleView()}
                rightBtn={this.renderRightBtn()}/>

            <ScrollableTabView
                tabBarBackgroundColor='#2196f3'
                tabBarActiveTextColor='white'
                tabBarInactiveTextColor='#F5FFFA'
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
            >
                {
                    this.state.languages.map((item, i)=> {
                        return item.checked
                            ? <TrendingTab {...this.props} key={`tab${i}`} tabLabel={item.name}
                                           timeSpan={this.state.timeSpan}/>
                            : null;
                    })
                }
            </ScrollableTabView>

            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                onClose={this.closePopover}
                contentStyle={{backgroundColor:'#343434',opacity:0.8}}
                placement="bottom">
                {this.renderTimeMap()}
            </Popover>

            <MenuMore ref="moreMenu" anchorView={()=>this.refs.moreMenuButton}/>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    navBtn: {
        width: 24,
        height: 24
    }
});

class TrendingTab extends Component {
    static defaultProps = {
        tabLabel: 'Android'
    };

    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLOG_STORAGE.flag_trending);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}), //是一个优化，节省无用的UI渲染
            isLoading: true
        };
    }

    //项目被选中，跳转到详情页
    handleProjectSelect = (obj)=> {
        //console.log(obj);
        this.props.navigator.push({
            component: DetailPage,
            params: {title: obj.fullName, url: `https://github.com${obj.url}`}
        });
    };

    renderRow(data) {
        return <TrendingProjectRow
                    key={data.id}
                    item={data}
                    onSelect={()=>this.handleProjectSelect(data)}
                />
    };

    loadData(timeSpan, isRefresh){
        this.setState({isLoading: true});
        this.dataRepository.fetchRepository(`https://github.com/trending/${this.props.tabLabel}?${timeSpan.value}`)
            .then(result=> {
                let items = result && result.items ? result.items : result ? result : [];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                    isLoading: false
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    handleRefresh = ()=> {
        this.loadData(this.props.timeSpan, true);
    };

    render() {
        return <View style={styles.container}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data) => this.renderRow(data)}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={this.handleRefresh}
                        tintColor="#63B8FF"
                        title="loading..."
                        titleColor="#63B8FF"
                        colors={['#63B8FF']}/>}
            />
        </View>;
    }

    componentDidMount() {
        this.loadData(this.props.timeSpan, true);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan!= this.props.timeSpan) {
            this.loadData(nextProps.timeSpan, true);
        }
    }
}