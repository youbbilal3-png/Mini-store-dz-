(() => {
  const labels = {
    ar: "كيف يعمل؟", fr: "Comment ça marche ?", en: "How it works", es: "Cómo funciona", de: "So funktioniert's", tr: "Nasıl çalışır?"
  };
  const link = document.getElementById("howItWorksLink");
  const picker = document.getElementById("languageSelect");
  if (!link) return;
  const apply = (lang) => { link.textContent = labels[labels[lang] ? lang : "ar"]; };
  let saved = "ar";
  try { saved = localStorage.getItem("msdz-language") || "ar"; } catch (_) {}
  apply(saved);
  if (picker) picker.addEventListener("change", () => apply(picker.value));
})();