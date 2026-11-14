(() => {
  const languages = ["fr","en","es","de","tr"];
  const rows = {
    "لوحة إدارة MINABYB":["Administration MINABYB","MINABYB Admin","Administración MINABYB","MINABYB Verwaltung","MINABYB Yönetim"],
    "لوحة إدارة المنصة":["Administration de la plateforme","Platform administration","Administración de la plataforma","Plattformverwaltung","Platform yönetimi"],
    "إدارة التجار والاشتراكات والدعم من حساب المالك.":["Gérez les vendeurs, abonnements et demandes d’assistance depuis le compte propriétaire.","Manage merchants, subscriptions and support from the owner account.","Gestiona vendedores, suscripciones y soporte desde la cuenta del propietario.","Verwalten Sie Händler, Abonnements und Support über das Inhaberkonto.","Satıcıları, abonelikleri ve desteği sahip hesabından yönetin."],
    "جارٍ التحقق من صلاحيات المالك...":["Vérification des autorisations du propriétaire...","Verifying owner permissions...","Verificando los permisos del propietario...","Berechtigungen des Inhabers werden überprüft...","Sahip izinleri doğrulanıyor..."],
    "تحديث البيانات ↻":["Actualiser les données ↻","Refresh data ↻","Actualizar datos ↻","Daten aktualisieren ↻","Verileri yenile ↻"],
    "الحسابات":["Comptes","Accounts","Cuentas","Konten","Hesaplar"],
    "المتاجر":["Boutiques","Stores","Tiendas","Shops","Mağazalar"],
    "المنتجات":["Produits","Products","Productos","Produkte","Ürünler"],
    "الطلبات":["Commandes","Orders","Pedidos","Bestellungen","Siparişler"],
    "دفعات معلّقة":["Paiements en attente","Pending payments","Pagos pendientes","Ausstehende Zahlungen","Bekleyen ödemeler"],
    "رسائل دعم مفتوحة":["Demandes d’assistance ouvertes","Open support messages","Mensajes de soporte abiertos","Offene Supportanfragen","Açık destek mesajları"],
    "نظرة عامة":["Vue d’ensemble","Overview","Resumen","Übersicht","Genel bakış"],
    "التجار والاشتراكات":["Vendeurs et abonnements","Merchants & subscriptions","Vendedores y suscripciones","Händler & Abonnements","Satıcılar ve abonelikler"],
    "طلبات الدفع":["Demandes de paiement","Payment requests","Solicitudes de pago","Zahlungsanfragen","Ödeme talepleri"],
    "🏆 المتاجر المميزة":["🏆 Boutiques à la une","🏆 Featured stores","🏆 Tiendas destacadas","🏆 Hervorgehobene Shops","🏆 Öne çıkan mağazalar"],
    "📢 الإعلانات":["📢 Publicités","📢 Ads","📢 Anuncios","📢 Anzeigen","📢 Reklamlar"],
    "الدعم الفني":["Assistance","Support","Soporte técnico","Support","Destek"],
    "ملخص المنصة":["Résumé de la plateforme","Platform summary","Resumen de la plataforma","Plattformübersicht","Platform özeti"],
    "إحصائيات محدثة من قاعدة البيانات.":["Statistiques actualisées depuis la base de données.","Live statistics from the database.","Estadísticas actualizadas desde la base de datos.","Aktuelle Statistiken aus der Datenbank.","Veritabanından güncel istatistikler."],
    "المتاجر المنشورة":["Boutiques publiées","Published stores","Tiendas publicadas","Veröffentlichte Shops","Yayındaki mağazalar"],
    "الاشتراكات المدفوعة أو التجريبية":["Abonnements payants ou d’essai","Paid or trial subscriptions","Suscripciones de pago o de prueba","Bezahlte oder Test-Abonnements","Ücretli veya deneme abonelikleri"],
    "هذه اللوحة مرتبطة بحساب المالك الحالي. لا يستطيع التاجر فتحها بمجرد معرفة رابطها؛ يتم التحقق من الصلاحية داخل قاعدة البيانات أيضاً.":["Ce panneau est lié au compte propriétaire actuel. Un vendeur ne peut pas y accéder simplement avec le lien ; l’autorisation est également vérifiée dans la base de données.","This panel is linked to the current owner account. A merchant cannot access it just by knowing the URL; permissions are also checked in the database.","Este panel está vinculado a la cuenta del propietario. Un vendedor no puede acceder solo conociendo el enlace; los permisos también se verifican en la base de datos.","Dieses Panel ist mit dem aktuellen Inhaberkonto verknüpft. Händler erhalten nicht allein durch Kenntnis der URL Zugriff; die Berechtigung wird auch in der Datenbank geprüft.","Bu panel mevcut sahip hesabına bağlıdır. Satıcı yalnızca bağlantıyı bilerek erişemez; izin veritabanında da doğrulanır."],
    "عرض حسابات التجار والتحكم في الخطة والمدة.":["Consultez les comptes vendeurs et gérez leur offre et leur durée.","View merchant accounts and manage their plan and duration.","Consulta las cuentas de vendedores y administra el plan y la duración.","Händlerkonten anzeigen und Tarif sowie Laufzeit verwalten.","Satıcı hesaplarını görüntüleyin, planı ve süreyi yönetin."],
    "ابحث بالبريد أو اسم المتجر":["Rechercher par e-mail ou nom de boutique","Search by email or store name","Buscar por correo o nombre de tienda","Nach E-Mail oder Shopnamen suchen","E-posta veya mağaza adına göre ara"],
    "التاجر":["Vendeur","Merchant","Vendedor","Händler","Satıcı"],
    "المتجر":["Boutique","Store","Tienda","Shop","Mağaza"],
    "الخطة":["Offre","Plan","Plan","Tarif","Plan"],
    "الحالة":["Statut","Status","Estado","Status","Durum"],
    "نهاية الاشتراك":["Fin de l’abonnement","Subscription end","Fin de la suscripción","Ende des Abonnements","Abonelik bitişi"],
    "إجراء":["Action","Action","Acción","Aktion","İşlem"],
    "جارٍ التحميل...":["Chargement...","Loading...","Cargando...","Wird geladen...","Yükleniyor..."],
    "لم ينشئ متجراً":["Aucune boutique créée","No store created","No ha creado una tienda","Kein Shop erstellt","Mağaza oluşturmadı"],
    "حفظ":["Enregistrer","Save","Guardar","Speichern","Kaydet"],
    "راجع بيانات التحويل قبل اعتماد أي طلب.":["Vérifiez les informations du transfert avant d’approuver une demande.","Review transfer details before approving any request.","Revisa los datos de la transferencia antes de aprobar una solicitud.","Prüfen Sie die Überweisungsdaten, bevor Sie eine Anfrage genehmigen.","Bir talebi onaylamadan önce transfer bilgilerini kontrol edin."],
    "بيانات استقبال الاشتراكات":["Coordonnées de réception des abonnements","Subscription payment details","Datos para recibir pagos de suscripciones","Zahlungsdaten für Abonnements","Abonelik ödeme bilgileri"],
    "أدخل بيانات BaridiMob وCCP التي ستظهر للتجار المسجلين قبل التحويل.":["Saisissez les coordonnées BaridiMob et CCP qui seront affichées aux vendeurs avant le transfert.","Enter the BaridiMob and CCP details shown to registered merchants before payment.","Introduce los datos de BaridiMob y CCP que verán los vendedores antes de transferir.","Geben Sie die BaridiMob- und CCP-Daten ein, die Händlern vor der Überweisung angezeigt werden.","Satıcılara ödeme öncesinde gösterilecek BaridiMob ve CCP bilgilerini girin."],
    "اسم صاحب الحساب":["Nom du titulaire du compte","Account holder name","Nombre del titular de la cuenta","Name des Kontoinhabers","Hesap sahibi adı"],
    "رقم BaridiMob":["Numéro BaridiMob","BaridiMob number","Número de BaridiMob","BaridiMob-Nummer","BaridiMob numarası"],
    "رقم CCP":["Numéro CCP","CCP number","Número CCP","CCP-Nummer","CCP numarası"],
    "تعليمات إضافية للتحويل":["Instructions supplémentaires pour le transfert","Additional transfer instructions","Instrucciones adicionales de transferencia","Zusätzliche Überweisungshinweise","Ek transfer talimatları"],
    "حفظ بيانات الاستلام":["Enregistrer les coordonnées","Save payment details","Guardar datos de pago","Zahlungsdaten speichern","Ödeme bilgilerini kaydet"],
    "طلبات تمييز المتاجر":["Demandes de mise en avant des boutiques","Featured store requests","Solicitudes de tiendas destacadas","Anfragen für hervorgehobene Shops","Öne çıkan mağaza talepleri"],
    "راجع وصل التحويل ثم وافق لإبراز المتجر لمدة 7 أيام مقابل 500 دج.":["Vérifiez le reçu puis approuvez la mise en avant pendant 7 jours pour 500 DZD.","Review the receipt, then approve the store's 7-day feature for 500 DZD.","Revisa el recibo y aprueba la promoción de la tienda durante 7 días por 500 DZD.","Prüfen Sie den Beleg und genehmigen Sie die Hervorhebung für 7 Tage zum Preis von 500 DZD.","Makbuzu kontrol edin ve mağazayı 500 DZD karşılığında 7 gün öne çıkarın."],
    "إدارة الإعلانات المدفوعة":["Gestion des publicités payantes","Paid ads management","Gestión de anuncios de pago","Verwaltung bezahlter Anzeigen","Ücretli reklam yönetimi"],
    "أنشئ إعلاناً برعاية شركة أو متجر وحدد موعد ظهوره ورابطه.":["Créez une publicité sponsorisée et définissez sa période et son lien.","Create a sponsored ad and set its schedule and destination link.","Crea un anuncio patrocinado y define su calendario y enlace.","Erstellen Sie eine gesponserte Anzeige und legen Sie Zeitraum und Link fest.","Sponsorlu reklam oluşturun, yayın tarihini ve bağlantısını belirleyin."],
    "اسم الشركة أو المعلن":["Nom de l’entreprise ou de l’annonceur","Company or advertiser name","Nombre de la empresa o anunciante","Unternehmens- oder Werbename","Şirket veya reklamveren adı"],
    "اسم الإعلان":["Nom de la publicité","Ad title","Título del anuncio","Anzeigentitel","Reklam başlığı"],
    "سعر الإعلان بالدينار الجزائري":["Prix de la publicité en dinars algériens","Ad price in Algerian dinars","Precio del anuncio en dinares argelinos","Anzeigenpreis in algerischen Dinar","Reklam fiyatı (Cezayir dinarı)"],
    "صور الإعلان (يمكن اختيار عدة صور)":["Images de la publicité (plusieurs possibles)","Ad images (select multiple)","Imágenes del anuncio (puedes elegir varias)","Anzeigenbilder (mehrere auswählbar)","Reklam görselleri (birden fazla seçilebilir)"],
    "أو رابط صورة مباشر (اختياري)":["Ou URL directe de l’image (facultatif)","Or direct image URL (optional)","O URL directa de imagen (opcional)","Oder direkte Bild-URL (optional)","Veya doğrudan görsel bağlantısı (isteğe bağlı)"],
    "رابط الوجهة (HTTPS)":["Lien de destination (HTTPS)","Destination URL (HTTPS)","Enlace de destino (HTTPS)","Ziel-URL (HTTPS)","Hedef bağlantı (HTTPS)"],
    "بداية العرض":["Début de diffusion","Start date","Inicio de publicación","Anzeigebeginn","Yayın başlangıcı"],
    "نهاية العرض":["Fin de diffusion","End date","Fin de publicación","Anzeigenende","Yayın bitişi"],
    "إضافة الإعلان":["Ajouter la publicité","Add ad","Añadir anuncio","Anzeige hinzufügen","Reklam ekle"],
    "إلغاء التعديل":["Annuler la modification","Cancel edit","Cancelar edición","Bearbeitung abbrechen","Düzenlemeyi iptal et"],
    "الإعلانات الحالية والسابقة":["Publicités actuelles et précédentes","Current and past ads","Anuncios actuales y anteriores","Aktuelle und frühere Anzeigen","Mevcut ve önceki reklamlar"],
    "مركز الدعم الفني":["Centre d’assistance","Support center","Centro de soporte","Supportcenter","Destek merkezi"],
    "استقبل رسائل التجار وأجب عنها وتابع حالتها.":["Recevez les messages des vendeurs, répondez et suivez leur statut.","Receive merchant messages, reply, and track their status.","Recibe mensajes de vendedores, responde y sigue su estado.","Empfangen Sie Händlernachrichten, antworten Sie und verfolgen Sie den Status.","Satıcı mesajlarını alın, yanıtlayın ve durumlarını takip edin."],
    "تسجيل الخروج":["Déconnexion","Log out","Cerrar sesión","Abmelden","Çıkış yap"],
    "لوحة التاجر":["Tableau de bord vendeur","Merchant dashboard","Panel del vendedor","Händler-Dashboard","Satıcı paneli"],
    "جارٍ تحديث بيانات المنصة...":["Actualisation des données de la plateforme...","Refreshing platform data...","Actualizando los datos de la plataforma...","Plattformdaten werden aktualisiert...","Platform verileri yenileniyor..."],
    "تم تحديث جميع البيانات.":["Toutes les données ont été actualisées.","All data refreshed.","Todos los datos actualizados.","Alle Daten wurden aktualisiert.","Tüm veriler yenilendi."],
    "تعذر تحديث بعض البيانات:":["Impossible d’actualiser certaines données :","Some data could not be refreshed:","No se pudieron actualizar algunos datos:","Einige Daten konnten nicht aktualisiert werden:","Bazı veriler yenilenemedi:"],
    "لا توجد نتائج.":["Aucun résultat.","No results.","No hay resultados.","Keine Ergebnisse.","Sonuç bulunamadı."],
    "لا توجد طلبات دفع حتى الآن.":["Aucune demande de paiement pour le moment.","No payment requests yet.","Todavía no hay solicitudes de pago.","Noch keine Zahlungsanfragen.","Henüz ödeme talebi yok."],
    "لا توجد طلبات تمييز حتى الآن.":["Aucune demande de mise en avant pour le moment.","No featured store requests yet.","Aún no hay solicitudes de tiendas destacadas.","Noch keine Anfragen für hervorgehobene Shops.","Henüz öne çıkarma talebi yok."],
    "لا توجد إعلانات بعد. أضف أول إعلان من النموذج أعلاه.":["Aucune publicité pour le moment. Ajoutez-en une avec le formulaire ci-dessus.","No ads yet. Add your first ad using the form above.","Todavía no hay anuncios. Añade el primero con el formulario anterior.","Noch keine Anzeigen. Fügen Sie oben Ihre erste Anzeige hinzu.","Henüz reklam yok. Yukarıdaki formdan ilk reklamı ekleyin."],
    "📊 إحصائيات الزوار":["📊 Statistiques des visiteurs","📊 Visitor analytics","📊 Estadísticas de visitantes","📊 Besucherstatistiken","📊 Ziyaretçi istatistikleri"],
    "إحصائيات الزوار":["Statistiques des visiteurs","Visitor analytics","Estadísticas de visitantes","Besucherstatistiken","Ziyaretçi istatistikleri"],
    "عدد الزوار الفريدين ومشاهدات الصفحات المسجلة منذ تفعيل الإحصائيات.":["Nombre de visiteurs uniques et pages vues enregistrés depuis l’activation des statistiques.","Unique visitors and page views recorded since analytics was enabled.","Visitantes únicos y páginas vistas desde que se activaron las estadísticas.","Eindeutige Besucher und Seitenaufrufe seit Aktivierung der Statistiken.","İstatistikler etkinleştirildiğinden beri kaydedilen tekil ziyaretçiler ve sayfa görüntülemeleri."],
    "الفترة":["Période","Period","Período","Zeitraum","Dönem"],
    "آخر 7 أيام":["7 derniers jours","Last 7 days","Últimos 7 días","Letzte 7 Tage","Son 7 gün"],
    "آخر 30 يوماً":["30 derniers jours","Last 30 days","Últimos 30 días","Letzte 30 Tage","Son 30 gün"],
    "آخر 90 يوماً":["90 derniers jours","Last 90 days","Últimos 90 días","Letzte 90 Tage","Son 90 gün"],
    "إجمالي الزوار الفريدين":["Total des visiteurs uniques","Total unique visitors","Total de visitantes únicos","Eindeutige Besucher insgesamt","Toplam tekil ziyaretçi"],
    "إجمالي مشاهدات الصفحات":["Total des pages vues","Total page views","Total de páginas vistas","Seitenaufrufe insgesamt","Toplam sayfa görüntüleme"],
    "زوار اليوم":["Visiteurs aujourd’hui","Today's visitors","Visitantes de hoy","Heutige Besucher","Bugünün ziyaretçileri"],
    "مشاهدات اليوم":["Pages vues aujourd’hui","Today's page views","Páginas vistas hoy","Heutige Seitenaufrufe","Bugünkü sayfa görüntülemeleri"],
    "النشاط اليومي":["Activité quotidienne","Daily activity","Actividad diaria","Tägliche Aktivität","Günlük etkinlik"],
    "التاريخ":["Date","Date","Fecha","Datum","Tarih"],
    "الزوار الفريدون":["Visiteurs uniques","Unique visitors","Visitantes únicos","Eindeutige Besucher","Tekil ziyaretçiler"],
    "مشاهدات الصفحات":["Pages vues","Page views","Páginas vistas","Seitenaufrufe","Sayfa görüntülemeleri"],
    "جارٍ تحميل الإحصائيات...":["Chargement des statistiques...","Loading analytics...","Cargando estadísticas...","Statistiken werden geladen...","İstatistikler yükleniyor..."],
    "لا توجد زيارات مسجلة في هذه الفترة.":["Aucune visite enregistrée pendant cette période.","No visits recorded during this period.","No hay visitas registradas en este período.","In diesem Zeitraum wurden keine Besuche erfasst.","Bu dönemde kayıtlı ziyaret yok."],
    "تعتمد الأرقام على معرّف عشوائي محفوظ في المتصفح. قد يُحسب الشخص أكثر من مرة عند تغيير المتصفح أو الجهاز أو حذف بيانات التصفح. لا تُجمع الأسماء أو عناوين IP.":["Les chiffres reposent sur un identifiant aléatoire enregistré dans le navigateur. Une personne peut être comptée plusieurs fois si elle change de navigateur ou d’appareil ou efface ses données. Aucun nom ni adresse IP n’est collecté.","Counts use a random browser-stored ID. A person may be counted more than once if they change browsers or devices or clear browsing data. No names or IP addresses are collected.","Las cifras usan un identificador aleatorio guardado en el navegador. Una persona puede contarse varias veces si cambia de navegador o dispositivo o borra sus datos. No se recopilan nombres ni direcciones IP.","Die Zahlen verwenden eine zufällige Browser-ID. Eine Person kann mehrfach gezählt werden, wenn sie Browser oder Gerät wechselt oder Browserdaten löscht. Namen und IP-Adressen werden nicht erfasst.","Sayımlar tarayıcıda saklanan rastgele bir kimlik kullanır. Tarayıcı veya cihaz değiştirilirse ya da veriler silinirse kişi birden fazla sayılabilir. Ad veya IP adresi toplanmaz."],
    "لا توجد رسائل دعم.":["Aucun message d’assistance.","No support messages.","No hay mensajes de soporte.","Keine Supportnachrichten.","Destek mesajı yok."]
  };
  const dictionaries = Object.fromEntries(languages.map((lang,index)=>[lang,Object.fromEntries(Object.entries(rows).map(([ar,values])=>[ar,values[index]]))]));
  const reverse = Object.fromEntries(languages.map(lang=>[lang,Object.fromEntries(Object.entries(dictionaries[lang]).map(([ar,value])=>[value,ar]))]));
  let current = "ar";
  const entries = Object.fromEntries(languages.map(lang=>[lang,Object.entries(dictionaries[lang]).sort((a,b)=>b[0].length-a[0].length)]));
  const reverseEntries = Object.fromEntries(languages.map(lang=>[lang,Object.entries(reverse[lang]).sort((a,b)=>b[0].length-a[0].length)]));
  function translate(value){
    const raw=String(value??""); const trimmed=raw.trim(); if(!trimmed)return raw;
    let source=trimmed;
    for(const lang of languages){for(const [translated,arabic] of reverseEntries[lang]){if(source===translated){source=arabic;break;}if(translated.length>2&&source.includes(translated))source=source.replaceAll(translated,arabic);}}
    if(current==="ar")return raw.replace(trimmed,source);
    let out=source;
    for(const [arabic,translated] of entries[current]){if(out===arabic){out=translated;break;}if(arabic.length>2&&out.includes(arabic))out=out.replaceAll(arabic,translated);}
    return raw.replace(trimmed,out);
  }
  function translateRoot(root){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
    while((node=walker.nextNode())){
      if(node.parentElement?.closest("script,style,textarea,input,[contenteditable=true]"))continue;
      const next=translate(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;
    }
    root.querySelectorAll?.("input,textarea,select,button,a,img").forEach(el=>{
      for(const attr of ["placeholder","title","aria-label","alt"])if(el.hasAttribute(attr))el.setAttribute(attr,translate(el.getAttribute(attr)));
    });
  }
  function apply(lang){
    current=["ar",...languages].includes(lang)?lang:"ar";
    document.documentElement.lang=current;document.documentElement.dir=current==="ar"?"rtl":"ltr";
    try{localStorage.setItem("msdz-language",current);}catch(_){}
    document.title=translate("لوحة إدارة MINABYB");
    translateRoot(document.body);
    const picker=document.getElementById("adminLanguageSelect");if(picker)picker.value=current;
  }
  document.addEventListener("DOMContentLoaded",()=>{
    try{const saved=localStorage.getItem("msdz-language");current=["ar",...languages].includes(saved)?saved:"ar";}catch(_){}
    const actions=document.querySelector(".admin-header-actions");
    if(actions&&!document.getElementById("adminLanguageSelect")){
      const label=document.createElement("label");label.className="language-picker";
      label.innerHTML='<span class="sr-only">Language</span><select id="adminLanguageSelect" aria-label="Choose language"><option value="ar">العربية</option><option value="fr">Français</option><option value="en">English</option><option value="es">Español</option><option value="de">Deutsch</option><option value="tr">Türkçe</option></select>';
      actions.insertBefore(label,actions.firstChild);label.querySelector("select").addEventListener("change",event=>apply(event.target.value));
    }
    apply(current);
    const observer=new MutationObserver(records=>{for(const record of records)for(const added of record.addedNodes){if(added.nodeType===Node.ELEMENT_NODE)translateRoot(added);else if(added.nodeType===Node.TEXT_NODE){const next=translate(added.nodeValue);if(next!==added.nodeValue)added.nodeValue=next;}}});
    observer.observe(document.body,{subtree:true,childList:true});
  });
})();