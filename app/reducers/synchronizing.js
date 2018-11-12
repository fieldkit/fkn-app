import _ from 'lodash';
import { hexArrayBuffer } from '../lib/base64';
import { getFileInformation } from '../lib/files';

function lpadZeros(value, padding) {
    var zeroes = new Array(padding + 1).join("0");
    return (zeroes + value).slice(-padding);
}

function makeFilename(directory, id, version, offset, name) {
    return directory + "/" + id + "_" + lpadZeros(version, 6) + "_offset_" + offset + "_" + name;
}

function makeHeadersFilename(directory, id, version, name) {
    return directory + "/" + id + "_" + lpadZeros(version, 6) + "_headers_" + name;
}

export function getDownloadSettings(device, file) {
    const directory = "/" + hexArrayBuffer(device.deviceId);
    const settings = {
        offset: 0,
        length: 0,
        paths: {
            file: makeFilename(directory, file.id, file.version, 0, file.name),
            headers: makeHeadersFilename(directory, file.id, file.version, file.name)
        }
    };
    return Promise.resolve(settings);
}

class DownloadPlanGenerator {
    constructor(config, local, remote) {
        this.config = config;
        this.deviceId = remote.deviceId;
        this.address = remote.address;
        this.infos = _(local.files).filter(entry => !entry.directory).map(entry => getFileInformation(entry)).filter(info => _.isObject(info)).value();
        this.remote = remote;
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
        const plan = _(this.config)
            .map(config => {
                const remote = _(this.remote.files).filter(i => i.id === config.fileId).first();
                if (remote == null) {
                    return null;
                }

                const locals = _(this.infos).filter(i => !i.headers).filter(i => i.fileId === config.fileId).filter(i => i.version === remote.version).value();

                return {
                    directory: "/" + this.deviceId,
                    config: config,
                    remote: remote,
                    locals: locals,
                };
            })
            .filter(row => {
                return _.isObject(row);
            })
            .filter(row => {
                return row.config.condition(row.remote, this.remote.files);
            })
            .map(row => {
                const { directory, config, remote, locals } = row;

                if (config.chunked > 0) {
                    const chunks = this.generateChunks(remote.size, config.chunked);

                    function chunkToDownload(row) {
                        const { chunk } = row;
                        return {
                            download: {
                                address: this.address,
                                file: makeFilename(directory, config.fileId, remote.version, chunk.offset, remote.name),
                                headers: makeHeadersFilename(directory, config.fileId, remote.version, remote.name),
                                id: config.fileId,
                                offset: chunk.offset + row.localSize,
                                length: chunk.length - row.localSize
                            }
                        };
                    }

                    const chunkPlans = _(chunks)
                        .map(chunk => {
                            const localSize = _(locals).filter(i => i.offset === chunk.offset).map(i => i.entry.size).first() || 0;

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
                else if (config.tail > 0) {
                    let offset = 0;
                    if (remote.size > config.tail) {
                        offset = remote.size - config.tail;
                    }

                    if (_(locals).filter(lf => lf.offset == offset && lf.entry.size == config.tail).some()) {
                        return [];
                    }

                    if (remote.size == 0) {
                        return [];
                    }

                    return {
                        download: {
                            address: this.address,
                            file: makeFilename(directory, config.fileId, remote.version, offset, remote.name),
                            headers: makeHeadersFilename(directory, config.fileId, remote.version, remote.name),
                            id: config.fileId,
                            offset: offset,
                            length: config.tail
                        }
                    };
                }
                else {
                    const existingLocalFile = _(locals).orderBy(lf => lf.offset).reverse().first() || { entry: { size: 0 }, offset: 0 };
                    const sizeOfExisting = existingLocalFile.entry.size;

                    if (sizeOfExisting > remote.size) {
                        return [
                            {
                                backup: {
                                    file: existingLocalFile.entry.relativePath
                                }
                            },
                            {
                                download: {
                                    address: this.address,
                                    file: makeFilename(directory, config.fileId, remote.version, existingLocalFile.offset, remote.name),
                                    headers: makeHeadersFilename(directory, config.fileId, remote.version, remote.name),
                                    id: config.fileId,
                                    offset: 0 + existingLocalFile.offset,
                                    length: 0
                                }
                            }
                        ];
                    }

                    if (sizeOfExisting == remote.size) {
                        return null;
                    }

                    return {
                        download: {
                            address: this.address,
                            file: makeFilename(directory, config.fileId, remote.version, existingLocalFile.offset, remote.name),
                            headers: makeHeadersFilename(directory, config.fileId, remote.version, remote.name),
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

        return {
            plan: plan
        };
    }
}

class UploadPlanGenerator {
    constructor(config, local) {
        this.config = config;
        this.infos = _(local.files).filter(entry => !entry.directory).map(entry => getFileInformation(entry)).filter(info => _.isObject(info)).value();
    }

    generate() {
        const metadata = _(this.infos).filter(f => f.metadata).first();
        const nonEmpty = _(this.infos).filter(f => f.entry.size > 0).value();
        const dataFiles = _(nonEmpty).filter(f => _.isNumber(f.offset)).value();

        const plan = _(dataFiles)
            .map(file => {
                const directory = "/" + file.deviceId;

                return [
                    {
                        upload: {
                            metadata: metadata ? metadata.entry.relativePath : null,
                            file: file.entry.relativePath,
                            headers: {
                                deviceId: file.deviceId,
                                fileId: file.fileId,
                                fileOffset: file.offset,
                                fileVersion: file.version,
                                fileName: file.name,
                                uploadName: file.entry.name
                            }
                        }
                    },
                    {
                        archive: {
                            file: file.entry.relativePath,
                            touch: makeFilename(directory, file.fileId, file.version, file.entry.size, file.name),
                        }
                    }
                ];
            })
            .flatten()
            .value();

        return {
            numberOfFiles: dataFiles.length,
            plan: plan
        };
    }
}

export function generateDownloadPlan(config, local, remote) {
    if (!_.isObject(local) || !_.isObject(remote)) {
        return { plan: [] };
    }

    const generator = new DownloadPlanGenerator(config, local, remote);
    return generator.generate();
}

export function generateUploadPlan(config, local) {
    if (!_.isObject(local)) {
        return { plan: [] };
    }

    const generator = new UploadPlanGenerator(config, local);
    return generator.generate();
}
