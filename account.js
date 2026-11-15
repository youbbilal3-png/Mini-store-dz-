import { supabase } from "./supabase-client.js";
const $=id=>document.getElementById(id);
const language=(()=>{try{const l=localStorage.getItem("msdz-language");return ["ar","fr","en","es","de","tr"].includes(l)?l:"ar";}catch(e){return "ar";}})();
const t={
ar:{title:"حسابي",intro:"معلومات حسابك على MINABYB.",home:"الصفحة الرئيسية",name:"الاسم",email:"البريد الإلكتروني",type:"نوع الحساب",shopper:"متسوق",merchant:"تاجر",create:"أنشئ متجرك",dashboard:"لوحة التاجر",logout:"تسجيل الخروج",loading:"جارٍ تحميل حسابك...",error:"تعذر تحميل الحساب. تحقق من الاتصال وحاول مجدداً.",signedOut:"تم تسجيل الخروج.",logoutError:"تعذر تسجيل الخروج. حاول مجدداً."},
fr:{title:"Mon compte",intro:"Informations de votre compte MINABYB.",home:"Accueil",name:"Nom",email:"Adresse e-mail",type:"Type de compte",shopper:"Acheteur",merchant:"Vendeur",create:"Créer ma boutique",dashboard:"Espace vendeur",logout:"Déconnexion",loading:"Chargement du compte...",error:"Impossible de charger le compte. Réessayez.",signedOut:"Vous êtes déconnecté.",logoutError:"Déconnexion impossible. Réessayez."},
en:{title:"My account",intro:"Your MINABYB account information.",home:"Home",name:"Name",email:"Email address",type:"Account type",shopper:"Shopper",merchant:"Merchant",create:"Create your store",dashboard:"Merchant dashboard",logout:"Log out",loading:"Loading your account...",error:"Could not load your account. Please try again.",signedOut:"You have been logged out.",logoutError:"Could not log out. Please try again."},
es:{title:"Mi cuenta",intro:"Información de tu cuenta MINABYB.",home:"Inicio",name:"Nombre",email:"Correo electrónico",type:"Tipo de cuenta",shopper:"Comprador",merchant:"Vendedor",create:"Crear tu tienda",dashboard:"Panel del vendedor",logout:"Cerrar sesión",loading:"Cargando tu cuenta...",error:"No se pudo cargar la cuenta. Inténtalo de nuevo.",signedOut:"Has cerrado sesión.",logoutError:"No se pudo cerrar sesión. Inténtalo de nuevo."},
de:{title:"Mein Konto",intro:"Informationen zu Ihrem MINABYB-Konto.",home:"Startseite",name:"Name",email:"E-Mail-Adresse",type:"Kontotyp",shopper:"Käufer",merchant:"Händler",create:"Shop erstellen",dashboard:"Händler-Dashboard",logout:"Abmelden",loading:"Konto wird geladen...",error:"Konto konnte nicht geladen werden. Bitte erneut versuchen.",signedOut:"Sie wurden abgemeldet.",logoutError:"Abmeldung nicht möglich. Bitte erneut versuchen."},
tr:{title:"Hesabım",intro:"MINABYB hesap bilgileriniz.",home:"Ana sayfa",name:"Ad",email:"E-posta adresi",type:"Hesap türü",shopper:"Alışverişçi",merchant:"Satıcı",create:"Mağazanı oluştur",dashboard:"Satıcı paneli",logout:"Çıkış yap",loading:"Hesabınız yükleniyor...",error:"Hesap yüklenemedi. Lütfen tekrar deneyin.",signedOut:"Oturum kapatıldı.",logoutError:"Oturum kapatılamadı. Tekrar deneyin."}
}[language];
document.documentElement.lang=language;document.documentElement.dir=language==="ar"?"rtl":"ltr";
$("accountTitle").textContent=t.title;$("accountIntro").textContent=t.intro;$("accountHomeLink").textContent=t.home;
$("accountNameLabel").textContent=t.name;$("accountEmailLabel").textContent=t.email;$("accountTypeLabel").textContent=t.type;$("accountLogoutButton").textContent=t.logout;
async function init(){
 $("accountFeedback").textContent=t.loading;
 try{
  const {data:{session},error}=await supabase.auth.getSession();if(error)throw error;
  if(!session){location.replace("auth.html?next=account.html&lang="+encodeURIComponent(language));return;}
  const user=session.user;
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
init();