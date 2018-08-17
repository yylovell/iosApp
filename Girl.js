import React, { Component } from 'react';
import {
    StyleSheet,
TouchableOpacity,
Image,
    Text,
    View
} from 'react-native';
import NavigationBar from './NavigationBar';

export default class Girl extends Component{
    constructor(props){
        super(props);
        this.state={
            word: ''
        }
    }
    renderButton(image){
        return <TouchableOpacity
            onPress={()=>{
                this.props.navigator.pop();
            }
            }
                >
                <Image style={{width:22,height:22, margin:5}} source={image}/>
        </TouchableOpacity>
    };
    render(){
        return(
            <View style={styles.container}>
                <NavigationBar title={'Girl'} style={{backgroundColor:'#ee6363'}}
                               leftButton={
                                    this.renderButton(require('./res/images/ic_arrow_back_white_36pt.png'))
                                }
                               rightButton={
                                   this.renderButton(require('./res/images/ic_star.png'))
                               }
                />
                <Text style={styles.text}>女孩</Text>
                <Text style={styles.text}>{this.props.word}</Text>
                <Text style={styles.text} onPress={() => {
                    this.props.onCallBack("女孩回赠一盒巧克力给男孩");
                    this.props.navigator.pop();
                }}>回赠一盒巧克力给男孩</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'white',
    },
    text:{
        fontSize:20
    }

});