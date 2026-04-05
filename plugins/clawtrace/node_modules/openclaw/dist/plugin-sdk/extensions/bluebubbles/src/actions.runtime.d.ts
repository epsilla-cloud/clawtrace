import { sendBlueBubblesAttachment as sendBlueBubblesAttachmentImpl } from "./attachments.js";
import { addBlueBubblesParticipant as addBlueBubblesParticipantImpl, editBlueBubblesMessage as editBlueBubblesMessageImpl, leaveBlueBubblesChat as leaveBlueBubblesChatImpl, removeBlueBubblesParticipant as removeBlueBubblesParticipantImpl, renameBlueBubblesChat as renameBlueBubblesChatImpl, setGroupIconBlueBubbles as setGroupIconBlueBubblesImpl, unsendBlueBubblesMessage as unsendBlueBubblesMessageImpl } from "./chat.js";
import { resolveBlueBubblesMessageId as resolveBlueBubblesMessageIdImpl } from "./monitor.js";
import { sendBlueBubblesReaction as sendBlueBubblesReactionImpl } from "./reactions.js";
import { resolveChatGuidForTarget as resolveChatGuidForTargetImpl, sendMessageBlueBubbles as sendMessageBlueBubblesImpl } from "./send.js";
export declare const blueBubblesActionsRuntime: {
    sendBlueBubblesAttachment: typeof sendBlueBubblesAttachmentImpl;
    addBlueBubblesParticipant: typeof addBlueBubblesParticipantImpl;
    editBlueBubblesMessage: typeof editBlueBubblesMessageImpl;
    leaveBlueBubblesChat: typeof leaveBlueBubblesChatImpl;
    removeBlueBubblesParticipant: typeof removeBlueBubblesParticipantImpl;
    renameBlueBubblesChat: typeof renameBlueBubblesChatImpl;
    setGroupIconBlueBubbles: typeof setGroupIconBlueBubblesImpl;
    unsendBlueBubblesMessage: typeof unsendBlueBubblesMessageImpl;
    resolveBlueBubblesMessageId: typeof resolveBlueBubblesMessageIdImpl;
    sendBlueBubblesReaction: typeof sendBlueBubblesReactionImpl;
    resolveChatGuidForTarget: typeof resolveChatGuidForTargetImpl;
    sendMessageBlueBubbles: typeof sendMessageBlueBubblesImpl;
};
