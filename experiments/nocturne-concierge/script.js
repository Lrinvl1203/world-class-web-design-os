const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress = document.querySelector('.progress span');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const motionTargets = [...document.querySelectorAll('.hero .reveal, .inside-head.reveal, .place-stage.reveal, .closing-grid .reveal')];
if (!prefersReduced && 'IntersectionObserver' in window && Element.prototype.animate) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 720, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' }
        );
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  motionTargets.forEach(el => io.observe(el));
}

const panel = document.querySelector('.today-panel');
const scrim = document.querySelector('.panel-scrim');
const openButton = document.querySelector('[data-panel-trigger]');
const closeButton = document.querySelector('.panel-close');
let lastFocused = null;

function setPanel(open) {
  if (open) lastFocused = document.activeElement;
  panel.inert = !open;
  panel.setAttribute('aria-hidden', String(!open));
  openButton.setAttribute('aria-expanded', String(open));
  openButton.querySelector('[aria-hidden]').textContent = open ? '−' : '+';
  scrim.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) closeButton.focus();
  else if (lastFocused) lastFocused.focus();
}
openButton.addEventListener('click', () => setPanel(true));
closeButton.addEventListener('click', () => setPanel(false));
scrim.addEventListener('click', () => setPanel(false));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') setPanel(false);
});

const arrivalData = {
  door: {
    label: 'STREET / 01',
    title: 'Find the terracotta door.',
    copy: '편의점 맞은편, 조명이 들어온 벽돌 문이 첫 번째 표식입니다.',
    time: '07 SEC',
    meta: 'STREET → DOOR',
    progress: '0%'
  },
  floor: {
    label: 'BUILDING / 02',
    title: 'Third floor, then turn right.',
    copy: '엘리베이터에서 내리면 바닥의 작은 N°24 표식이 방 방향을 가리킵니다.',
    time: '18 SEC',
    meta: 'DOOR → 3F',
    progress: '50%'
  },
  room: {
    label: 'ROOM / 03',
    title: '302 is the number with light.',
    copy: '키패드를 손으로 가린 뒤 안내받은 6자리를 입력하고, 마지막에 잠금 표시를 누르세요.',
    time: '32 SEC',
    meta: '3F → ROOM',
    progress: '100%'
  }
};
const arrivalPreview = document.querySelector('.arrival-preview');
const arrivalButtons = [...document.querySelectorAll('[data-arrival]')];
const arrivalPoints = [...document.querySelectorAll('.route-point')];
const arrivalLabel = document.querySelector('[data-arrival-label]');
const arrivalTitle = document.querySelector('[data-arrival-title]');
const arrivalCopy = document.querySelector('[data-arrival-copy]');
const arrivalTime = document.querySelector('[data-arrival-time]');
const arrivalMeta = document.querySelector('[data-arrival-meta]');

function selectArrival(key, source) {
  const data = arrivalData[key];
  if (!data) return;
  const index = arrivalButtons.indexOf(source);
  arrivalPreview.dataset.arrivalStage = key;
  arrivalPreview.querySelector('.arrival-route').style.setProperty('--route-progress', data.progress);
  arrivalLabel.textContent = data.label;
  arrivalTitle.textContent = data.title;
  arrivalCopy.textContent = data.copy;
  arrivalTime.textContent = data.time;
  arrivalMeta.textContent = data.meta;
  arrivalButtons.forEach(button => button.setAttribute('aria-pressed', String(button === source)));
  arrivalPoints.forEach((point, pointIndex) => point.classList.toggle('is-active', pointIndex <= index));

  if (!prefersReduced && arrivalPreview.animate) {
    arrivalPreview.animate(
      [{ opacity: .72, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' }
    );
  }
}
arrivalButtons.forEach(button => button.addEventListener('click', () => selectArrival(button.dataset.arrival, button)));


const guideData = {
  heating: { label: 'MOST USED / NIGHT', title: '“보일러가<br>조금 추워요.”', copy: '현재 화면에서 바로 온도 설정 순서와 가장 편안한 권장 범위를 확인합니다.' },
  wifi: { label: 'FASTEST TASK / 10 SEC', title: 'Wi‑Fi,<br>without typing.', copy: '네트워크와 비밀번호를 크게 보여주고, 지원 환경에서는 한 번에 복사할 수 있도록 안내합니다.' },
  air: { label: 'COMFORT / ROOM', title: 'Cool the room,<br>not the night.', copy: '냉방·제습·수면 모드의 차이를 짧게 설명하고 추천 온도를 먼저 제시합니다.' },
  waste: { label: 'BEFORE YOU GO', title: 'Sort less.<br>Know exactly.', copy: '일반 쓰레기와 재활용 위치를 사진 없이도 이해할 수 있는 순서로 단순화합니다.' },
  checkout: { label: 'LAST 3 MINUTES', title: 'Leave easy.<br>Three things.', copy: '창문, 조명, 도어락. 퇴실 전에 필요한 세 가지 행동만 마지막 체크리스트로 보여줍니다.' }
};
const guideFeature = document.querySelector('.guide-feature');
const guideLabel = document.querySelector('[data-guide-label]');
const guideTitle = document.querySelector('[data-guide-title]');
const guideCopy = document.querySelector('[data-guide-copy]');
const guideButtons = [...document.querySelectorAll('.guide-row[data-guide]')];
function selectGuide(key, source) {
  const data = guideData[key];
  if (!data) return;
  const swap = () => {
    guideLabel.textContent = data.label;
    guideTitle.innerHTML = data.title;
    guideCopy.textContent = data.copy;
    guideButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn === source)));
  };
  if (prefersReduced || !guideFeature.animate) { swap(); return; }
  const out = guideFeature.animate([{opacity:1, transform:'translateY(0)'},{opacity:.5, transform:'translateY(6px)'}], {duration:120, easing:'ease-out'});
  out.onfinish = () => {
    swap();
    guideFeature.animate([{opacity:.5, transform:'translateY(6px)'},{opacity:1, transform:'translateY(0)'}], {duration:240, easing:'cubic-bezier(.2,.7,.2,1)'});
  };
}
document.querySelectorAll('[data-guide]').forEach(btn => btn.addEventListener('click', () => selectGuide(btn.dataset.guide, btn.classList.contains('guide-row') ? btn : null)));

function getFocusable(container) {
  return [...container.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')];
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Tab' || panel.getAttribute('aria-hidden') !== 'false') return;
  const items = getFocusable(panel);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
