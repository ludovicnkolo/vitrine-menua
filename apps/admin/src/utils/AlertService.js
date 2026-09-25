class AlertService {
  constructor() {
    this.alertListener = null;
    this.confirmListener = null;
  }

  setAlertListener(listener) {
    this.alertListener = listener;
  }

  setConfirmListener(listener) {
    this.confirmListener = listener;
  }

  alert(message, title = "Information", type = "info") {
    if (this.alertListener) {
      this.alertListener(message, title, type);
    } else {
      window._nativeAlert(message);
    }
  }

  confirm(message, title = "Confirmation") {
    return new Promise((resolve) => {
      if (this.confirmListener) {
        this.confirmListener(message, title, resolve);
      } else {
        resolve(window._nativeConfirm(message));
      }
    });
  }
}

export const alertService = new AlertService();

if (typeof window !== "undefined") {
  if (!window._nativeAlert) {
    window._nativeAlert = window.alert;
    window._nativeConfirm = window.confirm;
  }
  // Ne pas écraser window.alert car il est synchrone, on fournit notre propre API pour les nouveaux usages
  // Mais pour être retro-compatible de manière asynchrone, on peut exporter customAlert et customConfirm.
  window.customAlert = (msg, title, type) =>
    alertService.alert(msg, title, type);
  window.customConfirm = (msg, title) => alertService.confirm(msg, title);
}
