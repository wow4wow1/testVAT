// Applies the saved (or system) theme before first paint to avoid a flash
try{document.documentElement.dataset.theme=localStorage.getItem("vattheme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light")}catch(e){document.documentElement.dataset.theme="light"}
