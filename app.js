/* LightningCalc - minimal calculator logic */
(() => {
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
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result = NaN;
    switch(operator){
      case 'add': result = a + b; break;
      case 'subtract': result = a - b; break;
      case 'multiply': result = a * b; break;
      case 'divide': result = b === 0 ? NaN : a / b; break;
    }
    if(!isFinite(result) || isNaN(result)){
      current = 'Error';
    } else {
      // format: trim to 10 significant digits
      current = String(parseFloat(result.toPrecision(10))).replace(/\.0+$/,'');
    }
    operator = null; previous = null; overwrite = true; updateDisplay();
  }

  

  // History and Theme helpers
  const historyKey = 'lightningcalc_history_v1';
  const themeKey = 'lightningcalc_theme_v1';
  const historyListEl = document.getElementById('historyList');
  const historyPanel = document.getElementById('historyPanel');
  const historyToggle = document.getElementById('historyToggle');
  const clearHistoryBtn = document.getElementById('clearHistory');
  const themeToggle = document.getElementById('themeToggle');

  function loadHistory(){
    try{
      const raw = localStorage.getItem(historyKey) || '[]';
      return JSON.parse(raw);
    }catch(e){ return []; }
  }

  function saveHistory(arr){ localStorage.setItem(historyKey, JSON.stringify(arr.slice(0,5))); }

  function renderHistory(){
    const items = loadHistory();
    historyListEl.innerHTML = '';
    items.forEach(it => {
      const li = document.createElement('li'); li.textContent = it; historyListEl.appendChild(li);
    });
  }

  function addToHistory(entry){
    const items = loadHistory(); items.unshift(entry); saveHistory(items); renderHistory();
  }

  function clearHistory(){ localStorage.removeItem(historyKey); renderHistory(); }

  // Theme
  function applyTheme(theme){
    if(theme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    if(themeToggle) themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    localStorage.setItem(themeKey, theme);
  }

  function loadTheme(){ return localStorage.getItem(themeKey) || 'dark'; }

  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const newTheme = document.documentElement.classList.contains('light') ? 'dark' : 'light';
      applyTheme(newTheme);
      themeToggle.textContent = newTheme === 'light' ? '☀️' : '🌙';
    });
  }

  if(historyToggle){
    historyToggle.addEventListener('click', ()=>{
      const expanded = historyToggle.getAttribute('aria-expanded') === 'true';
      historyToggle.setAttribute('aria-expanded', String(!expanded));
      historyPanel.setAttribute('aria-hidden', String(expanded));
    });
  }

  if(clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);

  // integrate history when compute runs successfully
  const originalCompute = compute;
  function computeWithHistory(){
    // keep previous/current/operator for history text
    const prev = previous; const op = operator; const cur = current;
    originalCompute();
    if(prev !== null && op !== null){
      const symbol = op === 'add' ? '+' : op === 'subtract' ? '-' : op === 'multiply' ? '×' : op === 'divide' ? '÷' : op;
      const entry = `${prev} ${symbol} ${cur} = ${current}`;
      addToHistory(entry);
    }
  }

  // replace compute references in handlers
  // update click handler mapping: if equals action call computeWithHistory
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

  // Keyboard: Enter should call computeWithHistory
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

  // Initialize UI state
  renderHistory();
  applyTheme(loadTheme());
  updateDisplay();
})();
