import { IWidgetApiResponse, IWidgetApiResponseData } from "./IWidgetApiResponse";
/**
 * The format of errors returned by Matrix API requests
 * made by a WidgetDriver.
 */
export interface IMatrixApiError {
    /** The HTTP status code of the associated request. */
    http_status: number;
    /** Any HTTP response headers that are relevant to the error. */
    http_headers: {
        [name: string]: string;
    };
    /** The URL of the failed request. */
    url: string;
    /** @see {@link https://spec.matrix.org/latest/client-server-api/#standard-error-response} */
    response: {
        errcode: string;
        error: string;
    } & IWidgetApiResponseData;
}
export interface IWidgetApiErrorResponseDataDetails {
    /** Set if the error came from a Matrix API request made by a widget driver */
    matrix_api_error?: IMatrixApiError;
}
export interface IWidgetApiErrorResponseData extends IWidgetApiResponseData {
    error: {
        /** A user-friendly string describing the error */
        message: string;
    } & IWidgetApiErrorResponseDataDetails;
}
export interface IWidgetApiErrorResponse extends IWidgetApiResponse {
    response: IWidgetApiErrorResponseData;
}
export declare function isErrorResponse(responseData: IWidgetApiResponseData): responseData is IWidgetApiErrorResponseData;
