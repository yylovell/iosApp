import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	ListView,
	RefreshControl,
	DeviceEventEmitter,
	Text,
	TextInput
} from 'react-native';
import NavigationBar from "../common/NavigationBar";
import DataRepository, {FLOG_STORAGE} from '../expand/dao/DataRepository';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import RepositoryCell from '../common/RepositoryCell';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import RepositoryDetail from './RepositoryDetail';
import ProjectModel from '../model/ProjectModel';


const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
//https://api.github.com/search/repositories?q=android&sort=stars

export default class PopularPage extends Component {

	constructor(props) {
		super(props);
		this.dataRepository = new DataRepository(FLOG_STORAGE.flag_popular);
		this.state = {
			languages: []
		};
	}
	componentDidMount() {
		this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
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

	render() {
		let length = this.state.languages.length;
		//当页面还没有渲染完的时候，ScrollableTabView无法计算它的实际宽度，
		//所以会一直闪烁，所以需要提出来做如下处理
		let content = length > 0 ? <ScrollableTabView
			tabBarBackgroundColor='#2196f3'
			tabBarActiveTextColor='white'
			tabBarInactiveTextColor='#F5FFFA'
			tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
			renderTabBar={() => <ScrollableTabBar/>}
		>
			{this.state.languages.map((result, i, array) => {
				let len = array[i];
				return len.checked ? <PopularTab {...this.props} tabLabel={len.name} key={len.path}/> : null
			})
			}
		</ScrollableTabView> : null;
		return(
			<View style={styles.container}>
				<NavigationBar
					title='最热'
					statusBar={{
						backgroundColor: '#2196f3'
					}}
				/>
				{content}
			</View>
		);
	}
}

class PopularTab extends Component {

	constructor(props) {
		super(props);
		this.dataRepository = new DataRepository(FLOG_STORAGE.flag_popular);
		this.state = {
			result: '',
			isRefreshing: false,
			dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		};
	}
	/*更新project item 收藏状态*/
	flushFavoriteState(){
		let projectModels = [];
		let items = this.items;
		for (let i = 0 , len = items.length; i < len; i++){
			projectModels.push(new ProjectModel(items[i], false));
		}
		this.updateState({
			isRefreshing: false,
			dataSource: this.state.dataSource.cloneWithRows(projectModels),
		})

	}
	updateState(dic){
		if(!this)return;
		this.setState(dic)
	}
	onLoad() {
		this.setState({isRefreshing: true});
		let url = URL + this.props.tabLabel + QUERY_STR;
		this.dataRepository.fetchRepository(url)
			.then(result => {
				/*this._data = this._data.concat(result.items);*/
				this.items = result && result.items ? result.items : result ? result : [];
				/*this.setState({
					dataSource: this.state.dataSource.cloneWithRows(items),
					isRefreshing: false,
				})*/
				this.flushFavoriteState();
			})
			.catch(error => {
				this.setState({
					result: JSON.stringify(error)
				})
			});
	};
	onSelectRepository(item) {
		DeviceEventEmitter.emit('showToast', "item.id:" + item.id);
		this.props.navigator.push({
			title: item.full_name,
			component: RepositoryDetail,
			params: {
				item: item,
				...this.props,
			}
		});
	}

	componentDidMount() {
		this.onLoad()
	};

	/**
	 * 收藏的单击回调函数
	 * @param item
	 * @param isFavorite
	 */
	onFavorite(item, isFavorite){

	}

	renderRow(projectModel) {
		return (
			<RepositoryCell
				key={projectModel.item.id}
				projectModel={projectModel}
				onSelect={() => this.onSelectRepository(projectModel.item)}
				onFavorite={(item, isFavorite)=>this.onFavorite(item, isFavorite)}
			/>
		)
	};

	render() {
		return (
			<View style={{flex: 1}}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={(data) => this.renderRow(data)}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={() => this.onLoad()}
							progressBackgroundColor={'#ffffff'}
							colors={['#ff0000', '#2196f3', '#B03060', '#6A5ACD']}
							tintColor={'#2196F3'}
							title={'Loading...'}
							titleColor={'#2196f3'}
						/>
					}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	tip: {
		fontSize: 26,
	},
	text_message: {
		fontSize: 18,
	}
});