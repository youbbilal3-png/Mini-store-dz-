import { supabase } from "./supabase-client.js";
const $=id=>document.getElementById(id);
const language=(()=>{try{const l=localStorage.getItem("msdz-language");return ["ar","fr","en","es","de","tr"].includes(l)?l:"ar";}catch(e){return "ar";}})();
const t={
ar:{title:"حسابي",intro:"معلومات حسابك على MINABYB.",home:"الصفحة الرئيسية",name:"الاسم",email:"البريد الإلكتروني",type:"نوع الحساب",shopper:"متسوق",merchant:"تاجر",create:"أنشئ متجرك",dashboard:"لوحة التاجر",logout:"تسجيل الخروج",loading:"جارٍ تحميل حسابك...",error:"تعذر تحميل الحساب. تحقق من الاتصال وحاول مجدداً.",signedOut:"تم تسجيل الخروج.",logoutError:"تعذر تسجيل الخروج. حاول مجدداً.",photoAdd:"إضافة صورة شخصية",photoChange:"تغيير الصورة",photoRemove:"حذف الصورة",photoUploading:"جارٍ رفع الصورة...",photoDeleting:"جارٍ حذف الصورة...",photoSaved:"تم تحديث صورتك الشخصية بنجاح.",photoDeleted:"تم حذف الصورة الشخصية.",photoError:"تعذر تحديث الصورة. حاول مجدداً.",photoType:"اختر صورة بصيغة JPG أو PNG أو WebP.",photoSize:"حجم الصورة يجب ألا يتجاوز 2 ميغابايت.",photoConfirm:"هل تريد حذف صورتك الشخصية؟"},
fr:{title:"Mon compte",intro:"Informations de votre compte MINABYB.",home:"Accueil",name:"Nom",email:"Adresse e-mail",type:"Type de compte",shopper:"Acheteur",merchant:"Vendeur",create:"Créer ma boutique",dashboard:"Espace vendeur",logout:"Déconnexion",loading:"Chargement du compte...",error:"Impossible de charger le compte. Réessayez.",signedOut:"Vous êtes déconnecté.",logoutError:"Déconnexion impossible. Réessayez.",photoAdd:"Ajouter une photo",photoChange:"Changer la photo",photoRemove:"Supprimer la photo",photoUploading:"Téléchargement...",photoDeleting:"Suppression...",photoSaved:"Photo de profil mise à jour.",photoDeleted:"Photo de profil supprimée.",photoError:"Impossible de modifier la photo. Réessayez.",photoType:"Choisissez une image JPG, PNG ou WebP.",photoSize:"La taille maximale est de 2 Mo.",photoConfirm:"Supprimer votre photo de profil ?"},
en:{title:"My account",intro:"Your MINABYB account information.",home:"Home",name:"Name",email:"Email address",type:"Account type",shopper:"Shopper",merchant:"Merchant",create:"Create your store",dashboard:"Merchant dashboard",logout:"Log out",loading:"Loading your account...",error:"Could not load your account. Please try again.",signedOut:"You have been logged out.",logoutError:"Could not log out. Please try again.",photoAdd:"Add profile picture",photoChange:"Change picture",photoRemove:"Remove picture",photoUploading:"Uploading picture...",photoDeleting:"Removing picture...",photoSaved:"Profile picture updated.",photoDeleted:"Profile picture removed.",photoError:"Could not update the picture. Please try again.",photoType:"Choose a JPG, PNG, or WebP image.",photoSize:"The image must be 2 MB or smaller.",photoConfirm:"Remove your profile picture?"},
es:{title:"Mi cuenta",intro:"Información de tu cuenta MINABYB.",home:"Inicio",name:"Nombre",email:"Correo electrónico",type:"Tipo de cuenta",shopper:"Comprador",merchant:"Vendedor",create:"Crear tu tienda",dashboard:"Panel del vendedor",logout:"Cerrar sesión",loading:"Cargando tu cuenta...",error:"No se pudo cargar la cuenta. Inténtalo de nuevo.",signedOut:"Has cerrado sesión.",logoutError:"No se pudo cerrar sesión. Inténtalo de nuevo.",photoAdd:"Añadir foto de perfil",photoChange:"Cambiar foto",photoRemove:"Eliminar foto",photoUploading:"Subiendo imagen...",photoDeleting:"Eliminando imagen...",photoSaved:"Foto de perfil actualizada.",photoDeleted:"Foto de perfil eliminada.",photoError:"No se pudo actualizar la foto. Inténtalo de nuevo.",photoType:"Elige una imagen JPG, PNG o WebP.",photoSize:"La imagen debe pesar 2 MB o menos.",photoConfirm:"¿Eliminar tu foto de perfil?"},
de:{title:"Mein Konto",intro:"Informationen zu Ihrem MINABYB-Konto.",home:"Startseite",name:"Name",email:"E-Mail-Adresse",type:"Kontotyp",shopper:"Käufer",merchant:"Händler",create:"Shop erstellen",dashboard:"Händler-Dashboard",logout:"Abmelden",loading:"Konto wird geladen...",error:"Konto konnte nicht geladen werden. Bitte erneut versuchen.",signedOut:"Sie wurden abgemeldet.",logoutError:"Abmeldung nicht möglich. Bitte erneut versuchen.",photoAdd:"Profilbild hinzufügen",photoChange:"Bild ändern",photoRemove:"Bild entfernen",photoUploading:"Bild wird hochgeladen...",photoDeleting:"Bild wird entfernt...",photoSaved:"Profilbild aktualisiert.",photoDeleted:"Profilbild entfernt.",photoError:"Bild konnte nicht geändert werden. Bitte erneut versuchen.",photoType:"Wählen Sie JPG, PNG oder WebP.",photoSize:"Das Bild darf höchstens 2 MB groß sein.",photoConfirm:"Profilbild entfernen?"},
tr:{title:"Hesabım",intro:"MINABYB hesap bilgileriniz.",home:"Ana sayfa",name:"Ad",email:"E-posta adresi",type:"Hesap türü",shopper:"Alışverişçi",merchant:"Satıcı",create:"Mağazanı oluştur",dashboard:"Satıcı paneli",logout:"Çıkış yap",loading:"Hesabınız yükleniyor...",error:"Hesap yüklenemedi. Lütfen tekrar deneyin.",signedOut:"Oturum kapatıldı.",logoutError:"Oturum kapatılamadı. Tekrar deneyin."}
}[language];
document.documentElement.lang=language;document.documentElement.dir=language==="ar"?"rtl":"ltr";
$("accountTitle").textContent=t.title;$("accountIntro").textContent=t.intro;$("accountHomeLink").textContent=t.home;
$("accountAvatar").setAttribute("aria-label",t.title);

const photoInput=$("accountPhotoInput"),photoChoose=$("accountPhotoChoose"),photoRemove=$("accountPhotoRemove");
let currentUser=null,currentAvatarUrl="";
function syncPhotoButtons(){photoChoose.textContent=currentAvatarUrl?t.photoChange:t.photoAdd;photoRemove.hidden=!currentAvatarUrl;}
function getOwnedAvatarPath(url,userId){
 try{const parsed=new URL(url);const marker="/storage/v1/object/public/store-avatars/";const index=parsed.pathname.indexOf(marker);if(index<0)return "";const path=decodeURIComponent(parsed.pathname.slice(index+marker.length));return path.startsWith(userId+"/")?path:"";}catch(e){return "";}
}
\nfunction setAccountAvatar(user){\n currentAvatarUrl=user.user_metadata?.avatar_url||user.user_metadata?.picture||user.user_metadata?.profile_image||user.user_metadata?.photo_url||"";syncPhotoButtons();
 const image=$("accountAvatarImage"),initial=$("accountAvatarInitial");
 const name=user.user_metadata?.full_name||user.user_metadata?.name||user.email?.split("@")[0]||"";
 initial.textContent=Array.from(name.trim())[0]?.toLocaleUpperCase()||"•";
 const candidate=user.user_metadata?.avatar_url||user.user_metadata?.picture||user.user_metadata?.profile_image||user.user_metadata?.photo_url||"";
 try{
  const url=new URL(candidate,location.origin);
  if(candidate&&["https:","http:"].includes(url.protocol)){
   image.onload=()=>{image.hidden=false;initial.hidden=true;};
   image.onerror=()=>{image.hidden=true;initial.hidden=false;};
   image.src=url.href;
  }else{image.hidden=true;initial.hidden=false;}
 }catch(error){image.hidden=true;initial.hidden=false;}
}
$("accountNameLabel").textContent=t.name;$("accountEmailLabel").textContent=t.email;$("accountTypeLabel").textContent=t.type;$("accountLogoutButton").textContent=t.logout;
async function init(){
 $("accountFeedback").textContent=t.loading;
 try{
  const {data:{session,photoAdd:"Profil fotoğrafı ekle",photoChange:"Fotoğrafı değiştir",photoRemove:"Fotoğrafı sil",photoUploading:"Fotoğraf yükleniyor...",photoDeleting:"Fotoğraf siliniyor...",photoSaved:"Profil fotoğrafı güncellendi.",photoDeleted:"Profil fotoğrafı silindi.",photoError:"Fotoğraf güncellenemedi. Tekrar deneyin.",photoType:"JPG, PNG veya WebP seçin.",photoSize:"Görsel en fazla 2 MB olmalıdır.",photoConfirm:"Profil fotoğrafınız silinsin mi?"},error}=await supabase.auth.getSession();if(error)throw error;
  if(!session){location.replace("auth.html?next=account.html&lang="+encodeURIComponent(language));return;}
  const user=session.user;
  setAccountAvatar(user);
  $("accountName").textContent=user.user_metadata?.full_name||user.user_metadata?.name||user.email?.split("@")[0]||"—";
  $("accountEmail").textContent=user.email||"—";
  const {data:store,error:storeError}=await supabase.from("stores").select("id,setup_completed").eq("owner_id",user.id).eq("setup_completed",true).maybeSingle();
  if(storeError)throw storeError;
  const isMerchant=!!store;
  $("accountType").textContent=isMerchant?t.merchant:t.shopper;
  const action=$("accountStoreAction");action.hidden=false;action.textContent=isMerchant?t.dashboard:t.create;action.href=isMerchant?"dashboard.html?lang="+encodeURIComponent(language):"create-store.html?lang="+encodeURIComponent(language);
  $("accountFeedback").textContent="";
 }catch(error){console.error("Account page load failed:",error);$("accountFeedback").textContent=t.error;}
}
$("accountLogoutButton").addEventListener("click",async()=>{
 const button=$("accountLogoutButton");button.disabled=true;button.textContent=language==="ar"?"جارٍ تسجيل الخروج...":"...";
 try{const {error}=await supabase.auth.signOut({scope:"local"});if(error)throw error;location.replace("index.html?logged_out=1");}
 catch(error){console.error("Account logout failed:",error);button.disabled=false;button.textContent=t.logout;$("accountFeedback").textContent=t.logoutError;}
});

photoChoose.addEventListener("click",()=>photoInput.click());
photoInput.addEventListener("change",async()=>{
 const file=photoInput.files?.[0];photoInput.value="";if(!file||!currentUser)return;
 if(!["image/jpeg","image/png","image/webp"].includes(file.type)){$("accountFeedback").textContent=t.photoType;return;}
 if(file.size>2*1024*1024){$("accountFeedback").textContent=t.photoSize;return;}
 photoChoose.disabled=true;photoRemove.disabled=true;photoChoose.textContent=t.photoUploading;$("accountFeedback").textContent=t.photoUploading;
 let uploadedPath="";
 try{
  const ext={"image/jpeg":"jpg","image/png":"png","image/webp":"webp"}[file.type];
  uploadedPath=currentUser.id+"/profile-"+Date.now()+"."+ext;
  const {error:uploadError}=await supabase.storage.from("store-avatars").upload(uploadedPath,file,{contentType:file.type,upsert:false});
  if(uploadError)throw uploadError;
  const {data:{publicUrl}}=supabase.storage.from("store-avatars").getPublicUrl(uploadedPath);
  const {data,error:updateError}=await supabase.auth.updateUser({data:{...currentUser.user_metadata,avatar_url:publicUrl,picture:null,profile_image:null,photo_url:null}});
  if(updateError)throw updateError;
  const oldPath=getOwnedAvatarPath(currentAvatarUrl,currentUser.id);
  currentUser=data.user;setAccountAvatar(currentUser);
  if(oldPath&&oldPath!==uploadedPath){const {error:cleanupError}=await supabase.storage.from("store-avatars").remove([oldPath]);if(cleanupError)console.warn("Old profile image cleanup failed:",cleanupError);}
  $("accountFeedback").textContent=t.photoSaved;
 }catch(error){
  console.error("Profile photo upload failed:",error);
  if(uploadedPath)await supabase.storage.from("store-avatars").remove([uploadedPath]);
  $("accountFeedback").textContent=t.photoError;
 }finally{photoChoose.disabled=false;photoRemove.disabled=false;syncPhotoButtons();}
});
photoRemove.addEventListener("click",async()=>{
 if(!currentUser||!currentAvatarUrl||!confirm(t.photoConfirm))return;
 photoChoose.disabled=true;photoRemove.disabled=true;$("accountFeedback").textContent=t.photoDeleting;
 try{
  const oldPath=getOwnedAvatarPath(currentAvatarUrl,currentUser.id);
  const {data,error}=await supabase.auth.updateUser({data:{...currentUser.user_metadata,avatar_url:null,picture:null,profile_image:null,photo_url:null}});
  if(error)throw error;
  currentUser=data.user;setAccountAvatar(currentUser);
  if(oldPath){const {error:removeError}=await supabase.storage.from("store-avatars").remove([oldPath]);if(removeError)console.warn("Old profile image cleanup failed:",removeError);}
  $("accountFeedback").textContent=t.photoDeleted;
 }catch(error){console.error("Profile photo removal failed:",error);$("accountFeedback").textContent=t.photoError;}
 finally{photoChoose.disabled=false;photoRemove.disabled=false;syncPhotoButtons();}
});
\ninit();