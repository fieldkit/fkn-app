import Config from "../config";

import Toast from "react-native-simple-toast";

export const Toasts = {
    show: message => {
        Toast.show(message);
    }
};
