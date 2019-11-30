import {message} from "antd";

export default class Util {
   static showErrorMessage = (mess, duration) => {
        message.error(mess, duration);
        message.error(mess, duration);
    };
   static showSuccessMessage = (mess, duration) => {
        message.success(mess, duration);
        message.success(mess, duration);
    };
}