import { sendMessageSlack as sendMessageSlackImpl } from "../../plugin-sdk/slack.js";
export declare const runtimeSend: {
    sendMessage: typeof sendMessageSlackImpl;
};
