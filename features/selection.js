// Multi-select, selection bar, CSV export, saved view preferences
const selRows=()=>DATA[st.tab].filter(r=>st.sel.has(r.id));
function toggleSel(id){st.sel.has(id)?st.sel.delete(id):st.sel.add(id)}
function updateSel(){const r=selRows(),b=$('#selbar');b.hidden=!r.length;if(r.length)$('#selInfo').innerHTML=`<b>${r.length}</b> zazn. · Brutto <b>${money(r.reduce((a,x)=>a+gross(x),0))}</b>`;
  try{localStorage.setItem('vatview',JSON.stringify({tab:st.tab,sort:st.sort,per:st.per,cols:st.cols}))}catch{}}
function dl(rows){const csv=['Kontrahent;Data;Numer;KSeF;Identyfikator;Netto;VAT;Brutto',...rows.map(x=>[x.c,x.d,x.n,x.k||'',x.id,x.net,vat(x),gross(x)].join(';'))].join('\n');
  const l=document.createElement('a');l.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));l.download='rejestr-vat.csv';l.click()}
