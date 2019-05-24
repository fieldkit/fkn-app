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

import { navigateBack, openDataMap, navigateWelcome, location } from "../actions";

import { StyleSheet } from "react-native";

import Mapbox from "@mapbox/react-native-mapbox-gl";
import { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } from "../../secrets";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1
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

class DataMapScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return { title: i18n.t("dataMapScreen.title") };
    };

    renderAnnotations(coordinate, i) {
        let myString = coordinate.toString();
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
        const { records } = this.props;

        if (records != null && records.records != null) {
            var routePoints = _(records.records)
                .filter(locationObject => locationObject.loggedReading && locationObject.loggedReading.location && (locationObject.loggedReading.location.fix == 0 || locationObject.loggedReading.location.fix == 1))
                .map((locationObject, index) => {
                    let coordinate = [locationObject.loggedReading.location.longitude, locationObject.loggedReading.location.latitude];
                    return coordinate;
                })
                .value();

            return (
                <View style={styles.container}>
                    <Mapbox.MapView styleURL={MAPBOX_STYLE} zoomLevel={15} style={styles.container} centerCoordinate={routePoints[0]}>
                        <Mapbox.ShapeSource
                            id="line1"
                            shape={{
                                type: "FeatureCollection",
                                features: [
                                    {
                                        type: "Feature",
                                        properties: {},
                                        geometry: {
                                            type: "LineString",
                                            coordinates: routePoints
                                        }
                                    }
                                ]
                            }}
                        >
                            <Mapbox.LineLayer
                                id="linelayer1"
                                source="line1"
                                type="line"
                                visibility="visible"
                                style={{
                                    lineColor: "blue",
                                    lineWidth: 4
                                }}
                            />
                        </Mapbox.ShapeSource>
                        {routePoints.map((coordinate, index) => {
                            return this.renderAnnotations(coordinate, index);
                        })}
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

DataMapScreen.propTypes = {
    path: PropTypes.string.isRequired,
    records: PropTypes.object.isRequired,
    navigateBack: PropTypes.func.isRequired,
    queryFiles: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    const route = state.nav.routes[state.nav.index];
    const path = route.params.path;
    return {
        path: path,
        records: state.localFiles.records[path] || {}
    };
};

export default connect(
    mapStateToProps,
    {
        openDataMap,
        location,
        navigateBack,
        navigateWelcome,
        queryFiles
    }
)(DataMapScreen);
