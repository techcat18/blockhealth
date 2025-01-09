import { makeAutoObservable } from "mobx";

export interface SnackBarOptions {
  open: boolean;
  severity: SnackBarSeverity;
  message: string;
}

export type SnackBarSeverity =
  | "success"
  | "info"
  | "warning"
  | "error"
  | undefined;

export default class SnackBarStore {
  snackBarOptions: SnackBarOptions = {
    open: false,
    severity: undefined,
    message: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  showSnackBar = (message: string, severity: SnackBarSeverity): void => {
    this.snackBarOptions = {
      open: true,
      severity,
      message,
    };
  };

  closeSnackBar = (): void => {
    this.snackBarOptions = { ...this.snackBarOptions, open: false };
  };
}
