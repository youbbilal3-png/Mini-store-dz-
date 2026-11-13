const STORAGE_KEY = "ministore_dz_demo_v1";
const DEFAULT_PRODUCTS = [
{id:1,name:"سماعات لاسلكية",fr:"Écouteurs sans fil",en:"Wireless Earbuds",category:"إلكترونيات",categoryFr:"Électronique",categoryEn:"Electronics",price:3500,description:"صوت واضح وتصميم مريح للاستخدام اليومي.",descriptionFr:"Un son clair et un design confortable au quotidien.",descriptionEn:"Clear sound and a comfortable everyday fit.",emoji:"🎧"},
{id:2,name:"ساعة ذكية",fr:"Montre connectée",en:"Smart Watch",category:"إلكترونيات",categoryFr:"Électronique",categoryEn:"Electronics",price:6200,description:"تابع نشاطك وإشعاراتك بسهولة.",descriptionFr:"Suivez facilement votre activité et vos notifications.",descriptionEn:"Track your activity and notifications.",emoji:"⌚"},
{id:3,name:"حقيبة عصرية",fr:"Sac tendance",en:"Everyday Bag",category:"إكسسوارات",categoryFr:"Accessoires",categoryEn:"Accessories",price:2800,description:"حقيبة عملية بتصميم أنيق.",descriptionFr:"Un sac pratique au design élégant.",descriptionEn:"A practical bag with a modern look.",emoji:"👜"},
{id:4,name:"مصباح مكتبي",fr:"Lampe de bureau",en:"Desk Lamp",category:"المنزل",categoryFr:"Maison",categoryEn:"Home",price:1900,description:"إضاءة مريحة لمكتبك أو غرفتك.",descriptionFr:"Un éclairage agréable pour votre bureau ou votre chambre.",descriptionEn:"Comfortable lighting for your desk or room.",emoji:"💡"}
];
const $ = id => document.getElementById(id);
let state = loadState();
function loadState(){
 try { const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null"); return saved && typeof saved==="object" ? {settings:saved.settings||{},products:Array.isArray(saved.products)?saved.products:DEFAULT_PRODUCTS.slice()} : {settings:{},products:DEFAULT_PRODUCTS.slice()}; }
 catch(e){ return {settings:{},products:DEFAULT_PRODUCTS.slice()}; }
}
function saveState(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
function escapeHtml(value){ return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])); }
function showAvatar(){ const src=state.settings.avatar||""; $("avatarFallback").textContent=(state.settings.sellerName||"S").trim().charAt(0).toUpperCase(); $("avatarImage").src=src; $("avatarImage").hidden=!src; $("avatarFallback").hidden=!!src; }
function fillSettings(){ $("sellerNameInput").value=state.settings.sellerName||""; $("sellerBioInput").value=state.settings.sellerDescription||""; $("storeNameInput").value=state.settings.storeName||""; $("whatsappInput").value=state.settings.whatsapp||""; showAvatar(); }
function saveProfile(){
 const whatsapp=$("whatsappInput").value.trim().replace(/[\s+()-]/g,"");
 if(whatsapp && !/^\d{8,15}$/.test(whatsapp)){ $("profileFeedback").textContent="تحقق من رقم WhatsApp ورمز الدولة."; return; }
 state.settings={...state.settings,sellerName:$("sellerNameInput").value.trim()||"Store Owner",sellerDescription:$("sellerBioInput").value.trim(),storeName:$("storeNameInput").value.trim(),whatsapp,};
 try{saveState();$("profileFeedback").textContent="تم حفظ البيانات على هذا الجهاز.";showAvatar();}
 catch(e){$("profileFeedback").textContent="تعذر الحفظ. قد تكون مساحة التخزين ممتلئة.";}
}
function resetProductForm(){ $("productForm").reset(); $("editingProductId").value=""; $("productEmoji").value="📦"; $("productSubmit").textContent="＋ إضافة المنتج"; $("cancelEdit").hidden=true; }
function renderManagedProducts(){
 $("productsTotal").textContent=state.products.length+" منتج";
 if(!state.products.length){$("managedProducts").innerHTML='<p class="empty-products">لا توجد منتجات بعد. أضف أول منتجك من النموذج أعلاه.</p>';return;}
 $("managedProducts").innerHTML=state.products.map(p=>'<article class="managed-product"><div class="managed-product-emoji">'+escapeHtml(p.emoji||"📦")+'</div><div class="managed-product-info"><strong>'+escapeHtml(p.name)+'</strong><span>'+escapeHtml(p.category)+' · '+Number(p.price||0).toLocaleString("ar-DZ")+' دج</span></div><div class="managed-product-actions"><button type="button" data-edit="'+p.id+'">تعديل</button><button type="button" class="delete-product" data-delete="'+p.id+'">حذف</button></div></article>').join("");
}
function addOrUpdateProduct(event){
 event.preventDefault();
 const id=$("editingProductId").value;
 const item={id:id?Number(id):Date.now(),name:$("productName").value.trim(),category:$("productCategory").value.trim(),price:Number($("productPrice").value),description:$("productDescription").value.trim(),emoji:$("productEmoji").value.trim()||"📦"};
 if(!item.name||!item.category||!Number.isFinite(item.price)||item.price<0)return;
 if(id){state.products=state.products.map(p=>p.id===item.id?{...p,...item}:p);$("productFeedback").textContent="تم تحديث المنتج.";}
 else{state.products.unshift(item);$("productFeedback").textContent="تمت إضافة المنتج.";}
 try{saveState();renderManagedProducts();resetProductForm();}
 catch(e){$("productFeedback").textContent="تعذر الحفظ؛ مساحة المتصفح قد تكون ممتلئة.";}
}
$("managedProducts").addEventListener("click",event=>{
 const edit=event.target.closest("[data-edit]"); const del=event.target.closest("[data-delete]");
 if(edit){const p=state.products.find(item=>item.id===Number(edit.dataset.edit));if(!p)return;$("editingProductId").value=p.id;$("productName").value=p.name;$("productCategory").value=p.category;$("productPrice").value=p.price;$("productDescription").value=p.description||"";$("productEmoji").value=p.emoji||"📦";$("productSubmit").textContent="حفظ التعديلات";$("cancelEdit").hidden=false;$("productForm").scrollIntoView({behavior:"smooth",block:"center"});}
 if(del){const p=state.products.find(item=>item.id===Number(del.dataset.delete));if(!p||!confirm("هل تريد حذف المنتج: "+p.name+"؟"))return;state.products=state.products.filter(item=>item.id!==p.id);saveState();renderManagedProducts();}
});
$("avatarUpload").addEventListener("change",event=>{
 const file=event.target.files&&event.target.files[0];if(!file)return;
 if(!file.type.startsWith("image/")){alert("اختر ملف صورة صالحاً.");return;}
 if(file.size>1024*1024){alert("اختر صورة أصغر من 1 ميغابايت في النسخة التجريبية.");event.target.value="";return;}
 const reader=new FileReader();reader.onload=()=>{state.settings.avatar=reader.result;try{saveState();showAvatar();}catch(e){alert("تعذر حفظ الصورة. جرّب صورة أصغر.");}};reader.readAsDataURL(file);
});
$("removeAvatar").addEventListener("click",()=>{delete state.settings.avatar;saveState();showAvatar();$("avatarUpload").value="";});
$("saveProfile").addEventListener("click",saveProfile);
$("productForm").addEventListener("submit",addOrUpdateProduct);
$("cancelEdit").addEventListener("click",resetProductForm);
$("dashYear").textContent=new Date().getFullYear();
fillSettings();renderManagedProducts();