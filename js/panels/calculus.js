/* calculus.js — placeholder numeric calculus operations */
(function(){
  const root = document.getElementById('panel-calculus');
  if(!root) return;
  root.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button'); if(!btn) return;
    const op = btn.getAttribute('data-op');
    if(!op) return;
    document.dispatchEvent(new CustomEvent('lc-panel',{detail:{op}}));
  });
})();
