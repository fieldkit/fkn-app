import _ from 'lodash';
import moment from 'moment';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RNLanguages from 'react-native-languages';

import i18n from '../internationalization/i18n';

import { View, Text, ScrollView } from 'react-native';

import { SmallButton, AppScreen, Loading, DeviceInfo } from '../components';

import { navigateBack, queryFiles, startDownloadFile, deleteFile } from '../actions';

import { selectedDevice } from '../reducers/selectors';

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
            <AppScreen background={false}>
                <DeviceInfo info={deviceInfo} />
                <ScrollView>
                  {files.files.map((file, index) => this.renderFile(file, index))}
                </ScrollView>
            </AppScreen>
        );
    }

    renderFile(file, index) {
        const { startDownloadFile, deleteFile } = this.props;

        return (
            <View key={index} style={styles.file.container}>
                <Text style={styles.file.name}>{file.name}</Text>
                <Text style={styles.file.details}>Size: {file.size}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <SmallButton title={i18n.t('files.download')} onPress={() => startDownloadFile(file.id) } />
                    <SmallButton title={i18n.t('files.delete')} onPress={() => deleteFile(file.id) } color="#E74C3C" />
                </View>
            </View>
        );
    }
}

FilesScreen.propTypes = {
    startDownloadFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
    queryFiles: PropTypes.func.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    deviceCapabilities: PropTypes.object.isRequired,
};

const mapStateToProps = state => selectedDevice(state);

export default connect(mapStateToProps, {
    navigateBack,
    queryFiles,
    startDownloadFile,
    deleteFile
})(FilesScreen);
