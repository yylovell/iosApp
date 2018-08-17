import React, {Component} from 'react';
import {
    ListView,
    View,
    Text,
    Image,
    TouchableOpacity,
    RefreshControl,
    StyleSheet,
} from 'react-native';
import NavigationBar from "./NavigationBar";
import Toast, {DURATION} from "react-native-easy-toast";

var data = {
    "result": [
        {
            "email": "hhdhh.net",
            "fullName": "张三"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三1"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三2"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三3"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三4"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三4"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三4"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三4"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三4"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三4"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三4"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三4"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三4"
        },
        {
            "email": "hhdhh.net",
            "fullName": "张三4"
        },
    ]
};

export default class ListViewTest extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(data.result),
            isRefreshing: true
        };
        this.onRefreshing();
    }

    onRefreshing() {
        //this.setState({isRefreshing: true});
        setTimeout(() => {
            this.setState({
                isRefreshing: false,
            });
        }, 3000);
    }

    renderRow(itemData) {
        return <View style={styles.lv_item}>
            <TouchableOpacity
                onPress={() => {
                    this.toast.show('点击了：' + itemData.fullName, DURATION.LENGTH_SHORT);
                }}
            >
                <Text style={styles.lv_text}>{itemData.fullName}</Text>
                <Text style={styles.lv_text}>{itemData.email}</Text>
            </TouchableOpacity>
        </View>
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return <View key={rowID} style={styles.line}/>
    }

    renderFooter() {
        return <View>
            <Image style={styles.images}
                   source={{uri: 'https://images.gr-assets.com/hostedimages/1406479536ra/10555627.gif'}}/>
        </View>
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'ListViewTest'}
                    statusBar={{
                        backgroundColor: 'blue',
                    }}
                />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(itemData) => this.renderRow(itemData)}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                    renderFooter={() => this.renderFooter()}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.onRefreshing()}
                            progressBackgroundColor={'#ffffff'}
                            colors={['#ff0000', '#00ff00', '#0000ff', '#123456']}
                        />
                    }
                />
                <Toast ref={toast => {
                    this.toast = toast
                }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lv_item: {
        height: 50,
    },
    lv_text: {
        fontSize: 18,
    },
    line: {
        height: 1,
        backgroundColor: 'grey'
    },
    images: {
        height: 160,
        width: 400,
    },
});