/**
 * Created by Cai Wei on 4/22/2017.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity
} from 'react-native';
import HTMLView from 'react-native-htmlview';

export default class TrendingProjectRow extends Component {
    static defaultProps = {
        item: {}
    };

    render() {
        var item = this.props.item;
        var des = '<p>' + item.description + '</p>';
        return <TouchableOpacity
            activeOpacity={0.5}
            onPress={this.props.onSelect}>
            <View style={styles.container}>
                <Text style={styles.title}>{item.fullName}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <HTMLView
                    value={des}
                    onLinkPress={(url)=>{}}
                    stylesheet={{
                        p:styles.description,
                        a:styles.description
                    }}
                />
                <View style={styles.bottom}>
                    <View style={styles.bottomTextWrapper}>
                        <Text>Build：</Text>
                        {item.contributors.map((result, i, arr)=>{
                            return <Image key={'view'+i} style={{width:22,height:22}} source={{uri:arr[i]}}/>
                        })}
                    </View>
                    <View style={styles.bottomTextWrapper}>
                        <Text>Star：</Text>
                        <Text>{item.meta}</Text>
                    </View>
                    <Image source={require("../../res/images/ic_unstar_transparent.png")} style={{width:22,height:22}}/>

                </View>
            </View>
        </TouchableOpacity>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        flexDirection: 'column',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 5,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowRadius: 1, //阴影半径
        shadowOpacity: 0.4,
        elevation: 2 //Android 投影
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bottomTextWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    }

});