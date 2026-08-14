const scenarios = [
  { question: 'Should guest checkout show tax before address?', context: 'Research and support disagree. Engineering is waiting on the disclosure rule before final QA can begin.', owner: 'Mina / Product', blocks: 'Copy · QA · Release', signal: '11 support tickets mention surprise tax', choice: 'Choose disclosure timing', ownerNode: 'Product signs the rule', proof: 'QA records final checkout', recommendation: 'Approve “estimated tax” before address, then show final tax after postcode.' },
  { question: 'Which first-run task should new teams complete?', context: 'The current tour explains six features but does not produce a useful result. Design needs one job to shape the first-run path.', owner: 'Theo / Growth', blocks: 'UX · Copy · Analytics', signal: '61% leave before inviting a teammate', choice: 'Choose the first useful outcome', ownerNode: 'Growth signs the sequence', proof: 'Analytics records completion', recommendation: 'Start with one teammate invite and defer workspace customization until the second session.' },
  { question: 'Does the annual plan lead with savings or certainty?', context: 'Pricing copy has two competing messages. Legal and design need a single hierarchy before the page can ship.', owner: 'Ari / Founder', blocks: 'Legal · Design · Experiment', signal: '5 of 8 interviews asked about commitment', choice: 'Choose the value hierarchy', ownerNode: 'Founder signs the promise', proof: 'Research records comprehension', recommendation: 'Lead with monthly flexibility; present annual savings as the secondary comparison.' }
];

const tabs = [...document.querySelectorAll('[data-scenario]')];
const $ = selector => document.querySelector(selector);
let active = 0;
let resolved = false;

function render(index) {
  active = index;
  resolved = false;
  const item = scenarios[index];
  tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
  $('#scenario-panel').setAttribute('aria-labelledby', `scenario-tab-${index}`);
  $('[data-question]').textContent = item.question;
  $('[data-context]').textContent = item.context;
  $('[data-owner]').textContent = item.owner;
  $('[data-blocks]').textContent = item.blocks;
  $('[data-signal]').textContent = item.signal;
  $('[data-choice]').textContent = item.choice;
  $('[data-owner-node]').textContent = item.ownerNode;
  $('[data-proof]').textContent = item.proof;
  $('[data-recommendation]').textContent = item.recommendation;
  $('[data-count]').textContent = '1';
  $('[data-status]').textContent = 'Needs decision';
  $('[data-sequence]').classList.remove('resolved');
  $('[data-resolve]').disabled = false;
  $('[data-resolve]').innerHTML = 'Resolve &amp; continue <span aria-hidden="true">→</span>';
  $('[data-message]').textContent = '';
}

tabs.forEach((tab, i) => tab.addEventListener('click', () => render(i)));
$('.scenario-tabs').addEventListener('keydown', event => {
  const current = tabs.indexOf(document.activeElement);
  if (current < 0 || !['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus(); render(next);
});

$('[data-resolve]').addEventListener('click', () => {
  if (resolved) return;
  resolved = true;
  $('[data-count]').textContent = '0';
  $('[data-status]').textContent = 'Resolved';
  $('[data-sequence]').classList.add('resolved');
  $('[data-resolve]').disabled = true;
  $('[data-resolve]').textContent = 'Decision recorded';
  $('[data-message]').textContent = 'Decision recorded locally. The next dependency is now ready; nothing was transmitted.';
  const event = document.createElement('li');
  event.className = 'new';
  event.innerHTML = `<time>NOW</time><div><strong>Decision resolved</strong><p>${scenarios[active].owner} · local demo event</p></div>`;
  $('[data-log]').prepend(event);
  $('[data-proof-count]').textContent = '5 events';
  $('[data-active-node]').focus({ preventScroll: true });
});

const dialog = $('[data-command-dialog]');
$('[data-command]').addEventListener('click', () => dialog.showModal());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => dialog.close()));
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); dialog.open ? dialog.close() : dialog.showModal(); }
});
