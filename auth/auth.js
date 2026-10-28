// Demo login and registration (validation, password strength, demo account, logout)
const AK='vatusers',SK='vatsession',EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;let mem=null;
const users=()=>{try{return JSON.parse(localStorage.getItem(AK)||'[]')}catch{return[]}};
const sha=async s=>window.crypto&&crypto.subtle?[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join(''):btoa(unescape(encodeURIComponent(s)));
const sess=()=>{if(mem)return mem;try{return JSON.parse(sessionStorage.getItem(SK)||localStorage.getItem(SK)||'null')}catch{return null}};
function applyAuth(){const u=sess();document.body.classList.toggle('locked',!u);if(u)$('#who').innerHTML=`<b>${esc(u.name)}</b><br><span>${esc(u.email)}</span>`}
function login(u,remember){mem=u;try{sessionStorage.removeItem(SK);localStorage.removeItem(SK);(remember?localStorage:sessionStorage).setItem(SK,JSON.stringify(u))}catch{}applyAuth();render();toast('Witaj, '+u.name.split(' ')[0]+'!')}
function logout(){mem=null;try{sessionStorage.removeItem(SK);localStorage.removeItem(SK)}catch{}st.sel.clear();applyAuth();toast('Wylogowano')}
function fe(id,msg){const i=$('#'+id),e=$('#'+id+'-e');if(e)e.textContent=msg||'';msg?i.setAttribute('aria-invalid','true'):i.removeAttribute('aria-invalid');return !msg}
function busy(b,on){b.dataset.l=b.dataset.l||b.textContent;b.disabled=on;b.textContent=on?'Chwileczkę…':b.dataset.l}
function strength(p){let s=0;if(p.length>=8)s++;if(/[A-Z]/.test(p)&&/[a-z]/.test(p))s++;if(/\d/.test(p))s++;if(/[^A-Za-z0-9]/.test(p)||p.length>=12)s++;return s}
$$('[data-au]').forEach(b=>b.onclick=()=>{const up=b.dataset.au==='up';
  $$('[data-au]').forEach(x=>x.setAttribute('aria-selected',x===b));$('#fIn').hidden=up;$('#fUp').hidden=!up;
  $$('#auth input').forEach(i=>i.removeAttribute('aria-invalid'));$$('#auth .err,#auth .formerr').forEach(e=>e.textContent='');
  $(up?'#upName':'#inEmail').focus()});
$$('.eye').forEach(b=>b.onclick=()=>{const i=b.previousElementSibling;i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'Pokaż':'Ukryj'});
$$('#auth input').forEach(i=>i.addEventListener('input',()=>{const e=$('#'+i.id+'-e');if(e)e.textContent='';i.removeAttribute('aria-invalid')}));
$('#upPw').addEventListener('input',e=>{const s=strength(e.target.value);$('#mBar').style.width=(e.target.value?Math.max(s,1)*25:0)+'%';$('#mBar').style.background=['#e05a4b','#e05a4b','#e0a21b','#7fbf3f','#1f9d6b'][s];$('#mTxt').textContent=e.target.value?['Za słabe','Słabe','Średnie','Dobre','Mocne'][s]:'Min. 8 znaków, cyfra i wielka litera'});
$('#forgot').onclick=()=>{const em=$('#inEmail').value.trim();if(fe('inEmail',EMAIL.test(em)?'':'Podaj e-mail, na który wyślemy link.'))toast('Link do resetu hasła wysłany (demo)')};
$('#demoGo').onclick=()=>login({name:'Preview Reviewer',email:'demo@onsaldo.pl'},false);
$('#fIn').onsubmit=async e=>{e.preventDefault();$('#inErr').textContent='';
  const em=$('#inEmail').value.trim().toLowerCase(),pw=$('#inPw').value;
  if(![fe('inEmail',EMAIL.test(em)?'':'Podaj poprawny adres e-mail.'),fe('inPw',pw?'':'Podaj hasło.')].every(Boolean))return;
  const b=$('#inGo');busy(b,true);await wait(700);
  const u=users().find(x=>x.email===em);
  if(!u||u.h!==await sha(pw)){busy(b,false);$('#inErr').textContent='Nieprawidłowy e-mail lub hasło. Spróbuj ponownie lub załóż konto.';return}
  busy(b,false);login({name:u.name,email:u.email},$('#inRem').checked)};
$('#fUp').onsubmit=async e=>{e.preventDefault();$('#upErr').textContent='';
  const name=$('#upName').value.trim(),em=$('#upEmail').value.trim().toLowerCase(),nip=$('#upNip').value,pw=$('#upPw').value;
  const r=[fe('upName',name.length>=3&&name.includes(' ')?'':'Podaj imię i nazwisko.'),
    fe('upEmail',EMAIL.test(em)?'':'Podaj poprawny adres e-mail.'),
    fe('upNip',validNip(nip)?'':'Nieprawidłowy NIP — sprawdź cyfry.'),
    fe('upPw',pw.length>=8&&/\d/.test(pw)&&/[A-Z]/.test(pw)?'':'Min. 8 znaków, cyfra i wielka litera.'),
    fe('upPw2',$('#upPw2').value===pw&&pw?'':'Hasła muszą być takie same.'),
    fe('upTerms',$('#upTerms').checked?'':'Zaakceptuj regulamin, aby kontynuować.')];
  if(!r.every(Boolean)){const f=$$('#fUp [aria-invalid=true]')[0];f&&f.focus();return}
  if(users().some(x=>x.email===em)){fe('upEmail','Konto z tym adresem już istnieje. Zaloguj się.');$('#upEmail').focus();return}
  const b=$('#upGo');busy(b,true);await wait(800);
  try{localStorage.setItem(AK,JSON.stringify([...users(),{name,email:em,nip:nip.replace(/\D/g,''),h:await sha(pw)}]))}
  catch{busy(b,false);$('#upErr').textContent='Nie można zapisać konta w tej przeglądarce.';return}
  busy(b,false);login({name,email:em},true)};
