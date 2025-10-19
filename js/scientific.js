/* LightningCalc - scientific functions and main keypad */
(function(){
  const display = document.getElementById('sci-display');
  const adv = document.querySelector('.sci-advanced .controls');
  const main = document.querySelector('.sci-main-controls');
  if(!display || !adv || !main) return;

  let state = {
    display: '0',
    prev: null,
    op: null,
    waiting: false
  };

  function useDecimal(){ return typeof Decimal !== 'undefined'; }
  function d(v){ return useDecimal() ? new Decimal(v) : Number(v); }

  function update(){ display.textContent = state.display; }

  function inputDigit(dig){
    if(state.waiting){ state.display = String(dig); state.waiting = false; }
    else if(state.display === '0' && dig !== '.') state.display = String(dig);
    else if(dig === '.' && state.display.includes('.')) return;
    else state.display = state.display + String(dig);
    update();
  }

  function clearAll(){ state.display = '0'; state.prev = null; state.op = null; state.waiting = false; update(); }

  function applyOp(operator){
    const current = state.display;
    if(state.prev === null){ state.prev = current; state.op = operator; state.waiting = true; return; }

    // compute prev (op) current
    try{
      const a = d(state.prev);
      const b = d(current);
      let res;
      switch(state.op){
        case 'add': res = useDecimal() ? a.plus(b) : a + b; break;
        case 'subtract': res = useDecimal() ? a.minus(b) : a - b; break;
        case 'multiply': res = useDecimal() ? a.times(b) : a * b; break;
        case 'divide': res = useDecimal() ? a.div(b) : a / b; break;
        default: return;
      }
      // toString for Decimal, otherwise format
      state.display = useDecimal() ? res.toString() : String(res);
      state.prev = state.display; state.op = operator; state.waiting = true;
      update();
    }catch(e){ state.display = 'ERR'; update(); }
  }

  function equals(){
    if(state.op === null) return;
    try{
      const a = d(state.prev);
      const b = d(state.display);
      let res;
      switch(state.op){
        case 'add': res = useDecimal() ? a.plus(b) : a + b; break;
        case 'subtract': res = useDecimal() ? a.minus(b) : a - b; break;
        case 'multiply': res = useDecimal() ? a.times(b) : a * b; break;
        case 'divide': res = useDecimal() ? a.div(b) : a / b; break;
        case 'power':
          res = useDecimal() ? (a.pow ? a.pow(b) : new Decimal(Math.pow(Number(a), Number(b)))) : Math.pow(Number(a), Number(b));
          break;
        default: return;
      }
      state.display = useDecimal() ? res.toString() : String(res);
      state.prev = null; state.op = null; state.waiting = true; update();
    }catch(e){ state.display = 'ERR'; update(); }
  }

  // advanced unary ops using Decimal when available
  function applyUnary(fn){
    try{
      if(useDecimal()){ const val = new Decimal(state.display); const out = fn(val); state.display = out.toString(); }
      else { const x = Number(state.display); state.display = String(fn(x)); }
      update();
    }catch(e){ state.display = 'ERR'; update(); }
  }

  // wire main keypad
  main.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button'); if(!btn) return;
    const val = btn.getAttribute('data-value');
    const action = btn.getAttribute('data-action');
    if(val){ inputDigit(val); return; }
    if(action){
      switch(action){
        case 'clear': clearAll(); break;
        case 'equals': equals(); break;
        case 'divide': applyOp('divide'); break;
        case 'multiply': applyOp('multiply'); break;
        case 'subtract': applyOp('subtract'); break;
        case 'add': applyOp('add'); break;
      }
    }
  });

  // wire advanced controls (branch so we never reference Decimal when it's not present)
  adv.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button'); if(!btn) return;
    const txt = btn.textContent.trim();
    if(useDecimal()){
      switch(txt){
        case 'sin': applyUnary(v => (typeof Decimal.sin === 'function') ? Decimal.sin(v) : new Decimal(Math.sin(Number(v)))); break;
        case 'cos': applyUnary(v => (typeof Decimal.cos === 'function') ? Decimal.cos(v) : new Decimal(Math.cos(Number(v)))); break;
        case 'tan': applyUnary(v => (typeof Decimal.tan === 'function') ? Decimal.tan(v) : new Decimal(Math.tan(Number(v)))); break;
        case 'ln': applyUnary(v => (typeof Decimal.ln === 'function') ? Decimal.ln(v) : new Decimal(Math.log(Number(v)))); break;
        case 'log10': applyUnary(v => (typeof Decimal.log10 === 'function') ? Decimal.log10(v) : new Decimal(Math.log10(Number(v)))); break;
        case 'π': state.display = new Decimal(Math.PI).toString(); update(); break;
        case 'e': state.display = new Decimal(Math.E).toString(); update(); break;
        case '^': state.prev = state.display; state.op = 'power'; state.waiting = true; break;
        default: break;
      }
    } else {
      switch(txt){
        case 'sin': applyUnary(x => Math.sin(x)); break;
        case 'cos': applyUnary(x => Math.cos(x)); break;
        case 'tan': applyUnary(x => Math.tan(x)); break;
        case 'ln': applyUnary(x => Math.log(x)); break;
        case 'log10': applyUnary(x => Math.log10(x)); break;
        case 'π': state.display = String(Math.PI); update(); break;
        case 'e': state.display = String(Math.E); update(); break;
        case '^': state.prev = state.display; state.op = 'power'; state.waiting = true; break;
        default: break;
      }
    }
  });


  // initial render
  update();

})();
