import _ from "lodash";
import moment from "moment";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import RNLanguages from "react-native-languages";
import i18n from "../internationalization/i18n";

import { View, Text, FlatList } from "react-native";

import { SmallButton, AppScreen, Loading } from "../components";

import { navigateBack, queryFiles, deleteFile } from "../actions";

import styles from "../styles";

//THIS IS THE FILE THAT TAKES DATA FROM THE DEVICE
class DataRecordRow extends React.Component {
    render() {
        const { record } = this.props;

        if (record.log) {
            return this.renderLog(record);
        }

        if (record.loggedReading) {
            return this.renderReading(record);
        }

        if (record.status) {
            return this.renderStatus(record);
        }

        if (record.metadata) {
            return this.renderMetadata(record);
        }

        return (
            <View style={styles.dataTable.row.unknown}>
                <Text>Unknown Record Type</Text>
            </View>
        );
    }

    unixToString(time) {
        return moment(time * 1000).format("M/DD HH:mm:ss");
    }

    renderMetadata(record) {
        const { metadata } = record;

        if (true) {
            return <View />;
        }

        return (
            <View style={styles.dataTable.row.metadata}>
                <Text style={{ paddingLeft: 0 }}>
                    {this.unixToString(metadata.time)}
                </Text>
                <Text style={{ paddingLeft: 5 }}>{metadata.deviceId}</Text>
                <Text style={{ paddingLeft: 5 }}>{metadata.git}</Text>
                <Text style={{ paddingLeft: 5 }}>{metadata.build}</Text>
                <Text style={{ paddingLeft: 5 }}>{metadata.resetCause}</Text>
            </View>
        );
    }

    renderStatus(record) {
        const { status } = record;
        return (
            <View style={styles.dataTable.row.status}>
                <Text style={{ paddingLeft: 0 }}>
                    {this.unixToString(status.time)}
                </Text>
                <Text style={{ paddingLeft: 5 }}>
                    Battery: {parseInt(status.battery)}%
                </Text>
                <Text style={{ paddingLeft: 5 }}>
                    Uptime: {status.uptime}ms
                </Text>
            </View>
        );
    }

    renderReading(record) {
        const { loggedReading } = record;
        const { location, reading } = loggedReading;

        if (reading) {
            const rounded = Math.round(reading.value * 1000) / 1000;

            return (
                <View style={styles.dataTable.row.reading}>
                    <Text style={{ paddingLeft: 0 }}>
                        {this.unixToString(reading.time)}
                    </Text>
                    <Text style={{ paddingLeft: 5 }}>
                        Sensor #{reading.sensor}
                    </Text>
                    <Text style={{ paddingLeft: 5 }}>{rounded}</Text>
                </View>
            );
        } else if (location) {
            return (
                <View style={styles.dataTable.row.reading}>
                    <Text style={{ paddingLeft: 0 }}>
                        {this.unixToString(location.time)}
                    </Text>
                    <Text style={{ paddingLeft: 5 }}>
                        Location {location.longitude} x {location.latitude}
                    </Text>
                </View>
            );
        }

        return <View />;
    }

    renderLog(record) {
        const { log } = record;
        return (
            <View style={styles.dataTable.row.log}>
                <Text style={{ paddingLeft: 0 }}>
                    {this.unixToString(log.time)}
                </Text>
                <Text style={{ paddingLeft: 5 }}>{log.facility}</Text>
                <Text style={{ paddingLeft: 5 }}>{log.message}</Text>
            </View>
        );
    }
}

class DataRecordListing extends React.Component {
    render() {
        const { records } = this.props;
        console.log(records);

        if (!_.isArray(records.records)) {
            return <View />;
        }

        return (
            <View style={styles.dataTable.container}>
                <FlatList
                    data={records.records}
                    renderItem={item => this.renderItem(item)}
                    keyExtractor={record => record.index.toString()}
                />
            </View>
        );
    }

    renderItem(item) {
        return <DataRecordRow record={item.item} />;
    }
}

DataRecordListing.propTypes = {
    records: PropTypes.object.isRequired
};

class DataTableScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return { title: i18n.t("dataTable.title") };
    };

    render() {
        const { records } = this.props;

        return (
            <AppScreen background={false}>
                <DataRecordListing records={records} />
            </AppScreen>
        );
    }
}

DataTableScreen.propTypes = {
    path: PropTypes.string.isRequired,
    records: PropTypes.object.isRequired,
    navigateBack: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
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
        navigateBack,
        queryFiles,
        deleteFile
    }
)(DataTableScreen);
