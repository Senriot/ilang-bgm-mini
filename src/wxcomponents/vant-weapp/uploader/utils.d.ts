interface File {
  path: string;
  url: string;
  size: number;
  name: string;
  type: string;
  time: number;
  image: boolean;
}
export declare function isImageFile(item: File): boolean;
// @ts-ignore
export declare function isVideo(
  res: any,
  accept: string
  // @ts-ignore
): res is WechatMiniprogram.ChooseVideoSuccessCallbackResult;
export declare function chooseFile({
  accept,
  multiple,
  capture,
  compressed,
  maxDuration,
  sizeType,
  camera,
  maxCount,
}: {
  accept: any;
  multiple: any;
  capture: any;
  compressed: any;
  maxDuration: any;
  sizeType: any;
  camera: any;
  maxCount: any;
}): Promise<
    // @ts-ignore
  | WechatMiniprogram.ChooseImageSuccessCallbackResult
    // @ts-ignore
  | WechatMiniprogram.ChooseMediaSuccessCallbackResult
    // @ts-ignore
  | WechatMiniprogram.ChooseVideoSuccessCallbackResult
    // @ts-ignore
  | WechatMiniprogram.ChooseMessageFileSuccessCallbackResult
>;
export declare function isFunction(val: unknown): val is Function;
export declare function isObject(val: any): val is Record<any, any>;
export declare function isPromise<T = any>(val: unknown): val is Promise<T>;
export {};
