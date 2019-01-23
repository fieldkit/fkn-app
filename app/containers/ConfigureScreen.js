import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RNLanguages from 'react-native-languages';

import i18n from '../internationalization/i18n';

import { AppScreen, DeviceInfo, MenuButtonContainer, MenuButton, ConfirmationModal } from '../components';

import { navigateNetwork, navigateBack, resetDevice } from '../actions';

import { selectedDevice } from '../reducers/selectors';

import styles from '../styles';

class ConfigureScreen extends React.Component {
    static navigationOptions = {
        title: 'Configure',
    };

    constructor() {
        super();
        this.state = {
            confirming: false
        };
    }

    onReset(confirming) {
        this.setState({
            confirming: confirming
        });

        if (!confirming) {
            this.props.resetDevice();
        }
    }

    render() {
        const { deviceInfo } = this.props;

        return (
            <AppScreen>
                <DeviceInfo info={deviceInfo} />
                <MenuButtonContainer>
                    <MenuButton title={i18n.js('configure.network')} onPress={() => this.props.navigateNetwork()} />
                    <MenuButton title={i18n,js('configure.reset')} onPress={() => this.onReset(true)} />
                </MenuButtonContainer>
                <ConfirmationModal visible={this.state.confirming} onYes={() => this.onReset(false)} onNo={() => this.setState({ confirming: false })} />
            </AppScreen>
        );
    }
}

ConfigureScreen.propTypes = {
    navigateNetwork: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
    deviceInfo: PropTypes.object.isRequired,
    resetDevice: PropTypes.func.isRequired,
};

const mapStateToProps = state => selectedDevice(state);

export default connect(mapStateToProps, {
    navigateNetwork,
    navigateBack,
    resetDevice
})(ConfigureScreen);
