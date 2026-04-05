export interface IToDeviceMessage {
    content: Record<string, unknown>;
    sender: string;
    type: string;
}
