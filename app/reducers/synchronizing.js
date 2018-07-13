import _ from 'lodash';

function getFileInformation(entry) {
    const types = [
        {
            re: /\/([a-z0-9]{16})\/(\d+)_(\d+)_offset_(\d+)_(.+)/i,
            handler: (match) => {
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
            handler: (match) => {
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
            handler: (match) => {
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
            re: /\/([a-z0-9]{16})\/metadata.fkpb/i,
            handler: (match) => {
                return {
                    deviceId: match[1],
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

function lpadZeros(value, padding) {
    var zeroes = new Array(padding + 1).join("0");
    return (zeroes + value).slice(-padding);
}

class DownloadPlanGenerator {
    constructor(config, local, remote) {
        this.config = config;
        this.local = local;
        this.remote = remote;
        this.infos = _(this.local).map(entry => getFileInformation(entry)).value();
    }

    makeFilename(directory, id, version, offset, name) {
        return directory + "/" + id + "_" + lpadZeros(version, 6) + "_offset_" + offset + "_" + name;
    }

    generateChunks(size, chunked) {
        const numberOfChunks = size / chunked;
        return _(_.range(0, size, chunked)).map(i => {
            return {
                offset: i,
                length: i + chunked < size ? chunked : (size - i)
            };
        }).reverse().value();
    }

    generate() {
        return _(this.config)
            .map(config => {
                const directory = "/" + this.remote.deviceId;
                const remoteFile = _(this.remote.files).filter(i => i.id === config.fileId).first();
                const localFiles = _(this.infos).filter(i => !i.headers).filter(i => i.fileId === config.fileId).filter(i => i.version === remoteFile.version).value();

                if (config.chunked > 0) {
                    const chunks = this.generateChunks(remoteFile.size, config.chunked);

                    function chunkToDownload(row) {
                        const { chunk } = row;
                        return {
                            download: {
                                file: this.makeFilename(directory, config.fileId, remoteFile.version, chunk.offset, remoteFile.name),
                                id: config.fileId,
                                offset: chunk.offset + row.localSize,
                                length: chunk.length - row.localSize
                            }
                        };
                    }

                    const chunkPlans = _(chunks)
                        .map(chunk => {
                            const localSize = _(localFiles).filter(i => i.offset === chunk.offset).map(i => i.entry.size).first() || 0;

                            return {
                                localSize: localSize,
                                remaining: chunk.length - localSize,
                                begun: localSize > 0,
                                completed: chunk.length == localSize,
                                chunk: chunk
                            };
                        });

                    const test = [
                        chunkPlans.filter(cp => cp.begun && !cp.completed).map(chunkToDownload.bind(this)).value(),
                        chunkPlans.filter(cp => !cp.begun && !cp.completed).map(chunkToDownload.bind(this)).first(),
                    ];

                    return _.flatten(test);
                }
                else {
                    const existingLocalFile = _(localFiles).orderBy(lf => lf.offset).reverse().first() || { entry: { size: 0 }, offset: 0 };
                    const sizeOfExisting = existingLocalFile.entry.size;

                    if (sizeOfExisting > remoteFile.size) {
                        return [
                            {
                                backup: {
                                    file: existingLocalFile.entry.relativePath
                                }
                            },
                            {
                                download: {
                                    file: this.makeFilename(directory, config.fileId, remoteFile.version, existingLocalFile.offset, remoteFile.name),
                                    id: config.fileId,
                                    offset: 0 + existingLocalFile.offset,
                                    length: 0
                                }
                            }
                        ];
                    }

                    if (sizeOfExisting == remoteFile.size) {
                        return null;
                    }

                    return {
                        download: {
                            file: this.makeFilename(directory, config.fileId, remoteFile.version, existingLocalFile.offset, remoteFile.name),
                            id: config.fileId,
                            offset: sizeOfExisting + existingLocalFile.offset,
                            length: 0
                        }
                    };
                }
            })
            .flatten()
            .compact()
            .value();
    }

}

export function generateDownloadPlan(local, remote) {
    if (!_.isArray(local) || !_.isObject(remote)) {
        return { plan: [] };
    }

    const planConfiguration = [ {
        fileId: 4,
        chunked: 0,
        offset: 0,
        length: 0,
    }, {
        fileId: 1,
        chunked: 1000000,
        offset: 0,
        length: 0,
    }];

    const generator = new DownloadPlanGenerator(planConfiguration, local, remote);

    return {
        plan: generator.generate()
    };
}

export function generateUploadPlan(local) {
    return {
        plan: []
    };
}
