// theme.js — centralizes theme logic for LightningCalc
(function(){
  const themeKey = 'lightningcalc_theme_v1';
  const root = document.documentElement;
  function applyTheme(t){
    if(t === 'light') root.classList.add('light'); else root.classList.remove('light');
    localStorage.setItem(themeKey, t);
  }
  function load(){
    const saved = localStorage.getItem(themeKey) || 'dark';
    applyTheme(saved);
  }
  window.LCTheme = { applyTheme, load };
  document.addEventListener('DOMContentLoaded', load);
})();
