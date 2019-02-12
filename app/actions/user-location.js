import * as Types from "./types";

export function userLocation() {
  return dispatch => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      dispatch({
        type: Types.PHONE_LOC,
        lat: position.coords.latitude,
        long: position.coords.longitude
      });
    });
  };
}
