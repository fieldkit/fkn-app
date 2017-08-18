import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactNative from 'react-native';
import { appStyle } from '../styles';
const {
    ScrollView,
    View,
    TextInput,
    Image,
    Text,
    TouchableHighlight,
    StyleSheet
} = ReactNative;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
                <View style={styles.scene}>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        marginTop: 20
    }
});

function mapStateToProps(state) {
    return {
    };
}

export default connect(mapStateToProps)(Home);
