import { generateDownloadPlan, generateUploadPlan } from './synchronizing';

describe('synchronizing', () => {
    function makeLocal(files) {
        return files;
    }

    function makeDevice(files) {
        return {
            deviceId: '0004a30b001cc468',
            files: files
        };
    }

    describe('download planning', () => {
        describe('with empty remote files', () => {
            beforeEach(() => {
                const device = [
                    { id: 1, version: 1, size: 0, name: "startup.log" },
                    { id: 2, version: 1, size: 0, name: "now.log" },
                    { id: 3, version: 1, size: 0, name: "emergency.log" },
                    { id: 4, version: 1, size: 0, name: "data.fk" },
                ];

                this.plan = generateDownloadPlan([], makeDevice(device));
            });

            it('should generate empty plan', () => {
                expect(this.plan.plan.length).toBe(0);
            });
        });

        describe('with no local files', () => {
            beforeEach(() => {
                const device = [
                    { id: 1, version: 1, size: 8100000, name: "startup.log" },
                    { id: 2, version: 1, size: 0, name: "now.log" },
                    { id: 3, version: 1, size: 0, name: "emergency.log" },
                    { id: 4, version: 1, size: 15000, name: "data.fk" },
                ];

                this.plan = generateDownloadPlan(makeLocal([]), makeDevice(device));
            });

            it("should download entire data file", () => {
                expect(this.plan.plan[0]).toEqual({
                    download: {
                        id: 4,
                        file: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        offset: 0,
                        length: 0
                    }
                });
            });

            it("should download last chunk of log", () => {
                expect(this.plan.plan[1]).toEqual({
                    download: {
                        id: 1,
                        file: "/0004a30b001cc468/1_000001_offset_8000000_startup.log",
                        offset: 8000000,
                        length: 100000
                    }
                });
            });
        });

        describe('with local data file that has a non-zero offset', () => {
            beforeEach(() => {
                const local = [
                    { name: "4_000001_offset_15000_data.fk", relativePath: "/0004a30b001cc468/4_000001_offset_15000_data.fk", size: 0 },
                    { name: "1_000001_offset_8000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log", size: 100000 },
                ];

                const device = [
                    { id: 1, version: 1, size: 8100000, name: "startup.log" },
                    { id: 2, version: 1, size: 0, name: "now.log" },
                    { id: 3, version: 1, size: 0, name: "emergency.log" },
                    { id: 4, version: 1, size: 30000, name: "data.fk" },
                ];

                this.plan = generateDownloadPlan(makeLocal(local), makeDevice(device));
            });

            it("should resume data file", () => {
                expect(this.plan.plan[0]).toEqual({
                    download: {
                        id: 4,
                        file: "/0004a30b001cc468/4_000001_offset_15000_data.fk",
                        offset: 15000,
                        length: 0
                    }
                });
            });

            it("should download last chunk of log", () => {
                expect(this.plan.plan[1]).toEqual({
                    download: {
                        id: 1,
                        file: "/0004a30b001cc468/1_000001_offset_7000000_startup.log",
                        offset: 7000000,
                        length: 1000000
                    }
                });
            });
        });

        describe('with local files of an older version', () => {
            beforeEach(() => {
                const local = [
                    { name: "4_000001_offset_0_data.fk", relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk", size: 15000 },
                    { name: "1_000001_offset_8000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log", size: 100000 },
                ];

                const device = [
                    { id: 1, version: 2, size: 8100000, name: "startup.log" },
                    { id: 2, version: 2, size: 0, name: "now.log" },
                    { id: 3, version: 2, size: 0, name: "emergency.log" },
                    { id: 4, version: 2, size: 15000, name: "data.fk" },
                ];

                this.plan = generateDownloadPlan(makeLocal(local), makeDevice(device));
            });

            it("should download entire data file", () => {
                expect(this.plan.plan[0]).toEqual({
                    download: {
                        id: 4,
                        file: "/0004a30b001cc468/4_000002_offset_0_data.fk",
                        offset: 0,
                        length: 0
                    }
                });
            });

            it("should download last chunk of log", () => {
                expect(this.plan.plan[1]).toEqual({
                    download: {
                        id: 1,
                        file: "/0004a30b001cc468/1_000002_offset_8000000_startup.log",
                        offset: 8000000,
                        length: 100000
                    }
                });
            });
        });

        describe('with local files from a good previous download and a larger last chunk ', () => {
            beforeEach(() => {
                const local = [
                    { name: "4_000001_offset_0_data.fk", relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk", size: 15000 },
                    { name: "1_000001_offset_8000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log", size: 100000 },
                ];

                const device = [
                    { id: 1, version: 1, size: 8200000, name: "startup.log" },
                    { id: 2, version: 1, size: 0, name: "now.log" },
                    { id: 3, version: 1, size: 0, name: "emergency.log" },
                    { id: 4, version: 1, size: 30000, name: "data.fk" },
                ];

                this.plan = generateDownloadPlan(makeLocal(local), makeDevice(device));
            });

            it("should resume data file", () => {
                expect(this.plan.plan[0]).toEqual({
                    download: {
                        id: 4,
                        file: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        offset: 15000,
                        length: 0
                    }
                });
            });

            it("should resume last chunk of log", () => {
                expect(this.plan.plan[1]).toEqual({
                    download: {
                        id: 1,
                        file: "/0004a30b001cc468/1_000001_offset_8000000_startup.log",
                        offset: 8100000,
                        length: 100000
                    }
                });
            });

            it("should download next to last chunk of log", () => {
                expect(this.plan.plan[2]).toEqual({
                    download: {
                        id: 1,
                        file: "/0004a30b001cc468/1_000001_offset_7000000_startup.log",
                        offset: 7000000,
                        length: 1000000
                    }
                });
            });
        });

        describe('with local files from a good previous download and a complete last chunk ', () => {
            beforeEach(() => {
                const local = [
                    { name: "4_000001_offset_0_data.fk", relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk", size: 15000 },
                    { name: "1_000001_offset_8000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log", size: 200000 },
                ];

                const device = [
                    { id: 1, version: 1, size: 8200000, name: "startup.log" },
                    { id: 2, version: 1, size: 0, name: "now.log" },
                    { id: 3, version: 1, size: 0, name: "emergency.log" },
                    { id: 4, version: 1, size: 30000, name: "data.fk" },
                ];

                this.plan = generateDownloadPlan(makeLocal(local), makeDevice(device));
            });

            it("should resume data file", () => {
                expect(this.plan.plan[0]).toEqual({
                    download: {
                        id: 4,
                        file: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        offset: 15000,
                        length: 0
                    }
                });
            });

            it("should download next to last chunk of log", () => {
                expect(this.plan.plan[1]).toEqual({
                    download: {
                        id: 1,
                        file: "/0004a30b001cc468/1_000001_offset_7000000_startup.log",
                        offset: 7000000,
                        length: 1000000
                    }
                });
            });
        });

        describe('with completed next to last chunk', () => {
            beforeEach(() => {
                const local = [
                    { name: "4_000001_offset_0_data.fk", relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk", size: 30000 },
                    { name: "1_000001_offset_8000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log", size: 200000 },
                    { name: "1_000001_offset_7000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_7000000_startup.log", size: 1000000 },
                ];

                const device = [
                    { id: 1, version: 1, size: 8200000, name: "startup.log" },
                    { id: 4, version: 1, size: 30000, name: "data.fk" },
                ];

                this.plan = generateDownloadPlan(makeLocal(local), makeDevice(device));
            });

            it('should download the chunk before', () => {
                expect(this.plan.plan[0]).toEqual({
                    download: {
                        id: 1,
                        file: "/0004a30b001cc468/1_000001_offset_6000000_startup.log",
                        offset: 6000000,
                        length: 1000000
                    }
                });
            });
        });

        describe('with local file larger than device file', () => {
            beforeEach(() => {
                const local = [
                    { name: "4_000001_offset_0_data.fk", relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk", size: 31000 },
                    { name: "1_000001_offset_8000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_8000000_startup.log", size: 200000 },
                ];

                const device = [
                    { id: 1, version: 1, size: 8200000, name: "startup.log" },
                    { id: 4, version: 1, size: 30000, name: "data.fk" },
                ];

                this.plan = generateDownloadPlan(makeLocal(local), makeDevice(device));
            });

            it('should archive backup local file', () => {
                expect(this.plan.plan[0]).toEqual({
                    backup: {
                        file: "/0004a30b001cc468/4_000001_offset_0_data.fk"
                    }
                });
            });

            it('should download entire data file', () => {
                expect(this.plan.plan[1]).toEqual({
                    download: {
                        id: 4,
                        file: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        offset: 0,
                        length: 0
                    }
                });
            });
        });
    });

    describe('uploading planning', () => {
        describe('with no local files', () => {
            beforeEach(() => {
                this.plan = generateUploadPlan(makeLocal([]));
            });

            it('should generate empty plan', () => {
                expect(this.plan.plan.length).toBe(0);
            });
        });

        describe('with empty local files', () => {
            beforeEach(() => {
                const local = [
                    { name: "4_000001_offset_0_data.fk", relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk", size: 0 },
                ];

                this.plan = generateUploadPlan(makeLocal(local));
            });

            it('should generate empty plan', () => {
                expect(this.plan.plan.length).toBe(0);
            });
        });

        describe('with local data file', () => {
            beforeEach(() => {
                const local = [
                    { name: "4_000001_offset_0_data.fk", relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk", size: 31000 },
                ];

                this.plan = generateUploadPlan(makeLocal(local));
            });

            it('should upload the file', () => {
                expect(this.plan.plan[0]).toEqual({
                    upload: {
                        file: "/0004a30b001cc468/4_000001_offset_0_data.fk"
                    }
                });
            });

            it('should archive the file at the end', () => {
                expect(this.plan.plan[1]).toEqual({
                    archive: {
                        file: "/0004a30b001cc468/4_000001_offset_0_data.fk",
                        touch: "/0004a30b001cc468/4_000001_offset_31000_data.fk"
                    }
                });
            });
        });
    });
});
