import * as ActionTypes from "../actions/types";

//suppiles the initial state
export function giveLocation(state = {}, action) {
  console.log("calling reducer");
  switch (action.type) {
    case ActionTypes.PHONE_LOC: {
      return {
        phone: action,
        sensors: [[-119, 36], [-120, 37], [-118, 34]],
        route: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [[-119, 36], [-120, 37]]
              }
            }
          ]
        }
      };
    }
  }
  return state;
}
