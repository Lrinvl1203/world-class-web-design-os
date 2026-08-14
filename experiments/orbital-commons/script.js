const scenarios = [
  { temp: 37.8, shade: 11, delta: 0, result: 'The school block is 2.1° hotter than the modeled ward median.', deltaCopy: 'Baseline field. No modeled cooling intervention is active.', equity: 'The current field leaves the school and transit edge above the ward median.', seed: 0 },
  { temp: 34.6, shade: 28, delta: -3.2, result: 'Tree corridors cool the school route first, but the market lane remains exposed.', deltaCopy: 'Modeled mean surface-temperature change from the illustrative baseline.', equity: 'Shade improves on the school route; the market lane still sits 2.2° above the new median.', seed: 1 },
  { temp: 32.9, shade: 41, delta: -4.9, result: 'Cool roofs and trees distribute benefit most evenly across all three focus blocks.', deltaCopy: 'Modeled mean surface-temperature change from the illustrative baseline.', equity: 'All three focus blocks move within 1.6° of the new ward median in this scenario.', seed: 2 }
];

const canvas = document.querySelector('[data-field-canvas]');
const context = canvas.getContext('2d', { alpha: false });
const buttons = [...document.querySelectorAll('[data-scenario]')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let current = 0;
let from = 0;
let target = 0;
let started = 0;
let frame = 0;

function valueAt(x, y, scenario) {
  const base = 0.18 + ((x * 13 + y * 7) % 9) / 20;
  if (scenario === 0) return base;
  const corridor = Math.max(0, 1 - Math.abs(x - (y * .45 + 1.2)) / 2.2);
  const roof = ((x + y) % 3 === 0 ? .45 : .12);
  return Math.min(1, base + corridor * (scenario === 1 ? .38 : .28) + (scenario === 2 ? roof : 0));
}

function mix(a, b, t) { return a + (b - a) * t; }
function color(t) {
  const stops = [[159,243,195],[245,210,96],[255,118,87]];
  const scaled = Math.max(0, Math.min(.999, 1 - t)) * 2;
  const i = Math.floor(scaled); const p = scaled - i;
  return `rgb(${stops[i].map((v, c) => Math.round(mix(v, stops[i + 1][c], p))).join(',')})`;
}

function polygon(points, fill, stroke = '#18302f') {
  context.beginPath(); points.forEach(([x,y], i) => i ? context.lineTo(x,y) : context.moveTo(x,y)); context.closePath(); context.fillStyle = fill; context.fill(); context.strokeStyle = stroke; context.lineWidth = 1; context.stroke();
}

function draw(progress = 1) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  context.setTransform(dpr,0,0,dpr,0,0);
  context.fillStyle = '#0c1718'; context.fillRect(0,0,rect.width,rect.height);
  const mobile = rect.width < 720;
  const cols = mobile ? 5 : 7; const rows = mobile ? 7 : 6;
  const cellW = Math.min(mobile ? 78 : 108, rect.width / (mobile ? 5.7 : 8.8));
  const cellH = cellW * .45; const depth = mobile ? 78 : 130;
  const originX = mobile ? rect.width * .50 : rect.width * .64;
  const originY = mobile ? rect.height * .20 : rect.height * .28;
  const items = [];
  for (let y=0;y<rows;y++) for(let x=0;x<cols;x++) {
    const a = valueAt(x,y,from); const b = valueAt(x,y,target); const v = mix(a,b,progress);
    items.push({x,y,v,baseX:originX+(x-y)*cellW*.5,baseY:originY+(x+y)*cellH*.5});
  }
  items.sort((a,b)=>(a.x+a.y)-(b.x+b.y)).forEach(item => {
    const h = 10 + item.v * depth; const x=item.baseX,y=item.baseY;
    polygon([[x,y-h],[x+cellW/2,y+cellH/2-h],[x,y+cellH-h],[x-cellW/2,y+cellH/2-h]], color(item.v));
    polygon([[x-cellW/2,y+cellH/2-h],[x,y+cellH-h],[x,y+cellH],[x-cellW/2,y+cellH/2]], '#173331');
    polygon([[x,y+cellH-h],[x+cellW/2,y+cellH/2-h],[x+cellW/2,y+cellH/2],[x,y+cellH]], '#102725');
  });
  context.fillStyle = '#8da19a'; context.font = '9px monospace'; context.fillText('HEIGHT / COOLING BENEFIT', 20, rect.height - 24);
}

function animate(time) {
  const p = reduced ? 1 : Math.min(1, (time - started) / 550);
  const eased = 1 - Math.pow(1 - p, 3);
  draw(eased);
  if (p < 1) frame = requestAnimationFrame(animate); else { current = target; from = target; }
}

function select(index) {
  cancelAnimationFrame(frame); from = current; target = index; started = performance.now();
  buttons.forEach((button,i) => button.setAttribute('aria-pressed', String(i === index)));
  document.querySelector('[data-result]').innerHTML = `<span>${index === 0 ? 'CURRENT' : `SCENARIO 0${index + 1}`} /</span> ${scenarios[index].result}`;
  document.querySelector('[data-hero-temp]').textContent = `${scenarios[index].temp.toFixed(1)}°`;
  document.querySelector('[data-delta]').textContent = `${scenarios[index].delta.toFixed(1)}°`;
  document.querySelector('[data-delta-copy]').textContent = scenarios[index].deltaCopy;
  document.querySelector('[data-equity]').innerHTML = `<b>Equity note:</b> ${scenarios[index].equity}`;
  document.querySelectorAll('[data-row]').forEach((row,i) => i === index ? row.setAttribute('aria-current','true') : row.removeAttribute('aria-current'));
  frame = requestAnimationFrame(animate);
}

buttons.forEach((button,index) => button.addEventListener('click', () => select(index)));
new ResizeObserver(() => draw(1)).observe(canvas);
document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(frame); else draw(1); });
draw(1);
