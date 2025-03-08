(function () {
  const targetText = "Вы уверены, что хотите сдаться?";
  window.__originalConfirm = window.confirm;
  window.useCustomConfirm = false;

  window.addEventListener("toggleConfirmInterceptor", (event) => {
    window.useCustomConfirm = event.detail.enabled;
  });

  window.confirm = function (message) {
    if (window.useCustomConfirm && message === targetText) {
      return true;
    }

    return window.__originalConfirm(message);
  };
})();
