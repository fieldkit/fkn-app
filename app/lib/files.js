import _ from "lodash";

export function getPathName(path) {
    if (path == "/") {
        return "/";
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
    return _.find(parentListing, e => e.relativePath == path);
}

export function getFileInformation(entry) {
    const types = [
        {
            re: /\/([a-z0-9]{16})\/(\d+)_(\d+)_offset_(\d+)_(.+)/i,
            handler: match => {
                return {
                    deviceId: match[1],
                    fileId: Number(match[2]),
                    version: Number(match[3]),
                    offset: Number(match[4]),
                    name: match[5],
                    metadata: false,
                    headers: false
                };
            }
        },
        {
            re: /\/([a-z0-9]{16})\/(\d+)_(\d+)_headers_(.+)/i,
            handler: match => {
                return {
                    deviceId: match[1],
                    fileId: Number(match[2]),
                    version: Number(match[3]),
                    name: match[4],
                    metadata: false,
                    headers: true
                };
            }
        },
        {
            re: /\/([a-z0-9]{16})\/(\d+)_(\d+)_(.+)/i,
            handler: match => {
                return {
                    deviceId: match[1],
                    fileId: Number(match[2]),
                    version: Number(match[3]),
                    name: match[4],
                    metadata: false,
                    headers: false
                };
            }
        },
        {
            re: /\/([a-z0-9]{16})\/(metadata.fkpb)/i,
            handler: match => {
                return {
                    deviceId: match[1],
                    name: match[2],
                    metadata: true,
                    headers: false
                };
            }
        }
    ];

    return _(types)
        .map(type => {
            return {
                type: type,
                match: entry.relativePath.match(type.re)
            };
        })
        .filter(row => row.match != null)
        .map(row => {
            const info = row.type.handler(row.match);
            return { ...{ entry: entry }, ...info };
        })
        .first();
}
