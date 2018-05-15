import React from 'react';
import PropTypes from 'prop-types';

import { View, Modal, TouchableHighlight, Text } from 'react-native';

import ProgressCircle from 'react-native-progress-circle';

import styles from '../styles';

export class ProgressModal extends React.Component {
    render() {
        return (
            <Modal transparent={true} visible={this.props.visible} onRequestClose={() => console.log("onRequestClose")}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                    <View style={{padding: 10, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0)', alignItems: 'center'}}>
                        <ProgressCircle
                            percent={this.props.progress}
                            radius={50}
                            borderWidth={8}
                            color="#3399ff"
                            shadowColor="#ddd"
                            bgColor="#fff">
                            <Text style={{ fontSize: 18 }}>{parseInt(this.props.progress)}%</Text>
                        </ProgressCircle>
                    </View>
                </View>
            </Modal>
        );
    }
}

ProgressModal.propTypes = {
    progress: PropTypes.number.isRequired,
    visible : PropTypes.bool.isRequired,
};
