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

        if (progress.download.done) {
            return (
                <Spinner visible={progress.depth > 0} textContent={"Busy"} textStyle={{color: '#FFF'}} />
            );
        }

        return (
            <View>
                <ProgressBar progress={progress.download.progress * 100} />
                {progress.download.cancelable && <View style={{ }}><Button title="Cancel" onPress={() => cancelInProgressOperation()} color="#F8C471" /></View>}
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
