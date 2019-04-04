import * as Types from "./types";

export function location() {
    return dispatch => {
        global.navigator.geolocation.getCurrentPosition(position => {
            dispatch({
                type: Types.PHONE_LOC,
                lat: position.coords.latitude,
                long: position.coords.longitude
            });
        });
    };
}
//
// export function sensorLocation() {
//   return dispatch => {
//     navigator.geolocation.getCurrentPosition(position => {
//       console.log(position);
//       dispatch({
//         type: Types.SENSOR_LOC,
//         lat: position.coords.latitude,
//         long: position.coords.longitude
//       });
//     });
//   };
// }
