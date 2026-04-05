export type MatrixVerificationMethod = "sas" | "show-qr" | "scan-qr";
export type MatrixVerificationSummary = {
    id: string;
    transactionId?: string;
    roomId?: string;
    otherUserId: string;
    otherDeviceId?: string;
    isSelfVerification: boolean;
    initiatedByMe: boolean;
    phase: number;
    phaseName: string;
    pending: boolean;
    methods: string[];
    chosenMethod?: string | null;
    canAccept: boolean;
    hasSas: boolean;
    sas?: {
        decimal?: [number, number, number];
        emoji?: Array<[string, string]>;
    };
    hasReciprocateQr: boolean;
    completed: boolean;
    error?: string;
    createdAt: string;
    updatedAt: string;
};
type MatrixVerificationSummaryListener = (summary: MatrixVerificationSummary) => void;
export type MatrixShowSasCallbacks = {
    sas: {
        decimal?: [number, number, number];
        emoji?: Array<[string, string]>;
    };
    confirm: () => Promise<void>;
    mismatch: () => void;
    cancel: () => void;
};
export type MatrixShowQrCodeCallbacks = {
    confirm: () => void;
    cancel: () => void;
};
export type MatrixVerifierLike = {
    verify: () => Promise<void>;
    cancel: (e: Error) => void;
    getShowSasCallbacks: () => MatrixShowSasCallbacks | null;
    getReciprocateQrCodeCallbacks: () => MatrixShowQrCodeCallbacks | null;
    on: (eventName: string, listener: (...args: unknown[]) => void) => void;
};
export type MatrixVerificationRequestLike = {
    transactionId?: string;
    roomId?: string;
    initiatedByMe: boolean;
    otherUserId: string;
    otherDeviceId?: string;
    isSelfVerification: boolean;
    phase: number;
    pending: boolean;
    accepting: boolean;
    declining: boolean;
    methods: string[];
    chosenMethod?: string | null;
    cancellationCode?: string | null;
    accept: () => Promise<void>;
    cancel: (params?: {
        reason?: string;
        code?: string;
    }) => Promise<void>;
    startVerification: (method: string) => Promise<MatrixVerifierLike>;
    scanQRCode: (qrCodeData: Uint8ClampedArray) => Promise<MatrixVerifierLike>;
    generateQRCode: () => Promise<Uint8ClampedArray | undefined>;
    verifier?: MatrixVerifierLike;
    on: (eventName: string, listener: (...args: unknown[]) => void) => void;
};
export type MatrixVerificationCryptoApi = {
    requestOwnUserVerification: () => Promise<unknown | null>;
    findVerificationRequestDMInProgress?: (roomId: string, userId: string) => MatrixVerificationRequestLike | undefined;
    requestDeviceVerification?: (userId: string, deviceId: string) => Promise<MatrixVerificationRequestLike>;
    requestVerificationDM?: (userId: string, roomId: string) => Promise<MatrixVerificationRequestLike>;
};
export declare class MatrixVerificationManager {
    private readonly verificationSessions;
    private verificationSessionCounter;
    private readonly trackedVerificationRequests;
    private readonly trackedVerificationVerifiers;
    private readonly summaryListeners;
    private readRequestValue;
    private pruneVerificationSessions;
    private getVerificationPhaseName;
    private emitVerificationSummary;
    private touchVerificationSession;
    private clearSasAutoConfirmTimer;
    private buildVerificationSummary;
    private findVerificationSession;
    private ensureVerificationRequestTracked;
    private maybeAutoAcceptInboundRequest;
    private maybeAutoStartInboundSas;
    private attachVerifierToVerificationSession;
    private maybeAutoConfirmSas;
    private ensureVerificationStarted;
    onSummaryChanged(listener: MatrixVerificationSummaryListener): () => void;
    trackVerificationRequest(request: MatrixVerificationRequestLike): MatrixVerificationSummary;
    requestOwnUserVerification(crypto: MatrixVerificationCryptoApi | undefined): Promise<MatrixVerificationSummary | null>;
    listVerifications(): MatrixVerificationSummary[];
    requestVerification(crypto: MatrixVerificationCryptoApi | undefined, params: {
        ownUser?: boolean;
        userId?: string;
        deviceId?: string;
        roomId?: string;
    }): Promise<MatrixVerificationSummary>;
    acceptVerification(id: string): Promise<MatrixVerificationSummary>;
    cancelVerification(id: string, params?: {
        reason?: string;
        code?: string;
    }): Promise<MatrixVerificationSummary>;
    startVerification(id: string, method?: MatrixVerificationMethod): Promise<MatrixVerificationSummary>;
    generateVerificationQr(id: string): Promise<{
        qrDataBase64: string;
    }>;
    scanVerificationQr(id: string, qrDataBase64: string): Promise<MatrixVerificationSummary>;
    confirmVerificationSas(id: string): Promise<MatrixVerificationSummary>;
    mismatchVerificationSas(id: string): MatrixVerificationSummary;
    confirmVerificationReciprocateQr(id: string): MatrixVerificationSummary;
    getVerificationSas(id: string): {
        decimal?: [number, number, number];
        emoji?: Array<[string, string]>;
    };
}
export {};
