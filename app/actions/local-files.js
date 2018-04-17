import _ from 'lodash';
import moment from 'moment';
import Promise from "bluebird";
import RNFS from 'react-native-fs';

import * as Types from './types';

export function browseDirectory(relativePath) {
    return (dispatch, getState) => {
        const path = RNFS.DocumentDirectoryPath + relativePath;

        return RNFS.readDir(path).then((res) => {
            const listing = _(res).map(e => {
                return {
                    name: e.name,
                    path: e.path,
                    relativePath: e.path.replace(RNFS.DocumentDirectoryPath, ""),
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
    };
}
