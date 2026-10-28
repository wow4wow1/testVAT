// UI event wiring: filters, menu, dialogs, clicks
$('#warnBtn').onclick=e=>{const n=$('#note');n.hidden=!n.hidden;e.currentTarget.setAttribute('aria-expanded',!n.hidden)};
$('#q').oninput=e=>{st.q=e.target.value;st.page=1;render()};
$('#fBtn').onclick=()=>$('#fDlg').showModal();
const map={fy:'y',fm:'m',ft:'t',fj:'j'};
Object.keys(map).forEach(id=>$('#'+id).onchange=e=>{st[map[id]]=e.target.value;st.day='';st.page=1;render()});
$$('.ser').forEach(c=>c.onchange=()=>{st.ser=$$('.ser').filter(x=>x.checked).map(x=>x.value);st.page=1;render()});
$('#sort').onchange=e=>{const v=e.target.value,i=v.search(/-?1$/);st.sort=[v.slice(0,i),+v.slice(i)];st.page=1;render()};
$('#fOk').onclick=()=>$('#fDlg').close();$('#fClr').onclick=()=>{reset();render()};$('#cOk').onclick=()=>$('#cDlg').close();
$$('[data-col]').forEach(c=>c.onchange=()=>{st.cols[c.dataset.col]=c.checked?1:0;render()});
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
$$('.demo button').forEach(b=>b.onclick=()=>{$$('.demo button').forEach(x=>x.setAttribute('aria-pressed',x===b));load(()=>{st.state=b.dataset.s;render()})});
$('#menuBtn').onclick=e=>{e.stopPropagation();const o=$('#menu').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#menu').classList.remove('open')});
$('#menu').onclick=e=>{const a=e.target.dataset.a;if(!a)return;
  if(a==='out')logout();if(a==='print')print();if(a==='cols')$('#cDlg').showModal();if(a==='tags')toast('Etykiety — funkcja w przygotowaniu (demo)');
  if(a==='csv'){const r=st.state==='ok'?filtered():[];if(!r.length)return toast('Brak danych do eksportu');
    const csv=['Kontrahent;Data;Numer;KSeF;Identyfikator;Netto;VAT;Brutto',...r.map(x=>[x.c,x.d,x.n,x.k||'',x.id,x.net,vat(x),gross(x)].join(';'))].join('\n');
    const l=document.createElement('a');l.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));l.download='rejestr-vat.csv';l.click();toast('Wyeksportowano CSV')}};
document.addEventListener('click',e=>{
  const t=e.target;$('#menu').classList.remove('open');
  if(t.closest('#retry')){st.state='ok';$$('.demo button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.s==='ok'));load(render)}
  if(t.closest('#clr')){reset();render()}
  const x=t.closest('[data-x]');if(x){const k=x.dataset.x,d={y:'2026',m:'10',t:'',j:'',day:''};if(k==='ser')st.ser=['FV','KOR'];else st[k]=d[k];st.page=1;syncF();render()}
  const tb=t.closest('[data-t]');if(tb){st.tab=tb.dataset.t;st.page=1;st.sel.clear();render()}
  const dy=t.closest('[data-day]');if(dy){st.day=st.day===dy.dataset.day?'':dy.dataset.day;st.page=1;render()}
  if(t.closest('.days .t span:last-child')&&st.day){st.day='';render()}
  const av=t.closest('.av');if(av){toggleSel(av.closest('.it').dataset.id);render();return}
  const it=t.closest('.it');if(it)detail(it.dataset.id);
  const qk=t.closest('[data-q]');if(qk){const k=qk.dataset.q;st.quick=st.quick.includes(k)?st.quick.filter(x=>x!==k):[...st.quick,k];st.page=1;render()}
  if(t.closest('#selPage')){const rows=filtered(),f=(st.page-1)*st.per,pg=rows.slice(f,f+st.per),all=pg.every(r=>st.sel.has(r.id));pg.forEach(r=>all?st.sel.delete(r.id):st.sel.add(r.id));render()}
  if(t.closest('#selX')){st.sel.clear();render()}
  if(t.closest('#selCsv'))dl(selRows());
  if(t.closest('#selCopy'))navigator.clipboard?.writeText(selRows().map(r=>r.n).join('\n')).then(()=>toast('Skopiowano numery dokumentów'),()=>toast('Nie udało się skopiować'));
  const cpy=t.closest('[data-copy]');if(cpy)navigator.clipboard?.writeText(cpy.dataset.copy).then(()=>toast('Skopiowano: '+cpy.dataset.copy),()=>toast('Nie udało się skopiować'));
  const nv=t.closest('[data-nav]');if(nv&&!nv.disabled){const rows=filtered(),j=rows.findIndex(x=>x.id===st.cur)+ +nv.dataset.nav;if(rows[j])detail(rows[j].id)}
  if(t.closest('#dClose'))$('#dDlg').close();
  if(t.id==='prev'){st.page--;render()}if(t.id==='next'){st.page++;render()}
});
document.addEventListener('change',e=>{if(e.target.id==='per'){st.per=+e.target.value;st.page=1;render()}});

// Keyboard shortcuts
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.dataset&&e.target.dataset.copy){e.target.click();return}
  if($('#dDlg').open){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const b=$(`[data-nav="${e.key==='ArrowRight'?1:-1}"]`);b&&b.click()}return}
  const typing=/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName);
  if(document.querySelector('dialog[open]'))return;
  if(typing){if(e.key==='Escape'&&document.activeElement.id==='q')document.activeElement.blur();return}
  if(e.key==='/'){e.preventDefault();$('#q').focus();return}
  const items=$$('.it'),i=items.indexOf(document.activeElement);
  if(e.key==='j'||e.key==='k'){e.preventDefault();const n=items[i<0?0:Math.max(0,Math.min(items.length-1,i+(e.key==='j'?1:-1)))];n&&n.focus()}
  if(e.key==='x'&&i>=0){const id=items[i].dataset.id;toggleSel(id);render();const n=document.querySelector(`.it[data-id="${id}"]`);n&&n.focus()}
  if(e.key==='Escape'&&st.sel.size){st.sel.clear();render()}
});
