import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';

export default class RepositoryCell extends Component {
    constructor(props){
        super(props);
        this.state={
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png'),
        }
    }
    setFavoriteState(isFavorite){
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon:isFavorite? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    onPressFavorite(){
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
    }

    render() {
        let item = this.props.projectModel.item?this.props.projectModel.item:this.props.projectModel;
        let favoriteButton=<TouchableOpacity
                            onPress={()=>this.onPressFavorite()}

                        >
            <Image style={[styles.avatarUrl, {tintColor: '#2196f3'}]} source={this.state.favoriteIcon}/>
        </TouchableOpacity>;
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
                style={styles.container}>
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{item.full_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text>Author:</Text>
                            <Image
                                style={styles.avatarUrl}
                                source={{uri: item.owner.avatar_url}}
                            />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text>Star:</Text>
                            <Text>{item.stargazers_count}</Text>
                        </View>
                        {favoriteButton}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatarUrl: {
        height: 22,
        width: 22,
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    },
    cell_container: {
        backgroundColor:'white',
        padding:10,
        marginLeft:10,
        marginRight:10,
        marginVertical:3,
        borderWidth:0.5,
        borderRadius:4,
        borderColor:'#dddddd',
        shadowColor:'gray',
        shadowOffset:{width:0.5,height:0.5},
        shadowOpacity:0.4,
        shadowRadius:1,
        elevation:2,
    },
});