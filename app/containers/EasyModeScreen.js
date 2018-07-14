import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Image, Button } from 'react-native';

import * as Files from '../lib/files';
import { AppScreen } from '../components';

import { deviceStartConnect, findAllFiles, executePlan, deleteAllLocalFiles, archiveAllLocalFiles } from '../actions';

import styles from '../styles';

class UploadQueueOptions extends React.Component {
    onSync() {
        const { easyMode, executePlan } = this.props;
        const { uploads } = easyMode.plans;

        executePlan(uploads);
    }

    render() {
        const { easyMode } = this.props;
        const { uploads } = easyMode.plans;

        const numberOfFiles = _.size(uploads);

        if (numberOfFiles == 0) {
            return (
                <View style={{ padding: 10 }}><Text style={{ textAlign: 'center' }}>No pending files found.</Text></View>
            );
        }

        return (
            <View style={{ padding: 10 }}>
              <View><Text style={{ textAlign: 'center' }}>There are {numberOfFiles} file(s) pending for upload.</Text></View>
              <View><Button title="Phone -> Web" onPress={() => this.onSync()} /></View>
            </View>
        );
    }
}

class DeviceOptions extends React.Component {
    onSync() {
        const { easyMode, executePlan } = this.props;
        const { downloads } = easyMode.plans;

        executePlan(downloads);
    }

    render() {
        const { easyMode } = this.props;
        const { downloads } = easyMode.plans;

        const numberOfDevices = _.size(easyMode.devices);
        if (numberOfDevices == 0 || !_.isArray(downloads) || downloads.length == 0) {
            if (!easyMode.networkConfiguration.deviceAp) {
                return (
                    <View style={{ padding: 10 }}><Text style={{ textAlign: 'center' }}>No devices found. Try connecting to a FieldKit device's AP.</Text></View>
                );
            }
            else {
                return (
                    <View style={{ padding: 10 }}><Text style={{ textAlign: 'center' }}>No devices found.</Text></View>
                );
            }
        }

        return (
            <View style={{ padding: 10 }}>
              <View><Text style={{ textAlign: 'center' }}>Success, {numberOfDevices} device(s) found</Text></View>
              <View><Button title="Device -> Phone" onPress={() => this.onSync()} /></View>
            </View>
        );
    }
}

class EasyModeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    componentDidMount() {
        this.props.findAllFiles();
        this.props.deviceStartConnect();
    }

    componentWillUpdate(nextProps, nextState) {
        const { easyMode: easyModeBefore } = this.props;
        const { easyMode: easyModeAfter } = nextProps;

        if (!easyModeAfter.busy && easyModeBefore.busy != easyModeAfter.busy) {
            this.props.findAllFiles();
        }
    }

    render() {
        const { easyMode, executePlan, deleteAllLocalFiles, archiveAllLocalFiles, plan } = this.props;

        return (
            <AppScreen>
              <Image source={require('../../assets/fk-header.png')}
                     style={{
                         resizeMode: 'contain',
                         width: '100%',
                         height: 200,
                     }} />

              <DeviceOptions easyMode={easyMode} executePlan={executePlan} />
              <UploadQueueOptions easyMode={easyMode} executePlan={executePlan} />

              <View>
                <View style={{ padding: 10 }}><Button title="Delete All" onPress={() => deleteAllLocalFiles()} /></View>
                <View style={{ padding: 10 }}><Button title="Archive All" onPress={() => archiveAllLocalFiles()} /></View>
              </View>
            </AppScreen>
        );
    }

}

EasyModeScreen.propTypes = {
    deviceStartConnect: PropTypes.func.isRequired,
    executePlan:  PropTypes.func.isRequired,
    findAllFiles: PropTypes.func.isRequired,
    deleteAllLocalFiles: PropTypes.func.isRequired,
    archiveAllLocalFiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    easyMode: {
        busy: !state.progress.task.done,
        networkConfiguration: state.networkConfiguration,
        devices: state.devices,
        plans: state.planning.plans
    }
});

export default connect(mapStateToProps, {
    findAllFiles,
    executePlan,
    deviceStartConnect,
    deleteAllLocalFiles,
    archiveAllLocalFiles
})(EasyModeScreen);
