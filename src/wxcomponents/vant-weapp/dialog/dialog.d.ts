declare type DialogAction = 'confirm' | 'cancel';
declare type DialogOptions = {
  lang?: string;
  show?: boolean;
  title?: string;
  width?: string | number;
  zIndex?: number;
  theme?: string;

  context?:
  // @ts-ignore
    | WechatMiniprogram.Page.TrivialInstance
      // @ts-ignore
    | WechatMiniprogram.Component.TrivialInstance;
  message?: string;
  overlay?: boolean;
  selector?: string;
  ariaLabel?: string;
  className?: string;
  customStyle?: string;
  transition?: string;
  asyncClose?: boolean;
  businessId?: number;
  sessionFrom?: string;
  overlayStyle?: string;
  appParameter?: string;
  messageAlign?: string;
  sendMessageImg?: string;
  showMessageCard?: boolean;
  sendMessagePath?: string;
  sendMessageTitle?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  closeOnClickOverlay?: boolean;
  confirmButtonOpenType?: string;
};
interface Dialog {
  (options: DialogOptions): Promise<DialogAction>;
  alert?: (options: DialogOptions) => Promise<DialogAction>;
  confirm?: (options: DialogOptions) => Promise<DialogAction>;
  close?: () => void;
  stopLoading?: () => void;
  install?: () => void;
  setDefaultOptions?: (options: DialogOptions) => void;
  resetDefaultOptions?: () => void;
  defaultOptions?: DialogOptions;
  currentOptions?: DialogOptions;
}
declare const Dialog: Dialog;
export default Dialog;
