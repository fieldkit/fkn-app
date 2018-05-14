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
        name: "Back"
    };
}
