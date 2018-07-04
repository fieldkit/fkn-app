import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Image } from 'react-native';

import { AppScreen } from '../components';

import { deviceStartConnect, findAllFiles } from '../actions';

import styles from '../styles';

class EasyModeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    componentDidMount() {
        this.props.findAllFiles();
        this.props.deviceStartConnect();
    }

    render() {
        const { easyMode } = this.props;

        console.log(easyMode);

        return (
            <AppScreen>
                <Image source={require('../../assets/fk-header.png')}
                    style={{
                        resizeMode: 'contain',
                        width: '100%',
                        height: 200,
                    }} />
            </AppScreen>
        );
    }
}

EasyModeScreen.propTypes = {
    deviceStartConnect: PropTypes.func.isRequired,
    findAllFiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    easyMode: {
        networkConfiguration: state.networkConfiguration,
        devices: state.devices,
    }
});

export default connect(mapStateToProps, {
    findAllFiles,
    deviceStartConnect
})(EasyModeScreen);
