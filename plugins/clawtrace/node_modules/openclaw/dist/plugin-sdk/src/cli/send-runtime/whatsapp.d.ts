import { sendMessageWhatsApp as sendMessageWhatsAppImpl } from "../../plugins/runtime/runtime-whatsapp-boundary.js";
export declare const runtimeSend: {
    sendMessage: typeof sendMessageWhatsAppImpl;
};
