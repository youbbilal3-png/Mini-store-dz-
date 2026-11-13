// STORE SETTINGS: customize these values for each store.
// WhatsApp number format: country code + number, without +, spaces or dashes.
const DEFAULT_STORE_SETTINGS = {
  whatsapp: "213000000000",
  sellerName: "Store Owner",
  sellerDescription: "",
  sellerAvatar: "" // Optional public image URL. Leave empty to show the first letter.
};

const DEMO_STORAGE_KEY = "ministore_dz_demo_v1";
let savedDemo = null;
try { savedDemo = JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY) || "null"); } catch (error) { savedDemo = null; }
const STORE_SETTINGS = Object.assign({}, DEFAULT_STORE_SETTINGS, savedDemo && savedDemo.settings ? savedDemo.settings : {});

const defaultProducts = [
  {id:1,name:"سماعات لاسلكية",fr:"Écouteurs sans fil",en:"Wireless Earbuds",category:"إلكترونيات",categoryFr:"Électronique",categoryEn:"Electronics",price:3500,description:"صوت واضح وتصميم مريح للاستخدام اليومي.",descriptionFr:"Un son clair et un design confortable au quotidien.",descriptionEn:"Clear sound and a comfortable everyday fit.",emoji:"🎧"},
  {id:2,name:"ساعة ذكية",fr:"Montre connectée",en:"Smart Watch",category:"إلكترونيات",categoryFr:"Électronique",categoryEn:"Electronics",price:6200,description:"تابع نشاطك وإشعاراتك بسهولة.",descriptionFr:"Suivez facilement votre activité et vos notifications.",descriptionEn:"Track your activity and notifications.",emoji:"⌚"},
  {id:3,name:"حقيبة عصرية",fr:"Sac tendance",en:"Everyday Bag",category:"إكسسوارات",categoryFr:"Accessoires",categoryEn:"Accessories",price:2800,description:"حقيبة عملية بتصميم أنيق.",descriptionFr:"Un sac pratique au design élégant.",descriptionEn:"A practical bag with a modern look.",emoji:"👜"},
  {id:4,name:"مصباح مكتبي",fr:"Lampe de bureau",en:"Desk Lamp",category:"المنزل",categoryFr:"Maison",categoryEn:"Home",price:1900,description:"إضاءة مريحة لمكتبك أو غرفتك.",descriptionFr:"Un éclairage agréable pour votre bureau ou votre chambre.",descriptionEn:"Comfortable lighting for your desk or room.",emoji:"💡"}
];

const translations = {
  ar:{
    navProducts:"المنتجات",navAbout:"من نحن",navContact:"اتصل بنا",languageLabel:"اللغة",
    eyebrow:"متجرك يبدأ من هنا",heroTitle:'اكتشف منتجاتك المفضلة<br><em>بسهولة وثقة</em>',heroText:"تصفح منتجاتنا واختر ما يناسبك. اطلب مباشرة عبر واتساب.",browse:"تصفح المنتجات",
    sellerLabel:"صاحب المتجر",collection:"تشكيلتنا",productsTitle:"منتجات مختارة",searchPlaceholder:"ابحث عن منتج...",all:"الكل",empty:"لا توجد منتجات مطابقة لبحثك.",
    whyUs:"لماذا متجرنا؟",aboutTitle:"تجربة شراء سهلة ومباشرة",aboutText:"منتجات مميزة ومعلومات واضحة وطلب سهل عبر واتساب.",
    needHelp:"هل لديك سؤال؟",contactTitle:"تواصل معنا",contactText:"نحن هنا لمساعدتك في اختيار المنتج المناسب.",whatsappUs:"راسلنا عبر واتساب",rights:"جميع الحقوق محفوظة.",order:"اطلب الآن",
    orderMessage:"مرحباً، أريد طلب: ",currency:"دج",count:"منتجات",sellerDescription:"متجرك، هويتك."
  },
  fr:{
    navProducts:"Produits",navAbout:"À propos",navContact:"Contact",languageLabel:"Langue",
    eyebrow:"Votre boutique commence ici",heroTitle:'Découvrez vos produits préférés<br><em>en toute simplicité</em>',heroText:"Parcourez nos produits et commandez directement sur WhatsApp.",browse:"Voir les produits",
    sellerLabel:"Vendeur",collection:"NOTRE COLLECTION",productsTitle:"Produits sélectionnés",searchPlaceholder:"Rechercher un produit...",all:"Tout",empty:"Aucun produit ne correspond à votre recherche.",
    whyUs:"POURQUOI NOUS CHOISIR",aboutTitle:"Une expérience d’achat simple",aboutText:"Des produits sélectionnés, des informations claires et une commande facile sur WhatsApp.",
    needHelp:"Une question ?",contactTitle:"Contactez-nous",contactText:"Nous sommes là pour vous aider à choisir.",whatsappUs:"Écrire sur WhatsApp",rights:"Tous droits réservés.",order:"Commander",
    orderMessage:"Bonjour, je souhaite commander : ",currency:"DZD",count:"produits",sellerDescription:"Votre boutique, votre identité."
  },
  en:{
    navProducts:"Products",navAbout:"About",navContact:"Contact",languageLabel:"Language",
    eyebrow:"Your store starts here",heroTitle:'Discover your favorite products<br><em>with ease and confidence</em>',heroText:"Browse our products and order directly through WhatsApp.",browse:"Browse products",
    sellerLabel:"Store owner",collection:"OUR COLLECTION",productsTitle:"Featured products",searchPlaceholder:"Search products...",all:"All",empty:"No products match your search.",
    whyUs:"WHY SHOP WITH US",aboutTitle:"A simple shopping experience",aboutText:"Selected products, clear information and easy WhatsApp ordering.",
    needHelp:"Have a question?",contactTitle:"Get in touch",contactText:"We are here to help you choose.",whatsappUs:"Chat on WhatsApp",rights:"All rights reserved.",order:"Order now",
    orderMessage:"Hello, I'd like to order: ",currency:"DZD",count:"products",sellerDescription:"Your store, your identity."
  }
};

let language = "ar";
let activeCategory = "all";
let searchTerm = "";
const el = id => document.getElementById(id);

function productText(product, field) {
  if (field === "name") return language === "fr" ? product.fr : language === "en" ? product.en : product.name;
  if (language === "fr") return product[field + "Fr"] || product[field];
  if (language === "en") return product[field + "En"] || product[field];
  return product[field];
}
function categoryOf(product) {
  return language === "fr" ? product.categoryFr : language === "en" ? product.categoryEn : product.category;
}
function whatsappLink(product) {
  const name = productText(product, "name");
  const message = translations[language].orderMessage + name;
  return "https://wa.me/" + STORE_SETTINGS.whatsapp + "?text=" + encodeURIComponent(message);
}
function renderFilters() {
  const categories = [...new Set(products.map(categoryOf))];
  const buttons = [{value:"all",label:translations[language].all}, ...categories.map(category => ({value:category,label:category}))];
  el("categoryFilters").innerHTML = buttons.map(item =>
    '<button type="button" class="filter-btn ' + (activeCategory === item.value ? "active" : "") + '" data-category="' + item.value + '">' + item.label + '</button>'
  ).join("");
}
function renderProducts() {
  const list = products.filter(product => {
    const matchesCategory = activeCategory === "all" || categoryOf(product) === activeCategory;
    const searchable = [product.name,product.fr,product.en,product.category,product.categoryFr,product.categoryEn].join(" ").toLowerCase();
    return matchesCategory && searchable.includes(searchTerm.toLowerCase());
  });
  el("productGrid").innerHTML = list.map(product => {
    const name = productText(product,"name");
    const description = productText(product,"description");
    return '<article class="product-card"><div class="product-image" aria-hidden="true">' + product.emoji + '</div><div class="product-info"><span class="product-category">' + categoryOf(product) + '</span><h3>' + name + '</h3><p>' + description + '</p><div class="product-bottom"><span class="price">' + product.price.toLocaleString(language === "ar" ? "ar-DZ" : language === "fr" ? "fr-FR" : "en-US") + ' ' + translations[language].currency + '</span><a class="order-btn" href="' + whatsappLink(product) + '" target="_blank" rel="noopener">' + translations[language].order + '</a></div></div></article>';
  }).join("");
  el("emptyState").hidden = list.length > 0;
  el("productCount").textContent = list.length + " " + translations[language].count;
}
function renderSellerProfile() {
  const name = STORE_SETTINGS.sellerName || "Store Owner";
  el("sellerName").textContent = name;
  el("sellerDescription").textContent = STORE_SETTINGS.sellerDescription || translations[language].sellerDescription;
  el("sellerInitials").textContent = name.trim().charAt(0).toUpperCase() || "S";
  const avatar = el("sellerAvatar");
  if (STORE_SETTINGS.sellerAvatar) {
    avatar.src = STORE_SETTINGS.sellerAvatar;
    avatar.hidden = false;
    el("sellerInitials").hidden = true;
    avatar.onerror = () => { avatar.hidden = true; el("sellerInitials").hidden = false; };
  } else {
    avatar.hidden = true;
    el("sellerInitials").hidden = false;
  }
}
function applyLanguage() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.dataset.i18n;
    if (translations[language][key]) node.innerHTML = translations[language][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(node => {
    node.placeholder = translations[language][node.dataset.i18nPlaceholder];
  });
  renderSellerProfile();
  renderFilters();
  renderProducts();
  el("contactButton").href = "https://wa.me/" + STORE_SETTINGS.whatsapp;
}
el("languageSelect").addEventListener("change", event => {
  language = event.target.value;
  activeCategory = "all";
  applyLanguage();
});
el("searchInput").addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});
el("categoryFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters();
  renderProducts();
});
el("year").textContent = new Date().getFullYear();
applyLanguage();
