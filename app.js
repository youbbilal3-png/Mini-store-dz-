import { supabase } from "./supabase-client.js";
const DEFAULT_STORE_SETTINGS={whatsapp:"213000000000",sellerName:"Mini Store DZ",sellerDescription:"متجرك، هويتك.",sellerAvatar:""};
let STORE_SETTINGS={...DEFAULT_STORE_SETTINGS};
const defaultProducts=[
{id:"d1",name:"سماعات لاسلكية",fr:"Écouteurs sans fil",en:"Wireless Earbuds",category:"إلكترونيات",categoryFr:"Électronique",categoryEn:"Electronics",price:3500,description:"صوت واضح وتصميم مريح للاستخدام اليومي.",descriptionFr:"Un son clair et un design confortable au quotidien.",descriptionEn:"Clear sound and a comfortable everyday fit.",emoji:"🎧"},
{id:"d2",name:"ساعة ذكية",fr:"Montre connectée",en:"Smart Watch",category:"إلكترونيات",categoryFr:"Électronique",categoryEn:"Electronics",price:6200,description:"تابع نشاطك وإشعاراتك بسهولة.",descriptionFr:"Suivez facilement votre activité et vos notifications.",descriptionEn:"Track your activity and notifications.",emoji:"⌚"},
{id:"d3",name:"حقيبة عصرية",fr:"Sac tendance",en:"Everyday Bag",category:"إكسسوارات",categoryFr:"Accessoires",categoryEn:"Accessories",price:2800,description:"حقيبة عملية بتصميم أنيق.",descriptionFr:"Un sac pratique au design élégant.",descriptionEn:"A practical bag with a modern look.",emoji:"👜"},
{id:"d4",name:"مصباح مكتبي",fr:"Lampe de bureau",en:"Desk Lamp",category:"المنزل",categoryFr:"Maison",categoryEn:"Home",price:1900,description:"إضاءة مريحة لمكتبك أو غرفتك.",descriptionFr:"Un éclairage agréable pour votre bureau ou votre chambre.",descriptionEn:"Comfortable lighting for your desk or room.",emoji:"💡"}];
let products=defaultProducts,language="ar",activeCategory="all",searchTerm="",currentStoreId=null,selectedOrderProduct=null,publicReviews=[];
const translations={
ar:{navProducts:"المنتجات",navAbout:"من نحن",navContact:"اتصل بنا",languageLabel:"اللغة",eyebrow:"متجرك يبدأ من هنا",heroTitle:'اكتشف منتجاتك المفضلة<br><em>بسهولة وثقة</em>',heroText:"تصفح منتجاتنا واختر ما يناسبك. اطلب مباشرة عبر واتساب.",browse:"تصفح المنتجات",sellerLabel:"صاحب المتجر",collection:"تشكيلتنا",productsTitle:"منتجات مختارة",searchPlaceholder:"ابحث عن منتج...",all:"الكل",empty:"لا توجد منتجات مطابقة لبحثك.",whyUs:"لماذا متجرنا؟",aboutTitle:"تجربة شراء سهلة ومباشرة",aboutText:"منتجات مميزة ومعلومات واضحة وطلب سهل عبر واتساب.",needHelp:"هل لديك سؤال؟",contactTitle:"تواصل معنا",contactText:"نحن هنا لمساعدتك في اختيار المنتج المناسب.",whatsappUs:"راسلنا عبر واتساب",rights:"جميع الحقوق محفوظة.",order:"اطلب الآن",orderMessage:"مرحباً، أريد طلب: ",currency:"دج",count:"منتجات",sellerDescription:"متجرك، هويتك.",orderFormTitle:"إتمام الطلب",customerName:"الاسم الكامل",customerPhone:"رقم الهاتف",quantity:"الكمية",sendOrder:"تأكيد الطلب والمتابعة إلى WhatsApp",orderSaved:"تم تسجيل طلبك. أكمل الإرسال عبر WhatsApp.",orderFailed:"تعذر تسجيل الطلب. حاول مرة أخرى."},
fr:{navProducts:"Produits",navAbout:"À propos",navContact:"Contact",languageLabel:"Langue",eyebrow:"Votre boutique commence ici",heroTitle:'Découvrez vos produits préférés<br><em>en toute simplicité</em>',heroText:"Parcourez nos produits et commandez directement sur WhatsApp.",browse:"Voir les produits",sellerLabel:"Vendeur",collection:"NOTRE COLLECTION",productsTitle:"Produits sélectionnés",searchPlaceholder:"Rechercher un produit...",all:"Tout",empty:"Aucun produit ne correspond à votre recherche.",whyUs:"POURQUOI NOUS CHOISIR",aboutTitle:"Une expérience d’achat simple",aboutText:"Des produits sélectionnés, des informations claires et une commande facile sur WhatsApp.",needHelp:"Une question ?",contactTitle:"Contactez-nous",contactText:"Nous sommes là pour vous aider à choisir.",whatsappUs:"Écrire sur WhatsApp",rights:"Tous droits réservés.",order:"Commander",orderMessage:"Bonjour, je souhaite commander : ",currency:"DZD",count:"produits",sellerDescription:"Votre boutique, votre identité.",orderFormTitle:"Finaliser la commande",customerName:"Nom complet",customerPhone:"Téléphone",quantity:"Quantité",sendOrder:"Confirmer et continuer sur WhatsApp",orderSaved:"Commande enregistrée. Terminez sur WhatsApp.",orderFailed:"Impossible d’enregistrer la commande."},
en:{navProducts:"Products",navAbout:"About",navContact:"Contact",languageLabel:"Language",eyebrow:"Your store starts here",heroTitle:'Discover your favorite products<br><em>with ease and confidence</em>',heroText:"Browse our products and order directly through WhatsApp.",browse:"Browse products",sellerLabel:"Store owner",collection:"OUR COLLECTION",productsTitle:"Featured products",searchPlaceholder:"Search products...",all:"All",empty:"No products match your search.",whyUs:"WHY SHOP WITH US",aboutTitle:"A simple shopping experience",aboutText:"Selected products, clear information and easy WhatsApp ordering.",needHelp:"Have a question?",contactTitle:"Get in touch",contactText:"We are here to help you choose.",whatsappUs:"Chat on WhatsApp",rights:"All rights reserved.",order:"Order now",orderMessage:"Hello, I'd like to order: ",currency:"DZD",count:"products",sellerDescription:"Your store, your identity.",orderFormTitle:"Complete your order",customerName:"Full name",customerPhone:"Phone number",quantity:"Quantity",sendOrder:"Confirm and continue to WhatsApp",orderSaved:"Order saved. Continue on WhatsApp.",orderFailed:"Could not save your order."}
};
const el=id=>document.getElementById(id);
const safe=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function productText(p,field){if(field==="name")return (language==="fr"?p.fr:language==="en"?p.en:p.name)||p.name;if(language==="fr")return p[field+"Fr"]||p[field];if(language==="en")return p[field+"En"]||p[field];return p[field];}
function categoryOf(p){return (language==="fr"?p.categoryFr:language==="en"?p.categoryEn:p.category)||p.category||"General";}
function whatsappLink(p){return "https://wa.me/"+(STORE_SETTINGS.whatsapp||"")+"?text="+encodeURIComponent(translations[language].orderMessage+productText(p,"name"));}
function renderFilters(){const cats=[...new Set(products.map(categoryOf))];const buttons=[{value:"all",label:translations[language].all},...cats.map(category=>({value:category,label:category}))];el("categoryFilters").innerHTML=buttons.map(x=>'<button type="button" class="filter-btn '+(activeCategory===x.value?"active":"")+'" data-category="'+safe(x.value)+'">'+safe(x.label)+'</button>').join("");}
function renderProducts(){
 const list=products.filter(p=>{const cat=categoryOf(p),hay=[p.name,p.fr,p.en,p.category,p.categoryFr,p.categoryEn].join(" ").toLowerCase();return(activeCategory==="all"||cat===activeCategory)&&hay.includes(searchTerm.toLowerCase());});
 el("productGrid").innerHTML=list.map(p=>{const name=productText(p,"name"),desc=productText(p,"description");const visual=p.image_url?'<img src="'+safe(p.image_url)+'" alt="'+safe(name)+'" loading="lazy">':safe(p.emoji||"📦");return '<article class="product-card"><div class="product-image">'+visual+'</div><div class="product-info"><span class="product-category">'+safe(categoryOf(p))+'</span><h3>'+safe(name)+'</h3><p>'+safe(desc||"")+'</p><div class="product-bottom"><span class="price">'+Number(p.price||0).toLocaleString(language==="ar"?"ar-DZ":language==="fr"?"fr-FR":"en-US")+' '+translations[language].currency+'</span>'+(currentStoreId?'<button type="button" class="order-btn" data-order="'+safe(p.id)+'">'+translations[language].order+'</button>':'<a class="order-btn" href="'+whatsappLink(p)+'" target="_blank" rel="noopener">'+translations[language].order+'</a>')+'</div></div></article>';}).join("");
 el("emptyState").hidden=list.length>0;el("productCount").textContent=list.length+" "+translations[language].count;
}
function renderSellerProfile(){const name=STORE_SETTINGS.sellerName||"Store Owner";el("sellerName").textContent=name;el("sellerDescription").textContent=STORE_SETTINGS.sellerDescription||translations[language].sellerDescription;el("sellerInitials").textContent=name.trim().charAt(0).toUpperCase()||"S";const avatar=el("sellerAvatar");if(STORE_SETTINGS.sellerAvatar){avatar.src=STORE_SETTINGS.sellerAvatar;avatar.hidden=false;el("sellerInitials").hidden=true;avatar.onerror=()=>{avatar.hidden=true;el("sellerInitials").hidden=false;};}else{avatar.hidden=true;el("sellerInitials").hidden=false;}}
function applyLanguage(){document.documentElement.lang=language;document.documentElement.dir=language==="ar"?"rtl":"ltr";document.querySelectorAll("[data-i18n]").forEach(n=>{const k=n.dataset.i18n;if(translations[language][k])n.innerHTML=translations[language][k];});document.querySelectorAll("[data-i18n-placeholder]").forEach(n=>n.placeholder=translations[language][n.dataset.i18nPlaceholder]);renderSellerProfile();renderFilters();renderProducts();el("contactButton").href="https://wa.me/"+(STORE_SETTINGS.whatsapp||"");}

function openOrderDialog(productId){
 const product=products.find(p=>String(p.id)===String(productId));if(!product)return;selectedOrderProduct=product;const t=translations[language];
 el("orderDialogTitle").textContent=t.orderFormTitle;el("orderProductSummary").textContent=productText(product,"name")+" · "+Number(product.price||0).toLocaleString()+" "+t.currency;
 el("orderDialogTotal").textContent=t.quantity+": 1 · "+Number(product.price||0).toLocaleString()+" "+t.currency;el("customerQuantity").value=1;el("submitCustomerOrder").textContent=t.sendOrder;el("orderDialogFeedback").textContent="";el("orderDialog").showModal();
}
async function submitCustomerOrder(event){
 event.preventDefault();if(!currentStoreId||!selectedOrderProduct)return;
 const name=el("customerName").value.trim(),phone=el("customerPhone").value.trim(),quantity=Number(el("customerQuantity").value),notes=el("customerNotes").value.trim();
 if(!name||!phone||!Number.isInteger(quantity)||quantity<1||quantity>99)return;
 const popup=window.open("about:blank","_blank"),total=Number(selectedOrderProduct.price||0)*quantity;
 const item={product_id:selectedOrderProduct.id,name:productText(selectedOrderProduct,"name"),quantity,unit_price:Number(selectedOrderProduct.price||0)};
 el("submitCustomerOrder").disabled=true;el("orderDialogFeedback").textContent="جارٍ تسجيل طلبك...";
 try{
  const {error}=await supabase.from("orders").insert({store_id:currentStoreId,customer_name:name,customer_phone:phone,items:[item],total,notes:notes||null});if(error)throw error;
  const msg="مرحباً، أرسلت طلباً جديداً عبر Mini Store DZ\nالمنتج: "+item.name+"\nالكمية: "+quantity+"\nالمجموع: "+total+" DZD\nالاسم: "+name+"\nالهاتف: "+phone+(notes?"\nملاحظات: "+notes:"");
  const target="https://wa.me/"+(STORE_SETTINGS.whatsapp||"")+"?text="+encodeURIComponent(msg);if(popup)popup.location=target;else window.location.href=target;
  el("orderDialogFeedback").textContent=translations[language].orderSaved;setTimeout(()=>el("orderDialog").close(),900);
 }catch(error){if(popup)popup.close();console.error(error);el("orderDialogFeedback").textContent=translations[language].orderFailed;}finally{el("submitCustomerOrder").disabled=false;}
}


async function loadPublicReviews(){
 const section=el("reviews");if(!section||!currentStoreId)return;
 section.hidden=false;
 const {data,error}=await supabase.from("store_reviews").select("id,customer_name,rating,comment,created_at").eq("store_id",currentStoreId).eq("status","approved").order("created_at",{ascending:false}).limit(20);
 if(error){console.error("Reviews loading error:",error);return;}
 publicReviews=data||[];renderPublicReviews();
}
function renderPublicReviews(){
 const count=publicReviews.length,average=count?publicReviews.reduce((sum,r)=>sum+Number(r.rating),0)/count:0;
 el("reviewsAverage").textContent=count?average.toFixed(1)+"/5":"—";
 el("reviewsStars").textContent=count?"★".repeat(Math.round(average))+"☆".repeat(5-Math.round(average)):"☆☆☆☆☆";
 el("reviewsCount").textContent=count+" "+translations[language].reviewCount;
 el("publicReviews").innerHTML=count?publicReviews.map(r=>'<article class="public-review"><div class="public-review-top"><strong>'+safe(r.customer_name)+'</strong><span class="review-stars">'+("★".repeat(Number(r.rating))+"☆".repeat(5-Number(r.rating)))+'</span></div><p>'+safe(r.comment)+'</p><small>'+new Date(r.created_at).toLocaleDateString(language==="ar"?"ar-DZ":language==="fr"?"fr-FR":"en-US")+'</small></article>').join(""):'<p class="empty-state">'+translations[language].noReviews+'</p>';
}
async function submitCustomerReview(event){
 event.preventDefault();if(!currentStoreId)return;
 const name=el("reviewCustomerName").value.trim(),rating=Number(el("reviewRating").value),comment=el("reviewComment").value.trim();
 if(name.length<2||comment.length<3||!Number.isInteger(rating)||rating<1||rating>5)return;
 const button=el("submitReview");button.disabled=true;el("reviewFeedback").textContent="";
 try{
  const {error}=await supabase.from("store_reviews").insert({store_id:currentStoreId,customer_name:name,rating,comment});
  if(error)throw error;
  el("customerReviewForm").reset();el("reviewFeedback").textContent=translations[language].reviewPending;
 }catch(error){console.error("Review submission error:",error);el("reviewFeedback").textContent=translations[language].reviewFailed;}
 finally{button.disabled=false;}
}

async function loadStore(){
 const slug=new URLSearchParams(location.search).get("store");if(!slug)return;
 try{
  const {data:store,error}=await supabase.from("stores").select("id,store_name,seller_name,seller_bio,avatar_url,whatsapp,description,slug").eq("slug",slug).eq("is_published",true).maybeSingle();
  if(error)throw error;if(!store){products=[];STORE_SETTINGS={...DEFAULT_STORE_SETTINGS,sellerName:"المتجر غير متاح",sellerDescription:"هذا المتجر غير منشور أو أن الرابط غير صحيح.",whatsapp:""};return;}
  currentStoreId=store.id;STORE_SETTINGS={whatsapp:store.whatsapp||"",sellerName:store.seller_name||store.store_name,sellerDescription:[store.store_name,store.seller_bio].filter(Boolean).join(" · "),sellerAvatar:store.avatar_url||""};
  const {data:list,error:productError}=await supabase.from("products").select("id,name,description,category,price,currency,image_url").eq("store_id",store.id).eq("is_active",true).order("created_at",{ascending:false});
  if(productError)throw productError;products=(list||[]).map(p=>({...p,emoji:"📦"}));
  document.title=store.store_name+" | Mini Store DZ";
 }catch(error){console.error("Store loading error:",error);}
}
el("languageSelect").addEventListener("change",e=>{language=e.target.value;activeCategory="all";applyLanguage();});
el("searchInput").addEventListener("input",e=>{searchTerm=e.target.value;renderProducts();});
el("categoryFilters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;renderFilters();renderProducts();});
el("productGrid").addEventListener("click",e=>{const b=e.target.closest("[data-order]");if(b)openOrderDialog(b.dataset.order);});
el("customerQuantity").addEventListener("input",()=>{if(!selectedOrderProduct)return;const qty=Math.max(1,Math.min(99,Number(el("customerQuantity").value)||1));el("orderDialogTotal").textContent=translations[language].quantity+": "+qty+" · "+(Number(selectedOrderProduct.price||0)*qty).toLocaleString()+" "+translations[language].currency;});
el("customerOrderForm").addEventListener("submit",submitCustomerOrder);el("customerReviewForm").addEventListener("submit",submitCustomerReview);el("closeOrderDialog").addEventListener("click",()=>el("orderDialog").close());
el("year").textContent=new Date().getFullYear();
await loadStore();applyLanguage();await loadPublicReviews();
