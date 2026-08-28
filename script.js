const $ = (id) => document.getElementById(id);
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
const number = (value) => Number.parseFloat(value) || 0;

function calculate(principal, rate, time, unit = 'years') {
  const years = unit === 'months' ? time / 12 : time;
  const interest = principal * (rate / 100) * years;
  return { interest, total: principal + interest, years };
}

function updateMain() {
  const principal = number($('principal').value);
  const rate = number($('rate').value);
  const time = number($('time').value);
  const unit = $('unit').value;
  const result = calculate(principal, rate, time, unit);
  const percent = principal ? result.interest / principal * 100 : 0;

  $('total').textContent = money(result.total);
  $('interest').textContent = money(result.interest);
  $('legend-principal').textContent = money(principal);
  $('legend-interest').textContent = money(result.interest);
  $('growth').textContent = `+${percent.toFixed(1)}%`;
  $('formula-values').textContent = `${money(principal)} × ${rate}% × ${time} ${unit}`;
  $('period-label').textContent = `${time} ${unit}`;
  $('donut').style.background = `conic-gradient(var(--mint) 0deg ${principal + result.interest ? principal / result.total * 360 : 0}deg, var(--coral) ${principal + result.interest ? principal / result.total * 360 : 0}deg 360deg)`;
  renderBars(principal, rate, result.years);
  $('insight').textContent = result.interest > 0 ? `At this rate, your money earns ${money(result.interest / Math.max(result.years, 1))} per year.` : 'Add a rate and time period to see your money grow.';
}

function renderBars(principal, rate, years) {
  const bars = $('bars');
  bars.innerHTML = '';
  const count = Math.min(Math.max(Math.ceil(years), 1), 8);
  const finalBalance = principal * (1 + rate / 100 * years);
  for (let index = 0; index <= count; index += 1) {
    const elapsed = years * index / count;
    const balance = principal * (1 + rate / 100 * elapsed);
    const height = finalBalance ? Math.max(8, balance / finalBalance * 92) : 8;
    const group = document.createElement('div');
    group.className = 'bar-group';
    group.innerHTML = `<div class="bar" style="height:${height}%" title="${money(balance)}"></div><span class="bar-label">${index === 0 ? 'now' : `${Math.round(elapsed)}y`}</span>`;
    bars.appendChild(group);
  }
}

function updateCompare() {
  const principal = number($('principal').value);
  const scenarios = [{ key: 'a', rate: number($('rate-a').value), time: number($('time-a').value) }, { key: 'b', rate: number($('rate-b').value), time: number($('time-b').value) }];
  scenarios.forEach(({ key, rate, time }) => {
    const result = calculate(principal, rate, time);
    $(`total-${key}`).textContent = money(result.total);
    $(`interest-${key}`).textContent = `${money(result.interest)} interest`;
  });
  const difference = calculate(principal, scenarios[1].rate, scenarios[1].time).interest - calculate(principal, scenarios[0].rate, scenarios[0].time).interest;
  const winner = difference >= 0 ? 'B' : 'A';
  $('compare-insight').innerHTML = `Scenario ${winner} earns <strong>${money(Math.abs(difference))} more</strong> over the same starting principal.`;
}

['principal', 'rate', 'time', 'unit'].forEach((id) => $(id).addEventListener('input', () => { updateMain(); updateCompare(); }));
['rate-a', 'time-a', 'rate-b', 'time-b'].forEach((id) => $(id).addEventListener('input', updateCompare));
document.querySelectorAll('.preset').forEach((button) => button.addEventListener('click', () => {
  $('principal').value = button.dataset.principal;
  $('rate').value = button.dataset.rate;
  $('time').value = button.dataset.time;
  $('unit').value = 'years';
  updateMain(); updateCompare();
}));
document.querySelectorAll('.mode').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.mode').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  $('compare-section').hidden = button.dataset.mode !== 'compare';
}));
$('copy-button').addEventListener('click', async () => {
  const text = `Interest projection: ${money(number($('principal').value))} at ${number($('rate').value)}% for ${number($('time').value)} ${$('unit').value} = ${$('total').textContent} total (${ $('interest').textContent } interest).`;
  try { await navigator.clipboard.writeText(text); $('copy-status').textContent = 'Summary copied'; } catch { $('copy-status').textContent = text; }
  window.setTimeout(() => { $('copy-status').textContent = ''; }, 2500);
});
updateMain();
updateCompare();
