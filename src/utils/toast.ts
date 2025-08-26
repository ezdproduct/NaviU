import { toast } from "sonner"; // Removed ToastId type import

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string | number) => { // Changed type to string | number
  toast.dismiss(toastId);
};