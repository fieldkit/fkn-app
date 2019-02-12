import React from "react";
import PropTypes from "prop-types";
import { createStore } from "redux";
import { connect, Provider } from "react-redux";

import Config from "../config";

import { View, Text, Image } from "react-native";

import { AppScreen, MenuButtonContainer, MenuButton } from "../components";

import {
  navigateBack,
  navigateMap,
  navigateWelcome,
  userLocation
} from "../actions";

import { StyleSheet } from "react-native";

import Mapbox from "@mapbox/react-native-mapbox-gl";
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from "../../secrets";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 15
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "orange",
    transform: [{ scale: 0.6 }]
  }
});

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

class MapScreen extends React.Component {
  static navigationOptions = {
    title: "Map"
  };

  componentDidMount() {
    this.props.userLocation();
  }

  renderAnnotations(coordinateArray) {
    console.log(coordinateArray);
    return (
      <Mapbox.PointAnnotation
        key="pointAnnotation"
        id="pointAnnotation"
        coordinate={coordinateArray}
      >
        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
        <Mapbox.Callout title="User Location" />
      </Mapbox.PointAnnotation>
    );
  }

  render() {
    const {
      navigateBack,
      navigateMap,
      navigateWelcome,
      giveUserLocation
    } = this.props;

    let coordinateArray = [giveUserLocation.lat, giveUserLocation.long];

    if (giveUserLocation.lat !== undefined) {
      let coordinateArray = [giveUserLocation.long, giveUserLocation.lat];
      return (
        <View style={styles.container}>
          <Mapbox.MapView
            styleURL={MAPBOX_STYLE}
            zoomLevel={15}
            centerCoordinate={coordinateArray}
            style={styles.container}
          >
            {this.renderAnnotations(coordinateArray)}
          </Mapbox.MapView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>loading map</Text>
        </View>
      );
    }
  }
}

MapScreen.propTypes = {
  navigateWelcome: PropTypes.func.isRequired,
  navigateBack: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  giveUserLocation: state.giveUserLocation
});

export default connect(
  mapStateToProps,
  {
    navigateMap,
    userLocation,
    navigateBack,
    navigateWelcome
  }
)(MapScreen);
