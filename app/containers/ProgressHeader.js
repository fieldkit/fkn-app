import _ from "lodash";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text } from "react-native";

import { Button } from "../components";

import { cancelInProgressOperation } from "../actions";

import Spinner from "react-native-loading-spinner-overlay";

import { ProgressBar } from "../components/ProgressBar";

import styles from "../styles";

class ProgressHeader extends React.Component {
    onCancel() {
        const { cancelInProgressOperation } = this.props;

        console.log("Cancel");

        cancelInProgressOperation();
    }

    render() {
        const { progress } = this.props;

        const bars = [];
        let cancelable = false;

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
                <View style={{}}>
                    {bars}
                    {cancelable && this.renderCancel()}
                </View>
            );
        }

        return <View />;
    }

    renderCancel() {
        return (
            <View style={{ paddingTop: 20, alignItems: "center" }}>
                <Button title="Cancel" onPress={() => this.onCancel()} color="#F8C471" />
            </View>
        );
    }

    renderBar(i, progress) {
        return (
            <View key={i} style={{ paddingTop: 20 }}>
                {progress.label ? (
                    <View>
                        <Text>{progress.label}</Text>
                    </View>
                ) : (
                    <View />
                )}
                <ProgressBar progress={progress.progress * 100} />
            </View>
        );
    }
}

ProgressHeader.propTypes = {
    progress: PropTypes.object.isRequired,
    cancelInProgressOperation: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    progress: state.progress
});

export default connect(
    mapStateToProps,
    {
        cancelInProgressOperation
    }
)(ProgressHeader);
