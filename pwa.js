(() => {
  let installPrompt = null;
  let installButton = null;
  const isStandalone = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  const lang = () => (document.documentElement.lang || "ar").split("-")[0];
  const labels = {
    ar: "تثبيت التطبيق", fr: "Installer l’application", en: "Install app",
    es: "Instalar aplicación", de: "App installieren", tr: "Uygulamayı yükle"
  };

  function createInstallButton() {
    if (isStandalone() || installButton || !document.body) return;
    installButton = document.createElement("button");
    installButton.id = "miniStoreInstallButton";
    installButton.type = "button";
    installButton.textContent = labels[lang()] || labels.ar;
    installButton.setAttribute("aria-label", installButton.textContent);
    Object.assign(installButton.style, {
      position: "fixed", bottom: "18px", insetInlineStart: "18px",
      zIndex: "9999", border: "1px solid #a6e34b", borderRadius: "999px",
      padding: "11px 16px", background: "#16263a", color: "#ffffff",
      font: "700 13px system-ui, sans-serif", boxShadow: "0 6px 22px rgba(0,0,0,.25)",
      cursor: "pointer"
    });
    installButton.addEventListener("click", async () => {
      if (!installPrompt) {
        const instructions = {
          ar: "لتثبيت MINABYB: افتح قائمة Chrome (⋮) ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».",
          fr: "Ouvrez le menu Chrome (⋮), puis choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ».",
          en: "Open the Chrome menu (⋮), then choose “Install app” or “Add to Home screen”.",
          es: "Abre el menú de Chrome (⋮) y elige «Instalar aplicación» o «Añadir a pantalla de inicio».",
          de: "Öffne das Chrome-Menü (⋮) und wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.",
          tr: "Chrome menüsünü (⋮) açıp “Uygulamayı yükle” veya “Ana ekrana ekle” seçeneğini seçin."
        };
        window.alert(instructions[lang()] || instructions.ar);
        return;
      }
      installButton.disabled = true;
      try {
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice && choice.outcome === "accepted") installButton.remove();
      } catch (error) {
        console.warn("MINABYB installation prompt failed:", error);
      } finally {
        installPrompt = null;
        if (installButton && installButton.isConnected) installButton.disabled = false;
      }
    });
    document.body.appendChild(installButton);
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    createInstallButton();
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    installButton?.remove();
    installButton = null;
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" })
        .then(registration => registration.update().catch(error =>
          console.warn("MINABYB worker update check failed:", error)
        ))
        .catch(error => console.warn("MINABYB app setup could not be registered:", error));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createInstallButton, { once: true });
  } else {
    createInstallButton();
  }
})();
