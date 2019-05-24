import React from "react";
import PropTypes from "prop-types";
import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import _ from "lodash";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import Config from "../config";

import { View, Text, Image } from "react-native";

import { AppScreen, MenuButtonContainer, MenuButton } from "../components";
import { queryFiles } from "../actions";

import { navigateBack, navigateMap, navigateWelcome, location } from "../actions";

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
    static navigationOptions = ({ navigation }) => {
        return { title: i18n.t("mapScreen.title") };
    };

    componentDidMount() {
        this.props.location();
    }

    renderAnnotations(coordinate, i) {
        const myString = coordinate.toString();
        return (
            <Mapbox.PointAnnotation key={i} id={"pointAnnotation-" + i} coordinate={coordinate}>
                <View style={styles.annotationContainer}>
                    <View style={styles.annotationFill} />
                </View>
                <Mapbox.Callout title={myString} />
            </Mapbox.PointAnnotation>
        );
    }

    render() {
        const { navigateBack, navigateMap, navigateWelcome, giveLocation, records } = this.props;
        if (giveLocation.phone !== undefined) {
            const coordinateArray = [giveLocation.phone.long, giveLocation.phone.lat];
            return (
                <View style={styles.container}>
                    <Mapbox.MapView styleURL={MAPBOX_STYLE} zoomLevel={15} centerCoordinate={coordinateArray} style={styles.container}>
                        <Mapbox.ShapeSource id="line1" shape={giveLocation.route}>
                            <Mapbox.LineLayer id="linelayer1" style={{ lineColor: "red" }} />
                        </Mapbox.ShapeSource>
                        {giveLocation.sensors.map((coordinate, index) => {
                            return this.renderAnnotations(coordinate, index);
                        })}
                        {this.renderAnnotations(coordinateArray, 3)}
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

const mapStateToProps = state => {
    //const route = state.nav.routes[state.nav.index];
    //const path = route.params.path;
    return {
        //path: path,
        giveLocation: state.giveLocation
        //records: state.localFiles.records[path] || {}
    };
};

export default connect(
    mapStateToProps,
    {
        navigateMap,
        location,
        navigateBack,
        navigateWelcome,
        queryFiles
    }
)(MapScreen);
