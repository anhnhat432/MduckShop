export const getApiErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || fallbackMessage;
