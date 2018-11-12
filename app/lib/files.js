import _ from 'lodash';

export function getPathName(path) {
    if (path == '/') {
        return '/';
    }
    const parts = path.split("/");
    return parts.pop();
}

export function getParentPath(path) {
    if (path == "/") {
        return null;
    }
    const parts = path.split("/");
    parts.pop();
    if (parts.length <= 1) {
        return "/";
    }
    return parts.join("/");
}

export function getParentEntry(path) {
    const parentPath = getParentPath(path);
    if (parentPath == null) {
        return null;
    }
    const baseName = getPathName(parentPath);
    return {
        directory: true,
        relativePath: parentPath,
        name: "Up"
    };
}

export function getFileEntry(localFiles, path) {
    const listing = localFiles.listings[path];
    if (_.isArray(listing)) {
        return null;
    }
    const parentPath = getParentPath(path);
    const parentListing = localFiles.listings[parentPath];
    if (!_.isArray(parentListing)) {
        return null;
    }
    return _.find(parentListing, (e) => e.relativePath == path);
}
