import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import MAPBOX_ACCESS_TOKEN from '../../secrets';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

export default class Mapbox extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={15}
            centerCoordinate={[11.256, 43.770]}
            style={styles.container}>
        </Mapbox.MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
