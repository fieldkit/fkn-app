import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Config from '../config';

import { View, Text, Image } from 'react-native';

import { AppScreen, MenuButtonContainer, MenuButton } from '../components';

import { navigateWelcome } from '../actions';

import { StyleSheet } from 'react-native';

import Mapbox from '@mapbox/react-native-mapbox-gl';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from '../secrets';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
    },
});

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

class MapScreen extends React.Component {
    static navigationOptions = {
        title: 'Map',
    };

    render() {
        const { navigateWelcome } = this.props;

        return (
            <View style={styles.container}>
                <Mapbox.MapView
                   styleURL={MAPBOX_STYLE}
                   zoomLevel={15}
                   centerCoordinate={[11.256, 43.770]}
                   style={styles.container}>
                </Mapbox.MapView>
            </View>
        );
    }
}

MapScreen.propTypes = {
    navigateWelcome: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {
    navigateWelcome
})(MapScreen);
