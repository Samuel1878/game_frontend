export class UnsupportedBackendApiError extends Error {
  readonly code = "BACKEND_API_NOT_IMPLEMENTED";

  constructor(message: string) {
    super(message);
    this.name = "UnsupportedBackendApiError";
  }
}

const unsupported = (feature: string) =>
  new UnsupportedBackendApiError(
    `${feature} is not exposed by game_new_backend for player accounts yet.`,
  );

export const changePasswordApi = async (..._args: unknown[]): Promise<never> => {
  throw unsupported("Change password");
};

export const setFundPinApi = async (..._args: unknown[]): Promise<never> => {
  throw unsupported("Set fund PIN");
};

export const verifyFundPinApi = async (..._args: unknown[]): Promise<never> => {
  throw unsupported("Verify fund PIN");
};

export const changeFundPinApi = async (..._args: unknown[]): Promise<never> => {
  throw unsupported("Change fund PIN");
};
