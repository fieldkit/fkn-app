import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Button } from 'react-native';

import { cancelInProgressOperation } from '../actions';

import Spinner from 'react-native-loading-spinner-overlay';

import { ProgressBar } from '../components';

import styles from '../styles';

class ProgressHeader extends React.Component {
    onCancel() {
        const { cancelInProgressOperation } = this.props;

        console.log("Cancel");

        cancelInProgressOperation();
    }

    render() {
        const { progress } = this.props;

        if (progress.operations.length > 0) {
            return (
                <View>
                    {progress.operations.map((p, i) => this.renderBar(i, p))}
                </View>
            );
        }

        const bars = [];
        let cancelable = false;

        if (!progress.task.done) {
            bars.push(this.renderBar(0, progress.task));
            cancelable = cancelable || progress.task.cancelable;
        }

        if (!progress.download.done) {
            bars.push(this.renderBar(1, progress.download));
            cancelable = cancelable || progress.download.cancelable;
        }

        if (!progress.upload.done) {
            bars.push(this.renderBar(2, progress.upload));
            cancelable = cancelable || progress.upload.cancelable;
        }

        if (bars.length > 0) {
            return (
                <View>
                  {bars}
                  {cancelable && this.renderCancel()}
                </View>
            );
        }

        return (
            <Spinner visible={progress.depth > 0} textContent={"Busy"} textStyle={{color: '#FFF'}} />
        );
    }

    renderCancel() {
        return (
            <View style={{ }}><Button title="Cancel" onPress={() => this.onCancel()} color="#F8C471" /></View>
        );
    }

    renderBar(i, progress) {
        return (
            <View key={i}>
                {progress.label ? <View><Text>{progress.label}</Text></View> : <View/>}
                <ProgressBar progress={progress.progress * 100} />
            </View>
        );
    }
}

ProgressHeader.propTypes = {
    progress: PropTypes.object.isRequired,
    cancelInProgressOperation: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    progress: state.progress,
});

export default connect(mapStateToProps, {
    cancelInProgressOperation
})(ProgressHeader);
