import _ from "lodash";

import * as Types from "./types";

export function executePlan(plan) {
    return {
        type: Types.PLAN_EXECUTE,
        plan: plan
    };
}
