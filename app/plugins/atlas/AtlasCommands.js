export class AtlasCommands {
    getCommands(temperature) {
        return this.getNoopCommands();

        return {
            Ph: {
                CalibrateLow: "Cal,low,4",
                CalibrateMid: "Cal,mid,7",
                CalibrateHigh: "Cal,high,10",
            },
            Ec: {
                CalibrateDry: "Cal,dry",
                CalibrateLow: "Cal,low,1413",
                CalibrateHigh: "Cal,low,12880",
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

    getNoopCommands(temperature) {
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
                Calibrate: "0",
            },
            Temperature: {
                Calibrate: "0",
            }
        };
    }
}

