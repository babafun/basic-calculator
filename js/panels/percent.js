/* percent.js */
(function(){
  const root = document.getElementById('panel-percent');
  if(!root) return;
  root.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button'); if(!btn) return;
    const op = btn.getAttribute('data-op');
    if(!op) return;
    document.dispatchEvent(new CustomEvent('lc-panel',{detail:{op}}));
  });
})();
