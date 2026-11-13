(() => {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(error => {
      console.warn("Mini Store DZ app setup could not be registered:", error);
    });
  });

  let installPrompt = null;
  const isStandalone = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    if (isStandalone() || document.getElementById("miniStoreInstallButton")) return;

    const labels = {
      ar: "تثبيت التطبيق",
      fr: "Installer l’application",
      en: "Install app",
      es: "Instalar aplicación",
      de: "App installieren",
      tr: "Uygulamayı yükle"
    };
    const lang = (document.documentElement.lang || "ar").split("-")[0];
    const button = document.createElement("button");
    button.id = "miniStoreInstallButton";
    button.type = "button";
    button.textContent = labels[lang] || labels.ar;
    button.setAttribute("aria-label", button.textContent);
    Object.assign(button.style, {
      position: "fixed",
      bottom: "18px",
      left: "18px",
      zIndex: "9999",
      border: "1px solid #a6e34b",
      borderRadius: "999px",
      padding: "12px 18px",
      background: "#16263a",
      color: "#ffffff",
      font: "600 14px system-ui, sans-serif",
      boxShadow: "0 6px 22px rgba(0,0,0,.25)",
      cursor: "pointer"
    });
    button.addEventListener("click", async () => {
      if (!installPrompt) return;
      button.disabled = true;
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      button.remove();
    });
    document.body.appendChild(button);
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    document.getElementById("miniStoreInstallButton")?.remove();
  });
})();