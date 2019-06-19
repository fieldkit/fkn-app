import _ from "lodash";

import { generateDownloadPlan, generateUploadPlan } from "./synchronizing";

import { Configuration } from "./planning";
import { Scenarios } from "./scenarios";

describe("synchronizing", () => {
    const DeviceId = "0004a30b001cc468";

    function makeDevice(files) {
        return {
            deviceId: DeviceId,
            address: "192.168.0.120",
            files: files
        };
    }

    function makeLocal(files) {
        return {
            files: files
        };
    }

    const SimpleConfiguration = [
        {
            fileId: 4,
            chunked: 0,
            offset: 0,
            length: 0
        }
    ];

    const DeviceAddress = "192.168.0.120";

    describe("download planning", () => {
        describe("chunked configuration", () => {
            const ChunkedConfiguration = [
                {
                    fileId: 4,
                    chunked: 0,
                    offset: 0,
                    length: 0,
                    delete: false,
                    condition: (file, others) => true
                },
                {
                    fileId: 1,
                    chunked: 1000000,
                    offset: 0,
                    length: 0,
                    delete: false,
                    condition: (file, others) => true
                }
            ];

            describe("with empty remote files", () => {
                beforeEach(() => {
                    const device = [{ id: 1, version: 1, size: 0, name: "startup.log" }, { id: 2, version: 1, size: 0, name: "now.log" }, { id: 3, version: 1, size: 0, name: "emergency.log" }, { id: 4, version: 1, size: 0, name: "data.fk" }];

                    this.plan = generateDownloadPlan(ChunkedConfiguration, makeLocal([]), makeDevice(device));
                });

                it("should generate empty plan", () => {
                    expect(this.plan.plan.length).toBe(0);
                });
            });

            describe("with no local files", () => {
                beforeEach(() => {
                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8100000,
                            name: "startup.log"
                        },
                        { id: 2, version: 1, size: 0, name: "now.log" },
                        { id: 3, version: 1, size: 0, name: "emergency.log" },
                        { id: 4, version: 1, size: 15000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(ChunkedConfiguration, makeLocal([]), makeDevice(device));
                });

                it("should download entire data file", () => {
                    expect(this.plan.plan[1]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 4,
                            file: "/.staging/0004a30b001cc468/4_000001_offset_0_data.fk",
                            headers: "/.staging/0004a30b001cc468/4_000001_headers_data.fk",
                            downloading: 15000,
                            offset: 0,
                            length: 0
                        }
                    });
                });

                it("should download last chunk of log", () => {
                    expect(this.plan.plan[2]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 1,
                            file: "/.staging/0004a30b001cc468/1_000001_offset_8000000_startup.log",
                            headers: "/.staging/0004a30b001cc468/1_000001_headers_startup.log",
                            downloading: 100000,
                            offset: 8000000,
                            length: 100000
                        }
                    });
                });
            });

            describe("with local data file that has a non-zero offset", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_15000_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_15000_data.fk",
                            size: 0
                        },
                        {
                            name: "1_000001_offset_8000000_startup.log",
                            relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log",
                            size: 100000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8100000,
                            name: "startup.log"
                        },
                        { id: 2, version: 1, size: 0, name: "now.log" },
                        { id: 3, version: 1, size: 0, name: "emergency.log" },
                        { id: 4, version: 1, size: 30000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(ChunkedConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should resume data file", () => {
                    expect(this.plan.plan[1]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 4,
                            file: "/.staging/0004a30b001cc468/4_000001_offset_15000_data.fk",
                            headers: "/.staging/0004a30b001cc468/4_000001_headers_data.fk",
                            downloading: 15000,
                            offset: 15000,
                            length: 0
                        }
                    });
                });

                it("should download last chunk of log", () => {
                    expect(this.plan.plan[2]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 1,
                            file: "/.staging/0004a30b001cc468/1_000001_offset_7000000_startup.log",
                            headers: "/.staging/0004a30b001cc468/1_000001_headers_startup.log",
                            downloading: 1000000,
                            offset: 7000000,
                            length: 1000000
                        }
                    });
                });
            });

            describe("with local files of an older version", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 15000
                        },
                        {
                            name: "1_000001_offset_8000000_startup.log",
                            relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log",
                            size: 100000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 2,
                            size: 8100000,
                            name: "startup.log"
                        },
                        { id: 2, version: 2, size: 0, name: "now.log" },
                        { id: 3, version: 2, size: 0, name: "emergency.log" },
                        { id: 4, version: 2, size: 15000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(ChunkedConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download entire data file", () => {
                    expect(this.plan.plan[1]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 4,
                            file: "/.staging/0004a30b001cc468/4_000002_offset_0_data.fk",
                            headers: "/.staging/0004a30b001cc468/4_000002_headers_data.fk",
                            downloading: 15000,
                            offset: 0,
                            length: 0
                        }
                    });
                });

                it("should download last chunk of log", () => {
                    expect(this.plan.plan[2]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 1,
                            file: "/.staging/0004a30b001cc468/1_000002_offset_8000000_startup.log",
                            headers: "/.staging/0004a30b001cc468/1_000002_headers_startup.log",
                            downloading: 100000,
                            offset: 8000000,
                            length: 100000
                        }
                    });
                });
            });

            describe("with local files from a good previous download and a larger last chunk ", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 15000
                        },
                        {
                            name: "1_000001_offset_8000000_startup.log",
                            relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log",
                            size: 100000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8200000,
                            name: "startup.log"
                        },
                        { id: 2, version: 1, size: 0, name: "now.log" },
                        { id: 3, version: 1, size: 0, name: "emergency.log" },
                        { id: 4, version: 1, size: 30000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(ChunkedConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should resume data file", () => {
                    expect(this.plan.plan[1]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 4,
                            file: "/.staging/0004a30b001cc468/4_000001_offset_15000_data.fk",
                            headers: "/.staging/0004a30b001cc468/4_000001_headers_data.fk",
                            downloading: 15000,
                            offset: 15000,
                            length: 0
                        }
                    });
                });

                it("should resume last chunk of log", () => {
                    expect(this.plan.plan[2]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 1,
                            file: "/.staging/0004a30b001cc468/1_000001_offset_8000000_startup.log",
                            headers: "/.staging/0004a30b001cc468/1_000001_headers_startup.log",
                            downloading: 100000,
                            offset: 8100000,
                            length: 100000
                        }
                    });
                });

                it("should download next to last chunk of log", () => {
                    expect(this.plan.plan[3]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 1,
                            file: "/.staging/0004a30b001cc468/1_000001_offset_7000000_startup.log",
                            headers: "/.staging/0004a30b001cc468/1_000001_headers_startup.log",
                            downloading: 1000000,
                            offset: 7000000,
                            length: 1000000
                        }
                    });
                });
            });

            describe("with local files from a good previous download and a complete last chunk ", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 15000
                        },
                        {
                            name: "1_000001_offset_8000000_startup.log",
                            relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log",
                            size: 200000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8200000,
                            name: "startup.log"
                        },
                        { id: 2, version: 1, size: 0, name: "now.log" },
                        { id: 3, version: 1, size: 0, name: "emergency.log" },
                        { id: 4, version: 1, size: 30000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(ChunkedConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should resume data file", () => {
                    expect(this.plan.plan[1]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 4,
                            file: "/.staging/0004a30b001cc468/4_000001_offset_15000_data.fk",
                            headers: "/.staging/0004a30b001cc468/4_000001_headers_data.fk",
                            downloading: 15000,
                            offset: 15000,
                            length: 0
                        }
                    });
                });

                it("should download next to last chunk of log", () => {
                    expect(this.plan.plan[2]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 1,
                            file: "/.staging/0004a30b001cc468/1_000001_offset_7000000_startup.log",
                            headers: "/.staging/0004a30b001cc468/1_000001_headers_startup.log",
                            downloading: 1000000,
                            offset: 7000000,
                            length: 1000000
                        }
                    });
                });
            });

            describe("with completed next to last chunk", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 30000
                        },
                        {
                            name: "1_000001_offset_8000000_startup.log",
                            relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log",
                            size: 200000
                        },
                        {
                            name: "1_000001_offset_7000000_startup.log",
                            relativePath: "/0004a30b001cc468/1_000001_offset_7000000_startup.log",
                            size: 1000000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8200000,
                            name: "startup.log"
                        },
                        { id: 4, version: 1, size: 30000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(ChunkedConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download the chunk before", () => {
                    expect(this.plan.plan[1]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 1,
                            file: "/.staging/0004a30b001cc468/1_000001_offset_6000000_startup.log",
                            headers: "/.staging/0004a30b001cc468/1_000001_headers_startup.log",
                            downloading: 1000000,
                            offset: 6000000,
                            length: 1000000
                        }
                    });
                });
            });

            describe("with local file larger than device file", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 31000
                        },
                        {
                            name: "1_000001_offset_8000000_startup.log",
                            relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log",
                            size: 200000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8200000,
                            name: "startup.log"
                        },
                        { id: 4, version: 1, size: 30000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(ChunkedConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should archive backup local file", () => {
                    expect(this.plan.plan[1]).toEqual({
                        backup: {
                            file: "/0004a30b001cc468/4_000001_offset_0_data.fk"
                        }
                    });
                });

                it("should download entire data file", () => {
                    expect(this.plan.plan[2]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 4,
                            file: "/.staging/0004a30b001cc468/4_000001_offset_0_data.fk",
                            headers: "/.staging/0004a30b001cc468/4_000001_headers_data.fk",
                            downloading: 30000,
                            offset: 0,
                            length: 0
                        }
                    });
                });
            });
        });

        describe("tail configuration", () => {
            const TailConfiguration = [
                {
                    fileId: 1,
                    tail: 1000000,
                    offset: 0,
                    length: 0,
                    delete: false,
                    condition: (file, others) => true
                }
            ];

            describe("with no local files", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 31000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8200000,
                            name: "logs-a.fklog"
                        },
                        { id: 4, version: 1, size: 30000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(TailConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download tail of the file", () => {
                    expect(this.plan.plan[1]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 1,
                            file: "/.staging/0004a30b001cc468/1_000001_offset_7200000_logs-a.fklog",
                            headers: "/.staging/0004a30b001cc468/1_000001_headers_logs-a.fklog",
                            downloading: 1000000,
                            offset: 7200000,
                            length: 1000000
                        }
                    });
                });
            });

            describe("with existing local file of same offset and expected length", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 31000
                        },
                        {
                            name: "1_000001_offset_7200000_logs-a.fklog",
                            relativePath: "/0004a30b001cc468/1_000001_offset_7200000_logs-a.fklog",
                            size: 1000000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8200000,
                            name: "logs-a.fklog"
                        },
                        { id: 4, version: 1, size: 30000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(TailConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download nothing", () => {
                    expect(this.plan.plan.length).toEqual(0);
                });
            });

            describe("with existing local file of another offset", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 31000
                        },
                        {
                            name: "1_000001_offset_5000000_logs-a.fklog",
                            relativePath: "/0004a30b001cc468/1_000001_offset_5000000_logs-a.fklog",
                            size: 1000000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8200000,
                            name: "logs-a.fklog"
                        },
                        { id: 4, version: 1, size: 30000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(TailConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download tail of the file", () => {
                    expect(this.plan.plan[1]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 1,
                            file: "/.staging/0004a30b001cc468/1_000001_offset_7200000_logs-a.fklog",
                            headers: "/.staging/0004a30b001cc468/1_000001_headers_logs-a.fklog",
                            downloading: 1000000,
                            offset: 7200000,
                            length: 1000000
                        }
                    });
                });
            });

            describe("conditional tail configuration", () => {
                const TailConfiguration = [
                    {
                        fileId: 1,
                        tail: 1000000,
                        offset: 0,
                        length: 0,
                        condition: (file, others) => {
                            return _(others)
                                .filter(f => (f.id == 2 && f.size == 0) || f.size > file.size)
                                .some();
                        }
                    },
                    {
                        fileId: 2,
                        tail: 1000000,
                        offset: 0,
                        length: 0,
                        condition: (file, others) => {
                            return _(others)
                                .filter(f => (f.id == 1 && f.size == 0) || f.size > file.size)
                                .some();
                        }
                    }
                ];

                describe("with both empty", () => {
                    beforeEach(() => {
                        const local = [];

                        const device = [
                            {
                                id: 1,
                                version: 1,
                                size: 0,
                                name: "logs-a.fklog"
                            },
                            { id: 2, version: 1, size: 0, name: "logs-b.fklog" }
                        ];

                        this.plan = generateDownloadPlan(TailConfiguration, makeLocal(local), makeDevice(device));
                    });

                    it("should download nothing", () => {
                        expect(this.plan.plan.length).toEqual(0);
                    });
                });

                describe("with one empty and another with data", () => {
                    beforeEach(() => {
                        const local = [];

                        const device = [
                            {
                                id: 1,
                                version: 1,
                                size: 0,
                                name: "logs-a.fklog"
                            },
                            {
                                id: 2,
                                version: 1,
                                size: 5000000,
                                name: "logs-b.fklog"
                            }
                        ];

                        this.plan = generateDownloadPlan(TailConfiguration, makeLocal(local), makeDevice(device));
                    });

                    it("should download tail of non-empty file", () => {
                        expect(this.plan.plan[1]).toEqual({
                            download: {
                                address: DeviceAddress,
                                id: 2,
                                file: "/.staging/0004a30b001cc468/2_000001_offset_4000000_logs-b.fklog",
                                headers: "/.staging/0004a30b001cc468/2_000001_headers_logs-b.fklog",
                                downloading: 1000000,
                                offset: 4000000,
                                length: 1000000
                            }
                        });
                    });
                });

                describe("with one full and another with data", () => {
                    beforeEach(() => {
                        const local = [];

                        const device = [
                            {
                                id: 1,
                                version: 1,
                                size: 2000000,
                                name: "logs-a.fklog"
                            },
                            {
                                id: 2,
                                version: 1,
                                size: 5000000,
                                name: "logs-b.fklog"
                            }
                        ];

                        this.plan = generateDownloadPlan(TailConfiguration, makeLocal(local), makeDevice(device));
                    });

                    it("should download tail of smaller file", () => {
                        expect(this.plan.plan[1]).toEqual({
                            download: {
                                address: DeviceAddress,
                                id: 1,
                                file: "/.staging/0004a30b001cc468/1_000001_offset_1000000_logs-a.fklog",
                                headers: "/.staging/0004a30b001cc468/1_000001_headers_logs-a.fklog",
                                downloading: 1000000,
                                offset: 1000000,
                                length: 1000000
                            }
                        });
                    });
                });
            });
        });

        describe("conditional tail configuration", () => {
            const TailConfiguration = [
                {
                    fileId: 1,
                    tail: 1000000,
                    offset: 0,
                    length: 0,
                    condition: (file, others) => {
                        return _(others)
                            .filter(f => (f.id == 2 && f.size == 0) || f.size > file.size)
                            .some();
                    }
                },
                {
                    fileId: 2,
                    tail: 1000000,
                    offset: 0,
                    length: 0,
                    condition: (file, others) => {
                        return _(others)
                            .filter(f => (f.id == 1 && f.size == 0) || f.size > file.size)
                            .some();
                    }
                }
            ];

            describe("with both empty", () => {
                beforeEach(() => {
                    const local = [];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 0,
                            name: "logs-a.fklog"
                        },
                        { id: 2, version: 1, size: 0, name: "logs-b.fklog" }
                    ];

                    this.plan = generateDownloadPlan(TailConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download nothing", () => {
                    expect(this.plan.plan.length).toEqual(0);
                });
            });

            describe("with one empty and another with data", () => {
                beforeEach(() => {
                    const local = [];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 0,
                            name: "logs-a.fklog"
                        },
                        {
                            id: 2,
                            version: 1,
                            size: 5000000,
                            name: "logs-b.fklog"
                        }
                    ];

                    this.plan = generateDownloadPlan(TailConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download tail of non-empty file", () => {
                    expect(this.plan.plan[1]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 2,
                            file: "/.staging/0004a30b001cc468/2_000001_offset_4000000_logs-b.fklog",
                            headers: "/.staging/0004a30b001cc468/2_000001_headers_logs-b.fklog",
                            downloading: 1000000,
                            offset: 4000000,
                            length: 1000000
                        }
                    });
                });
            });

            describe("with one full and another with data", () => {
                beforeEach(() => {
                    const local = [];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 2000000,
                            name: "logs-a.fklog"
                        },
                        {
                            id: 2,
                            version: 1,
                            size: 5000000,
                            name: "logs-b.fklog"
                        }
                    ];

                    this.plan = generateDownloadPlan(TailConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download tail of smaller file", () => {
                    expect(this.plan.plan[1]).toEqual({
                        download: {
                            address: DeviceAddress,
                            id: 1,
                            file: "/.staging/0004a30b001cc468/1_000001_offset_1000000_logs-a.fklog",
                            headers: "/.staging/0004a30b001cc468/1_000001_headers_logs-a.fklog",
                            downloading: 1000000,
                            offset: 1000000,
                            length: 1000000
                        }
                    });
                });
            });
        });

        describe("basic resuming configuration", () => {
            const ResumingConfiguration = [
                {
                    fileId: 1,
                    tail: 0,
                    offset: 0,
                    length: 0,
                    delete: true,
                    condition: (file, others) => true
                }
            ];

            describe("with no local files", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 31000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8200000,
                            name: "logs-a.fklog"
                        },
                        { id: 4, version: 1, size: 30000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(ResumingConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download all of the files", () => {
                    expect(this.plan.plan).toEqual([
                        {
                            delete: {
                                path: "/.staging/0004a30b001cc468"
                            }
                        },
                        {
                            download: {
                                address: DeviceAddress,
                                id: 1,
                                file: "/.staging/0004a30b001cc468/1_000001_offset_0_logs-a.fklog",
                                headers: "/.staging/0004a30b001cc468/1_000001_headers_logs-a.fklog",
                                downloading: 8200000,
                                offset: 0,
                                length: 0
                            }
                        },
                        {
                            delete: {
                                address: DeviceAddress,
                                id: 1
                            }
                        },
                        {
                            rename: {
                                from: "/.staging/0004a30b001cc468",
                                to: "/0004a30b001cc468"
                            }
                        }
                    ]);
                });
            });

            describe("with existing local file of same offset and expected length", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 31000
                        },
                        {
                            name: "1_000001_offset_7200000_logs-a.fklog",
                            relativePath: "/0004a30b001cc468/1_000001_offset_7200000_logs-a.fklog",
                            size: 1000000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8200000,
                            name: "logs-a.fklog"
                        },
                        { id: 4, version: 1, size: 31000, name: "data.fk" }
                    ];

                    this.plan = generateDownloadPlan(ResumingConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download nothing", () => {
                    expect(this.plan.plan.length).toEqual(0);
                });
            });

            describe("with existing local file of another offset", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 31000
                        },
                        {
                            name: "1_000001_offset_5000000_logs-a.fklog",
                            relativePath: "/0004a30b001cc468/1_000001_offset_5000000_logs-a.fklog",
                            size: 1000000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 1,
                            size: 8200000,
                            name: "logs-a.fklog"
                        },
                        {
                            id: 4,
                            version: 1,
                            size: 31000,
                            name: "data.fk"
                        }
                    ];

                    this.plan = generateDownloadPlan(ResumingConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download remainder of the file", () => {
                    expect(this.plan.plan).toEqual([
                        {
                            delete: {
                                path: "/.staging/0004a30b001cc468"
                            }
                        },
                        {
                            download: {
                                address: DeviceAddress,
                                id: 1,
                                file: "/.staging/0004a30b001cc468/1_000001_offset_6000000_logs-a.fklog",
                                headers: "/.staging/0004a30b001cc468/1_000001_headers_logs-a.fklog",
                                downloading: 2200000,
                                offset: 6000000,
                                length: 0
                            }
                        },
                        {
                            delete: {
                                address: DeviceAddress,
                                id: 1
                            }
                        },
                        {
                            rename: {
                                from: "/.staging/0004a30b001cc468",
                                to: "/0004a30b001cc468"
                            }
                        }
                    ]);
                });
            });

            describe("with existing local file after previous file deleted", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "1_000001_offset_5000000_logs-a.fklog",
                            relativePath: "/0004a30b001cc468/1_000001_offset_0_logs-a.fklog",
                            size: 1000000
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 2,
                            size: 20000,
                            name: "logs-a.fklog"
                        }
                    ];

                    this.plan = generateDownloadPlan(ResumingConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download to a new local file", () => {
                    expect(this.plan.plan).toEqual([
                        {
                            delete: {
                                path: "/.staging/0004a30b001cc468"
                            }
                        },
                        {
                            download: {
                                address: DeviceAddress,
                                id: 1,
                                file: "/.staging/0004a30b001cc468/1_000002_offset_0_logs-a.fklog",
                                headers: "/.staging/0004a30b001cc468/1_000002_headers_logs-a.fklog",
                                downloading: 20000,
                                offset: 0,
                                length: 0
                            }
                        },
                        {
                            delete: {
                                address: DeviceAddress,
                                id: 1
                            }
                        },
                        {
                            rename: {
                                from: "/.staging/0004a30b001cc468",
                                to: "/0004a30b001cc468"
                            }
                        }
                    ]);
                });
            });

            describe("with existing local file after previous file deleted", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "1_000002_offset_0_logs-a.fklog",
                            relativePath: "/0004a30b001cc468/1_000002_offset_0_logs-a.fklog",
                            size: 20000
                        },
                        {
                            name: "1_000001_offset_5000000_logs-a.fklog",
                            relativePath: "/0004a30b001cc468/1_000001_offset_1000000_logs-a.fklog",
                            size: 0
                        }
                    ];

                    const device = [
                        {
                            id: 1,
                            version: 2,
                            size: 30000,
                            name: "logs-a.fklog"
                        }
                    ];

                    this.plan = generateDownloadPlan(ResumingConfiguration, makeLocal(local), makeDevice(device));
                });

                it("should download to a new local file", () => {
                    expect(this.plan.plan).toEqual([
                        {
                            delete: {
                                path: "/.staging/0004a30b001cc468"
                            }
                        },
                        {
                            download: {
                                address: DeviceAddress,
                                id: 1,
                                file: "/.staging/0004a30b001cc468/1_000002_offset_20000_logs-a.fklog",
                                headers: "/.staging/0004a30b001cc468/1_000002_headers_logs-a.fklog",
                                downloading: 10000,
                                offset: 20000,
                                length: 0
                            }
                        },
                        {
                            delete: {
                                address: DeviceAddress,
                                id: 1
                            }
                        },
                        {
                            rename: {
                                from: "/.staging/0004a30b001cc468",
                                to: "/0004a30b001cc468"
                            }
                        }
                    ]);
                });
            });
        });
    });

    describe("uploading planning", () => {
        describe("with no local files", () => {
            beforeEach(() => {
                this.plan = generateUploadPlan(SimpleConfiguration, makeLocal([]));
            });

            it("should generate empty plan", () => {
                expect(this.plan.plan.length).toBe(0);
            });
        });

        describe("with empty local files", () => {
            beforeEach(() => {
                const local = [
                    {
                        name: "4_000001_offset_0_data.fk",
                        relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        size: 0
                    }
                ];

                this.plan = generateUploadPlan(SimpleConfiguration, makeLocal(local));
            });

            it("should generate empty plan", () => {
                expect(this.plan.numberOfFiles).toBe(0);
                expect(this.plan.plan.length).toBe(0);
            });
        });

        describe("with local data file and metadata file", () => {
            beforeEach(() => {
                const local = [
                    {
                        name: "metadata.fkpb",
                        relativePath: "/0004a30b001cc468/metadata.fkpb",
                        size: 256
                    },
                    {
                        name: "4_000001_offset_0_data.fk",
                        relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        size: 31000
                    }
                ];

                this.plan = generateUploadPlan(SimpleConfiguration, makeLocal(local));
            });

            it("should have 2 steps", () => {
                expect(this.plan.numberOfFiles).toBe(1);
                expect(this.plan.plan.length).toBe(2);
            });

            it("should upload the file", () => {
                expect(this.plan.plan[0]).toEqual({
                    upload: {
                        metadata: "/0004a30b001cc468/metadata.fkpb",
                        file: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        uploading: 31000,
                        headers: {
                            deviceId: "0004a30b001cc468",
                            fileId: 4,
                            fileOffset: 0,
                            fileVersion: 1,
                            fileName: "data.fk",
                            uploadName: "4_000001_offset_0_data.fk"
                        }
                    }
                });
            });

            it("should archive the file at the end", () => {
                expect(this.plan.plan[1]).toEqual({
                    archive: {
                        file: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        touch: "/0004a30b001cc468/4_000001_offset_31000_data.fk"
                    }
                });
            });
        });

        describe("with local data file", () => {
            beforeEach(() => {
                const local = [
                    {
                        name: "4_000001_offset_0_data.fk",
                        relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        size: 31000
                    }
                ];

                this.plan = generateUploadPlan(SimpleConfiguration, makeLocal(local));
            });

            it("should upload the file", () => {
                expect(this.plan.plan[0]).toEqual({
                    upload: {
                        metadata: null,
                        file: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        uploading: 31000,
                        headers: {
                            deviceId: "0004a30b001cc468",
                            fileId: 4,
                            fileOffset: 0,
                            fileVersion: 1,
                            fileName: "data.fk",
                            uploadName: "4_000001_offset_0_data.fk"
                        }
                    }
                });
            });

            it("should archive the file at the end", () => {
                expect(this.plan.plan[1]).toEqual({
                    archive: {
                        file: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        touch: "/0004a30b001cc468/4_000001_offset_31000_data.fk"
                    }
                });
            });
        });

        describe("with local offset data file", () => {
            beforeEach(() => {
                const local = [
                    {
                        name: "4_000001_offset_15000_data.fk",
                        relativePath: "/0004a30b001cc468/4_000001_offset_15000_data.fk",
                        size: 30000
                    }
                ];

                this.plan = generateUploadPlan(SimpleConfiguration, makeLocal(local));
            });

            it("should upload the file", () => {
                expect(this.plan.plan[0]).toEqual({
                    upload: {
                        metadata: null,
                        file: "/0004a30b001cc468/4_000001_offset_15000_data.fk",
                        uploading: 30000,
                        headers: {
                            deviceId: "0004a30b001cc468",
                            fileId: 4,
                            fileOffset: 15000,
                            fileVersion: 1,
                            fileName: "data.fk",
                            uploadName: "4_000001_offset_15000_data.fk"
                        }
                    }
                });
            });

            it("should archive the file at the end", () => {
                expect(this.plan.plan[1]).toEqual({
                    archive: {
                        file: "/0004a30b001cc468/4_000001_offset_15000_data.fk",
                        touch: "/0004a30b001cc468/4_000001_offset_45000_data.fk"
                    }
                });
            });
        });

        describe("chunked configuration", () => {
            const ChunkedConfiguration = [
                {
                    fileId: 4,
                    chunked: 0,
                    offset: 0,
                    length: 0,
                    condition: (file, others) => true
                },
                {
                    fileId: 1,
                    chunked: 1000000,
                    offset: 0,
                    length: 0,
                    condition: (file, others) => true
                }
            ];

            describe("with local chunked file", () => {
                beforeEach(() => {
                    const local = [
                        {
                            name: "4_000001_offset_0_data.fk",
                            relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            size: 15000
                        },
                        {
                            name: "1_000001_offset_8000000_startup.log",
                            relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log",
                            size: 200000
                        }
                    ];

                    this.plan = generateUploadPlan(ChunkedConfiguration, makeLocal(local));
                });

                it("should upload the file", () => {
                    expect(this.plan.plan[0]).toEqual({
                        upload: {
                            metadata: null,
                            file: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            uploading: 15000,
                            headers: {
                                deviceId: "0004a30b001cc468",
                                fileId: 4,
                                fileOffset: 0,
                                fileVersion: 1,
                                fileName: "data.fk",
                                uploadName: "4_000001_offset_0_data.fk"
                            }
                        }
                    });
                });

                it("should archive the file at the end", () => {
                    expect(this.plan.plan[1]).toEqual({
                        archive: {
                            file: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                            touch: "/0004a30b001cc468/4_000001_offset_15000_data.fk"
                        }
                    });
                });

                it("should upload chunked file", () => {});

                it("should record upload of data file", () => {});

                it("should record upload of chunked file", () => {});
            });
        });
    });

    describe("DownloadingBackupLargerLocalFile scenario", () => {
        beforeEach(() => {
            const data = Scenarios.DownloadingBackupLargerLocalFile;
            this.download = generateDownloadPlan(Configuration, data.local, data.remote);
        });

        it("should backup the local file before downloading", () => {
            expect(this.download.plan[1].backup).toBeDefined();
            expect(this.download.plan[2].download).toBeDefined();
        });
    });

    describe.skip("DownloadingNegative scenario 1", () => {
        beforeEach(() => {
            const data = Scenarios.DownloadingNegative1;
            this.download = generateDownloadPlan(Configuration, data.local, data.remote);
        });

        it("should backup the local file before downloading", () => {
            const downloads = _(this.download.plan)
                .filter(s => _.isObject(s.download))
                .value();
            expect(downloads.length).toBe(2);
            downloads.forEach(step => {
                expect(step.download.downloading).toBeGreaterThan(0);
            });
        });
    });

    describe.skip("DownloadingNegative scenario 2", () => {
        beforeEach(() => {
            const data = Scenarios.DownloadingNegative2;
            this.download = generateDownloadPlan(Configuration, data.local, data.remote);
        });

        it("should backup the local file before downloading", () => {
            console.log(this.download.plan);
            const downloads = _(this.download.plan)
                .filter(s => _.isObject(s.download))
                .value();
            expect(downloads.length).toBe(2);
            downloads.forEach(step => {
                expect(step.download.downloading).toBeGreaterThan(0);
            });
        });
    });

    describe.skip("DownloadingNegative scenario 3", () => {
        beforeEach(() => {
            const data = Scenarios.DownloadingNegative3;
            this.download = generateDownloadPlan(Configuration, data.local, data.remote);
        });

        it("should backup the local file before downloading", () => {
            console.log(this.download.plan);
            const downloads = _(this.download.plan)
                .filter(s => _.isObject(s.download))
                .value();
            expect(downloads.length).toBe(2);
            downloads.forEach(step => {
                expect(step.download.downloading).toBeGreaterThan(0);
            });
        });
    });
});
