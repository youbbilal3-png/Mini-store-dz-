import { supabase } from "./supabase-client.js";
const $=id=>document.getElementById(id);
const translations={
 ar:{home:"الرئيسية",title:"أنشئ متجرك الإلكتروني",intro:"أدخل معلومات متجرك. سيبقى حسابك نفسه، وبعد إنشاء المتجر ستتمكن من الدخول إلى لوحة التاجر وإضافة منتجاتك.",storeName:"اسم المتجر",sellerName:"اسم صاحب المتجر",bio:"نبذة قصيرة عن المتجر (اختياري)",whatsapp:"رقم WhatsApp مع رمز الدولة (اختياري)",submit:"إنشاء متجري",note:"لن يتم إنشاء متجر إلا بعد الضغط على زر إنشاء متجري بنجاح.",checking:"جارٍ التحقق من حسابك...",login:"يرجى تسجيل الدخول أولاً.",exists:"لديك متجر بالفعل. جارٍ فتح لوحة التاجر...",saving:"جارٍ إنشاء متجرك...",success:"تم إنشاء متجرك بنجاح! جارٍ فتح لوحة التاجر...",error:"تعذر إنشاء المتجر. تحقق من البيانات والاتصال ثم حاول مجدداً.",nameRequired:"أدخل اسم المتجر واسم صاحبه.",badPhone:"تحقق من رقم WhatsApp أو اتركه فارغاً."},
 fr:{home:"Accueil",title:"Créez votre boutique en ligne",intro:"Renseignez les informations de votre boutique. Vous garderez le même compte et accéderez à votre espace marchand après sa création.",storeName:"Nom de la boutique",sellerName:"Nom du propriétaire",bio:"Courte description (facultatif)",whatsapp:"WhatsApp avec indicatif pays (facultatif)",submit:"Créer ma boutique",note:"La boutique sera créée uniquement après validation du formulaire.",checking:"Vérification du compte...",login:"Veuillez vous connecter.",exists:"Vous avez déjà une boutique. Ouverture...",saving:"Création de la boutique...",success:"Boutique créée ! Ouverture de votre espace...",error:"Création impossible. Vérifiez les informations et réessayez.",nameRequired:"Saisissez le nom de la boutique et du propriétaire.",badPhone:"Vérifiez le numéro WhatsApp ou laissez-le vide."},
 en:{home:"Home",title:"Create your online store",intro:"Enter your store details. Keep using the same account; your merchant dashboard will be available after the store is created.",storeName:"Store name",sellerName:"Store owner name",bio:"Short store description (optional)",whatsapp:"WhatsApp with country code (optional)",submit:"Create my store",note:"Your store is created only after you submit this form successfully.",checking:"Checking your account...",login:"Please log in first.",exists:"You already have a store. Opening dashboard...",saving:"Creating your store...",success:"Your store was created. Opening dashboard...",error:"Could not create the store. Check the details and try again.",nameRequired:"Enter the store name and owner name.",badPhone:"Check the WhatsApp number or leave it empty."},
 es:{home:"Inicio",title:"Crea tu tienda online",intro:"Introduce los datos de tu tienda. Mantendrás la misma cuenta y accederás al panel de vendedor cuando se cree.",storeName:"Nombre de la tienda",sellerName:"Nombre del propietario",bio:"Descripción breve (opcional)",whatsapp:"WhatsApp con prefijo del país (opcional)",submit:"Crear mi tienda",note:"La tienda solo se crea después de enviar correctamente este formulario.",checking:"Verificando cuenta...",login:"Inicia sesión primero.",exists:"Ya tienes una tienda. Abriendo el panel...",saving:"Creando tu tienda...",success:"Tienda creada. Abriendo el panel...",error:"No se pudo crear la tienda. Revisa los datos e inténtalo de nuevo.",nameRequired:"Introduce el nombre de la tienda y del propietario.",badPhone:"Comprueba el número de WhatsApp o déjalo vacío."},
 de:{home:"Startseite",title:"Erstelle deinen Online-Shop",intro:"Gib die Daten deines Shops ein. Du behältst dasselbe Konto und erhältst nach der Erstellung Zugang zum Händler-Dashboard.",storeName:"Shopname",sellerName:"Name des Shopinhabers",bio:"Kurze Beschreibung (optional)",whatsapp:"WhatsApp mit Ländervorwahl (optional)",submit:"Meinen Shop erstellen",note:"Der Shop wird erst nach erfolgreichem Absenden erstellt.",checking:"Konto wird geprüft...",login:"Bitte zuerst anmelden.",exists:"Du hast bereits einen Shop. Dashboard wird geöffnet...",saving:"Shop wird erstellt...",success:"Shop erstellt. Dashboard wird geöffnet...",error:"Shop konnte nicht erstellt werden. Bitte Angaben prüfen.",nameRequired:"Shopname und Inhabername eingeben.",badPhone:"WhatsApp-Nummer prüfen oder leer lassen."},
 tr:{home:"Ana sayfa",title:"Çevrimiçi mağazanızı oluşturun",intro:"Mağaza bilgilerinizi girin. Aynı hesabı kullanmaya devam edeceksiniz; mağaza oluşturulduktan sonra satıcı paneliniz açılır.",storeName:"Mağaza adı",sellerName:"Mağaza sahibi",bio:"Kısa mağaza açıklaması (isteğe bağlı)",whatsapp:"Ülke koduyla WhatsApp (isteğe bağlı)",submit:"Mağazamı oluştur",note:"Mağazanız yalnızca form başarıyla gönderildikten sonra oluşturulur.",checking:"Hesap kontrol ediliyor...",login:"Lütfen önce giriş yapın.",exists:"Zaten bir mağazanız var. Panel açılıyor...",saving:"Mağazanız oluşturuluyor...",success:"Mağazanız oluşturuldu. Panel açılıyor...",error:"Mağaza oluşturulamadı. Bilgileri kontrol edip tekrar deneyin.",nameRequired:"Mağaza ve sahip adını girin.",badPhone:"WhatsApp numarasını kontrol edin veya boş bırakın."}
};
let lang="ar",words=translations.ar,currentUser=null;
function applyLanguage(next){lang=translations[next]?next:"ar";words=translations[lang];document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";document.querySelectorAll("[data-t]").forEach(node=>{const key=node.dataset.t;if(words[key])node.textContent=words[key];});$("createStoreLanguage").value=lang;try{localStorage.setItem("msdz-language",lang);}catch(e){}}
const requested=new URLSearchParams(location.search).get("lang");let saved="ar";try{saved=localStorage.getItem("msdz-language")||"ar";}catch(e){}applyLanguage(translations[requested]?requested:saved);
$("createStoreLanguage").addEventListener("change",e=>applyLanguage(e.target.value));
function makeSlug(userId){return "store-"+String(userId).replace(/-/g,"").slice(0,16).toLowerCase();}
async function init(){
 $("createStoreFeedback").textContent=words.checking;
 const {data,error}=await supabase.auth.getUser();
 if(error||!data?.user){$("createStoreFeedback").textContent=words.login;setTimeout(()=>location.replace("auth.html?next=create-store.html&lang="+encodeURIComponent(lang)),700);return;}
 currentUser=data.user;
 $("newSellerName").value=currentUser.user_metadata?.full_name||"";
 const {data:existing,error:lookupError}=await supabase.from("stores").select("id,slug,setup_completed,store_name,seller_name").eq("owner_id",currentUser.id).maybeSingle();
 if(lookupError){$("createStoreFeedback").textContent=words.error;return;}
 if(existing?.setup_completed){$("createStoreFeedback").textContent=words.exists;location.replace("dashboard.html?lang="+encodeURIComponent(lang));return;}
 if(existing){$("newStoreName").value=existing.store_name==="متجري"?"":existing.store_name||"";$("newSellerName").value=existing.seller_name||$("newSellerName").value;}
 $("createStoreFeedback").textContent="";
}
$("createStoreForm").addEventListener("submit",async event=>{
 event.preventDefault();if(!currentUser)return;
 const storeName=$("newStoreName").value.trim(),sellerName=$("newSellerName").value.trim(),whatsapp=$("newStoreWhatsapp").value.trim();
 if(!storeName||!sellerName){$("createStoreFeedback").textContent=words.nameRequired;return;}
 if(whatsapp&&!/^\d{8,20}$/.test(whatsapp.replace(/[\s()+-]/g,""))){$("createStoreFeedback").textContent=words.badPhone;return;}
 const button=$("createStoreSubmit");button.disabled=true;$("createStoreFeedback").textContent=words.saving;
 try{
  const {data:existing,error:lookupError}=await supabase.from("stores").select("id,setup_completed").eq("owner_id",currentUser.id).maybeSingle();
  if(lookupError)throw lookupError;
  if(existing?.setup_completed){location.replace("dashboard.html?lang="+encodeURIComponent(lang));return;}
  const payload={store_name:storeName,seller_name:sellerName,seller_bio:$("newStoreBio").value.trim()||null,whatsapp:whatsapp.replace(/[\\s()+-]/g,"")||null,setup_completed:true};
  let saveResult;
  if(existing){saveResult=await supabase.from("stores").update(payload).eq("id",existing.id).eq("owner_id",currentUser.id);}
  else{saveResult=await supabase.from("stores").insert({...payload,owner_id:currentUser.id,slug:makeSlug(currentUser.id),is_published:false});}
  if(saveResult.error)throw saveResult.error;
  $("createStoreFeedback").textContent=words.success;
  location.replace("dashboard.html?lang="+encodeURIComponent(lang));
 }catch(error){
  console.error("Store creation failed:",error);
  const {data:existing}=await supabase.from("stores").select("id,setup_completed").eq("owner_id",currentUser.id).maybeSingle();
  if(existing?.setup_completed){location.replace("dashboard.html?lang="+encodeURIComponent(lang));return;}
  $("createStoreFeedback").textContent=words.error;
  button.disabled=false;
 }
});
init();
