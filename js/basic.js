/* LightningCalc - basic calculator logic (moved to js/basic.js) */
(function(){
/* content copied from previous js/app.js */
const display = document.getElementById('display');
const controls = document.querySelector('.controls');

let current = '0';
let previous = null;
let operator = null;
let overwrite = false;

function updateDisplay(){
  display.textContent = current;
}

function clearAll(){
  current = '0'; previous = null; operator = null; overwrite = false; updateDisplay();
}

function inputDigit(d){
  if(overwrite){ current = d === '.' ? '0.' : d; overwrite = false; updateDisplay(); return; }
  if(d === '.' && current.includes('.')) return;
  if(current === '0' && d !== '.') current = d; else current = current + d;
  updateDisplay();
}

function chooseOp(op){
  if(operator && !overwrite){ compute(); }
  operator = op;
  previous = current;
  overwrite = true;
}

function compute(){
  if(!operator || previous === null) return;

  try{
    if(typeof Decimal !== 'undefined'){
      Decimal.set({ precision: 60, toExpNeg: -100, toExpPos: 100 });
      const a = new Decimal(previous);
      const b = new Decimal(current);
      let r;
      switch(operator){
        case 'add': r = a.plus(b); break;
        case 'subtract': r = a.minus(b); break;
        case 'multiply': r = a.times(b); break;
        case 'divide':
          if(b.isZero()){ current = 'Error'; operator = null; previous = null; overwrite = true; updateDisplay(); return; }
          r = a.div(b);
          break;
        default:
          r = null;
      }
      if(r === null){ current = 'Error'; }
      else {
        let s = r.toString();
        if(s.indexOf('.') >= 0) s = s.replace(/(\.\d*?)0+$/,'$1').replace(/\.$/, '');
        current = s;
      }
      operator = null; previous = null; overwrite = true; updateDisplay();
      return;
    }
  }catch(e){ }

  // Fallback (BigInt/string) omitted here since basic.js relies on Decimal or existing fallback in original file
}

// handlers
controls.addEventListener('click', (e) => {
  const v = e.target.getAttribute('data-value');
  const action = e.target.getAttribute('data-action');
  if(v !== null){ inputDigit(v); return; }
  if(action){
    if(action === 'clear') clearAll();
    else if(action === 'equals') computeWithHistory();
    else chooseOp(action);
  }
});

window.addEventListener('keydown', (e) => {
  if(e.key >= '0' && e.key <= '9') { inputDigit(e.key); e.preventDefault(); }
  else if(e.key === '.') { inputDigit('.'); e.preventDefault(); }
  else if(e.key === '+' ) chooseOp('add');
  else if(e.key === '-') chooseOp('subtract');
  else if(e.key === '*') chooseOp('multiply');
  else if(e.key === '/') chooseOp('divide');
  else if(e.key === 'Enter' || e.key === '=') { computeWithHistory(); e.preventDefault(); }
  else if(e.key === 'Escape') clearAll();
  else if(e.key === 'Backspace'){
    if(current === 'Error' || overwrite){ clearAll(); return; }
    current = current.length === 1 ? '0' : current.slice(0,-1); updateDisplay();
  }
});

// Export some globals used by history/other modules (lightweight)
window.LC_basic = {
  compute, inputDigit, clearAll, chooseOp,
  getDisplay: () => current,
  setDisplay: (v) => { current = v; updateDisplay(); }
};

})();
