import { supabase } from "./supabase-client.js";
const $=id=>document.getElementById(id);
let mode="signup";
function setMode(next){mode=next;const signup=mode==="signup";$("showSignup").classList.toggle("active",signup);$("showLogin").classList.toggle("active",!signup);$("nameField").hidden=!signup;$("fullName").required=signup;$("authTitle").textContent=signup?authTranslations[authLanguage].createTitle:authTranslations[authLanguage].loginTitle;$("authIntro").textContent=signup?authTranslations[authLanguage].createDesc:authTranslations[authLanguage].loginDesc;$("submitButton").textContent=signup?authTranslations[authLanguage].createAction:authTranslations[authLanguage].loginAction;$("password").autocomplete=signup?"new-password":"current-password";$("authMessage").textContent="";}
function openAuth(next){setMode(next);const section=$("authFormSection");section.hidden=false;section.scrollIntoView({behavior:"smooth",block:"start"});}
document.querySelectorAll("[data-open-auth]").forEach(button=>button.addEventListener("click",()=>openAuth(button.dataset.openAuth)));
$("showSignup").addEventListener("click",()=>setMode("signup"));
$("showLogin").addEventListener("click",()=>setMode("login"));
$("closeAuth").addEventListener("click",()=>{$("authFormSection").hidden=true;window.scrollTo({top:0,behavior:"smooth"});});
$("authYear").textContent=new Date().getFullYear();
$("authForm").addEventListener("submit",async event=>{
 event.preventDefault();const button=$("submitButton");button.disabled=true;$("authMessage").textContent=authTranslations[authLanguage].connecting;
 const email=$("email").value.trim();const password=$("password").value;const fullName=$("fullName").value.trim();
 try{
  if(mode==="signup"){
   const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName},emailRedirectTo:location.origin+"/index.html"}});
   if(error)throw error;
   if(data.session){location.href=authNext;return;}
   $("authMessage").textContent=authTranslations[authLanguage].confirm;
  }else{
   const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;
   location.href=authNext;
  }
 }catch(error){console.error("Authentication error:",error);$("authMessage").textContent=authTranslations[authLanguage].error;}
 finally{button.disabled=false;}
});

const authTranslations={
 ar:{tagline:"متجرك. بطريقتك.",ad1:"كل ما تحتاجه… في مكان واحد",ad2:"ابدأ تجارتك الرقمية اليوم",ad3:"اعرض منتجاتك باحترافية",ad4:"تجربة تسوق سهلة للجميع",ad5:"متجرك يستحق الظهور",ad6:"انطلق بخطوات واثقة",welcomeKicker:"MINI STORE DZ",welcomeTitle:'ابدأ تجارتك <em>بخطوات بسيطة</em>',welcomeDesc:"أنشئ متجرك، اعرض منتجاتك، واستقبل طلبات زبائنك بسهولة.",signup:"إنشاء حساب",login:"تسجيل الدخول",point1:"متجرك ومنتجاتك في مكان واحد",point2:"طلبات مباشرة عبر WhatsApp",point3:"واجهة متعددة اللغات",createTitle:"إنشاء حساب جديد",loginTitle:"تسجيل الدخول",createDesc:"أدخل بياناتك لإنشاء حسابك على Mini Store DZ.",loginDesc:"أدخل بريدك الإلكتروني وكلمة المرور للمتابعة.",merchant:"اسم التاجر",email:"البريد الإلكتروني",password:"كلمة المرور",createAction:"إنشاء حسابي",loginAction:"تسجيل الدخول",close:"إغلاق ✕",legal:"بعد إنشاء حسابك وتسجيل الدخول، يمكنك إنشاء متجرك من داخل المنصة.",confirm:"تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيده، ثم سجّل الدخول.",connecting:"جارٍ الاتصال...",error:"حدث خطأ. حاول مجدداً."},
 fr:{tagline:"VOTRE BOUTIQUE. À VOTRE FAÇON.",ad1:"Tout ce qu’il vous faut, au même endroit",ad2:"Lancez votre commerce en ligne",ad3:"Présentez vos produits avec style",ad4:"Une expérience simple pour tous",ad5:"Votre boutique mérite d’être vue",ad6:"Lancez-vous en toute confiance",welcomeKicker:"MINI STORE DZ",welcomeTitle:'Lancez votre activité <em>en quelques étapes</em>',welcomeDesc:"Créez votre boutique, présentez vos produits et recevez vos commandes facilement.",signup:"Créer un compte",login:"Connexion",point1:"Boutique et produits au même endroit",point2:"Commandes directes sur WhatsApp",point3:"Interface multilingue",createTitle:"Créer un compte",loginTitle:"Connexion",createDesc:"Renseignez vos informations pour créer votre compte.",loginDesc:"Saisissez votre e-mail et votre mot de passe.",merchant:"Nom du commerçant",email:"Adresse e-mail",password:"Mot de passe",createAction:"Créer mon compte",loginAction:"Se connecter",close:"Fermer ✕",legal:"Après connexion, créez votre boutique depuis la plateforme.",confirm:"Compte créé. Confirmez votre adresse e-mail, puis connectez-vous.",connecting:"Connexion en cours...",error:"Une erreur est survenue. Réessayez."},
 en:{tagline:"YOUR STORE. YOUR WAY.",ad1:"Everything you need, in one place",ad2:"Start your online business today",ad3:"Showcase your products beautifully",ad4:"A simpler shopping experience",ad5:"Your store deserves to be seen",ad6:"Take your next step with confidence",welcomeKicker:"MINI STORE DZ",welcomeTitle:'Start your business <em>in a few easy steps</em>',welcomeDesc:"Create your store, showcase products and receive customer orders with ease.",signup:"Create account",login:"Log in",point1:"Your store and products in one place",point2:"Direct orders through WhatsApp",point3:"Multilingual interface",createTitle:"Create your account",loginTitle:"Log in",createDesc:"Enter your details to create your Mini Store DZ account.",loginDesc:"Enter your email and password to continue.",merchant:"Merchant name",email:"Email address",password:"Password",createAction:"Create my account",loginAction:"Log in",close:"Close ✕",legal:"After signing in, create your store from inside the platform.",confirm:"Account created. Confirm your email, then log in.",connecting:"Connecting...",error:"Something went wrong. Please try again."},
 es:{tagline:"TU TIENDA. A TU MANERA.",ad1:"Todo lo que necesitas, en un solo lugar",ad2:"Empieza hoy tu negocio online",ad3:"Muestra tus productos con estilo",ad4:"Una experiencia de compra sencilla",ad5:"Tu tienda merece ser vista",ad6:"Da el siguiente paso con confianza",welcomeKicker:"MINI STORE DZ",welcomeTitle:'Inicia tu negocio <em>en pocos pasos</em>',welcomeDesc:"Crea tu tienda, muestra tus productos y recibe pedidos fácilmente.",signup:"Crear cuenta",login:"Iniciar sesión",point1:"Tu tienda y productos en un solo lugar",point2:"Pedidos directos por WhatsApp",point3:"Interfaz multilingüe",createTitle:"Crear cuenta",loginTitle:"Iniciar sesión",createDesc:"Introduce tus datos para crear tu cuenta.",loginDesc:"Introduce tu correo y contraseña.",merchant:"Nombre del comerciante",email:"Correo electrónico",password:"Contraseña",createAction:"Crear mi cuenta",loginAction:"Iniciar sesión",close:"Cerrar ✕",legal:"Después de iniciar sesión, crea tu tienda dentro de la plataforma.",confirm:"Cuenta creada. Confirma tu correo y luego inicia sesión.",connecting:"Conectando...",error:"Ocurrió un error. Inténtalo de nuevo."},
 de:{tagline:"DEIN SHOP. DEIN WEG.",ad1:"Alles, was Sie brauchen, an einem Ort",ad2:"Starten Sie Ihr Online-Geschäft",ad3:"Präsentieren Sie Ihre Produkte stilvoll",ad4:"Einfaches Einkaufserlebnis für alle",ad5:"Ihr Shop verdient Aufmerksamkeit",ad6:"Starten Sie mit Zuversicht",welcomeKicker:"MINI STORE DZ",welcomeTitle:'Starten Sie Ihr Geschäft <em>ganz einfach</em>',welcomeDesc:"Erstellen Sie Ihren Shop, präsentieren Sie Produkte und erhalten Sie Bestellungen.",signup:"Konto erstellen",login:"Anmelden",point1:"Shop und Produkte an einem Ort",point2:"Direkte Bestellungen per WhatsApp",point3:"Mehrsprachige Oberfläche",createTitle:"Konto erstellen",loginTitle:"Anmelden",createDesc:"Geben Sie Ihre Daten ein, um ein Konto zu erstellen.",loginDesc:"Geben Sie E-Mail und Passwort ein.",merchant:"Händlername",email:"E-Mail-Adresse",password:"Passwort",createAction:"Konto erstellen",loginAction:"Anmelden",close:"Schließen ✕",legal:"Nach der Anmeldung können Sie Ihren Shop auf der Plattform erstellen.",confirm:"Konto erstellt. Bestätigen Sie Ihre E-Mail und melden Sie sich an.",connecting:"Verbindung wird hergestellt...",error:"Ein Fehler ist aufgetreten. Bitte erneut versuchen."},
 tr:{tagline:"MAĞAZANIZ. SİZİN TARZINIZ.",ad1:"İhtiyacınız olan her şey tek yerde",ad2:"Online işinizi bugün başlatın",ad3:"Ürünlerinizi profesyonelce sergileyin",ad4:"Herkes için kolay alışveriş",ad5:"Mağazanız görünmeyi hak ediyor",ad6:"Güvenle ilk adımı atın",welcomeKicker:"MINI STORE DZ",welcomeTitle:'İşinizi <em>kolayca başlatın</em>',welcomeDesc:"Mağazanızı oluşturun, ürünlerinizi sergileyin ve siparişleri kolayca alın.",signup:"Hesap oluştur",login:"Giriş yap",point1:"Mağazanız ve ürünleriniz tek yerde",point2:"WhatsApp üzerinden doğrudan sipariş",point3:"Çok dilli arayüz",createTitle:"Hesap oluştur",loginTitle:"Giriş yap",createDesc:"Hesabınızı oluşturmak için bilgilerinizi girin.",loginDesc:"Devam etmek için e-posta ve şifrenizi girin.",merchant:"Mağaza sahibi adı",email:"E-posta adresi",password:"Şifre",createAction:"Hesabımı oluştur",loginAction:"Giriş yap",close:"Kapat ✕",legal:"Giriş yaptıktan sonra platform içinden mağazanızı oluşturabilirsiniz.",confirm:"Hesap oluşturuldu. E-postanızı doğrulayın ve giriş yapın.",connecting:"Bağlanıyor...",error:"Bir hata oluştu. Tekrar deneyin."}
};
let authLanguage=(()=>{try{const saved=localStorage.getItem("msdz-language");return authTranslations[saved]?saved:"ar";}catch(e){return "ar";}})();
function applyAuthLanguage(lang){
 authLanguage=authTranslations[lang]?lang:"ar";localStorage.setItem("msdz-language",authLanguage);
 document.documentElement.lang=authLanguage;document.documentElement.dir=authLanguage==="ar"?"rtl":"ltr";
 const select=$("authLanguageSelect");if(select)select.value=authLanguage;
 const t=authTranslations[authLanguage];
 document.title="Mini Store DZ | "+t.tagline;
 document.querySelectorAll("[data-auth-text]").forEach(el=>{const key=el.dataset.authText;if(t[key]!==undefined)el.innerHTML=t[key];});
 document.querySelectorAll("[data-open-auth]").forEach(el=>{el.textContent=el.dataset.openAuth==="signup"?t.signup:t.login;});
 $("showSignup").textContent=t.signup;$("showLogin").textContent=t.login;$("closeAuth").textContent=t.close;
 $("nameField").firstChild.textContent=t.merchant;
 $("email").parentElement.firstChild.textContent=t.email;$("password").parentElement.firstChild.textContent=t.password;
 $("fullName").placeholder=t.merchant;$("email").placeholder="name@example.com";$("password").placeholder=authLanguage==="ar"?"8 أحرف على الأقل":"••••••••";
 $("authFormSection").querySelector(".auth-legal").textContent=t.legal;
 setMode(mode);
 document.documentElement.classList.remove("language-loading");
}
$("authLanguageSelect").addEventListener("change",e=>applyAuthLanguage(e.target.value));
applyAuthLanguage(authLanguage);
let authAdIndex=0;
const authSlides=[...document.querySelectorAll(".auth-ad-slide")];
const authDots=[...document.querySelectorAll(".auth-ad-dots button")];
function showAuthAd(index){if(!authSlides.length)return;authAdIndex=(index+authSlides.length)%authSlides.length;authSlides.forEach((slide,i)=>slide.classList.toggle("active",i===authAdIndex));authDots.forEach((dot,i)=>dot.classList.toggle("active",i===authAdIndex));}
authDots.forEach(dot=>dot.addEventListener("click",()=>showAuthAd(Number(dot.dataset.slide))));
if(authSlides.length){showAuthAd(0);setInterval(()=>showAuthAd(authAdIndex+1),4500);}

const requestedNext=new URLSearchParams(location.search).get("next");
const authNext=requestedNext==="dashboard.html"?"dashboard.html":requestedNext==="admin.html"?"admin.html":"index.html";
supabase.auth.getSession().then(({data})=>{if(data.session)location.replace(authNext);});
