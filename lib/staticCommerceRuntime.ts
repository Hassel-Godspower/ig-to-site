/**
 * Unified cart runtime:
 * - Sales (commerce): Aurelia-style qty cart + checkout form → WhatsApp order
 * - Services (booking): Pax-style booking cart → WhatsApp booking
 */

export const COMMERCE_BOOKING_RUNTIME = `
/* goke cart / booking / aurelia-style checkout → owner WhatsApp */
(function(){
  var CART_KEY="goke_cart";
  function mode(){
    try{
      var m=(document.body&&document.body.getAttribute("data-goke-cart-mode"))||"commerce";
      return m==="booking"?"booking":"commerce";
    }catch(e){return "commerce";}
  }
  function wa(){
    return String((document.body&&document.body.getAttribute("data-wa"))||"").replace(/\\D/g,"");
  }
  function money(n){
    if(window.GOKE_FORMAT) return window.GOKE_FORMAT(n);
    try{return "₦"+Number(n||0).toLocaleString("en-NG");}catch(e){return "₦"+n;}
  }
  function products(){return window.GOKE_PRODUCTS||[];}
  function product(id){return products().find(function(p){return p.id===id;});}
  function read(){try{return JSON.parse(localStorage.getItem(CART_KEY)||"[]");}catch(e){return [];}}
  function write(items){
    localStorage.setItem(CART_KEY,JSON.stringify(items));
    try{window.dispatchEvent(new CustomEvent("goke:cart",{detail:items}));}catch(e){}
    updateUI();
  }
  function lines(){
    return read().map(function(i){
      var p=product(i.id);
      var name=i.name||(p&&p.name)||"Item";
      var price=i.price!=null?i.price:(p?p.price:0);
      var image=i.image||(p&&p.image)||"";
      var qty=i.qty||1;
      return {id:i.id,name:name,price:price,image:image,qty:qty,lineTotal:price*qty};
    });
  }
  function count(){return lines().reduce(function(s,l){return s+l.qty;},0);}
  function subtotal(){return lines().reduce(function(s,l){return s+l.lineTotal;},0);}

  function updateUI(){
    var n=count(), sub=subtotal();
    document.querySelectorAll(".goke-cart-count,.goke-cart-badge,[data-cart-count]").forEach(function(el){
      el.textContent=String(n);
      if(el.hasAttribute("hidden")||el.classList.contains("goke-cart-badge")){
        if(n===0){el.setAttribute("hidden","");el.style.display="none";}
        else{el.removeAttribute("hidden");el.style.display="inline-flex";}
      }
    });
    document.querySelectorAll("#goke-cart-total,#goke-cart-subtotal,#goke-checkout-total,.goke-cart-total").forEach(function(el){
      el.textContent=money(sub);
    });
    document.querySelectorAll(".goke-cart-empty").forEach(function(el){el.style.display=n?"none":"";});
    document.querySelectorAll(".goke-cart-full").forEach(function(el){el.style.display=n?"":"none";});
    renderCartPage();
    renderCheckoutSummary();
  }

  function renderCartPage(){
    var box=document.getElementById("goke-cart-items")||document.querySelector("[data-cart-page]");
    if(!box) return;
    var ls=lines();
    if(!ls.length){
      box.innerHTML="<p class='goke-cart-empty-msg' style='color:var(--muted)'>Your cart is empty. <a href='shop.html'>Browse the shop</a> or <a href='services.html'>services</a>.</p>";
      return;
    }
    box.innerHTML="";
    ls.forEach(function(l){
      var row=document.createElement("div");
      row.className="goke-cart-line";
      row.innerHTML=
        (l.image?'<img src="'+l.image.replace(/"/g,"")+'" alt="" width="72" height="72"/>':'<div></div>')+
        '<div class="meta"><strong></strong><div class="price"></div>'+
        '<div class="goke-qty"><button type="button" data-minus aria-label="Decrease">−</button>'+
        '<input type="number" min="1" max="99" data-qty/>'+
        '<button type="button" data-plus aria-label="Increase">+</button></div></div>'+
        '<div><div class="line-total"></div><button type="button" class="remove" aria-label="Remove">Remove</button></div>';
      row.querySelector("strong").textContent=l.name;
      row.querySelector(".price").textContent=money(l.price)+" each";
      row.querySelector(".line-total").textContent=money(l.lineTotal);
      var input=row.querySelector("[data-qty]");
      input.value=String(l.qty);
      row.querySelector("[data-minus]").onclick=function(){setQty(l.id,l.qty-1);};
      row.querySelector("[data-plus]").onclick=function(){setQty(l.id,l.qty+1);};
      input.onchange=function(){setQty(l.id,input.value);};
      row.querySelector(".remove").onclick=function(){setQty(l.id,0);};
      box.appendChild(row);
    });
  }

  function renderCheckoutSummary(){
    var box=document.getElementById("goke-checkout-summary")||document.querySelector("[data-checkout-summary]");
    if(!box) return;
    var ls=lines();
    if(!ls.length){box.innerHTML="<p style='color:var(--muted)'>No items. <a href='shop.html'>Go to shop</a></p>";return;}
    box.innerHTML=ls.map(function(l){
      return '<div class="order-line"><span class="name"></span><span class="amt"></span></div>';
    }).join("");
    var nodes=box.querySelectorAll(".order-line");
    ls.forEach(function(l,i){
      nodes[i].querySelector(".name").textContent=l.name+" × "+l.qty;
      nodes[i].querySelector(".amt").textContent=money(l.lineTotal);
    });
  }

  function setQty(id,qty){
    qty=Math.max(0,parseInt(qty,10)||0);
    var items=read();
    if(qty<=0) items=items.filter(function(i){return i.id!==id;});
    else{
      var row=items.find(function(i){return i.id===id;});
      if(row) row.qty=qty;
      else items.push({id:id,qty:qty});
    }
    write(items);
  }

  function addFromEl(btn){
    var card=btn.closest("[data-product-id],.goke-product-card,.svc-card");
    if(!card) return;
    var id=card.getAttribute("data-product-id")||String(Date.now());
    var name=card.getAttribute("data-product-name")||(card.querySelector("h3,h2,.goke-product-name")||{}).textContent||"Item";
    var price=parseInt(card.getAttribute("data-product-price")||"0",10)||0;
    var image=(card.querySelector("img")||{}).src||"";
    var items=read();
    var found=items.find(function(x){return x.id===id;});
    if(found) found.qty=(found.qty||1)+1;
    else items.push({id:id,name:String(name).trim(),price:price,image:image,qty:1});
    write(items);
    var label=btn.getAttribute("data-label")||btn.textContent||"";
    try{btn.textContent="Added ✓";setTimeout(function(){btn.textContent=label;},900);}catch(e){}
  }

  function buildOrderMessage(form){
    var isBook=mode()==="booking";
    var ls=lines();
    var linesMsg=isBook?["New booking request 📅"]:["New order from website 🛒"];
    var total=0;
    ls.forEach(function(l){
      linesMsg.push(l.qty+"× "+l.name+" — "+money(l.lineTotal));
      total+=l.lineTotal;
    });
    linesMsg.push("Total: "+money(total));
    if(form){
      if(form.name) linesMsg.push("Name: "+form.name);
      if(form.phone) linesMsg.push("Phone: "+form.phone);
      if(form.email) linesMsg.push("Email: "+form.email);
      if(form.address) linesMsg.push("Address: "+form.address);
      if(form.city) linesMsg.push("City: "+form.city);
      if(form.state) linesMsg.push("State: "+form.state);
      if(form.payment) linesMsg.push("Payment: "+form.payment);
      if(form.date) linesMsg.push("Date: "+form.date);
      if(form.time) linesMsg.push("Time: "+form.time);
      if(form.notes) linesMsg.push("Notes: "+form.notes);
      if(form.message) linesMsg.push("Message: "+form.message);
    }
    linesMsg.push(isBook?"Please confirm availability. Thank you.":"Please confirm this order. Thank you.");
    return linesMsg.join("\\n");
  }

  function openWa(text){
    var num=wa();
    if(!num){alert("WhatsApp number not set on this site (body data-wa).");return;}
    window.open("https://wa.me/"+num+"?text="+encodeURIComponent(text),"_blank","noopener,noreferrer");
  }

  function checkout(form){
    if(!lines().length){
      alert(mode()==="booking"?"Add at least one service.":"Your cart is empty.");
      return;
    }
    openWa(buildOrderMessage(form||{}));
  }

  function bind(){
    document.querySelectorAll(".goke-add-cart").forEach(function(btn){
      if(btn.__goke) return; btn.__goke=true;
      if(!btn.getAttribute("data-label")) btn.setAttribute("data-label",btn.textContent||"");
      btn.addEventListener("click",function(e){e.preventDefault();addFromEl(btn);});
    });
    document.querySelectorAll(".goke-cart-checkout").forEach(function(btn){
      if(btn.__gokeC) return; btn.__gokeC=true;
      btn.addEventListener("click",function(e){e.preventDefault();checkout();});
    });
    var form=document.getElementById("goke-checkout-form")||document.getElementById("goke-cart-form");
    if(form&&!form.__gokeF){
      form.__gokeF=true;
      form.addEventListener("submit",function(e){
        e.preventDefault();
        var fd=new FormData(form), data={};
        fd.forEach(function(v,k){data[k]=String(v).trim();});
        if(!data.name||!data.phone){alert("Please enter name and phone.");return;}
        if(mode()==="commerce"&&form.id==="goke-checkout-form"&&!data.address){
          alert("Please enter a delivery address.");return;
        }
        if(mode()==="booking"&&(!data.date||!data.time)){
          alert("Please choose date and time.");return;
        }
        checkout(data);
      });
    }
    updateUI();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bind);
  else bind();
  window.addEventListener("goke:cart",updateUI);
})();
`;

export function ensureCommerceRuntime(js: string): string {
  if (js.includes("goke-checkout-form") && js.includes("goke_cart")) return js;
  return js.trim() + "\n" + COMMERCE_BOOKING_RUNTIME;
}

export const ensureCommerceBookingScript = ensureCommerceRuntime;
