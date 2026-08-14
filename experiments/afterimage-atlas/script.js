const editions = [
  { index: 'EDITION 01 / SOURCE', title: 'The request is still whole.', copy: 'The first edition uses scale as a public voice. Its sentence, authorship line, and open margin arrive together.', loss: 'None recorded', gain: 'Collective scale', word: 'STAY\nVISIBLE', small: 'A street belongs to the people who can still be seen in it.' },
  { index: 'EDITION 02 / PHOTOCOPY', title: 'Noise becomes evidence.', copy: 'Cheap duplication flattens the colors and adds a mechanical grain. The image loses material nuance but becomes easier to distribute.', loss: 'Ink separation', gain: 'Rapid circulation', word: 'STAY\nVISIBLE', small: 'A street belongs to the people who can still be seen in it.' },
  { index: 'EDITION 03 / TRANSLATION', title: 'The audience enters the sentence.', copy: 'A local translation changes line length and emphasis. Meaning expands, but the original cadence can no longer stay untouched.', loss: 'Original cadence', gain: 'A second public', word: '계속\n보이기', small: '거리는 그 안에서 보일 수 있는 사람들의 것이다.' },
  { index: 'EDITION 04 / CROP', title: 'Urgency wins; context leaves.', copy: 'The close crop raises the command until it fills the frame. The source line and civic claim fall outside the new edge.', loss: 'Source and place', gain: 'Immediate force', word: 'STAY\nVISIBLE', small: 'Source line beyond frame.' },
  { index: 'EDITION 05 / FEED', title: 'The wall fits inside a hand.', copy: 'A square feed compresses public scale into private viewing. The poster gains velocity while its physical distance disappears.', loss: 'Body-scale encounter', gain: 'Network velocity', word: 'STAY\nVISIBLE', small: 'Shared 18,404 times / origin attached.' }
];

const poster = document.querySelector('[data-poster]');
const tabs = [...document.querySelectorAll('[data-edition]')];

function selectEdition(index, focusPanel = false) {
  const item = editions[index];
  tabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.querySelector('#edition-note').setAttribute('aria-labelledby', `edition-tab-${index}`);
  document.querySelector('[data-note-index]').textContent = item.index;
  document.querySelector('[data-note-title]').textContent = item.title;
  document.querySelector('[data-note-copy]').textContent = item.copy;
  document.querySelector('[data-loss]').textContent = item.loss;
  document.querySelector('[data-gain]').textContent = item.gain;
  document.querySelector('[data-poster-word]').textContent = item.word;
  document.querySelector('[data-poster-small]').textContent = item.small;
  poster.dataset.state = String(index);
  if (focusPanel) document.querySelector('#edition-note').focus({ preventScroll: true });
}

tabs.forEach((tab, index) => tab.addEventListener('click', () => selectEdition(index)));
document.querySelector('.edition-tabs').addEventListener('keydown', event => {
  const current = tabs.indexOf(document.activeElement);
  if (current < 0 || !['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus();
  selectEdition(next);
});
