import { supabase } from "./supabase-client.js";
const $=id=>document.getElementById(id);
let mode="signup";
function setMode(next){mode=next;const signup=mode==="signup";$("showSignup").classList.toggle("active",signup);$("showLogin").classList.toggle("active",!signup);$("nameField").hidden=!signup;$("fullName").required=signup;$("authTitle").textContent=signup?"مرحباً بك في Mini Store DZ":"سجّل الدخول إلى متجرك";$("authIntro").textContent=signup?"أنشئ حساب التاجر الخاص بك وابدأ بإدارة متجرك.":"أدخل بيانات حسابك للعودة إلى لوحة التحكم.";$("submitButton").textContent=signup?"إنشاء حسابي":"تسجيل الدخول";$("password").autocomplete=signup?"new-password":"current-password";$("authMessage").textContent="";}
$("showSignup").addEventListener("click",()=>setMode("signup"));
$("showLogin").addEventListener("click",()=>setMode("login"));
function openAuth(next){
 setMode(next);
 const section=$("authFormSection");
 section.hidden=false;
 section.scrollIntoView({behavior:"smooth",block:"start"});
}
document.querySelectorAll("[data-open-auth]").forEach(button=>button.addEventListener("click",()=>openAuth(button.dataset.openAuth)));
const year=$("authYear");if(year)year.textContent=new Date().getFullYear();
$("authForm").addEventListener("submit",async event=>{
 event.preventDefault();const button=$("submitButton");button.disabled=true;$("authMessage").textContent="جارٍ الاتصال...";
 const email=$("email").value.trim();const password=$("password").value;const fullName=$("fullName").value.trim();
 try{
  if(mode==="signup"){
   const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName},emailRedirectTo:location.origin+"/index.html"}});
   if(error)throw error;
   if(data.session){location.href="index.html";return;}
   $("authMessage").textContent="تم إنشاء الحساب. تحقق من بريدك الإلكتروني واضغط رابط التأكيد، ثم سجّل الدخول.";
  }else{
   const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;
   location.href="index.html";
  }
 }catch(error){$("authMessage").textContent=error.message||"حدث خطأ. حاول مجدداً.";}
 finally{button.disabled=false;}
});
supabase.auth.getSession().then(({data})=>{if(data.session)location.replace("index.html");});
