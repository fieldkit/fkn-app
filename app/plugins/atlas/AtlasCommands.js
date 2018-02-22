export class AtlasCommands {
    getCommands(temperature, probeType) {
        this.getDefaultCommands(temperature, probeType);
        return this.getNoopCommands(temperature, probeType);
    }

    getDefaultCommands(temperature, probeType) {
        const ec = this.getEcCalibration(temperature, probeType);
        console.log(temperature, probeType, ec);
        return {
            Ph: {
                CalibrateLow: "Cal,low,4",
                CalibrateMid: "Cal,mid,7",
                CalibrateHigh: "Cal,high,10",
            },
            Ec: {
                CalibrateDry: "Cal,dry",
                CalibrateLow: "Cal,low," + ec[0],
                CalibrateHigh: "Cal,high," + ec[1],
                SetProbe: {
                    "0.1": "K,0.1",
                    "1": "K,1",
                    "10": "K,10",
                }
            },
            Do: {
                CalibrateDry: "Cal",
                CalibrateWet: "Cal,0",
            },
            Orp: {
                Calibrate: "Cal,225",
            },
            Temperature: {
                Calibrate: "Cal,100",
            }
        };
    }

    getNoopCommands(temperature, probeType) {
        return {
            Ph: {
                CalibrateLow: "I",
                CalibrateMid: "I",
                CalibrateHigh: "I",
            },
            Ec: {
                CalibrateDry: "I",
                CalibrateLow: "I",
                CalibrateHigh: "I",
                SetProbe: "I",
            },
            Do: {
                CalibrateDry: "I",
                CalibrateWet: "I",
            },
            Orp: {
                Calibrate: "I",
            },
            Temperature: {
                Calibrate: "I",
            }
        };
    }

    getEcCalibration(temperature, probeType) {
        const chartsFromSolutionBottles = {
            5:  [0,  896,  8220,  53500, 0 ],
            10: [0, 1020,  9330,  59600, 0 ],
            15: [0, 1147, 10480,  65400, 0 ],
            20: [0, 1278, 11670,  72400, 0 ],
            25: [0, 1413, 12880,  80000, 0 ],
            30: [0, 1548, 14120,  88200, 0 ],
            35: [0, 1711, 15550,  96400, 0 ],
            40: [0, 1860, 16880, 104600, 0 ],
            45: [0, 2009, 18210, 112800, 0 ],
            50: [0, 2158, 19550, 121000, 0 ],
        };
        const compensated = chartsFromSolutionBottles[temperature];
        switch (probeType) {
        case "0.1": return [compensated[0], compensated[1]];
        case   "1": return [compensated[2], compensated[3]];
        case  "10": return [compensated[3], compensated[4]];
        }
        throw new Error("No such probeType: " + probeType);
    }
}

