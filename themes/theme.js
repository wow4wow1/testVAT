// Light / dark theme toggle
const root=document.documentElement;
function setTheme(t,save){root.dataset.theme=t;if(save)try{localStorage.setItem('vattheme',t)}catch{}
  $$('#themeBtn,#themeBtn2').forEach(b=>{b.textContent=t==='dark'?'☀️':'🌙';b.setAttribute('aria-label',t==='dark'?'Włącz jasny motyw':'Włącz ciemny motyw')})}
setTheme(root.dataset.theme||'light');
$$('#themeBtn,#themeBtn2').forEach(b=>b.onclick=()=>setTheme(root.dataset.theme==='dark'?'light':'dark',true));
