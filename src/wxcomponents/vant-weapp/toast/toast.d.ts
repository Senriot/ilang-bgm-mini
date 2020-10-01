declare type ToastMessage = string | number;
interface ToastOptions {
    show?: boolean;
    type?: string;
    mask?: boolean;
    zIndex?: number;
    // @ts-ignore
    context?: WechatMiniprogram.Component.TrivialInstance | WechatMiniprogram.Page.TrivialInstance;
    position?: string;
    duration?: number;
    selector?: string;
    forbidClick?: boolean;
    loadingType?: string;
    message?: ToastMessage;
    onClose?: () => void;
}
// @ts-ignore
declare function Toast(toastOptions: ToastOptions | ToastMessage): WechatMiniprogram.Component.TrivialInstance;
declare namespace Toast {
    // @ts-ignore
    var loading: (options: string | number | ToastOptions) => WechatMiniprogram.Component.Instance<Record<string, any>, Record<string, any>, Record<string, any>>;
    // @ts-ignore
    var success: (options: string | number | ToastOptions) => WechatMiniprogram.Component.Instance<Record<string, any>, Record<string, any>, Record<string, any>>;
    // @ts-ignore
    var fail: (options: string | number | ToastOptions) => WechatMiniprogram.Component.Instance<Record<string, any>, Record<string, any>, Record<string, any>>;
    var clear: () => void;
    var setDefaultOptions: (options: ToastOptions) => void;
    var resetDefaultOptions: () => void;
}
export default Toast;
