/**
 * Pax-style booking/cart runtime for generated static sites.
 * CART_KEY aligned with services + cart page.
 * Confirm → WhatsApp owner (body[data-wa]) with name, phone, date/time, services, total.
 */

export const COMMERCE_BOOKING_RUNTIME = `
/* goke: Pax-style cart / booking → owner WhatsApp */
(function(){
  var CART_KEY="goke_cart";
  function mode(){
    try{
      var m=(document.body&&document.body.getAttribute("data-goke-cart-mode"))||window.__GOKE_CART_MODE__||"commerce";
      return m==="booking"?"booking":"commerce";
    }catch(e){return "commerce";}
  }
  function wa(){
    var n=(document.body&&document.body.getAttribute("data-wa"))||"";
    return String(n).replace(/\\D/g,"");
  }
  function money(n){try{return "₦"+Number(n||0).toLocaleString("en-NG");}catch(e){return "₦"+n;}}
  function read(){try{return JSON.parse(localStorage.getItem(CART_KEY)||"[]");}catch(e){return [];}}
  function write(items){localStorage.setItem(CART_KEY,JSON.stringify(items));updateUI();}
  function updateUI(){
    var items=read();
    var count=items.reduce(function(s,i){return s+(i.qty||1);},0);
    var total=items.reduce(function(s,i){return s+((i.price||0)*(i.qty||1));},0);
    document.querySelectorAll(".goke-cart-count,.goke-cart-badge,#bookingCount").forEach(function(el){
      el.textContent=String(count);
      if(el.classList&&el.classList.contains("goke-cart-badge")) el.style.display=count?"inline-flex":"none";
    });
    document.querySelectorAll(".goke-cart-total,#goke-cart-total").forEach(function(el){el.textContent=money(total);});
    document.querySelectorAll(".goke-cart-empty").forEach(function(el){el.style.display=count?"none":"";});
    document.querySelectorAll(".goke-cart-full").forEach(function(el){el.style.display=count?"":"none";});
    renderCartPage(items,total);
  }
  function renderCartPage(items,total){
    var box=document.getElementById("goke-cart-items");
    if(!box) return;
    box.innerHTML="";
    if(!items.length){
      box.innerHTML="<p class='goke-cart-empty-msg' style='color:var(--muted)'>No items selected yet.</p>";
      var t=document.getElementById("goke-cart-total");
      if(t) t.textContent="₦0";
      return;
    }
    items.forEach(function(item,index){
      var row=document.createElement("div");
      row.className="goke-cart-item";
      row.innerHTML="<div><strong></strong><span class='price'></span></div><button type='button' aria-label='Remove'>✕</button>";
      row.querySelector("strong").textContent=item.name+(item.qty>1?" ×"+item.qty:"");
      row.querySelector(".price").textContent=money((item.price||0)*(item.qty||1));
      row.querySelector("button").onclick=function(){
        var next=read();
        next.splice(index,1);
        write(next);
      };
      box.appendChild(row);
    });
    var t=document.getElementById("goke-cart-total");
    if(t) t.textContent=money(total);
  }
  function addFromEl(btn){
    var card=btn.closest("[data-product-id],.goke-product-card,.svc-card,.service-card");
    if(!card) return;
    var id=card.getAttribute("data-product-id")||card.getAttribute("data-id")||String(Date.now());
    var name=card.getAttribute("data-product-name")||(card.querySelector("h3,h2,h4,.goke-product-name")||{}).textContent||"Item";
    var price=parseInt(card.getAttribute("data-product-price")||"0",10)||0;
    var items=read();
    var found=items.find(function(x){return x.id===id;});
    if(found) found.qty=(found.qty||1)+1;
    else items.push({id:id,name:String(name).trim(),price:price,qty:1});
    write(items);
    var label=btn.getAttribute("data-label")||btn.textContent||"";
    try{btn.textContent="Added ✓";setTimeout(function(){btn.textContent=label;},900);}catch(e){}
  }
  function buildMessage(items,form){
    var isBook=mode()==="booking";
    var lines=isBook?["New booking request 📅"]:["New order from website 🛒"];
    var total=0;
    items.forEach(function(i){
      var line=(i.qty||1)+"× "+i.name;
      if(i.price) line+=" — "+money((i.price||0)*(i.qty||1));
      lines.push(line);
      total+=(i.price||0)*(i.qty||1);
    });
    if(total>0) lines.push("Total: "+money(total));
    if(form){
      if(form.name) lines.push("Name: "+form.name);
      if(form.phone) lines.push("Phone: "+form.phone);
      if(form.email) lines.push("Email: "+form.email);
      if(form.date) lines.push("Date: "+form.date);
      if(form.time) lines.push("Time: "+form.time);
      if(form.notes) lines.push("Notes: "+form.notes);
      if(form.message) lines.push("Message: "+form.message);
    }
    lines.push(isBook?"Please confirm availability. Thank you.":"Please confirm this order. Thank you.");
    return lines.join("\\n");
  }
  function openWa(text){
    var num=wa();
    if(!num){alert("WhatsApp number not set on this site.");return;}
    window.open("https://wa.me/"+num+"?text="+encodeURIComponent(text),"_blank","noopener,noreferrer");
  }
  function checkout(form){
    var items=read();
    if(!items.length){
      alert(mode()==="booking"?"Add at least one service to your booking.":"Your cart is empty.");
      return;
    }
    openWa(buildMessage(items,form||{}));
  }
  function bindCart(){
    document.querySelectorAll(".goke-add-cart").forEach(function(btn){
      if(btn.__gokeCart) return;
      btn.__gokeCart=true;
      if(!btn.getAttribute("data-label")) btn.setAttribute("data-label",btn.textContent||"");
      btn.addEventListener("click",function(e){e.preventDefault();addFromEl(btn);});
    });
    document.querySelectorAll(".goke-cart-checkout").forEach(function(btn){
      if(btn.__gokeChk) return;
      btn.__gokeChk=true;
      btn.addEventListener("click",function(e){e.preventDefault();checkout();});
    });
    var form=document.getElementById("goke-cart-form");
    if(form&&!form.__gokeBook){
      form.__gokeBook=true;
      form.addEventListener("submit",function(e){
        e.preventDefault();
        var fd=new FormData(form);
        var data={};
        fd.forEach(function(v,k){data[k]=String(v).trim();});
        if(!data.name||!data.phone){alert("Please enter your name and phone.");return;}
        if(mode()==="booking"&&(!data.date||!data.time)){alert("Please choose a preferred date and time.");return;}
        checkout(data);
      });
    }
    updateUI();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bindCart);
  else bindCart();
})();
`;

export function ensureCommerceRuntime(js: string): string {
  if (js.includes("goke_cart") && js.includes("goke-cart-form")) return js;
  if (js.includes("goke_cart") && js.includes("goke-add-cart")) {
    // upgrade older runtime
    return js.trim() + "\n" + COMMERCE_BOOKING_RUNTIME;
  }
  return js.trim() + "\n" + COMMERCE_BOOKING_RUNTIME;
}

export const ensureCommerceBookingScript = ensureCommerceRuntime;
