import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RNLanguages from 'react-native-languages';
import i18n from '../internationalization/i18n';

import { AppScreen, DirectoryBrowser } from '../components';

import { navigateBrowser, browseDirectory, browseFile } from '../actions';

class BrowserScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return { title: i18n.t('browser.title') };
    };
    // static navigationOptions = {
    //     title: 'Browser',
    // };

    onSelectEntry(entry) {
        if (entry.directory) {
            this.props.browseDirectory(entry.relativePath);
        }
        else {
            this.props.browseFile(entry.relativePath);
        }
    }

    render() {
        const { path, localFiles } = this.props;

        return (
            <AppScreen background={false}>
                <DirectoryBrowser path={path} localFiles={localFiles} onSelectEntry={this.onSelectEntry.bind(this)} />
            </AppScreen>
        );
    }
}

BrowserScreen.propTypes = {
    path: PropTypes.string.isRequired,
    navigateBrowser: PropTypes.func.isRequired,
    browseDirectory: PropTypes.func.isRequired,
    browseFile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const route = state.nav.routes[state.nav.index];
    return {
        path: route.params ? route.params.path : "/",
        localFiles: state.localFiles,
    };
};

export default connect(mapStateToProps, {
    navigateBrowser,
    browseDirectory,
    browseFile,
})(BrowserScreen);
