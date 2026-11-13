(() => {
  const dictionaries = {
    fr: {
      "صورة التاجر":"Photo du vendeur",
      "اسم متجرك":"Nom de votre boutique",
      "مثال: سماعات لاسلكية":"Ex. : écouteurs sans fil",
      "أخرى":"Autre",
      "حساب التاجر":"Compte vendeur",
      "طلب":"commande",
      "منتج":"produit",
      "قطعة":"pièce",
      "دج":"DZD",
      "لا توجد منتجات بعد. أضف أول منتجك من النموذج أعلاه.":"Aucun produit pour le moment. Ajoutez votre premier produit avec le formulaire ci-dessus.",
      "تغيير المظهر":"Changer le thème","تلقائي":"Automatique","فاتح":"Clair","داكن":"Sombre","المظهر الحالي":"Thème actuel","اضغط للتغيير":"Appuyez pour changer",
      "عرض المتجر ↗":"Voir la boutique ↗","تسجيل الخروج":"Déconnexion","جارٍ تسجيل الخروج...":"Déconnexion en cours...","لوحة تحكم التاجر":"Tableau de bord vendeur","أدر بيانات متجرك ومنتجاتك من مكان واحد.":"Gérez votre boutique et vos produits depuis un seul endroit.","متصل بقاعدة البيانات":"Connecté à la base de données",
      "واجهة المتجر":"Profil de la boutique","إعدادات المتجر":"Paramètres de la boutique","المنتجات":"Produits","الإحصائيات":"Statistiques","الطلبات":"Commandes","تقييمات الزبائن":"Avis clients","صفحة المتجر":"Page de la boutique","متجرك على السحابة":"Votre boutique dans le cloud","بياناتك محفوظة في حسابك ويمكنك الوصول إليها من أي جهاز بعد تسجيل الدخول.":"Vos données sont enregistrées dans votre compte et accessibles depuis n’importe quel appareil après connexion.",
      "الملف الشخصي":"Profil","هذه المعلومات تظهر لزوار متجرك.":"Ces informations sont visibles par les visiteurs de votre boutique.","صورة المتجر":"Image de la boutique","متجري":"Ma boutique","صاحب المتجر":"Propriétaire de la boutique","أضف نبذة قصيرة لتعريف الزبائن بمتجرك.":"Ajoutez une courte présentation de votre boutique.","مسودة خاصة":"Brouillon privé","📷 تغيير الصورة":"📷 Changer la photo","إزالة الصورة":"Supprimer la photo","اسم التاجر":"Nom du vendeur","نبذة قصيرة":"Courte présentation","مثال: Bilal":"Ex. : Bilal","اكتب نبذة بسيطة عنك أو عن نشاطك":"Présentez-vous ou décrivez votre activité",
      "إحصائيات المتجر":"Statistiques de la boutique","ملخص مباشر لأداء متجرك وطلباته.":"Aperçu des performances et des commandes de votre boutique.","إجمالي الطلبات":"Total des commandes","الطلبات الجديدة":"Nouvelles commandes","الطلبات المكتملة":"Commandes terminées","المبيعات المكتملة":"Ventes réalisées","عدد المنتجات":"Nombre de produits","تُحتسب المبيعات من الطلبات التي حالتها «مكتمل» فقط، ولا تشمل الطلبات الملغاة أو قيد المعالجة.":"Les ventes comptabilisées incluent uniquement les commandes terminées, et excluent les commandes annulées ou en cours.","الطلبات خلال آخر 7 أيام":"Commandes des 7 derniers jours","كل الحالات":"Tous les statuts","بالدينار الجزائري":"En dinars algériens",
      "إعدادات المتجر":"Paramètres de la boutique","خصص اسم المتجر ورقم استقبال الطلبات.":"Personnalisez le nom de la boutique et le numéro de réception des commandes.","اسم المتجر":"Nom de la boutique","رقم WhatsApp":"Numéro WhatsApp","اكتب رمز الدولة ثم الرقم، دون + أو مسافات.":"Saisissez l’indicatif du pays puis le numéro, sans + ni espaces.","حفظ بيانات المتجر":"Enregistrer les informations","نشر المتجر":"Publier la boutique","إلغاء نشر المتجر":"Dépublier la boutique","فتح متجري المنشور ↗":"Ouvrir ma boutique publiée ↗","نسخ رابط المتجر":"Copier le lien de la boutique","مشاركة عبر WhatsApp":"Partager sur WhatsApp","مشاركة عبر Facebook":"Partager sur Facebook",
      "إدارة المنتجات":"Gestion des produits","أضف منتجاً جديداً أو عدّل المنتجات الموجودة.":"Ajoutez un produit ou modifiez les produits existants.","اسم المنتج":"Nom du produit","التصنيف":"Catégorie","اختر تصنيف المنتج":"Choisissez une catégorie","إلكترونيات":"Électronique","هواتف وإكسسوارات":"Téléphones et accessoires","ملابس":"Vêtements","أحذية":"Chaussures","حقائب وإكسسوارات":"Sacs et accessoires","مستحضرات التجميل":"Cosmétiques","العناية الشخصية":"Soins personnels","المنزل والمطبخ":"Maison et cuisine","الأثاث والديكور":"Meubles et décoration","الأطفال والألعاب":"Enfants et jouets","الرياضة واللياقة":"Sport et fitness","السيارات":"Automobile","الأغذية والمشروبات":"Alimentation et boissons","الكتب والقرطاسية":"Livres et papeterie","تصنيف آخر":"Autre catégorie","اكتب التصنيف الذي تريده":"Saisissez la catégorie souhaitée","السعر بالدينار":"Prix en dinars","الكمية المتوفرة (اختياري)":"Quantité disponible (facultatif)","اتركها فارغة لمخزون غير محدود":"Laissez vide pour un stock illimité","0 تعني أن المنتج نفد من المخزون. اترك الخانة فارغة إذا لم ترد تتبع الكمية.":"0 signifie que le produit est en rupture. Laissez vide si vous ne souhaitez pas suivre le stock.","رمز تعبيري للمنتج":"Emoji du produit","وصف المنتج":"Description du produit","اكتب وصفاً قصيراً للمنتج":"Saisissez une courte description du produit","صور المنتج (حتى 5 صور)":"Images du produit (jusqu’à 5)","JPEG أو PNG أو WebP، حتى 5 ميغابايت لكل صورة. عند تعديل المنتج يمكنك إضافة صور أخرى.":"JPEG, PNG ou WebP, jusqu’à 5 Mo par image. Vous pouvez ajouter des images lors de la modification.","＋ إضافة المنتج":"＋ Ajouter le produit","إلغاء التعديل":"Annuler la modification","حفظ التعديلات":"Enregistrer les modifications","تقييمات الزبائن":"Avis clients","راجع آراء الزبائن وانشر التقييمات المناسبة.":"Consultez les avis et publiez ceux qui conviennent.","طلبات الزبائن":"Commandes des clients","تابع الطلبات الجديدة وحدّث حالتها من مكان واحد.":"Suivez les nouvelles commandes et mettez leur statut à jour ici.",
      "جارٍ تجهيز الرسم البياني...":"Préparation du graphique...","جارٍ تحميل التقييمات...":"Chargement des avis...","جارٍ تحميل الطلبات...":"Chargement des commandes...","لا توجد طلبات حتى الآن. ستظهر هنا طلبات الزبائن من متجرك.":"Aucune commande pour le moment. Les commandes de votre boutique apparaîtront ici.","لا توجد تقييمات بعد. ستظهر هنا آراء الزبائن عندما يرسلونها من صفحة متجرك.":"Aucun avis pour le moment. Les avis apparaîtront ici lorsque les clients en enverront depuis votre boutique.","تقييم منشور":"avis publiés","إجمالي":"au total","بانتظار المراجعة":"En attente de validation","منشور":"Publié","مرفوض":"Refusé","نشر":"Publier","رفض":"Refuser","جديد":"Nouveau","مؤكد":"Confirmé","تم الشحن":"Expédié","مكتمل":"Terminé","ملغى":"Annulé","ملاحظات:":"Remarques :","تغيير حالة الطلب":"Modifier le statut de la commande",
      "متجرك منشور للعامة":"Votre boutique est publiée","متجرك خاص حتى تنشره":"Votre boutique reste privée jusqu’à sa publication","متجرك غير منشور بعد":"Votre boutique n’est pas encore publiée","تحقق من رقم WhatsApp ورمز الدولة.":"Vérifiez le numéro WhatsApp et l’indicatif du pays.","تم حفظ بيانات متجرك على السحابة.":"Les informations de votre boutique ont été enregistrées dans le cloud.","جارٍ رفع الصورة...":"Téléversement de l’image...","تم رفع صورة التاجر وحفظها على السحابة.":"La photo du vendeur a été téléversée et enregistrée dans le cloud.","تعذر رفع الصورة.":"Impossible de téléverser l’image.","تمت إزالة الصورة.":"L’image a été supprimée.","تم حفظ المنتج على السحابة.":"Le produit a été enregistré dans le cloud.","تم تحديث المنتج على السحابة.":"Le produit a été mis à jour dans le cloud.","تمت إضافة المنتج إلى متجرك.":"Le produit a été ajouté à votre boutique.","تعذر حفظ المنتج.":"Impossible d’enregistrer le produit.","يمكن إضافة 5 صور كحد أقصى للمنتج الواحد.":"Vous pouvez ajouter jusqu’à 5 images par produit.","اختر صورة JPEG أو PNG أو WebP.":"Choisissez une image JPEG, PNG ou WebP.","حجم الصورة أكبر من الحد المسموح.":"L’image dépasse la taille autorisée.","مخزون غير محدود":"Stock illimité","نفد المخزون":"Rupture de stock","مخزون منخفض":"Stock faible","المتوفر":"Disponible","تعديل":"Modifier","حذف":"Supprimer","عام":"Général","هل تريد حذف المنتج:":"Voulez-vous supprimer le produit :","تم حذف المنتج.":"Le produit a été supprimé.","تم نسخ رابط متجرك.":"Le lien de votre boutique a été copié.","يمكنك مشاركته الآن.":"Vous pouvez le partager maintenant.","انشر المتجر أولاً ليتمكن الزوار من مشاهدة المنتجات.":"Publiez d’abord la boutique pour que les visiteurs puissent voir les produits.","تعذر النسخ تلقائياً. استخدم زر عرض المتجر لفتح الرابط ونسخه من شريط العنوان.":"Copie automatique impossible. Ouvrez la boutique et copiez le lien depuis la barre d’adresse.","تم نشر متجرك. يمكنك مشاركة رابط المتجر.":"Votre boutique est publiée. Vous pouvez partager son lien.","تم إلغاء نشر المتجر.":"La publication de votre boutique a été annulée.","تعذر تحديث حالة الطلب:":"Impossible de mettre à jour le statut de la commande :","تعذر تحديث التقييم:":"Impossible de mettre à jour l’avis :","تعذر تحميل بيانات المتجر":"Impossible de charger les données de la boutique","تحقق من الاتصال ثم أعد المحاولة.":"Vérifiez votre connexion puis réessayez.","تعذر تسجيل الخروج. تحقق من الاتصال ثم حاول مجدداً.":"Déconnexion impossible. Vérifiez votre connexion puis réessayez."
    },
    en: {
      "صورة التاجر":"Seller photo",
      "اسم متجرك":"Your store name",
      "مثال: سماعات لاسلكية":"Example: Wireless earbuds",
      "أخرى":"Other",
      "حساب التاجر":"Merchant account",
      "طلب":"order",
      "منتج":"product",
      "قطعة":"item",
      "دج":"DZD",
      "لا توجد منتجات بعد. أضف أول منتجك من النموذج أعلاه.":"No products yet. Add your first product using the form above.",
      "تغيير المظهر":"Change theme","تلقائي":"System","فاتح":"Light","داكن":"Dark","المظهر الحالي":"Current theme","اضغط للتغيير":"Tap to change",
      "عرض المتجر ↗":"View store ↗","تسجيل الخروج":"Log out","جارٍ تسجيل الخروج...":"Logging out...","لوحة تحكم التاجر":"Merchant dashboard","أدر بيانات متجرك ومنتجاتك من مكان واحد.":"Manage your store details and products in one place.","متصل بقاعدة البيانات":"Connected to database",
      "واجهة المتجر":"Store profile","إعدادات المتجر":"Store settings","المنتجات":"Products","الإحصائيات":"Statistics","الطلبات":"Orders","تقييمات الزبائن":"Customer reviews","صفحة المتجر":"Store page","متجرك على السحابة":"Your store in the cloud","بياناتك محفوظة في حسابك ويمكنك الوصول إليها من أي جهاز بعد تسجيل الدخول.":"Your data is saved to your account and available on any device after you sign in.",
      "الملف الشخصي":"Profile","هذه المعلومات تظهر لزوار متجرك.":"This information is visible to your store visitors.","صورة المتجر":"Store image","متجري":"My Store","صاحب المتجر":"Store owner","أضف نبذة قصيرة لتعريف الزبائن بمتجرك.":"Add a short introduction to your store.","مسودة خاصة":"Private draft","📷 تغيير الصورة":"📷 Change photo","إزالة الصورة":"Remove photo","اسم التاجر":"Seller name","نبذة قصيرة":"Short bio","مثال: Bilal":"Example: Bilal","اكتب نبذة بسيطة عنك أو عن نشاطك":"Write a short introduction about yourself or your business",
      "إحصائيات المتجر":"Store statistics","ملخص مباشر لأداء متجرك وطلباته.":"A live overview of your store performance and orders.","إجمالي الطلبات":"Total orders","الطلبات الجديدة":"New orders","الطلبات المكتملة":"Completed orders","المبيعات المكتملة":"Completed sales","عدد المنتجات":"Number of products","تُحتسب المبيعات من الطلبات التي حالتها «مكتمل» فقط، ولا تشمل الطلبات الملغاة أو قيد المعالجة.":"Sales include only completed orders, excluding cancelled or in-progress orders.","الطلبات خلال آخر 7 أيام":"Orders in the last 7 days","كل الحالات":"All statuses","بالدينار الجزائري":"In Algerian dinars",
      "خصص اسم المتجر ورقم استقبال الطلبات.":"Customize your store name and order contact number.","اسم المتجر":"Store name","رقم WhatsApp":"WhatsApp number","اكتب رمز الدولة ثم الرقم، دون + أو مسافات.":"Enter the country code followed by the number, without + or spaces.","حفظ بيانات المتجر":"Save store details","نشر المتجر":"Publish store","إلغاء نشر المتجر":"Unpublish store","فتح متجري المنشور ↗":"Open my published store ↗","نسخ رابط المتجر":"Copy store link","مشاركة عبر WhatsApp":"Share on WhatsApp","مشاركة عبر Facebook":"Share on Facebook",
      "إدارة المنتجات":"Product management","أضف منتجاً جديداً أو عدّل المنتجات الموجودة.":"Add a new product or edit existing products.","اسم المنتج":"Product name","التصنيف":"Category","اختر تصنيف المنتج":"Choose a product category","إلكترونيات":"Electronics","هواتف وإكسسوارات":"Phones & accessories","ملابس":"Clothing","أحذية":"Shoes","حقائب وإكسسوارات":"Bags & accessories","مستحضرات التجميل":"Cosmetics","العناية الشخصية":"Personal care","المنزل والمطبخ":"Home & kitchen","الأثاث والديكور":"Furniture & decor","الأطفال والألعاب":"Kids & toys","الرياضة واللياقة":"Sports & fitness","السيارات":"Automotive","الأغذية والمشروبات":"Food & beverages","الكتب والقرطاسية":"Books & stationery","تصنيف آخر":"Other category","اكتب التصنيف الذي تريده":"Enter your category","السعر بالدينار":"Price in DZD","الكمية المتوفرة (اختياري)":"Available quantity (optional)","اتركها فارغة لمخزون غير محدود":"Leave blank for unlimited stock","0 تعني أن المنتج نفد من المخزون. اترك الخانة فارغة إذا لم ترد تتبع الكمية.":"0 means out of stock. Leave blank if you do not want to track inventory.","رمز تعبيري للمنتج":"Product emoji","وصف المنتج":"Product description","اكتب وصفاً قصيراً للمنتج":"Write a short product description","صور المنتج (حتى 5 صور)":"Product images (up to 5)","JPEG أو PNG أو WebP، حتى 5 ميغابايت لكل صورة. عند تعديل المنتج يمكنك إضافة صور أخرى.":"JPEG, PNG or WebP, up to 5 MB per image. You can add more images when editing.","＋ إضافة المنتج":"＋ Add product","إلغاء التعديل":"Cancel edit","حفظ التعديلات":"Save changes","راجع آراء الزبائن وانشر التقييمات المناسبة.":"Review customer feedback and publish appropriate reviews.","طلبات الزبائن":"Customer orders","تابع الطلبات الجديدة وحدّث حالتها من مكان واحد.":"Track new orders and update their status in one place.",
      "جارٍ تجهيز الرسم البياني...":"Preparing chart...","جارٍ تحميل التقييمات...":"Loading reviews...","جارٍ تحميل الطلبات...":"Loading orders...","لا توجد طلبات حتى الآن. ستظهر هنا طلبات الزبائن من متجرك.":"No orders yet. Customer orders for your store will appear here.","لا توجد تقييمات بعد. ستظهر هنا آراء الزبائن عندما يرسلونها من صفحة متجرك.":"No reviews yet. Customer reviews will appear here when submitted from your store page.","تقييم منشور":"published reviews","إجمالي":"total","بانتظار المراجعة":"Pending review","منشور":"Published","مرفوض":"Rejected","نشر":"Publish","رفض":"Reject","جديد":"New","مؤكد":"Confirmed","تم الشحن":"Shipped","مكتمل":"Completed","ملغى":"Cancelled","ملاحظات:":"Notes:","تغيير حالة الطلب":"Change order status",
      "متجرك منشور للعامة":"Your store is publicly published","متجرك خاص حتى تنشره":"Your store is private until published","متجرك غير منشور بعد":"Your store is not published yet","تحقق من رقم WhatsApp ورمز الدولة.":"Check the WhatsApp number and country code.","تم حفظ بيانات متجرك على السحابة.":"Your store details were saved to the cloud.","جارٍ رفع الصورة...":"Uploading image...","تم رفع صورة التاجر وحفظها على السحابة.":"Seller photo uploaded and saved to the cloud.","تعذر رفع الصورة.":"Could not upload image.","تمت إزالة الصورة.":"Image removed.","تم حفظ المنتج على السحابة.":"Product saved to the cloud.","تم تحديث المنتج على السحابة.":"Product updated in the cloud.","تمت إضافة المنتج إلى متجرك.":"Product added to your store.","تعذر حفظ المنتج.":"Could not save product.","يمكن إضافة 5 صور كحد أقصى للمنتج الواحد.":"You can add up to 5 images per product.","اختر صورة JPEG أو PNG أو WebP.":"Choose a JPEG, PNG or WebP image.","حجم الصورة أكبر من الحد المسموح.":"Image exceeds the allowed size.","مخزون غير محدود":"Unlimited stock","نفد المخزون":"Out of stock","مخزون منخفض":"Low stock","المتوفر":"Available","تعديل":"Edit","حذف":"Delete","عام":"General","هل تريد حذف المنتج:":"Do you want to delete product:","تم حذف المنتج.":"Product deleted.","تم نسخ رابط متجرك.":"Your store link was copied.","يمكنك مشاركته الآن.":"You can share it now.","انشر المتجر أولاً ليتمكن الزوار من مشاهدة المنتجات.":"Publish your store first so visitors can see your products.","تعذر النسخ تلقائياً. استخدم زر عرض المتجر لفتح الرابط ونسخه من شريط العنوان.":"Automatic copy failed. Open your store and copy the link from the address bar.","تم نشر متجرك. يمكنك مشاركة رابط المتجر.":"Your store is published. You can share its link.","تم إلغاء نشر المتجر.":"Your store has been unpublished.","تعذر تحديث حالة الطلب:":"Could not update order status:","تعذر تحديث التقييم:":"Could not update review:","تعذر تحميل بيانات المتجر":"Could not load store data","تحقق من الاتصال ثم أعد المحاولة.":"Check your connection and try again.","تعذر تسجيل الخروج. تحقق من الاتصال ثم حاول مجدداً.":"Could not log out. Check your connection and try again."
    }
  };
  const originals = Object.keys(dictionaries.fr);
  const reverse = { fr: {}, en: {} };
  for (const lang of ["fr", "en"]) for (const [ar, translated] of Object.entries(dictionaries[lang])) reverse[lang][translated] = ar;
  let lang = "ar";
  const all = Object.assign({}, ...Object.values(dictionaries));
  const translateText = (value) => {
    const raw = value;
    const trimmed = raw.trim();
    if (!trimmed) return raw;
    let ar = trimmed;
    for (const sourceLang of ["fr", "en"]) {
      for (const [translated, source] of Object.entries(reverse[sourceLang]).sort((a,b)=>b[0].length-a[0].length)) {
        if (ar === translated) { ar = source; break; }
        if (translated.length > 1 && ar.includes(translated)) ar = ar.replaceAll(translated, source);
      }
    }
    if (lang === "ar") return raw.replace(trimmed, ar);
    const targetLanguage = ["fr","en"].includes(lang) ? lang : (lang === "ar" ? "ar" : "en");
    let out = ar;
    for (const [source, translated] of Object.entries(dictionaries[targetLanguage]).sort((a,b)=>b[0].length-a[0].length)) {
      if (out === source) { out = translated; break; }
      if (source.length > 5 && out.includes(source)) out = out.replaceAll(source, translated);
    }
    return raw.replace(trimmed, out);
  };
  const translateElement = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest("script,style,textarea,input,[contenteditable=true]")) continue;
      const next = translateText(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    }
    root.querySelectorAll?.("input,textarea,select,button,a,img").forEach(el => {
      for (const attr of ["placeholder","title","aria-label","alt"]) if (el.hasAttribute(attr)) el.setAttribute(attr, translateText(el.getAttribute(attr)));
    });
  };
  const apply = (next) => {
    lang = ["ar","fr","en","es","de","tr"].includes(next) ? next : "ar";
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = lang === "fr" ? "Tableau de bord vendeur | Mini Store DZ" : lang === "en" ? "Merchant dashboard | Mini Store DZ" : lang === "es" ? "Panel del vendedor | Mini Store DZ" : lang === "de" ? "Händler-Dashboard | Mini Store DZ" : lang === "tr" ? "Satıcı paneli | Mini Store DZ" : "لوحة التاجر | Mini Store DZ";
    translateElement(document.body);
    const picker = document.getElementById("dashboardLanguageSelect");
    if (picker) picker.value = lang;
    try { localStorage.setItem("msdz-language", lang); } catch (_) {}
  };
  document.addEventListener("DOMContentLoaded", () => {
    try { const saved = localStorage.getItem("msdz-language"); lang = ["ar","fr","en","es","de","tr"].includes(saved) ? saved : "ar"; } catch (_) {}
    const actions = document.querySelector(".dashboard-header-actions");
    if (actions && !document.getElementById("dashboardLanguageSelect")) {
      const label = document.createElement("label");
      label.className = "language-picker";
      label.innerHTML = '<span class="sr-only">Language</span><select id="dashboardLanguageSelect" aria-label="Choose language"><option value="ar">العربية</option><option value="fr">Français</option><option value="en">English</option><option value="es">Español</option><option value="de">Deutsch</option><option value="tr">Türkçe</option></select>';
      actions.insertBefore(label, actions.firstChild);
      label.querySelector("select").addEventListener("change", e => apply(e.target.value));
    }
    apply(lang);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "characterData") {
          const next = translateText(record.target.nodeValue);
          if (next !== record.target.nodeValue) record.target.nodeValue = next;
        } else for (const added of record.addedNodes) if (added.nodeType === Node.ELEMENT_NODE) translateElement(added);
      }
    });
    observer.observe(document.body, {subtree:true,childList:true,characterData:true});
  });
})();