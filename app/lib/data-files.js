import _ from "lodash";
import protobuf from "protobufjs";

import { base64ToArrayBuffer } from "../lib/base64";
import { DataRecord } from "../lib/protocol";

function toByteArray(byteArrayOrString) {
    if (_.isString(byteArrayOrString)) {
        return base64ToArrayBuffer(byteArrayOrString);
    }
    return byteArrayOrString;
}

export function readDataRecords(byteArrayOrString, filter) {
    const records = [];
    const byteArray = toByteArray(byteArrayOrString);
    const reader = protobuf.Reader.create(byteArray);
    let index = 0;
    while (reader.pos < reader.len) {
        try {
            const record = DataRecord.decodeDelimited(reader);
            if (filter(record)) {
                record.index = index++;
                records.unshift(record);
            }
        } catch (e) {
            console.log(e);
            break;
        }
    }

    return records;
}

export function readAllDataRecords(byteArrayOrString) {
    return readDataRecords(byteArrayOrString, r => true);
}

export function readLoggedReadings(byteArrayOrString) {
    return readDataRecords(byteArrayOrString, r => r.loggedReading != null);
}
