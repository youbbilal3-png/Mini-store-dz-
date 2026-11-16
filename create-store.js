import { supabase } from "./supabase-client.js";
const $=id=>document.getElementById(id);
const translations={
 ar:{home:"الرئيسية",title:"أنشئ متجرك الإلكتروني",intro:"أدخل معلومات متجرك. سيبقى حسابك نفسه، وبعد إنشاء المتجر ستتمكن من الدخول إلى لوحة التاجر وإضافة منتجاتك.",storeName:"اسم المتجر",sellerName:"اسم صاحب المتجر",country:"البلد",wilaya:"الولاية",region:"المنطقة / الولاية الإدارية (اختياري)",chooseCountry:"اختر البلد",chooseWilaya:"اختر الولاية",locationRequired:"اختر البلد والولاية قبل المتابعة.",bio:"نبذة قصيرة عن المتجر (اختياري)",whatsapp:"رقم WhatsApp مع رمز الدولة (اختياري)",submit:"إنشاء متجري",note:"لن يتم إنشاء متجر إلا بعد الضغط على زر إنشاء متجري بنجاح.",checking:"جارٍ التحقق من حسابك...",login:"يرجى تسجيل الدخول أولاً.",exists:"لديك متجر بالفعل. جارٍ فتح لوحة التاجر...",saving:"جارٍ إنشاء متجرك...",success:"تم إنشاء متجرك بنجاح! جارٍ فتح لوحة التاجر...",error:"تعذر إنشاء المتجر. تحقق من البيانات والاتصال ثم حاول مجدداً.",nameRequired:"أدخل اسم المتجر واسم صاحبه.",badPhone:"تحقق من رقم WhatsApp أو اتركه فارغاً."},
 fr:{home:"Accueil",title:"Créez votre boutique en ligne",intro:"Renseignez les informations de votre boutique. Vous garderez le même compte et accéderez à votre espace marchand après sa création.",storeName:"Nom de la boutique",sellerName:"Nom du propriétaire",country:"Pays",wilaya:"Wilaya",region:"Région / État (facultatif)",chooseCountry:"Choisir un pays",chooseWilaya:"Choisir une wilaya",locationRequired:"Choisissez un pays et une wilaya.",bio:"Courte description (facultatif)",whatsapp:"WhatsApp avec indicatif pays (facultatif)",submit:"Créer ma boutique",note:"La boutique sera créée uniquement après validation du formulaire.",checking:"Vérification du compte...",login:"Veuillez vous connecter.",exists:"Vous avez déjà une boutique. Ouverture...",saving:"Création de la boutique...",success:"Boutique créée ! Ouverture de votre espace...",error:"Création impossible. Vérifiez les informations et réessayez.",nameRequired:"Saisissez le nom de la boutique et du propriétaire.",badPhone:"Vérifiez le numéro WhatsApp ou laissez-le vide."},
 en:{home:"Home",title:"Create your online store",intro:"Enter your store details. Keep using the same account; your merchant dashboard will be available after the store is created.",storeName:"Store name",sellerName:"Store owner name",country:"Country",wilaya:"Wilaya",region:"State / Region (optional)",chooseCountry:"Choose a country",chooseWilaya:"Choose a wilaya",locationRequired:"Choose a country and wilaya to continue.",bio:"Short store description (optional)",whatsapp:"WhatsApp with country code (optional)",submit:"Create my store",note:"Your store is created only after you submit this form successfully.",checking:"Checking your account...",login:"Please log in first.",exists:"You already have a store. Opening dashboard...",saving:"Creating your store...",success:"Your store was created. Opening dashboard...",error:"Could not create the store. Check the details and try again.",nameRequired:"Enter the store name and owner name.",badPhone:"Check the WhatsApp number or leave it empty."},
 es:{home:"Inicio",title:"Crea tu tienda online",intro:"Introduce los datos de tu tienda. Mantendrás la misma cuenta y accederás al panel de vendedor cuando se cree.",storeName:"Nombre de la tienda",sellerName:"Nombre del propietario",country:"País",wilaya:"Wilaya",region:"Región / Estado (opcional)",chooseCountry:"Elige un país",chooseWilaya:"Elige una wilaya",locationRequired:"Elige un país y una wilaya.",bio:"Descripción breve (opcional)",whatsapp:"WhatsApp con prefijo del país (opcional)",submit:"Crear mi tienda",note:"La tienda solo se crea después de enviar correctamente este formulario.",checking:"Verificando cuenta...",login:"Inicia sesión primero.",exists:"Ya tienes una tienda. Abriendo el panel...",saving:"Creando tu tienda...",success:"Tienda creada. Abriendo el panel...",error:"No se pudo crear la tienda. Revisa los datos e inténtalo de nuevo.",nameRequired:"Introduce el nombre de la tienda y del propietario.",badPhone:"Comprueba el número de WhatsApp o déjalo vacío."},
 de:{home:"Startseite",title:"Erstelle deinen Online-Shop",intro:"Gib die Daten deines Shops ein. Du behältst dasselbe Konto und erhältst nach der Erstellung Zugang zum Händler-Dashboard.",storeName:"Shopname",sellerName:"Name des Shopinhabers",country:"Land",wilaya:"Wilaya",region:"Region / Bundesland (optional)",chooseCountry:"Land auswählen",chooseWilaya:"Wilaya auswählen",locationRequired:"Bitte Land und Wilaya auswählen.",bio:"Kurze Beschreibung (optional)",whatsapp:"WhatsApp mit Ländervorwahl (optional)",submit:"Meinen Shop erstellen",note:"Der Shop wird erst nach erfolgreichem Absenden erstellt.",checking:"Konto wird geprüft...",login:"Bitte zuerst anmelden.",exists:"Du hast bereits einen Shop. Dashboard wird geöffnet...",saving:"Shop wird erstellt...",success:"Shop erstellt. Dashboard wird geöffnet...",error:"Shop konnte nicht erstellt werden. Bitte Angaben prüfen.",nameRequired:"Shopname und Inhabername eingeben.",badPhone:"WhatsApp-Nummer prüfen oder leer lassen."},
 tr:{home:"Ana sayfa",title:"Çevrimiçi mağazanızı oluşturun",intro:"Mağaza bilgilerinizi girin. Aynı hesabı kullanmaya devam edeceksiniz; mağaza oluşturulduktan sonra satıcı paneliniz açılır.",storeName:"Mağaza adı",sellerName:"Mağaza sahibi",country:"Ülke",wilaya:"Wilaya",region:"Bölge / Eyalet (isteğe bağlı)",chooseCountry:"Ülke seçin",chooseWilaya:"Wilaya seçin",locationRequired:"Devam etmek için ülke ve wilaya seçin.",bio:"Kısa mağaza açıklaması (isteğe bağlı)",whatsapp:"Ülke koduyla WhatsApp (isteğe bağlı)",submit:"Mağazamı oluştur",note:"Mağazanız yalnızca form başarıyla gönderildikten sonra oluşturulur.",checking:"Hesap kontrol ediliyor...",login:"Lütfen önce giriş yapın.",exists:"Zaten bir mağazanız var. Panel açılıyor...",saving:"Mağazanız oluşturuluyor...",success:"Mağazanız oluşturuldu. Panel açılıyor...",error:"Mağaza oluşturulamadı. Bilgileri kontrol edip tekrar deneyin.",nameRequired:"Mağaza ve sahip adını girin.",badPhone:"WhatsApp numarasını kontrol edin veya boş bırakın."}
};
Object.assign(translations.ar,{limitReached:"وصلت إلى الحد الأقصى لعدد المتاجر في باقتك. قم بالترقية لإنشاء متجر آخر."});
Object.assign(translations.fr,{limitReached:"Vous avez atteint la limite de boutiques de votre forfait. Passez à une offre supérieure."});
Object.assign(translations.en,{limitReached:"You have reached your plan’s store limit. Upgrade to create another store."});
Object.assign(translations.es,{limitReached:"Has alcanzado el límite de tiendas de tu plan. Actualiza para crear otra tienda."});
Object.assign(translations.de,{limitReached:"Du hast das Shop-Limit deines Tarifs erreicht. Upgrade, um einen weiteren Shop zu erstellen."});
Object.assign(translations.tr,{limitReached:"Planınızdaki mağaza sınırına ulaştınız. Yeni mağaza için planınızı yükseltin."});
Object.assign(translations.ar,{"storePhoto":"صورة المتجر (مطلوبة)","choosePhoto":"📷 إضافة صورة المتجر","removePhoto":"حذف الصورة","photoHint":"صورة واضحة لشعار أو واجهة متجرك، JPEG أو PNG أو WebP، بحد أقصى 2 ميغابايت.","photoRequired":"أضف صورة لمتجرك قبل إنشائه.","photoType":"اختر صورة بصيغة JPEG أو PNG أو WebP فقط.","photoSize":"يجب ألا يتجاوز حجم الصورة 2 ميغابايت.","uploadingPhoto":"جارٍ رفع صورة المتجر..."});
Object.assign(translations.fr,{"storePhoto":"Image de la boutique (obligatoire)","choosePhoto":"📷 Ajouter une image","removePhoto":"Supprimer l’image","photoHint":"Ajoutez un logo ou une photo claire. JPEG, PNG ou WebP, 2 Mo maximum.","photoRequired":"Ajoutez une image avant de créer votre boutique.","photoType":"Choisissez une image JPEG, PNG ou WebP.","photoSize":"L’image ne doit pas dépasser 2 Mo.","uploadingPhoto":"Téléversement de l’image..."});
Object.assign(translations.en,{"storePhoto":"Store image (required)","choosePhoto":"📷 Add store image","removePhoto":"Remove image","photoHint":"Add a clear store logo or storefront photo. JPEG, PNG or WebP, up to 2 MB.","photoRequired":"Add a store image before creating your store.","photoType":"Choose a JPEG, PNG or WebP image.","photoSize":"The image must not exceed 2 MB.","uploadingPhoto":"Uploading store image..."});
Object.assign(translations.es,{"storePhoto":"Imagen de la tienda (obligatoria)","choosePhoto":"📷 Añadir imagen","removePhoto":"Eliminar imagen","photoHint":"Añade un logotipo o una foto clara. JPEG, PNG o WebP, máximo 2 MB.","photoRequired":"Añade una imagen antes de crear tu tienda.","photoType":"Elige una imagen JPEG, PNG o WebP.","photoSize":"La imagen no debe superar los 2 MB.","uploadingPhoto":"Subiendo imagen..."});
Object.assign(translations.de,{"storePhoto":"Shopbild (erforderlich)","choosePhoto":"📷 Shopbild hinzufügen","removePhoto":"Bild entfernen","photoHint":"Füge ein klares Shoplogo oder Ladenfoto hinzu. JPEG, PNG oder WebP, maximal 2 MB.","photoRequired":"Füge vor dem Erstellen ein Shopbild hinzu.","photoType":"Wähle ein JPEG-, PNG- oder WebP-Bild.","photoSize":"Das Bild darf höchstens 2 MB groß sein.","uploadingPhoto":"Shopbild wird hochgeladen..."});
Object.assign(translations.tr,{"storePhoto":"Mağaza görseli (gerekli)","choosePhoto":"📷 Mağaza görseli ekle","removePhoto":"Görseli kaldır","photoHint":"Mağazanızın logosunu veya net bir fotoğrafını ekleyin. JPEG, PNG veya WebP, en fazla 2 MB.","photoRequired":"Mağazanızı oluşturmadan önce görsel ekleyin.","photoType":"JPEG, PNG veya WebP görsel seçin.","photoSize":"Görsel en fazla 2 MB olmalıdır.","uploadingPhoto":"Mağaza görseli yükleniyor..."});
let lang="ar",words=translations.ar,currentUser=null,selectedStorePhoto=null,existingStorePhotoUrl=null,uploadedPhotoPath=null,existingDraft=null;
function refreshCreateStoreLocationOptions(selectedCountry,selectedWilaya,selectedRegion){
 const geo=window.MINABYBLocations;if(!geo)return;
 const countrySelect=$("newStoreCountry"),wilayaSelect=$("newStoreWilaya");
 const countryValue=selectedCountry!==undefined?selectedCountry:countrySelect.value;
 geo.populateCountrySelect(countrySelect,{lang,selected:countryValue,placeholder:words.chooseCountry});
 const country=countrySelect.value,isAlgeria=country==="DZ";
 $("newStoreWilayaWrap").hidden=!isAlgeria;
 $("newStoreRegionWrap").hidden=!country||isAlgeria;
 geo.populateWilayaSelect(wilayaSelect,{lang,selected:selectedWilaya!==undefined?selectedWilaya:wilayaSelect.value,placeholder:words.chooseWilaya});
 wilayaSelect.required=isAlgeria;
 if(selectedRegion!==undefined)$("newStoreRegion").value=selectedRegion||"";
 if(isAlgeria)$("newStoreRegion").value="";
}
function applyLanguage(next){lang=translations[next]?next:"ar";words=translations[lang];document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";document.querySelectorAll("[data-t]").forEach(node=>{const key=node.dataset.t;if(words[key])node.textContent=words[key];});$("createStoreLanguage").value=lang;try{localStorage.setItem("msdz-language",lang);}catch(e){}refreshCreateStoreLocationOptions();}
const requested=new URLSearchParams(location.search).get("lang");let saved="ar";try{saved=localStorage.getItem("msdz-language")||"ar";}catch(e){}applyLanguage(translations[requested]?requested:saved);
$("createStoreLanguage").addEventListener("change",e=>applyLanguage(e.target.value));
$("newStoreCountry").addEventListener("change",()=>refreshCreateStoreLocationOptions());
function makeSlug(userId,storeId){return "store-"+String(storeId).replace(/-/g,"").slice(0,20).toLowerCase();}
function showStorePhoto(url){const image=$("storePhotoPreviewImage"),fallback=$("storePhotoFallback");if(url){image.src=url;image.hidden=false;fallback.hidden=true;}else{image.removeAttribute("src");image.hidden=true;fallback.hidden=false;}}
function clearStorePhoto(){selectedStorePhoto=null;existingStorePhotoUrl=null;$("newStorePhoto").value="";showStorePhoto("");}
$("newStorePhoto").addEventListener("change",event=>{const file=event.target.files?.[0];if(!file)return;if(!["image/jpeg","image/png","image/webp"].includes(file.type)){event.target.value="";selectedStorePhoto=null;showStorePhoto(existingStorePhotoUrl);$("createStoreFeedback").textContent=words.photoType;return;}if(file.size>2*1024*1024){event.target.value="";selectedStorePhoto=null;showStorePhoto(existingStorePhotoUrl);$("createStoreFeedback").textContent=words.photoSize;return;}selectedStorePhoto=file;existingStorePhotoUrl=null;showStorePhoto(URL.createObjectURL(file));});
$("removeNewStorePhoto").addEventListener("click",()=>{clearStorePhoto();$("createStoreFeedback").textContent=words.photoRequired;});
function photoExtension(file){return file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";}
async function uploadStorePhoto(file,storeId){const path=currentUser.id+"/"+storeId+"/avatar/"+crypto.randomUUID()+"."+photoExtension(file);const {error}=await supabase.storage.from("store-avatars").upload(path,file,{upsert:false,contentType:file.type});if(error)throw error;uploadedPhotoPath=path;return supabase.storage.from("store-avatars").getPublicUrl(path).data.publicUrl;}
async function init(){
 $("createStoreFeedback").textContent=words.checking;
 const {data,error}=await supabase.auth.getUser();
 if(error||!data?.user){$("createStoreFeedback").textContent=words.login;setTimeout(()=>location.replace("auth.html?next=create-store.html&lang="+encodeURIComponent(lang)),700);return;}
 currentUser=data.user;
 $("newSellerName").value=currentUser.user_metadata?.full_name||"";
 const {data:stores,error:lookupError}=await supabase.from("stores").select("id,slug,setup_completed,store_name,seller_name,avatar_url,country_code,wilaya_code,region_name").eq("owner_id",currentUser.id).order("created_at",{ascending:false});
 if(lookupError){$("createStoreFeedback").textContent=words.error;return;}
 existingDraft=(stores||[]).find(item=>!item.setup_completed)||null;
 if(existingDraft){
  refreshCreateStoreLocationOptions(existingDraft.country_code||"",existingDraft.wilaya_code||"",existingDraft.region_name||"");
  $("newStoreName").value=existingDraft.store_name==="متجري"?"":existingDraft.store_name||"";
  $("newSellerName").value=existingDraft.seller_name||$("newSellerName").value;
  existingStorePhotoUrl=existingDraft.avatar_url||null;
  if(existingStorePhotoUrl)showStorePhoto(existingStorePhotoUrl);
 }else{
  const {data:allowed,error:limitError}=await supabase.rpc("can_create_store");
  if(limitError){$("createStoreFeedback").textContent=words.error;return;}
  if(!allowed){$("createStoreFeedback").textContent=words.limitReached||translations.ar.limitReached;$("createStoreSubmit").disabled=true;return;}
  if(stores?.length&&document.querySelector("[data-t=title]"))document.querySelector("[data-t=title]").textContent=lang==="ar"?"أنشئ متجراً إضافياً":lang==="en"?"Create another store":"Créer une autre boutique";
 }
 $("createStoreFeedback").textContent="";
}
$("createStoreForm").addEventListener("submit",async event=>{
 event.preventDefault();if(!currentUser)return;
 const storeName=$("newStoreName").value.trim(),sellerName=$("newSellerName").value.trim(),whatsapp=$("newStoreWhatsapp").value.trim();
 const countryCode=$("newStoreCountry").value,wilayaCode=countryCode==="DZ"?$("newStoreWilaya").value:null,regionName=countryCode!=="DZ"?$("newStoreRegion").value.trim()||null:null;
 if(!countryCode||(countryCode==="DZ"&&!wilayaCode)){$("createStoreFeedback").textContent=words.locationRequired;return;}
 if(!storeName||!sellerName){$("createStoreFeedback").textContent=words.nameRequired;return;}
 if(!selectedStorePhoto&&!existingStorePhotoUrl){$("createStoreFeedback").textContent=words.photoRequired;return;}
 if(whatsapp&&!/^\d{8,20}$/.test(whatsapp.replace(/[\s()+-]/g,""))){$("createStoreFeedback").textContent=words.badPhone;return;}
 const button=$("createStoreSubmit");button.disabled=true;$("createStoreFeedback").textContent=words.saving;
 try{
  const {data:allowed,error:limitError}=await supabase.rpc("can_create_store");
  if(limitError)throw limitError;
  if(!existingDraft&&!allowed)throw new Error(words.limitReached||translations.ar.limitReached);
  const payload={store_name:storeName,seller_name:sellerName,country_code:countryCode,wilaya_code:wilayaCode,region_name:regionName,seller_bio:$("newStoreBio").value.trim()||null,whatsapp:whatsapp.replace(/[\s()+-]/g,"")||null,setup_completed:false};
  let saveResult;
  if(existingDraft){saveResult=await supabase.from("stores").update(payload).eq("id",existingDraft.id).eq("owner_id",currentUser.id).select("id").single();}
  else{const newStoreId=crypto.randomUUID();saveResult=await supabase.from("stores").insert({...payload,id:newStoreId,owner_id:currentUser.id,slug:makeSlug(currentUser.id,newStoreId),is_published:false}).select("id").single();}
  if(saveResult.error)throw saveResult.error;
  const storeId=saveResult.data.id;
  let avatarUrl=existingDraft?.avatar_url||existingStorePhotoUrl||null;
  if(selectedStorePhoto){$("createStoreFeedback").textContent=words.uploadingPhoto;avatarUrl=await uploadStorePhoto(selectedStorePhoto,storeId);}
  if(!avatarUrl)throw new Error("Store image is required.");
  const {error:completeError}=await supabase.from("stores").update({avatar_url:avatarUrl,setup_completed:true}).eq("id",storeId).eq("owner_id",currentUser.id);
  if(completeError)throw completeError;
  uploadedPhotoPath=null;
  $("createStoreFeedback").textContent=words.success;
  location.replace("dashboard.html?store="+encodeURIComponent(storeId)+"&lang="+encodeURIComponent(lang));
 }catch(error){
  console.error("Store creation failed:",error);
  if(uploadedPhotoPath){try{await supabase.storage.from("store-avatars").remove([uploadedPhotoPath]);}catch(cleanupError){console.warn("Store photo cleanup failed:",cleanupError);}uploadedPhotoPath=null;}
  if(error?.code==="23505"){$("createStoreFeedback").textContent="اسم أو رابط المتجر مستخدم بالفعل. حاول مجدداً.";button.disabled=false;return;}
  $("createStoreFeedback").textContent=words.error;
  button.disabled=false;
 }
});
init();
