export declare function isDef(value: any): boolean;
export declare function isObj(x: any): boolean;
export declare function isNumber(value: any): boolean;
export declare function range(num: number, min: number, max: number): number;
export declare function nextTick(fn: Function): void;
// @ts-ignore
export declare function getSystemInfoSync(): WechatMiniprogram.GetSystemInfoSyncResult;
export declare function addUnit(value?: string | number): string | undefined;
export declare function requestAnimationFrame(
  cb: Function
  // @ts-ignore
): void | WechatMiniprogram.NodesRef;
