// Tiny helpers: DOM selectors, money format, escaping, toast, NIP validation
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN'}).format(n);
const hue=s=>[...s].reduce((a,c)=>a+c.charCodeAt(0),0)%360;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function validNip(raw){const n=raw.replace(/[\s-]/g,'');if(!/^\d{10}$/.test(n))return false;const w=[6,5,7,2,3,4,5,6,7],c=w.reduce((a,x,i)=>a+x*+n[i],0)%11;return c!==10&&c===+n[9]}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
