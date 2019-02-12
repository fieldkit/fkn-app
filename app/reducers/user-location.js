import * as ActionTypes from "../actions/types";

//suppiles the initial state
export function giveUserLocation(state = {}, action) {
  console.log("calling reducer");
  switch (action.type) {
    case ActionTypes.PHONE_LOC: {
      return action;
    }
  }
  return state;
  // navigator.geolocation.getCurrentPosition (position) => {
  //     var latitude: position.coords.latitude,
  //     var longitude:
  // }
  // switch(action.type) {
  //     case "PhoneLoc":
  //         return{
  //             latitude: [],
  //             longitude: [],
  //         }
  // }
}
