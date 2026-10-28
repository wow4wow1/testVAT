// Document detail drawer with copy actions and prev/next navigation
function detail(id){
  const rows=filtered(),i=rows.findIndex(x=>x.id===id),r=DATA[st.tab].find(x=>x.id===id);if(!r)return;st.cur=id;
  const cp=v=>`<b data-copy="${v}" title="Kliknij, aby skopiować" tabindex="0">${v}</b>`;
  $('#dBody').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem"><div><div class="org">${r.type==='KOR'?'Korekta':'Faktura'} · ${st.tab==='s'?'sprzedaż':'zakup'}${i>=0?` · ${i+1}/${rows.length}`:''}</div><h2>${r.c}</h2></div>
  <div style="display:flex;gap:.3rem"><button class="btn" data-nav="-1" aria-label="Poprzedni" ${i<1?'disabled':''}>‹</button><button class="btn" data-nav="1" aria-label="Następny" ${i<0||i>=rows.length-1?'disabled':''}>›</button><button class="btn" id="dClose" aria-label="Zamknij">✕</button></div></div>
  <div class="dtot"><span class="hl" style="margin:0">Brutto</span><b>${money(gross(r))}</b></div>
  <div class="dg"><div><span>Data</span><b>${r.d}</b></div><div><span>Numer dokumentu</span>${cp(r.n)}</div><div><span>Numer KSeF</span>${r.k?cp(r.k):'<b>Brak potwierdzenia</b>'}</div><div><span>Identyfikator</span>${cp(r.id)}</div><div><span>Kod JPK V7</span><b>${r.jpk}</b></div><div><span>Netto</span><b>${money(r.net)}</b></div><div><span>VAT ${r.rate==='np'?'(np)':r.rate+'%'}</span><b>${money(vat(r))}</b></div></div>`;
  if(!$('#dDlg').open)$('#dDlg').showModal();
}
