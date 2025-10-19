/* scientific-main.js — orchestrates main calculator and panels via DOM events */
(function(){
  const displayEl = document.getElementById('sci-display');
  const mainControls = document.querySelector('.sci-main-controls');
  if(!displayEl || !mainControls) return;

  let state = { display: '0', prev: null, op: null, waiting: false, angleMode: 'rad' };

  function useDecimal(){ return typeof Decimal !== 'undefined'; }
+  function wrap(v){ return useDecimal() ? new Decimal(v) : Number(v); }

  function update(){ displayEl.textContent = state.display; }

  function inputDigit(d){
    if(state.waiting){ state.display = String(d); state.waiting = false; }
    else if(state.display === '0' && d !== '.') state.display = String(d);
    else if(d === '.' && state.display.includes('.')) return;
    else state.display = state.display + String(d);
    update();
  }

  function clearAll(){ state.display = '0'; state.prev = null; state.op = null; state.waiting = false; update(); }

  function computeOnce(op){
    if(state.prev === null){ state.prev = state.display; state.op = op; state.waiting = true; return; }
    try{
      const a = wrap(state.prev);
      const b = wrap(state.display);
      let r;
      switch(state.op){
        case 'add': r = useDecimal() ? a.plus(b) : a + b; break;
        case 'subtract': r = useDecimal() ? a.minus(b) : a - b; break;
        case 'multiply': r = useDecimal() ? a.times(b) : a * b; break;
        case 'divide': r = useDecimal() ? a.div(b) : a / b; break;
        case 'pow': r = useDecimal() ? (a.pow ? a.pow(b) : new Decimal(Math.pow(Number(a), Number(b)))) : Math.pow(Number(a), Number(b)); break;
        default: return;
      }
      state.display = useDecimal() ? r.toString() : String(r);
      state.prev = state.display; state.op = op; state.waiting = true; update();
    }catch(e){ state.display = 'ERR'; update(); }
  }

  function equals(){
    if(state.op === null) return;
    try{
      const a = wrap(state.prev);
      const b = wrap(state.display);
      let r;
      switch(state.op){
        case 'add': r = useDecimal() ? a.plus(b) : a + b; break;
        case 'subtract': r = useDecimal() ? a.minus(b) : a - b; break;
        case 'multiply': r = useDecimal() ? a.times(b) : a * b; break;
        case 'divide': r = useDecimal() ? a.div(b) : a / b; break;
        case 'pow': r = useDecimal() ? (a.pow ? a.pow(b) : new Decimal(Math.pow(Number(a), Number(b)))) : Math.pow(Number(a), Number(b)); break;
        default: return;
      }
      state.display = useDecimal() ? r.toString() : String(r);
      state.prev = null; state.op = null; state.waiting = true; update();
    }catch(e){ state.display = 'ERR'; update(); }
  }

  // main keypad
  mainControls.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button'); if(!btn) return;
    const val = btn.getAttribute('data-value');
    const action = btn.getAttribute('data-action');
    if(val){ inputDigit(val); return; }
    if(action){
      switch(action){
        case 'clear': clearAll(); break;
        case 'equals': equals(); break;
        case 'divide': computeOnce('divide'); break;
        case 'multiply': computeOnce('multiply'); break;
        case 'subtract': computeOnce('subtract'); break;
        case 'add': computeOnce('add'); break;
      }
    }
  });

  // panels communicate via CustomEvent 'lc-panel'
  document.addEventListener('lc-panel', (ev) => {
    const { detail } = ev;
    if(!detail || !detail.op) return;
    // some ops act directly on displayed value
    switch(detail.op){
      case 'sin': applyUnary((x)=> Math.sin(x)); break; // panels should send radians/degrees themselves
      case 'cos': applyUnary((x)=> Math.cos(x)); break;
      case 'tan': applyUnary((x)=> Math.tan(x)); break;
      case 'pi': state.display = useDecimal() ? new Decimal(Math.PI).toString() : String(Math.PI); update(); break;
      case 'e': state.display = useDecimal() ? new Decimal(Math.E).toString() : String(Math.E); update(); break;
      case 'square': state.display = useDecimal() ? wrap(state.display).pow(2).toString() : String(Math.pow(Number(state.display),2)); update(); break;
      case 'sqrt': state.display = useDecimal() ? wrap(state.display).sqrt().toString() : String(Math.sqrt(Number(state.display))); update(); break;
      case 'pow': state.prev = state.display; state.op = 'pow'; state.waiting = true; break;
      case 'percent': state.display = String(Number(state.display) / 100); update(); break;
      case 'deriv': /* numeric derivative placeholder */ applyNumericDerivative(); break;
      default: console.log('panel op', detail.op); break;
    }
  });

  function applyUnary(fn){
    try{
      if(useDecimal()){
        const v = new Decimal(state.display);
        const out = fn(Number(v));
        state.display = String(out);
      } else {
        const x = Number(state.display);
        state.display = String(fn(x));
      }
      update();
    }catch(e){ state.display = 'ERR'; update(); }
  }

  function applyNumericDerivative(){
    // simple numeric derivative f'(x) ≈ (f(x+h)-f(x-h))/(2h)
    // here we expect the user to provide a function via panels in future; placeholder returns 0
    state.display = '0'; update();
  }

  window.LCScientific = { state };

})();
