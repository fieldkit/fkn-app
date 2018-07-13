import { generateDownloadPlan } from './file-comparisons';

describe('download plan specs', () => {
    describe('with no local files', () => {
        beforeEach(() => {
            const device = [
                { id: 1, version: 1, size: 8100000, name: "startup.log" },
                { id: 2, version: 1, size: 0, name: "now.log" },
                { id: 3, version: 1, size: 0, name: "emergency.log" },
                { id: 4, version: 1, size: 15000, name: "data.fk" },
            ];

            this.plan = generateDownloadPlan([], device);
        });

        it("should download entire data file", () => {
            expect(this.plan.plan[0]).toEqual({
                download: {
                    id: 4,
                    file: "4_000001_offset_0_data.fk",
                    offset: 0,
                    length: 0
                }
            });
        });

        it("should download last chunk of log", () => {
            expect(this.plan.plan[1]).toEqual({
                download: {
                    id: 1,
                    file: "1_000001_offset_8000000_startup.log",
                    offset: 8000000,
                    length: 100000
                }
            });
        });
    });

    describe('with local files of and older version', () => {
        beforeEach(() => {
            const local = [
                { name: "4_000001_offset_0_data.fk", relativePath: "/0004a30b001cc468/4_000001_offset_0_data.fk", size: 15000 },
                { name: "1_000001_offset_8000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_0_startup.log", size: 100000 },
            ];

            const device = [
                { id: 1, version: 2, size: 8100000, name: "startup.log" },
                { id: 2, version: 2, size: 0, name: "now.log" },
                { id: 3, version: 2, size: 0, name: "emergency.log" },
                { id: 4, version: 2, size: 15000, name: "data.fk" },
            ];

            this.plan = generateDownloadPlan(local, device);
        });

        it("should download entire data file", () => {
            expect(this.plan.plan[0]).toEqual({
                download: {
                    id: 4,
                    file: "4_000002_offset_0_data.fk",
                    offset: 0,
                    length: 0
                }
            });
        });

        it("should download last chunk of log", () => {
            expect(this.plan.plan[1]).toEqual({
                download: {
                    id: 1,
                    file: "1_000002_offset_8000000_startup.log",
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
                { name: "1_000001_offset_8000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_0_startup.log", size: 100000 },
            ];

            const device = [
                { id: 1, version: 1, size: 8200000, name: "startup.log" },
                { id: 2, version: 1, size: 0, name: "now.log" },
                { id: 3, version: 1, size: 0, name: "emergency.log" },
                { id: 4, version: 1, size: 30000, name: "data.fk" },
            ];

            this.plan = generateDownloadPlan(local, device);
        });

        it("should resume data file", () => {
            expect(this.plan.plan[0]).toEqual({
                download: {
                    id: 4,
                    file: "4_000001_offset_0_data.fk",
                    offset: 15000,
                    length: 0
                }
            });
        });

        it("should resume last chunk of log", () => {
            expect(this.plan.plan[1]).toEqual({
                download: {
                    id: 1,
                    file: "1_000001_offset_8000000_startup.log",
                    offset: 8100000,
                    length: 100000
                }
            });
        });

        it("should download next to last chunk of log", () => {
            expect(this.plan.plan[2]).toEqual({
                download: {
                    id: 1,
                    file: "1_000001_offset_7000000_startup.log",
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
                { name: "1_000001_offset_8000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_0_startup.log", size: 200000 },
            ];

            const device = [
                { id: 1, version: 1, size: 8200000, name: "startup.log" },
                { id: 2, version: 1, size: 0, name: "now.log" },
                { id: 3, version: 1, size: 0, name: "emergency.log" },
                { id: 4, version: 1, size: 30000, name: "data.fk" },
            ];

            this.plan = generateDownloadPlan(local, device);
        });

        it("should resume data file", () => {
            expect(this.plan.plan[0]).toEqual({
                download: {
                    id: 4,
                    file: "4_000001_offset_0_data.fk",
                    offset: 15000,
                    length: 0
                }
            });
        });

        it("should download next to last chunk of log", () => {
            expect(this.plan.plan[1]).toEqual({
                download: {
                    id: 1,
                    file: "1_000001_offset_7000000_startup.log",
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
                { name: "1_000001_offset_8000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_0_startup.log", size: 200000 },
                { name: "1_000001_offset_7000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_0_startup.log", size: 1000000 },
            ];

            const device = [
                { id: 1, version: 1, size: 8200000, name: "startup.log" },
                { id: 4, version: 1, size: 30000, name: "data.fk" },
            ];

            this.plan = generateDownloadPlan(local, device);
        });

        it('should download the chunk before', () => {
            expect(this.plan.plan[0]).toEqual({
                download: {
                    id: 1,
                    file: "1_000001_offset_6000000_startup.log",
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
                { name: "1_000001_offset_8000000_startup.log", relativePath: "/0004a30b001cc468/1_000001_offset_0_startup.log", size: 200000 },
            ];

            const device = [
                { id: 1, version: 1, size: 8200000, name: "startup.log" },
                { id: 4, version: 1, size: 30000, name: "data.fk" },
            ];

            this.plan = generateDownloadPlan(local, device);
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
                    file: "4_000001_offset_0_data.fk",
                    offset: 0,
                    length: 0
                }
            });
        });
    });
});
