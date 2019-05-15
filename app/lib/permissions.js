import _ from "lodash";
import Promise from "bluebird";

import { Platform } from "react-native";
import Permissions from "react-native-permissions";

export class AppPermissions {
    getKeys() {
        return Platform.OS === "ios" ? ["location"] : ["location", "storage"];
    }

    verifyPermissions() {
        const keys = this.getKeys();
        return Permissions.checkMultiple(keys)
            .then(permissions => {
                console.log("Permissions before", permissions);
                return _(permissions)
                    .map((value, key) => {
                        return {
                            name: key,
                            status: value
                        };
                    })
                    .reduce((promise, permission) => {
                        return promise.then(() => {
                            if (permission.status == "undetermined") {
                                return Permissions.request(permission.name);
                            }
                            return {};
                        });
                    }, Promise.resolve({}));
            })
            .then(() => {
                return Permissions.checkMultiple(keys);
            })
            .then(permissions => {
                console.log("Permissions after", permissions);
            });
    }
}
