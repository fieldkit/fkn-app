import React from 'react';
import PropTypes from 'prop-types';

import { View, Modal, Text } from 'react-native';
import { MenuButtonContainer, MenuButton } from './MenuButtons';

import styles from '../styles';

export class ConfirmationModal extends React.Component {
    constructor() {
        super();
    }

    onYes() {
        this.props.onYes();
    }

    onNo() {
        this.props.onNo();
    }

    render() {
        const { visible } = this.props;

        return (
            <Modal visible={visible} onRequestClose={() => console.log("onRequestClose")}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                    <View style={{padding: 10, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0)', alignItems: 'center'}}>
                        <Text>Are you sure?</Text>

                        <MenuButtonContainer>
                            <MenuButton title="Yes" onPress={() => this.onYes()} />
                            <MenuButton title="No" onPress={() => this.onNo()} />
                        </MenuButtonContainer>
                    </View>
                </View>
            </Modal>
        );
    }
}

ConfirmationModal.propTypes = {
    onYes : PropTypes.func.isRequired,
    onNo : PropTypes.func.isRequired,
    visible : PropTypes.bool.isRequired,
};
