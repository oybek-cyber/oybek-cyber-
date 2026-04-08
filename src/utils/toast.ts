/**
 * Toast Notification Helper
 * Integrate with react-hot-toast or sonner based on your choice
 * Currently provides a wrapper - install and configure your preferred toast library
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  duration?: number;
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Show a success toast notification
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  console.log('[Success]', message); // TODO: Integrate with toast library
  // Example with react-hot-toast:
  // toast.success(message, options);
};

/**
 * Show an error toast notification
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  console.error('[Error]', message); // TODO: Integrate with toast library
  // Example with react-hot-toast:
  // toast.error(message, options);
};

/**
 * Show an info toast notification
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  console.info('[Info]', message); // TODO: Integrate with toast library
  // Example with react-hot-toast:
  // toast.custom((t) => <MyInfoComponent>{message}</MyInfoComponent>, options);
};

/**
 * Show a warning toast notification
 */
export const showWarningToast = (message: string, options?: ToastOptions) => {
  console.warn('[Warning]', message); // TODO: Integrate with toast library
  // Example with react-hot-toast:
  // toast((t) => <MyWarningComponent>{message}</MyWarningComponent>, options);
};

/**
 * Generic toast function
 */
export const showToast = (
  message: string,
  type: ToastType = 'info',
  options?: ToastOptions
) => {
  switch (type) {
    case 'success':
      showSuccessToast(message, options);
      break;
    case 'error':
      showErrorToast(message, options);
      break;
    case 'warning':
      showWarningToast(message, options);
      break;
    case 'info':
    default:
      showInfoToast(message, options);
      break;
  }
};
