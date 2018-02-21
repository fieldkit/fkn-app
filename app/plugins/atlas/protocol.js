'use strict';

import protobuf from "protobufjs";

const atlasRoot = protobuf.Root.fromJSON(require("fk-atlas-protocol"));

const WireAtlasQuery = atlasRoot.lookupType("fk_atlas.WireAtlasQuery");
const WireAtlasReply = atlasRoot.lookupType("fk_atlas.WireAtlasReply");
const SensorType = atlasRoot.lookup("fk_atlas.SensorType");
const QueryType = atlasRoot.lookup("fk_atlas.QueryType");
const ReplyType = atlasRoot.lookup("fk_atlas.ReplyType");

export {
    SensorType,
    WireAtlasQuery,
    WireAtlasReply,
    QueryType,
    ReplyType
};

export function encodeWireAtlasQuery(message) {
    return WireAtlasQuery.encode(message).finish();
}

export function decodeWireAtlasReply(data) {
    return WireAtlasReply.decode(protobuf.Reader.create(data));
}

export function atlasSensorQuery(sensor, command) {
    return {
        type: QueryType.values.QUERY_ATLAS_COMMAND,
        atlasCommand : {
            sensor: sensor,
            command: command,
        }
    };
}
