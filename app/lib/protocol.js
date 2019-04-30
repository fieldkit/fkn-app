"use strict";

import protobuf from "protobufjs";

const appRoot = protobuf.Root.fromJSON(require("fk-app-protocol"));
const WireMessageQuery = appRoot.lookupType("fk_app.WireMessageQuery");
const WireMessageReply = appRoot.lookupType("fk_app.WireMessageReply");
const QueryType = appRoot.lookup("fk_app.QueryType");
const ReplyType = appRoot.lookup("fk_app.ReplyType");

export { WireMessageQuery, WireMessageReply, QueryType, ReplyType };

const dataRoot = protobuf.Root.fromJSON(require("fk-data-protocol"));
const DataRecord = dataRoot.lookup("fk_data.DataRecord");

export { DataRecord };
