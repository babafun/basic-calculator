/* trig.js — emits events to main calculator for trig operations */
(function(){
  const root = document.getElementById('panel-trig');
  if(!root) return;
  root.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button'); if(!btn) return;
    const op = btn.getAttribute('data-op');
    if(!op) return;
    const evnt = new CustomEvent('lc-panel', { detail: { op } });
    document.dispatchEvent(evnt);
  });
})();
