import _ from 'lodash';
import moment from 'moment';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { View, Text } from 'react-native';

import { SmallButton, AppScreen, Loading, DeviceInfo } from '../components';

import { navigateBack, queryFiles, startDownloadFile } from '../actions';

import styles from '../styles';

class FilesScreen extends React.Component {
    static navigationOptions = {
        title: 'Files',
    };

    componentWillMount() {
        this.props.queryFiles();
    }

    render() {
        const { deviceInfo, deviceCapabilities: caps, files } = this.props;

        if (!_.isArray(files.files)) {
            return (<Loading />);
        }

        return (
            <AppScreen>
                <DeviceInfo info={deviceInfo} />
                {files.files.map((file, index) => this.renderFile(file, index))}
            </AppScreen>
        );
    }

    renderFile(file, index) {
        const { startDownloadFile } = this.props;

        return (
            <View key={index} style={styles.file.container}>
                <Text style={styles.file.name}>{file.name}</Text>
                <Text style={styles.file.details}>Size: {file.size}</Text>
                <SmallButton title="Download" onPress={() => startDownloadFile(file.id) } />
            </View>
        );
    }
}

FilesScreen.propTypes = {
    navigateBack: PropTypes.func.isRequired,
    queryFiles: PropTypes.func.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    deviceCapabilities: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    deviceInfo: state.deviceInfo,
    deviceCapabilities: state.deviceCapabilities,
    files: state.files
});

export default connect(mapStateToProps, {
    navigateBack,
    queryFiles,
    startDownloadFile
})(FilesScreen);
