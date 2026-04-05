import type { ImageDescriptionRequest, ImageDescriptionResult, ImagesDescriptionRequest, ImagesDescriptionResult } from "./types.js";
export declare function describeImagesWithModel(params: ImagesDescriptionRequest): Promise<ImagesDescriptionResult>;
export declare function describeImageWithModel(params: ImageDescriptionRequest): Promise<ImageDescriptionResult>;
