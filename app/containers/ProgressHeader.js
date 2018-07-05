import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Button } from 'react-native';

import { cancelInProgressOperation } from '../actions';

import Spinner from 'react-native-loading-spinner-overlay';

import { ProgressBar } from '../components';

import styles from '../styles';

class ProgressHeader extends React.Component {
    constructor() {
        super();
    }

    render() {
        const { progress, cancelInProgressOperation } = this.props;

        if (progress.operations.length > 0) {
            return (
                <View>
                    {progress.operations.map((p, i) => this.renderBar(i, p))}
                </View>
            );
        }

        const bars = [];

        if (!progress.task.done) {
            bars.push(this.renderBar(0, progress.task));
        }

        if (!progress.download.done) {
            bars.push(this.renderBar(1, progress.download));
        }

        if (!progress.upload.done) {
            bars.push(this.renderBar(2, progress.upload));
        }

        if (bars.length > 0) {
            return <View>{bars}</View>;
        }

        return (
            <Spinner visible={progress.depth > 0} textContent={"Busy"} textStyle={{color: '#FFF'}} />
        );
    }

    renderCancel() {
        return (
            <View style={{ }}><Button title="Cancel" onPress={() => cancelInProgressOperation()} color="#F8C471" /></View>
        );
    }

    renderBar(i, progress) {
        return (
            <View key={i}>
                <ProgressBar progress={progress.progress * 100} />
                {progress.cancelable && this.renderCancel()}
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
