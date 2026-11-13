import { supabase } from "./supabase-client.js";
const $=id=>document.getElementById(id);
function dashboardText(key){const lang=document.documentElement.lang||"ar";const words={shareStore:{ar:"شاهد متجري على Mini Store DZ: ",fr:"Découvrez ma boutique sur Mini Store DZ : ",en:"View my store on Mini Store DZ: ",es:"Visita mi tienda en Mini Store DZ: ",de:"Besuche meinen Shop auf Mini Store DZ: ",tr:"Mini Store DZ mağazamı ziyaret et: "},confirmDelete:{ar:"هل تريد حذف المنتج: ",fr:"Voulez-vous supprimer le produit : ",en:"Do you want to delete product: ",es:"¿Quieres eliminar el producto: ",de:"Möchtest du das Produkt löschen: ",tr:"Ürünü silmek istiyor musunuz: "},logoutError:{ar:"تعذر تسجيل الخروج. تحقق من الاتصال ثم حاول مجدداً.",fr:"Déconnexion impossible. Vérifiez votre connexion puis réessayez.",en:"Could not log out. Check your connection and try again.",es:"No se pudo cerrar la sesión. Comprueba tu conexión e inténtalo de nuevo.",de:"Abmeldung fehlgeschlagen. Prüfe deine Verbindung und versuche es erneut.",tr:"Çıkış yapılamadı. Bağlantınızı kontrol edip tekrar deneyin."}};return words[key]?.[lang]||words[key]?.ar||"";}
function dashboardLocale(){const lang=document.documentElement.lang;return lang==="fr"?"fr-FR":lang==="en"?"en-GB":lang==="es"?"es-ES":lang==="de"?"de-DE":lang==="tr"?"tr-TR":"ar-DZ";}
function applyDashboardTheme(mode){
 const selected=mode||"system";document.documentElement.dataset.theme=selected;
 const icon=$("themeToggleIcon"),label=$("themeToggleLabel"),button=$("themeToggle");
 if(icon)icon.textContent=selected==="dark"?"☾":selected==="light"?"☀":"◐";
 if(label)label.textContent=selected==="dark"?"داكن":selected==="light"?"فاتح":"تلقائي";
 if(button){button.title="المظهر الحالي: "+(label?.textContent||"تلقائي")+" — اضغط للتغيير";button.setAttribute("aria-label",button.title);}
}
function initDashboardTheme(){
 let mode="system";try{mode=localStorage.getItem("msdz-theme-merchant")||"system";}catch(error){}
 applyDashboardTheme(mode);
 $("themeToggle")?.addEventListener("click",()=>{
  const current=document.documentElement.dataset.theme||"system",next=current==="system"?"light":current==="light"?"dark":"system";
  try{localStorage.setItem("msdz-theme-merchant",next);}catch(error){}
  applyDashboardTheme(next);
 });
}
let user=null,store=null,products=[],orders=[],reviews=[];
const message=(id,text)=>$(id).textContent=text;
const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function makeSlug(name,id){const base=String(name||"store").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,25)||"store";return base+"-"+id.slice(0,7);}
async function ensureStore(){
 const {data:existing,error}=await supabase.from("stores").select("*").eq("owner_id",user.id).maybeSingle();
 if(error)throw error;if(existing)return existing;
 const fullName=user.user_metadata?.full_name||user.email?.split("@")[0]||"Store Owner";
 const {data,error:createError}=await supabase.from("stores").insert({owner_id:user.id,slug:makeSlug(fullName,user.id),store_name:"متجري",seller_name:fullName,is_published:false}).select("*").single();
 if(createError)throw createError;return data;
}

function renderDailyCharts(){
 const days=[];
 const now=new Date();
 for(let offset=6;offset>=0;offset--){
  const day=new Date(now);day.setHours(0,0,0,0);day.setDate(day.getDate()-offset);
  const key=day.getFullYear()+"-"+String(day.getMonth()+1).padStart(2,"0")+"-"+String(day.getDate()).padStart(2,"0");
  days.push({key,label:day.toLocaleDateString(dashboardLocale(),{weekday:"short",day:"numeric"}),orders:0,sales:0});
 }
 const byDate=new Map(days.map(day=>[day.key,day]));
 orders.forEach(order=>{
  const date=new Date(order.created_at);
  const key=date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0");
  const day=byDate.get(key);if(!day)return;
  day.orders++;
  if(order.status==="completed")day.sales+=Number(order.total||0);
 });
 const maxOrders=Math.max(1,...days.map(day=>day.orders));
 const maxSales=Math.max(1,...days.map(day=>day.sales));
 const render=(target,field,max,format,kind)=>{
  $(target).innerHTML=days.map(day=>{
   const value=day[field],height=value?Math.max(4,Math.round(value/max*100)):0;
   return '<div class="daily-chart-item" title="'+escapeHtml(day.label)+': '+escapeHtml(format(value))+'"><span class="daily-chart-value">'+escapeHtml(format(value))+'</span><div class="daily-chart-track"><div class="daily-chart-bar '+kind+'" style="height:'+height+'%"></div></div><span class="daily-chart-day">'+escapeHtml(day.label)+'</span></div>';
  }).join("");
 };
 render("ordersChart","orders",maxOrders,value=>String(value),"");
 render("salesChart","sales",maxSales,value=>Number(value).toLocaleString(dashboardLocale())+" دج","sales");
}
function renderStats(){
 $("statOrders").textContent=orders.length.toLocaleString(dashboardLocale());
 $("statNewOrders").textContent=orders.filter(o=>o.status==="new").length.toLocaleString(dashboardLocale());
 const completed=orders.filter(o=>o.status==="completed");
 $("statCompletedOrders").textContent=completed.length.toLocaleString(dashboardLocale());
 const completedSales=completed.reduce((sum,o)=>sum+Number(o.total||0),0);
 $("statSales").textContent=completedSales.toLocaleString(dashboardLocale())+" دج";
 $("statProducts").textContent=products.length.toLocaleString(dashboardLocale());
 renderDailyCharts();
}
async function loadOrders(){
 const {data,error}=await supabase.from("orders").select("*").eq("store_id",store.id).order("created_at",{ascending:false});if(error)throw error;orders=data||[];renderOrders();
}
function renderOrders(){
 renderStats();$("ordersTotal").textContent=orders.length+" طلب";if(!orders.length){$("managedOrders").innerHTML='<p class="empty-products">لا توجد طلبات حتى الآن. ستظهر هنا طلبات الزبائن من متجرك.</p>';return;}
 const labels={new:"جديد",confirmed:"مؤكد",shipped:"تم الشحن",completed:"مكتمل",cancelled:"ملغى"},states=["new","confirmed","shipped","completed","cancelled"];
 $("managedOrders").innerHTML=orders.map(o=>{
  const items=Array.isArray(o.items)?o.items:[],detail=items.map(i=>'<span class="order-product-name">'+escapeHtml(i.name)+'</span> × '+Number(i.quantity||1)).join("، ");
  const opts=states.map(s=>'<option value="'+s+'" '+(o.status===s?"selected":"")+'>'+labels[s]+'</option>').join("");
  return '<article class="managed-order"><div class="managed-order-main"><strong>'+escapeHtml(o.customer_name)+'</strong><span>'+escapeHtml(o.customer_phone)+'</span><p>'+detail+'</p><small>'+new Date(o.created_at).toLocaleString(dashboardLocale())+' · '+Number(o.total||0).toLocaleString(dashboardLocale())+' دج</small>'+(o.notes?'<p class="order-note">ملاحظات: '+escapeHtml(o.notes)+'</p>':"")+'</div><div class="managed-order-controls"><span class="order-status order-status-'+o.status+'">'+(labels[o.status]||o.status)+'</span><select data-order-status="'+o.id+'" aria-label="تغيير حالة الطلب">'+opts+'</select></div></article>';
 }).join("");
}
async function updateOrderStatus(event){
 const select=event.target.closest("[data-order-status]");if(!select)return;
 const {data,error}=await supabase.rpc("set_order_status_with_stock",{p_order_id:select.dataset.orderStatus,p_store_id:store.id,p_status:select.value});
 if(error){message("profileFeedback","تعذر تحديث حالة الطلب: "+error.message);select.value=orders.find(o=>o.id===select.dataset.orderStatus)?.status||"new";return;}
 const index=orders.findIndex(o=>o.id===data.id);if(index>=0)orders[index]=data;renderOrders();
}


async function loadReviews(){
 const {data,error}=await supabase.from("store_reviews").select("*").eq("store_id",store.id).order("created_at",{ascending:false});
 if(error)throw error;reviews=data||[];renderReviews();
}
function renderReviews(){
 const approved=reviews.filter(r=>r.status==="approved"),average=approved.length?approved.reduce((s,r)=>s+Number(r.rating),0)/approved.length:0;
 $("reviewsAdminAverage").textContent=approved.length?average.toFixed(1)+"/5":"—";
 $("reviewsAdminStars").textContent=approved.length?"★".repeat(Math.round(average))+"☆".repeat(5-Math.round(average)):"☆☆☆☆☆";
 $("reviewsAdminCount").textContent=approved.length+" تقييم منشور · "+reviews.length+" إجمالي";
 const labels={pending:"بانتظار المراجعة",approved:"منشور",rejected:"مرفوض"};
 if(!reviews.length){$("managedReviews").innerHTML='<p class="empty-products">لا توجد تقييمات بعد. ستظهر هنا آراء الزبائن عندما يرسلونها من صفحة متجرك.</p>';return;}
 $("managedReviews").innerHTML=reviews.map(r=>'<article class="managed-review"><div class="managed-review-body"><div class="managed-review-head"><strong>'+escapeHtml(r.customer_name)+'</strong><span class="review-stars">'+("★".repeat(Number(r.rating))+"☆".repeat(5-Number(r.rating)))+'</span></div><p>'+escapeHtml(r.comment)+'</p><small>'+new Date(r.created_at).toLocaleString(dashboardLocale())+'</small><span class="review-state review-state-'+r.status+'">'+(labels[r.status]||r.status)+'</span></div><div class="managed-review-actions">'+(r.status!=="approved"?'<button type="button" data-review-action="approved" data-review-id="'+r.id+'">نشر</button>':"")+(r.status!=="rejected"?'<button type="button" data-review-action="rejected" data-review-id="'+r.id+'">رفض</button>':"")+'</div></article>').join("");
}
async function moderateReview(event){
 const button=event.target.closest("[data-review-action]");if(!button)return;
 button.disabled=true;
 const {data,error}=await supabase.from("store_reviews").update({status:button.dataset.reviewAction}).eq("id",button.dataset.reviewId).eq("store_id",store.id).select("*").single();
 if(error){message("profileFeedback","تعذر تحديث التقييم: "+error.message);button.disabled=false;return;}
 const i=reviews.findIndex(r=>r.id===data.id);if(i>=0)reviews[i]=data;renderReviews();
}

async function loadProducts(){
 const {data,error}=await supabase.from("products").select("*").eq("store_id",store.id).order("created_at",{ascending:false});
 if(error)throw error;products=data||[];renderProducts();
}
function fillSettings(){
 $("sellerNameInput").value=store.seller_name||"";
 $("sellerBioInput").value=store.seller_bio||"";
 $("storeNameInput").value=store.store_name||"";
 $("storeIdentityName").textContent=store.store_name||"متجري";
 $("storeIdentitySeller").textContent=store.seller_name||"صاحب المتجر";
 $("storeIdentityBio").textContent=store.seller_bio||"أضف نبذة قصيرة لتعريف الزبائن بمتجرك.";
 $("identityPublishStatus").textContent=store.is_published?"متجرك منشور للعامة":"متجرك غير منشور بعد";
 $("identityPublishStatus").classList.toggle("is-published",!!store.is_published);
 $("whatsappInput").value=store.whatsapp||"";
 $("accountEmail").textContent=user.email||"حساب التاجر";
 const publicUrl=new URL("store.html?store="+encodeURIComponent(store.slug),location.href).href;
 $("storeLink").href=publicUrl;
 const openPublicStore=$("openPublicStore");if(openPublicStore)openPublicStore.href=publicUrl;
 $("publicStoreSidebarLink").href=publicUrl;
 $("shareWhatsApp").href="https://wa.me/?text="+encodeURIComponent(dashboardText("shareStore")+publicUrl);
 $("shareFacebook").href="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(publicUrl);
 $("publishStore").textContent=store.is_published?"إلغاء نشر المتجر":"نشر المتجر";
 $("storeStatus").textContent=store.is_published?"متجرك منشور للعامة":"متجرك خاص حتى تنشره";
 showAvatar();
}
function showAvatar(){
 const src=store.avatar_url||"";
 $("avatarFallback").textContent=(store.seller_name||"S").trim().charAt(0).toUpperCase();
 $("avatarImage").src=src;$("avatarImage").hidden=!src;$("avatarFallback").hidden=!!src;
 $("identityAvatarFallback").textContent=(store.store_name||store.seller_name||"S").trim().charAt(0).toUpperCase();
 $("identityAvatarImage").src=src;$("identityAvatarImage").hidden=!src;$("identityAvatarFallback").hidden=!!src;
}
async function saveProfile(){
 const whatsapp=$("whatsappInput").value.trim().replace(/[\s+()-]/g,"");
 if(whatsapp&&!/^\d{8,15}$/.test(whatsapp)){message("profileFeedback","تحقق من رقم WhatsApp ورمز الدولة.");return;}
 const updates={seller_name:$("sellerNameInput").value.trim()||"Store Owner",seller_bio:$("sellerBioInput").value.trim(),store_name:$("storeNameInput").value.trim()||"متجري",whatsapp:whatsapp||null,updated_at:new Date().toISOString()};
 const {data,error}=await supabase.from("stores").update(updates).eq("id",store.id).select("*").single();
 if(error){message("profileFeedback",error.message);return;}
 store=data;fillSettings();message("profileFeedback","تم حفظ بيانات متجرك على السحابة.");
 const {error:profileError}=await supabase.from("profiles").update({full_name:store.seller_name,updated_at:new Date().toISOString()}).eq("id",user.id);
 if(profileError)console.warn("Profile sync:",profileError.message);
}
function extOf(file){const ext=(file.name.split(".").pop()||"jpg").toLowerCase();return ["jpg","jpeg","png","webp"].includes(ext)?ext:"jpg";}
async function uploadImage(file,bucket,folder,maxBytes){
 if(!file)return null;
 if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw new Error("اختر صورة JPEG أو PNG أو WebP.");
 if(file.size>maxBytes)throw new Error("حجم الصورة أكبر من الحد المسموح.");
 const path=user.id+"/"+store.id+"/"+folder+"/"+crypto.randomUUID()+"."+extOf(file);
 const {error}=await supabase.storage.from(bucket).upload(path,file,{upsert:false,contentType:file.type});
 if(error)throw error;
 return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
async function uploadAvatar(event){
 const file=event.target.files?.[0];if(!file)return;
 message("profileFeedback","جارٍ رفع الصورة...");
 try{
  const avatar_url=await uploadImage(file,"store-avatars","avatar",2*1024*1024);
  const {data,error}=await supabase.from("stores").update({avatar_url}).eq("id",store.id).select("*").single();
  if(error)throw error;store=data;showAvatar();
  const {error:profileError}=await supabase.from("profiles").update({avatar_url,updated_at:new Date().toISOString()}).eq("id",user.id);
  if(profileError)console.warn(profileError.message);
  message("profileFeedback","تم رفع صورة التاجر وحفظها على السحابة.");
 }catch(error){message("profileFeedback",error.message||"تعذر رفع الصورة.");}
 event.target.value="";
}
async function removeAvatar(){
 const {data,error}=await supabase.from("stores").update({avatar_url:null}).eq("id",store.id).select("*").single();
 if(error){message("profileFeedback",error.message);return;}
 store=data;showAvatar();await supabase.from("profiles").update({avatar_url:null}).eq("id",user.id);message("profileFeedback","تمت إزالة الصورة.");
}
function resetProductForm(){
 $("productForm").reset();$("editingProductId").value="";$("productEmoji").value="📦";$("productSubmit").textContent="＋ إضافة المنتج";$("cancelEdit").hidden=true;$("customProductCategory").hidden=true;$("customProductCategory").required=false;$("customProductCategory").value="";
}
function syncCustomCategory(){
 const custom=$("productCategory").value==="أخرى";$("customProductCategory").hidden=!custom;$("customProductCategory").required=custom;
 if(custom)$("customProductCategory").focus();
}
function renderProducts(){
 renderStats();$("productsTotal").textContent=products.length+" منتج";
 if(!products.length){$("managedProducts").innerHTML='<p class="empty-products">لا توجد منتجات بعد. أضف أول منتجك من النموذج أعلاه.</p>';return;}
  $("managedProducts").innerHTML=products.map(p=>{const tracked=p.stock_quantity!==null&&p.stock_quantity!==undefined;const qty=tracked?Number(p.stock_quantity):null;const stockLabel=!tracked?"مخزون غير محدود":qty===0?"نفد المخزون":qty<=5?"مخزون منخفض: "+qty+" قطعة":"المتوفر: "+qty+" قطعة";const stockClass=tracked&&qty<=5?"stock-low":"";return '<article class="managed-product"><div class="managed-product-emoji">'+(p.image_url?'<img src="'+escapeHtml(p.image_url)+'" alt="" loading="lazy">':escapeHtml(p.emoji||"📦"))+'</div><div class="managed-product-info"><strong>'+escapeHtml(p.name)+'</strong><span>'+escapeHtml(p.category||"عام")+' · '+Number(p.price||0).toLocaleString(dashboardLocale())+' دج · <b class="'+stockClass+'">'+stockLabel+'</b></span></div><div class="managed-product-actions"><button type="button" data-edit="'+p.id+'">تعديل</button><button type="button" class="delete-product" data-delete="'+p.id+'">حذف</button></div></article>';}).join("");
}
async function saveProduct(event){
 event.preventDefault();const id=$("editingProductId").value;const files=Array.from($("productImage").files||[]);
 const selectedCategory=$("productCategory").value;const category=selectedCategory==="أخرى"?$("customProductCategory").value.trim():selectedCategory;
 const stockValue=$("productStock").value.trim();const item={store_id:store.id,name:$("productName").value.trim(),category,price:Number($("productPrice").value),description:$("productDescription").value.trim(),currency:"DZD",is_active:true,stock_quantity:stockValue===""?null:Number(stockValue)};
 if(!item.name||!item.category||!Number.isFinite(item.price)||item.price<0)return;
 $("productSubmit").disabled=true;message("productFeedback","جارٍ حفظ المنتج...");
 try{
  const existingProduct=id?products.find(p=>p.id===id):null;
  const existingImages=existingProduct?(Array.isArray(existingProduct.image_urls)&&existingProduct.image_urls.length?existingProduct.image_urls:[existingProduct.image_url].filter(Boolean)):[];
  if(existingImages.length+files.length>5)throw new Error("يمكن إضافة 5 صور كحد أقصى للمنتج الواحد.");
  const uploadedImages=[];
  for(const file of files)uploadedImages.push(await uploadImage(file,"product-images","products",5*1024*1024));
  item.image_urls=[...existingImages,...uploadedImages];
  item.image_url=item.image_urls[0]||null;
  if(id){
   const {error}=await supabase.from("products").update(item).eq("id",id).eq("store_id",store.id);if(error)throw error;
   message("productFeedback","تم تحديث المنتج على السحابة.");
  }else{
   const {error}=await supabase.from("products").insert(item);if(error)throw error;
   message("productFeedback","تمت إضافة المنتج إلى متجرك.");
  }
  await loadProducts();resetProductForm();
 }catch(error){message("productFeedback",error.message||"تعذر حفظ المنتج.");}
 finally{$("productSubmit").disabled=false;}
}
async function manageProductClick(event){
 const edit=event.target.closest("[data-edit]"),del=event.target.closest("[data-delete]");
 if(edit){
  const p=products.find(x=>x.id===edit.dataset.edit);if(!p)return;
  $("editingProductId").value=p.id;$("productName").value=p.name;const knownCategory=Array.from($("productCategory").options).some(o=>o.value===p.category);$("productCategory").value=knownCategory?(p.category||""):"أخرى";$("customProductCategory").value=knownCategory?"":(p.category||"");syncCustomCategory();$("productPrice").value=p.price;$("productStock").value=p.stock_quantity??"";$("productDescription").value=p.description||"";$("productImage").value="";$("productEmoji").value="📦";$("productSubmit").textContent="حفظ التعديلات";$("cancelEdit").hidden=false;$("productForm").scrollIntoView({behavior:"smooth",block:"center"});
 }
 if(del){
  const p=products.find(x=>x.id===del.dataset.delete);if(!p||!confirm(dashboardText("confirmDelete")+p.name+"?"))return;
  const {error}=await supabase.from("products").delete().eq("id",p.id).eq("store_id",store.id);
  if(error){message("productFeedback",error.message);return;}
  products=products.filter(x=>x.id!==p.id);renderProducts();message("productFeedback","تم حذف المنتج.");
 }
}
async function copyStoreLink(){
 const publicUrl=new URL("store.html?store="+encodeURIComponent(store.slug),location.href).href;
 try{await navigator.clipboard.writeText(publicUrl);message("profileFeedback","تم نسخ رابط متجرك. "+(store.is_published?"يمكنك مشاركته الآن.":"انشر المتجر أولاً ليتمكن الزوار من مشاهدة المنتجات."));}
 catch(error){message("profileFeedback","تعذر النسخ تلقائياً. استخدم زر عرض المتجر لفتح الرابط ونسخه من شريط العنوان.");}
}
async function togglePublish(){
 const next=!store.is_published;
 const {data,error}=await supabase.from("stores").update({is_published:next,updated_at:new Date().toISOString()}).eq("id",store.id).select("*").single();
 if(error){message("profileFeedback",error.message);return;}
 store=data;fillSettings();message("profileFeedback",next?"تم نشر متجرك. يمكنك مشاركة رابط المتجر.":"تم إلغاء نشر المتجر.");
}
async function init(){
 initDashboardTheme();
 const logoutButton=$("logoutButton");
 if(logoutButton)logoutButton.addEventListener("click",async()=>{
  logoutButton.disabled=true;
  logoutButton.textContent="جارٍ تسجيل الخروج...";
  try{
   const {error}=await supabase.auth.signOut({scope:"local"});
   if(error)throw error;
   location.replace(new URL("index.html?logged_out=1",location.href).href);
  }catch(error){
   console.error("Sign out failed:",error);
   logoutButton.disabled=false;
   logoutButton.textContent="تسجيل الخروج";
   alert(dashboardText("logoutError"));
  }
 });
 const {data:{session}}=await supabase.auth.getSession();
 if(!session){location.replace("auth.html?next=dashboard.html");return;}
 user=session.user;
 try{
  store=await ensureStore();fillSettings();await loadProducts();await loadOrders();await loadReviews();
 }catch(error){
  $("storeStatus").textContent="تعذر تحميل بيانات المتجر";message("profileFeedback",error.message||"تحقق من الاتصال ثم أعد المحاولة.");
 }
 $("saveProfile").addEventListener("click",saveProfile);
 $("avatarUpload").addEventListener("change",uploadAvatar);
 $("removeAvatar").addEventListener("click",removeAvatar);
 $("productForm").addEventListener("submit",saveProduct);
 $("productCategory").addEventListener("change",syncCustomCategory);
 $("managedProducts").addEventListener("click",manageProductClick);
 $("managedOrders").addEventListener("change",updateOrderStatus);
 $("managedReviews").addEventListener("click",moderateReview);
 $("cancelEdit").addEventListener("click",resetProductForm);
 $("publishStore").addEventListener("click",togglePublish);
 $("copyStoreLink").addEventListener("click",copyStoreLink);
 $("dashYear").textContent=new Date().getFullYear();
}
init();
