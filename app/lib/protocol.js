'use strict';

import protobuf from "protobufjs";

const root = protobuf.Root.fromJSON(require("fk-app-protocol"));
const WireMessageQuery = root.lookupType("fk_app.WireMessageQuery");
const WireMessageReply = root.lookupType("fk_app.WireMessageReply");
const QueryType = root.lookup("fk_app.QueryType");

export {
    WireMessageQuery,
    WireMessageReply,
    QueryType
};
