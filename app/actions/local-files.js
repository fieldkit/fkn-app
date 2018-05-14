import _ from 'lodash';
import moment from 'moment';
import Promise from "bluebird";
import RNFS from 'react-native-fs';

import * as Types from './types';

import { resolveDataDirectoryPath } from '../lib/downloading';

export function browseDirectory(relativePath) {
    return (dispatch, getState) => {
        return resolveDataDirectoryPath().then((dataDirectoryPath) => {
            const path = dataDirectoryPath + relativePath;
            console.log("Reading", path);
            return RNFS.readDir(path).then((res) => {
                const listing = _(res).map(e => {
                    return {
                        name: e.name,
                        path: e.path,
                        relativePath: e.path.replace(dataDirectoryPath, ""),
                        size: e.size,
                        created: e.ctime,
                        modified: e.mtime,
                        directory: e.isDirectory(),
                    };
                }).value();

                dispatch({
                    type: Types.LOCAL_FILES_BROWSE,
                    relativePath: relativePath,
                    path: path,
                    listing: listing
                })
            });
        });
    }
}
